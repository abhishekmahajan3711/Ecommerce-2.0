import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// POST /api/orders - Create a new order from user's cart
export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { billingAddress } = req.body;

    if (!billingAddress) {
      return res.status(400).json({ success: false, message: 'Billing address is required' });
    }

    // Load user's cart
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // Build order items from cart
    const orderItems = cart.items.map(item => {
      const product = item.product || {};
      return {
        product: product._id,
        name: product.name || 'Unknown Product',
        price: item.price,
        quantity: item.quantity,
        image: product.mainImage || (product.images && product.images[0]) || '',
        sku: product.sku || ''
      };
    });

    const subtotal = cart.total || 0;
    const tax = 0;
    const shippingCost = 0;
    const total = subtotal + tax + shippingCost;

    // Use billing address for shipping if shipping not provided
    const shippingAddressFrom = billingAddress || req.user?.address || {};

    const order = new Order({
      user: userId,
      items: orderItems,
      billingAddress: {
        name: billingAddress.name || req.user.name || '',
        phone: billingAddress.phone || req.user.phone || '',
        street: billingAddress.street || '',
        city: billingAddress.city || '',
        state: billingAddress.state || '',
        zipCode: billingAddress.zipCode || '',
        country: billingAddress.country || 'USA'
      },
      shippingAddress: {
        name: shippingAddressFrom.name || req.user.name || '',
        phone: shippingAddressFrom.phone || req.user.phone || '',
        street: shippingAddressFrom.street || billingAddress.street || '',
        city: shippingAddressFrom.city || billingAddress.city || '',
        state: shippingAddressFrom.state || billingAddress.state || '',
        zipCode: shippingAddressFrom.zipCode || billingAddress.zipCode || '',
        country: shippingAddressFrom.country || billingAddress.country || 'USA'
      },
      // use an allowed enum value for paymentMethod
      paymentMethod: 'stripe',
      paymentStatus: 'completed',
      subtotal,
      tax,
      shippingCost,
      discount: 0,
      total
    });

    // Ensure orderNumber is generated (schema pre-save should handle it,
    // but set it deterministically here to avoid validation failures).
    if (!order.orderNumber) {
      const date = new Date();
      const year = date.getFullYear().toString().slice(-2);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const orderCount = await Order.countDocuments({
        createdAt: {
          $gte: today,
          $lt: tomorrow
        }
      });

      const sequence = (orderCount + 1).toString().padStart(4, '0');
      order.orderNumber = `EN${year}${month}${day}${sequence}`;
    }

    await order.save();

    // Clear the cart after creating order
    cart.items = [];
    await cart.save();

    res.json({ success: true, message: 'Order created successfully', data: order });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// GET /api/orders - list orders for authenticated user
export const getOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// PATCH /api/orders/:id/cancel - cancel an order (if allowed)
export const cancelOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const order = await Order.findOne({ _id: id, user: userId });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Only allow cancel if not shipped/delivered/cancelled/returned
    const disallowed = ['shipped', 'delivered', 'cancelled', 'returned'];
    if (disallowed.includes(order.orderStatus)) {
      return res.status(400).json({ success: false, message: `Order cannot be cancelled (status: ${order.orderStatus})` });
    }

    order.orderStatus = 'cancelled';
    // if payment was completed, mark paymentStatus as refunded for later processing
    if (order.paymentStatus === 'completed') order.paymentStatus = 'refunded';

    await order.save();

    res.json({ success: true, message: 'Order cancelled', data: order });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Admin: list orders with filters
export const adminListOrders = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const { orderStatus, paymentStatus, search, dateFrom, dateTo, page = 1, limit = 20 } = req.query;
    const query = {};

    if (orderStatus) query.orderStatus = orderStatus;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    if (search) {
      const re = new RegExp(search, 'i');
      query.$or = [ { orderNumber: re }, { 'billingAddress.name': re }, { 'billingAddress.phone': re }, { 'shippingAddress.street': re } ];
    }

    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const orders = await Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).populate('user', 'name email');
    const total = await Order.countDocuments(query);

    res.json({ success: true, data: orders, meta: { total, page: Number(page), limit: Number(limit) } });
  } catch (error) {
    console.error('Admin list orders error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Admin: update order status or payment status
export const adminUpdateOrder = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();
    res.json({ success: true, message: 'Order updated', data: order });
  } catch (error) {
    console.error('Admin update order error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Admin: get a single order by id
export const adminGetOrder = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const { id } = req.params;
    const order = await Order.findById(id).populate('user', 'name email');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Admin get order error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

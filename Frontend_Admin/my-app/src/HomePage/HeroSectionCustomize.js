import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BUTTON_OPTIONS = [
  { text: 'Shop Now', link: '/products' },
  { text: 'Browse Vitamins', link: '/products?category=vitamins' },
  { text: 'Browse Proteins', link: '/products?category=proteins' },
  { text: 'View Cart', link: '/cart' },
  { text: 'My Profile', link: '/profile' },
  { text: 'Contact Us', link: '/contact' }
];

const HeroSectionCustomize = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    image: '',
    heading: '',
    subheading: '',
    buttons: [
      { text: 'Shop Now', link: '/' },
      { text: 'Browse Vitamins', link: '/filter?category=vitamins' }
    ]
  });
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/products/hero');
      setForm(res.data.data);
      setImagePreview(res.data.data.image ? (res.data.data.image.startsWith('/uploads/') ? `http://localhost:5000${res.data.data.image}` : res.data.data.image) : '');
    } catch (err) {
      setError('Failed to fetch hero section');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setImageFile(file);
  };

  const uploadImage = async () => {
    if (!imageFile) return form.image;
    const token = localStorage.getItem('adminToken');
    const data = new FormData();
    data.append('image', imageFile);
    const res = await axios.post('http://localhost:5000/api/admin/hero/upload', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
    return res.data.url;
  };

  const handleButtonChange = (idx, field, value) => {
    setForm(prev => ({
      ...prev,
      buttons: prev.buttons.map((btn, i) => i === idx ? { ...btn, [field]: value } : btn)
    }));
  };

  const addButton = () => {
    setForm(prev => ({ ...prev, buttons: [...prev.buttons, { text: '', link: '' }] }));
  };

  const removeButton = (idx) => {
    setForm(prev => ({ ...prev, buttons: prev.buttons.filter((_, i) => i !== idx) }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const imageUrl = await uploadImage();
      const token = localStorage.getItem('adminToken');
      await axios.put('http://localhost:5000/api/admin/hero', {
        ...form,
        image: imageUrl
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Hero section updated!');
      setImageFile(null);
      fetchHero();
    } catch (err) {
      setError('Failed to update hero section');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-xl mt-8">
      <h2 className="text-2xl font-bold mb-6">Customize Customer Hero Section</h2>
      {error && <div className="mb-4 text-red-600 font-semibold">{error}</div>}
      {success && <div className="mb-4 text-green-600 font-semibold">{success}</div>}
      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="block font-semibold mb-2">Hero Image</label>
          {imagePreview && <img src={imagePreview} alt="Hero Preview" className="mb-2 w-full max-h-64 object-cover rounded-xl border" />}
          <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full" />
        </div>
        <div>
          <label className="block font-semibold mb-2">Heading (h1)</label>
          <input type="text" value={form.heading} onChange={e => setForm(f => ({ ...f, heading: e.target.value }))} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3" required />
        </div>
        <div>
          <label className="block font-semibold mb-2">Subheading (p)</label>
          <input type="text" value={form.subheading} onChange={e => setForm(f => ({ ...f, subheading: e.target.value }))} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3" required />
        </div>
        <div>
          <label className="block font-semibold mb-2">Buttons</label>
          {form.buttons.map((btn, idx) => (
            <div key={idx} className="flex items-center space-x-2 mb-2">
              <select value={btn.text} onChange={e => {
                const opt = BUTTON_OPTIONS.find(o => o.text === e.target.value);
                handleButtonChange(idx, 'text', opt.text);
                handleButtonChange(idx, 'link', opt.link);
              }} className="border-2 border-gray-200 rounded-xl px-3 py-2">
                <option value="">Select Button</option>
                {BUTTON_OPTIONS.map(opt => (
                  <option key={opt.text} value={opt.text}>{opt.text}</option>
                ))}
              </select>
              <input type="text" value={btn.link} onChange={e => handleButtonChange(idx, 'link', e.target.value)} className="border-2 border-gray-200 rounded-xl px-3 py-2 flex-1" placeholder="Button Link" required />
              <button type="button" onClick={() => removeButton(idx)} className="text-red-600 font-bold px-2">Remove</button>
            </div>
          ))}
          <button type="button" onClick={addButton} className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-xl font-semibold mt-2">+ Add Button</button>
        </div>
        <button type="submit" disabled={saving} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Hero Section'}
        </button>
      </form>
    </div>
  );
};

export default HeroSectionCustomize; 
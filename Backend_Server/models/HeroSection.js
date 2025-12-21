import mongoose from 'mongoose';

const ButtonSchema = new mongoose.Schema({
  text: { type: String, required: true },
  link: { type: String, required: true }
}, { _id: false });

const HeroSectionSchema = new mongoose.Schema({
  image: { type: String, required: false },
  heading: { type: String, required: true },
  subheading: { type: String, required: true },
  buttons: { type: [ButtonSchema], default: [] }
}, { timestamps: true });

export default mongoose.model('HeroSection', HeroSectionSchema); 
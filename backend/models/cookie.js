const mongoose = require('mongoose');

const cookieSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  ingredients: [{ type: String }],
  allergens: [{ type: String }],
  image: { type: String },
  rating: { type: Number, default: 5 },
  isBestseller: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cookie', cookieSchema);

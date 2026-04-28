const express = require('express');
const router = express.Router();

const MOCK_COOKIES = [
  {
    _id: "1",
    name: "Classic Chocolate Chunk",
    description: "Hand-chopped dark chocolate chunks in our signature brown butter dough.",
    price: 3.50,
    ingredients: ["Brown Butter", "Dark Chocolate", "Sea Salt"],
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=400"
  },
  {
    _id: "2",
    name: "Oatmeal Maple Walnut",
    description: "Hearty oats combined with pure Vermont maple syrup and toasted walnuts.",
    price: 3.75,
    ingredients: ["Oats", "Maple Syrup", "Walnuts"],
    image: "https://images.unsplash.com/photo-1600431521340-491eca880813?auto=format&fit=crop&q=80&w=400"
  },
  {
    _id: "3",
    name: "Forest Berry Shortbread",
    description: "Buttery shortbread with a swirl of wild mountain berry jam.",
    price: 4.00,
    ingredients: ["Butter", "Wild Berries", "Sugar"],
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=400"
  },
  {
    _id: "4",
    name: "Double Dark Espresso",
    description: "Intense cocoa dough infused with fresh ground espresso and white chocolate chips.",
    price: 3.95,
    ingredients: ["Espresso", "White Chocolate", "Sea Salt"],
    image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=400"
  },
  {
    _id: "5",
    name: "Lemon Lavender Cloud",
    description: "Light and zesty lemon zest paired with aromatic dried lavender buds.",
    price: 3.80,
    ingredients: ["Lemon Zest", "Lavender", "Honey"],
    image: "https://images.unsplash.com/photo-1557089706-68d02dbda277?auto=format&fit=crop&q=80&w=400"
  },
  {
    _id: "6",
    name: "Salted Caramel Pecan",
    description: "Sticky house-made caramel and toasted pecans with a heavy sprinkle of Maldon salt.",
    price: 4.25,
    ingredients: ["Caramel", "Pecans", "Maldon Salt"],
    isBestseller: true,
    image: "https://images.unsplash.com/photo-1584001332832-75d1d860e6e7?auto=format&fit=crop&q=80&w=400"
  }
];

// GET all cookies
router.get('/', (req, res) => {
  res.json(MOCK_COOKIES);
});

module.exports = router;


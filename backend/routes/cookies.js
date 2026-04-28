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
    image: "/chocolate_chunk.png"
  },
  {
    _id: "2",
    name: "Oatmeal Maple Walnut",
    description: "Hearty oats combined with pure Vermont maple syrup and toasted walnuts.",
    price: 3.75,
    ingredients: ["Oats", "Maple Syrup", "Walnuts"],
    image: "/oatmeal_maple.png"
  },
  {
    _id: "3",
    name: "Forest Berry Shortbread",
    description: "Buttery shortbread with a swirl of wild mountain berry jam.",
    price: 4.00,
    ingredients: ["Butter", "Wild Berries", "Sugar"],
    image: "/berry_shortbread.png"
  },
  {
    _id: "4",
    name: "Double Dark Espresso",
    description: "Intense cocoa dough infused with fresh ground espresso and white chocolate chips.",
    price: 3.95,
    ingredients: ["Espresso", "White Chocolate", "Sea Salt"],
    image: "/dark_espresso.png"
  },
  {
    _id: "5",
    name: "Lemon Lavender Cloud",
    description: "Light and zesty lemon zest paired with aromatic dried lavender buds.",
    price: 3.80,
    ingredients: ["Lemon Zest", "Lavender", "Honey"],
    image: "/lemon_lavender.png"
  },
  {
    _id: "6",
    name: "Salted Caramel Pecan",
    description: "Sticky house-made caramel and toasted pecans with a heavy sprinkle of Maldon salt.",
    price: 4.25,
    ingredients: ["Caramel", "Pecans", "Maldon Salt"],
    isBestseller: true,
    image: "/caramel_pecan.png"
  }
];

// GET all cookies
router.get('/', (req, res) => {
  res.json(MOCK_COOKIES);
});

module.exports = router;


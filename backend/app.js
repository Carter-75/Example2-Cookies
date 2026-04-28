// --- Environment and Dependencies ---
const path = require('path');
const fs = require('fs');
const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const resolveEnvPath = () => {
  const candidates = [
    path.join(process.cwd(), '.env.local'), 
    path.join(process.cwd(), 'backend', '.env.local'),
    path.join(__dirname, '../.env.local')
  ];
  for (const c of candidates) { if (fs.existsSync(c)) return c; }
  return null;
};
const envPath = resolveEnvPath();
if (envPath) require('dotenv').config({ path: envPath });
else require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');

const app = express();

// --- Configuration ---
const isProd = process.env.PRODUCTION === 'true' || process.env.VERCEL === '1';
const prodUrl = process.env.PROD_FRONTEND_URL;
const PROJECT_NAME = process.env.PROJECT_NAME || 'example2-cookies';

// Trust proxy
if (isProd) {
  app.set('trust proxy', 1);
}

// Frame Ancestors
const frameAncestors = ["'self'", "https://carter-portfolio.fyi", "https://carter-portfolio.vercel.app", "https://*.vercel.app", `http://localhost:${process.env.PORT || '3001'}`];
if (prodUrl) frameAncestors.push(prodUrl);

// --- Routers ---
const cookiesRouter = require('./routes/cookies');

// --- Seeding Logic ---
const Cookie = require('./models/cookie');
const seedCookies = async () => {
  const count = await Cookie.countDocuments();
  if (count === 0) {
    console.log('INFO: Seeding rustic cookie data...');
    await Cookie.create([
      {
        name: "Classic Chocolate Chunk",
        description: "Hand-chopped dark chocolate chunks in our signature brown butter dough.",
        price: 3.50,
        ingredients: ["Brown Butter", "Dark Chocolate", "Sea Salt"],
        isBestseller: true,
        image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=400"
      },
      {
        name: "Oatmeal Maple Walnut",
        description: "Hearty oats combined with pure Vermont maple syrup and toasted walnuts.",
        price: 3.75,
        ingredients: ["Oats", "Maple Syrup", "Walnuts"],
        image: "https://images.unsplash.com/photo-1600431521340-491eca880813?auto=format&fit=crop&q=80&w=400"
      },
      {
        name: "Forest Berry Shortbread",
        description: "Buttery shortbread with a swirl of wild mountain berry jam.",
        price: 4.00,
        ingredients: ["Butter", "Wild Berries", "Sugar"],
        image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=400"
      },
      {
        name: "Double Dark Espresso",
        description: "Intense cocoa dough infused with fresh ground espresso and white chocolate chips.",
        price: 3.95,
        ingredients: ["Espresso", "White Chocolate", "Sea Salt"],
        image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=400"
      },
      {
        name: "Lemon Lavender Cloud",
        description: "Light and zesty lemon zest paired with aromatic dried lavender buds.",
        price: 3.80,
        ingredients: ["Lemon Zest", "Lavender", "Honey"],
        image: "https://images.unsplash.com/photo-1557089706-68d02dbda277?auto=format&fit=crop&q=80&w=400"
      },
      {
        name: "Salted Caramel Pecan",
        description: "Sticky house-made caramel and toasted pecans with a heavy sprinkle of Maldon salt.",
        price: 4.25,
        ingredients: ["Caramel", "Pecans", "Maldon Salt"],
        isBestseller: true,
        image: "https://images.unsplash.com/photo-1584001332832-75d1d860e6e7?auto=format&fit=crop&q=80&w=400"
      }
    ]);
    console.log('OK: Seeding complete');
  }
};

// --- Diagnostic Routes ---
app.get('/api/health', async (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.json({ status: 'online', database: isConnected ? 'Connected' : 'Disconnected' });
});

// --- MongoDB Setup ---
const mongoURI = process.env.MONGODB_URI;
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  if (!mongoURI) return;
  try {
    await mongoose.connect(mongoURI);
    console.log('OK: Connected to MongoDB');
    seedCookies();
  } catch (err) {
    console.error('ERROR: MongoDB Connection Failed:', err.message);
  }
};
connectDB();

// --- Middlewares ---
app.use(helmet());

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(cors({ origin: true, credentials: true }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Mount Routes
app.use('/api/cookies', cookiesRouter);
app.use('/cookies', cookiesRouter);

app.get('/', (req, res) => {
  res.send(`API for ${PROJECT_NAME} is running`);
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});

module.exports = app;

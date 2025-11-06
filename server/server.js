const express = require('express')
const app = express();

const cors = require('cors');
const corsOptions = {
    origin: ["http://localhost:5173"],
};
app.use(cors(corsOptions))

// Parse JSON bodies early so POST/PUT routes can read req.body
app.use(express.json());

// Simple request logging for debugging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// In-memory recipe store (no DB for this exercise)
// Recipe shape: { id, name, ingredients: [...], cookTime }
const recipes = [];

// In-memory restaurant store
// Restaurant shape: { id, name, priceRange, requiresReservation }
const restaurants = [];

// In-memory gum brands store
// Gum brand shape: { id, brand, flavor, price }
const gumBrands = [];

app.get("/api", (req, res) => {
    res.json({fruits: ["apple", "strawberry", "banana"]});
})

// Return all recipes
app.get('/recipes', (req, res) => {
    res.json({ recipes });
});

// Create a new recipe
app.post('/recipes', (req, res) => {
    const { name, ingredients, cookTime } = req.body;
    if (!name || !ingredients || !cookTime) {
        return res.status(400).json({ error: 'name, ingredients and cookTime are required' });
    }

    // Accept ingredients as array or comma-separated string
    const ingArray = Array.isArray(ingredients)
        ? ingredients
        : String(ingredients).split(',').map(s => s.trim()).filter(Boolean);

    const id = Date.now() + Math.floor(Math.random() * 1000);
    const recipe = { id, name, ingredients: ingArray, cookTime };
    recipes.push(recipe);

    res.status(201).json(recipe);
});

// Update an existing recipe
app.put('/recipes/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = recipes.findIndex(r => Number(r.id) === id);
    if (index === -1) return res.status(404).json({ error: 'recipe not found' });

    const { name, ingredients, cookTime } = req.body;
    if (!name && !ingredients && !cookTime) {
        return res.status(400).json({ error: 'provide at least one of name, ingredients or cookTime to update' });
    }

    if (name) recipes[index].name = name;
    if (cookTime) recipes[index].cookTime = cookTime;
    if (ingredients) {
        const ingArray = Array.isArray(ingredients)
            ? ingredients
            : String(ingredients).split(',').map(s => s.trim()).filter(Boolean);
        recipes[index].ingredients = ingArray;
    }

    res.json(recipes[index]);
});

// Delete a recipe
app.delete('/recipes/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = recipes.findIndex(r => Number(r.id) === id);
    if (index === -1) return res.status(404).json({ error: 'recipe not found' });

    const removed = recipes.splice(index, 1)[0];
    res.json({ success: true, removed });
});

// --- Restaurants API (similar to recipes) ---

// Return all restaurants
app.get('/restaurants', (req, res) => {
    res.json({ restaurants });
});

// Create a new restaurant
app.post('/restaurants', (req, res) => {
    const { name, priceRange, requiresReservation } = req.body;
    if (!name || !priceRange || typeof requiresReservation === 'undefined') {
        return res.status(400).json({ error: 'name, priceRange and requiresReservation are required' });
    }

    // Normalize boolean values that might be strings
    const requires = (typeof requiresReservation === 'boolean')
        ? requiresReservation
        : String(requiresReservation).toLowerCase() === 'true';

    const id = Date.now() + Math.floor(Math.random() * 1000);
    const restaurant = { id, name, priceRange, requiresReservation: requires };
    restaurants.push(restaurant);

    res.status(201).json(restaurant);
});

// Update a restaurant
app.put('/restaurants/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = restaurants.findIndex(r => Number(r.id) === id);
    if (index === -1) return res.status(404).json({ error: 'restaurant not found' });

    const { name, priceRange, requiresReservation } = req.body;
    if (!name && !priceRange && typeof requiresReservation === 'undefined') {
        return res.status(400).json({ error: 'provide at least one of name, priceRange or requiresReservation to update' });
    }

    if (name) restaurants[index].name = name;
    if (priceRange) restaurants[index].priceRange = priceRange;
    if (typeof requiresReservation !== 'undefined') {
        restaurants[index].requiresReservation = (typeof requiresReservation === 'boolean')
            ? requiresReservation
            : String(requiresReservation).toLowerCase() === 'true';
    }

    res.json(restaurants[index]);
});

// Delete a restaurant
app.delete('/restaurants/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = restaurants.findIndex(r => Number(r.id) === id);
    if (index === -1) return res.status(404).json({ error: 'restaurant not found' });

    const removed = restaurants.splice(index, 1)[0];
    res.json({ success: true, removed });
});

// --- Gum Brands API ---

// Return all gum brands
app.get('/gum-brands', (req, res) => {
    res.json({ gumBrands });
});

// Create a new gum brand
app.post('/gum-brands', (req, res) => {
    const { brand, flavor, price } = req.body;
    if (!brand || !flavor || !price) {
        return res.status(400).json({ error: 'brand, flavor and price are required' });
    }

    // Convert price to number if string provided
    const priceNum = typeof price === 'number' ? price : Number(price);
    if (isNaN(priceNum)) {
        return res.status(400).json({ error: 'price must be a valid number' });
    }

    const id = Date.now() + Math.floor(Math.random() * 1000);
    const gumBrand = { id, brand, flavor, price: priceNum };
    gumBrands.push(gumBrand);

    res.status(201).json(gumBrand);
});

// Update a gum brand
app.put('/gum-brands/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = gumBrands.findIndex(g => Number(g.id) === id);
    if (index === -1) return res.status(404).json({ error: 'gum brand not found' });

    const { brand, flavor, price } = req.body;
    if (!brand && !flavor && typeof price === 'undefined') {
        return res.status(400).json({ error: 'provide at least one of brand, flavor or price to update' });
    }

    if (brand) gumBrands[index].brand = brand;
    if (flavor) gumBrands[index].flavor = flavor;
    if (typeof price !== 'undefined') {
        const priceNum = typeof price === 'number' ? price : Number(price);
        if (isNaN(priceNum)) {
            return res.status(400).json({ error: 'price must be a valid number' });
        }
        gumBrands[index].price = priceNum;
    }

    res.json(gumBrands[index]);
});

// Delete a gum brand
app.delete('/gum-brands/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = gumBrands.findIndex(g => Number(g.id) === id);
    if (index === -1) return res.status(404).json({ error: 'gum brand not found' });

    const removed = gumBrands.splice(index, 1)[0];
    res.json({ success: true, removed });
});
// Default homepage
app.get('/', (req,res) => {
    res.send('This is the default home page!')
})
// About page
app.get('/about', (req,res) => {
    res.send('Welcome to the about page, there are three total pages!')
})
// Contact page
app.get('/contact', (req,res) => {
    res.send('You may contact us at sample@test.com')
})
// Hosting the server locally
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Express server running at http://localhost:${PORT}`);
});
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

// Import Sequelize models
const { Recipe, Restaurant, GumBrand, sequelize } = require('./models');

// Initialize database and sync models
(async () => {
    try {
        // Test the connection
        await sequelize.authenticate();
        console.log('Database connection established successfully.');

        // Create tables if they don't exist
        await sequelize.sync();
        console.log('Database synchronized');
    } catch (err) {
        console.error('Unable to connect to the database:', err);
        process.exit(1); // Exit if we can't connect to the database
    }
})();

app.get("/api", (req, res) => {
    res.json({fruits: ["apple", "strawberry", "banana"]});
})

// Return all recipes
app.get('/recipes', async (req, res) => {
    try {
        const recipes = await Recipe.findAll();
        res.json({ recipes });
    } catch (err) {
        console.error('Error fetching recipes:', err);
        res.status(500).json({ error: 'Failed to fetch recipes' });
    }
});

// Create a new recipe
app.post('/recipes', async (req, res) => {
    const { name, ingredients, cookTime } = req.body;
    if (!name || !ingredients || !cookTime) {
        return res.status(400).json({ error: 'name, ingredients and cookTime are required' });
    }

    try {
        // Normalize ingredients to array
        const ingArray = Array.isArray(ingredients)
            ? ingredients
            : String(ingredients).split(',').map(s => s.trim()).filter(Boolean);

        const recipe = await Recipe.create({
            name,
            ingredients: ingArray,
            cookTime
        });

        res.status(201).json(recipe);
    } catch (err) {
        console.error('Error creating recipe:', err);
        res.status(500).json({ error: 'Failed to create recipe' });
    }
});

// Update an existing recipe
app.put('/recipes/:id', async (req, res) => {
    const { id } = req.params;
    const { name, ingredients, cookTime } = req.body;
    
    if (!name && !ingredients && !cookTime) {
        return res.status(400).json({ error: 'provide at least one of name, ingredients or cookTime to update' });
    }

    try {
        const recipe = await Recipe.findByPk(id);
        if (!recipe) {
            return res.status(404).json({ error: 'recipe not found' });
        }

        const updates = {};
        if (name) updates.name = name;
        if (cookTime) updates.cookTime = cookTime;
        if (ingredients) {
            updates.ingredients = Array.isArray(ingredients)
                ? ingredients
                : String(ingredients).split(',').map(s => s.trim()).filter(Boolean);
        }

        await recipe.update(updates);
        res.json(recipe);
    } catch (err) {
        console.error('Error updating recipe:', err);
        res.status(500).json({ error: 'Failed to update recipe' });
    }
});

// Delete a recipe
app.delete('/recipes/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const recipe = await Recipe.findByPk(id);
        if (!recipe) {
            return res.status(404).json({ error: 'recipe not found' });
        }

        await recipe.destroy();
        res.json({ success: true, removed: recipe });
    } catch (err) {
        console.error('Error deleting recipe:', err);
        res.status(500).json({ error: 'Failed to delete recipe' });
    }
});

// --- Restaurants API (similar to recipes) ---

// Return all restaurants
app.get('/restaurants', async (req, res) => {
    try {
        const restaurants = await Restaurant.findAll();
        res.json({ restaurants });
    } catch (err) {
        console.error('Error fetching restaurants:', err);
        res.status(500).json({ error: 'Failed to fetch restaurants' });
    }
});

// Create a new restaurant
app.post('/restaurants', async (req, res) => {
    const { name, priceRange, requiresReservation } = req.body;
    if (!name || !priceRange || typeof requiresReservation === 'undefined') {
        return res.status(400).json({ error: 'name, priceRange and requiresReservation are required' });
    }

    try {
        const restaurant = await Restaurant.create({
            name,
            priceRange,
            requiresReservation: Boolean(requiresReservation)
        });

        res.status(201).json(restaurant);
    } catch (err) {
        console.error('Error creating restaurant:', err);
        res.status(500).json({ error: 'Failed to create restaurant' });
    }
});

// Update a restaurant
app.put('/restaurants/:id', async (req, res) => {
    const { id } = req.params;
    const { name, priceRange, requiresReservation } = req.body;
    
    if (!name && !priceRange && typeof requiresReservation === 'undefined') {
        return res.status(400).json({ error: 'provide at least one of name, priceRange or requiresReservation to update' });
    }

    try {
        const restaurant = await Restaurant.findByPk(id);
        if (!restaurant) {
            return res.status(404).json({ error: 'restaurant not found' });
        }

        const updates = {};
        if (name) updates.name = name;
        if (priceRange) updates.priceRange = priceRange;
        if (typeof requiresReservation !== 'undefined') {
            updates.requiresReservation = Boolean(requiresReservation);
        }

        await restaurant.update(updates);
        res.json(restaurant);
    } catch (err) {
        console.error('Error updating restaurant:', err);
        res.status(500).json({ error: 'Failed to update restaurant' });
    }
});

// Delete a restaurant
app.delete('/restaurants/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const restaurant = await Restaurant.findByPk(id);
        if (!restaurant) {
            return res.status(404).json({ error: 'restaurant not found' });
        }

        await restaurant.destroy();
        res.json({ success: true, removed: restaurant });
    } catch (err) {
        console.error('Error deleting restaurant:', err);
        res.status(500).json({ error: 'Failed to delete restaurant' });
    }
});

// --- Gum Brands API ---

// Return all gum brands
app.get('/gum-brands', async (req, res) => {
    try {
        const gumBrands = await GumBrand.findAll();
        res.json({ gumBrands });
    } catch (err) {
        console.error('Error fetching gum brands:', err);
        res.status(500).json({ error: 'Failed to fetch gum brands' });
    }
});

// Create a new gum brand
app.post('/gum-brands', async (req, res) => {
    const { brand, flavor, price } = req.body;
    if (!brand || !flavor || !price) {
        return res.status(400).json({ error: 'brand, flavor and price are required' });
    }

    try {
        const gumBrand = await GumBrand.create({
            brand,
            flavor,
            price: Number(price)
        });

        res.status(201).json(gumBrand);
    } catch (err) {
        console.error('Error creating gum brand:', err);
        res.status(500).json({ error: 'Failed to create gum brand' });
    }
});

// Update a gum brand
app.put('/gum-brands/:id', async (req, res) => {
    const { id } = req.params;
    const { brand, flavor, price } = req.body;
    
    if (!brand && !flavor && typeof price === 'undefined') {
        return res.status(400).json({ error: 'provide at least one of brand, flavor or price to update' });
    }

    try {
        const gumBrand = await GumBrand.findByPk(id);
        if (!gumBrand) {
            return res.status(404).json({ error: 'gum brand not found' });
        }

        const updates = {};
        if (brand) updates.brand = brand;
        if (flavor) updates.flavor = flavor;
        if (typeof price !== 'undefined') {
            const priceNum = Number(price);
            if (isNaN(priceNum)) {
                return res.status(400).json({ error: 'price must be a valid number' });
            }
            updates.price = priceNum;
        }

        await gumBrand.update(updates);
        res.json(gumBrand);
    } catch (err) {
        console.error('Error updating gum brand:', err);
        res.status(500).json({ error: 'Failed to update gum brand' });
    }
});

// Delete a gum brand
app.delete('/gum-brands/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const gumBrand = await GumBrand.findByPk(id);
        if (!gumBrand) {
            return res.status(404).json({ error: 'gum brand not found' });
        }

        await gumBrand.destroy();
        res.json({ success: true, removed: gumBrand });
    } catch (err) {
        console.error('Error deleting gum brand:', err);
        res.status(500).json({ error: 'Failed to delete gum brand' });
    }
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
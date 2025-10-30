const express = require('express')
const app = express();

const cors = require('cors');
const corsOptions = {
    origin: ["http://localhost:5173"],
};
app.use(cors(corsOptions))

app.get("/api", (req, res) => {
    res.json({fruits: ["apple", "strawberry", "banana"]});
})

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use(express.json());
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
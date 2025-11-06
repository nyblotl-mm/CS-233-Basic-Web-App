import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'

function App() {
  const [count, setCount] = useState(0);
  const [array, setArray] = useState([]);
  const [list, setList] = useState([]);
  const [input, setInput] = useState("");
  // Recipes
  const [recipes, setRecipes] = useState([]);
  const [recipeName, setRecipeName] = useState("");
  const [recipeIngredients, setRecipeIngredients] = useState("");
  const [recipeCookTime, setRecipeCookTime] = useState("");
  // Restaurants
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantPriceRange, setRestaurantPriceRange] = useState('');
  const [restaurantRequiresReservation, setRestaurantRequiresReservation] = useState(false);
  // Gum Brands
  const [gumBrands, setGumBrands] = useState([]);
  const [gumBrand, setGumBrand] = useState('');
  const [gumFlavor, setGumFlavor] = useState('');
  const [gumPrice, setGumPrice] = useState('');

  const addTodo = (todo) => {
    const newTodo = {
      id: Math.random(),
      todo: todo,
    };

    setList([...list, newTodo]);

    setInput("");
  };

  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:3000/api");
    setArray(response.data.fruits);
    console.log(response.data.fruits);
  };
  const fetchRecipes = async () => {
    try {
      const res = await axios.get('http://localhost:3000/recipes');
      setRecipes(res.data.recipes || []);
    } catch (err) {
      console.error('Failed to fetch recipes', err);
    }
  };
  const fetchRestaurants = async () => {
    try {
      const res = await axios.get('http://localhost:3000/restaurants');
      setRestaurants(res.data.restaurants || []);
    } catch (err) {
      console.error('Failed to fetch restaurants', err);
    }
  };

  const fetchGumBrands = async () => {
    try {
      const res = await axios.get('http://localhost:3000/gum-brands');
      setGumBrands(res.data.gumBrands || []);
    } catch (err) {
      console.error('Failed to fetch gum brands', err);
    }
  };
  useEffect(() => {
    fetchAPI();
    fetchRecipes();
    fetchRestaurants();
    fetchGumBrands();
  }, []);

  const deleteTodo = (id) => {
    const newList = list.filter((todo) => todo.id !== id);

    setList(newList);
  }

  const addRecipe = async () => {
    if (!recipeName || !recipeIngredients || !recipeCookTime) return;
    const payload = {
      name: recipeName,
      ingredients: recipeIngredients,
      cookTime: recipeCookTime,
    };

    try {
      const res = await axios.post('http://localhost:3000/recipes', payload);
      setRecipes([...recipes, res.data]);
      setRecipeName('');
      setRecipeIngredients('');
      setRecipeCookTime('');
    } catch (err) {
      console.error('Failed to add recipe', err);
    }
  };

  const addRestaurant = async () => {
    if (!restaurantName || !restaurantPriceRange) return;
    const payload = {
      name: restaurantName,
      priceRange: restaurantPriceRange,
      requiresReservation: restaurantRequiresReservation,
    };
    try {
      const res = await axios.post('http://localhost:3000/restaurants', payload);
      setRestaurants([...restaurants, res.data]);
      setRestaurantName('');
      setRestaurantPriceRange('');
      setRestaurantRequiresReservation(false);
    } catch (err) {
      console.error('Failed to add restaurant', err);
    }
  };

  const deleteRestaurant = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/restaurants/${id}`);
      setRestaurants(restaurants.filter(r => r.id !== id));
    } catch (err) {
      console.error('Failed to delete restaurant', err);
    }
  };

  // Restaurant editing state
  const [editingRestaurantId, setEditingRestaurantId] = useState(null);
  const [editRestaurantName, setEditRestaurantName] = useState('');
  const [editRestaurantPriceRange, setEditRestaurantPriceRange] = useState('');
  const [editRestaurantRequiresReservation, setEditRestaurantRequiresReservation] = useState(false);

  const startEditingRestaurant = (r) => {
    setEditingRestaurantId(r.id);
    setEditRestaurantName(r.name || '');
    setEditRestaurantPriceRange(r.priceRange || '');
    setEditRestaurantRequiresReservation(Boolean(r.requiresReservation));
  };

  const cancelEditingRestaurant = () => {
    setEditingRestaurantId(null);
    setEditRestaurantName('');
    setEditRestaurantPriceRange('');
    setEditRestaurantRequiresReservation(false);
  };

  const saveRestaurantEdit = async (id) => {
    const payload = {
      name: editRestaurantName,
      priceRange: editRestaurantPriceRange,
      requiresReservation: editRestaurantRequiresReservation,
    };
    try {
      const res = await axios.put(`http://localhost:3000/restaurants/${id}`, payload);
      setRestaurants(restaurants.map(r => r.id === id ? res.data : r));
      cancelEditingRestaurant();
    } catch (err) {
      console.error('Failed to save restaurant edit', err);
    }
  };

  // Gum brand handlers
  const addGumBrand = async () => {
    if (!gumBrand || !gumFlavor || !gumPrice) return;
    const payload = {
      brand: gumBrand,
      flavor: gumFlavor,
      price: Number(gumPrice),
    };
    try {
      const res = await axios.post('http://localhost:3000/gum-brands', payload);
      setGumBrands([...gumBrands, res.data]);
      setGumBrand('');
      setGumFlavor('');
      setGumPrice('');
    } catch (err) {
      console.error('Failed to add gum brand', err);
    }
  };

  const deleteGumBrand = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/gum-brands/${id}`);
      setGumBrands(gumBrands.filter(g => g.id !== id));
    } catch (err) {
      console.error('Failed to delete gum brand', err);
    }
  };

  // Gum brand editing state
  const [editingGumId, setEditingGumId] = useState(null);
  const [editGumBrand, setEditGumBrand] = useState('');
  const [editGumFlavor, setEditGumFlavor] = useState('');
  const [editGumPrice, setEditGumPrice] = useState('');

  const startEditingGum = (g) => {
    setEditingGumId(g.id);
    setEditGumBrand(g.brand || '');
    setEditGumFlavor(g.flavor || '');
    setEditGumPrice(g.price?.toString() || '');
  };

  const cancelEditingGum = () => {
    setEditingGumId(null);
    setEditGumBrand('');
    setEditGumFlavor('');
    setEditGumPrice('');
  };

  const saveGumEdit = async (id) => {
    const payload = {
      brand: editGumBrand,
      flavor: editGumFlavor,
      price: Number(editGumPrice),
    };
    try {
      const res = await axios.put(`http://localhost:3000/gum-brands/${id}`, payload);
      setGumBrands(gumBrands.map(g => g.id === id ? res.data : g));
      cancelEditingGum();
    } catch (err) {
      console.error('Failed to save gum brand edit', err);
    }
  };

  const deleteRecipe = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/recipes/${id}`);
      setRecipes(recipes.filter(r => r.id !== id));
    } catch (err) {
      console.error('Failed to delete recipe', err);
    }
  };

  // Editing state
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editIngredients, setEditIngredients] = useState('');
  const [editCookTime, setEditCookTime] = useState('');

  const startEditing = (r) => {
    setEditingId(r.id);
    setEditName(r.name || '');
    setEditIngredients(Array.isArray(r.ingredients) ? r.ingredients.join(', ') : (r.ingredients || ''));
    setEditCookTime(r.cookTime || '');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
    setEditIngredients('');
    setEditCookTime('');
  };

  const saveEdit = async (id) => {
    const payload = {
      name: editName,
      ingredients: editIngredients,
      cookTime: editCookTime,
    };
    try {
      const res = await axios.put(`http://localhost:3000/recipes/${id}`, payload);
      setRecipes(recipes.map(r => r.id === id ? res.data : r));
      cancelEditing();
    } catch (err) {
      console.error('Failed to save edit', err);
    }
  };

  return (

    <div>
      <h1>Stored Recipes!</h1>

      <section style={{marginBottom: '1rem'}}>
        <h2>Add a recipe</h2>
        <input
          type="text"
          placeholder="Name"
          value={recipeName}
          onChange={(e) => setRecipeName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Ingredients (comma separated)"
          value={recipeIngredients}
          onChange={(e) => setRecipeIngredients(e.target.value)}
        />
        <input
          type="text"
          placeholder="Cook time (e.g. 30 min)"
          value={recipeCookTime}
          onChange={(e) => setRecipeCookTime(e.target.value)}
        />
        <button onClick={addRecipe}>Add Recipe</button>
      </section>

      <section>
        <h2>Recipes</h2>
        {recipes.length === 0 && <p>No recipes yet.</p>}
        <ul>
          {recipes.map((r) => (
            <li key={r.id} style={{marginBottom: '0.5rem'}}>
              {editingId === r.id ? (
                <div>
                  <input value={editName} onChange={e => setEditName(e.target.value)} />
                  <input value={editIngredients} onChange={e => setEditIngredients(e.target.value)} />
                  <input value={editCookTime} onChange={e => setEditCookTime(e.target.value)} />
                  <button onClick={() => saveEdit(r.id)}>Save</button>
                  <button onClick={cancelEditing}>Cancel</button>
                </div>
              ) : (
                <div>
                  <strong>{r.name}</strong> — {r.cookTime}
                  <div>Ingredients: {Array.isArray(r.ingredients) ? r.ingredients.join(', ') : r.ingredients}</div>
                  <button onClick={() => startEditing(r)}>Edit</button>
                  <button onClick={() => deleteRecipe(r.id)}>Delete</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
      <section style={{marginTop: '1.5rem'}}>
        <h2>Restaurants</h2>

        <div style={{marginBottom: '1rem'}}>
          <input placeholder="Name" value={restaurantName} onChange={e => setRestaurantName(e.target.value)} />
          <input placeholder="Price range (e.g. $, $$, $$$)" value={restaurantPriceRange} onChange={e => setRestaurantPriceRange(e.target.value)} />
          <label style={{marginLeft: '0.5rem'}}>
            <input type="checkbox" checked={restaurantRequiresReservation} onChange={e => setRestaurantRequiresReservation(e.target.checked)} /> Requires reservation
          </label>
          <button onClick={addRestaurant}>Add Restaurant</button>
        </div>

        {restaurants.length === 0 && <p>No restaurants yet.</p>}
        <ul>
          {restaurants.map(r => (
            <li key={r.id} style={{marginBottom: '0.5rem'}}>
              {editingRestaurantId === r.id ? (
                <div>
                  <input value={editRestaurantName} onChange={e => setEditRestaurantName(e.target.value)} />
                  <input value={editRestaurantPriceRange} onChange={e => setEditRestaurantPriceRange(e.target.value)} />
                  <label style={{marginLeft: '0.5rem'}}>
                    <input type="checkbox" checked={editRestaurantRequiresReservation} onChange={e => setEditRestaurantRequiresReservation(e.target.checked)} /> Requires reservation
                  </label>
                  <button onClick={() => saveRestaurantEdit(r.id)}>Save</button>
                  <button onClick={cancelEditingRestaurant}>Cancel</button>
                </div>
              ) : (
                <div>
                  <strong>{r.name}</strong> — {r.priceRange} — {r.requiresReservation ? 'Requires reservation' : 'No reservation needed'}
                  <div>
                    <button onClick={() => startEditingRestaurant(r)}>Edit</button>
                    <button onClick={() => deleteRestaurant(r.id)}>Delete</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
      
      <section style={{marginTop: '1.5rem'}}>
        <h2>Gum Brands</h2>

        <div style={{marginBottom: '1rem'}}>
          <input placeholder="Brand" value={gumBrand} onChange={e => setGumBrand(e.target.value)} />
          <input placeholder="Flavor" value={gumFlavor} onChange={e => setGumFlavor(e.target.value)} />
          <input 
            placeholder="Price" 
            type="number" 
            step="0.01" 
            value={gumPrice} 
            onChange={e => setGumPrice(e.target.value)} 
          />
          <button onClick={addGumBrand}>Add Gum Brand</button>
        </div>

        {gumBrands.length === 0 && <p>No gum brands yet.</p>}
        <ul>
          {gumBrands.map(g => (
            <li key={g.id} style={{marginBottom: '0.5rem'}}>
              {editingGumId === g.id ? (
                <div>
                  <input value={editGumBrand} onChange={e => setEditGumBrand(e.target.value)} />
                  <input value={editGumFlavor} onChange={e => setEditGumFlavor(e.target.value)} />
                  <input 
                    type="number" 
                    step="0.01" 
                    value={editGumPrice} 
                    onChange={e => setEditGumPrice(e.target.value)} 
                  />
                  <button onClick={() => saveGumEdit(g.id)}>Save</button>
                  <button onClick={cancelEditingGum}>Cancel</button>
                </div>
              ) : (
                <div>
                  <strong>{g.brand}</strong> — {g.flavor} — ${g.price.toFixed(2)}
                  <div>
                    <button onClick={() => startEditingGum(g)}>Edit</button>
                    <button onClick={() => deleteGumBrand(g.id)}>Delete</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>

    /*
    <>
    
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
        {
          array.map((fruit, index) => (
            <div key={index}>
              <p>{fruit}</p>
              <br></br>
            </div>
          ))
        }
      </div>
    </>
    */
  );
}

export default App

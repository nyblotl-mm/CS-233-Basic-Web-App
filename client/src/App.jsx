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
  useEffect(() => {
    fetchAPI();
    fetchRecipes();
    fetchRestaurants();
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

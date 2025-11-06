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
  useEffect(() => {
    fetchAPI();
    fetchRecipes();
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

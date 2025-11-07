import axios from 'axios'

const API_BASE = 'http://localhost:3000'

export const getFruits = () => axios.get(`${API_BASE}/api`)

// Recipes
export const getRecipes = () => axios.get(`${API_BASE}/recipes`)
export const createRecipe = (payload) => axios.post(`${API_BASE}/recipes`, payload)
export const updateRecipe = (id, payload) => axios.put(`${API_BASE}/recipes/${id}`, payload)
export const deleteRecipe = (id) => axios.delete(`${API_BASE}/recipes/${id}`)

// Restaurants
export const getRestaurants = () => axios.get(`${API_BASE}/restaurants`)
export const createRestaurant = (payload) => axios.post(`${API_BASE}/restaurants`, payload)
export const updateRestaurant = (id, payload) => axios.put(`${API_BASE}/restaurants/${id}`, payload)
export const deleteRestaurant = (id) => axios.delete(`${API_BASE}/restaurants/${id}`)

// Gum brands
export const getGumBrands = () => axios.get(`${API_BASE}/gum-brands`)
export const createGumBrand = (payload) => axios.post(`${API_BASE}/gum-brands`, payload)
export const updateGumBrand = (id, payload) => axios.put(`${API_BASE}/gum-brands/${id}`, payload)
export const deleteGumBrand = (id) => axios.delete(`${API_BASE}/gum-brands/${id}`)

// small convenience default export
export default {
  getFruits,
  // recipes
  getRecipes, createRecipe, updateRecipe, deleteRecipe,
  // restaurants
  getRestaurants, createRestaurant, updateRestaurant, deleteRestaurant,
  // gum
  getGumBrands, createGumBrand, updateGumBrand, deleteGumBrand,
}

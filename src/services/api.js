import axios from 'axios';

const API_BASE_URL = 'https://fakestoreapi.com';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // Get all products
  getProducts: async () => {
    const response = await apiClient.get('/products');
    return response.data;
  },

  // Get single product by id
  getProductById: async (id) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  // Get featured products (limiting to 4 for home page)
  getFeaturedProducts: async (limit = 4) => {
    const response = await apiClient.get(`/products?limit=${limit}`);
    return response.data;
  },

  // Get all categories
  getCategories: async () => {
    const response = await apiClient.get('/products/categories');
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    const response = await apiClient.get(`/products/category/${category}`);
    return response.data;
  }
};

export default api;

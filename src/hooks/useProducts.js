import { useState, useEffect } from 'react';
import api from '../services/api';

const useProducts = (categoryId = null, limit = null) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let data;
        
        if (categoryId) {
          data = await api.getProductsByCategory(categoryId);
        } else if (limit) {
          data = await api.getFeaturedProducts(limit);
        } else {
          data = await api.getProducts();
        }
        
        if (isMounted) {
          setProducts(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to fetch products');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [categoryId, limit]);

  return { products, loading, error };
};

export default useProducts;

import { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify'; 

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // --- Bulletproof Initialization ---
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Cart data corrupted, resetting...", error);
      return []; 
    }
  });

  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const savedWishlist = localStorage.getItem('wishlistItems');
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch (error) {
      console.error("Wishlist data corrupted, resetting...", error);
      return [];
    }
  });

  // --- Auto-Save to LocalStorage ---
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // --- Cart Actions ---
  const addToCart = (product, quantity = 1) => {
    // FIX: Check if the item exists FIRST, outside the state setter!
    const existingItem = cartItems.find(item => item.productId === product.id);

    if (existingItem) {
      toast.info(`Increased ${product.title || 'item'} quantity!`);
      // Update state without putting side-effects inside the setter
      setCartItems(prevItems => prevItems.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      toast.success(`${product.title || 'Item'} added to cart!`);
      setCartItems(prevItems => [...prevItems, {
        productId: product.id,
        title: product.title,
        category: product.category,
        image: product.image,
        price: product.price,
        quantity
      }]);
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.productId !== productId));
    toast.error("Item removed from cart");
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = (silent = false) => {
    setCartItems([]);
    if (!silent) toast.warn("Cart has been cleared");
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  // --- Wishlist Actions ---
  const toggleWishlist = (product) => {
    // FIX: Check existence outside the setter
    const exists = wishlistItems.find(item => item.productId === product.id);
    
    if (exists) {
      toast.info("Removed from wishlist");
      setWishlistItems(prevItems => prevItems.filter(item => item.productId !== product.id));
    } else {
      toast.success("Added to wishlist! ❤️");
      setWishlistItems(prevItems => [...prevItems, { 
        productId: product.id,
        title: product.title,
        category: product.category,
        image: product.image,
        price: product.price 
      }]);
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.productId === productId);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      getCartTotal,
      getCartCount,

      wishlistItems,
      toggleWishlist,
      isInWishlist
    }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
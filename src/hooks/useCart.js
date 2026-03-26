import { useContext } from 'react';
import CartContext from '../context/CartContext';

const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return {
    cartItems: context.cartItems,
    addToCart: context.addToCart,
    removeFromCart: context.removeFromCart,
    updateCartQuantity: context.updateCartQuantity,
    clearCart: context.clearCart,
    getCartTotal: context.getCartTotal,
    getCartCount: context.getCartCount
  };
};

export default useCart;

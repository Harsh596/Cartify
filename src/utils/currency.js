export const CONVERSION_RATE = 90;
export const CURRENCY_SYMBOL = '₹';

export const formatPrice = (price) => {
  if (typeof price !== 'number') return '₹0.00';
  return `${CURRENCY_SYMBOL}${(price * CONVERSION_RATE).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

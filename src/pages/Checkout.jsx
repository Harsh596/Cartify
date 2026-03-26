import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useCart from '../hooks/useCart';
import api from '../services/api';
import { formatPrice } from '../utils/currency';

const schema = yup.object().shape({
  fullName: yup.string().required("Full Name is required"),
  email: yup.string().email("Valid email is required").required("Valid email is required"),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  zipCode: yup.string().required("Zip Code is required"),
  cardNumber: yup.string()
    .length(16, "Card exactly 16 digits")
    .matches(/^\d+$/, "Numeric inputs only")
    .required("Card exactly 16 digits"),
  expiry: yup.string()
    .required("Expiry Format MM/YY")
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid format")
    .test('valid-date', 'Invalid Expiration Date', (value) => {
      if (!value) return false;
      const [monthStr, yearStr] = value.split('/');
      const year = parseInt(yearStr, 10) + 2000;
      if (year < 2026) return false;
      return true;
    }),
  cvv: yup.string()
    .min(3, "Min 3 digits")
    .max(4, "Max 4 digits")
    .matches(/^\d+$/, "Numeric inputs only")
    .required("Valid CVV required")
});

export default function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [productsData, setProductsData] = useState([]);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const [promoInput, setPromoInput] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);

  const applyPromoCode = () => {
    const isUsed = localStorage.getItem('cartify_promo_used');
    if (isUsed === 'true') {
      toast.error("PROMO CODE ALREADY USED ON A PREVIOUS ORDER");
      return;
    }

    if (promoInput.toUpperCase() === 'CARTIFY20' && !isDiscountApplied) {
      const discount = subtotal * 0.20;
      setDiscountAmount(discount);
      setIsDiscountApplied(true);
      toast.success("20% DISCOUNT APPLIED!");
    } else if (isDiscountApplied) {
        toast.info("DISCOUNT ALREADY APPLIED");
    } else {
      toast.error("INVALID PROMO CODE");
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await api.getProducts();
        setProductsData(allProducts);
      } catch (err) {
        console.error("Failed to fetch products for checkout", err);
      }
    };
    fetchProducts();
  }, []);

  const subtotal = getCartTotal();
  const discountedSubtotal = subtotal - discountAmount;
  const taxRate = 0.10; 
  const tax = discountedSubtotal * taxRate;
  const total = discountedSubtotal + tax;

  const onSubmit = (data) => {
    if (isDiscountApplied) {
      localStorage.setItem('cartify_promo_used', 'true');
    }
    const orderId = uuidv4().substring(0, 8).toUpperCase();
    const orderData = {
      id: `ORD-${orderId}`,
      items: cartItems.map(item => {
        const productDetails = productsData.find(p => p.id === item.productId);
        return {
          title: productDetails ? productDetails.title : `GEAR ID: ${item.productId}`,
          quantity: item.quantity,
          price: item.price
        };
      }),
      subtotal: subtotal,
      discount: discountAmount,
      tax: tax,
      total: total,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      buyerName: data.fullName,
      buyerEmail: data.email,
      buyerAddress: data.address,
      buyerCity: data.city,
      buyerZip: data.zipCode,
      paymentLast4: data.cardNumber.slice(-4)
    };

    navigate('/order-confirmed', { state: { orderData } });
  };

  if (cartItems.length === 0) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col justify-center items-center py-24 text-center px-6">
        <div className="bg-primary-container border-[4px] border-on-background rounded-3xl p-12 max-w-md shadow-[12px_12px_0px_0px_rgba(44,47,48,1)]">
            <span className="material-symbols-outlined text-6xl text-on-background mb-4">cancel</span>
            <h2 className="text-4xl font-black font-headline tracking-tighter uppercase mb-4 text-on-background">Zero Gear</h2>
            <p className="text-on-background font-bold mb-8">Your haul is empty. Go load up before checking out!</p>
            <button 
            onClick={() => navigate('/products')} 
            className="w-full bg-secondary text-white border-[4px] border-on-background rounded-full font-black uppercase text-lg px-8 py-4 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0px_0px_rgba(44,47,48,1)] transition-all"
            >
            BACK TO ARCHIVE
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-6 py-12 max-w-[1440px] mx-auto min-h-screen">
      <h2 className="text-6xl md:text-8xl font-black font-headline tracking-tighter uppercase mb-12 text-on-background text-center md:text-left">
        SECURE <br/><span className="text-primary underline decoration-primary-container decoration-[12px]">CHECKOUT</span>
      </h2>
      
      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-12 lg:gap-16">
        
        {/* Checkout Form */}
        <div className="bg-white p-8 md:p-12 border-[5px] border-on-background rounded-3xl shadow-[12px_12px_0px_0px_rgba(44,47,48,1)]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            
            <div className="bg-surface-container p-8 rounded-2xl border-[3px] border-on-background">
              <h3 className="text-3xl font-black font-headline tracking-tight uppercase text-on-background md:col-span-2 mb-6">1. Shipping Info</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="font-bold text-sm text-on-background uppercase mb-2">Full Name</label>
                  <input type="text" {...register("fullName")} className="bg-white border-[3px] border-on-background rounded-xl px-4 py-3 text-on-background font-bold transition-all focus:scale-[1.02] focus:ring-secondary focus:border-secondary outline-none" placeholder="JOHN DOE" />
                  {errors.fullName && <p className="text-error text-xs font-bold mt-2 uppercase">{errors.fullName.message}</p>}
                </div>
                <div className="flex flex-col">
                  <label className="font-bold text-sm text-on-background uppercase mb-2">Email Address</label>
                  <input type="email" {...register("email")} className="bg-white border-[3px] border-on-background rounded-xl px-4 py-3 text-on-background font-bold transition-all focus:scale-[1.02] focus:ring-secondary focus:border-secondary outline-none" placeholder="YO@VIBE.COM" />
                  {errors.email && <p className="text-error text-xs font-bold mt-2 uppercase">{errors.email.message}</p>}
                </div>
                
                <div className="flex flex-col md:col-span-2">
                  <label className="font-bold text-sm text-on-background uppercase mb-2">Street Address</label>
                  <input type="text" {...register("address")} className="bg-white border-[3px] border-on-background rounded-xl px-4 py-3 text-on-background font-bold transition-all focus:scale-[1.02] focus:ring-secondary focus:border-secondary outline-none" placeholder="123 CARTIFY AVE" />
                  {errors.address && <p className="text-error text-xs font-bold mt-2 uppercase">{errors.address.message}</p>}
                </div>

                <div className="flex flex-col">
                  <label className="font-bold text-sm text-on-background uppercase mb-2">City</label>
                  <input type="text" {...register("city")} className="bg-white border-[3px] border-on-background rounded-xl px-4 py-3 text-on-background font-bold transition-all focus:scale-[1.02] focus:ring-secondary focus:border-secondary outline-none" placeholder="NEW YORK" />
                  {errors.city && <p className="text-error text-xs font-bold mt-2 uppercase">{errors.city.message}</p>}
                </div>
                <div className="flex flex-col">
                  <label className="font-bold text-sm text-on-background uppercase mb-2">Zip Code</label>
                  <input type="text" {...register("zipCode")} className="bg-white border-[3px] border-on-background rounded-xl px-4 py-3 text-on-background font-bold transition-all focus:scale-[1.02] focus:ring-secondary focus:border-secondary outline-none" placeholder="10001" />
                  {errors.zipCode && <p className="text-error text-xs font-bold mt-2 uppercase">{errors.zipCode.message}</p>}
                </div>
              </div>
            </div>

            <div className="bg-primary-container p-8 rounded-2xl border-[3px] border-on-background">
              <h3 className="text-3xl font-black font-headline tracking-tight uppercase text-on-background md:col-span-2 mb-6">2. Payment</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col md:col-span-2">
                  <label className="font-bold text-sm text-on-background uppercase mb-2">Card Number</label>
                  <input type="text" {...register("cardNumber")} className="bg-white border-[3px] border-on-background rounded-xl px-4 py-3 text-on-background font-bold transition-all focus:scale-[1.02] focus:ring-secondary focus:border-secondary outline-none tracking-widest" placeholder="1234123412341234" maxLength="16" />
                  {errors.cardNumber && <p className="text-error-container text-xs font-black mt-2 uppercase">{errors.cardNumber.message}</p>}
                </div>
                
                <div className="flex flex-col">
                  <label className="font-bold text-sm text-on-background uppercase mb-2">Valid Thru</label>
                  <input type="text" {...register("expiry")} className="bg-white border-[3px] border-on-background rounded-xl px-4 py-3 text-on-background font-bold transition-all focus:scale-[1.02] focus:ring-secondary focus:border-secondary outline-none tracking-widest" placeholder="MM/YY" maxLength="5" />
                  {errors.expiry && <p className="text-error-container text-xs font-black mt-2 uppercase">{errors.expiry.message}</p>}
                </div>
                <div className="flex flex-col">
                  <label className="font-bold text-sm text-on-background uppercase mb-2">CVV</label>
                  <input type="password" {...register("cvv")} className="bg-white border-[3px] border-on-background rounded-xl px-4 py-3 text-on-background font-bold transition-all focus:scale-[1.02] focus:ring-secondary focus:border-secondary outline-none tracking-widest" placeholder="•••" maxLength="4" />
                  {errors.cvv && <p className="text-error-container text-xs font-black mt-2 uppercase">{errors.cvv.message}</p>}
                </div>
              </div>
            </div>

            <button type="submit" className="w-full py-6 mt-4 bg-secondary text-white border-[4px] border-on-background rounded-full font-black font-headline text-3xl uppercase tracking-tighter shadow-[8px_8px_0px_0px_rgba(44,47,48,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[4px_4px_0px_0px_rgba(44,47,48,1)] transition-all active:scale-95 flex justify-center items-center gap-2">
              <span className="material-symbols-outlined text-[32px] font-black">lock</span> PLACE SECURE ORDER
            </button>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:sticky lg:top-32 self-start">
          <section className="bg-tertiary-fixed border-[5px] border-on-background rounded-3xl p-8 shadow-[12px_12px_0px_0px_rgba(44,47,48,1)] -rotate-1 relative">
            <div className="absolute -top-4 -right-4 bg-white border-[3px] border-on-background p-2 rounded-full rotate-12 shadow-[4px_4px_0px_0px_rgba(44,47,48,1)] z-10">
                <span className="material-symbols-outlined font-black text-on-background text-2xl">receipt_long</span>
            </div>
            <h3 className="text-3xl font-black font-headline tracking-tighter uppercase text-on-background mb-8 pb-4 border-b-[4px] border-on-background">Your Haul</h3>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 mb-8 custom-scrollbar">
              {cartItems.map((item, index) => {
                const productDetails = productsData.find(p => p.id === item.productId);
                const productName = productDetails ? productDetails.title : `GEAR ID: ${item.productId}`;
                const productImage = productDetails ? productDetails.image : null;

                return (
                  <div key={`${item.productId}-${index}`} className="flex gap-4 p-4 bg-white border-[3px] border-on-background rounded-xl neo-shadow">
                    {productImage && (
                      <div className="w-16 h-16 bg-surface-container rounded-lg flex items-center justify-center p-2 flex-shrink-0 border-[2px] border-on-background">
                        <img src={productImage} alt={productName} className="object-contain w-full h-full mix-blend-multiply" />
                      </div>
                    )}
                    <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                      <span className="font-black text-sm text-on-background line-clamp-1 uppercase leading-tight tracking-tight" title={productName}>{productName}</span>
                      <div className="flex justify-between items-center text-on-background font-bold text-sm">
                        <span>QTY: {item.quantity}</span>
                        <span>{formatPrice(item.price)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white border-[3px] border-on-background rounded-xl p-6">
                <div className="flex justify-between items-center mb-4 text-sm font-bold uppercase text-on-background">
                <span>Sub-Total</span>
                <span className="font-black">{formatPrice(subtotal)}</span>
                </div>
                
                {/* Promo Code Input */}
                <div className="flex gap-2 mb-6">
                  <input 
                    type="text" 
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="PROMO CODE" 
                    className="flex-grow bg-white border-[3px] border-on-background rounded-xl px-4 py-2 text-xs font-black uppercase outline-none focus:ring-2 focus:ring-secondary"
                  />
                  <button 
                    type="button"
                    onClick={applyPromoCode}
                    className="bg-on-background text-white px-4 py-2 rounded-xl font-black text-xs uppercase hover:bg-secondary transition-colors"
                  >
                    Apply
                  </button>
                </div>

                {isDiscountApplied && (
                  <div className="flex justify-between items-center mb-4 text-sm font-black uppercase text-secondary animate-pulse">
                    <span>Discount (20%)</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center mb-6 text-sm font-bold uppercase text-on-background border-b-[2px] border-outline-variant/30 pb-4">
                <span>Tax (10%)</span>
                <span className="font-black">{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between items-end font-black font-headline tracking-tighter text-on-background uppercase">
                <span className="text-2xl">Net Total</span>
                <span className="text-5xl">{formatPrice(total)}</span>
                </div>
            </div>
          </section>
        </div>

      </div>
    </div>
  )
}

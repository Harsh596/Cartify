import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import ReceiptTemplate from '../components/ReceiptTemplate';
import useCart from '../hooks/useCart';
import { formatPrice } from '../utils/currency';

export default function OrderConfirmed() {
  const location = useLocation();
  const navigate = useNavigate();
  // Capture orderData exactly once on mount to prevent Framer Motion exit animations from nullifying it
  const orderData = useRef(location.state?.orderData).current;
  const receiptRef = useRef(null);
  const { clearCart } = useCart();

  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Safely calculate dynamic delivery date once on mount (avoids conditional hook violations)
  const deliveryRangeRef = useRef(null);
  if (!deliveryRangeRef.current) {
    const today = new Date();
    const startOffset = Math.floor(Math.random() * 4) + 1; 
    const endOffset = startOffset + Math.floor(Math.random() * 3) + 1;
    
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + startOffset);
    
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + endOffset);
    
    deliveryRangeRef.current = `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}`;
  }

  // Clear cart only on unmount (when user leaves page)
  useEffect(() => {
    return () => {
      if (orderData) {
        clearCart(true);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!orderData) {
      navigate('/');
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [orderData, navigate]);

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;
    setIsGeneratingPDF(true);
    
    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2, 
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      const pdf = new jsPDF('p', 'pt', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`TRANSACTION_LEDGER_${orderData.id}.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF", err);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (!orderData) return null;

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center p-6 bg-surface relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-on-background to-transparent"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 border-[8px] border-primary-container border-t-secondary rounded-full animate-spin mb-8 shadow-[4px_4px_0px_0px_rgba(44,47,48,1)]"></div>
          <h2 className="text-4xl md:text-5xl font-headline font-black tracking-tighter uppercase text-on-background animate-pulse">
            SECURING DROPS...
          </h2>
          <p className="font-mono font-bold text-on-surface-variant mt-4 tracking-widest uppercase">
            Encrypting Transaction Ledger
          </p>
        </div>
      </div>
    );
  }

  const estimatedDelivery = deliveryRangeRef.current;

  return (
    <>
      <div className="w-full flex flex-col items-center justify-center p-6 md:p-12 gap-12 max-w-[1440px] mx-auto min-h-[80vh]">
        {/* Hero Celebration Section */}
        <section className="relative w-full flex flex-col items-center text-center mt-8">
          {/* Asymmetric Sticker Backgrounds */}
          <div className="absolute -top-12 -left-8 md:bg-tertiary-container w-32 h-32 rounded-xl border-[4px] border-on-background rotate-12 -z-10 shadow-[4px_4px_0px_0px_rgba(44,47,48,1)] hidden md:block"></div>
          <div className="absolute top-24 -right-12 md:bg-secondary-container w-48 h-48 rounded-full border-[4px] border-on-background -rotate-6 -z-10 shadow-[8px_8px_0px_0px_rgba(44,47,48,1)] hidden md:block"></div>
          
          {/* Success Icon/Illustration Removed */}
          
          {/* Heading */}
          <div className="space-y-4">
            <h1 className="font-headline font-black text-6xl md:text-8xl lg:text-9xl text-on-background tracking-tighter uppercase leading-none drop-shadow-[8px_8px_0px_rgba(253,212,0,1)]">
                ORDER<br/>CONFIRMED!
            </h1>
            <div className="inline-block bg-on-background text-primary-container px-6 py-2 rounded-full font-headline font-black text-xl md:text-2xl border-[4px] border-on-background rotate-2 shadow-[4px_4px_0px_0px_rgba(182,0,85,1)]">
                #{orderData.id}
            </div>
          </div>
        </section>

        {/* Bento Layout Content */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full">
          {/* Status Card */}
          <div className="md:col-span-7 bg-white rounded-xl border-[4px] border-on-background p-8 shadow-[8px_8px_0px_0px_rgba(44,47,48,1)] flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-4xl text-on-background" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
              <h2 className="font-headline font-black text-3xl tracking-tight uppercase">YOU'RE ALL SET!</h2>
            </div>
            <p className="text-xl text-on-surface-variant font-bold leading-relaxed">
              We've received your order and our robots are already buzzing with excitement. Check your email for the receipt and tracking details shortly!
            </p>
            <div className="bg-surface-container rounded-lg p-6 border-[3px] border-on-background border-dashed">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold uppercase tracking-widest text-sm text-on-surface-variant">Estimated Delivery</span>
                <span className="font-black text-secondary">{estimatedDelivery}</span>
              </div>
              <div className="w-full bg-white border-[3px] border-on-background h-6 rounded-full overflow-hidden">
                <div className="bg-tertiary-container h-full w-1/4 border-r-[3px] border-on-background"></div>
              </div>
            </div>
          </div>

          {/* What's Next Section */}
          <div className="md:col-span-5 bg-secondary-container rounded-xl border-[4px] border-on-background p-8 shadow-[8px_8px_0px_0px_rgba(44,47,48,1)] flex flex-col gap-6">
            <h2 className="font-headline font-black text-3xl tracking-tight uppercase text-on-background">WHAT'S NEXT?</h2>
            <div className="flex flex-col gap-4">
              {/* Download PDF Ledger Button */}
              <button 
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="w-full bg-tertiary-container border-[4px] border-on-background rounded-full py-5 px-8 font-headline font-black text-xl md:text-md lg:text-xl uppercase flex items-center justify-between transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(44,47,48,1)] active:translate-x-0 active:translate-y-0 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                <span>{isGeneratingPDF ? 'ENCRYPTING...' : 'DOWNLOAD RECEIPT PDF'}</span>
                <span className="material-symbols-outlined text-3xl">download</span>
              </button>

              {/* Continue Shopping Button */}
              <Link
                to="/products"
                className="w-full bg-primary-container border-[4px] border-on-background rounded-full py-5 px-8 font-headline font-black text-xl uppercase flex items-center justify-between transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(44,47,48,1)] active:translate-x-0 active:translate-y-0 active:shadow-none"
              >
                <span>Keep Shopping</span>
                <span className="material-symbols-outlined text-3xl">shopping_bag</span>
              </Link>
            </div>
          </div>

          {/* Order Summary Mini-Bento */}
          <div className="md:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Shipping To */}
            <div className="bg-surface-container-low rounded-lg border-[3px] border-on-background p-6 shadow-[4px_4px_0px_0px_rgba(44,47,48,1)] rotate-[-1deg]">
              <span className="text-xs font-black uppercase tracking-tighter text-on-surface-variant block mb-2">Shipping To</span>
              <p className="font-bold break-words uppercase">{orderData.buyerName}<br/>{orderData.buyerEmail}<br/>{orderData.buyerAddress}, {orderData.buyerCity} {orderData.buyerZip}</p>
            </div>
            {/* Payment */}
            <div className="bg-surface-container-low rounded-lg border-[3px] border-on-background p-6 shadow-[4px_4px_0px_0px_rgba(44,47,48,1)] rotate-[1deg]">
              <span className="text-xs font-black uppercase tracking-tighter text-on-surface-variant block mb-2">Payment Method</span>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">credit_card</span>
                <p className="font-bold uppercase break-all">VISA •••• {orderData.paymentLast4}</p>
              </div>
            </div>
            {/* Support */}
            <Link to="/" className="bg-surface-container-low rounded-lg border-[3px] border-on-background p-6 shadow-[4px_4px_0px_0px_rgba(44,47,48,1)] rotate-[-1deg] group cursor-pointer hover:bg-tertiary-container transition-colors block neo-shadow">
              <span className="text-xs font-black uppercase tracking-tighter text-on-surface-variant block mb-2 group-hover:text-on-background">Need Help?</span>
              <p className="font-bold underline group-hover:no-underline uppercase">COMM-LINK</p>
            </Link>
            {/* Total */}
            <div className="bg-on-background text-white rounded-lg border-[3px] border-on-background p-6 shadow-[4px_4px_0px_0px_rgba(253,212,0,1)] rotate-[1deg]">
              <span className="text-xs font-black uppercase tracking-tighter text-on-surface-variant block mb-1">Order Total</span>
              <p className="text-3xl font-headline font-black text-primary-container">{formatPrice(orderData.total)}</p>
            </div>
          </div>
        </section>

        {/* Receipt Preview */}
        <div className="mt-16 w-full flex flex-col items-center">
          <h2 className="font-headline font-black text-4xl uppercase mb-8 text-on-background">Preview Ledger</h2>
          <div className="w-full overflow-x-auto flex justify-center pb-12 custom-scrollbar">
            <ReceiptTemplate ref={receiptRef} orderData={orderData} />
          </div>
        </div>
      </div>
    </>
  );
}

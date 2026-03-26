import React from 'react';
import logo from '../assets/logof.svg';
import { formatPrice } from '../utils/currency';

const ReceiptTemplate = React.forwardRef(({ orderData }, ref) => {
  if (!orderData) return null;

  const { id, items, subtotal, discount, tax, total, timestamp, buyerName, buyerEmail, buyerAddress, buyerCity, buyerZip } = orderData;
  const rawSubtotal = subtotal || (total / 1.1);
  const rawTax = tax || (total - rawSubtotal);

  return (
    <>
      {/* Container carefully sized for the PDF A4 page capture */}
      <div 
        ref={ref} 
        style={{ width: '800px', backgroundColor: '#f5f6f7', padding: '40px', flexShrink: 0 }} 
        className="font-mono text-on-background mx-auto"
      >
        <div className="relative w-full">
          {/* Decorative "Tape" Sticker */}
          <div className="absolute -top-6 -right-4 z-10 bg-tertiary-container text-on-tertiary-container font-mono font-black px-4 py-2 border-[4px] border-on-background shadow-[4px_4px_0px_0px_rgba(44,47,48,1)] rotate-3 uppercase">
              VERIFIED_TXN
          </div>

          {/* Terminal Ledger Paper */}
          <div className="bg-white border-[4px] border-on-background p-12 shadow-[12px_12px_0px_0px_rgba(44,47,48,1)] font-mono text-on-background overflow-hidden relative">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="font-bold">CARTIFY // SECURE ASSET ACQUISITION</p>
                <p className="font-black text-2xl mt-1">TRANSACTION LEDGER</p>
              </div>
              <img src={logo} alt="" className="h-12 w-auto grayscale contrast-125" />
            </div>
            <p className="mb-6 break-all">------------------------------------------------</p>

            <div className="mb-6 grid grid-cols-2 gap-2">
              <div>
                <span className="font-bold">ORDER ID:</span><br/>
                <span>#{id}</span>
              </div>
              <div className="text-right">
                <span className="font-bold">TIMESTAMP:</span><br/>
                <span>{timestamp}</span>
              </div>
              <p className="col-span-2 break-all">------------------------------------------------</p>
            </div>

            <div className="mb-6">
              <p className="font-bold underline mb-2">RECIPIENT DOSSIER</p>
              <div className="space-y-1 uppercase">
                <p>NAME: {buyerName}</p>
                <p>EMAIL: {buyerEmail}</p>
                <p className="break-words">DROP: {buyerAddress}, {buyerCity} {buyerZip}</p>
              </div>
              <p className="mt-4 break-all">------------------------------------------------</p>
            </div>

            <div className="mb-6">
              <p className="font-bold underline mb-2">ACQUIRED ASSETS</p>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-[3px] border-dotted border-on-background">
                    <th className="py-2 pr-4">ITEM</th>
                    <th className="py-2 px-4">QTY</th>
                    <th className="py-2 pl-4 text-right">PRICE</th>
                  </tr>
                </thead>
                <tbody>
                  {items?.map((item, i) => (
                    <tr key={i}>
                      <td className="py-2 pr-4 uppercase line-clamp-1">{item.title}</td>
                      <td className="py-2 px-4 leading-none">0{item.quantity}</td>
                      <td className="py-2 pl-4 text-right">{formatPrice(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-4 break-all">------------------------------------------------</p>
            </div>
            <div className="mb-8 space-y-1">
              <div className="flex justify-between">
                <span>SUBTOTAL:</span>
                <span>{formatPrice(rawSubtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-secondary">
                  <span>DISCOUNT (20%):</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>TAX (10%):</span>
                <span>{formatPrice(rawTax)}</span>
              </div>
              <div className="flex justify-between items-center pt-4">
                <span className="text-xl font-black">TOTAL:</span>
                <span className="text-xl font-black bg-primary-container px-3 py-2 border-[3px] border-on-background inline-block">{formatPrice(total)}</span>
              </div>
            </div>

            <div className="text-center">
              <p className="mt-4 break-all">------------------------------------------------</p>
              <p className="font-bold tracking-widest mt-4 text-xs">PROTOCOL COMPLETE. END OF TRANSMISSION.</p>
            </div>

            {/* Visual Stamp Decor */}
            <div className="mt-12 opacity-20 flex justify-center grayscale">
              <div className="border-[8px] border-on-background px-8 py-4 rounded-full font-black text-4xl -rotate-12 select-none tracking-widest">
                APPROVED
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default ReceiptTemplate;

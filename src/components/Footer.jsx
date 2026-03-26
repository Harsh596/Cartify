import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../assets/logof.svg';

export default function Footer() {
  return (
    <footer className="w-full border-t-[5px] border-on-background mt-20 bg-secondary-fixed flex flex-col md:flex-row justify-between items-center p-12 gap-8 font-headline font-bold uppercase">
      <div className="flex items-center gap-2 text-xl font-black text-on-background">
          <img src={logo} alt="" className="h-6 w-auto" />
          CARTIFY STUDIOS
      </div>
      <div className="flex flex-wrap justify-center gap-8">
          <button onClick={() => toast.info("By acquiring these assets, you agree to secure the drip at all costs.", { icon: "📜", autoClose: 5000 })} className="no-underline hover:text-secondary hover:scale-105 transition-all text-on-background">Terms</button>
          <button onClick={() => toast.info("CARTIFY SECURE PROTOCOL: We do not track your coordinates. Your ledger is stored locally in your browser cache.", { icon: "🕵️", autoClose: 6000 })} className="no-underline hover:text-secondary hover:scale-105 transition-all text-on-background">Privacy</button>
          <button onClick={() => toast.info("Submit your comm-link request. Current response time: [REDACTED].", { icon: "📡", autoClose: 5000 })} className="no-underline hover:text-secondary hover:scale-105 transition-all text-on-background">Support</button>
          <button onClick={() => toast.info("Comms lines jammed. Try again later.", { icon: "📻" })} className="no-underline hover:text-secondary hover:scale-105 transition-all text-on-background">Contact</button>
      </div>
      <div className="text-on-background text-sm text-center md:text-right opacity-80">
          © 2026 CARTIFY STUDIOS. ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
}

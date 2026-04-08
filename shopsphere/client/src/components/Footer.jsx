import { Link } from 'react-router-dom';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 bg-slate-950 text-slate-100">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <p className="display-font text-3xl font-bold">ShopSphere</p>
          <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">
            A fashion-first commerce experience with better styling, stronger brand identity, and scalable architecture.
          </p>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-400">Explore</p>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <Link to="/">Home</Link>
            <Link to="/shop" className="block">Shop</Link>
            <Link to="/register" className="block">Create account</Link>
            <Link to="/studio" className="block">Studio</Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-400">Support</p>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <Link to="/orders">Orders</Link>
            <Link to="/profile" className="block">Profile</Link>
            <a href="mailto:hello@shopsphere.com" className="block">hello@shopsphere.com</a>
            <a href="tel:+919876543210" className="block">+91 98765 43210</a>
          </div>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-400">Why It Stands Out</p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
            <li>Curated storefront with a stronger editorial look</li>
            <li>Cookie-based login and protected customer flows</li>
            <li>High-performance backend database integration</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 px-4 py-6 text-center text-sm text-slate-500 sm:px-6 lg:px-8">
        Copyright {year} ShopSphere. Crafted for modern commerce.
      </div>
    </footer>
  );
}

export default Footer;

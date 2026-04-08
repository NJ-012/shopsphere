import { Link } from 'react-router-dom';
import useCartStore from '../store/cartStore';

function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore();
  const total = getTotalPrice();

  return (
    <div className="px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="display-font text-4xl font-bold text-slate-950">Your cart</h1>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {items.length ? items.map((item) => (
              <div key={`${item.prod_id}-${item.variant_id || 'base'}`} className="glass-panel rounded-[2rem] p-4">
                <div className="flex gap-4">
                  <img src={item.image_url} alt={item.prod_name} className="h-28 w-28 rounded-2xl object-cover" />
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.vendor_name}</p>
                    <h3 className="mt-1 font-semibold text-slate-900">{item.prod_name}</h3>
                    <p className="mt-3 text-sm font-bold text-slate-900">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                    <div className="mt-4 flex items-center gap-2">
                      <button type="button" onClick={() => updateQuantity(item.prod_id, item.variant_id, item.quantity - 1)} className="h-9 w-9 rounded-full border border-slate-300">-</button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.prod_id, item.variant_id, item.quantity + 1)} className="h-9 w-9 rounded-full border border-slate-300">+</button>
                    </div>
                  </div>
                  <button type="button" onClick={() => removeItem(item.prod_id, item.variant_id)} className="text-sm font-semibold text-rose-500">
                    Remove
                  </button>
                </div>
              </div>
            )) : (
              <div className="mesh-card rounded-[2rem] p-10 text-center">
                <p className="display-font text-2xl font-bold text-slate-900">Your cart is empty</p>
                <Link to="/shop" className="mt-6 inline-block rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white">
                  Explore products
                </Link>
              </div>
            )}
          </div>

          <aside className="glass-panel h-fit rounded-[2rem] p-6">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-slate-500">Summary</p>
            <div className="mt-6 flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold">Rs. {total.toLocaleString()}</span>
            </div>
            <div className="mt-3 flex justify-between">
              <span>Shipping</span>
              <span className="font-bold">{total >= 999 ? 'Free' : 'Rs. 49'}</span>
            </div>
            <Link to="/checkout" className="mt-8 block rounded-full bg-slate-900 px-5 py-4 text-center text-sm font-bold text-white">
              Continue to checkout
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default CartPage;

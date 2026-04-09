import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ArrowRight, ShoppingBag, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/cartStore';

function CartDrawer({ isOpen, onClose }) {
  const { items, removeItem, updateQuantity, getTotalItems, getTotalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const shipping = totalPrice >= 999 ? 0 : 49;

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <button
            type="button"
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-900/50"
          />

          <aside className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-[#fffdf8] shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-6">
              <div>
                <p className="display-font text-2xl font-bold text-slate-900">Cart</p>
                <p className="text-sm text-slate-500">{totalItems} item(s)</p>
              </div>
              <button type="button" onClick={onClose} className="rounded-full bg-white p-2 shadow">
                <X className="h-5 w-5 text-slate-700" />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              {!items.length ? (
                <div className="mesh-card rounded-[2rem] p-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow">
                    <ShoppingBag className="h-8 w-8 text-slate-700" />
                  </div>
                  <p className="display-font text-xl font-bold text-slate-900">Your bag is still empty.</p>
                  <p className="mt-2 text-sm text-slate-500">Add a few signature picks and they will appear here.</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={`${item.prod_id}-${item.variant_id || 'base'}`} className="rounded-[1.75rem] border border-slate-100 bg-white p-4 transition-all duration-300 hover:shadow-md">
                    <div className="flex gap-4">
                      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-50">
                        <img
                          src={item.image_url}
                          alt={item.prod_name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{item.vendor_name || item.shop_name}</p>
                          <h3 className="mt-1 line-clamp-1 text-sm font-semibold text-slate-900">{item.prod_name}</h3>
                        </div>
                        <div className="flex items-end justify-between">
                          <div className="flex items-center gap-1 rounded-full bg-slate-50 px-1 py-1 ring-1 ring-inset ring-slate-200">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.prod_id, item.variant_id, item.quantity - 1)}
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm transition hover:text-slate-950"
                            >
                              -
                            </button>
                            <span className="w-6 text-center text-xs font-bold text-slate-900">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.prod_id, item.variant_id, item.quantity + 1)}
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm transition hover:text-slate-950"
                            >
                              +
                            </button>
                          </div>
                          <p className="text-sm font-extrabold text-slate-950">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.prod_id, item.variant_id)}
                        className="flex h-8 w-8 items-center justify-center self-start rounded-full text-slate-300 transition hover:bg-rose-50 hover:text-rose-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-slate-200 bg-white p-6">
              <div className="mb-4 space-y-2 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">Rs. {totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-slate-900">{shipping ? `Rs. ${shipping}` : 'Free'}</span>
                </div>
              </div>

              <button
                type="button"
                disabled={!items.length}
                onClick={() => {
                  onClose();
                  navigate('/checkout');
                }}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-4 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Checkout
                <ArrowRight className="h-4 w-4" />
              </button>

              {!!items.length && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="mt-3 w-full text-sm text-slate-500 transition hover:text-slate-900"
                >
                  Clear cart
                </button>
              )}
            </div>
          </aside>
        </>
      )}
    </AnimatePresence>
  );
}

export default CartDrawer;

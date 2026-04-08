import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import useCartStore from '../store/cartStore';
import useToastStore from '../store/toastStore';

function CheckoutPage() {
  const [address, setAddress] = useState({
    full_name: '',
    line1: '',
    city: '',
    state: '',
    postal_code: '',
    phone: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const { items, clearCart, getTotalPrice } = useCartStore();
  const toast = useToastStore();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        address,
        items: items.map((item) => ({
          prod_id: item.prod_id,
          quantity: item.quantity,
          unit_price: item.price,
          prod_name: item.prod_name,
          image_url: item.image_url,
          shop_name: item.vendor_name,
        })),
      };
      const { data } = await api.post('/orders', payload);
      clearCart();
      toast.success('Order placed successfully');
      navigate(`/orders/${data.order_id}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Checkout failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="display-font text-4xl font-bold text-slate-950">Checkout</h1>
        <form onSubmit={handleSubmit} className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="glass-panel rounded-[2rem] p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ['full_name', 'Full name'],
                ['phone', 'Phone'],
                ['line1', 'Address line'],
                ['city', 'City'],
                ['state', 'State'],
                ['postal_code', 'Postal code'],
              ].map(([key, label]) => (
                <label key={key} className={key === 'line1' ? 'sm:col-span-2' : ''}>
                  <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
                  <input
                    value={address[key]}
                    onChange={(event) => setAddress((current) => ({ ...current, [key]: event.target.value }))}
                    className="w-full rounded-2xl bg-white px-4 py-3 outline-none"
                    required
                  />
                </label>
              ))}
            </div>
          </div>

          <aside className="glass-panel h-fit rounded-[2rem] p-6">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-slate-500">Order summary</p>
            <div className="mt-5 space-y-3 text-sm text-slate-600">
              {items.map((item) => (
                <div key={`${item.prod_id}-${item.variant_id || 'base'}`} className="flex justify-between gap-3">
                  <span>{item.prod_name} x {item.quantity}</span>
                  <span className="font-semibold text-slate-900">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-between border-t border-slate-200 pt-4">
              <span>Total</span>
              <span className="font-bold text-slate-900">Rs. {getTotalPrice().toLocaleString()}</span>
            </div>
            <button type="submit" disabled={!items.length || submitting} className="mt-6 w-full rounded-full bg-slate-900 px-5 py-4 text-sm font-bold text-white disabled:opacity-60">
              {submitting ? 'Placing order...' : 'Place order'}
            </button>
          </aside>
        </form>
      </div>
    </div>
  );
}

export default CheckoutPage;

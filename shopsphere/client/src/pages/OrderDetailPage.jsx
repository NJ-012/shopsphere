import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axiosConfig';

function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then(({ data }) => setOrder(data)).catch(() => setOrder(null));
  }, [id]);

  if (!order) {
    return <div className="px-4 pb-16 pt-28 sm:px-6 lg:px-8">Loading order...</div>;
  }

  return (
    <div className="px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="glass-panel rounded-[2rem] p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Order #{order.order_id}</p>
          <h1 className="display-font mt-3 text-4xl font-bold text-slate-950">{order.status}</h1>
          <p className="mt-2 text-slate-600">Payment: {order.payment_status}</p>

          <div className="mt-8 space-y-4">
            {(order.items || []).map((item) => (
              <div key={`${item.prod_id}-${item.prod_name}`} className="rounded-[1.5rem] bg-white p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">{item.prod_name || `Product #${item.prod_id}`}</p>
                    <p className="text-sm text-slate-500">Qty {item.quantity}</p>
                  </div>
                  <p className="font-bold text-slate-900">Rs. {(item.unit_price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailPage;

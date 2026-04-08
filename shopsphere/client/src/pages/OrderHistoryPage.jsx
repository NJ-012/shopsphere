import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';

function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders').then(({ data }) => setOrders(data || [])).catch(() => setOrders([]));
  }, []);

  return (
    <div className="px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="display-font text-4xl font-bold text-slate-950">Orders</h1>
        <div className="mt-8 space-y-4">
          {orders.length ? orders.map((order) => (
            <Link key={order.order_id} to={`/orders/${order.order_id}`} className="glass-panel block rounded-[2rem] p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Order #{order.order_id}</p>
                  <p className="mt-2 font-semibold text-slate-900">{order.status}</p>
                </div>
                <p className="font-bold text-slate-900">Rs. {(order.final_amount || order.total_amount || 0).toLocaleString()}</p>
              </div>
            </Link>
          )) : (
            <div className="mesh-card rounded-[2rem] p-10 text-center">No orders yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderHistoryPage;

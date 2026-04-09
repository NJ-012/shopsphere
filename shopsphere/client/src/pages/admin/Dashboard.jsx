import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Store, ShoppingBag, ShieldAlert, CheckCircle2 } from 'lucide-react';
import api from '../../api/axiosConfig';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');
  const [data, setData] = useState({ users: [], vendors: [], orders: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [usersRes, vendorsRes, ordersRes] = await Promise.all([
          api.get('/admin/users'),
          api.get('/admin/vendors'),
          api.get('/admin/orders')
        ]);
        setData({
          users: usersRes.data,
          vendors: vendorsRes.data,
          orders: ordersRes.data
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const tabs = [
    { id: 'users', label: 'Users', icon: <Users size={18} /> },
    { id: 'vendors', label: 'Vendors', icon: <Store size={18} /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag size={18} /> },
  ];

  return (
    <div className="px-6 pb-24 pt-32 mx-auto max-w-7xl">
      <header className="mb-12">
        <h1 className="text-4xl font-display font-bold text-white mb-2">System Administration</h1>
        <p className="text-gray-500">Global overview across all platform entities.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="glass-card p-6 border-l-4 border-l-blue-500">
           <p className="text-sm font-bold text-gray-500 uppercase">Total Accounts</p>
           <p className="text-3xl font-bold text-white mt-1">{data.users.length}</p>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-amber-500">
           <p className="text-sm font-bold text-gray-500 uppercase">Active Vendors</p>
           <p className="text-3xl font-bold text-white mt-1">{data.vendors.length}</p>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-emerald-500">
           <p className="text-sm font-bold text-gray-500 uppercase">Total Sales</p>
           <p className="text-3xl font-bold text-white mt-1">{data.orders.length}</p>
        </div>
      </div>

      <div className="flex gap-2 mb-8 p-1.5 bg-white/5 rounded-2xl w-fit border border-white/5">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-amber-600 text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="glass-card border border-white/10 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-gray-500 font-medium">Synchronizing data vault...</div>
        ) : (
          <div className="overflow-x-auto">
            {activeTab === 'users' && <UsersTable users={data.users} />}
            {activeTab === 'vendors' && <VendorsTable vendors={data.vendors} />}
            {activeTab === 'orders' && <OrdersTable orders={data.orders} />}
          </div>
        )}
      </div>
    </div>
  );
}

function UsersTable({ users }) {
  return (
    <table className="w-full text-left">
      <thead className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-white/10">
        <tr>
          <th className="px-6 py-4">ID</th>
          <th className="px-6 py-4">User</th>
          <th className="px-6 py-4">Role</th>
          <th className="px-6 py-4">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/5">
        {users.map(u => (
          <tr key={u.user_id} className="hover:bg-white/[0.02]">
            <td className="px-6 py-4 text-xs font-mono text-gray-600">#{u.user_id}</td>
            <td className="px-6 py-4">
               <p className="font-bold text-white text-sm">{u.full_name}</p>
               <p className="text-xs text-gray-500">{u.email}</p>
            </td>
            <td className="px-6 py-4">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.role === 'ADMIN' ? 'bg-amber-500/20 text-amber-500' : u.role === 'VENDOR' ? 'bg-purple-500/20 text-purple-500' : 'bg-blue-500/20 text-blue-500'}`}>
                {u.role}
              </span>
            </td>
            <td className="px-6 py-4">
              <span className="flex items-center gap-1.5 text-xs text-emerald-500 font-bold">
                <CheckCircle2 size={12} /> Active
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function VendorsTable({ vendors }) {
  return (
    <table className="w-full text-left">
      <thead className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-white/10">
        <tr>
          <th className="px-6 py-4">Shop</th>
          <th className="px-6 py-4">Owner</th>
          <th className="px-6 py-4">Verified</th>
          <th className="px-6 py-4 text-right">Control</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/5">
        {vendors.map(v => (
          <tr key={v.vendor_id} className="hover:bg-white/[0.02]">
            <td className="px-6 py-4 font-bold text-white text-sm">{v.shop_name}</td>
            <td className="px-6 py-4">
               <p className="font-medium text-white text-sm">{v.full_name}</p>
               <p className="text-xs text-gray-500">{v.email}</p>
            </td>
            <td className="px-6 py-4 text-sm font-semibold">{v.is_verified ? <span className="text-emerald-500">Verified</span> : <span className="text-amber-500">Pending</span>}</td>
            <td className="px-6 py-4 text-right">
              <button className="text-xs font-bold text-amber-500 hover:underline">Manage</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function OrdersTable({ orders }) {
  return (
    <table className="w-full text-left">
      <thead className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-white/10">
        <tr>
          <th className="px-6 py-4">Order ID</th>
          <th className="px-6 py-4">Customer</th>
          <th className="px-6 py-4">Amount</th>
          <th className="px-6 py-4">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/5">
        {orders.map(o => (
          <tr key={o.order_id} className="hover:bg-white/[0.02]">
            <td className="px-6 py-4 text-xs font-mono text-amber-500">#{o.order_id}</td>
            <td className="px-6 py-4 text-sm font-bold text-white">{o.customer_name || 'Anonymous'}</td>
            <td className="px-6 py-4 text-sm font-bold text-white">Rs. {o.final_amount}</td>
            <td className="px-6 py-4">
               <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-800 text-gray-400">{o.order_status}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

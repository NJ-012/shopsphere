import useAuthStore from '../store/authStore';

function ProfilePage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="glass-panel rounded-[2.5rem] p-8">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-amber-600">Profile</p>
          <h1 className="display-font mt-3 text-4xl font-bold text-slate-950">{user?.full_name}</h1>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] bg-white p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Email</p>
              <p className="mt-2 font-semibold text-slate-900">{user?.email}</p>
            </div>
            <div className="rounded-[1.5rem] bg-white p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Role</p>
              <p className="mt-2 font-semibold text-slate-900">{user?.role}</p>
            </div>
            <div className="rounded-[1.5rem] bg-white p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Phone</p>
              <p className="mt-2 font-semibold text-slate-900">{user?.phone || 'Not available'}</p>
            </div>
            <div className="rounded-[1.5rem] bg-white p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Shop</p>
              <p className="mt-2 font-semibold text-slate-900">{user?.shop_name || 'Customer account'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;

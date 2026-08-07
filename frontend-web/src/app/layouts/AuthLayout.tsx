import { Outlet } from 'react-router-dom';
import { APP } from '@/constants/app';
import { FiShield } from 'react-icons/fi';

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary-100/70 to-transparent" />
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex flex-col items-center gap-3 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-500 text-white">
              <FiShield size={26} />
            </span>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                {APP.name} <span className="text-primary-500">Admin</span>
              </h1>
              <p className="mt-1 text-sm text-slate-500">Manage your ride-booking platform</p>
            </div>
          </div>
          <Outlet />
          <p className="mt-8 text-center text-xs text-slate-400">
            © 2026 {APP.companyName}. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
}

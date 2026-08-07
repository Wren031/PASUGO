import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLogOut, FiMenu } from 'react-icons/fi';
import { SIDEBAR_NAV, SIDEBAR_BADGES } from '@/constants/nav';
import { useSidebarStore } from '@/app/store/sidebar-store';
import { useAuthStore } from '@/app/store/auth-store';
import Sidebar from './Sidebar';
import Avatar from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const collapsed = useSidebarStore((state) => state.collapsed);
  const setMobileOpen = useSidebarStore((state) => state.setMobileOpen);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const currentItem = SIDEBAR_NAV.flatMap((group) => group.items).find(
    (item) => item.path === location.pathname || (item.path !== '/admin' && location.pathname.startsWith(item.path)),
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <div className={cn('flex min-w-0 flex-1 flex-col transition-[margin] duration-200', collapsed ? 'lg:ml-[76px]' : 'lg:ml-64')}>
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="rounded-lg border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-50 lg:hidden"
                aria-label="Open menu"
              >
                <FiMenu size={18} />
              </button>
              <div>
                <h2 className="text-sm font-bold text-slate-900">{currentItem?.label ?? 'Dashboard'}</h2>
                <p className="hidden text-xs text-slate-400 sm:block">
                  {new Date().toLocaleDateString('en-PH', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-500 md:flex">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>
                Platform Online
              </div>
              <div className="flex items-center gap-3 border-l border-slate-200 pl-3">
                <Avatar name={user?.name ?? 'Admin User'} size="md" />
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold leading-tight text-slate-900">{user?.name ?? 'Admin'}</p>
                  <p className="text-xs leading-tight text-primary-600">{user?.role ?? 'Super Admin'}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <FiLogOut size={16} />
                </button>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </main>
        <footer className="border-t border-slate-200 bg-white px-6 py-4 text-center text-xs text-slate-400">
          © 2026 HatodGo Transport Solutions Inc. — Admin Platform v1.0
        </footer>
      </div>
    </div>
  );
}

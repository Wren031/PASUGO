import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { SIDEBAR_NAV, SIDEBAR_BADGES } from '@/constants/nav';
import { useSidebarStore } from '@/app/store/sidebar-store';
import { cn } from '@/lib/utils';
import Logo from '@/components/common/Logo';

export default function Sidebar() {
  const collapsed = useSidebarStore((state) => state.collapsed);
  const mobileOpen = useSidebarStore((state) => state.mobileOpen);
  const toggleCollapsed = useSidebarStore((state) => state.toggleCollapsed);
  const setMobileOpen = useSidebarStore((state) => state.setMobileOpen);

  const sidebarContent = (
    <>
      <div className={cn('flex h-16 items-center border-b border-slate-200', collapsed ? 'justify-center px-2' : 'justify-between px-5')}>
        <NavLink to="/admin" className="flex items-center gap-2.5">
          <Logo size="sm" />
          {!collapsed && (
            <span className="text-base font-extrabold tracking-tight text-slate-900">
              HatodGo<span className="text-primary-500">.</span>
            </span>
          )}
        </NavLink>
        {!collapsed && (
          <button
            type="button"
            onClick={toggleCollapsed}
            className="hidden rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 lg:block"
            title="Collapse sidebar"
            aria-label="Collapse sidebar"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}
      </div>
      <nav className="scrollbar-none flex-1 overflow-y-auto px-3 py-4">
        {SIDEBAR_NAV.map((group) => (
          <div key={group.label} className="mb-5">
            {!collapsed && (
              <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">{group.label}</p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const badge = SIDEBAR_BADGES[item.path];
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      end={item.path === '/admin'}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          'group flex items-center gap-3 rounded-lg py-2 text-sm font-medium transition-colors',
                          collapsed ? 'justify-center px-0' : 'px-3',
                          isActive
                            ? 'bg-primary-50 text-primary-700'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                        )
                      }
                      title={item.label}
                    >
                      <Icon size={18} className={cn('shrink-0', collapsed ? '' : '')} />
                      {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                      {!collapsed && typeof badge === 'number' && (
                        <span className="rounded-full bg-primary-100 px-1.5 py-0.5 text-[10px] font-bold text-primary-700">
                          {badge}
                        </span>
                      )}
                      {collapsed && typeof badge === 'number' && (
                        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-primary-500" />
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className={cn('border-t border-slate-200 p-3', collapsed && 'flex justify-center')}>
        <div className={cn('rounded-lg border border-slate-200 bg-slate-50 p-3', collapsed && 'border-0 bg-transparent p-0')}>
          {collapsed ? (
            <span className="block text-center text-[10px] font-bold text-primary-500">v1.0</span>
          ) : (
            <p className="text-[11px] leading-relaxed text-slate-500">
              Need help? Contact <span className="font-semibold text-slate-700">support@hatodgo.ph</span>
            </p>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-slate-200 bg-white transition-all duration-200 lg:flex',
          collapsed ? 'w-[76px]' : 'w-64',
        )}
      >
        {sidebarContent}
      </aside>
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 bg-slate-900/50"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-slate-200 bg-white"
            >
              <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
                <div className="flex items-center gap-2.5">
                  <Logo size="sm" />
                  <span className="text-base font-extrabold tracking-tight text-slate-900">
                    HatodGo<span className="text-primary-500">.</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100"
                  aria-label="Close menu"
                >
                  <FiX size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">{sidebarContent}</div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

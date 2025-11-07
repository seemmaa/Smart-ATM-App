import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../Context/authSContext';

import {
  HomeIcon,
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  ClockIcon,
  StarIcon,
  Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon,
} from '@heroicons/react/24/outline';

export default function Layout() {
  const { logout } = useAuthStore();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
    { name: 'Deposit', path: '/deposit', icon: ArrowDownCircleIcon },
    { name: 'Withdraw', path: '/withdraw', icon: ArrowUpCircleIcon },
    { name: 'History', path: '/history', icon: ClockIcon },
    { name: 'Watchlist', path: '/watchlist', icon: StarIcon },
    { name: 'Settings', path: '/settings', icon: Cog6ToothIcon },
  ];

  return (
    <div className="flex min-h-screen bg-gray-200">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-60 bg-gray-900 text-white flex flex-col justify-between py-6 px-4 shadow-lg">
        {/* Top nav */}
        <nav className="flex flex-col space-y-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
          flex items-center gap-3 py-2 px-3 rounded-lg font-medium transition
          ${
            isActive
              ? 'bg-blue-600! text-white! shadow'
              : 'text-gray-300! hover:bg-gray-700! hover:text-white'
          }
        `}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions (Settings + Logout) */}
        <div className="flex flex-col space-y-3">
          {/* <Link
            to="/settings"
            className={`
              py-2 px-3 rounded-lg font-medium transition
              ${
                location.pathname === '/settings'
                  ? 'bg-blue-600! text-white! shadow'
                  : 'text-gray-300! hover:bg-gray-700! hover:text-white'
              }
            `}
          >
            Settings
          </Link> */}

          <button
            onClick={logout}
            className="flex items-center gap-3 py-2 px-3 bg-red-500! hover:bg-red-600! text-white! rounded-lg font-medium transition"
          >
            <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 ml-60 overflow-y-auto">
        <div
          className="
      w-full min-h-[calc(100vh-48px)]
      bg-white/80 dark:bg-gray-800/60
      backdrop-blur-md shadow-xl
      rounded-2xl p-6
      border border-white/20
      text-black dark:text-white
    "
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}

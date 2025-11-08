import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../Context/authSContext";

import {
  HomeIcon,
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  ClockIcon,
  StarIcon,
  Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";

export default function Layout() {
  const { logout } = useAuthStore();
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: HomeIcon },
    { name: "Deposit", path: "/deposit", icon: ArrowDownCircleIcon },
    { name: "Withdraw", path: "/withdraw", icon: ArrowUpCircleIcon },
    { name: "History", path: "/history", icon: ClockIcon },
    { name: "Watchlist", path: "/watchlist", icon: StarIcon },
    { name: "Settings", path: "/settings", icon: Cog6ToothIcon },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-200">
      {/* Sidebar */}
      <aside className="w-60 h-full bg-gray-900 text-white flex flex-col justify-between py-6 px-4 shadow-lg">
        <nav className="flex flex-col space-y-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 py-2 px-3 rounded-lg font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-col space-y-3">
          <button
            onClick={logout}
            className="flex items-center gap-3 py-2 px-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition"
          >
            <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 h-full overflow-hidden p-6">
        <Outlet />
      </main>
    </div>
  );
}

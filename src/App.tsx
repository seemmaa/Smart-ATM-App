import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './Pages/Layout';
import ProtectedRoute from './Component/ProtectedRoute';

const Login = lazy(() => import('./Pages/login'));
const Dashboard = lazy(() => import('./Pages/dashboard'));
const Deposit = lazy(() => import('./Pages/deposit'));
const WithDraw = lazy(() => import('./Pages/withdraw'));
const History = lazy(() => import('./Pages/history'));
const WatchList = lazy(() => import('./Pages/watchlist'));
const Settings = lazy(() => import('./Pages/settings'));
const NotFound = lazy(() => import('./Pages/not_found'));

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Routes>
        {/* Login page does not use the main layout */}
        <Route path="/" element={<Login />} />

        {/* All other pages use the Layout and Protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/deposit" element={<Deposit />} />
            <Route path="/withdraw" element={<WithDraw />} />
            <Route path="/history" element={<History />} />
            <Route path="/watchlist" element={<WatchList />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;

// src/pages/Dashboard.tsx
import { useAuthStore } from '../Context/authSContext';

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <p>Loading user data...</p>;
  }

  return (
    <div>
      <h1>
        Welcome, {user.first_name} {user.last_name}!
      </h1>
      <p>Username: {user.user_name}</p>
      {user.profile_img && <img src={user.profile_img} alt={user.user_name} width={100} />}
    </div>
  );
}

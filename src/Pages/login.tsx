import { useAuthStore } from '../Context/authSContext';
import { useNavigate } from 'react-router-dom';
import { useState, type FormEvent } from 'react';
import type { UserInfo } from '../Types/userInfo';

export default function Login() {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const [userName, setUserName] = useState('');
  const [pin, setPin] = useState('');

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      console.log(userName);
      console.log(pin);
      const res = await fetch(`https://69060c47ee3d0d14c134982d.mockapi.io/users`);
      const users: UserInfo[] = await res.json();
      const user = users.find((user) => {
        return user.user_name === userName && user.pin === pin;
      });
      console.log(user);
      if (!user) {
        alert('❌ Invalid username or PIN');
        return;
      }

      login(user);
      navigate('/dashboard');
    } catch (er) {
      alert('⚠️ Failed to connect to API' + er);
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleLogin}>
        <input
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Username"
        />
        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="PIN"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

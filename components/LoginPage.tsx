import React, { useState, useCallback } from 'react';
import { ADMIN_USERNAME, ADMIN_PASSWORD } from '../constants';
import Card from './common/Card';
import Button from './common/Button';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setError('');
      onLoginSuccess();
    } else {
      setError('Invalid username or password.');
    }
  }, [username, password, onLoginSuccess]);

  return (
    <div className="container mx-auto max-w-sm">
      <Card title="Staff Login">
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="password123"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div>
            <Button type="submit" fullWidth>
              Login
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
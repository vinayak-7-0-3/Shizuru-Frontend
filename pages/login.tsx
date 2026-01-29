import { useState } from 'react';
import { useRouter } from 'next/router';
import AuthForm from '../components/auth/AuthForm';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        if (res.status === 500) {
          router.push('/500');
          return;
        }
        const data = await res.json();
        setError(data.detail || 'Login failed');
        return;
      }

      router.push('/');
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to connect to server');
      // optional: router.push('/500'); if we want to be very aggressive
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-900 via-neutral-900 to-black">
      <AuthForm
        title="🔐 Login"
        form={form}
        setForm={setForm}
        onSubmit={handleLogin}
        buttonLabel="Login"
        error={error}
        link={{
          href: "/register",
          label: "Register now",
          text: "No account?"
        }}
      />
    </div>
  );
}

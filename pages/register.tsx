import { useState } from 'react';
import { useRouter } from 'next/router';
import AuthForm, { AuthFormState } from '../components/auth/AuthForm';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<AuthFormState>({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/register', {
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
        setError(data.detail || 'Registration failed');
        return;
      }

      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => router.push('/login'), 1500);
    } catch (err) {
      console.error('Registration error:', err);
      setError('Failed to connect to server');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-900 via-neutral-900 to-black">
      <AuthForm
        title="✨ Register"
        form={form}
        setForm={setForm}
        onSubmit={handleRegister}
        buttonLabel="Register"
        showEmail
        error={error}
        success={success}
        link={{
          href: "/login",
          label: "Login",
          text: "Already have an account?"
        }}
      />
    </div>
  );
}

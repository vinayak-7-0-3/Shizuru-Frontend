import { useState } from 'react';
import { useRouter } from 'next/router';
import AuthForm from '../components/auth/AuthForm';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    if (res.ok) {
      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => router.push('/login'), 1500);
    } else {
      setError(data.detail || 'Registration failed');
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

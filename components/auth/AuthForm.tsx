import Input from './Input';
import Button from './Button';
import Link from 'next/link';

export interface AuthFormState {
  username?: string;
  password?: string;
  email?: string;
  [key: string]: string | undefined;
}

interface Props {
  title: string;
  form: AuthFormState;
  setForm: (v: AuthFormState) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  buttonLabel: string;
  link?: { href: string; label: string; text: string };
  error?: string;
  success?: string;
  showEmail?: boolean;
}

export default function AuthForm({
  title,
  form,
  setForm,
  onSubmit,
  buttonLabel,
  link,
  error,
  success,
  showEmail = false
}: Props) {
  return (
    <form onSubmit={onSubmit} className="bg-zinc-950 p-8 rounded-2xl shadow-lg w-96 space-y-5 text-white">
      <h2 className="text-3xl font-bold text-center">{title}</h2>

      {error && <p className="text-red-500 text-center">{error}</p>}
      {success && <p className="text-green-400 text-center">{success}</p>}

      <Input placeholder="Username" value={form.username || ''} onChange={(e) => setForm({ ...form, username: e.target.value })} />

      {showEmail && (
        <Input placeholder="Email (optional)" type="email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      )}

      <Input placeholder="Password" type="password" value={form.password || ''} onChange={(e) => setForm({ ...form, password: e.target.value })} />

      <Button>{buttonLabel}</Button>

      {link && (
        <p className="text-center text-sm text-zinc-400">
          {link.text}{' '}
          <Link href={link.href} className="text-blue-400 hover:underline">
            {link.label}
          </Link>
        </p>
      )}
    </form>
  );
}

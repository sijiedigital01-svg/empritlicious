'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { login } from './actions';
import ThemeStyle from '@/components/admin/ThemeStyle';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-[var(--accent-dark)] py-3 text-sm font-semibold text-white disabled:opacity-60"
    >
      {pending ? 'Memproses...' : 'Masuk'}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useFormState(login, {});

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)]">
      <ThemeStyle />
      <form
        action={formAction}
        className="w-[340px] rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-10 text-center shadow-sm"
      >
        <div
          className="text-2xl text-[var(--accent-dark)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Empritlicious
        </div>
        <div className="mb-7 mt-1 text-sm text-[var(--ink-soft)]">
          Admin panel · masuk untuk kelola toko
        </div>

        {state?.error && (
          <div className="mb-4 rounded-lg bg-[var(--red-bg)] px-3 py-2 text-left text-xs text-[var(--red)]">
            {state.error}
          </div>
        )}

        <div className="mb-4 text-left">
          <label className="mb-1.5 block text-xs font-medium text-[var(--ink-soft)]">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
          />
        </div>
        <div className="mb-5 text-left">
          <label className="mb-1.5 block text-xs font-medium text-[var(--ink-soft)]">
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
          />
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}

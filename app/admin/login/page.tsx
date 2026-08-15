'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Welcome back, Sangram.');
    router.push('/admin');
    router.refresh(); // ensures middleware re-evaluates session
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 pt-24">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-2xl border border-neon-pink/20 bg-grit p-8"
      >
        <div className="mb-6 flex items-center justify-center gap-2">
          <Lock className="h-6 w-6 text-neon-pink" />
          <h1 className="font-street text-2xl text-white">
            ADMIN ACCESS
          </h1>
        </div>

        {/* Email */}
        <label className="mb-1 block text-xs uppercase tracking-widest text-white/50">
          Email
        </label>

        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-lg border border-white/10 bg-charcoal px-4 py-3 text-white outline-none focus:border-neon-pink"
        />

        {/* Password */}
        <label className="mb-1 block text-xs uppercase tracking-widest text-white/50">
          Password
        </label>

        <div className="relative mb-6">
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-charcoal px-4 py-3 pr-12 text-white outline-none focus:border-neon-pink"
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 transition hover:text-neon-pink"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Sign In */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-neon-pink py-3 font-semibold uppercase tracking-widest text-charcoal transition hover:shadow-neon-glow disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
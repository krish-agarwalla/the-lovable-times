'use client';

import { logout } from '@/app/admin/actions';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const router = useRouter();

  return (
    <button
      onClick={async () => {
        await logout();
        router.push('/admin/login');
        router.refresh();
      }}
      className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm text-white/70 transition hover:border-neon-pink hover:text-neon-pink"
    >
      <LogOut className="h-4 w-4" /> Logout
    </button>
  );
}
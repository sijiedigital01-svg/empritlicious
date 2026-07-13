import Sidebar from '@/components/admin/Sidebar';
import ThemeStyle from '@/components/admin/ThemeStyle';
import { createClient } from '@/lib/supabase/server';

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <ThemeStyle />
      <Sidebar adminEmail={user?.email ?? ''} />
      <div className="ml-[230px] min-h-screen">{children}</div>
    </div>
  );
}

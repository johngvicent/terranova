import { auth, signOut } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Panel Admin",
};

export default async function AdminLayout({ children }) {
  const session = await auth();

  async function handleSignOut() {
    "use server";

    await signOut({ redirectTo: "/admin/login" });
  }

  // Login page renders without the admin chrome
  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar user={session.user} />
      <div className="flex-1 ml-64">
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div />
          <div className="flex items-center gap-3">
            <form action={handleSignOut}>
              <button
                type="submit"
                className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:border-primary hover:text-primary"
              >
                Cerrar sesión
              </button>
            </form>
            <span className="text-sm text-text-muted">{session.user.email}</span>
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
              {session.user.name?.[0]?.toUpperCase() || "A"}
            </div>
          </div>
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}

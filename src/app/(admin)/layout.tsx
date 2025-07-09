import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/admin-sidebar";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'ADMIN') {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen">
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 p-8">
          <SidebarTrigger />
            {children}
        </main>
      </SidebarProvider>
    </div>
  );
}
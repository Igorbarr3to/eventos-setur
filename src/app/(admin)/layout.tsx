// app/admin/layout.tsx
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'ADMIN') {
    redirect("/login");
  }
  
  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
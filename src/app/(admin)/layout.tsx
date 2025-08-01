import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Navbar } from "@/components/navigation/admin-navbar";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col">
        <Navbar />     
        <main className="flex-1"> 
            {children}
        </main>
    </div>
  );
}
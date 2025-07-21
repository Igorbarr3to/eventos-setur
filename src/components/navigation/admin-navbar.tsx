'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {Menu, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SingOutButton from './signOut-button';

const navItems = [
  { title: "Home", href: "/dashboard",},
  { title: "Usuários", href: "/usuarios",},
  { title: "Pesquisas", href: "/pesquisas",},
];

export function Navbar() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const userInitials = session?.user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <header className="sticky px-2 top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        
        <Link href="/dashboard" className="text-xl font-bold">
          MoniTUR
        </Link>

        {/* Navegação para Desktop (escondida em telas pequenas) */}
        <nav className="hidden md:flex items-center gap-4">
          {navItems.map((item) => (
            <Link key={item.title} href={item.href} passHref>
              <Button className='hover:border-b border-b-blue-700'>{item.title}</Button>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {/* Menu do Usuário (Desktop) */}
          <div className="hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src={session?.user?.image ?? ''} alt={session?.user?.name ?? ''} />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-zinc-50" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{session?.user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <SingOutButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Botão Sanduíche e Menu Mobile (só aparece em telas pequenas) */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Conteúdo do Menu Mobile Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden animate-in fade-in-20 slide-in-from-top-2">
          <div className="grid gap-2 p-4">
            {navItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center rounded-md p-2 text-sm font-medium hover:bg-accent"
              >
                {item.title}
              </Link>
            ))}
            <div className='border-t pt-2'>
               <SingOutButton />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
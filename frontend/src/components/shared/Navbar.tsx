"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, ShoppingCart, LogOut, Menu, CarFront } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/useUserStore";
import { useCartStore } from "@/store/useCartStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const pathname = usePathname();
  const { user, setUser } = useUserStore();
  const items = useCartStore((state) => state.items);
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  const navigations = [
    { name: "Marketplace", href: "/marketplace" },
    { name: "Peças", href: "/parts" },
    { name: "Serviços", href: "/services" },
  ];

  const handleLogout = () => {
    // In a real app with Firebase auth: signOut(auth).then(() => setUser(null));
    setUser(null);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Mobile menu */}
        <div className="md:hidden flex items-center">
          <Sheet>
            {/* @ts-ignore: Radix UI asChild type alignment issue with React 19 */}
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <Link href="/" className="flex items-center gap-2 mb-8">
                <CarFront className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl tracking-tight">Auto-Genius</span>
              </Link>
              <nav className="flex flex-col gap-4 text-lg font-medium">
                {navigations.map((nav) => (
                  <Link
                    key={nav.href}
                    href={nav.href}
                    className={`transition-colors hover:text-primary ${
                      pathname === nav.href ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {nav.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo (Desktop & Mobile) */}
        <Link href="/" className="flex items-center gap-2 mr-6">
          <CarFront className="h-8 w-8 text-primary group-hover:animate-pulse" />
          <span className="font-extrabold text-2xl tracking-tighter hidden sm:inline-block bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
            AUTO-GENIUS
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 flex-1 justify-center text-sm font-medium">
          {navigations.map((nav) => (
            <Link
              key={nav.href}
              href={nav.href}
              className={`transition-all hover:text-primary relative py-2 ${
                pathname === nav.href
                  ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary"
                  : "text-muted-foreground"
              }`}
            >
              {nav.name}
            </Link>
          ))}
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative group">
              <ShoppingCart className="h-5 w-5 transition-transform group-hover:scale-110" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-primary animate-in zoom-in">
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </Link>
          
          {user ? (
            <DropdownMenu>
              {/* @ts-ignore: Radix UI asChild type alignment issue with React 19 */}
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full bg-muted overflow-hidden border">
                   {/* Simplified avatar for now, can be an image later */}
                  <span className="font-bold text-xs uppercase">{user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                  <Badge variant="outline" className="mt-2 w-fit">{user.level}</Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* @ts-ignore: Radix UI asChild type alignment issue with React 19 */}
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil & Recompensas</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" className="hidden sm:inline-flex">Entrar</Button>
              </Link>
              <Link href="/register">
                <Button>Criar Conta</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

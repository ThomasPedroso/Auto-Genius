import Link from "next/link";
import { CarFront, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t bg-background pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <CarFront className="h-8 w-8 text-primary" />
              <span className="font-extrabold text-2xl tracking-tighter bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
                AUTO-GENIUS
              </span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Your premium automotive marketplace. Experience the future of car buying, parts shopping, and maintenance scheduling.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">Marketplace</h3>
            <ul className="space-y-3">
              <li><Link href="/marketplace" className="text-muted-foreground hover:text-primary text-sm transition-colors">Browse Cars</Link></li>
              <li><Link href="/marketplace?condition=new" className="text-muted-foreground hover:text-primary text-sm transition-colors">New Vehicles</Link></li>
              <li><Link href="/marketplace?condition=used" className="text-muted-foreground hover:text-primary text-sm transition-colors">Used Vehicles</Link></li>
              <li><Link href="/sell" className="text-muted-foreground hover:text-primary text-sm transition-colors">Sell Your Car</Link></li>
            </ul>
          </div>

          {/* Store */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">Store & Services</h3>
            <ul className="space-y-3">
              <li><Link href="/parts" className="text-muted-foreground hover:text-primary text-sm transition-colors">Parts Catalog</Link></li>
              <li><Link href="/accessories" className="text-muted-foreground hover:text-primary text-sm transition-colors">Accessories</Link></li>
              <li><Link href="/services" className="text-muted-foreground hover:text-primary text-sm transition-colors">Schedule Service</Link></li>
              <li><Link href="/offers" className="text-muted-foreground hover:text-primary text-sm transition-colors">Special Offers</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary text-sm transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary text-sm transition-colors">Contact</Link></li>
              <li><Link href="/careers" className="text-muted-foreground hover:text-primary text-sm transition-colors">Careers</Link></li>
              <li><Link href="/faq" className="text-muted-foreground hover:text-primary text-sm transition-colors">FAQ</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Auto-Genius Marketplace. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

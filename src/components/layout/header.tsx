
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Rocket } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEffect, useState } from 'react';

const navLinks = [
  { href: '#hero', label: 'Home' },
  { href: '#intro', label: 'What is PE?' },
  { href: '#anatomy', label: 'Prompt Structure' },
  { href: '#workshop', label: 'Prompt Builder' },
  { href: '#comparison', label: 'Basic vs Engineered' },
  { href: '#analyzer', label: 'Prompt Analyzer' },
  { href: '#advanced', label: 'Advanced' },
  { href: '#articles', label: 'Articles' },
];

export function Header() {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
    isScrolled ? 'bg-background/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
  }`;

  if (!mounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md">
        <div className="w-full px-6 sm:px-10 lg:px-16 h-16 flex items-center justify-between">
          <Link href="#hero" className="flex items-center space-x-2 text-2xl font-bold text-primary">
            <Rocket className="h-7 w-7" />
            <span>Prompt Pavilion</span>
          </Link>
        </div>
      </header>
    );
  }
  
  return (
    <header className={headerClasses}>
      <div className="w-full px-6 sm:px-10 lg:px-16 h-16 flex items-center justify-between">
        <Link href="#hero" className="flex items-center space-x-2 text-2xl font-bold text-primary hover:text-accent transition-colors">
          <Rocket className="h-7 w-7" />
          <span>Prompt Pavilion</span>
        </Link>

        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-primary" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] bg-background/90 backdrop-blur-lg p-6">
              <nav className="flex flex-col space-y-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        ) : (
          <nav className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium text-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}

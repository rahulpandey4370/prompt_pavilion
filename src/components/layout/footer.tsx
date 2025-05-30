
"use client";

import React from 'react';

export function Footer() {
  const [currentYear, setCurrentYear] = React.useState(new Date().getFullYear());

  React.useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="py-8 border-t border-border/20 bg-background/50">
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 text-center text-muted-foreground">
        <p>&copy; {currentYear} Epicor Product Pavilion.</p>
        <p className="text-sm mt-1">Showcasing Prompt Engineering Excellence.</p>
      </div>
    </footer>
  );
}

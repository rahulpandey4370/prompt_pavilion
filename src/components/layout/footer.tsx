export function Footer() {
  return (
    <footer className="py-8 border-t border-border/20 bg-background/50">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} PromptCraft Studio. All rights reserved.</p>
        <p className="text-sm mt-1">Crafted with AI, Engineered for Precision.</p>
      </div>
    </footer>
  );
}

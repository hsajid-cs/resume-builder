import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, Menu } from "lucide-react";

export const Navbar = ({ onExport, onOpenSidebar }: { onExport: () => void; onOpenSidebar: () => void }) => {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onOpenSidebar}
            aria-label="Open sections sidebar"
            aria-haspopup="dialog"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="h-8 w-8 rounded-md bg-gradient-brand shadow-glow" aria-hidden />
          <span className="text-lg font-semibold tracking-tight">ResuCraft</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground">Dashboard</a>
          <a href="#" className="hover:text-foreground">Templates</a>
          <a href="#" className="hover:text-foreground">Guide</a>
        </nav>
        <div className="flex items-center gap-3">
          <Button variant="hero" onClick={onExport} aria-label="Export PDF">
            <Download /> Export PDF
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div className="size-8 rounded-full bg-muted" aria-hidden />
        </div>
      </div>
    </header>
  );
};

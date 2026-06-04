"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { Menu, X, Search } from "lucide-react";
import { CapyLogo } from "./capy-logo";
import { cn } from "@/lib/utils";
import { Container } from "./container";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { SearchDialog } from "@/components/shared/search-dialog";
import { KeyboardShortcut } from "@/components/shared/keyboard-shortcut";

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/ferramentas", label: "Ferramentas" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const openSearch = useCallback(() => setIsSearchOpen(true), []);

  return (
    <>
      {/* Skip to content — accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-lg focus:outline-none"
      >
        Pular para o conteúdo
      </a>

      <KeyboardShortcut onTrigger={openSearch} />

      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-200",
          isScrolled
            ? "border-b border-border bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70"
            : "border-b border-transparent bg-background"
        )}
      >
        <Container>
          <div className="flex h-14 items-center justify-between gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-foreground transition-opacity hover:opacity-75"
              aria-label="MyCapy - Início"
            >
              <CapyLogo size={26} />
              <span className="text-sm font-semibold tracking-tight">MyCapy</span>
            </Link>

            <nav className="hidden items-center gap-0.5 md:flex" aria-label="Navegação principal">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={openSearch}
                aria-label="Buscar ferramentas (Ctrl+K)"
              >
                <Search className="h-3.5 w-3.5" />
              </Button>
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-nav"
              >
                {isMenuOpen ? <X className="h-3.5 w-3.5" /> : <Menu className="h-3.5 w-3.5" />}
              </Button>
            </div>
          </div>

          {isMenuOpen && (
            <nav
              id="mobile-nav"
              className="border-t py-3 md:hidden"
              aria-label="Navegação mobile"
            >
              <ul className="flex flex-col gap-0.5">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        pathname === link.href
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </Container>
      </header>

      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  );
}

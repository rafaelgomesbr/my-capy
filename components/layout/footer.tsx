import Link from "next/link";
import { CapyLogo } from "./capy-logo";
import { Container } from "./container";
import { categories } from "@/lib/categories";
import { Separator } from "@/components/ui/separator";

const quickLinks = [
  { href: "/", label: "Início" },
  { href: "/ferramentas", label: "Todas as Ferramentas" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

const legalLinks = [
  { href: "/privacidade", label: "Política de Privacidade" },
  { href: "/termos", label: "Termos de Uso" },
  { href: "/contato", label: "Contato" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t">
      <Container className="py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-foreground"
              aria-label="MyCapy"
            >
              <CapyLogo size={24} />
              <span className="text-sm font-semibold tracking-tight">MyCapy</span>
            </Link>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Ferramentas gratuitas e online para facilitar o seu dia a dia. Sem cadastro, sem
              complicação.
            </p>
          </div>

          <div>
            <h3 className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground">Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground">Categorias</h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/ferramentas/${cat.slug}`}
                    className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} MyCapy. Todos os direitos reservados.
          </p>
          <p className="text-xs text-muted-foreground">
            Feito com dedicação para ajudar você
          </p>
        </div>
      </Container>
    </footer>
  );
}

import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <Container as="main" className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <SearchX className="mb-4 h-16 w-16 text-muted-foreground/50" />
      <h1 className="mb-2 text-4xl font-bold">Página não encontrada</h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        A página que você procura não existe ou foi movida. Explore nossas ferramentas disponíveis.
      </p>
      <div className="flex gap-4">
        <Link href="/">
          <Button>Voltar ao Início</Button>
        </Link>
        <Link href="/ferramentas">
          <Button variant="outline">Ver Ferramentas</Button>
        </Link>
      </div>
    </Container>
  );
}

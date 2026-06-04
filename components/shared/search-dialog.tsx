"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSearch } from "@/hooks/use-search";
import { categories } from "@/lib/categories";
import { cn } from "@/lib/utils";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const { query, setQuery, results, isSearching } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [open, setQuery]);

  function handleSelect(categorySlug: string, toolSlug: string) {
    router.push(`/ferramentas/${categorySlug}/${toolSlug}`);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-0 p-0">
        <DialogTitle className="sr-only">Buscar ferramentas</DialogTitle>
        <div className="flex items-center gap-3 border-b px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar ferramentas..."
            className="h-auto border-0 bg-transparent p-0 text-base shadow-none focus-visible:ring-0"
            aria-label="Buscar ferramentas"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Limpar busca"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {!isSearching && (
            <div className="p-4">
              <p className="mb-3 text-xs font-medium text-muted-foreground">CATEGORIAS</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => {
                      router.push(`/ferramentas/${cat.slug}`);
                      onOpenChange(false);
                    }}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                      cat.bgColor,
                      cat.color
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isSearching && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="mb-3 h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                Nenhuma ferramenta encontrada para &ldquo;{query}&rdquo;
              </p>
            </div>
          )}

          {isSearching && results.length > 0 && (
            <ul role="listbox" aria-label="Resultados da busca">
              {results.slice(0, 10).map((tool) => {
                const cat = categories.find((c) => c.slug === tool.category);
                return (
                  <li key={`${tool.category}/${tool.slug}`} role="option" aria-selected={false}>
                    <button
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-accent"
                      onClick={() => handleSelect(tool.category, tool.slug)}
                    >
                      <div className={cn("rounded-md p-1.5", cat?.bgColor)}>
                        <ArrowRight className={cn("h-3.5 w-3.5", cat?.color)} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{tool.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{tool.description}</p>
                      </div>
                      {cat && (
                        <Badge variant="secondary" className="shrink-0 text-xs">
                          {cat.name}
                        </Badge>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="border-t px-4 py-2">
          <p className="text-xs text-muted-foreground">
            Pressione <kbd className="rounded bg-muted px-1 py-0.5 font-mono text-xs">Esc</kbd>{" "}
            para fechar
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

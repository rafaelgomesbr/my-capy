import Link from "next/link";
import {
  Star,
  Sparkles,
  TrendingUp,
  Type,
  ArrowLeftRight,
  GraduationCap,
  Wrench,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tool } from "@/types";
import { categories } from "@/lib/categories";
import { cn } from "@/lib/utils";

const categoryIconMap: Record<string, React.ElementType> = {
  financas: TrendingUp,
  texto: Type,
  conversores: ArrowLeftRight,
  estudos: GraduationCap,
  criadores: Sparkles,
  utilidades: Wrench,
};

interface ToolCardProps {
  tool: Tool;
  className?: string;
}

export function ToolCard({ tool, className }: ToolCardProps) {
  const category = categories.find((c) => c.slug === tool.category);
  const Icon = categoryIconMap[tool.category] ?? Wrench;

  return (
    <Link
      href={`/ferramentas/${tool.category}/${tool.slug}`}
      className={cn("group block", className)}
      aria-label={`Acessar ${tool.name}`}
    >
      <div className="flex h-full flex-col rounded-lg border border-border bg-card p-4 transition-colors duration-150 hover:border-border/80 hover:bg-muted/30">
        <div className="mb-3 flex items-start justify-between gap-2">
          <Icon className={cn("h-4 w-4 shrink-0", category?.color ?? "text-muted-foreground")} aria-hidden="true" />
          {tool.popular && (
            <span className="text-[10px] font-medium uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Popular
            </span>
          )}
          {tool.new && !tool.popular && (
            <span className="text-[10px] font-medium uppercase tracking-wider text-primary">
              Novo
            </span>
          )}
        </div>

        <h3 className="mb-1.5 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
          {tool.name}
        </h3>
        <p className="mt-auto line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {tool.description}
        </p>
      </div>
    </Link>
  );
}

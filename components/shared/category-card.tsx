import Link from "next/link";
import {
  TrendingUp,
  Type,
  ArrowLeftRight,
  GraduationCap,
  Sparkles,
  Wrench,
  ArrowRight,
} from "lucide-react";
import { Category } from "@/types";
import { getToolsByCategory } from "@/lib/tools";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  TrendingUp,
  Type,
  ArrowLeftRight,
  GraduationCap,
  Sparkles,
  Wrench,
};

interface CategoryCardProps {
  category: Category;
  className?: string;
}

export function CategoryCard({ category, className }: CategoryCardProps) {
  const Icon = iconMap[category.icon] || Wrench;
  const toolCount = getToolsByCategory(category.slug).length;

  return (
    <Link
      href={`/ferramentas/${category.slug}`}
      className={cn("group block", className)}
      aria-label={`Ferramentas de ${category.name}: ${toolCount} ferramentas`}
    >
      <div className="flex h-full flex-col rounded-lg border border-border bg-card p-5 transition-colors duration-150 hover:border-border/80 hover:bg-muted/30">
        <div className="mb-4 flex items-start justify-between">
          <Icon className={cn("h-4 w-4", category.color)} aria-hidden="true" />
          <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {toolCount}
          </span>
        </div>

        <h3
          className="mb-1.5 font-semibold text-foreground transition-colors group-hover:text-primary"
          style={{ letterSpacing: "-0.01em" }}
        >
          {category.name}
        </h3>
        <p className="flex-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">
          {category.description}
        </p>

        <div
          className="mt-4 flex items-center gap-1 text-[11px] font-medium text-muted-foreground transition-colors group-hover:text-primary"
          aria-hidden="true"
        >
          Ver ferramentas <ArrowRight className="h-3 w-3" />
        </div>
      </div>
    </Link>
  );
}

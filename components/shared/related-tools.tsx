import { Tool } from "@/types";
import { ToolCard } from "./tool-card";

interface RelatedToolsProps {
  tools: Tool[];
  title?: string;
}

export function RelatedTools({ tools, title = "Ferramentas Relacionadas" }: RelatedToolsProps) {
  if (!tools.length) return null;

  return (
    <section aria-labelledby="related-tools-heading">
      <h2 id="related-tools-heading" className="mb-6 text-2xl font-bold">
        {title}
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tools.map((tool) => (
          <ToolCard key={`${tool.category}/${tool.slug}`} tool={tool} />
        ))}
      </div>
    </section>
  );
}

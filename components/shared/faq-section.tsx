import { FAQItem } from "@/types";

interface FAQSectionProps {
  faqs: FAQItem[];
  title?: string;
}

export function FAQSection({ faqs, title = "Perguntas Frequentes" }: FAQSectionProps) {
  if (!faqs.length) return null;

  return (
    <section aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="mb-6 text-2xl font-bold">
        {title}
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="rounded-lg border p-5">
            <h3 className="font-semibold text-base leading-snug">{faq.question}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Leia os Termos de Uso do MyCapy antes de utilizar nossas ferramentas gratuitas.",
  alternates: { canonical: `${SITE_URL}/termos` },
};

export default function TermosPage() {
  return (
    <Container as="main" className="py-12">
      <BreadcrumbNav items={[{ label: "Termos de Uso" }]} className="mb-8" />
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Termos de Uso</h1>
          <p className="text-sm text-muted-foreground">Última atualização: 16/06/2026</p>
        </header>
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <section>
            <h2>1. Aceitação dos termos</h2>
            <p>Ao acessar e usar o {SITE_NAME} ({SITE_URL}), você aceita e concorda com estes Termos de Uso. Se não concordar com algum destes termos, por favor, não utilize nosso site.</p>
          </section>
          <section>
            <h2>2. Uso das ferramentas</h2>
            <p>As ferramentas do {SITE_NAME} são fornecidas gratuitamente para uso pessoal e educacional. Você concorda em:</p>
            <ul>
              <li>Usar as ferramentas apenas para fins legítimos e legais</li>
              <li>Não tentar comprometer a segurança ou o desempenho do site</li>
              <li>Não usar as ferramentas para fins fraudulentos</li>
            </ul>
          </section>
          <section>
            <h2>3. Precisão dos resultados</h2>
            <p>As ferramentas do {SITE_NAME} são fornecidas para fins informativos e educacionais. <strong>Não garantimos a precisão absoluta dos resultados</strong> para fins profissionais, jurídicos ou financeiros. Para decisões importantes, consulte profissionais habilitados.</p>
          </section>
          <section>
            <h2>4. Limitação de responsabilidade</h2>
            <p>O {SITE_NAME} não será responsável por quaisquer danos diretos, indiretos, incidentais ou consequenciais decorrentes do uso ou da impossibilidade de uso das ferramentas.</p>
          </section>
          <section>
            <h2>5. Propriedade intelectual</h2>
            <p>O conteúdo, design e funcionalidades do {SITE_NAME} são protegidos por direitos autorais. É proibida a reprodução total ou parcial sem autorização prévia.</p>
          </section>
          <section>
            <h2>6. Modificações</h2>
            <p>Reservamos o direito de modificar estes termos a qualquer momento. As alterações entram em vigor imediatamente após a publicação.</p>
          </section>
          <section>
            <h2>7. Contato</h2>
            <p>Para questões sobre estes termos, entre em contato através da nossa <a href="/contato">página de contato</a>.</p>
          </section>
        </div>
      </div>
    </Container>
  );
}

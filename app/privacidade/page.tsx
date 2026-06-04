import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Leia nossa Política de Privacidade e entenda como o MyCapy trata seus dados.",
  alternates: { canonical: `${SITE_URL}/privacidade` },
};

export default function PrivacidadePage() {
  return (
    <Container as="main" className="py-12">
      <BreadcrumbNav items={[{ label: "Privacidade" }]} className="mb-8" />
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Política de Privacidade</h1>
          <p className="text-sm text-muted-foreground">Última atualização: {new Date().toLocaleDateString("pt-BR")}</p>
        </header>
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <section>
            <h2>1. Informações que coletamos</h2>
            <p>O {SITE_NAME} foi desenvolvido com foco total na privacidade dos usuários. <strong>Não coletamos dados pessoais identificáveis</strong> para o funcionamento das ferramentas. Todos os cálculos e processamentos são realizados localmente no seu navegador.</p>
            <p>Podemos coletar dados anônimos de uso através de ferramentas de analytics (Google Analytics) para melhorar a experiência do usuário, como:</p>
            <ul>
              <li>Páginas mais acessadas</li>
              <li>Tempo médio de sessão</li>
              <li>Dispositivos e navegadores utilizados</li>
            </ul>
          </section>
          <section>
            <h2>2. Cookies</h2>
            <p>Utilizamos cookies estritamente necessários para o funcionamento do site (como preferências de tema) e cookies de analytics anônimos. Não utilizamos cookies de rastreamento para fins publicitários próprios.</p>
          </section>
          <section>
            <h2>3. Google AdSense</h2>
            <p>Utilizamos o Google AdSense para exibir anúncios. O Google pode usar cookies para personalizar anúncios com base em visitas anteriores ao nosso site ou a outros sites. Para mais informações, consulte a <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Política de Privacidade do Google</a>.</p>
          </section>
          <section>
            <h2>4. Segurança dos dados</h2>
            <p>Como não armazenamos dados pessoais dos usuários em nossos servidores, o risco de vazamento é minimizado. Os dados inseridos nas ferramentas existem apenas na memória do seu navegador durante a sessão.</p>
          </section>
          <section>
            <h2>5. Links externos</h2>
            <p>Nosso site pode conter links para sites externos. Não somos responsáveis pelas práticas de privacidade desses sites.</p>
          </section>
          <section>
            <h2>6. Contato</h2>
            <p>Para dúvidas sobre esta política, entre em contato através da nossa <a href="/contato">página de contato</a>.</p>
          </section>
        </div>
      </div>
    </Container>
  );
}

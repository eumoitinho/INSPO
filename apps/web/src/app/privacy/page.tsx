export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Política de Privacidade</h1>
        
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-6">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Informações que Coletamos</h2>
            <p className="text-gray-600 mb-4">
              Coletamos informações que você nos fornece diretamente, incluindo:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Informações de conta (nome, email, empresa)</li>
              <li>Dados de integração com plataformas de marketing (Google Ads, Facebook Ads, Google Analytics)</li>
              <li>Métricas e dados de campanhas publicitárias</li>
              <li>Informações de uso do dashboard</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Como Usamos suas Informações</h2>
            <p className="text-gray-600 mb-4">
              Utilizamos as informações coletadas para:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Fornecer e melhorar nossos serviços de dashboard</li>
              <li>Sincronizar e exibir dados de suas campanhas de marketing</li>
              <li>Gerar relatórios e insights personalizados</li>
              <li>Comunicar atualizações e melhorias do serviço</li>
              <li>Garantir a segurança e integridade da plataforma</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Compartilhamento de Dados</h2>
            <p className="text-gray-600 mb-4">
              Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Com seu consentimento explícito</li>
              <li>Para cumprir obrigações legais</li>
              <li>Com provedores de serviços que nos ajudam a operar a plataforma (sob acordos de confidencialidade)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Segurança dos Dados</h2>
            <p className="text-gray-600 mb-4">
              Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Criptografia de dados em trânsito e em repouso</li>
              <li>Acesso restrito baseado em funções</li>
              <li>Monitoramento contínuo de segurança</li>
              <li>Autenticação segura e tokens de acesso</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Integrações com Terceiros</h2>
            <p className="text-gray-600 mb-4">
              Nossa plataforma se integra com serviços de terceiros. Ao conectar essas integrações, você concorda com:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>O compartilhamento de dados necessários para funcionamento das integrações</li>
              <li>As políticas de privacidade das plataformas integradas (Google, Meta/Facebook)</li>
              <li>O armazenamento seguro de tokens de acesso e credenciais</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Seus Direitos</h2>
            <p className="text-gray-600 mb-4">
              Você tem direito a:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir informações incorretas</li>
              <li>Solicitar a exclusão de seus dados</li>
              <li>Revogar integrações a qualquer momento</li>
              <li>Exportar seus dados</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Retenção de Dados</h2>
            <p className="text-gray-600 mb-4">
              Mantemos seus dados apenas pelo tempo necessário para fornecer nossos serviços e cumprir obrigações legais. 
              Dados de campanhas são mantidos por até 24 meses para análises históricas, salvo solicitação de exclusão.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Cookies</h2>
            <p className="text-gray-600 mb-4">
              Utilizamos cookies essenciais para:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Manter você conectado à plataforma</li>
              <li>Lembrar suas preferências</li>
              <li>Garantir a segurança da sessão</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Alterações nesta Política</h2>
            <p className="text-gray-600 mb-4">
              Podemos atualizar esta política periodicamente. Notificaremos você sobre mudanças significativas 
              através do email cadastrado ou de um aviso em nossa plataforma.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Contato</h2>
            <p className="text-gray-600 mb-4">
              Para questões sobre esta política de privacidade ou sobre seus dados, entre em contato:
            </p>
            <ul className="list-none text-gray-600 space-y-2">
              <li>Email: privacy@ninetwo.com.br</li>
              <li>Site: dashboard.ninetwo.com.br</li>
            </ul>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              © {new Date().getFullYear()} NineTwo Dashboard. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Termos de Uso</h1>
        
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-6">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Aceitação dos Termos</h2>
            <p className="text-gray-600 mb-4">
              Ao acessar e usar o NineTwo Dashboard, você concorda com estes Termos de Uso. 
              Se você não concordar com qualquer parte destes termos, não deve usar nossos serviços.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Descrição do Serviço</h2>
            <p className="text-gray-600 mb-4">
              O NineTwo Dashboard é uma plataforma de gerenciamento e análise de campanhas de marketing digital que:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Integra dados de múltiplas plataformas publicitárias</li>
              <li>Fornece dashboards personalizados para clientes</li>
              <li>Gera relatórios e insights de performance</li>
              <li>Permite gestão centralizada de campanhas</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Conta de Usuário</h2>
            <p className="text-gray-600 mb-4">Para usar nossos serviços, você deve:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Fornecer informações precisas e completas</li>
              <li>Manter a segurança de sua conta e senha</li>
              <li>Notificar imediatamente sobre uso não autorizado</li>
              <li>Ser responsável por todas as atividades em sua conta</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Uso Aceitável</h2>
            <p className="text-gray-600 mb-4">Você concorda em NÃO:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Violar leis ou regulamentos aplicáveis</li>
              <li>Acessar sistemas ou dados sem autorização</li>
              <li>Interferir no funcionamento da plataforma</li>
              <li>Usar o serviço para atividades fraudulentas</li>
              <li>Compartilhar credenciais de acesso</li>
              <li>Fazer engenharia reversa do software</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Integrações e APIs</h2>
            <p className="text-gray-600 mb-4">
              Ao conectar plataformas externas (Google Ads, Facebook Ads, etc.), você:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Autoriza o acesso aos dados dessas plataformas</li>
              <li>Garante ter permissão para acessar essas contas</li>
              <li>Compreende que somos intermediários desses dados</li>
              <li>Aceita os termos de uso das plataformas integradas</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Propriedade Intelectual</h2>
            <p className="text-gray-600 mb-4">
              Todo o conteúdo e tecnologia da plataforma são propriedade da NineTwo ou licenciados para nós. 
              Você mantém a propriedade de seus dados, mas nos concede licença para processá-los conforme 
              necessário para fornecer os serviços.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Pagamento e Assinatura</h2>
            <p className="text-gray-600 mb-4">
              Os termos de pagamento incluem:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Cobrança conforme plano escolhido</li>
              <li>Renovação automática salvo cancelamento</li>
              <li>Não reembolso de períodos não utilizados</li>
              <li>Possibilidade de alteração de preços com aviso prévio</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Limitação de Responsabilidade</h2>
            <p className="text-gray-600 mb-4">
              A NineTwo não se responsabiliza por:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Perdas indiretas ou consequenciais</li>
              <li>Interrupções de serviço de terceiros</li>
              <li>Precisão de dados de plataformas externas</li>
              <li>Decisões tomadas com base nos dados apresentados</li>
            </ul>
            <p className="text-gray-600 mt-4">
              Nossa responsabilidade máxima limita-se ao valor pago pelo serviço nos últimos 12 meses.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Disponibilidade do Serviço</h2>
            <p className="text-gray-600 mb-4">
              Embora nos esforcemos para manter o serviço disponível 24/7:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Não garantimos disponibilidade ininterrupta</li>
              <li>Podemos realizar manutenções programadas</li>
              <li>Não somos responsáveis por falhas de terceiros</li>
              <li>Reservamos o direito de modificar ou descontinuar recursos</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Privacidade e Dados</h2>
            <p className="text-gray-600 mb-4">
              O uso de seus dados é regido por nossa Política de Privacidade. 
              Ao usar nossos serviços, você concorda com a coleta e uso de informações 
              conforme descrito em nossa <a href="/privacy" className="text-blue-600 hover:underline">Política de Privacidade</a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Cancelamento</h2>
            <p className="text-gray-600 mb-4">
              Você pode cancelar sua conta a qualquer momento. Após o cancelamento:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>O acesso será mantido até o fim do período pago</li>
              <li>Dados serão retidos por 30 dias para possível reativação</li>
              <li>Após 30 dias, dados serão permanentemente excluídos</li>
              <li>Integrações serão desconectadas</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">12. Alterações nos Termos</h2>
            <p className="text-gray-600 mb-4">
              Podemos atualizar estes termos periodicamente. Alterações significativas serão 
              comunicadas com 30 dias de antecedência. O uso continuado após as alterações 
              constitui aceitação dos novos termos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">13. Lei Aplicável</h2>
            <p className="text-gray-600 mb-4">
              Estes termos são regidos pelas leis brasileiras. Qualquer disputa será resolvida 
              nos tribunais competentes do Brasil.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">14. Contato</h2>
            <p className="text-gray-600 mb-4">
              Para questões sobre estes termos, entre em contato:
            </p>
            <ul className="list-none text-gray-600 space-y-2">
              <li>Email: legal@ninetwo.com.br</li>
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
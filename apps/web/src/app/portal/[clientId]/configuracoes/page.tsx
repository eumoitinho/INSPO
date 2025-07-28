import PortalConfiguracoes from "../../../../components/PortalConfiguracoes"

interface ConfiguracoesPageProps {
  params: Promise<{ clientId: string }>
}

export default async function ConfiguracoesPage({ params }: ConfiguracoesPageProps) {
  const resolvedParams = await params
  return <PortalConfiguracoes clientSlug={resolvedParams.clientId} />
}
import PortalRelatorios from "../../../../components/PortalRelatorios"

interface RelatoriosPageProps {
  params: Promise<{ clientId: string }>
}

export default async function RelatoriosPage({ params }: RelatoriosPageProps) {
  const resolvedParams = await params
  return <PortalRelatorios clientSlug={resolvedParams.clientId} />
} 
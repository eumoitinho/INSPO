import PortalCharts from "../../../../components/PortalCharts"

interface ChartsPageProps {
  params: Promise<{ clientId: string }>
}

export default async function ChartsPage({ params }: ChartsPageProps) {
  const resolvedParams = await params
  return <PortalCharts clientSlug={resolvedParams.clientId} />
} 
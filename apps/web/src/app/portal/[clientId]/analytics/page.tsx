import PortalAnalytics from "../../../../components/PortalAnalytics"

interface AnalyticsPageProps {
  params: Promise<{ clientId: string }>
}

export default async function AnalyticsPage({ params }: AnalyticsPageProps) {
  const resolvedParams = await params
  return <PortalAnalytics clientSlug={resolvedParams.clientId} />
} 
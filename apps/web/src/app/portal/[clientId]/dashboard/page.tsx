import ClientPortalDashboard from "../../../../components/ClientPortalDashboard"

export default async function ClientPortalDashboardPage({ params }: { params: Promise<{ clientId: string }> }) {
  const resolvedParams = await params
  return <ClientPortalDashboard clientSlug={resolvedParams.clientId} />
} 
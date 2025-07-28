import ClientPortalDashboard from "../../../../components/ClientPortalDashboard"
import MasterLayout from "../../../../masterLayout/MasterLayout"

export default function ClientPortalDashboardPage({ params }: { params: { clientId: string } }) {
  return (
    <MasterLayout>
      <ClientPortalDashboard clientSlug={params.clientId} />
    </MasterLayout>
  )
} 
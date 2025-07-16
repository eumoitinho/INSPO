import ClientPortalDashboard from "../../../../components/ClientPortalDashboard"
import MasterLayout from "../../../../masterLayout/MasterLayout"

export default function ClientPortalDashboardPage({ params }: { params: { client: string } }) {
  return (
    <MasterLayout>
      <ClientPortalDashboard clientSlug={params.client} />
    </MasterLayout>
  )
} 
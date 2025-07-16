// Placeholder para o dashboard do portal do cliente
import AgencyDashboard from "../../../../components/AgencyDashboard"
import MasterLayout from "../../../../masterLayout/MasterLayout"

export default function ClientPortalDashboardPage({ params }: { params: { client: string } }) {
  return (
    <MasterLayout>
      <h1 className="text-2xl font-bold mb-4">Portal do Cliente: {params.client}</h1>
      {/* Aqui viria o ClientPortalDashboard.jsx, usando o AgencyDashboard como placeholder */}
      <AgencyDashboard />
    </MasterLayout>
  )
}

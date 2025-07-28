import PortalCampaigns from "../../../../components/PortalCampaigns"

interface CampaignsPageProps {
  params: Promise<{ clientId: string }>
}

export default async function CampaignsPage({ params }: CampaignsPageProps) {
  const resolvedParams = await params
  return <PortalCampaigns clientSlug={resolvedParams.clientId} />
} 
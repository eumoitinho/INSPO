import PortalHome from "../../../components/PortalHome"

interface PortalPageProps {
  params: Promise<{ clientId: string }>
}

export default async function PortalPage({ params }: PortalPageProps) {
  const resolvedParams = await params
  return <PortalHome clientSlug={resolvedParams.clientId} />
} 
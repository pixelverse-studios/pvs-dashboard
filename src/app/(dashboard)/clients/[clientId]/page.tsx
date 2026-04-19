import { redirect } from 'next/navigation'

export default async function ClientDashboardPage({
    params,
}: {
    params: Promise<{ clientId: string }>
}) {
    const { clientId } = await params
    redirect(`/clients/${clientId}/pages`)
}

import { useQuery } from '@tanstack/react-query'
import { fetchMyRequests } from '@/lib/api'
import { requestListSchema, type RequestRow } from '@/features/requests/data/schema'
import { RequestsTable } from '@/features/requests/components/requests-table'
import { requestColumns } from '@/features/requests/components/requests-columns'

export function RecentSales() {
  const { data } = useQuery({
    queryKey: ['requests', 'mine'],
    queryFn: async () => {
      const list = await fetchMyRequests()
      const mapped: RequestRow[] = list.map((r) => ({
        id: String(r.id ?? ''),
        type: r.type,
        description: r.description,
        status: r.status,
        createdAt: r.createdDate ? new Date(r.createdDate) : new Date(),
        updatedAt: r.resolvedDate ? new Date(r.resolvedDate) : new Date(),
      }))
      const parsed = requestListSchema.safeParse(mapped)
      return parsed.success ? parsed.data : mapped
    },
  })

  return <RequestsTable data={data ?? []} columns={requestColumns} />
}

import { createFileRoute } from '@tanstack/react-router'
import RequestDetails from '@/features/requests/details'

export const Route = createFileRoute('/_authenticated/requests/$requestId')({
  params: (p: { requestId: string }) => p,
  component: RequestDetails,
})



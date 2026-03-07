import { createFileRoute } from '@tanstack/react-router'
import CreateRequestPage from '@/features/requests/create'

export const Route = createFileRoute('/_authenticated/requests/new')({
  validateSearch: (search: { service?: string; country?: 'Tunisie' | 'Sénégal' }) => search,
  component: CreateRequestPage,
})


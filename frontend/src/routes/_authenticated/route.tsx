import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { useAuthStore } from '@/stores/authStore'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: () => {
    const token = useAuthStore.getState().auth.accessToken
    if (!token) {
      throw redirect({ to: '/sign-in', search: { redirect: '/' } })
    }
  },
  component: AuthenticatedLayout,
})

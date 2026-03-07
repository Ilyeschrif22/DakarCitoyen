import { createFileRoute, Link } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { serviceDefinitions } from '@/features/requests/data/services'
import { encryptServiceId } from '@/lib/url-encryption'

export const Route = createFileRoute('/_authenticated/services/')({
  component: ServicesIndexPage,
})

function ServicesIndexPage() {
  const tnServices = serviceDefinitions.filter((s) => s.country === 'Tunisie')
  const snServices = serviceDefinitions.filter((s) => s.country === 'Sénégal')

  return (
    <>
      <Header>
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-6'>
          <h1 className='text-2xl font-bold tracking-tight'>Services municipaux</h1>
          <p className='text-muted-foreground'>Consultez les informations détaillées et documents requis pour chaque service.</p>
        </div>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle>Services — Tunisie</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className='space-y-2'>
                {tnServices.map((s) => (
                  <li key={s.value}>
                    <Link to={(`/services/${encryptServiceId(s.value)}` as unknown) as any} className='text-primary hover:underline'>
                      {s.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Services — Sénégal</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className='space-y-2'>
                {snServices.map((s) => (
                  <li key={s.value}>
                    <Link to={(`/services/${encryptServiceId(s.value)}` as unknown) as any} className='text-primary hover:underline'>
                      {s.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}

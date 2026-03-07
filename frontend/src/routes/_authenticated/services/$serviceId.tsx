import { createFileRoute, Link } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { serviceDefinitions } from '@/features/requests/data/services'
import { useI18n } from '@/context/i18n-context'
import { getServiceIdFromUrl } from '@/lib/url-encryption'

export const Route = createFileRoute('/_authenticated/services/$serviceId')({
  component: ServiceDetailPage,
})

function ServiceDetailPage() {
  const { t } = useI18n()
  const params = Route.useParams() as { serviceId: string }
  const { serviceId } = params
  
  // Decrypt the service ID from URL if it's encrypted
  const decryptedServiceId = getServiceIdFromUrl(serviceId)
  const service = serviceDefinitions.find((s) => s.value === decryptedServiceId)

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
        {!service ? (
          <div className='text-muted-foreground'>Service introuvable.</div>
        ) : (
          <div className='space-y-6'>
            <div className='flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
              <h1 className='text-2xl font-bold tracking-tight'>{service.label}</h1>
              <div className='w-full md:w-auto'>
                <Link
                  to={(`/requests/new?service=${encodeURIComponent(service.value)}&country=${encodeURIComponent(service.country)}` as unknown) as any}
                  className='inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90'
                >
                  {t('services.requestButton')}
                </Link>
              </div>
            </div>
            <div className='mt-1 flex items-center gap-2 text-sm text-muted-foreground'>
              <Badge variant='outline'>{service.country}</Badge>
              {service.documents?.length ? (
                <span>• {service.documents.length} document(s) requis</span>
              ) : null}
            </div>
            {service.description ? (
              <p className='mt-3 max-w-3xl text-muted-foreground'>{service.description}</p>
            ) : null}

            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
              <Card className='border-muted/50'>
                <CardHeader>
                  <CardTitle>{t('services.fields')}</CardTitle>
                  <CardDescription>{t('services.fieldsDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className='space-y-2 text-sm text-muted-foreground'>
                    {service.fields.map((f) => (
                      <li key={f.name} className='rounded-md border border-muted/40 p-3'>
                        <div className='font-medium text-foreground'>
                          {f.label} {f.required ? <span className='text-destructive'>*</span> : null}
                        </div>
                        <div className='text-xs uppercase tracking-wide text-muted-foreground'>Type: {f.type}</div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className='border-muted/50'>
                <CardHeader>
                  <CardTitle>{t('services.documents')}</CardTitle>
                  <CardDescription>{t('services.documentsDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                  {service.documents && service.documents.length > 0 ? (
                    <ul className='space-y-2 text-sm text-muted-foreground'>
                      {service.documents.map((d) => (
                        <li key={d} className='rounded-md border border-muted/40 p-3'>{d}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className='text-sm text-muted-foreground'>{t('services.noDocuments')}</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </Main>
    </>
  )
}


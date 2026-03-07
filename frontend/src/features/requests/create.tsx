import { useMemo, useRef, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { createRequest } from '@/lib/api'
import { useNavigate, useSearch } from '@tanstack/react-router'

import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SelectDropdown } from '@/components/select-dropdown'
import { serviceDefinitions, type ServiceDefinition } from './data/services'
import { getServiceIdFromUrl } from '@/lib/url-encryption'

const schema = z.object({
  country: z.enum(['Tunisie', 'Sénégal']),
  service: z.string().min(1, 'Le type de service est requis.'),
  dynamic: z.record(z.string(), z.any()).optional(),
})

type FormValues = z.infer<typeof schema>

export default function CreateRequestPage() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/_authenticated/requests/new' }) as Partial<{
    service: string
    country: 'Tunisie' | 'Sénégal'
  }>
  const [selectedCountry, setSelectedCountry] = useState<'Tunisie' | 'Sénégal'>('Tunisie')
  const [selectedService, setSelectedService] = useState('')
  const [documentsFiles, setDocumentsFiles] = useState<Record<string, File | undefined>>({})

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { country: 'Tunisie', service: '', dynamic: {} },
  })

  // Preselect via search params if provided
  useEffect(() => {
    if (search.country && (search.country === 'Tunisie' || search.country === 'Sénégal')) {
      setSelectedCountry(search.country)
      form.setValue('country', search.country)
    }
    if (search.service) {
      const decryptedService = getServiceIdFromUrl(search.service)
      if (decryptedService) {
        setSelectedService(decryptedService)
        form.setValue('service', decryptedService)
      } else {
        setSelectedService(search.service)
        form.setValue('service', search.service)
      }
    }
  }, [search.country, search.service])

  const availableServices = useMemo(
    () => serviceDefinitions.filter((s) => s.country === selectedCountry),
    [selectedCountry]
  )

  const serviceConfig = useMemo<ServiceDefinition | undefined>(
    () => availableServices.find((s) => s.value === selectedService),
    [availableServices, selectedService]
  )

  const createMut = useMutation({
    mutationFn: createRequest,
    onSuccess: () => navigate({ to: '/' }),
  })

  const onSubmit = (values: FormValues) => {
    const dynamicPart = values.dynamic
      ? Object.entries(values.dynamic)
          .filter(([, v]) => v !== undefined && v !== '')
          .map(([k, v]) => `${k}: ${v}`)
          .join(' | ')
      : ''
    const docsPart = Object.entries(documentsFiles)
      .filter(([, f]) => !!f)
      .map(([doc, f]) => `${doc}: ${(f as File).name}`)
      .join(' | ')
    const descriptionParts = [dynamicPart, docsPart].filter(Boolean)
    const description = descriptionParts.join(' | ')

    // NOTE: Files are not posted yet; wire to backend when available. We include filenames in description for now.
    createMut.mutate({ type: values.service, description, status: 'PENDING' } as any)
  }

  const fileInputsRef = useRef<Record<string, HTMLInputElement | null>>({})
  const triggerUpload = (doc: string) => fileInputsRef.current[doc]?.click()
  const handleFileChange = (doc: string, fileList: FileList | null) => {
    const file = fileList && fileList[0] ? fileList[0] : undefined
    setDocumentsFiles((prev) => ({ ...prev, [doc]: file }))
  }

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
        <div className='mb-4 flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Créer une demande</h1>
            <p className='text-muted-foreground'>Remplissez le formulaire ci-dessous pour soumettre une nouvelle demande.</p>
          </div>
          <div className='flex gap-2'>
            <Button variant='outline' onClick={() => navigate({ to: '/' })}>Annuler</Button>
            <Button type='submit' form='create-request-form' disabled={createMut.isPending}>
              {createMut.isPending ? 'Envoi…' : 'Enregistrer'}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informations de la demande</CardTitle>
            <CardDescription>Renseignez les champs requis. Le statut initial sera « En attente ».</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form id='create-request-form' onSubmit={form.handleSubmit(onSubmit)} className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                {/* Sélection */}
                <FormField
                  control={form.control}
                  name='country'
                  render={({ field }) => (
                    <FormItem className='space-y-1 md:col-span-1'>
                      <FormLabel>Pays</FormLabel>
                      <FormControl>
                        <SelectDropdown
                          defaultValue={field.value}
                          onValueChange={(val) => {
                            field.onChange(val)
                            setSelectedCountry(val as 'Tunisie' | 'Sénégal')
                            setSelectedService('')
                            setDocumentsFiles({})
                          }}
                          placeholder='Sélectionner le pays'
                          items={[
                            { label: 'Tunisie', value: 'Tunisie' },
                            { label: 'Sénégal', value: 'Sénégal' },
                          ]}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='service'
                  render={({ field }) => (
                    <FormItem className='space-y-1 md:col-span-1'>
                      <FormLabel>Service</FormLabel>
                      <FormControl>
                        <SelectDropdown
                          defaultValue={field.value}
                          onValueChange={(val) => {
                            field.onChange(val)
                            setSelectedService(val)
                            setDocumentsFiles({})
                          }}
                          placeholder='Sélectionner le service'
                          items={availableServices.map((s) => ({ label: s.label, value: s.value }))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Champs dynamiques */}
                {serviceConfig?.fields.length ? (
                  <div className='md:col-span-2'>
                    <div className='mb-2 text-sm font-medium'>Informations du service</div>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                      {serviceConfig.fields.map((f) => (
                        <FormField
                          key={f.name}
                          control={form.control}
                          name={`dynamic.${f.name}` as any}
                          render={({ field }) => (
                            <FormItem className='space-y-1'>
                              <FormLabel>{f.label}</FormLabel>
                              <FormControl>
                                {f.type === 'textarea' ? (
                                  <textarea className='w-full rounded border p-2' rows={3} {...field} />
                                ) : (
                                  <Input type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'} {...field} />
                                )}
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Documents requis */}
                {serviceConfig?.documents && serviceConfig.documents.length > 0 ? (
                  <div className='md:col-span-2'>
                    <div className='mb-2 text-sm font-medium'>Documents requis</div>
                    <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
                      {serviceConfig.documents.map((doc) => (
                        <div key={doc} className='flex items-center justify-between gap-2 rounded border p-2'>
                          <div className='min-w-0'>
                            <div className='truncate text-sm text-muted-foreground'>{doc}</div>
                            <div className='truncate text-xs text-muted-foreground'>
                              {documentsFiles[doc]?.name ?? 'Aucun fichier sélectionné'}
                            </div>
                          </div>
                          <div className='flex items-center gap-2'>
                            <input
                              ref={(el) => { (fileInputsRef.current ||= {})[doc] = el }}
                              id={`file-${doc}`}
                              type='file'
                              className='hidden'
                              accept='.pdf,.jpg,.jpeg,.png'
                              onChange={(e) => handleFileChange(doc, e.target.files)}
                            />
                            <Button type='button' variant='outline' onClick={() => triggerUpload(doc)}>
                              Importer
                            </Button>
                            {documentsFiles[doc] ? (
                              <Button type='button' variant='ghost' onClick={() => handleFileChange(doc, null)}>
                                Retirer
                              </Button>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </form>
            </Form>
          </CardContent>
        </Card>
      </Main>
    </>
  )
}

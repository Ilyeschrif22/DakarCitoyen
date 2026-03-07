import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { RequestRow } from '../data/schema'
import { useMemo, useRef, useState } from 'react'
import { serviceDefinitions, type ServiceDefinition } from '../data/services'

const formSchema = z.object({
  country: z.enum(['Tunisie', 'Sénégal']),
  service: z.string().min(1, 'Le type de service est requis.'),
  dynamic: z.record(z.string(), z.any()).optional(),
  documents: z.array(z.string()).optional(),
  documentsFiles: z.record(z.string(), z.any()).optional(),
})

type RequestForm = z.infer<typeof formSchema>

interface Props {
  currentRow?: RequestRow
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmitForm: (values: RequestForm) => void
}

export function RequestsActionDialog({ currentRow, open, onOpenChange, onSubmitForm }: Props) {
  const isEdit = !!currentRow
  const [selectedCountry, setSelectedCountry] = useState<'Tunisie' | 'Sénégal'>('Tunisie')
  const [selectedService, setSelectedService] = useState<string>('')
  const [selectedDocs, setSelectedDocs] = useState<string[]>([])
  const [documentsFiles, setDocumentsFiles] = useState<Record<string, File | undefined>>({})

  const form = useForm<RequestForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? { country: 'Tunisie', service: currentRow!.type, documents: [], documentsFiles: {} }
      : { country: 'Tunisie', service: '', dynamic: {}, documents: [], documentsFiles: {} },
  })

  const availableServices = useMemo(
    () => serviceDefinitions.filter((s) => s.country === selectedCountry),
    [selectedCountry]
  )

  const serviceConfig = useMemo<ServiceDefinition | undefined>(
    () => availableServices.find((s) => s.value === selectedService),
    [availableServices, selectedService]
  )

  const onSubmit = (values: RequestForm) => {
    onSubmitForm({ ...values, documents: selectedDocs, documentsFiles })
    form.reset()
    setSelectedDocs([])
    setDocumentsFiles({})
    onOpenChange(false)
  }

  const fileInputsRef = useRef<Record<string, HTMLInputElement | null>>({})

  const triggerUpload = (doc: string) => {
    const input = fileInputsRef.current[doc]
    if (input) input.click()
  }

  const handleFileChange = (doc: string, fileList: FileList | null) => {
    const file = fileList && fileList[0] ? fileList[0] : undefined
    setDocumentsFiles((prev) => ({ ...prev, [doc]: file }))
    if (file && !selectedDocs.includes(doc)) setSelectedDocs((prev) => [...prev, doc])
    if (!file) setSelectedDocs((prev) => prev.filter((d) => d !== doc))
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        setSelectedDocs([])
        setDocumentsFiles({})
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-3xl'>
        <DialogHeader className='text-left'>
          <DialogTitle>{isEdit ? 'Modifier la demande' : 'Ajouter une demande'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Mettez à jour la demande.' : 'Créer une nouvelle demande.'}
          </DialogDescription>
        </DialogHeader>
        <div className='-mr-4 max-h-[70vh] w-full overflow-y-auto py-1 pr-4'>
          <Form {...form}>
            <form id='request-form' onSubmit={form.handleSubmit(onSubmit)} className='grid grid-cols-1 gap-6 p-0.5 md:grid-cols-2'>
              {/* Section: Sélection */}
              <div className='md:col-span-2'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='country'
                    render={({ field }) => (
                      <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                        <FormLabel className='col-span-2 text-right'>Pays</FormLabel>
                        <FormControl>
                          <SelectDropdown
                            defaultValue={field.value}
                            onValueChange={(val) => {
                              field.onChange(val)
                              setSelectedCountry(val as 'Tunisie' | 'Sénégal')
                              setSelectedService('')
                            }}
                            placeholder='Sélectionner le pays'
                            className='col-span-4'
                            items={[
                              { label: 'Tunisie', value: 'Tunisie' },
                              { label: 'Sénégal', value: 'Sénégal' },
                            ]}
                          />
                        </FormControl>
                        <FormMessage className='col-span-4 col-start-3' />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='service'
                    render={({ field }) => (
                      <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                        <FormLabel className='col-span-2 text-right'>Service</FormLabel>
                        <FormControl>
                          <SelectDropdown
                            defaultValue={field.value}
                            onValueChange={(val) => {
                              field.onChange(val)
                              setSelectedService(val)
                              setSelectedDocs([])
                              setDocumentsFiles({})
                            }}
                            placeholder='Sélectionner le service'
                            className='col-span-4'
                            items={availableServices.map((s) => ({ label: s.label, value: s.value }))}
                          />
                        </FormControl>
                        <FormMessage className='col-span-4 col-start-3' />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Section: Champs dynamiques */}
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
                          <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                            <FormLabel className='col-span-2 text-right'>{f.label}</FormLabel>
                            <FormControl>
                              {f.type === 'textarea' ? (
                                <textarea className='col-span-4 w-full rounded border p-2' rows={3} {...field} />
                              ) : (
                                <Input className='col-span-4' type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'} {...field} />
                              )}
                            </FormControl>
                            <FormMessage className='col-span-4 col-start-3' />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Documents requis avec upload */}
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
                            ref={(el) => { fileInputsRef.current[doc] = el }}
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
                            <Button
                              type='button'
                              variant='ghost'
                              onClick={() => handleFileChange(doc, null)}
                            >
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
        </div>
        <DialogFooter>
          <Button type='submit' form='request-form'>
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

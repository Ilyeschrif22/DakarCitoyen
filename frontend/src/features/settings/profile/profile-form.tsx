import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'
import { showSubmittedData } from '@/utils/show-submitted-data'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useAuthStore } from '@/stores/authStore'

const languages = [
  { label: 'Français', value: 'fr' },
  { label: 'العربية', value: 'ar' },
] as const

const profileFormSchema = z.object({
  firstName: z
    .string()
    .min(1, 'Veuillez entrer votre prénom.')
    .min(2, 'Le prénom doit contenir au moins 2 caractères.')
    .max(30, 'Le prénom ne doit pas dépasser 30 caractères.'),
  lastName: z
    .string()
    .min(1, 'Veuillez entrer votre nom.')
    .min(2, 'Le nom doit contenir au moins 2 caractères.')
    .max(30, 'Le nom ne doit pas dépasser 30 caractères.'),
  email: z
    .string()
    .email('Veuillez entrer une adresse email valide.')
    .min(1, 'Veuillez entrer votre email.'),
  language: z.string('Veuillez sélectionner une langue.'),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export default function ProfileForm() {
  const { user } = useAuthStore((s) => s.auth)

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    } else if (user?.firstName) {
      return user.firstName.charAt(0).toUpperCase()
    } else if (user?.email) {
      return user.email.charAt(0).toUpperCase()
    }
    return 'U'
  }

  // Get display name
  const getDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`
    } else if (user?.firstName) {
      return user.firstName
    } else if (user?.email) {
      return user.email
    }
    return 'Utilisateur'
  }

  // Get role display name
  const getRoleDisplayName = () => {
    if (user?.role?.includes('ROLE_ADMIN')) {
      return 'Administrateur'
    } else if (user?.role?.includes('ROLE_AGENT')) {
      return 'Agent'
    }
    return 'Utilisateur'
  }

  const defaultValues: Partial<ProfileFormValues> = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    language: 'fr',
  }

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  })

  function onSubmit(data: ProfileFormValues) {
    showSubmittedData(data)
  }

  return (
    <div className="space-y-6">
      {/* User Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle>Informations du profil</CardTitle>
          <CardDescription>
            Vos informations personnelles et votre rôle dans le système
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/avatars/01.png" alt={getDisplayName()} />
              <AvatarFallback className="text-lg">{getUserInitials()}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="text-lg font-medium">{getDisplayName()}</h3>
              <p className="text-sm text-muted-foreground">{user?.email || 'Aucun email'}</p>
              {user?.accountNo && (
                <p className="text-sm text-muted-foreground">CIN: {user.accountNo}</p>
              )}
              <Badge variant="secondary">
                {getRoleDisplayName()}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Settings Form */}
      <Card>
        <CardHeader>
          <CardTitle>Paramètres du profil</CardTitle>
          <CardDescription>
            Modifiez vos informations personnelles et vos préférences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name='firstName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom</FormLabel>
                      <FormControl>
                        <Input placeholder='Votre prénom' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='lastName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input placeholder='Votre nom' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder='votre.email@exemple.com' {...field} />
                    </FormControl>
                    <FormDescription>
                      Cet email sera utilisé pour les notifications et la récupération de compte.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='language'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Langue</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant='outline'
                            role='combobox'
                            className={cn(
                              'w-[200px] justify-between',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value
                              ? languages.find(
                                  (language) => language.value === field.value
                                )?.label
                              : 'Sélectionner une langue'}
                            <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-[200px] p-0'>
                        <Command>
                          <CommandInput placeholder='Rechercher une langue...' />
                          <CommandEmpty>Aucune langue trouvée.</CommandEmpty>
                          <CommandGroup>
                            <CommandList>
                              {languages.map((language) => (
                                <CommandItem
                                  value={language.label}
                                  key={language.value}
                                  onSelect={() => {
                                    form.setValue('language', language.value)
                                  }}
                                >
                                  <CheckIcon
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      language.value === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                  {language.label}
                                </CommandItem>
                              ))}
                            </CommandList>
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Cette langue sera utilisée dans l'interface utilisateur.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type='submit'>Mettre à jour le profil</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

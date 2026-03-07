import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { jwtDecode } from 'jwt-decode'
import { useAuthStore } from '@/stores/authStore'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
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
import { PasswordInput } from '@/components/password-input'

type UserAuthFormProps = HTMLAttributes<HTMLFormElement>

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Please enter your password')
    .min(8, 'Password must be at least 8 characters long'),
})

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const search = useSearch({ from: '/(auth)/sign-in' }) as { redirect?: string }
  const { setAccessToken, setUser } = useAuthStore((s) => s.auth)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.post('/auth/authenticate', {
        email: data.email,
        password: data.password,
      })

      const token = response.data.token
      setAccessToken(token)

      // Decode JWT to extract user info
      const decoded: any = jwtDecode(token)

      // The backend adds 'sub' (email) and 'role' to the token claims
      setUser({
        accountNo: decoded.sub,
        email: decoded.sub,
        firstName: decoded.firstName || decoded.sub.split('@')[0],
        lastName: decoded.lastName || 'User',
        role: [decoded.role], // Role from token
        exp: decoded.exp,
      })

      const to = search?.redirect || '/'
      navigate({ to })
    } catch (e: any) {
      console.error('Login error:', e)
      setError(e?.response?.data?.message || 'Identifiants invalides ou erreur serveur')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='admin@dakar.sn' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>Mot de passe</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
              <Link
                to='/forgot-password'
                className='text-muted-foreground absolute -top-0.5 right-0 text-sm font-medium hover:opacity-75'
              >
                Mot de passe oublié ?
              </Link>
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          {isLoading ? 'Connexion...' : 'Se connecter'}
        </Button>
        {error && <p className='mt-2 text-sm text-red-600'>{error}</p>}
      </form>
    </Form>
  )
}

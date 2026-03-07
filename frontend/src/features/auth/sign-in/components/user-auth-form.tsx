import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/authStore'
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
  username: z.string().min(1, 'Please enter your username'),
  password: z
    .string()
    .min(1, 'Please enter your password')
    .min(7, 'Password must be at least 7 characters long'),
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
      username: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError(null)
    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 800))

      const token = 'static-jwt-token-123456789'
      setAccessToken(token)

      // Mock setting user info based on entered username/password
      // Default to Agent, but if name contains 'user' we mock it as user
      let role = ['ROLE_AGENT']
      let firstName = 'Agent'
      if (data.username.toLowerCase().includes('admin')) {
        role = ['ROLE_ADMIN']
        firstName = 'Admin'
      } else if (data.username.toLowerCase().includes('user')) {
        role = ['ROLE_USER']
        firstName = 'Utilisateur'
      }

      setUser({
        accountNo: data.username,
        email: `${data.username}@example.com`,
        firstName,
        lastName: 'Mock',
        role,
        exp: 0,
      })

      const to = search?.redirect || '/'
      navigate({ to })
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Authentication failed')
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
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>CIN</FormLabel>
              <FormControl>
                <Input placeholder='Entrez votre numéro CIN' {...field} />
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
              <Link
                to='/forgot-password'
                className='text-muted-foreground absolute -top-0.5 right-0 text-sm font-medium hover:opacity-75'
              >
                Forgot password?
              </Link>
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          Login
        </Button>
        {error && <p className='mt-2 text-sm text-red-600'>{error}</p>}
      </form>
    </Form>
  )
}

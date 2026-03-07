'use client'

import { z } from 'zod'
import { useState } from 'react'
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
import { PasswordInput } from '@/components/password-input'
import { SelectDropdown } from '@/components/select-dropdown'
import { userTypes } from '../data/data'
import { User } from '../data/schema'
import axios from 'axios'
import { useQueryClient } from '@tanstack/react-query'

const formSchema = z
  .object({
    firstName: z.string().min(1, 'First Name is required.'),
    lastName: z.string().min(1, 'Last Name is required.'),
    username: z.string().min(1, 'Username is required.'),
    countryCode: z.enum(['+216', '+221'] as const),
    phoneNumber: z.string().min(1, 'Phone number is required.'),
    email: z.string().email('Valid email is required.'),
    cin: z.string().min(1, 'CIN is required.'),
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
    role: z.enum(['ROLE_AGENT', 'ROLE_USER'] as const),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: "Passwords don't match.",
  })

type UserForm = z.infer<typeof formSchema>

interface Props {
  currentRow?: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersActionDialog({ currentRow, open, onOpenChange }: Props) {
  const isEdit = !!currentRow
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const qc = useQueryClient()

  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          firstName: currentRow.firstName,
          lastName: currentRow.lastName,
          username: currentRow.username,
          email: currentRow.email,
          role: currentRow.role?.toLowerCase() === 'role_agent' ? 'ROLE_AGENT' : 'ROLE_USER',
          countryCode: currentRow.phoneNumber?.startsWith('+221') ? '+221' : '+216',
          phoneNumber: currentRow.phoneNumber?.replace(/^\+(216|221)/, '') ?? '',
          password: '',
          confirmPassword: '',
        }
      : {
          firstName: '',
          lastName: '',
          username: '',
          email: '',
          role: 'ROLE_USER',
          countryCode: '+216',
          phoneNumber: '',
          cin: '',
          password: '',
          confirmPassword: '',
        },
  })

  const onSubmit = async (values: UserForm) => {
    setIsLoading(true)
    setError(null)
    try {
      const normalizedLocal = values.phoneNumber.replace(/\s+/g, '').replace(/^0+/, '')
      const fullPhone = values.phoneNumber.trim().startsWith('+')
        ? values.phoneNumber.trim()
        : `${values.countryCode}${normalizedLocal}`

      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        role: values.role,
        cin: values.cin || values.username,
        phone: fullPhone,
        password: values.password,
      }
      if (isEdit) {
        await axios.put(`${import.meta.env.VITE_API_URL ?? ''}/api/app-users/${currentRow?.id}`, payload)
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL ?? ''}/api/app-users`, payload)
      }
      form.reset()
      onOpenChange(false)
      qc.invalidateQueries({ queryKey: ['users'] })
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to save user')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-2xl max-h-[95vh] overflow-auto'>
        <DialogHeader className='text-left'>
          <DialogTitle>{isEdit ? 'Edit User' : 'Add New User'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the user here.' : 'Create new user here.'} Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id='user-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='grid grid-cols-1 sm:grid-cols-2 gap-4'
          >
            <FormField
              control={form.control}
              name='firstName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder='John' {...field} />
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
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Doe' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder='john_doe' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='john.doe@gmail.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='countryCode'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder='Select country'
                    items={[
                      { label: 'Tunisia (+216)', value: '+216' },
                      { label: 'Senegal (+221)', value: '+221' },
                    ]}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='phoneNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder='123456789' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='cin'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CIN</FormLabel>
                  <FormControl>
                    <Input placeholder='AB123456' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='role'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder='Select a role'
                    items={userTypes.map(({ label, value }) => ({ label, value }))}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder='********' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder='********' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {error && <p className='col-span-2 text-sm text-red-600'>{error}</p>}
          </form>
        </Form>

        <DialogFooter>
          <Button type='submit' form='user-form' disabled={isLoading} className='w-full sm:w-auto'>
            {isEdit ? 'Update User' : 'Create User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

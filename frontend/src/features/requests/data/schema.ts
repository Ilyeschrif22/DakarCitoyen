import { z } from 'zod'

export type RequestStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED'

export const requestSchema = z.object({
  id: z.string(),
  type: z.string(),
  description: z.string(),
  status: z.union([
    z.literal('PENDING'),
    z.literal('IN_PROGRESS'),
    z.literal('RESOLVED'),
    z.literal('REJECTED'),
  ]),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  citizenFirstName: z.string().optional(),
  citizenLastName: z.string().optional(),
  citizenEmail: z.string().optional(),
  citizenPhone: z.string().optional(),
  citizenCin: z.string().optional(),
})

export type RequestRow = z.infer<typeof requestSchema>
export const requestListSchema = z.array(requestSchema)



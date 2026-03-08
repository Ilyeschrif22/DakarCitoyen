import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { mockUsers, mockRequests, mockMessages, mockAttachments, mockAppointments } from '../data'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8090'

export const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().auth.accessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export interface AppUserDTO {
  id: number
  firstName?: string
  lastName?: string
  email: string
  phone?: string
  role: string
  cin: string
  address?: string
  birthDate?: string
  municipalityId?: number
}

export async function fetchAppUsers(): Promise<AppUserDTO[]> {
  return Promise.resolve(mockUsers)
}

export type RequestStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED'
export interface RequestDTO {
  id?: number
  type: string
  description: string
  status: RequestStatus
  createdDate?: string
  resolvedDate?: string
  citizenId?: number
  municipalityId?: number
  citizenFirstName?: string
  citizenLastName?: string
  citizenEmail?: string
  citizenPhone?: string
  citizenCin?: string
}

export async function fetchRequests(): Promise<RequestDTO[]> {
  try {
    const response = await api.get('/api/demandes')
    return response.data
  } catch (e) {
    return Promise.resolve(mockRequests)
  }
}

export async function fetchMyRequests(userId: string): Promise<RequestDTO[]> {
  try {
    const response = await api.get(`/api/demandes/my/${userId}`)
    return response.data
  } catch (e) {
    return Promise.resolve(mockRequests.filter(r => r.citizenId === 3 || r.citizenId === 4))
  }
}

export async function fetchRequestById(id: number): Promise<RequestDTO> {
  const req = mockRequests.find(r => r.id === id)
  if (!req) throw new Error('Request not found')
  return Promise.resolve(req)
}

export async function createRequest(payload: RequestDTO): Promise<RequestDTO> {
  try {
    const response = await api.post('/api/demandes', payload)
    return response.data
  } catch (e) {
    const newReq = { ...payload, id: Math.floor(Math.random() * 1000) + 200, status: 'PENDING' as RequestStatus, createdDate: new Date().toISOString() }
    mockRequests.push(newReq)
    return Promise.resolve(newReq)
  }
}

export async function updateRequest(id: number, payload: RequestDTO): Promise<RequestDTO> {
  const idx = mockRequests.findIndex(r => r.id === id)
  if (idx > -1) {
    mockRequests[idx] = { ...mockRequests[idx], ...payload }
    return Promise.resolve(mockRequests[idx])
  }
  throw new Error('Request not found')
}

export async function deleteRequest(id: number): Promise<void> {
  const idx = mockRequests.findIndex(r => r.id === id)
  if (idx > -1) mockRequests.splice(idx, 1)
  return Promise.resolve()
}

export interface RequestMessageDTO {
  id?: number
  requestId: number
  author?: string
  content: string
  createdDate?: string
}

export async function listRequestMessages(requestId: number): Promise<RequestMessageDTO[]> {
  return Promise.resolve(mockMessages.filter(m => m.requestId === requestId))
}

export async function createRequestMessage(requestId: number, content: string): Promise<RequestMessageDTO> {
  const user = useAuthStore.getState().auth.user
  const author = user ? `${user.firstName} ${user.lastName}` : 'Utilisateur'
  const newMsg = { id: Math.floor(Math.random() * 1000) + 100, requestId, content, author, createdDate: new Date().toISOString() }
  mockMessages.push(newMsg)
  return Promise.resolve(newMsg)
}

export interface RequestAttachmentDTO {
  id?: number
  requestId: number
  filename: string
  url?: string
  uploadedDate?: string
}

export async function listRequestAttachments(requestId: number): Promise<RequestAttachmentDTO[]> {
  return Promise.resolve(mockAttachments.filter(a => a.requestId === requestId))
}

export async function uploadRequestAttachment(requestId: number, file: File): Promise<RequestAttachmentDTO> {
  const newAtt = {
    id: Math.floor(Math.random() * 1000) + 50,
    requestId,
    filename: file.name,
    url: URL.createObjectURL(file),
    uploadedDate: new Date().toISOString()
  }
  mockAttachments.push(newAtt)
  return Promise.resolve(newAtt)
}

export interface AppointmentDTO {
  id?: number
  requestId: number
  dateTime: string
  location?: string
  notes?: string
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED'
}

export async function listAppointments(requestId: number): Promise<AppointmentDTO[]> {
  return Promise.resolve(mockAppointments.filter(a => a.requestId === requestId))
}

export async function createAppointment(requestId: number, payload: Omit<AppointmentDTO, 'id' | 'requestId'>): Promise<AppointmentDTO> {
  const newApp = { id: Math.floor(Math.random() * 1000) + 20, requestId, ...payload, status: 'PENDING' as const }
  mockAppointments.push(newApp)
  return Promise.resolve(newApp)
}


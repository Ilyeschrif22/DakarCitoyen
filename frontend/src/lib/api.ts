import { useAuthStore } from '@/stores/authStore'
import { mockUsers, mockRequests, mockMessages, mockAttachments, mockAppointments } from '../data'

// Mocking the axios api instance to prevent errors in components that import it directly
export const api = {
  get: async (url: string) => {
    // Specifically handle the /api/account call which is used to get the logged-in user's role
    if (url === '/api/account') {
      const userStr = localStorage.getItem('auth-storage')
      let userRole = ['ROLE_USER']
      let userData: any = {}
      if (userStr) {
        try {
          const stored = JSON.parse(userStr)
          if (stored?.state?.auth?.user) {
            userData = stored.state.auth.user
            userRole = userData.role || ['ROLE_USER']
          }
        } catch (e) { }
      }
      return {
        data: {
          authorities: userRole,
          login: userData?.accountNo || 'mockuser',
          firstName: userData?.firstName || 'User',
          lastName: userData?.lastName || 'Mock',
          email: userData?.email || 'user@example.com'
        }
      }
    }
    return { data: {} }
  },
  post: async () => ({ data: {} }),
  patch: async () => ({ data: {} }),
  delete: async () => ({ data: {} }),
  interceptors: {
    request: {
      use: () => { }
    }
  }
}

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
  return Promise.resolve(mockRequests)
}

export async function fetchMyRequests(): Promise<RequestDTO[]> {
  // In a real app we'd filter by logged in user ID, here we return a subset for demo
  return Promise.resolve(mockRequests.filter(r => r.citizenId === 3 || r.citizenId === 4))
}

export async function fetchRequestById(id: number): Promise<RequestDTO> {
  const req = mockRequests.find(r => r.id === id)
  if (!req) throw new Error('Request not found')
  return Promise.resolve(req)
}

export async function createRequest(payload: RequestDTO): Promise<RequestDTO> {
  const newReq = { ...payload, id: Math.floor(Math.random() * 1000) + 200, status: 'PENDING' as RequestStatus, createdDate: new Date().toISOString() }
  mockRequests.push(newReq)
  return Promise.resolve(newReq)
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


import { createContext, useContext, useState } from 'react'
import { RequestRow } from '../data/schema'

type DialogType = 'add' | 'edit' | 'delete' | null

interface RequestsContextType {
  open: DialogType
  setOpen: (type: DialogType) => void
  currentRow: RequestRow | null
  setCurrentRow: (row: RequestRow | null) => void
}

const RequestsContext = createContext<RequestsContextType | undefined>(undefined)

export function RequestsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<DialogType>(null)
  const [currentRow, setCurrentRow] = useState<RequestRow | null>(null)

  return (
    <RequestsContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </RequestsContext.Provider>
  )
}

export function useRequests() {
  const context = useContext(RequestsContext)
  if (context === undefined) {
    throw new Error('useRequests must be used within a RequestsProvider')
  }
  return context
}

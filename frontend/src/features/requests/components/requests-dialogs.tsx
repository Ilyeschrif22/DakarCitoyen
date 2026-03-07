import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createRequest, deleteRequest, updateRequest } from '@/lib/api'
import { useRequests } from '../context/requests-context'
import { RequestsActionDialog } from './requests-action-dialog'
import { RequestsDeleteDialog } from './requests-delete-dialog'

export function RequestsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRequests()
  const qc = useQueryClient()

  const refetchAll = () => {
    qc.invalidateQueries({ queryKey: ['requests'] })
    qc.invalidateQueries({ queryKey: ['requests', 'mine'] })
  }

  const createMut = useMutation({
    mutationFn: createRequest,
    onSuccess: () => refetchAll(),
  })
  const updateMut = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) => updateRequest(id, payload),
    onSuccess: () => refetchAll(),
  })
  const deleteMut = useMutation({
    mutationFn: (id: number) => deleteRequest(id),
    onSuccess: () => refetchAll(),
  })

  return (
    <>
      <RequestsActionDialog
        key='request-add'
        open={open === 'add'}
        onOpenChange={(state) => setOpen(state ? 'add' : null)}
        onSubmitForm={(values) => {
          const dynamicPart = values.dynamic
            ? Object.entries(values.dynamic)
                .filter(([, v]) => v !== undefined && v !== '')
                .map(([k, v]) => `${k}: ${v}`)
                .join(' | ')
            : ''
          const description = dynamicPart
          createMut.mutate({
            type: values.service,
            description,
            status: 'PENDING',
          } as any)
        }}
      />

      {currentRow && (
        <>
          <RequestsActionDialog
            key={`request-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={(state) => {
              setOpen(state ? 'edit' : null)
              if (!state) {
                setTimeout(() => setCurrentRow(null), 300)
              }
            }}
            currentRow={currentRow}
            onSubmitForm={(values) => {
              const dynamicPart = values.dynamic
                ? Object.entries(values.dynamic)
                    .filter(([, v]) => v !== undefined && v !== '')
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(' | ')
                : ''
              const description = dynamicPart
              updateMut.mutate({
                id: Number(currentRow.id),
                payload: {
                  type: values.service,
                  description,
                } as any,
              })
            }}
          />

          <RequestsDeleteDialog
            key={`request-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={(state) => {
              setOpen(state ? 'delete' : null)
              if (!state) {
                setTimeout(() => setCurrentRow(null), 300)
              }
            }}
            currentRow={currentRow}
            onConfirm={() => {
              deleteMut.mutate(Number(currentRow.id))
              setOpen(null)
              setTimeout(() => setCurrentRow(null), 300)
            }}
          />
        </>
      )}
    </>
  )
}

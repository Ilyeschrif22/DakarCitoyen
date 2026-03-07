import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { RequestRow } from '../data/schema'

interface Props {
  currentRow: RequestRow
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function RequestsDeleteDialog({ currentRow, open, onOpenChange, onConfirm }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer la demande</DialogTitle>
        </DialogHeader>
        <p>Êtes-vous sûr de vouloir supprimer la demande “{currentRow.type}” ?</p>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button variant='destructive' onClick={onConfirm}>
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

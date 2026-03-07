import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import LongText from '@/components/long-text'
import { requestStatusTypes, requestTypeIcons } from '../data/data'
import { RequestRow } from '../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState, useEffect } from 'react'
import { updateRequest } from '@/lib/api'
import { useQueryClient } from '@tanstack/react-query'
import { useI18n } from '@/context/i18n-context'

export const requestColumns: ColumnDef<RequestRow>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    meta: {
      className: cn(
        'sticky md:table-cell left-0 z-10 rounded-tl',
        'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
      ),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Type de service' />
    ),
    cell: ({ row }) => {
      const type: string = row.getValue('type')
      const requestType = requestTypeIcons.find(({ value }) => value === type.toUpperCase())
      return (
        <div className="flex items-center gap-x-2 min-w-[160px]">
          {requestType?.icon ? (
            <requestType.icon size={16} className="text-muted-foreground shrink-0" />
          ) : null}
          <LongText className="max-w-56">{type}</LongText>
        </div>
      )
    },
    meta: { className: 'sticky left-6 md:table-cell' },
    enableHiding: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Statut' />
    ),
    cell: ({ row }) => {
      const status = row.original.status
      const badgeColor = requestStatusTypes.get(status)
      const { t } = useI18n()
      return (
        <div className="flex space-x-2 min-w-[120px]">
          <Badge variant="outline" className={cn('capitalize', badgeColor)}>
            {status === 'PENDING' && t('status.PENDING')}
            {status === 'IN_PROGRESS' && t('status.IN_PROGRESS')}
            {status === 'RESOLVED' && t('status.RESOLVED')}
            {status === 'REJECTED' && t('status.REJECTED')}
          </Badge>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Date de création' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as Date
      return <div className="min-w-[120px]">{date.toLocaleDateString('fr-FR')}</div>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
      />
    ),
    meta: { className: 'min-w-[56px] w-[56px]' },
  },
]

// Compact variant for dashboard view - shows only essential info
export const requestColumnsCompact: ColumnDef<RequestRow>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    meta: {
      className: cn(
        'sticky md:table-cell left-0 z-10 rounded-tl',
        'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
      ),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Type de service' />
    ),
    cell: ({ row }) => {
      const type: string = row.getValue('type')
      const requestType = requestTypeIcons.find(({ value }) => value === type.toUpperCase())
      return (
        <div className="flex items-center gap-x-2 min-w-[160px]">
          {requestType?.icon ? (
            <requestType.icon size={16} className="text-muted-foreground shrink-0" />
          ) : null}
          <LongText className="max-w-56">{type}</LongText>
        </div>
      )
    },
    meta: { className: 'sticky left-6 md:table-cell' },
    enableHiding: false,
  },
  {
    accessorKey: 'citizenName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='CIN' />
    ),
    cell: ({ row }) => {
      const firstName = row.original.citizenFirstName || ''
      const lastName = row.original.citizenLastName || ''
      const fullName = `${firstName} ${lastName}`.trim() || 'N/A'
      return (
        <div className="min-w-[140px]">
          <div className="font-medium">
            {row.original.citizenCin || 'CIN manquant'}
          </div>
          <div className="text-sm text-muted-foreground">
            {fullName}
          </div>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const firstName = row.original.citizenFirstName || ''
      const lastName = row.original.citizenLastName || ''
      const fullName = `${firstName} ${lastName}`.trim().toLowerCase()
      const cin = (row.original.citizenCin || '').toLowerCase()
      const searchValue = value.toLowerCase()
      
      return fullName.includes(searchValue) || cin.includes(searchValue)
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Statut' />
    ),
    cell: ({ row }) => {
      const status = row.original.status
      const [currentStatus, setCurrentStatus] = useState(status)
      const [isUpdating, setIsUpdating] = useState(false)
      const qc = useQueryClient()

      // Update local state when the row data changes
      useEffect(() => {
        setCurrentStatus(status)
      }, [status])

      const handleStatusChange = async (newStatus: string) => {
        if (newStatus === currentStatus) return // No change needed
        
        setIsUpdating(true)
        try {
          // Optimistically update the UI
          setCurrentStatus(newStatus as any)
          
          const response = await updateRequest(Number(row.original.id), {
            type: row.original.type,
            description: row.original.description,
            status: newStatus as any,
          })
                    
          await qc.invalidateQueries({ queryKey: ['requests', 'all'] })
          await qc.invalidateQueries({ queryKey: ['requests', 'mine'] })
          await qc.invalidateQueries({ queryKey: ['requests'] })
          
          // Also manually update the cache with the response data as a fallback
          qc.setQueryData(['requests', 'all'], (oldData: any) => {
            if (!oldData) return oldData
            return oldData.map((request: any) => 
              request.id === row.original.id 
                ? { ...request, ...response }
                : request
            )
          })
          
          qc.setQueryData(['requests', 'mine'], (oldData: any) => {
            if (!oldData) return oldData
            return oldData.map((request: any) => 
              request.id === row.original.id 
                ? { ...request, ...response }
                : request
            )
          })
          

          
        } catch (error) {
          console.error('Failed to update status:', error)
          setCurrentStatus(status) // Revert on error
        } finally {
          setIsUpdating(false)
        }
      }

      return (
        <div className="flex space-x-2 min-w-[120px]">
          <Select
            value={currentStatus}
            onValueChange={handleStatusChange}
            disabled={isUpdating}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">En attente</SelectItem>
              <SelectItem value="IN_PROGRESS">En cours</SelectItem>
              <SelectItem value="RESOLVED">Résolu</SelectItem>
              <SelectItem value="REJECTED">Rejeté</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Date de création' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as Date
      return <div className="min-w-[120px]">{date.toLocaleDateString('fr-FR')}</div>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
      />
    ),
    meta: { className: 'min-w-[56px] w-[56px]' },
  },
]

// User variant: compact without CIN details
export const userRequestColumns: ColumnDef<RequestRow>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    meta: {
      className: cn(
        'sticky md:table-cell left-0 z-10 rounded-tl',
        'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
      ),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Type de service' />
    ),
    cell: ({ row }) => {
      const type: string = row.getValue('type')
      const requestType = requestTypeIcons.find(({ value }) => value === type.toUpperCase())
      return (
        <div className="flex items-center gap-x-2 min-w-[160px]">
          {requestType?.icon ? (
            <requestType.icon size={16} className="text-muted-foreground shrink-0" />
          ) : null}
          <LongText className="max-w-56">{type}</LongText>
        </div>
      )
    },
    meta: { className: 'sticky left-6 md:table-cell' },
    enableHiding: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Statut' />
    ),
    cell: ({ row }) => {
      const status = row.original.status
      const badgeColor = requestStatusTypes.get(status)
      const { t } = useI18n()
      return (
        <div className="flex space-x-2 min-w-[120px]">
          <Badge variant="outline" className={cn('capitalize', badgeColor)}>
            {status === 'PENDING' && t('status.PENDING')}
            {status === 'IN_PROGRESS' && t('status.IN_PROGRESS')}
            {status === 'RESOLVED' && t('status.RESOLVED')}
            {status === 'REJECTED' && t('status.REJECTED')}
          </Badge>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Date de création' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as Date
      return <div className="min-w-[120px]">{date.toLocaleDateString('fr-FR')}</div>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
      />
    ),
    meta: { className: 'min-w-[56px] w-[56px]' },
  },
]

export const agentRequestColumns: ColumnDef<RequestRow>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    meta: {
      className: cn(
        'sticky md:table-cell left-0 z-10 rounded-tl',
        'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
      ),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Type de service' />
    ),
    cell: ({ row }) => {
      const type: string = row.getValue('type')
      const requestType = requestTypeIcons.find(({ value }) => value === type.toUpperCase())
      return (
        <div className="flex items-center gap-x-2 min-w-[160px]">
          {requestType?.icon ? (
            <requestType.icon size={16} className="text-muted-foreground shrink-0" />
          ) : null}
          <LongText className="max-w-56">{type}</LongText>
        </div>
      )
    },
    meta: { className: 'sticky left-6 md:table-cell' },
    enableHiding: false,
  },
  {
    accessorKey: 'citizenName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='CIN' />
    ),
    cell: ({ row }) => {
      const firstName = row.original.citizenFirstName || ''
      const lastName = row.original.citizenLastName || ''
      const fullName = `${firstName} ${lastName}`.trim() || 'N/A'
      return (
        <div className="min-w-[140px]">
          <div className="font-medium">
            {row.original.citizenCin || 'CIN manquant'}
          </div>
          <div className="text-sm text-muted-foreground">
            {fullName}
          </div>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const firstName = row.original.citizenFirstName || ''
      const lastName = row.original.citizenLastName || ''
      const fullName = `${firstName} ${lastName}`.trim().toLowerCase()
      const cin = (row.original.citizenCin || '').toLowerCase()
      const searchValue = value.toLowerCase()
      
      return fullName.includes(searchValue) || cin.includes(searchValue)
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Statut' />
    ),
    cell: ({ row }) => {
      const status = row.original.status
      const [currentStatus, setCurrentStatus] = useState(status)
      const [isUpdating, setIsUpdating] = useState(false)
      const qc = useQueryClient()

      // Update local state when the row data changes
      useEffect(() => {
        setCurrentStatus(status)
      }, [status])

      const handleStatusChange = async (newStatus: string) => {
        if (newStatus === currentStatus) return // No change needed
        
        setIsUpdating(true)
        try {
          // Optimistically update the UI
          setCurrentStatus(newStatus as any)
          
          const response = await updateRequest(Number(row.original.id), {
            type: row.original.type,
            description: row.original.description,
            status: newStatus as any,
          })
          
          // Invalidate and refetch all request queries to ensure fresh data
          await qc.invalidateQueries({ queryKey: ['requests', 'all'] })
          await qc.invalidateQueries({ queryKey: ['requests', 'mine'] })
          await qc.invalidateQueries({ queryKey: ['requests'] })
          
          // Also manually update the cache with the response data as a fallback
          qc.setQueryData(['requests', 'all'], (oldData: any) => {
            if (!oldData) return oldData
            return oldData.map((request: any) => 
              request.id === row.original.id 
                ? { ...request, ...response }
                : request
            )
          })
          
          qc.setQueryData(['requests', 'mine'], (oldData: any) => {
            if (!oldData) return oldData
            return oldData.map((request: any) => 
              request.id === row.original.id 
                ? { ...request, ...response }
                : request
            )
          })
          

          
        } catch (error) {
          console.error('Failed to update status:', error)
          setCurrentStatus(status) // Revert on error
        } finally {
          setIsUpdating(false)
        }
      }

      return (
        <div className="flex space-x-2 min-w-[120px]">
          <Select
            value={currentStatus}
            onValueChange={handleStatusChange}
            disabled={isUpdating}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">En attente</SelectItem>
              <SelectItem value="IN_PROGRESS">En cours</SelectItem>
              <SelectItem value="RESOLVED">Résolu</SelectItem>
              <SelectItem value="REJECTED">Rejeté</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Date de création' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as Date
      return <div className="min-w-[120px]">{date.toLocaleDateString('fr-FR')}</div>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
      />
    ),
    meta: { className: 'min-w-[56px] w-[56px]' },
  },
]

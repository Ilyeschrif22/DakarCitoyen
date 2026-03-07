import * as React from 'react'
import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableFacetedFilter } from '@/features/users/components/data-table-faceted-filter'
import { DataTableViewOptions } from '@/features/users/components/data-table-view-options'
import { useAuthStore } from '@/stores/authStore'
import { serviceDefinitions } from '../data/services'
import { CalendarIcon } from '@radix-ui/react-icons'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function AgentDataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const { user } = useAuthStore((s) => s.auth)
  const isFiltered = table.getState().columnFilters.length > 0
  
  // Determine user role
  const isAdmin = user?.role?.includes('ROLE_ADMIN') || user?.role?.includes('admin')
  const isAgent = user?.role?.includes('ROLE_AGENT') || user?.role?.includes('agent')
  const isUser = user?.role?.includes('ROLE_USER') || (!isAdmin && !isAgent)

  // Service options for filtering
  const serviceOptions = serviceDefinitions.map((s) => ({
    label: s.shortLabel ?? s.label,
    value: s.value,
  }))

  // Status options
  const statusOptions = [
    { label: 'En attente', value: 'PENDING' },
    { label: 'En cours', value: 'IN_PROGRESS' },
    { label: 'Résolu', value: 'RESOLVED' },
    { label: 'Rejeté', value: 'REJECTED' },
  ]

  // Date filter state
  const [dateFrom, setDateFrom] = React.useState<Date>()
  const [dateTo, setDateTo] = React.useState<Date>()

  // Apply date filters
  React.useEffect(() => {
    if (dateFrom || dateTo) {
      const dateColumn = table.getColumn('createdAt')
      if (dateColumn) {
        dateColumn.setFilterValue({
          from: dateFrom,
          to: dateTo,
        })
      }
    }
  }, [dateFrom, dateTo, table])

  // Clear date filters
  const clearDateFilters = () => {
    setDateFrom(undefined)
    setDateTo(undefined)
    const dateColumn = table.getColumn('createdAt')
    if (dateColumn) {
      dateColumn.setFilterValue(undefined)
    }
  }

  // User view - limited filters
  if (isUser) {
    return (
      <div className='flex items-center justify-between'>
        <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
          <Input
            placeholder='Rechercher par nom de service...'
            value={(table.getColumn('type')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('type')?.setFilterValue(event.target.value)
            }
            className='h-8 w-[150px] lg:w-[250px]'
          />
          <div className='flex gap-x-2'>
            {/* Service type filter */}
            {table.getColumn('type') && (
              <DataTableFacetedFilter
                column={table.getColumn('type')}
                title='Type de service'
                options={serviceOptions}
              />
            )}
            {/* Status filter */}
            {table.getColumn('status') && (
              <DataTableFacetedFilter
                column={table.getColumn('status')}
                title='Statut'
                options={statusOptions}
              />
            )}
            {/* Date filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className={cn(
                    'h-8 justify-start text-left font-normal',
                    (dateFrom || dateTo) && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {dateFrom ? (
                    dateTo ? (
                      <>
                        {format(dateFrom, 'dd/MM/yyyy', { locale: fr })} -{' '}
                        {format(dateTo, 'dd/MM/yyyy', { locale: fr })}
                      </>
                    ) : (
                      format(dateFrom, 'dd/MM/yyyy', { locale: fr })
                    )
                  ) : (
                    'Date de création'
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                  initialFocus
                  mode='range'
                  selected={{ from: dateFrom, to: dateTo }}
                  onSelect={(range) => {
                    setDateFrom(range?.from)
                    setDateTo(range?.to)
                  }}
                  numberOfMonths={2}
                  locale={fr}
                />
              </PopoverContent>
            </Popover>
          </div>
          {isFiltered && (
            <Button
              variant='ghost'
              onClick={() => {
                table.resetColumnFilters()
                clearDateFilters()
              }}
              className='h-8 px-2 lg:px-3'
            >
              Réinitialiser
              <Cross2Icon className='ml-2 h-4 w-4' />
            </Button>
          )}
        </div>
        <DataTableViewOptions table={table} />
      </div>
    )
  }

  // Agent view - comprehensive filters
  if (isAgent) {
    return (
      <div className='flex items-center justify-between'>
        <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
          <Input
            placeholder='Rechercher par CIN, nom, description...'
            value={(table.getColumn('citizenName')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('citizenName')?.setFilterValue(event.target.value)
            }
            className='h-8 w-[150px] lg:w-[250px]'
          />
          <div className='flex gap-x-2'>
            {/* Service type filter */}
            {table.getColumn('type') && (
              <DataTableFacetedFilter
                column={table.getColumn('type')}
                title='Type de service'
                options={serviceOptions}
              />
            )}
            {/* Status filter */}
            {table.getColumn('status') && (
              <DataTableFacetedFilter
                column={table.getColumn('status')}
                title='Statut'
                options={statusOptions}
              />
            )}
            {/* Description filter */}
            {table.getColumn('description') && (
              <Input
                placeholder='Filtrer par description...'
                value={(table.getColumn('description')?.getFilterValue() as string) ?? ''}
                onChange={(event) =>
                  table.getColumn('description')?.setFilterValue(event.target.value)
                }
                className='h-8 w-[150px]'
              />
            )}
            {/* Date range filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className={cn(
                    'h-8 justify-start text-left font-normal',
                    (dateFrom || dateTo) && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {dateFrom ? (
                    dateTo ? (
                      <>
                        {format(dateFrom, 'dd/MM/yyyy', { locale: fr })} -{' '}
                        {format(dateTo, 'dd/MM/yyyy', { locale: fr })}
                      </>
                    ) : (
                      format(dateFrom, 'dd/MM/yyyy', { locale: fr })
                    )
                  ) : (
                    'Date de création'
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                  initialFocus
                  mode='range'
                  selected={{ from: dateFrom, to: dateTo }}
                  onSelect={(range) => {
                    setDateFrom(range?.from)
                    setDateTo(range?.to)
                  }}
                  numberOfMonths={2}
                  locale={fr}
                />
              </PopoverContent>
            </Popover>
            {/* ID filter */}
            {table.getColumn('id') && (
              <Input
                placeholder='Filtrer par ID...'
                value={(table.getColumn('id')?.getFilterValue() as string) ?? ''}
                onChange={(event) =>
                  table.getColumn('id')?.setFilterValue(event.target.value)
                }
                className='h-8 w-[100px]'
              />
            )}
          </div>
          {isFiltered && (
            <Button
              variant='ghost'
              onClick={() => {
                table.resetColumnFilters()
                clearDateFilters()
              }}
              className='h-8 px-2 lg:px-3'
            >
              Réinitialiser
              <Cross2Icon className='ml-2 h-4 w-4' />
            </Button>
          )}
        </div>
        <DataTableViewOptions table={table} />
      </div>
    )
  }

  // Admin view - all filters + advanced options
  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <Input
          placeholder='Rechercher par CIN, nom, description, ID...'
          value={(table.getColumn('citizenName')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('citizenName')?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[250px]'
        />
        <div className='flex gap-x-2'>
          {/* Service type filter */}
          {table.getColumn('type') && (
            <DataTableFacetedFilter
              column={table.getColumn('type')}
              title='Type de service'
              options={serviceOptions}
            />
          )}
          {/* Status filter */}
          {table.getColumn('status') && (
            <DataTableFacetedFilter
              column={table.getColumn('status')}
              title='Statut'
              options={statusOptions}
            />
          )}
          {/* Description filter */}
          {table.getColumn('description') && (
            <Input
              placeholder='Filtrer par description...'
              value={(table.getColumn('description')?.getFilterValue() as string) ?? ''}
              onChange={(event) =>
                table.getColumn('description')?.setFilterValue(event.target.value)
              }
              className='h-8 w-[150px]'
            />
          )}
          {/* Date range filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className={cn(
                  'h-8 justify-start text-left font-normal',
                  (dateFrom || dateTo) && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {dateFrom ? (
                  dateTo ? (
                    <>
                      {format(dateFrom, 'dd/MM/yyyy', { locale: fr })} -{' '}
                      {format(dateTo, 'dd/MM/yyyy', { locale: fr })}
                    </>
                  ) : (
                    format(dateFrom, 'dd/MM/yyyy', { locale: fr })
                  )
                ) : (
                  'Date de création'
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <Calendar
                initialFocus
                mode='range'
                selected={{ from: dateFrom, to: dateTo }}
                onSelect={(range) => {
                  setDateFrom(range?.from)
                  setDateTo(range?.to)
                }}
                numberOfMonths={2}
                locale={fr}
              />
            </PopoverContent>
          </Popover>
          {/* ID filter */}
          {table.getColumn('id') && (
            <Input
              placeholder='Filtrer par ID...'
              value={(table.getColumn('id')?.getFilterValue() as string) ?? ''}
              onChange={(event) =>
                table.getColumn('id')?.setFilterValue(event.target.value)
              }
              className='h-8 w-[100px]'
            />
          )}
          {/* Citizen contact filter */}
          {table.getColumn('citizenContact') && (
            <Input
              placeholder='Filtrer par contact...'
              value={(table.getColumn('citizenContact')?.getFilterValue() as string) ?? ''}
              onChange={(event) =>
                table.getColumn('citizenContact')?.setFilterValue(event.target.value)
              }
              className='h-8 w-[150px]'
            />
          )}
        </div>
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => {
              table.resetColumnFilters()
              clearDateFilters()
            }}
            className='h-8 px-2 lg:px-3'
          >
            Réinitialiser
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}

import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useI18n } from '@/context/i18n-context'
import { DataTableFacetedFilter } from '@/features/users/components/data-table-faceted-filter'
import { DataTableViewOptions } from '@/features/users/components/data-table-view-options'
import { serviceDefinitions } from '@/features/requests/data/services'

interface Props<TData> {
  table: Table<TData>
}

export function RequestsToolbar<TData>({ table }: Props<TData>) {
  const { t } = useI18n()
  const isFiltered = table.getState().columnFilters.length > 0
  const statusColumn = table.getColumn('status')
  const typeColumn = table.getColumn('type')
  const serviceOptions = serviceDefinitions.map((s) => ({ label: s.shortLabel ?? s.label, value: s.value }))

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <Input
          placeholder={t('requests.searchPlaceholder')}
          value={(typeColumn?.getFilterValue() as string) ?? ''}
          onChange={(event) => typeColumn?.setFilterValue(event.target.value)}
          className='h-8 w-[150px] lg:w-[250px]'
        />
        <div className='flex gap-x-2'>
          {typeColumn ? (
            <DataTableFacetedFilter
              column={typeColumn as any}
              title={t('requests.service')}
              options={serviceOptions}
            />
          ) : null}
          {statusColumn ? (
            <DataTableFacetedFilter
              column={statusColumn as any}
              title={t('requests.status')}
              options={[
                { label: 'En attente', value: 'PENDING' },
                { label: 'En cours', value: 'IN_PROGRESS' },
                { label: 'Résolu', value: 'RESOLVED' },
                { label: 'Rejeté', value: 'REJECTED' },
              ]}
            />
          ) : null}
        </div>
        {isFiltered && (
          <Button variant='ghost' onClick={() => table.resetColumnFilters()} className='h-8 px-2 lg:px-3'>
            {t('requests.reset')}
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}

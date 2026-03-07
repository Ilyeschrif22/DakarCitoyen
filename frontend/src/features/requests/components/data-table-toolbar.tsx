import { Table } from '@tanstack/react-table'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from './data-table-view-options'
import { Button } from '@/components/ui/button'
import { Cross2Icon } from '@radix-ui/react-icons'
import { useI18n } from '@/context/i18n-context'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchPlaceholder?: string
}

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = "Search by CIN, name...",
}: DataTableToolbarProps<TData>) {
  const { t } = useI18n()
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 items-center space-x-2'>
        <Input
          placeholder={searchPlaceholder}
          value={(table.getColumn('citizenName')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('citizenName')?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[250px]'
        />
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3'
          >
            {t('common.reset')}
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}

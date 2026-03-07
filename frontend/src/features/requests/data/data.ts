import {
  IconFileText,
  IconAlertTriangle,
  IconCircleCheck,
  IconClock,
  IconCircleX,
} from '@tabler/icons-react'
import { RequestStatus } from './schema'

export const requestStatusTypes = new Map<RequestStatus, string>([
  ['PENDING', 'bg-yellow-100/30 text-yellow-900 dark:text-yellow-200 border-yellow-200'],
  ['IN_PROGRESS', 'bg-blue-200/40 text-blue-900 dark:text-blue-100 border-blue-300'],
  ['RESOLVED', 'bg-green-100/30 text-green-900 dark:text-green-200 border-green-200'],
  ['REJECTED', 'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10'],
])

export const requestTypeIcons = [
  {
    label: 'Général',
    value: 'GENERAL',
    icon: IconFileText,
  },
  {
    label: 'Urgent',
    value: 'URGENT',
    icon: IconAlertTriangle,
  },
  {
    label: 'Routine',
    value: 'ROUTINE',
    icon: IconClock,
  },
  {
    label: 'Complaint',
    value: 'COMPLAINT',
    icon: IconCircleX,
  },
  {
    label: 'Suggestion',
    value: 'SUGGESTION',
    icon: IconCircleCheck,
  },
] as const

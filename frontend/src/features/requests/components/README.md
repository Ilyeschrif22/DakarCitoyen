# Agent Data Table Toolbar

This component provides role-based filtering for the agent data table with different filter views for users, agents, and admins.

## Features

### User View (ROLE_USER)
- **Limited filters**: Service type, status, and date range
- **Search**: By CIN and citizen name
- **Date filter**: Creation date range picker

### Agent View (ROLE_AGENT)
- **Comprehensive filters**: All user filters plus description and ID
- **Search**: By CIN, name, and description
- **Advanced filtering**: ID-based filtering for better request management

### Admin View (ROLE_ADMIN)
- **Full access**: All agent filters plus citizen contact information
- **Complete search**: By CIN, name, description, and ID
- **Maximum visibility**: Access to all filterable fields

## Usage

### Basic Integration

```tsx
import { AgentDataTableToolbar } from './agent-data-table-toolbar'

// In your table component
<AgentDataTableToolbar table={table} />
```

### With Requests Table

```tsx
import { RequestsTable } from './requests-table'
import { AgentDataTableToolbar } from './agent-data-table-toolbar'

// For agent view with custom toolbar
<RequestsTable 
  data={data} 
  columns={agentRequestColumns}
  customToolbar={AgentDataTableToolbar}
/>
```

### Role Detection

The component automatically detects user roles from the auth store:
- `ROLE_USER` → Limited filters
- `ROLE_AGENT` → Comprehensive filters  
- `ROLE_ADMIN` → Full access filters

## Filter Options

### Service Type Filter
- Dropdown with predefined service types from `serviceDefinitions`
- Multi-select capability
- Shows service short labels for better UX

### Status Filter
- Request status options: PENDING, IN_PROGRESS, RESOLVED, REJECTED
- French labels for better localization
- Multi-select capability

### Date Range Filter
- Calendar-based date picker
- Range selection (from/to dates)
- French locale support
- Automatic filter application

### Text Filters
- **Citizen Name**: Search by CIN and full name
- **Description**: Filter by request description (agent/admin only)
- **ID**: Filter by request ID (agent/admin only)
- **Contact**: Filter by citizen contact info (admin only)

## Dependencies

- `@tanstack/react-table` - Table functionality
- `date-fns` - Date formatting and manipulation
- `@radix-ui/react-popover` - Popover components
- `@radix-ui/react-icons` - Icons
- `@/components/ui/*` - UI components
- `@/stores/authStore` - Authentication state

## Customization

### Adding New Filters

```tsx
// Add new filter options
const customOptions = [
  { label: 'Custom Label', value: 'custom_value' }
]

// Use in component
<DataTableFacetedFilter
  column={table.getColumn('customField')}
  title='Custom Filter'
  options={customOptions}
/>
```

### Modifying Filter Behavior

The component uses React's `useEffect` to automatically apply date filters. You can modify this behavior by updating the effect logic in the component.

## Styling

The component follows the existing design system:
- Consistent button and input styling
- Responsive layout with mobile-first approach
- Proper spacing and alignment
- Dark/light theme support

## Accessibility

- Proper ARIA labels
- Keyboard navigation support
- Screen reader friendly
- Focus management for popovers

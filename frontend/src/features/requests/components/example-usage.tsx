import { AgentDataTableToolbar } from './agent-data-table-toolbar'
import { RequestsTable } from './requests-table'
import { agentRequestColumns } from './requests-columns'
import { RequestRow } from '../data/schema'

interface ExampleUsageProps {
  data: RequestRow[]
}

/**
 * Example component showing how to use the AgentDataTableToolbar
 * with the RequestsTable for different user roles.
 * 
 * This demonstrates the role-based filtering capabilities:
 * - Users: Limited filters (service type, status, date)
 * - Agents: Comprehensive filters (all user filters + description, ID)
 * - Admins: Full access (all agent filters + contact info)
 */
export function ExampleUsage({ data }: ExampleUsageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Agent Data Table with Role-Based Filters</h2>
        <p className="text-muted-foreground mb-6">
          This table automatically shows different filter options based on the user's role.
          The filters are determined by the user's authentication context.
        </p>
      </div>

      {/* 
        The AgentDataTableToolbar will automatically:
        1. Detect the user's role from the auth store
        2. Show appropriate filters based on the role
        3. Apply role-specific search and filtering capabilities
      */}
      <RequestsTable 
        data={data} 
        columns={agentRequestColumns}
        customToolbar={AgentDataTableToolbar}
      />

      <div className="bg-muted p-4 rounded-lg">
        <h3 className="font-semibold mb-2">How it works:</h3>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>• <strong>Users (ROLE_USER):</strong> Can filter by service type, status, and date range</li>
          <li>• <strong>Agents (ROLE_AGENT):</strong> Get all user filters plus description and ID filtering</li>
          <li>• <strong>Admins (ROLE_ADMIN):</strong> Have access to all filters including citizen contact info</li>
        </ul>
      </div>
    </div>
  )
}

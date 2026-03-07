import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Info } from 'lucide-react'
import { useI18n } from '@/context/i18n-context'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { fetchRequests, fetchMyRequests } from '@/lib/api'
import { requestListSchema, type RequestRow } from '@/features/requests/data/schema'
import { RequestsProvider } from '@/features/requests/context/requests-context'
import { RequestsTable } from '@/features/requests/components/requests-table'
import { requestColumns, requestColumnsCompact, agentRequestColumns, userRequestColumns } from '@/features/requests/components/requests-columns'
import { AgentDataTableToolbar } from '@/features/requests/components/agent-data-table-toolbar'
import { RequestsDialogs } from '@/features/requests/components/requests-dialogs'
import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/authStore'

function UserDashboard() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.auth.user)
  const { data } = useQuery({
    queryKey: ['requests', 'mine'],
    queryFn: async () => {
      const list = await fetchMyRequests()
      const mapped: RequestRow[] = list.map((r) => ({
        id: String(r.id ?? ''),
        type: r.type,
        description: r.description,
        status: r.status,
        createdAt: r.createdDate ? new Date(r.createdDate) : new Date(),
        updatedAt: r.resolvedDate ? new Date(r.resolvedDate) : new Date(),
      }))
      const parsed = requestListSchema.safeParse(mapped)
      const result = parsed.success ? parsed.data : mapped
      // Sort by ID to ensure stable order
      return result.sort((a, b) => Number(a.id) - Number(b.id))
    },
  })

  return (
    <>
      <Header>
        <div className='ml-auto flex items-center space-x-2 sm:space-x-4'>
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0'>
          <div className='mb-4 sm:mb-0'>
            <h1 className='text-xl sm:text-2xl font-bold tracking-tight'>Tableau de bord</h1>
            <p className='text-sm sm:text-base text-muted-foreground'>Gérez vos demandes de services municipaux</p>
          </div>
          <div className='flex items-center space-x-2'>
            <Button onClick={() => navigate({ to: '/requests/new' })} className='w-full sm:w-auto'>Nouvelle demande</Button>
          </div>
        </div>

        {/* Welcome panel */}
        <Card className='mb-6 border-primary/30 bg-primary/5'>
          <CardContent className='py-0.5 px-2'>
            <div className='flex items-center gap-2 text-primary'>
              <Info className='h-3 w-3' />
              <Badge variant='secondary' className='h-3.5 px-1.5 py-0 border-primary/30 bg-primary/10 text-primary text-[9px]'>
                Bienvenue
              </Badge>
              <span className='text-[13px] leading-tight font-normal text-primary'>
                Bonjour <span className='font-semibold'>{user?.firstName || 'Utilisateur'}</span>, 
                consultez et gérez vos demandes de services ici.
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mes demandes de services</CardTitle>
            <CardDescription>Suivez l'état de vos demandes et consultez leur progression</CardDescription>
          </CardHeader>
          <CardContent>
            <RequestsTable 
              key="user-requests-table"
              data={data ?? []} 
              columns={userRequestColumns} 
              customToolbar={AgentDataTableToolbar}
            />
          </CardContent>
        </Card>
      </Main>
    </>
  )
}

function AgentDashboard() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.auth.user)
  const { data, error, isLoading } = useQuery({
    queryKey: ['requests', 'all'],
    queryFn: async () => {
      try {
        const list = await fetchRequests()
        const mapped: RequestRow[] = list.map((r) => ({
          id: String(r.id ?? ''),
          type: r.type,
          description: r.description,
          status: r.status,
          createdAt: r.createdDate ? new Date(r.createdDate) : new Date(),
          updatedAt: r.resolvedDate ? new Date(r.resolvedDate) : new Date(),
          citizenFirstName: r.citizenFirstName,
          citizenLastName: r.citizenLastName,
          citizenEmail: r.citizenEmail,
          citizenPhone: r.citizenPhone,
          citizenCin: r.citizenCin,
        }))
        const parsed = requestListSchema.safeParse(mapped)
        const result = parsed.success ? parsed.data : mapped
        // Sort by ID to ensure stable order
        return result.sort((a, b) => Number(a.id) - Number(b.id))
      } catch (err) {
        console.error('Error fetching requests:', err)
        throw err
      }
    },
  })

  // Calculate statistics
  const stats = {
    total: data?.length || 0,
    pending: data?.filter(r => r.status === 'PENDING').length || 0,
    inProgress: data?.filter(r => r.status === 'IN_PROGRESS').length || 0,
    resolved: data?.filter(r => r.status === 'RESOLVED').length || 0,
    rejected: data?.filter(r => r.status === 'REJECTED').length || 0,
  }

  return (
    <>
      <Header>
        <div className='ml-auto flex items-center space-x-2 sm:space-x-4'>
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0'>
          <div className='mb-4 sm:mb-0'>
            <h1 className='text-xl sm:text-2xl font-bold tracking-tight'>Tableau de bord Agent</h1>
            <p className='text-sm sm:text-base text-muted-foreground'>Gestion des demandes de services</p>
          </div>
          <div className='flex items-center space-x-2'>
            <Button onClick={() => navigate({ to: '/requests/new' })} className='w-full sm:w-auto'>Nouvelle demande</Button>
          </div>
        </div>

        {/* Welcome panel */}
        <Card className='mb-6 border-primary/30 bg-primary/5'>
          <CardContent className='py-0.5 px-2'>
            <div className='flex items-center gap-2 text-primary'>
              <Info className='h-3 w-3' />
              <Badge variant='secondary' className='h-3.5 px-1.5 py-0 border-primary/30 bg-primary/10 text-primary text-[9px]'>
                Agent
              </Badge>
              <span className='text-[13px] leading-tight font-normal text-primary'>
                Bienvenue, <span className='font-semibold'>{user?.firstName} {user?.lastName}</span>. 
                Vous pouvez gérer toutes les demandes de services ici.
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className='grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 mb-6'>
          <Card className='p-3 sm:p-4'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-0 pt-0'>
              <CardTitle className='text-xs sm:text-sm font-medium'>Total</CardTitle>
            </CardHeader>
            <CardContent className='px-0 pb-0'>
              <div className='text-lg sm:text-2xl font-bold'>{stats.total}</div>
            </CardContent>
          </Card>
          <Card className='p-3 sm:p-4'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-0 pt-0'>
              <CardTitle className='text-xs sm:text-sm font-medium'>En attente</CardTitle>
            </CardHeader>
            <CardContent className='px-0 pb-0'>
              <div className='text-lg sm:text-2xl font-bold text-yellow-600'>{stats.pending}</div>
            </CardContent>
          </Card>
          <Card className='p-3 sm:p-4'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-0 pt-0'>
              <CardTitle className='text-xs sm:text-sm font-medium'>En cours</CardTitle>
            </CardHeader>
            <CardContent className='px-0 pb-0'>
              <div className='text-lg sm:text-2xl font-bold text-blue-600'>{stats.inProgress}</div>
            </CardContent>
          </Card>
          <Card className='p-3 sm:p-4'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-0 pt-0'>
              <CardTitle className='text-xs sm:text-sm font-medium'>Résolues</CardTitle>
            </CardHeader>
            <CardContent className='px-0 pb-0'>
              <div className='text-lg sm:text-2xl font-bold text-green-600'>{stats.resolved}</div>
            </CardContent>
          </Card>
          <Card className='p-3 sm:p-4'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 px-0 pt-0'>
              <CardTitle className='text-xs sm:text-sm font-medium'>Rejetées</CardTitle>
            </CardHeader>
            <CardContent className='px-0 pb-0'>
              <div className='text-lg sm:text-2xl font-bold text-red-600'>{stats.rejected}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Toutes les demandes</CardTitle>
            <CardDescription>Gérez les demandes de services des citoyens</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800">Erreur de connexion: {error.message}</p>
                <p className="text-sm text-red-600">Vérifiez que le backend est en cours d'exécution sur le port 8080</p>
              </div>
            )}

            {isLoading && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-blue-800">Chargement des données...</p>
              </div>
            )}
            <RequestsTable 
              key="agent-requests-table"
              data={data ?? []} 
              columns={agentRequestColumns} 
              customToolbar={AgentDataTableToolbar}
            />
            <RequestsDialogs />
          </CardContent>
        </Card>
      </Main>
    </>
  )
}

function DashboardInner() {
  const user = useAuthStore((s) => s.auth.user)
  const isAgent = user?.role?.includes('ROLE_AGENT') || user?.role?.includes('agent') || user?.role?.includes('AGENT')
  
  return isAgent ? <AgentDashboard /> : <UserDashboard />
}

export default function Dashboard() {
  return (
    <RequestsProvider>
      <DashboardInner />
    </RequestsProvider>
  )
}

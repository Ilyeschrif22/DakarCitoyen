import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { columns } from './components/users-columns';
import { UsersDialogs } from './components/users-dialogs';
import { UsersPrimaryButtons } from './components/users-primary-buttons';
import { UsersTable } from './components/users-table';
import UsersProvider from './context/users-context';
import { userListSchema, type User } from './data/schema';
import { useQuery } from '@tanstack/react-query';
import { fetchAppUsers } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore'; 

export default function Users() {
  const { user } = useAuthStore((s) => s.auth); 
  const userRole = user?.role; // Extract the role array (e.g., ["ROLE_ADMIN"])

  const { data } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const list = await fetchAppUsers();
   
      const mapped: User[] = list.map((u) => ({
        id: String(u.id),
        firstName: u.firstName || '',
        lastName: u.lastName || '',
        username: u.cin,
        email: u.email,
        phoneNumber: u.phone || '',
        role: u.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      const parsed = userListSchema.safeParse(mapped);
      return parsed.success ? parsed.data : mapped;
    },
  });

  if (!userRole?.includes('ROLE_ADMIN')) {
    return (
      <Main>
        <div className='p-4'>
          <p className='text-red-600'>You do not have permission to view the user list.</p>
        </div>
      </Main>
    );
  }

  return (
    <UsersProvider>
      <Header fixed>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>User List</h2>
            <p className='text-muted-foreground'>
              Manage your users and their roles here.
            </p>
          </div>
          <UsersPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <UsersTable data={data ?? []} columns={columns} />
        </div>
      </Main>

      <UsersDialogs />
    </UsersProvider>
  );
}
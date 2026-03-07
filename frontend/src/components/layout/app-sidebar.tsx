import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import { NavGroup } from '@/components/layout/nav-group';
import { NavUser } from '@/components/layout/nav-user';
import { sidebarData } from './data/sidebar-data';
import { useAuthStore } from '@/stores/authStore';
import { useEffect } from 'react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import './app-sidebar.css';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, setUser } = useAuthStore((s) => s.auth); // Destructure user and setUser
  const { state } = useSidebar(); // Get sidebar state for responsive logo

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await api.get('/api/account');
        const userData = response.data as any;
        const role = Array.isArray(userData?.authorities) ? userData.authorities : [];
        setUser({
          accountNo: userData?.login ?? '',
          email: userData?.details?.email ?? userData?.email ?? '',
          firstName: userData?.details?.firstName ?? userData?.firstName ?? '',
          lastName: userData?.details?.lastName ?? userData?.lastName ?? '',
          role: role,
          exp: 0,
        });
        console.log('User role:', role);
        console.log('Sidebar data:', sidebarData);
      } catch (error) {
        console.error('Failed to fetch user role:', error);
      }
    };

    fetchUserRole();
  }, [setUser]);

  // Filter navGroups to exclude "Utilisateurs" if role does not include ROLE_ADMIN
  const filteredNavGroups = sidebarData.navGroups.map((group) => {
    if (group.title === 'Général') {
      return {
        ...group,
        items: group.items.filter((item) => 
          item.title !== 'Utilisateurs' || (user?.role?.includes('ROLE_ADMIN') ?? false)
        ),
      };
    }
    return group;
  });

  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader data-state={state}>
        <div className={cn(
          "sidebar-logo-container flex justify-center",
          state === 'expanded' 
            ? "p-2" 
            : "p-1"
        )}>
          <img
            src="/images/municipality-logo.png"
            alt="Municipality Logo"
            className={cn(
              "sidebar-logo object-contain",
              // When expanded, show full logo
              state === 'expanded' 
                ? "h-8 w-auto sm:h-10 max-w-[120px] sm:max-w-[150px]" 
                : "h-6 w-6"
            )}
            onError={(e) => {
              // Fallback to text if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = document.createElement('div');
              fallback.className = cn(
                "sidebar-logo font-bold text-center",
                state === 'expanded' 
                  ? "text-lg text-primary" 
                  : "text-sm text-primary"
              );
              fallback.textContent = 'MT';
              target.parentNode?.appendChild(fallback);
            }}
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        {filteredNavGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
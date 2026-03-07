import { Link, useNavigate } from '@tanstack/react-router'
import { IconLogout } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/authStore'

type NavigationItem = {
  label: string
  href: string
  icon: React.ComponentType<{ size?: number }>
}

type SidebarProps = {
  navigation: NavigationItem[]
}

export function Sidebar({ navigation }: SidebarProps) {
  const navigate = useNavigate()
  const { reset } = useAuthStore((s) => s.auth)

  const handleLogout = () => {
    reset()
    navigate({ to: '/sign-in' })
  }

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span>Mairie de Tunis</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="border-t p-4">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2"
            onClick={handleLogout}
          >
            <IconLogout className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}

import { Link } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/authStore'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ProfileDropdown() {
  const { reset, user } = useAuthStore((s) => s.auth)
  
  // Generate user initials for avatar fallback
  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    } else if (user?.firstName) {
      return user.firstName.charAt(0).toUpperCase()
    } else if (user?.email) {
      return user.email.charAt(0).toUpperCase()
    }
    return 'U'
  }

  // Get display name
  const getDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`
    } else if (user?.firstName) {
      return user.firstName
    } else if (user?.email) {
      return user.email
    }
    return 'Utilisateur'
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src='/avatars/01.png' alt={getDisplayName()} />
            <AvatarFallback>{getUserInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm leading-none font-medium'>{getDisplayName()}</p>
            <p className='text-muted-foreground text-xs leading-none'>
              {user?.email || 'Aucun email'}
            </p>
            {user?.accountNo && (
              <p className='text-muted-foreground text-xs leading-none'>
                CIN: {user.accountNo}
              </p>
            )}
            {user?.role && user.role.length > 0 && (
              <p className='text-muted-foreground text-xs leading-none'>
                {user.role.includes('ROLE_ADMIN') ? 'Administrateur' : 
                 user.role.includes('ROLE_AGENT') ? 'Agent' : 'Utilisateur'}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to='/settings'>
              Profil
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            to='/sign-in'
            onClick={() => {
              reset()
            }}
          >
            Se déconnecter
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

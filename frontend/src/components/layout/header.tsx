import React from 'react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Select } from '@/components/ui/select'
import { useI18n } from '@/context/i18n-context'

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean
  ref?: React.Ref<HTMLElement>
}

export const Header = ({
  className,
  fixed,
  children,
  ...props
}: HeaderProps) => {
  const [offset, setOffset] = React.useState(0)

  React.useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop)
    }

    // Add scroll listener to the body
    document.addEventListener('scroll', onScroll, { passive: true })

    // Clean up the event listener on unmount
    return () => document.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'bg-background flex h-16 items-center gap-3 p-4 sm:gap-4',
        fixed && 'header-fixed peer/header fixed z-50 w-[inherit] rounded-md',
        offset > 10 && fixed ? 'shadow-sm' : 'shadow-none',
        className
      )}
      {...props}
    >
      <SidebarTrigger variant='outline' className='scale-125 sm:scale-100' />
      <Separator orientation='vertical' className='h-6' />
      <LanguageSwitcher />
      {children}
    </header>
  )
}

Header.displayName = 'Header'

function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n()
  return (
    <div className='hidden items-center gap-2 sm:flex'>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as any)}
        className='h-8 rounded-md border bg-background px-2 text-sm'
      >
        <option value='fr'>{t('lang.fr')}</option>
        <option value='ar'>{t('lang.ar')}</option>
      </select>
    </div>
  )
}

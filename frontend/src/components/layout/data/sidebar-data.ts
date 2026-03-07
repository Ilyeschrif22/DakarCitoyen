import {
  IconUsers,
  IconSettings,
  IconHelp,
  IconBell,
  IconUserCog,
  IconTool,
  IconPalette,
  IconBrowserCheck,
  IconChecklist,
  IconHome,
} from '@tabler/icons-react'
import { serviceDefinitions } from '@/features/requests/data/services'
import { type SidebarData } from '../types'
import { encryptServiceId } from '@/lib/url-encryption'

export const sidebarData: SidebarData = {
  user: {
    name: 'Mairie de Tunis',
    email: 'contact@tunis.tn',
    avatar: '/avatars/municipality.jpg',
  },
  navGroups: [
    {
      title: 'Général',
      items: [
        {
          title: 'Tableau de bord',
          url: '/',
          icon: IconHome,
        },
        {
          title: 'Services municipaux',
          icon: IconChecklist,
          items: [
            ...serviceDefinitions.map((s) => ({
              title: s.shortLabel ?? s.label,
              url: `/services/${encryptServiceId(s.value)}` as unknown as any,
            })),
          ],
        },
        {
          title: 'Utilisateurs',
          url: '/users',
          icon: IconUsers,
        },
      ],
    },
    {
      title: 'Paramètres',
      items: [
        {
          title: 'Général',
          icon: IconSettings,
          items: [
            {
              title: 'Profil',
              url: '/settings',
              icon: IconUserCog,
            },

            {
              title: 'Apparence',
              url: '/settings/appearance',
              icon: IconPalette,
            },
            {
              title: 'Notifications',
              url: '/settings/notifications',
              icon: IconBell,
            },
            {
              title: 'Affichage',
              url: '/settings/display',
              icon: IconBrowserCheck,
            },
          ],
        },
      ],
    },
    {
      title: 'Autres',
      items: [
        {
          title: 'Centre d’aide',
          url: '/help-center',
          icon: IconHelp,
        },
      ],
    },
  ],
}

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

type LanguageCode = 'fr' | 'ar'

type Translations = Record<string, string>

const fr: Translations = {
  'lang.fr': 'Français',
  'lang.ar': 'العربية',
  'dashboard.title': 'Tableau de bord',
  'dashboard.myRequests': 'Mes demandes',
  'dashboard.myRequestsDesc': 'Liste des demandes liées à votre compte.',
  'actions.newRequest': 'Nouvelle Demande',
  'welcome.message': 'Bienvenue',
  'welcome.subtitle': 'Heureux de vous revoir. Voici un aperçu rapide de vos demandes.' ,
  'welcome.badge': 'MODE DÉMO',
  'welcome.short': 'Bienvenue sur la plateforme de gestion municipale',
  'welcome.line': 'Bienvenue sur la plateforme de gestion municipale, {name}',
  'requests.searchPlaceholder': 'Rechercher…',
  'requests.status': 'Statut',
  'requests.service': 'Service',
  'requests.reset': 'Réinitialiser',
  'table.type': 'Type',
  'table.description': 'Description',
  'table.status': 'Statut',
  'table.createdAt': 'Date de création',
  'table.noResults': 'Aucun résultat.',
  'status.PENDING': 'En attente',
  'status.IN_PROGRESS': 'En cours',
  'status.RESOLVED': 'Résolu',
  'status.REJECTED': 'Rejeté',
  'services.requestButton': 'Demander ce service',
  'services.fields': 'Champs requis',
  'services.fieldsDesc': 'Informations à fournir lors de la demande.',
  'services.documents': 'Documents requis',
  'services.documentsDesc': 'Préparez ces documents pour accélérer le traitement.',
  'services.noDocuments': 'Aucun document requis.',
}

const ar: Translations = {
  'lang.fr': 'الفرنسية',
  'lang.ar': 'العربية',
  'dashboard.title': 'لوحة التحكم',
  'dashboard.myRequests': 'طلباتي',
  'dashboard.myRequestsDesc': 'قائمة الطلبات المرتبطة بحسابك.',
  'actions.newRequest': 'طلب جديد',
  'welcome.message': 'مرحباً',
  'welcome.subtitle': 'سعداء بعودتك. إليك لمحة سريعة عن طلباتك.' ,
  'welcome.badge': 'وضع العرض',
  'welcome.short': 'مرحباً بك في منصة إدارة البلدية',
  'welcome.line': 'مرحباً بك في منصة إدارة البلدية، {name}',
  'requests.searchPlaceholder': 'ابحث…',
  'requests.status': 'الحالة',
  'requests.service': 'الخدمة',
  'requests.reset': 'إعادة تعيين',
  'table.type': 'النوع',
  'table.description': 'الوصف',
  'table.status': 'الحالة',
  'table.createdAt': 'تاريخ الإحداث',
  'table.noResults': 'لا توجد نتائج.',
  'status.PENDING': 'قيد الانتظار',
  'status.IN_PROGRESS': 'قيد المعالجة',
  'status.RESOLVED': 'تم الحل',
  'status.REJECTED': 'مرفوض',
  'services.requestButton': 'اطلب هذه الخدمة',
  'services.fields': 'الحقول المطلوبة',
  'services.fieldsDesc': 'معلومات يجب تقديمها عند الطلب.',
  'services.documents': 'المستندات المطلوبة',
  'services.documentsDesc': 'حضّر هذه المستندات لتسريع المعالجة.',
  'services.noDocuments': 'لا توجد مستندات مطلوبة.',
}

const dictionaries: Record<LanguageCode, Translations> = { fr, ar }

type I18nContextValue = {
  language: LanguageCode
  setLanguage: (lang: LanguageCode) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<LanguageCode>('fr')

  useEffect(() => {
    const saved = localStorage.getItem('lang') as LanguageCode | null
    if (saved === 'fr' || saved === 'ar') setLanguage(saved)
  }, [])

  useEffect(() => {
    localStorage.setItem('lang', language)
    document.documentElement.lang = language
  }, [language])

  const value = useMemo<I18nContextValue>(() => {
    const t = (key: string) => dictionaries[language][key] ?? key
    return { language, setLanguage, t }
  }, [language])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}

export type { LanguageCode }



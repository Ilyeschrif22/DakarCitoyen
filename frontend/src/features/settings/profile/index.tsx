import ContentSection from '../components/content-section'
import ProfileForm from './profile-form'

export default function SettingsProfile() {
  return (
    <ContentSection
      title='Profil'
      desc='Gérez vos informations personnelles et vos préférences de compte.'
    >
      <ProfileForm />
    </ContentSection>
  )
}

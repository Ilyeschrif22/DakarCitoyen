import { Link } from '@tanstack/react-router'
import { UserAuthForm } from './components/user-auth-form'

export default function SignIn() {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-8 lg:py-12">
        <div className="mx-auto w-full max-w-sm sm:max-w-md space-y-4 sm:space-y-6 px-4 sm:px-6">
          <div className="flex justify-center mb-4 sm:mb-6">
            <img
              src="/images/municipality-logo.png"
              alt="Municipality Logo"
              className="h-12 w-auto sm:h-16 md:h-18 max-w-[200px] sm:max-w-[250px] md:max-w-[300px]"
            />
          </div>
          <div className="space-y-2 text-center">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Se connecter</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Entrez votre cin et votre mot de passe pour vous connecter.
            </p>
          </div>
          <UserAuthForm />
          <p className="px-4 sm:px-8 text-center text-xs sm:text-sm text-muted-foreground">
            Pas de compte ?{' '}
            <Link to="/sign-up" className="underline underline-offset-4 hover:text-primary">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Mairie_de_Tunis.jpg"
          alt="Mairie de Tunis"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  )
}

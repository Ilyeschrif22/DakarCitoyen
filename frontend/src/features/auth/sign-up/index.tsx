import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const municipalitesTunisiennes = [
  { type: 'Municipalité urbaine', name: 'Tunis' },
  { type: 'Municipalité urbaine', name: 'Sfax' },
  { type: 'Municipalité urbaine', name: 'Sousse' },
  { type: 'Municipalité urbaine', name: 'Bizerte' },
  { type: 'Municipalité urbaine', name: 'Ariana' },
  { type: 'Municipalité urbaine', name: 'Monastir' },
  { type: 'Municipalité urbaine', name: 'Nabeul' },
  { type: 'Municipalité urbaine', name: 'Gabès' },
  { type: 'Municipalité urbaine', name: 'Gafsa' },
  { type: 'Municipalité urbaine', name: 'Médenine' },
  { type: 'Municipalité urbaine', name: 'Mahdia' },
  { type: 'Municipalité urbaine', name: 'Zaghouan' },
  { type: 'Municipalité urbaine', name: 'Tataouine' },
  { type: 'Municipalité urbaine', name: 'Tozeur' },
  { type: 'Municipalité urbaine', name: 'Le Kef' },
  { type: 'Municipalité urbaine', name: 'Siliana' },
  { type: 'Municipalité urbaine', name: 'Jendouba' },
  { type: 'Municipalité urbaine', name: 'Béja' },
  { type: 'Municipalité urbaine', name: 'Manouba' },
  { type: 'Municipalité rurale', name: 'Municipalité Bir Ali Ben Khalifa' },
  { type: 'Municipalité rurale', name: 'Municipalité Menzel Chaker' },
  { type: 'Municipalité rurale', name: 'Municipalité Sidi El Hani' },
  { type: 'Municipalité rurale', name: 'Municipalité Oulad Chamakh' },
  { type: 'Municipalité rurale', name: 'Municipalité Essouassi' },
  { type: 'Municipalité rurale', name: 'Municipalité El Ksar' },
  { type: 'Municipalité rurale', name: 'Municipalité Hamma' },
  { type: 'Municipalité rurale', name: 'Municipalité Jerjis' },
  { type: 'Municipalité rurale', name: 'Municipalité Beni Khedache' },
  { type: 'Municipalité rurale', name: 'Municipalité El Jadida' },
]

export default function SignupForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    cin: '',
    address: '',
    birthDate: '',
    municipalityId: '',
    motDePasse: '',
    confirmationMotDePasse: ''
  })
  const [erreur, setErreur] = useState('')

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setErreur('')

    if (formData.motDePasse !== formData.confirmationMotDePasse) {
      setErreur('Les mots de passe ne correspondent pas')
      return
    }

    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 800))
      window.location.href = '/sign-in'
    } catch (err: any) {
      setErreur(err?.response?.data?.message || 'Échec de l’inscription')
    }
  }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto w-full max-w-2xl space-y-6 px-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tight">Créer un compte municipal</h1>
            <p className="text-muted-foreground">
              Remplissez les champs pour créer un compte.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

            <div className="space-y-2">
              <Label>Prénom</Label>
              <Input name="firstName" value={formData.firstName} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Nom</Label>
              <Input name="lastName" value={formData.lastName} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label>Téléphone</Label>
              <Input name="phone" value={formData.phone} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>CIN</Label>
              <Input name="cin" value={formData.cin} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label>Adresse</Label>
              <Input name="address" value={formData.address} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Date de naissance</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !formData.birthDate && 'text-muted-foreground'
                    )}
                    type="button"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.birthDate
                      ? new Date(formData.birthDate).toLocaleDateString()
                      : 'Choisir une date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start" side="top" avoidCollisions={false} sideOffset={4}>
                  <Calendar
                    mode="single"
                    selected={formData.birthDate ? new Date(formData.birthDate) : undefined}
                    onSelect={(date) =>
                      setFormData({ ...formData, birthDate: date ? date.toISOString().slice(0, 10) : '' })
                    }
                    captionLayout="dropdown"
                    fromYear={1950}
                    toYear={new Date().getFullYear()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Municipalité</Label>
              <Select
                onValueChange={(val) => setFormData({ ...formData, municipalityId: val })}
                value={formData.municipalityId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une municipalité" />
                </SelectTrigger>
                <SelectContent>
                  {municipalitesTunisiennes.map((m, i) => (
                    <SelectItem key={i} value={String(i + 1)}>
                      {m.name} ({m.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Password + Confirmation */}
            <div className="grid grid-cols-2 gap-4 col-span-2">
              <div className="space-y-2">
                <Label htmlFor="motDePasse">Mot de passe</Label>
                <Input
                  id="motDePasse"
                  type="password"
                  name="motDePasse"
                  value={formData.motDePasse}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmationMotDePasse">Confirmer le mot de passe</Label>
                <Input
                  id="confirmationMotDePasse"
                  type="password"
                  name="confirmationMotDePasse"
                  value={formData.confirmationMotDePasse}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            {erreur && <p className="col-span-2 text-sm text-red-600">{erreur}</p>}
            <Button type="submit" className="col-span-2 w-full">Créer le compte</Button>
          </form>
          <p className="px-8 text-center text-sm text-muted-foreground">
            Déjà inscrit ?{" "}
            <Link to="/sign-in" className="underline underline-offset-4 hover:text-primary">
              Se connecter
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

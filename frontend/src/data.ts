import { AppUserDTO, RequestDTO, RequestMessageDTO, RequestAttachmentDTO, AppointmentDTO } from './lib/api'

// --- Mock Users ---
export const mockUsers: AppUserDTO[] = [
    {
        id: 1,
        firstName: 'Amine',
        lastName: 'Ben Ali',
        email: 'amine.benali@example.com',
        phone: '21 345 678',
        role: 'ROLE_ADMIN',
        cin: '05432198',
        address: '15 Rue de la République, Tunis',
        birthDate: '1985-06-15',
        municipalityId: 1,
    },
    {
        id: 2,
        firstName: 'Fatma',
        lastName: 'Trabelsi',
        email: 'fatma.trabelsi@example.com',
        phone: '98 765 432',
        role: 'ROLE_AGENT',
        cin: '12345678',
        address: '42 Avenue Habib Bourguiba, Sfax',
        birthDate: '1992-03-22',
        municipalityId: 2,
    },
    {
        id: 3,
        firstName: 'Youssef',
        lastName: 'Gharbi',
        email: 'youssef.gharbi@example.com',
        phone: '55 123 456',
        role: 'ROLE_USER',
        cin: '87654321',
        address: 'Route de la Plage, Hammamet',
        birthDate: '1978-11-05',
        municipalityId: 3,
    },
    {
        id: 4,
        firstName: 'Syrine',
        lastName: 'Bennour',
        email: 'syrine.bennour@example.com',
        phone: '22 987 654',
        role: 'ROLE_USER',
        cin: '09876543',
        address: 'Cité Ennasr, Ariana',
        birthDate: '1995-08-30',
        municipalityId: 5,
    },
]

// --- Mock Requests ---
export const mockRequests: RequestDTO[] = [
    {
        id: 101,
        type: 'Extrait de naissance',
        description: 'Demande d\'extrait de naissance en français | Nom: Ben Ali | Prénom: Amine | Lieu de naissance: Tunis | Date de naissance: 15/06/1985',
        status: 'IN_PROGRESS',
        createdDate: '2023-10-25T10:30:00Z',
        citizenId: 3,
        municipalityId: 1,
        citizenFirstName: 'Youssef',
        citizenLastName: 'Gharbi',
        citizenEmail: 'youssef.gharbi@example.com',
        citizenPhone: '55 123 456',
        citizenCin: '87654321',
    },
    {
        id: 102,
        type: 'Permis de bâtir',
        description: 'Construction d\'une maison individuelle (R+1) | Titre foncier: 12345 Sfax | Surface: 150m2 | Titre de Propriété: titre_propriete.pdf | Plan de situation: plan.png',
        status: 'PENDING',
        createdDate: '2023-11-02T14:15:00Z',
        citizenId: 4,
        municipalityId: 2,
        citizenFirstName: 'Syrine',
        citizenLastName: 'Bennour',
        citizenEmail: 'syrine.bennour@example.com',
        citizenPhone: '22 987 654',
        citizenCin: '09876543',
    },
    {
        id: 103,
        type: 'Légalisation de signature',
        description: 'Légalisation de contrat de location | ID Document: CON-2023-001',
        status: 'RESOLVED',
        createdDate: '2023-09-15T09:00:00Z',
        resolvedDate: '2023-09-15T11:30:00Z',
        citizenId: 3,
        municipalityId: 1,
        citizenFirstName: 'Youssef',
        citizenLastName: 'Gharbi',
        citizenEmail: 'youssef.gharbi@example.com',
    },
    {
        id: 104,
        type: 'Réclamation',
        description: 'Éclairage public en panne dans ma rue depuis 3 jours | Quartier: Cité Ennour | Rue: Rue de la Liberté',
        status: 'REJECTED',
        createdDate: '2023-10-10T16:45:00Z',
        resolvedDate: '2023-10-12T08:20:00Z',
        citizenId: 4,
        municipalityId: 5,
        citizenFirstName: 'Syrine',
        citizenLastName: 'Bennour',
    }
]

// --- Mock Messages ---
export const mockMessages: RequestMessageDTO[] = [
    {
        id: 1,
        requestId: 101,
        author: 'Agent Municipal',
        content: 'Votre demande est en cours de traitement. Veuillez vérifier si les informations saisies sont correctes.',
        createdDate: '2023-10-26T09:00:00Z',
    },
    {
        id: 2,
        requestId: 101,
        author: 'Youssef Gharbi',
        content: 'Oui, je confirme les informations.',
        createdDate: '2023-10-26T10:15:00Z',
    },
    {
        id: 3,
        requestId: 104,
        author: 'Agent Technique',
        content: 'La réparation a été planifiée pour la semaine prochaine, nous ne pouvons pas intervenir immédiatement faute de matériel.',
        createdDate: '2023-10-11T14:30:00Z',
    }
]

// --- Mock Attachments ---
export const mockAttachments: RequestAttachmentDTO[] = [
    {
        id: 1,
        requestId: 102,
        filename: 'titre_propriete.pdf',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', // Dummy PDF URL
        uploadedDate: '2023-11-02T14:16:00Z',
    },
    {
        id: 2,
        requestId: 102,
        filename: 'plan.png',
        url: 'https://placehold.co/600x400', // Dummy Image URL
        uploadedDate: '2023-11-02T14:17:00Z',
    }
]

// --- Mock Appointments ---
export const mockAppointments: AppointmentDTO[] = [
    {
        id: 1,
        requestId: 102,
        dateTime: '2023-11-15T10:00:00Z',
        location: 'Bureau d\'urbanisme, Mairie de Sfax',
        notes: 'Réunion avec l\'architecte municipal',
        status: 'CONFIRMED'
    }
]

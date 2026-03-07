export type ServiceField = {
  name: string
  label: string
  type: 'text' | 'textarea' | 'number' | 'date'
  required?: boolean
}

export type ServiceDefinition = {
  value: string
  label: string
  shortLabel?: string
  country: 'Tunisie' | 'Sénégal'
  description?: string
  fields: ServiceField[]
  documents?: string[]
}

export const serviceDefinitions: ServiceDefinition[] = [
  // Tunisie
  {
    value: 'PERMIS_CONSTRUIRE',
    label: 'Permis de construire',
    shortLabel: 'Permis construire',
    country: 'Tunisie',
    description:
      "Autorisation nécessaire pour entreprendre des travaux de construction, d'extension ou de rénovation.",
    fields: [
      { name: 'adresse', label: "Adresse du terrain", type: 'text', required: true },
      { name: 'numeroFoncier', label: 'Numéro du lot/terrain', type: 'text', required: true },
      { name: 'typeConstruction', label: 'Type de construction', type: 'text', required: true },
    ],
    documents: ["Copie CIN", 'Plan architectural', "Titre de propriété", "Attestation de conformité"],
  },
  {
    value: 'RENOUVELLEMENT_LICENCE_COMMERCIALE',
    label: 'Renouvellement de licence commerciale',
    shortLabel: 'Renouv. licence',
    country: 'Tunisie',
    description:
      'Demande visant à prolonger la validité de votre licence pour un commerce existant.',
    fields: [
      { name: 'raisonSociale', label: 'Nom commercial', type: 'text', required: true },
      { name: 'adresseCommerce', label: 'Adresse du commerce', type: 'text', required: true },
      { name: 'ancienneLicence', label: 'Numéro de l’ancienne licence', type: 'text', required: true },
    ],
    documents: ["Ancienne licence", 'CIN', 'Reçu de paiement'],
  },
  {
    value: 'ENTRETIEN_VOIRIE',
    label: 'Demande d’entretien de voirie',
    shortLabel: 'Entretien voirie',
    country: 'Tunisie',
    description:
      'Signalement et demande d’intervention pour la maintenance des routes et trottoirs.',
    fields: [
      { name: 'nomVoie', label: 'Nom de la voie', type: 'text', required: true },
      { name: 'descriptionProbleme', label: 'Description du problème', type: 'textarea', required: true },
      { name: 'detailsLocalisation', label: 'Détails de localisation', type: 'text' },
    ],
    documents: ['Photos (optionnel)'],
  },
  {
    value: 'OCCUPATION_DOMAINE_PUBLIC',
    label: 'Autorisation d’occupation du domaine public',
    shortLabel: 'Occupation domaine',
    country: 'Tunisie',
    description:
      'Autorisation temporaire d’occuper un espace public (étal, chantier, évènement, etc.).',
    fields: [
      { name: 'lieu', label: 'Lieu d’occupation', type: 'text', required: true },
      { name: 'objet', label: 'Objet', type: 'textarea', required: true },
      { name: 'duree', label: 'Durée (jours)', type: 'number', required: true },
    ],
  },
  {
    value: 'COLLECTE_DECHETS',
    label: 'Demande de collecte des déchets',
    shortLabel: 'Collecte déchets',
    country: 'Tunisie',
    description:
      'Organisation d’une collecte ponctuelle de déchets volumineux ou spécifiques.',
    fields: [
      { name: 'adresseSite', label: 'Adresse du site', type: 'text', required: true },
      { name: 'details', label: 'Détails', type: 'textarea', required: true },
    ],
  },
  {
    value: 'CERTIFICAT_CONFORMITE',
    label: 'Certificat de conformité',
    shortLabel: 'Certificat conformité',
    country: 'Tunisie',
    description:
      'Attestation confirmant la conformité d’un bâtiment ou d’une installation aux normes en vigueur.',
    fields: [
      { name: 'adresseBatiment', label: 'Adresse du bâtiment', type: 'text', required: true },
      { name: 'numeroPermis', label: 'Numéro du permis', type: 'text', required: true },
    ],
  },
  {
    value: 'CERTIFICAT_PROPRIETE',
    label: 'Certificat de propriété',
    shortLabel: 'Certificat propriété',
    country: 'Tunisie',
    description:
      'Document attestant la propriété d’un bien immobilier pour les démarches administratives.',
    fields: [
      { name: 'adresseBien', label: 'Adresse du bien', type: 'text', required: true },
      { name: 'nomProprietaire', label: 'Nom du propriétaire', type: 'text', required: true },
    ],
  },
  {
    value: 'CERTIFICAT_NON_OPPOSITION',
    label: 'Certificat de non-opposition',
    shortLabel: 'Non-opposition',
    country: 'Tunisie',
    description:
      'Atteste qu’aucune opposition n’a été formulée à l’encontre d’un projet déclaré.',
    fields: [
      { name: 'adresseProjet', label: 'Adresse du projet', type: 'text', required: true },
      { name: 'descriptionProjet', label: 'Description du projet', type: 'textarea', required: true },
    ],
  },
  {
    value: 'AUTORISATION_FOUILLES',
    label: 'Autorisation de fouilles',
    shortLabel: 'Autorisation fouilles',
    country: 'Tunisie',
    description:
      'Permet d’effectuer des fouilles (réseaux, archéologie, etc.) sur le domaine public.',
    fields: [
      { name: 'lieuFouille', label: 'Lieu de fouille', type: 'text', required: true },
      { name: 'butFouille', label: 'But des fouilles', type: 'textarea', required: true },
      { name: 'dureeEstimee', label: 'Durée estimée (jours)', type: 'number', required: true },
    ],
  },

  // Sénégal
  {
    value: 'PERMIS_CONSTRUIRE_SN',
    label: 'Permis de construire',
    shortLabel: 'Permis construire',
    country: 'Sénégal',
    description:
      "Autorisation requise pour démarrer des travaux de construction sur le territoire communal.",
    fields: [
      { name: 'adresse', label: "Adresse du terrain", type: 'text', required: true },
      { name: 'numeroParcelle', label: 'Numéro de parcelle', type: 'text', required: true },
      { name: 'usage', label: 'Usage (habitation, commerce, etc.)', type: 'text', required: true },
    ],
  },
  {
    value: 'LICENCE_ETAL',
    label: 'Licence d’étal / occupation du domaine public',
    shortLabel: 'Licence étal',
    country: 'Sénégal',
    description:
      'Demande d’autorisation pour l’installation d’un étal ou l’occupation temporaire du domaine public.',
    fields: [
      { name: 'emplacement', label: 'Emplacement', type: 'text', required: true },
      { name: 'activite', label: 'Activité', type: 'text', required: true },
      { name: 'duree', label: 'Durée (jours)', type: 'number', required: true },
    ],
  },
  {
    value: 'DECLARATION_TRAVAUX',
    label: 'Déclaration de travaux',
    shortLabel: 'Déclaration travaux',
    country: 'Sénégal',
    description:
      'Notification préalable à des travaux légers ne nécessitant pas de permis complet.',
    fields: [
      { name: 'adresseChantier', label: 'Adresse du chantier', type: 'text', required: true },
      { name: 'natureTravaux', label: 'Nature des travaux', type: 'textarea', required: true },
      { name: 'dateDebut', label: 'Date de début', type: 'date', required: true },
    ],
  },
  {
    value: 'CERTIFICAT_RESIDENCE',
    label: 'Certificat de résidence',
    shortLabel: 'Certificat résidence',
    country: 'Sénégal',
    description:
      'Attestation confirmant la résidence d’une personne à une adresse donnée.',
    fields: [
      { name: 'nom', label: 'Nom', type: 'text', required: true },
      { name: 'adresse', label: 'Adresse', type: 'text', required: true },
      { name: 'numeroCNI', label: 'Numéro CNI', type: 'text', required: true },
    ],
  },
  {
    value: 'EXTRAIT_NAISSANCE',
    label: 'Extrait de naissance (copie)',
    shortLabel: 'Extrait naissance',
    country: 'Sénégal',
    description:
      'Copie officielle de l’acte de naissance pour démarches administratives.',
    fields: [
      { name: 'nom', label: 'Nom', type: 'text', required: true },
      { name: 'prenom', label: 'Prénom', type: 'text', required: true },
      { name: 'dateNaissance', label: 'Date de naissance', type: 'date', required: true },
      { name: 'lieuNaissance', label: 'Lieu de naissance', type: 'text', required: true },
    ],
  },
  {
    value: 'CERTIFICAT_MARIAGE',
    label: 'Certificat de mariage (copie)',
    shortLabel: 'Certificat mariage',
    country: 'Sénégal',
    description:
      'Copie certifiée de l’acte de mariage pour dossiers officiels.',
    fields: [
      { name: 'nomEpoux', label: 'Nom de l’époux', type: 'text', required: true },
      { name: 'nomEpouse', label: 'Nom de l’épouse', type: 'text', required: true },
      { name: 'dateMariage', label: 'Date du mariage', type: 'date', required: true },
    ],
  },
]

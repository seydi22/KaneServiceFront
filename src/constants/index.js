export const PAYS = ['Mauritanie', 'Mali', 'Senegal']

export const SERVICES = {
  ORANGE_MONEY: 'Orange_Money',
  WAVE: 'Wave',
  CHANGE: 'Change',
  CANAL_PLUS: 'Canal_Plus'
}

export const CATEGORIES = {
  // Orange Money & Wave : catégories simplifiées
  [SERVICES.ORANGE_MONEY]: ['Transfert', 'Retrait'],
  [SERVICES.WAVE]: ['Transfert', 'Retrait'],
  [SERVICES.CHANGE]: ['Vente', 'Achat'],
  [SERVICES.CANAL_PLUS]: ['Nouveau_Abonnement', 'Paiement_Facture']
}

/** Change : montant devise étrangère + devise (EUR / USD / FCFA XOF) + MRU saisi manuellement */
export const CATEGORIES_CHANGE_FOREX = ['Vente', 'Achat']

/** Devises proposées pour le montant « étranger » du Change (Vente/Achat) */
export const DEVISES_CHANGE_FOREX = ['EUR', 'USD', 'XOF']

// Catégories qui nécessitent montantRecu, montantEnvoye, deviseRecu et deviseEnvoye
export const CATEGORIES_WITH_TRANSFER = [
  'Transfert_FCFA_to_Ouguiya',
  'Transfert_Ouguiya_to_FCFA',
  'FCFA_to_Ouguiya',
  'Ouguiya_to_FCFA'
]

export const CATEGORIES_LABELS = {
  'Transfert': 'Transfert',
  'Transfert_FCFA_to_Ouguiya': 'Transfert FCFA → Ouguiya',
  'Transfert_Ouguiya_to_FCFA': 'Transfert Ouguiya → FCFA',
  'Retrait': 'Retrait',
  'FCFA_to_Ouguiya': 'Opération (ancien format)',
  'Ouguiya_to_FCFA': 'Opération (ancien format)',
  'Vente': 'Vente',
  'Achat': 'Achat',
  'Nouveau_Abonnement': 'Nouveau Abonnement',
  'Paiement_Facture': 'Paiement Facture'
}

export const SERVICE_LABELS = {
  [SERVICES.ORANGE_MONEY]: 'Orange Money',
  [SERVICES.WAVE]: 'Wave',
  [SERVICES.CHANGE]: 'Change',
  [SERVICES.CANAL_PLUS]: 'Canal+'
}

export const DEVISES = ['XOF', 'MRO', 'EUR', 'USD']

/** Canal+ : uniquement ouguiya — valeur API / base (`MRO`), libellé affiché MRU côté UI. */
export const DEVISE_CANAL_PLUS = 'MRO'

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  AGENT: 'agent'
}

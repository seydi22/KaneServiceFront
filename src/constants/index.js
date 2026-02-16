export const PAYS = ['Mauritanie', 'Mali', 'Senegal']

export const SERVICES = {
  ORANGE_MONEY: 'Orange_Money',
  WAVE: 'Wave',
  CHANGE: 'Change',
  CANAL_PLUS: 'Canal_Plus'
}

export const CATEGORIES = {
  [SERVICES.ORANGE_MONEY]: ['Transfert_FCFA_to_Ouguiya', 'Transfert_Ouguiya_to_FCFA', 'Retrait'],
  [SERVICES.WAVE]: ['Transfert_FCFA_to_Ouguiya', 'Transfert_Ouguiya_to_FCFA', 'Retrait'],
  [SERVICES.CHANGE]: ['FCFA_to_Ouguiya', 'Ouguiya_to_FCFA'],
  [SERVICES.CANAL_PLUS]: ['Nouveau_Abonnement', 'Paiement_Facture']
}

// Catégories qui nécessitent montantRecu, montantEnvoye, deviseRecu et deviseEnvoye
export const CATEGORIES_WITH_TRANSFER = [
  'Transfert_FCFA_to_Ouguiya',
  'Transfert_Ouguiya_to_FCFA',
  'FCFA_to_Ouguiya',
  'Ouguiya_to_FCFA'
]

export const CATEGORIES_LABELS = {
  'Transfert_FCFA_to_Ouguiya': 'Transfert FCFA → Ouguiya',
  'Transfert_Ouguiya_to_FCFA': 'Transfert Ouguiya → FCFA',
  'Retrait': 'Retrait',
  'FCFA_to_Ouguiya': 'FCFA → Ouguiya',
  'Ouguiya_to_FCFA': 'Ouguiya → FCFA',
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

export const ROLES = {
  ADMIN: 'admin',
  AGENT: 'agent'
}

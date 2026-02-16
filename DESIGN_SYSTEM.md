# KANE — Design System 2026

Guide de design pour une interface **moderne, professionnelle et épurée** (suivi des opérations financières multi-pays).

---

## 1. Palette de couleurs

### Principe
- **Neutres** : fonds doux, texte lisible, hiérarchie claire.
- **Accent unique** : teal (confiance, finance, croissance) pour les actions et la marque.
- **Sémantique** : succès / erreur / warning pour le feedback.

### Palette proposée

| Rôle | Couleur | Hex | Usage |
|------|---------|-----|--------|
| **Primary** | Teal | `#0D9488` | Boutons, liens, actif, marque |
| **Primary dark** | Teal foncé | `#0F766E` | Hover, contraste |
| **Primary light** | Teal clair | `#14B8A6` | Surfaces légères |
| **Primary 50** | Teal très clair | `#F0FDFA` | Fonds de carte, sidebar selected |
| **Neutral 50** | Fond global | `#FAFAFA` | Background page |
| **Neutral 100** | Fond cartes | `#F4F4F5` | Cards secondaires |
| **Neutral 900** | Texte principal | `#18181B` | Titres, corps |
| **Neutral 500** | Texte secondaire | `#71717A` | Labels, métadonnées |
| **Neutral 200** | Bordures | `#E4E4E7` | Dividers, borders |
| **Success** | Vert | `#059669` | Succès, validation |
| **Error** | Rouge | `#DC2626` | Erreurs, suppression |
| **Warning** | Ambre | `#D97706` | Alertes |

### Variables CSS à utiliser
Voir `index.css` — toutes les couleurs sont exposées en `:root` pour cohérence.

### Exemples d’usage (MUI sx / CSS)
- **Bouton primaire** : `backgroundColor: 'var(--color-primary)'`, hover `var(--color-primary-dark)`.
- **Carte** : `backgroundColor: 'var(--bg-primary)'`, `borderRadius: 'var(--radius-xl)'`, `boxShadow: 'var(--shadow-md)'`.
- **Texte secondaire** : `color: 'var(--text-secondary)'`.
- **Équivalent “Tailwind” avec nos variables** :  
  `bg-primary` → `background: var(--bg-primary)` ;  
  `text-primary` → `color: var(--text-primary)` ;  
  `rounded-xl` → `borderRadius: 'var(--radius-xl)'` ;  
  `p-4` → `padding: var(--spacing-md)`.

---

## 2. Typographie

### Choix 2026
- **Titres + corps** : **Plus Jakarta Sans** (Google Font) — géométrique, lisible, professionnel.
- **Fallback** : system-ui, sans-serif.

### Échelle typographique

| Élément | Taille | Poids | Line-height | Usage |
|--------|--------|--------|-------------|--------|
| **H1** | 2rem (32px) | 700 | 1.2 | Titre page |
| **H2** | 1.5rem (24px) | 700 | 1.25 | Sections |
| **H3** | 1.25rem (20px) | 600 | 1.3 | Sous-sections |
| **H4** | 1.125rem (18px) | 600 | 1.4 | Cartes, listes |
| **Body** | 1rem (16px) | 400 | 1.5 | Texte courant |
| **Small** | 0.875rem (14px) | 400 | 1.5 | Labels, captions |
| **Caption** | 0.75rem (12px) | 500 | 1.4 | Badges, métadonnées |

### Lettrage
- **Letter-spacing** : titres `-0.02em`, labels `0.05em`.
- **Pas de tout-caps** sauf pour petits labels (uppercase + letter-spacing).

### Intégration Google Font
Dans `index.html` :
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

---

## 3. Structure de la page d’accueil (après login)

### Zones
1. **Header** (fixe, 56px mobile / 64px desktop) : logo, titre app, menu mobile, profil.
2. **Sidebar** (fixe desktop, drawer mobile) : navigation par icône + libellé, item actif mis en avant.
3. **Main** : contenu avec padding généreux, max-width 1280px centré sur grand écran.

### Hiérarchie du contenu (dashboard)
1. **Titre de page** (H1) — une seule par page.
2. **Filtres / barre d’actions** — sur une ligne, wrap sur mobile.
3. **Cartes KPIs** (grille 4 colonnes → 2 → 1 selon breakpoint).
4. **Contenu principal** (tableaux, graphiques) dans des cartes avec ombre légère.

### Espacement (8px base)
- **Section** : `24px` (1.5rem) entre blocs.
- **Composants** : `16px` (1rem) entre éléments proches.
- **Padding conteneur** : `24px` mobile, `32px` desktop.
- **Gap grille** : `24px` (MUI `spacing={3}`).

---

## 4. Composants

### Boutons
- **Primaire** : fond Primary, texte blanc, `border-radius: 10px`, padding `12px 24px`.
- **Hover** : légère assombrissement + `transform: translateY(-1px)` (transition 200ms).
- **Focus** : outline 2px Primary, offset 2px.
- **Disabled** : opacity 0.5, pas de transform.

Exemple (MUI sx) :
```jsx
sx={{
  borderRadius: '10px',
  padding: '12px 24px',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: 'none',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(13, 148, 136, 0.25)',
    transform: 'translateY(-1px)',
  },
  '&:active': { transform: 'translateY(0)' },
}}
```

### Cartes (StatCard, contenants)
- **Fond** : blanc `#FFFFFF`.
- **Bordure** : 1px `#E4E4E7` (optionnel).
- **Border-radius** : `12px` (0.75rem).
- **Ombre** : `0 1px 3px rgba(0,0,0,0.06)` par défaut ; au hover (si cliquable) : `0 4px 12px rgba(0,0,0,0.08)`.
- **Padding** : `20px` (1.25rem) minimum.
- **Accent** : barre gauche 4px (couleur sémantique) pour StatCards.

### Champs de formulaire (TextField)
- **Border-radius** : `10px`.
- **Hauteur** : 48px (touch-friendly).
- **Border** : 1px neutral 200 ; focus : 2px Primary.
- **Label** : au-dessus, 14px, neutral 500.

### Navbar (Header)
- **Hauteur** : 56px (mobile), 64px (desktop).
- **Fond** : Primary (teal) ou fond blanc avec bordure basse (style “glass”).
- **Logo** : typo bold, 1.25rem.
- **User** : avatar + nom/matricule (masqué sur très petit écran).

### Sidebar
- **Largeur** : 240px.
- **Fond** : blanc, bordure droite légère.
- **Item actif** : fond Primary 50, barre gauche 3px Primary, texte Primary.
- **Hover** : fond neutral 100.
- **Transition** : 150ms sur background et color.

### Footer (si présent)
- **Fond** : neutral 100.
- **Texte** : neutral 500, 14px.
- **Padding** : 24px horizontal, 16px vertical.
- **Contenu** : copyright, lien légal, version.

---

## 5. Animations

- **Durée** : 150–200ms pour micro-interactions (hover, focus).
- **Easing** : `ease-out` ou `cubic-bezier(0.4, 0, 0.2, 1)`.
- **Réduction du mouvement** : respecter `prefers-reduced-motion: reduce` (déjà dans `index.css`).
- **Exemples** :
  - Bouton : `transform` + ombre au hover.
  - Carte cliquable : légère élévation au hover.
  - Sidebar item : transition background/color.
  - Modals : fade + léger scale (0.98 → 1).

---

## 6. Responsive (mobile-first)

### Breakpoints (alignés MUI)
- **xs** : 0–639px (mobile).
- **sm** : 640px+.
- **md** : 768px+ (sidebar visible).
- **lg** : 1024px+.
- **xl** : 1280px+ (max-width contenu).

### Règles
- **Touch** : zones cliquables min 44px.
- **Grilles** : 1 col mobile, 2 cols tablette, 4 cols desktop pour KPIs.
- **Tables** : scroll horizontal ou cartes empilées sur mobile.
- **Padding** : réduire à 16px sur xs si besoin.

---

## 7. UX et conversion

- **Un objectif principal par écran** (ex. dashboard = vue d’ensemble, opérations = ajout/liste).
- **Actions principales** : un seul CTA dominant (couleur Primary), les secondaires en outline ou texte.
- **Feedback** : toasts courts (3s), message de succès après chaque action critique.
- **Chargement** : skeletons ou spinners cohérents, pas de flash blanc.
- **Erreurs** : message clair sous le champ ou en bannière, avec action “Réessayer” si pertinent.
- **Navigation** : max 5–7 items dans la sidebar ; regroupement logique (ex. Admin vs Agent).
- **Confiance** : chiffres et montants alignés à droite, séparateurs de milliers, libellés explicites (FCFA, MRU).

---

## 8. Checklist qualité

- [ ] Contraste texte/fond ≥ 4.5:1 (WCAG AA).
- [ ] Focus visible sur tous les contrôles.
- [ ] `prefers-reduced-motion` respecté.
- [ ] Labels associés aux champs (for/id ou aria-label).
- [ ] Messages d’erreur reliés aux champs (aria-describedby).
- [ ] Tests sur mobile réel (touch, clavier, zoom).

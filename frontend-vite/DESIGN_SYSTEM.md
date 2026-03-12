# 🎨 Design System - Mobile Addiction Prediction

## 📋 Table des Matières

1. [Palette de Couleurs](#palette-de-couleurs)
2. [Typographie](#typographie)
3. [Espaces et Grille](#espaces-et-grille)
4. [Composants UI](#composants-ui)
5. [Animations](#animations)
6. [Responsive Design](#responsive-design)
7. [Accessibilité](#accessibilité)

---

## 🎨 Palette de Couleurs

### Primary Colors
```css
--primary-50: #f0f4ff
--primary-500: #6366f1
--primary-600: #4f46e5
--primary-700: #4338ca
```

### Secondary Colors
```css
--secondary-50: #f8fafc
--secondary-500: #64748b
--secondary-700: #334155
--secondary-900: #0f172a
```

### Semantic Colors
```css
--success-500: #22c55e
--warning-500: #f59e0b
--accent-500: #ef4444
--info-500: #3b82f6
```

### Usage Guidelines
- **Primary**: Actions principales, CTA, éléments importants
- **Secondary**: Texte secondaire, arrière-plans
- **Success**: État de succès, confirmations
- **Warning**: Alertes, avertissements
- **Accent**: Erreurs, éléments critiques
- **Info**: Informations neutres

---

## 📝 Typographie

### Font Family
```css
font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

### Font Sizes
```css
--text-xs: 0.75rem    /* 12px */
--text-sm: 0.875rem   /* 14px */
--text-base: 1rem     /* 16px */
--text-lg: 1.125rem   /* 18px */
--text-xl: 1.25rem    /* 20px */
--text-2xl: 1.5rem    /* 24px */
--text-3xl: 1.875rem  /* 30px */
--text-4xl: 2.25rem   /* 36px */
```

### Font Weights
```css
--font-light: 300
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
--font-extrabold: 800
```

### Line Heights
```css
--leading-tight: 1.25
--leading-normal: 1.5
--leading-relaxed: 1.75
```

---

## 📐 Espaces et Grille

### Spacing Scale
```css
--space-1: 0.25rem   /* 4px */
--space-2: 0.5rem    /* 8px */
--space-3: 0.75rem   /* 12px */
--space-4: 1rem      /* 16px */
--space-6: 1.5rem    /* 24px */
--space-8: 2rem      /* 32px */
--space-12: 3rem     /* 48px */
--space-16: 4rem     /* 64px */
--space-20: 5rem     /* 80px */
```

### Container
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}
```

### Grid System
```css
.grid {
  display: grid;
  gap: 1.5rem;
}

.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
```

---

## 🧩 Composants UI

### Button
```jsx
<Button variant="primary" size="lg" loading={false} icon="fas fa-chart-line">
  Évaluer mon risque
</Button>
```

#### Variants
- `primary` - Bouton principal
- `secondary` - Bouton secondaire
- `outline` - Bouton avec bordure
- `ghost` - Bouton transparent

#### Sizes
- `sm` - Petit
- `md` - Medium (default)
- `lg` - Grand

### Card
```jsx
<Card hover>
  <CardHeader>Header</CardHeader>
  <CardBody>Content</CardBody>
  <CardFooter>Footer</CardFooter>
</Card>
```

### Input
```jsx
<Input
  label="Email"
  type="email"
  error="Email invalide"
  helperText="Entrez votre email professionnel"
  required
/>
```

### Range Slider
```jsx
<RangeSlider
  label="Âge"
  value={25}
  onChange={handleChange}
  min={13}
  max={80}
  unit="ans"
  color="primary"
/>
```

### Alert
```jsx
<div className="alert alert-success">
  <i className="fas fa-check-circle"></i>
  <div>
    <p className="font-medium">Succès</p>
    <p className="text-sm">Opération réussie</p>
  </div>
</div>
```

---

## ✨ Animations

### Durées
```css
--duration-fast: 150ms
--duration-normal: 200ms
--duration-slow: 300ms
--duration-slower: 500ms
```

### Easings
```css
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
--ease-out: cubic-bezier(0, 0, 0.2, 1)
--ease-in: cubic-bezier(0.4, 0, 1, 1)
```

### Animations Prédéfinies
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
```

### Classes d'Animation
```css
.animate-fade-in    /* Fade in */
.animate-slide-up   /* Slide up */
.animate-scale-in   /* Scale in */
.hover-lift        /* Hover lift effect */
.hover-glow        /* Hover glow effect */
```

---

## 📱 Responsive Design

### Breakpoints
```css
--breakpoint-sm: 640px   /* Small phones */
--breakpoint-md: 768px   /* Tablets */
--breakpoint-lg: 1024px  /* Small desktops */
--breakpoint-xl: 1280px  /* Desktops */
--breakpoint-2xl: 1536px /* Large screens */
```

### Media Queries
```css
/* Mobile First Approach */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

### Responsive Utilities
```css
.container-mobile    { padding: 1rem; }
.text-mobile-lg      { font-size: 1.125rem; }
.btn-mobile-full     { width: 100%; }
.grid-responsive     { grid-template-columns: 1fr; }

@media (min-width: 768px) {
  .grid-responsive { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .grid-responsive { grid-template-columns: repeat(3, 1fr); }
}
```

---

## ♿ Accessibilité

### Focus States
```css
.focus-ring {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}
```

### Screen Readers
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### High Contrast
```css
@media (prefers-contrast: high) {
  .card {
    border: 2px solid var(--secondary-900);
  }
  
  .btn {
    border: 2px solid currentColor;
  }
}
```

---

## 🎯 Bonnes Pratiques

### Hiérarchie Visuelle
1. **Titres** : Utiliser `font-bold` et `text-2xl`+
2. **Sous-titres** : Utiliser `font-semibold` et `text-xl`
3. **Texte normal** : Utiliser `font-normal` et `text-base`
4. **Texte secondaire** : Utiliser `font-medium` et `text-sm`

### Espacement
- **Sections** : 4rem (64px)
- **Composants** : 2rem (32px)
- **Éléments** : 1rem (16px)
- **Petits éléments** : 0.5rem (8px)

### Couleurs
- **Ratio de contraste** : Minimum 4.5:1
- **Texte sur fond** : Utiliser des couleurs avec bon contraste
- **Actions** : Utiliser `primary` pour les CTAs
- **Feedback** : Utiliser des couleurs sémantiques

### Animations
- **Durée** : 150-300ms maximum
- **Easing** : Utiliser `ease-out` pour les animations d'entrée
- **Performance** : Préférer `transform` et `opacity`
- **Accessibilité** : Respecter `prefers-reduced-motion`

---

## 📦 Utilisation

### Import des Styles
```jsx
import './styles/globals.css';
```

### Import des Composants
```jsx
import { Button, Card, Input } from './components/ui';
```

### Classes Utilitaires
```jsx
<div className="bg-primary-50 text-primary-900 p-4 rounded-xl">
  <h2 className="text-2xl font-bold mb-2">Titre</h2>
  <p className="text-secondary-600">Description</p>
</div>
```

---

## 🔧 Maintenance

### Version
- **Version actuelle** : 1.0.0
- **Dernière mise à jour** : 11/03/2026

### Contributing
1. Suivre les conventions de nommage
2. Maintenir la cohérence visuelle
3. Tester l'accessibilité
4. Documenter les nouveaux composants

### Review Checklist
- [ ] Contraste suffisant
- [ ] Responsive design
- [ ] Accessibilité
- [ ] Performance
- [ ] Documentation à jour

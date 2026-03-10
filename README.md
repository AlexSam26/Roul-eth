# ROUL'ETH - Crypto Roulette Game

Un jeu de roulette crypto moderne et élégant inspiré du design de ROUL'ETH, construit avec Next.js, TypeScript, Tailwind CSS et Web3.

## 🎮 Fonctionnalités

- **Interface moderne** : Design sombre avec accents rouges
- **Animations fluides** : Utilisation de Framer Motion pour des transitions élégantes
- **Intégration Web3** : Support pour les wallets crypto (MetaMask, WalletConnect, etc.)
- **Logique de jeu réaliste** : Système de paris avec multiplicateurs
- **Responsive Design** : Interface adaptée à tous les écrans
- **Timer de jeu** : Rounds automatiques avec compte à rebours

## 🚀 Installation

```bash
# Cloner le projet
git clone <repository-url>
cd rouletheth

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

## 🛠️ Technologies utilisées

- **Next.js 14** : Framework React avec App Router
- **TypeScript** : Typage statique pour une meilleure maintenabilité
- **Tailwind CSS** : Framework CSS utilitaire
- **Framer Motion** : Animations et transitions
- **Wagmi** : Hooks React pour Ethereum
- **RainbowKit** : Interface de connexion wallet
- **Lucide React** : Icônes modernes

## 🎯 Structure du projet

```
src/
├── app/                 # Pages et layout Next.js
├── components/          # Composants React réutilisables
│   ├── GameInterface.tsx
│   ├── GameBlocks.tsx
│   ├── GameTimer.tsx
│   ├── BetButton.tsx
│   └── Web3Provider.tsx
├── hooks/              # Hooks personnalisés
│   └── useGameLogic.ts
└── lib/                # Utilitaires et configurations
```

## 🎲 Logique de jeu

Le jeu fonctionne avec un système de rounds de 30 secondes :

- **Rouge** : Multiplicateur 2x (45% de chance)
- **Vert** : Multiplicateur 14x (5% de chance)
- **Noir** : Multiplicateur 2x (50% de chance)

Les paris sont acceptés pendant les 30 secondes de chaque round, puis le résultat est déterminé automatiquement.

## 🔧 Configuration Web3

Pour activer la connexion wallet, vous devez :

1. Obtenir un Project ID de WalletConnect
2. Modifier `src/components/Web3Provider.tsx`
3. Remplacer `YOUR_PROJECT_ID` par votre ID

## 🎨 Personnalisation

Le design peut être personnalisé via :

- `src/app/globals.css` : Variables CSS et styles globaux
- `tailwind.config.ts` : Configuration Tailwind
- `src/components/` : Composants individuels

## 📱 Responsive

L'interface s'adapte automatiquement aux différentes tailles d'écran :

- Desktop : Layout complet avec sidebar
- Tablet : Layout adapté
- Mobile : Interface optimisée pour mobile

## 🚀 Déploiement

```bash
# Build de production
npm run build

# Lancer en production
npm start
```

## 📄 Licence

MIT License - voir le fichier LICENSE pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche feature
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

---

**ROUL'ETH** - Le futur du gaming crypto 🎮

# ROUL'ETH - Crypto Roulette Game

Un jeu de roulette crypto moderne et élégant inspiré du design de ROUL'ETH, construit avec Next.js, TypeScript, Tailwind CSS et Web3.

## 🎮 Fonctionnalités

- **Interface moderne** : Design sombre avec accents rouges
- **Animations fluides** : Utilisation de Framer Motion pour des transitions élégantes
- **Intégration Web3** : Support pour les wallets crypto (MetaMask, WalletConnect, etc.)
- **Logique de jeu réaliste** : Système de paris avec multiplicateurs
- **Responsive Design** : Interface adaptée à tous les écrans
- **Timer de jeu** : Rounds automatiques avec compte à rebours
- **Telegram Mini App** : Jouer directement dans l'app Telegram

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
│   ├── useGameLogic.ts
│   └── useTelegram.ts  # Détection Mini App Telegram
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

## 📲 Configuration Telegram Mini App

Pour que les utilisateurs jouent via ton bot Telegram :

1. **Déploie ton app** sur un hébergeur HTTPS (Vercel, Netlify, etc.)
   - Exemple : `https://rouletheth.vercel.app`

2. **Configure ton bot** avec [@BotFather](https://t.me/BotFather) :
   - `/newbot` ou `/mybots` → choisis ton bot
   - **Bot Settings** → **Menu Button** → **Configure menu button**
   - Entre l’URL de ton app : `https://ton-domaine.com`

3. **Ou utilise une commande** comme `/play` :
   - Dans ton bot, renvoie un bouton ou lien vers `https://ton-domaine.com`
   - Les utilisateurs cliquent et ouvrent le jeu en Mini App

4. **Résultat** : l’interface s’adapte automatiquement en mode Telegram (header compact, nom d’utilisateur visible).

## 🦊 Wallet (MetaMask) + Smart contract (Sepolia)

### 1) Activer le bouton MetaMask

Le bouton de connexion est déjà dans l’UI (RainbowKit). Il faut juste fournir un `projectId` WalletConnect côté front :

- Crée un fichier `E:\CODE\rouletheth\.env.local` (non commité) :

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=TON_PROJECT_ID_WALLETCONNECT
```

Ensuite relance :

```bash
npm run dev
```

### 2) Compiler / déployer le contrat sur Sepolia (Hardhat)

- Copie `.env.example` vers `.env` (ou mets ces variables dans ton environnement) :

```bash
SEPOLIA_RPC_URL=...
DEPLOYER_PRIVATE_KEY=...
```

- Compiler :

```bash
npm run hardhat:compile
```

- Déployer sur Sepolia (le script envoie aussi une bankroll initiale) :

```bash
npm run hardhat:deploy:sepolia
```

Le terminal affichera l’adresse du contrat.

### 3) Brancher l’app sur le contrat

Dans `E:\CODE\rouletheth\.env.local` ajoute l’adresse déployée :

```bash
NEXT_PUBLIC_ROULETTE_CONTRACT_ADDRESS=0x...
```

Quand `NEXT_PUBLIC_ROULETTE_CONTRACT_ADDRESS` est défini et que le wallet est connecté, les boutons “Place Bet” enverront une **vraie transaction** au contrat (sinon ça reste en mode démo local).

### Sécurité

Le contrat actuel utilise un tirage **pseudo-aléatoire** (OK pour testnet/démo). Pour un “vrai” casino en production, il faudra intégrer une source d’aléa vérifiable (Chainlink VRF ou commit-reveal).

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

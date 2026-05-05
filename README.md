# Note Manager

Application de gestion de notes personnelles — Next.js 14, PostgreSQL, Prisma, NextAuth, Tailwind + shadcn/ui.

## Stack

- **Next.js 14** (App Router, TypeScript)
- **PostgreSQL** + **Prisma** (ORM)
- **NextAuth.js v5** (authentification credentials)
- **Tailwind CSS + shadcn/ui** (UI)
- **@uiw/react-md-editor** (éditeur Markdown)
- **TanStack Query** (cache front)
- **Docker + Docker Compose + Nginx** (déploiement)

## Démarrage en dev

### Prérequis
- Node.js 22+
- PostgreSQL local (ou Docker)

### Installation

```bash
npm install
cp .env.example .env.local
# Édite .env.local avec tes valeurs
```

### Base de données

```bash
npm run db:migrate      # Crée les tables
npm run db:seed         # Crée un user de test (dev@example.com / password123)
```

### Lancer l'app

```bash
npm run dev             # http://localhost:3000
npm run db:studio       # Interface Prisma Studio
```

## Déploiement sur VPS (Oracle Cloud)

### 1. Variables d'environnement

Crée un fichier `docker/.env` :

```env
POSTGRES_USER=noteuser
POSTGRES_PASSWORD=MON_MOT_DE_PASSE_FORT
POSTGRES_DB=notedb
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=https://ton-domaine.com
```

### 2. Premier déploiement

```bash
cd docker
docker compose --env-file .env up -d
```

### 3. Mises à jour suivantes

```bash
./deploy.sh
```

### 4. SSL (optionnel)

Place tes certificats dans `docker/nginx/certs/` puis décommente la section HTTPS dans `docker/nginx/nginx.conf`.

## Structure du projet

```
src/
├── app/
│   ├── (auth)/login/        # Page de connexion
│   ├── (app)/notes/         # Liste des notes
│   ├── (app)/notes/new/     # Créer une note
│   └── api/notes/           # API REST (GET, POST, DELETE, PUT)
├── components/
│   ├── notes/               # NoteCard, NoteList, DeleteNoteModal
│   ├── editor/              # MarkdownEditor
│   └── providers/           # QueryProvider
└── lib/
    ├── auth.ts              # NextAuth config
    ├── prisma.ts            # Prisma client singleton
    └── queryClient.ts       # TanStack Query config
```

# Kanban Board API - Backend

Ce projet est une API Backend pour une application de type **Kanban Board** (Tableau Kanban). Il permet la gestion d'utilisateurs, de tableaux, de colonnes et de tâches (avec support pour le déplacement des tâches entre colonnes).

L'application est construite avec **Node.js**, **Express**, **Prisma ORM**, et utilise **PostgreSQL** comme base de données.

---

## 🚀 Fonctionnalités

- **Authentification Sécurisée** : Inscription et connexion avec génération de JWT (JSON Web Tokens) et hachage des mots de passe avec `bcrypt`.
- **Gestion des Tableaux (Boards)** :
  - Création de tableaux avec titre et description.
  - Récupération de tous les tableaux appartenant à l'utilisateur connecté.
  - Suppression de tableaux (seul le propriétaire peut supprimer son tableau).
- **Gestion des Colonnes (Columns)** :
  - Création de colonnes rattachées à un tableau.
  - Récupération de toutes les colonnes d'un tableau spécifique.
  - Suppression de colonnes.
- **Gestion des Tâches (Tasks)** :
  - Création de tâches dans une colonne spécifique.
  - Récupération de toutes les tâches d'une colonne.
  - Déplacement et réorganisation des tâches (changement de colonne et/ou de position).

---

## 🛠️ Technologies & Outils

- **Runtime** : [Node.js](https://nodejs.org/) (ES Modules)
- **Framework Web** : [Express.js](https://expressjs.com/)
- **Base de données** : [PostgreSQL](https://www.postgresql.org/)
- **ORM** : [Prisma](https://www.prisma.io/)
- **Authentification** : `jsonwebtoken` & `bcrypt`
- **Développement** : `nodemon` (rechargement automatique)

---

## 📁 Structure du Projet

```text
backend/
├── prisma/
│   ├── schema.prisma        # Modèle de base de données Prisma
│   └── migrations/          # Migrations de base de données SQL
├── src/
│   ├── app.js               # Configuration d'Express (middlewares, routes)
│   ├── index.js             # Point d'entrée du serveur (écoute sur le port)
│   ├── controllers/         # Logique de traitement des requêtes HTTP
│   ├── middleware/          # Middlewares (ex: authentification JWT)
│   ├── routes/              # Définition des routes de l'API
│   ├── services/            # Logique métier et requêtes de base de données (via Prisma)
│   └── utils/               # Outils partagés (génération/vérification de token)
├── .env                     # Variables d'environnement (non versionné)
├── package.json             # Dépendances et scripts de démarrage
└── README.md                # Documentation du projet
```

---

## ⚙️ Configuration Initiale

### 1. Prérequis
Assurez-vous d'avoir installé :
- [Node.js](https://nodejs.org/) (v16 ou supérieur recommandé)
- [PostgreSQL](https://www.postgresql.org/) en cours d'exécution localement ou sur un serveur distant.

### 2. Cloner le dépôt et installer les dépendances
Déplacez-vous dans le dossier du backend et installez les paquets :
```bash
npm install
```

### 3. Fichier d'environnement (`.env`)
Créez un fichier `.env` à la racine du projet backend et configurez les variables suivantes :
```env
PORT=4000
DATABASE_URL="postgresql://<utilisateur>:<mot_de_passe>@localhost:5432/<nom_base_de_données>?schema=public"
JWT_SECRET="votre_secret_jwt_ultra_securise"
```

*Remplacez `<utilisateur>`, `<mot_de_passe>` et `<nom_base_de_données>` par vos identifiants PostgreSQL.*

### 4. Base de données & Migrations Prisma
Exécutez la commande suivante pour créer la base de données (si elle n'existe pas) et appliquer le schéma Prisma :
```bash
npx prisma migrate dev --name init
```

Cette commande va également générer le client Prisma (`Prisma Client`).

---

## 🏃 Lancement de l'Application

### En mode Développement (avec Nodemon)
Pour lancer le serveur avec un rechargement automatique à chaque modification de code :
```bash
npm run dev
```
Le serveur démarrera par défaut sur le port configuré (ex: `http://localhost:4000`).

### En mode Production
Pour démarrer le serveur de manière standard :
```bash
npm start
```

---

## 🔌 Documentation des Endpoints API

Toutes les requêtes de gestion (Boards, Columns, Tasks) requièrent l'envoi d'un Token JWT dans les en-têtes HTTP de la requête :
`Authorization: Bearer <votre_token_jwt>`

### 🔑 Authentification (`/auth`)

#### 1. Inscription
- **Route** : `POST /auth/register`
- **Authentification requise** : Non
- **Corps de la requête (JSON)** :
  ```json
  {
    "name": "Jean Dupont",
    "email": "jean.dupont@example.com",
    "password": "motdepassefort"
  }
  ```
- **Réponse (201 Created)** : Renvoie l'utilisateur créé (sans le mot de passe haché).

#### 2. Connexion
- **Route** : `POST /auth/login`
- **Authentification requise** : Non
- **Corps de la requête (JSON)** :
  ```json
  {
    "email": "jean.dupont@example.com",
    "password": "motdepassefort"
  }
  ```
- **Réponse (200 OK)** :
  ```json
  {
    "message": "Connexion reussie",
    "user": {
      "id": "uuid-de-l-utilisateur",
      "name": "Jean Dupont",
      "email": "jean.dupont@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

---

### 📋 Tableaux (`/boards`)

#### 1. Récupérer tous les tableaux de l'utilisateur
- **Route** : `GET /boards`
- **Authentification requise** : Oui
- **Réponse (200 OK)** : Liste des tableaux dont l'utilisateur est propriétaire ou membre.

#### 2. Créer un tableau
- **Route** : `POST /boards`
- **Authentification requise** : Oui
- **Corps de la requête (JSON)** :
  ```json
  {
    "title": "Mon projet Kanban",
    "description": "Description optionnelle du projet"
  }
  ```
- **Réponse (201 Created)** : Détails du tableau créé.

#### 3. Supprimer un tableau
- **Route** : `DELETE /boards/:boardId`
- **Authentification requise** : Oui
- **Réponse (200 OK)** : Informations sur le tableau supprimé.

---

### 🗂️ Colonnes (`/boards/:boardId/columns`)

#### 1. Récupérer toutes les colonnes d'un tableau
- **Route** : `GET /boards/:boardId/columns`
- **Authentification requise** : Oui
- **Réponse (200 OK)** : Liste des colonnes ordonnées par position.

#### 2. Créer une colonne dans un tableau
- **Route** : `POST /boards/:boardId/columns`
- **Authentification requise** : Oui
- **Corps de la requête (JSON)** :
  ```json
  {
    "title": "À faire"
  }
  ```
- **Réponse (201 Created)** : Détails de la colonne créée (la position est gérée automatiquement).

#### 3. Supprimer une colonne
- **Route** : `DELETE /boards/:boardId/columns/:columnId`
- **Authentification requise** : Oui
- **Réponse (200 OK)** : Informations sur la colonne supprimée.

---

### 📝 Tâches (`/boards/:boardId/columns/:columnId/tasks` & `/boards/:boardId/tasks`)

#### 1. Récupérer toutes les tâches d'une colonne
- **Route** : `GET /boards/:boardId/columns/:columnId/tasks`
- **Authentification requise** : Oui
- **Réponse (200 OK)** : Liste des tâches rattachées à la colonne ordonnées par position.

#### 2. Créer une tâche dans une colonne
- **Route** : `POST /boards/:boardId/columns/:columnId/tasks`
- **Authentification requise** : Oui
- **Corps de la requête (JSON)** :
  ```json
  {
    "title": "Rédiger le fichier README",
    "description": "Décrire le fonctionnement et les routes de l'API"
  }
  ```
- **Réponse (201 Created)** : Détails de la tâche créée.

#### 3. Déplacer/Réordonner une tâche
- **Route** : `PATCH /boards/:boardId/tasks/:taskId/move`
- **Authentification requise** : Oui
- **Corps de la requête (JSON)** :
  ```json
  {
    "newColumnId": "uuid-de-la-nouvelle-colonne",
    "newPosition": 2
  }
  ```
- **Réponse (200 OK)** : Détails de la tâche après déplacement.

---

## 🗄️ Schéma de Base de Données (Prisma Schema)

Le schéma contient 5 tables clés définissant les relations :

1. **User** : Modèle utilisateur pour stocker les informations de connexion.
2. **Board** : Tableaux créés par les utilisateurs. Possède une relation de possession (`ownerId`) et une relation plusieurs-à-plusieurs (`BoardMember`) pour le travail collaboratif.
3. **BoardMember** : Gère l'association entre les utilisateurs et les tableaux avec un rôle (par défaut `member`).
4. **Column** : Colonnes appartenant à un tableau (ex: "À faire", "En cours", "Terminé"). Contient un champ `position` pour le tri.
5. **Task** : Tâches contenues dans une colonne, créées par un utilisateur (`creatorId`). Contient également une `position` pour ordonner les tâches dans la colonne.

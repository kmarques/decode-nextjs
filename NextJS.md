# Next.js + TypeScript + Firebase — Projet de formation

Ce projet [Next.js](https://nextjs.org) utilise l'App Router pour illustrer les notions clés de Next.js et l'intégration Firebase.

## Notions clés du cours

### 1. Next.js App Router
Next.js 13+ utilise le nouveau système de routing basé sur le dossier `app/`.

**Structure du routing**:
```
app/
  page.tsx              → / (page d'accueil)
  layout.tsx            → Layout racine
  formations/
    page.tsx            → /formations
    layout.tsx          → Layout pour /formations/*
    [id]/
      page.tsx          → /formations/123 (route dynamique)
  api/
    formations/
      route.ts          → API route GET /api/formations
```

**Route dynamique** (`[id]`):
```tsx
export default async function FormationPage({
  params,
}: PageProps<"/formations/[id]">) {
  const { id } = await params;
  const formations = await getFormations();
  const formation = formations.find((f) => f.id === parseInt(id, 10));
  
  return <div>{formation.title}</div>;
}
```

### 2. Server Components vs Client Components

**Server Components** (par défaut):
- Rendus côté serveur
- Accès direct aux bases de données, fichiers, secrets
- Pas d'interactivité (hooks interdits)
- Code non envoyé au client (bundle plus léger)

```tsx
// Server Component par défaut
export default async function FormationPage() {
  const formations = await getFormations(); // fetch côté serveur
  return <div>{formations.length} formations</div>;
}
```

**Client Components** (directive `"use client"`):
- Exécutés dans le navigateur
- Hooks React autorisés (`useState`, `useEffect`, `useContext`)
- Interactivité (événements, state)

```tsx
"use client";
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

### 3. API Routes
Routes backend dans `app/api/*/route.ts` pour créer des endpoints REST.

```tsx
// app/api/formations/route.ts
export async function GET(request: NextRequest) {
  const formations = await getFormations();
  return Response.json(formations);
}
```

### 4. Layouts
Les `layout.tsx` permettent de partager l'UI entre plusieurs pages.

```tsx
// app/layout.tsx - Layout racine
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

### 5. Firebase — Authentification et Firestore

**Configuration Firebase côté client** (`lib/firebase-front.js`):
```js
import { initializeApp } from "@firebase/app";
import { getAuth } from "@firebase/auth";
import { getFirestore } from "@firebase/firestore";
import firebaseConfig from "@/firebase-front-config.json";

export const app = initializeApp(firebaseConfig, "client-app");
export const auth = getAuth(app);
export const firestore = getFirestore(app);
```

**Configuration Firebase Admin côté serveur** (`lib/firebase-back.js`):
```js
import "server-only";
import admin from "firebase-admin";
import serviceAccount from "@/firebase-back-config.json";

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
}, "admin-app");

export default app;
```

**AuthProvider** (Context + hooks Firebase Auth):
```tsx
"use client";
import { createContext, useEffect, useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, 
         signOut, onAuthStateChanged } from "@firebase/auth";
import { auth } from "@/lib/firebase-front";

export const AuthContext = createContext({
  user: null,
  login: (email, password) => {},
  register: (email, password) => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email, password) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

**Utilisation Firebase Admin côté serveur**:
```ts
import "server-only";
import firebaseAdmin from "@/lib/firebase-back";

export default async function getUser(uid: string) {
  return await firebaseAdmin.auth().getUser(uid);
}
```

### 6. Streaming & Suspense
Next.js permet le streaming de contenu avec `use()` pour améliorer les performances.

```tsx
"use client";
import { use } from "react";

export default function FormationsFrontByStream({ 
  formations 
}: { 
  formations: Promise<Formation[]> 
}) {
  const loadedFormations = use(formations); // Résout la Promise
  
  return (
    <div>
      {loadedFormations.map(f => <div key={f.id}>{f.title}</div>)}
    </div>
  );
}
```

### 7. Navigation
`next/link` pour la navigation côté client sans rechargement de page.

```tsx
import Link from "next/link";

<Link href={`/formations/${formation.id}`}>
  Voir plus
</Link>
```

### 8. Middleware / Proxy
Le middleware (`proxy.ts`) intercepte les requêtes pour vérifier l'authentification Firebase avant d'atteindre les API Routes.

**Middleware** (`proxy.ts`):
```ts
import { NextRequest, NextResponse } from "next/server";
import firebaseAdmin from "@/lib/firebase-back";

export async function proxy(request: NextRequest) {
  const headerValue = request.headers.get("Authorization");
  
  if (headerValue) {
    const [, token] = headerValue.split(/\s+/);
    try {
      // Vérifie le token Firebase
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(token, true);
      const user = await getUser(decodedToken.uid);
      
      // Ajoute l'ID utilisateur dans les headers
      request.headers.set("X-USER-ID", user.uid);
    } catch (error) {
      return new NextResponse(null, { status: 401 });
    }
  }
  
  return NextResponse.next();
}

// Configuration: appliquer le proxy aux routes /api/*
export const config = {
  matcher: [{ source: "/api/:path*" }],
};
```

**Service API côté client** (`services/api.ts`):
```ts
const api = {
  token: null,
  request(url: string, options: RequestInit = {}) {
    if (this.token) {
      options.headers = {
        ...(options.headers ?? {}),
        Authorization: `Bearer ${this.token}`,
      };
    }
    return fetch(url, options);
  },
};

export default api;
```

**Utilisation dans l'AuthProvider**:
```tsx
// Après connexion, enregistrer le token
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      const token = await getIdToken(currentUser, true);
      api.token = token; // Token envoyé automatiquement aux API routes
    } else {
      api.token = null;
    }
    setUser(currentUser);
  });
  return () => unsubscribe();
}, []);
```

**Flux d'authentification**:
1. Client se connecte via Firebase Auth
2. Token JWT récupéré avec `getIdToken()`
3. Token stocké dans `api.token`
4. Requêtes API incluent `Authorization: Bearer <token>`
5. Middleware vérifie le token côté serveur avec Firebase Admin
6. Si valide, ajoute `X-USER-ID` dans les headers
7. API Route peut accéder à l'utilisateur via `request.headers.get("X-USER-ID")`

## Concepts clés à retenir

- **Server Components par défaut**: tout est serveur sauf si `"use client"`
- **Firebase côté client**: Auth, Firestore avec SDK web
- **Firebase Admin côté serveur**: pour opérations privilégiées (vérification tokens, accès base)
- **API Routes**: pour créer des endpoints REST personnalisés
- **Layouts**: partagent l'UI entre pages (navbar, providers)
- **Routes dynamiques**: `[id]` pour paramètres dans l'URL
- **Context API**: pour partager l'état auth dans toute l'app
- **Middleware/Proxy**: intercepte les requêtes `/api/*` pour vérifier l'authentification et ajouter les infos utilisateur


## Démarrage du projet

Lancer le serveur de développement:

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) pour voir le résultat.

## Ressources

**Next.js**:
- [Documentation Next.js](https://nextjs.org/docs)
- [App Router](https://nextjs.org/docs/app)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)

**Firebase**:
- [Firebase Auth](https://firebase.google.com/docs/auth/web/start)
- [Firestore](https://firebase.google.com/docs/firestore)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)

**TypeScript & React**:
- Voir `../Typescript.md` pour les typages
- Voir `../REACT.md` pour props, state, useEffect

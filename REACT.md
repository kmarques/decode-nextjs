# React — Props, State et useEffect

Ce document regroupe les notions essentielles sur les `props`, le `state` et le hook `useEffect` en React (exemples en TypeScript). Il est destiné aux développeurs qui commencent avec React + hooks.

## 1. Props
- **Définition**: les `props` (properties) sont les données passées d'un composant parent à un composant enfant. Elles sont en lecture seule dans l'enfant.
- **Typage (TypeScript)**: on définit une interface pour typer les props.

```tsx
interface GreetingProps {
  name: string;
  age?: number; // optionnel
}

function Greeting({ name, age }: GreetingProps) {
  return (
    <div>
      <p>Bonjour, {name}!</p>
      {age && <small>Âge: {age}</small>}
    </div>
  );
}
```

- **Bonnes pratiques**:
  - Préférer des props simples et explicites.
  - Eviter de passer des objets profondément imbriqués; utiliser des objets immuables ou des sélecteurs.
  - Documenter les props d'un composant réutilisable.

## 2. State
- **Définition**: le `state` représente les données locales et mutables d'un composant.
- **Hook principal**: `useState`.

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState<number>(0);

  return (
    <div>
      <p>Compteur: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
    </div>
  );
}
```

- **State complexe**: pour des objets ou structures complexes, on peut utiliser `useState` avec un updater fonctionnel ou `useReducer`.

```tsx
type Form = { name: string; email: string };

function FormComponent() {
  const [form, setForm] = useState<Form>({ name: '', email: '' });

  function update<K extends keyof Form>(key: K, value: Form[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  return null;
}
```

- **Bonnes pratiques**:
  - Garder le state minimal: calculer les valeurs dérivées à la volée.
  - Préférer des mises à jour immuables.
  - Utiliser `useReducer` pour la logique de state complexe.

## 3. useEffect
- **Définition**: `useEffect` exécute du code côté effet de bord (fetch, abonnement, manipulation du DOM) après le rendu.

```tsx
import { useEffect, useState } from 'react';

function DataFetcher({ url }: { url: string }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      const res = await fetch(url);
      const json = await res.json();
      if (!cancelled) setData(json);
    }

    fetchData();

    return () => {
      cancelled = true; // cleanup: empêche la mise à jour après démontage
    };
  }, [url]); // dépendances: relancer l'effet si `url` change

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

- **Cas d'usage courants**:
  - Récupérer des données (`fetch`) quand le composant monte ou quand une dépendance change.
  - Souscrire à un service (WebSocket, EventSource) et nettoyer la souscription au démontage.
  - Synchroniser avec le DOM (measurements) après rendu.

- **Attention aux dépendances**:
  - Toujours lister toutes les dépendances nécessaires (fonctions, props, state) pour éviter des effets obsolètes.
  - Utiliser `useCallback` / `useMemo` pour stabiliser les références si nécessaire.

- **Effet d'initialisation (montage unique)**:
  - Passer un tableau de dépendances vide `[]` pour exécuter l'effet une seule fois (équivalent componentDidMount).

```tsx
useEffect(() => {
  // code d'initialisation
}, []);
```

## 4. Patterns et erreurs fréquentes
- Ne pas muter directement le state (ex: `state.push(...)`) — utiliser des copies immutables.
- Eviter d'appeler `setState` sans condition dans un effet sans dépendances, cela crée une boucle infinie.
- Faire attention aux closures: une fonction dans un effet capture les variables d'une render particulière.
- Nettoyer les abonnements et timers dans la fonction de nettoyage retournée par `useEffect`.

## 5. Exemples avancés rapides
- Debounce avec `useEffect`:

```tsx
import { useEffect, useState } from 'react';

function Search({ query }: { query: string }) {
  const [debounced, setDebounced] = useState(query);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(query), 300);
    return () => clearTimeout(id);
  }, [query]);

  return null;
}
```

- Abonnement WebSocket:

```tsx
useEffect(() => {
  const ws = new WebSocket('wss://example');
  ws.addEventListener('message', onMessage);
  return () => {
    ws.removeEventListener('message', onMessage);
    ws.close();
  };
}, []);
```

## Conclusion
- `props` = API d'un composant (lecture seule).
- `state` = données locales mutables du composant.
- `useEffect` = outil pour effets de bord et cycles de vie.


"use client";

import Link from "next/link";
import { use } from "react";

type Formation = {
  id: number;
  title: string;
  pricing: number;
};

export default function FormationsFrontByStream({
  formations,
}: {
  formations: Promise<Formation[]>;
}) {
  const loadedFormations = use(formations);

  return (
    <div className="flex gap-4">
      {loadedFormations.map((formation) => (
        <div
          key={formation.id}
          className="border shadow-sm flex flex-col gap-2"
        >
          <h2>{formation.title}</h2>
          <p className="self-end">{formation.pricing} €</p>
          <Link
            href={`/formations/${formation.id}`}
            className="bg-green-500 text-red-500"
          >
            Voir plus
          </Link>
        </div>
      ))}
    </div>
  );
}

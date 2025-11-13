"use client";

import api from "@/services/api";
import Link from "next/link";
import { useEffect, useState } from "react";

type Formation = {
  id: number;
  title: string;
  pricing: number;
};

export default function FormationsFrontByAPI() {
  const [formations, setFormations] = useState<Formation[]>([]);

  useEffect(() => {
    async function grapFormations() {
      const resp = await api.request("/api/formations");
      setFormations(await resp.json());
    }
    grapFormations();
  }, []);

  return (
    <div className="flex gap-4">
      {formations.map((formation) => (
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

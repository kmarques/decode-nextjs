import { getFormations } from "@/services/formation";
import Link from "next/link";
import FormationsFrontByAPI from "./components/FormationsFrontByAPI";
import FormationsFrontByStream from "./components/FormationsFrontByStream";

export default async function FormationsPage() {
  const formations = await getFormations();
  const streamFormations = getFormations();
  return (
    <>
      <h1>Nos Formations</h1>
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
      <div>
        Formations chargées par API
        <FormationsFrontByAPI />
        Formations chargées par Stream
        <FormationsFrontByStream formations={streamFormations} />
      </div>
    </>
  );
}

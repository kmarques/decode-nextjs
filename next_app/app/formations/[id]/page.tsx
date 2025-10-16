import { getFormations } from "@/services/formation";

export default async function FormationPage({
  params,
}: PageProps<"/formations/[id]">) {
  const { id } = await params;
  const formations = await getFormations();
  const formation = formations.find((f) => f.id === parseInt(id, 10));

  if (!formation) {
    return (
      <div className="flex items-center jusity-center">
        Formation non trouvée
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="flex items-center jusity-center bg-pink-500">
        <img src="https://picsum.photos/200/300" alt="formation-cover" />
      </div>
      <div className="flex items-center jusity-center bg-yellow-500">
        <h1>{formation.title}</h1>
        <p>Price: {formation?.pricing} €</p>
      </div>
    </div>
  );
}

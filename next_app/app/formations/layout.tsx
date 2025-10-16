import { getFormations } from "@/services/formation";
import Link from "next/link";

export default async function FormationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const formations = await getFormations();

  return (
    <div className="flex flex-col w-full">
      <nav>
        {formations.map((form) => (
          <Link key={form.id} href={`/formations/${form.id}`}>
            {form.title}
          </Link>
        ))}
      </nav>
      <div className="flex-1">{children}</div>
    </div>
  );
}

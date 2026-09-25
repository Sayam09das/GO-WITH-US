import { StayCatalogCard } from "@/components/catalog/stay-catalog-card";
import { getAllStays } from "@/lib/api/stays";

export async function StaysCatalogGrid() {
  const stays = await getAllStays();

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {stays.map((stay) => (
        <StayCatalogCard key={stay.id} stay={stay} />
      ))}
    </div>
  );
}

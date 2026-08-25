import { notFound } from "next/navigation";
import { getItem } from "@/lib/items";
import ItemForm from "@/components/admin/ItemForm";

export default async function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = getItem(Number(id));
  if (!item) notFound();

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[#5c1620]">تعديل العنصر</h1>
      <p className="mt-1 text-sm text-[#2a2420]/60">{item.title_ar}</p>
      <div className="mt-6">
        <ItemForm item={item} itemId={item.id} />
      </div>
    </div>
  );
}

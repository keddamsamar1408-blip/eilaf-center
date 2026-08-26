import { getTranslations } from "next-intl/server";
import { listItems, type ItemCategory } from "@/lib/items";
import { getAllSettings } from "@/lib/db";
import ItemCard from "@/components/ItemCard";

export default async function CategoryPage({
  category,
  namespace,
}: {
  category: ItemCategory;
  namespace: "support" | "courses" | "education" | "events";
}) {
  const t = await getTranslations(namespace);
  const tCommon = await getTranslations("common");
  const settings = await getAllSettings();
  const items = await listItems({ category });

  return (
    <div>
      <section className="bg-gradient-to-br from-cream via-cream-light to-white pattern-bg py-16">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-maroon-dark sm:text-4xl">{t("title")}</h1>
          <p className="mt-3 text-lg text-ink/60">{t("subtitle")}</p>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-ink/60">{t("intro")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="section-title text-2xl font-extrabold text-maroon-dark">{t("listTitle")}</h2>

        {items.length === 0 ? (
          <p className="mt-10 rounded-2xl bg-cream p-10 text-center text-ink/50">{tCommon("noItems")}</p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} whatsapp={settings.whatsapp_number} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}


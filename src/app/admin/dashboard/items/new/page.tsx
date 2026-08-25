import ItemForm from "@/components/admin/ItemForm";

export default function NewItemPage() {
  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[#5c1620]">إضافة عنصر جديد</h1>
      <p className="mt-1 text-sm text-[#2a2420]/60">أضف جلسة، دورة، برنامج تعليمي أو فعالية جديدة</p>
      <div className="mt-6">
        <ItemForm />
      </div>
    </div>
  );
}

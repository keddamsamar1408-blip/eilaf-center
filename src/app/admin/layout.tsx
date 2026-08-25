import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "لوحة التحكم | مركز إيلاف",
  description: "لوحة إدارة مركز إيلاف للتدريب والإرشاد الأسري",
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased">{children}</body>
    </html>
  );
}

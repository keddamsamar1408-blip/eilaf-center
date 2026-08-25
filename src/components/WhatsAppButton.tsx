"use client";

export default function WhatsAppButton({
  phone,
  message,
}: {
  phone: string;
  message?: string;
}) {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const text = encodeURIComponent(message || "مرحبًا، أرغب في الاستفسار عن خدمات مركز إيلاف");
  const href = `https://wa.me/${cleanPhone}?text=${text}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-black/20 transition-transform hover:scale-110 end-6"
    >
      <svg viewBox="0 0 32 32" className="h-8 w-8 fill-white">
        <path d="M16.004 3C9.377 3 4 8.377 4 15.004c0 2.383.63 4.626 1.822 6.612L4 29l7.548-1.986a11.94 11.94 0 0 0 4.456.857h.004c6.627 0 12.004-5.377 12.004-12.004C28.012 8.377 22.635 3 16.004 3Zm7.03 17.03c-.294.827-1.462 1.513-2.404 1.712-.639.132-1.474.238-4.284-.917-3.598-1.478-5.916-5.135-6.098-5.373-.176-.238-1.462-1.945-1.462-3.71 0-1.765.926-2.633 1.253-2.995.328-.362.717-.453.956-.453.238 0 .478.002.686.013.22.011.516-.083.807.616.294.706 1 2.435 1.088 2.612.088.176.147.383.03.62-.117.239-.176.386-.353.593-.176.207-.372.462-.53.62-.176.176-.36.367-.155.72.206.353.914 1.51 1.964 2.446 1.35 1.204 2.489 1.577 2.842 1.754.353.176.559.147.765-.088.206-.235.883-1.03 1.118-1.383.235-.353.47-.294.794-.176.324.117 2.06.972 2.412 1.148.353.176.588.264.676.412.088.147.088.853-.206 1.68Z" />
      </svg>
    </a>
  );
}

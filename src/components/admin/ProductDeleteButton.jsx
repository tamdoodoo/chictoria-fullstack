"use client";

import { useRouter } from "next/navigation";
import { useLang } from "@/context/LanguageContext";

export default function ProductDeleteButton({ productId }) {
  const router = useRouter();
  const { t } = useLang();

  const handleDelete = async () => {
    if (!confirm(t("admin_delete_confirm"))) return;

    const res = await fetch(`/api/products/${productId}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      alert(t("admin_delete_failed"));
    }
  };

  return (
    <button onClick={handleDelete} className="text-danger hover:underline text-xs">
      {t("admin_delete")}
    </button>
  );
}

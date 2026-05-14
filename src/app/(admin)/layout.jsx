import { LanguageProvider } from "@/context/LanguageContext";

export default function AdminLayout({ children }) {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </LanguageProvider>
  );
}

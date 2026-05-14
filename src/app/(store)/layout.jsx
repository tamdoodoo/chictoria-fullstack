import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import { RecentlyViewedProvider } from "@/context/RecentlyViewedContext";
import Header from "@/components/store/Header";
import Footer from "@/components/store/Footer";
import Toast from "@/components/store/Toast";
import CartDrawer from "@/components/store/CartDrawer";

export default function StoreLayout({ children }) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <RecentlyViewedProvider>
            <Header />
            {children}
            <Footer />
            <Toast />
            <CartDrawer />
          </RecentlyViewedProvider>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

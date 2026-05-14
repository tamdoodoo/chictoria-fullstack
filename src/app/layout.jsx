import "./globals.css";

export const metadata = {
  title: "Chictoria — Bag & More",
  description: "Túi xách chấm bi & sọc — thiết kế Hàn Quốc, chất liệu bền đẹp",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-cream text-text-primary font-sans">
        {children}
      </body>
    </html>
  );
}

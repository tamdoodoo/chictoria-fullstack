// Run: node --env-file=.env.local src/data/seed.js
// Seeds the 6 existing Chictoria products into Firestore

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

const db = getFirestore();

const products = [
  {
    id: "quilted-tote-black",
    name: { vi: "Túi Tote Chấm Bi Bông — Đen", en: "Quilted Polka Dot Tote — Black" },
    price: 319000,
    originalPrice: 335000,
    category: "tote",
    color: { vi: "Đen", en: "Black" },
    images: ["/images/SKU1-1.jpg", "/images/SKU1-2.jpg"],
    description: {
      vi: "Túi tote bông chấm bi với thiết kế puffy diamond-quilted. Chất liệu mềm mại, nhẹ nhàng, phù hợp đi học, đi chơi.",
      en: "Polka dot quilted tote with puffy diamond-quilted design. Soft, lightweight, perfect for school and outings.",
    },
    details: {
      vi: ["Chất liệu: Vải cotton quilted cao cấp", "Kích thước: 35 x 30 x 12 cm", "Quai xách ngắn, chắc chắn", "Có lớp lót bên trong", "Túi zip nhỏ bên trong"],
      en: ["Material: Premium quilted cotton", "Size: 35 x 30 x 12 cm", "Short, sturdy handles", "Inner lining", "Small zip pocket inside"],
    },
    whatFitsInside: [
      { icon: "📱", label: { vi: "Điện thoại", en: "Phone" } },
      { icon: "📓", label: { vi: "Sổ tay A5", en: "A5 notebook" } },
      { icon: "💄", label: { vi: "Mỹ phẩm", en: "Cosmetics" } },
      { icon: "🎧", label: { vi: "Tai nghe", en: "Earphones" } },
      { icon: "🔑", label: { vi: "Chìa khoá", en: "Keys" } },
      { icon: "👛", label: { vi: "Ví tiền", en: "Wallet" } },
    ],
    badge: "Bestseller",
    rating: 5.0,
    reviews: 40,
    sold: 120,
    stock: 50,
    featured: true,
    isNew: false,
  },
  {
    id: "quilted-tote-cream",
    name: { vi: "Túi Tote Chấm Bi Bông — Kem", en: "Quilted Polka Dot Tote — Cream" },
    price: 319000,
    originalPrice: 335000,
    category: "tote",
    color: { vi: "Kem", en: "Cream" },
    images: ["/images/SKU1-2.jpg", "/images/SKU2-1.jpg", "/images/SKU1-1.jpg"],
    description: {
      vi: "Phiên bản kem trắng của túi tote bông chấm bi signature. Tông màu nhẹ nhàng, thanh lịch, dễ phối đồ.",
      en: "Cream version of the signature polka dot quilted tote. Soft, elegant tone that pairs with everything.",
    },
    details: {
      vi: ["Chất liệu: Vải cotton quilted cao cấp", "Kích thước: 35 x 30 x 12 cm", "Quai xách ngắn, chắc chắn", "Có lớp lót bên trong", "Túi zip nhỏ bên trong"],
      en: ["Material: Premium quilted cotton", "Size: 35 x 30 x 12 cm", "Short, sturdy handles", "Inner lining", "Small zip pocket inside"],
    },
    whatFitsInside: [
      { icon: "📱", label: { vi: "Điện thoại", en: "Phone" } },
      { icon: "📓", label: { vi: "Sổ tay A5", en: "A5 notebook" } },
      { icon: "💄", label: { vi: "Mỹ phẩm", en: "Cosmetics" } },
      { icon: "🎧", label: { vi: "Tai nghe", en: "Earphones" } },
      { icon: "🔑", label: { vi: "Chìa khoá", en: "Keys" } },
      { icon: "👛", label: { vi: "Ví tiền", en: "Wallet" } },
    ],
    badge: "Bestseller",
    rating: 5.0,
    reviews: 50,
    sold: 150,
    stock: 45,
    featured: true,
    isNew: false,
  },
  {
    id: "hobo-polkadot-black",
    name: { vi: "Túi Hobo Hai Mặt — Chấm Bi Đen", en: "Reversible Hobo Bag — Black Polka Dot" },
    price: 349000,
    originalPrice: null,
    category: "hobo",
    color: { vi: "Chấm Bi Đen", en: "Black Polka Dot" },
    images: ["/images/SKU4.jpg", "/images/SKU4-2.jpg", "/images/products-showcase-1.jpg"],
    description: {
      vi: "Túi hobo hai mặt — một mặt chấm bi đen trắng, mặt kia vải denim xanh. Kiểu dáng slouchy thoải mái.",
      en: "Reversible hobo bag — one side black & white polka dot, the other denim blue. Comfortable slouchy shape.",
    },
    details: {
      vi: ["Chất liệu: Vải canvas + denim", "Kích thước: 40 x 35 x 15 cm", "Thiết kế hai mặt reversible", "Túi trước có nhãn Chictoria", "Quai vai rộng, thoải mái", "Lót denim bền đẹp"],
      en: ["Material: Canvas + denim", "Size: 40 x 35 x 15 cm", "Reversible two-sided design", "Front pocket with Chictoria label", "Wide shoulder strap", "Durable denim lining"],
    },
    whatFitsInside: [
      { icon: "💻", label: { vi: "Laptop 13\"", en: "13\" Laptop" } },
      { icon: "📚", label: { vi: "Sách / vở", en: "Books" } },
      { icon: "📱", label: { vi: "Điện thoại", en: "Phone" } },
      { icon: "🍱", label: { vi: "Hộp cơm", en: "Lunch box" } },
      { icon: "☂️", label: { vi: "Ô / dù", en: "Umbrella" } },
      { icon: "💧", label: { vi: "Bình nước", en: "Water bottle" } },
    ],
    badge: null,
    rating: 4.9,
    reviews: 35,
    sold: 95,
    stock: 30,
    featured: true,
    isNew: false,
  },
  {
    id: "hobo-polkadot-cream",
    name: { vi: "Túi Hobo Hai Mặt — Chấm Bi Kem", en: "Reversible Hobo Bag — Cream Polka Dot" },
    price: 349000,
    originalPrice: null,
    category: "hobo",
    color: { vi: "Chấm Bi Kem", en: "Cream Polka Dot" },
    images: ["/images/products-showcase-1.jpg", "/images/SKU4.jpg"],
    description: {
      vi: "Phiên bản kem trắng của túi hobo hai mặt. Tông kem sáng với chấm bi đen, mặt trong denim xanh.",
      en: "Cream version of the reversible hobo bag. Light cream with black polka dots, denim blue inside.",
    },
    details: {
      vi: ["Chất liệu: Vải canvas + denim", "Kích thước: 40 x 35 x 15 cm", "Thiết kế hai mặt reversible", "Túi trước có nhãn Chictoria", "Quai vai rộng, thoải mái", "Lót denim bền đẹp"],
      en: ["Material: Canvas + denim", "Size: 40 x 35 x 15 cm", "Reversible two-sided design", "Front pocket with Chictoria label", "Wide shoulder strap", "Durable denim lining"],
    },
    whatFitsInside: [
      { icon: "💻", label: { vi: "Laptop 13\"", en: "13\" Laptop" } },
      { icon: "📚", label: { vi: "Sách / vở", en: "Books" } },
      { icon: "📱", label: { vi: "Điện thoại", en: "Phone" } },
      { icon: "🍱", label: { vi: "Hộp cơm", en: "Lunch box" } },
      { icon: "☂️", label: { vi: "Ô / dù", en: "Umbrella" } },
      { icon: "💧", label: { vi: "Bình nước", en: "Water bottle" } },
    ],
    badge: "New",
    rating: 4.8,
    reviews: 22,
    sold: 60,
    stock: 40,
    featured: true,
    isNew: true,
  },
  {
    id: "hobo-stripe-blue",
    name: { vi: "Túi Hobo Hai Mặt — Sọc Xanh", en: "Reversible Hobo Bag — Blue Stripe" },
    price: 329000,
    originalPrice: 369000,
    category: "hobo",
    color: { vi: "Sọc Xanh", en: "Blue Stripe" },
    images: ["/images/SKU3.jpg", "/images/products-showcase-2.jpg"],
    description: {
      vi: "Túi hobo sọc xanh trắng phong cách biển. Mang cảm giác summer, tươi mát, năng động.",
      en: "Blue & white striped hobo bag with a nautical vibe. Summer fresh and active style.",
    },
    details: {
      vi: ["Chất liệu: Vải cotton sọc + denim", "Kích thước: 40 x 35 x 15 cm", "Thiết kế hai mặt reversible", "Túi trước có nhãn Chictoria", "Quai vai rộng, thoải mái"],
      en: ["Material: Striped cotton + denim", "Size: 40 x 35 x 15 cm", "Reversible two-sided design", "Front pocket with Chictoria label", "Wide shoulder strap"],
    },
    whatFitsInside: [
      { icon: "💻", label: { vi: "Laptop 13\"", en: "13\" Laptop" } },
      { icon: "📚", label: { vi: "Sách / vở", en: "Books" } },
      { icon: "📱", label: { vi: "Điện thoại", en: "Phone" } },
      { icon: "🍱", label: { vi: "Hộp cơm", en: "Lunch box" } },
      { icon: "☂️", label: { vi: "Ô / dù", en: "Umbrella" } },
      { icon: "💧", label: { vi: "Bình nước", en: "Water bottle" } },
    ],
    badge: "Sale",
    rating: 4.9,
    reviews: 28,
    sold: 80,
    stock: 25,
    featured: true,
    isNew: false,
  },
  {
    id: "hobo-stripe-pink",
    name: { vi: "Túi Hobo Hai Mặt — Sọc Hồng", en: "Reversible Hobo Bag — Pink Stripe" },
    price: 329000,
    originalPrice: 369000,
    category: "hobo",
    color: { vi: "Sọc Hồng", en: "Pink Stripe" },
    images: ["/images/SKU3-2.jpg", "/images/products-showcase-2.jpg"],
    description: {
      vi: "Túi hobo sọc hồng trắng ngọt ngào. Phiên bản cute cho các nàng yêu màu hồng.",
      en: "Sweet pink & white striped hobo bag. The cute version for pink lovers.",
    },
    details: {
      vi: ["Chất liệu: Vải cotton sọc + denim", "Kích thước: 40 x 35 x 15 cm", "Thiết kế hai mặt reversible", "Túi trước có nhãn Chictoria", "Quai vai rộng, thoải mái"],
      en: ["Material: Striped cotton + denim", "Size: 40 x 35 x 15 cm", "Reversible two-sided design", "Front pocket with Chictoria label", "Wide shoulder strap"],
    },
    whatFitsInside: [
      { icon: "💻", label: { vi: "Laptop 13\"", en: "13\" Laptop" } },
      { icon: "📚", label: { vi: "Sách / vở", en: "Books" } },
      { icon: "📱", label: { vi: "Điện thoại", en: "Phone" } },
      { icon: "🍱", label: { vi: "Hộp cơm", en: "Lunch box" } },
      { icon: "☂️", label: { vi: "Ô / dù", en: "Umbrella" } },
      { icon: "💧", label: { vi: "Bình nước", en: "Water bottle" } },
    ],
    badge: "Sale",
    rating: 5.0,
    reviews: 32,
    sold: 110,
    stock: 35,
    featured: true,
    isNew: false,
  },
];

async function seed() {
  console.log("Seeding products...");
  for (const product of products) {
    const { id, ...data } = product;
    await db.collection("products").doc(id).set({
      ...data,
      createdAt: FieldValue.serverTimestamp(),
    });
    console.log(`  ✓ ${id}`);
  }
  console.log("Done! Seeded", products.length, "products.");
}

seed().catch(console.error);

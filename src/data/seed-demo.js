// Run: node --env-file=.env.local src/data/seed-demo.js
// Seeds demo orders and customers into Firestore

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

const db = getFirestore();

// Helper: create a Timestamp for N days ago at a specific hour
function daysAgo(days, hour = 10) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, Math.floor(Math.random() * 60), 0, 0);
  return Timestamp.fromDate(d);
}

// Today timestamps at various hours
function today(hour) {
  const d = new Date();
  d.setHours(hour, Math.floor(Math.random() * 60), 0, 0);
  return Timestamp.fromDate(d);
}

const customers = [
  { phone: "0912345678", name: "Nguyễn Thị Mai", notes: "Khách quen, hay mua tote", totalOrders: 3, riskLevel: "normal" },
  { phone: "0987654321", name: "Trần Văn Hùng", notes: "", totalOrders: 1, riskLevel: "normal" },
  { phone: "0909111222", name: "Lê Thị Hương", notes: "Khách VIP, giới thiệu nhiều bạn bè", totalOrders: 5, riskLevel: "normal" },
  { phone: "0933444555", name: "Phạm Minh Tuấn", notes: "Đã huỷ 2 đơn liên tiếp, cần xác nhận kỹ trước khi giao", totalOrders: 4, riskLevel: "high" },
  { phone: "0977888999", name: "Hoàng Thị Lan", notes: "", totalOrders: 2, riskLevel: "normal" },
  { phone: "0966777888", name: "Võ Thanh Tâm", notes: "Hay đổi địa chỉ phút cuối", totalOrders: 2, riskLevel: "medium" },
  { phone: "0911222333", name: "Đặng Thuỳ Linh", notes: "", totalOrders: 1, riskLevel: "normal" },
  { phone: "0944555666", name: "Bùi Quốc Anh", notes: "Mua làm quà tặng", totalOrders: 1, riskLevel: "normal" },
];

const orders = [
  // === TODAY's orders ===
  {
    customerName: "Nguyễn Thị Mai",
    phone: "0912345678",
    address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    items: [
      { productId: "quilted-tote-cream", name: "Túi Tote Chấm Bi Bông — Kem", price: 319000, qty: 1, image: "/images/SKU1-2.jpg" },
      { productId: "hobo-stripe-pink", name: "Túi Hobo Hai Mặt — Sọc Hồng", price: 329000, qty: 1, image: "/images/SKU3-2.jpg" },
    ],
    totalPrice: 648000,
    shippingFee: 0,
    status: "new",
    paymentMethod: "cod",
    paymentStatus: "cod_pending",
    note: "Giao buổi chiều giúp em",
    createdAt: today(9),
    updatedAt: today(9),
  },
  {
    customerName: "Đặng Thuỳ Linh",
    phone: "0911222333",
    address: "45 Lý Thường Kiệt, Quận 10, TP.HCM",
    items: [
      { productId: "quilted-tote-black", name: "Túi Tote Chấm Bi Bông — Đen", price: 319000, qty: 2, image: "/images/SKU1-1.jpg" },
    ],
    totalPrice: 668000,
    shippingFee: 30000,
    status: "new",
    paymentMethod: "bank_transfer",
    paymentStatus: "pending",
    note: "",
    createdAt: today(8),
    updatedAt: today(8),
  },
  {
    customerName: "Bùi Quốc Anh",
    phone: "0944555666",
    address: "78 Trần Hưng Đạo, Quận 5, TP.HCM",
    items: [
      { productId: "hobo-polkadot-cream", name: "Túi Hobo Hai Mặt — Chấm Bi Kem", price: 349000, qty: 1, image: "/images/products-showcase-1.jpg" },
    ],
    totalPrice: 379000,
    shippingFee: 30000,
    status: "new",
    paymentMethod: "cod",
    paymentStatus: "cod_pending",
    note: "Gói quà tặng giúp mình nhé",
    createdAt: today(7),
    updatedAt: today(7),
  },

  // === YESTERDAY ===
  {
    customerName: "Lê Thị Hương",
    phone: "0909111222",
    address: "99 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM",
    items: [
      { productId: "hobo-stripe-blue", name: "Túi Hobo Hai Mặt — Sọc Xanh", price: 329000, qty: 1, image: "/images/SKU3.jpg" },
      { productId: "hobo-stripe-pink", name: "Túi Hobo Hai Mặt — Sọc Hồng", price: 329000, qty: 1, image: "/images/SKU3-2.jpg" },
      { productId: "quilted-tote-cream", name: "Túi Tote Chấm Bi Bông — Kem", price: 319000, qty: 1, image: "/images/SKU1-2.jpg" },
    ],
    totalPrice: 977000,
    shippingFee: 0,
    status: "confirmed",
    paymentMethod: "bank_transfer",
    paymentStatus: "paid",
    note: "",
    createdAt: daysAgo(1, 14),
    updatedAt: daysAgo(1, 16),
  },
  {
    customerName: "Hoàng Thị Lan",
    phone: "0977888999",
    address: "12 Pasteur, Quận 3, TP.HCM",
    items: [
      { productId: "quilted-tote-black", name: "Túi Tote Chấm Bi Bông — Đen", price: 319000, qty: 1, image: "/images/SKU1-1.jpg" },
    ],
    totalPrice: 349000,
    shippingFee: 30000,
    status: "packing",
    paymentMethod: "cod",
    paymentStatus: "cod_pending",
    note: "",
    createdAt: daysAgo(1, 10),
    updatedAt: daysAgo(1, 12),
  },

  // === 2 DAYS AGO ===
  {
    customerName: "Võ Thanh Tâm",
    phone: "0966777888",
    address: "56 Hai Bà Trưng, Quận 1, TP.HCM",
    items: [
      { productId: "hobo-polkadot-black", name: "Túi Hobo Hai Mặt — Chấm Bi Đen", price: 349000, qty: 2, image: "/images/SKU4.jpg" },
    ],
    totalPrice: 698000,
    shippingFee: 0,
    status: "shipping",
    paymentMethod: "bank_transfer",
    paymentStatus: "paid",
    note: "Ship Grab giúp anh",
    createdAt: daysAgo(2, 11),
    updatedAt: daysAgo(1, 9),
  },
  {
    customerName: "Nguyễn Thị Mai",
    phone: "0912345678",
    address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    items: [
      { productId: "quilted-tote-cream", name: "Túi Tote Chấm Bi Bông — Kem", price: 319000, qty: 1, image: "/images/SKU1-2.jpg" },
    ],
    totalPrice: 349000,
    shippingFee: 30000,
    status: "shipping",
    paymentMethod: "cod",
    paymentStatus: "cod_pending",
    note: "",
    createdAt: daysAgo(2, 9),
    updatedAt: daysAgo(1, 14),
  },

  // === 3-5 DAYS AGO (completed) ===
  {
    customerName: "Lê Thị Hương",
    phone: "0909111222",
    address: "99 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM",
    items: [
      { productId: "quilted-tote-black", name: "Túi Tote Chấm Bi Bông — Đen", price: 319000, qty: 1, image: "/images/SKU1-1.jpg" },
      { productId: "quilted-tote-cream", name: "Túi Tote Chấm Bi Bông — Kem", price: 319000, qty: 1, image: "/images/SKU1-2.jpg" },
    ],
    totalPrice: 638000,
    shippingFee: 0,
    status: "completed",
    paymentMethod: "bank_transfer",
    paymentStatus: "paid",
    note: "",
    createdAt: daysAgo(3, 15),
    updatedAt: daysAgo(1, 10),
  },
  {
    customerName: "Trần Văn Hùng",
    phone: "0987654321",
    address: "34 Lê Lợi, Quận 1, TP.HCM",
    items: [
      { productId: "hobo-stripe-blue", name: "Túi Hobo Hai Mặt — Sọc Xanh", price: 329000, qty: 1, image: "/images/SKU3.jpg" },
    ],
    totalPrice: 359000,
    shippingFee: 30000,
    status: "completed",
    paymentMethod: "cod",
    paymentStatus: "paid",
    note: "",
    createdAt: daysAgo(4, 12),
    updatedAt: daysAgo(2, 16),
  },
  {
    customerName: "Hoàng Thị Lan",
    phone: "0977888999",
    address: "12 Pasteur, Quận 3, TP.HCM",
    items: [
      { productId: "hobo-polkadot-cream", name: "Túi Hobo Hai Mặt — Chấm Bi Kem", price: 349000, qty: 1, image: "/images/products-showcase-1.jpg" },
      { productId: "hobo-stripe-pink", name: "Túi Hobo Hai Mặt — Sọc Hồng", price: 329000, qty: 1, image: "/images/SKU3-2.jpg" },
    ],
    totalPrice: 678000,
    shippingFee: 0,
    status: "completed",
    paymentMethod: "bank_transfer",
    paymentStatus: "paid",
    note: "Cảm ơn shop nhé!",
    createdAt: daysAgo(5, 9),
    updatedAt: daysAgo(3, 11),
  },
  {
    customerName: "Lê Thị Hương",
    phone: "0909111222",
    address: "99 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM",
    items: [
      { productId: "hobo-polkadot-black", name: "Túi Hobo Hai Mặt — Chấm Bi Đen", price: 349000, qty: 1, image: "/images/SKU4.jpg" },
    ],
    totalPrice: 379000,
    shippingFee: 30000,
    status: "completed",
    paymentMethod: "cod",
    paymentStatus: "paid",
    note: "",
    createdAt: daysAgo(5, 14),
    updatedAt: daysAgo(3, 9),
  },

  // === CANCELLED ===
  {
    customerName: "Phạm Minh Tuấn",
    phone: "0933444555",
    address: "67 Cách Mạng Tháng 8, Quận Tân Bình, TP.HCM",
    items: [
      { productId: "quilted-tote-black", name: "Túi Tote Chấm Bi Bông — Đen", price: 319000, qty: 1, image: "/images/SKU1-1.jpg" },
    ],
    totalPrice: 349000,
    shippingFee: 30000,
    status: "cancelled",
    paymentMethod: "cod",
    paymentStatus: "pending",
    note: "",
    createdAt: daysAgo(3, 11),
    updatedAt: daysAgo(3, 13),
  },
  {
    customerName: "Phạm Minh Tuấn",
    phone: "0933444555",
    address: "67 Cách Mạng Tháng 8, Quận Tân Bình, TP.HCM",
    items: [
      { productId: "hobo-stripe-blue", name: "Túi Hobo Hai Mặt — Sọc Xanh", price: 329000, qty: 2, image: "/images/SKU3.jpg" },
    ],
    totalPrice: 658000,
    shippingFee: 0,
    status: "cancelled",
    paymentMethod: "bank_transfer",
    paymentStatus: "pending",
    note: "Đổi ý không mua nữa",
    createdAt: daysAgo(6, 16),
    updatedAt: daysAgo(6, 17),
  },

  // === Older completed orders for Phạm Minh Tuấn (he has 4 total) ===
  {
    customerName: "Phạm Minh Tuấn",
    phone: "0933444555",
    address: "67 Cách Mạng Tháng 8, Quận Tân Bình, TP.HCM",
    items: [
      { productId: "quilted-tote-cream", name: "Túi Tote Chấm Bi Bông — Kem", price: 319000, qty: 1, image: "/images/SKU1-2.jpg" },
    ],
    totalPrice: 349000,
    shippingFee: 30000,
    status: "completed",
    paymentMethod: "cod",
    paymentStatus: "paid",
    note: "",
    createdAt: daysAgo(10, 10),
    updatedAt: daysAgo(7, 15),
  },
  {
    customerName: "Phạm Minh Tuấn",
    phone: "0933444555",
    address: "67 Cách Mạng Tháng 8, Quận Tân Bình, TP.HCM",
    items: [
      { productId: "hobo-polkadot-black", name: "Túi Hobo Hai Mặt — Chấm Bi Đen", price: 349000, qty: 1, image: "/images/SKU4.jpg" },
    ],
    totalPrice: 379000,
    shippingFee: 30000,
    status: "completed",
    paymentMethod: "bank_transfer",
    paymentStatus: "paid",
    note: "",
    createdAt: daysAgo(15, 13),
    updatedAt: daysAgo(12, 11),
  },

  // === Older order for Võ Thanh Tâm ===
  {
    customerName: "Võ Thanh Tâm",
    phone: "0966777888",
    address: "200 Nguyễn Thị Minh Khai, Quận 3, TP.HCM",
    items: [
      { productId: "quilted-tote-black", name: "Túi Tote Chấm Bi Bông — Đen", price: 319000, qty: 1, image: "/images/SKU1-1.jpg" },
    ],
    totalPrice: 349000,
    shippingFee: 30000,
    status: "completed",
    paymentMethod: "cod",
    paymentStatus: "paid",
    note: "Đổi địa chỉ giao: 56 Hai Bà Trưng Q1",
    createdAt: daysAgo(8, 11),
    updatedAt: daysAgo(5, 14),
  },

  // === Older orders for Nguyễn Thị Mai ===
  {
    customerName: "Nguyễn Thị Mai",
    phone: "0912345678",
    address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    items: [
      { productId: "hobo-polkadot-black", name: "Túi Hobo Hai Mặt — Chấm Bi Đen", price: 349000, qty: 1, image: "/images/SKU4.jpg" },
      { productId: "hobo-stripe-blue", name: "Túi Hobo Hai Mặt — Sọc Xanh", price: 329000, qty: 1, image: "/images/SKU3.jpg" },
    ],
    totalPrice: 678000,
    shippingFee: 0,
    status: "completed",
    paymentMethod: "bank_transfer",
    paymentStatus: "paid",
    note: "",
    createdAt: daysAgo(12, 15),
    updatedAt: daysAgo(9, 10),
  },

  // === Extra orders for Lê Thị Hương (VIP, 5 total) ===
  {
    customerName: "Lê Thị Hương",
    phone: "0909111222",
    address: "99 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM",
    items: [
      { productId: "hobo-stripe-pink", name: "Túi Hobo Hai Mặt — Sọc Hồng", price: 329000, qty: 2, image: "/images/SKU3-2.jpg" },
    ],
    totalPrice: 658000,
    shippingFee: 0,
    status: "completed",
    paymentMethod: "bank_transfer",
    paymentStatus: "paid",
    note: "Mua tặng bạn",
    createdAt: daysAgo(9, 10),
    updatedAt: daysAgo(7, 12),
  },
  {
    customerName: "Lê Thị Hương",
    phone: "0909111222",
    address: "99 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM",
    items: [
      { productId: "quilted-tote-cream", name: "Túi Tote Chấm Bi Bông — Kem", price: 319000, qty: 1, image: "/images/SKU1-2.jpg" },
    ],
    totalPrice: 349000,
    shippingFee: 30000,
    status: "completed",
    paymentMethod: "cod",
    paymentStatus: "paid",
    note: "",
    createdAt: daysAgo(14, 16),
    updatedAt: daysAgo(11, 14),
  },
];

async function seed() {
  // Seed customers
  console.log("Seeding customers...");
  for (const c of customers) {
    const { phone, ...data } = c;
    await db.collection("customers").doc(phone).set({
      ...data,
      createdAt: daysAgo(20),
      updatedAt: Timestamp.now(),
    });
    console.log(`  ✓ ${phone} — ${data.name}`);
  }

  // Seed orders
  console.log("\nSeeding orders...");
  for (let i = 0; i < orders.length; i++) {
    const ref = db.collection("orders").doc();
    await ref.set(orders[i]);
    console.log(`  ✓ Order ${i + 1}/${orders.length} — ${orders[i].customerName} (${orders[i].status})`);
  }

  console.log(`\nDone! Seeded ${customers.length} customers and ${orders.length} orders.`);
}

seed().catch(console.error);

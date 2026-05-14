import { adminDb } from "./firebase-admin";

function checkDb() {
  if (!adminDb) throw new Error("Firebase not configured");
}

// Serialize Firestore data to plain objects (converts Timestamps to ISO strings)
function serialize(obj) {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== "object") return obj;
  if (obj.toDate && typeof obj.toDate === "function") return obj.toDate().toISOString();
  if (Array.isArray(obj)) return obj.map(serialize);
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = serialize(value);
  }
  return result;
}

// ============ PRODUCTS ============

export async function getProducts() {
  checkDb();
  const snap = await adminDb.collection("products").orderBy("createdAt", "desc").get();
  return snap.docs.map((doc) => serialize({ id: doc.id, ...doc.data() }));
}

export async function getFeaturedProducts() {
  checkDb();
  const snap = await adminDb.collection("products").where("featured", "==", true).get();
  return snap.docs.map((doc) => serialize({ id: doc.id, ...doc.data() }));
}

export async function getProduct(id) {
  checkDb();
  const doc = await adminDb.collection("products").doc(id).get();
  if (!doc.exists) return null;
  return serialize({ id: doc.id, ...doc.data() });
}

export async function getProductsByCategory(category) {
  checkDb();
  let query = adminDb.collection("products");
  if (category && category !== "all") {
    query = query.where("category", "==", category);
  }
  const snap = await query.get();
  return snap.docs.map((doc) => serialize({ id: doc.id, ...doc.data() }));
}

// ============ ORDERS ============

export async function getOrders(status = null) {
  checkDb();
  let query = adminDb.collection("orders").orderBy("createdAt", "desc");
  if (status && status !== "all") {
    query = query.where("status", "==", status);
  }
  const snap = await query.get();
  return snap.docs.map((doc) => serialize({ id: doc.id, ...doc.data() }));
}

export async function getOrder(id) {
  checkDb();
  const doc = await adminDb.collection("orders").doc(id).get();
  if (!doc.exists) return null;
  return serialize({ id: doc.id, ...doc.data() });
}

export async function getTodayOrders() {
  checkDb();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const snap = await adminDb
    .collection("orders")
    .where("createdAt", ">=", today)
    .orderBy("createdAt", "desc")
    .get();
  return snap.docs.map((doc) => serialize({ id: doc.id, ...doc.data() }));
}

// ============ CUSTOMERS ============

export async function getCustomers() {
  checkDb();
  const snap = await adminDb.collection("customers").orderBy("totalOrders", "desc").get();
  return snap.docs.map((doc) => serialize({ phone: doc.id, ...doc.data() }));
}

export async function getCustomer(phone) {
  checkDb();
  const doc = await adminDb.collection("customers").doc(phone).get();
  if (!doc.exists) return null;
  return serialize({ phone: doc.id, ...doc.data() });
}

export async function getCustomerOrders(phone) {
  checkDb();
  const snap = await adminDb
    .collection("orders")
    .where("phone", "==", phone)
    .orderBy("createdAt", "desc")
    .get();
  return snap.docs.map((doc) => serialize({ id: doc.id, ...doc.data() }));
}

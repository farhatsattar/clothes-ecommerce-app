import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import { Product } from "@/types";

export const fetchAllProducts = async (): Promise<Product[]> => {
  const snapshot = await getDocs(collection(db, "products"));

  return snapshot.docs.map((doc) => ({
    id: doc.id,                 // 🔥 MUST
    ...(doc.data() as Omit<Product, "id">),
  }));
};

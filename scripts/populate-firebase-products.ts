import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
require('dotenv').config();

// Use your actual Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample products data
const sampleProducts = [
  {
    name: "Classic Cotton T-Shirt",
    description: "Comfortable and breathable cotton t-shirt perfect for everyday wear.",
    price: 2499,
    category: "men",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Black", "Blue", "Gray"],
    images: [
      "https://via.placeholder.com/600x800/FFFFFF/000000?text=T-Shirt+Front",
      "https://via.placeholder.com/600x800/000000/FFFFFF?text=T-Shirt+Back"
    ],
    inStock: 100,
    rating: 4.5,
    numReviews: 24,
    tags: ["casual", "cotton", "everyday"],
    isActive: true,
  },
  {
    name: "Summer Floral Dress",
    description: "Lightweight floral dress perfect for summer days and special occasions.",
    price: 4999,
    category: "women",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Pink", "Blue", "Green", "Purple"],
    images: [
      "https://via.placeholder.com/600x800/FFB6C1/000000?text=Dress+Front",
      "https://via.placeholder.com/600x800/DDA0DD/000000?text=Dress+Side"
    ],
    inStock: 50,
    rating: 4.8,
    numReviews: 18,
    tags: ["summer", "floral", "dress"],
    isActive: true,
  },
  {
    name: "Denim Jacket",
    description: "Classic denim jacket that goes with everything. Durable and stylish.",
    price: 7999,
    category: "men",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Blue", "Black", "Light Blue"],
    images: [
      "https://via.placeholder.com/600x800/000080/FFFFFF?text=Jacket+Front",
      "https://via.placeholder.com/600x800/4169E1/000000?text=Jacket+Back"
    ],
    inStock: 30,
    rating: 4.6,
    numReviews: 15,
    tags: ["denim", "jacket", "classic"],
    isActive: true,
  },
  {
    name: "Kids Playful T-Shirt",
    description: "Soft and comfortable t-shirt designed for kids with fun prints.",
    price: 1999,
    category: "kids",
    sizes: ["2T", "3T", "4T", "5T"],
    colors: ["Yellow", "Red", "Green", "Orange"],
    images: [
      "https://via.placeholder.com/600x800/FFFF00/000000?text=Kids+T-Shirt",
      "https://via.placeholder.com/600x800/FFA500/000000?text=Kids+Design"
    ],
    inStock: 80,
    rating: 4.7,
    numReviews: 32,
    tags: ["kids", "playful", "comfortable"],
    isActive: true,
  },
  {
    name: "Elegant Evening Gown",
    description: "Beautiful evening gown for special occasions and formal events.",
    price: 12999,
    category: "women",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black", "Navy", "Burgundy", "Emerald"],
    images: [
      "https://via.placeholder.com/600x800/000000/FFFFFF?text=Gown+Front",
      "https://via.placeholder.com/600x800/800080/FFFFFF?text=Gown+Back"
    ],
    inStock: 20,
    rating: 4.9,
    numReviews: 12,
    tags: ["evening", "gown", "formal"],
    isActive: true,
  },
  {
    name: "Sporty Hoodie",
    description: "Warm and cozy hoodie perfect for workouts and casual wear.",
    price: 5999,
    category: "men",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Charcoal", "Red", "Navy"],
    images: [
      "https://via.placeholder.com/600x800/2F4F4F/FFFFFF?text=Hoodie+Front",
      "https://via.placeholder.com/600x800/DC143C/FFFFFF?text=Hoodie+Back"
    ],
    inStock: 60,
    rating: 4.4,
    numReviews: 28,
    tags: ["sporty", "hoodie", "casual"],
    isActive: true,
  },
  {
    name: "Cotton Summer Shorts",
    description: "Light and airy shorts perfect for hot summer days.",
    price: 3499,
    category: "women",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Beige", "Khaki", "Olive", "White"],
    images: [
      "https://via.placeholder.com/600x800/F5DEB3/000000?text=Shorts+Front",
      "https://via.placeholder.com/600x800/8FBC8F/000000?text=Shorts+Side"
    ],
    inStock: 75,
    rating: 4.3,
    numReviews: 21,
    tags: ["summer", "shorts", "cotton"],
    isActive: true,
  },
  {
    name: "Adorable Kids Overalls",
    description: "Cute and practical overalls for little ones.",
    price: 2999,
    category: "kids",
    sizes: ["2T", "3T", "4T", "5T", "6T"],
    colors: ["Denim Blue", "Forest Green", "Red", "Yellow"],
    images: [
      "https://via.placeholder.com/600x800/0000FF/FFFFFF?text=Overalls+Front",
      "https://via.placeholder.com/600x800/FFD700/000000?text=Overalls+Back"
    ],
    inStock: 45,
    rating: 4.8,
    numReviews: 17,
    tags: ["kids", "overalls", "cute"],
    isActive: true,
  }
];

async function populateProducts() {
  console.log("Starting to populate products...");

  try {
    for (const product of sampleProducts) {
      const docRef = await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log(`Added product: ${product.name} with ID: ${docRef.id}`);
    }

    console.log("Successfully added all sample products!");
  } catch (error) {
    console.error("Error adding products:", error);
  }
}

// Run the function
populateProducts();
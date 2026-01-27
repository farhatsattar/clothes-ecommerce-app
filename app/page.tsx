"use client";

import React, { SyntheticEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import MainLayout from "@/components/layout/MainLayout";
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';

const HomePage = () => {
  const featuredProducts = [
    {
      id: 1,
      name: "Premium Cotton T-Shirt",
      price: 29.99,
      image: "/images/image.jpg",
      category: "Men",
    },
    {
      id: 2,
      name: "Summer Floral Dress",
      price: 49.99,
      image: "/images/image1.jpg",
      category: "Women",
    },
    {
      id: 3,
      name: "Denim Jacket",
      price: 79.99,
      image: "/images/image3.jpg",
      category: "Kids",
    },
    {
      id: 4,
      name: "Athletic Sneakers",
      price: 89.99,
      image: "/images/image2.jpg",
      category: "Men",
    },
  ];

  const categories = [
    {
      name: "Men",
      image: "/images/pi9.jpg",
      description: "Latest trends for men",
    },
    {
      name: "Women",
      image: "/images/p10.jpg",
      description: "Elegant designs for women",
    },
    {
      name: "Kids",
      image: "/images/pi11.jpg",
      description: "Comfortable styles for kids",
    },
  ];

  return (
    <MainLayout
      title="IBFashionHub - Pakistani Fashion Store"
      description="Shop the latest fashion trends for men, women, and juniors in Pakistan"
    >
      {/* HERO */}
      <section className="relative bg-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover pointer-events-none"
            style={{ position: 'absolute', top: 0, left: 0 }}
            onError={(e: SyntheticEvent<HTMLVideoElement, Event>) => {
              // Fallback to image if video fails to load
              const video = e.target as HTMLVideoElement;
              video.style.display = 'none';
              const img = video.parentElement?.querySelector('img');
              if(img) img.style.display = 'block';
            }}
          >
            <source src="/videos/hero-fashion.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <Image
            src="/images/h3.jpg"
            alt="IBFashionHub Background"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            style={{ display: 'none' }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16 lg:py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="text-center lg:text-left text-white">
              <div className="inline-block bg-ibfashionhub-red text-white px-3 py-1 rounded-full text-sm font-bold mb-4 uppercase">
                WINTER SALE FLAT 50% OFF
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                New Winter Collection
              </h1>
              <p className="text-lg mb-8 max-w-lg mx-auto lg:mx-0">
                Discover the latest winter fashion trends for men, women, and juniors. Shop premium quality outfits at unbeatable prices.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/products?sale=true"
                  className="px-8 py-3 rounded-md bg-ibfashionhub-red text-white font-bold hover:bg-red-700 transition text-center"
                >
                  SHOP THE SALE
                </Link>
                <Link
                  href="/products"
                  className="px-8 py-3 rounded-md border-2 border-white text-white font-bold hover:bg-white hover:text-gray-900 transition text-center"
                >
                  EXPLORE COLLECTION
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="relative w-full h-96 md:h-[500px] rounded-lg overflow-hidden bg-black bg-opacity-30">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover pointer-events-none"
                  style={{ position: 'absolute', top: 0, left: 0 }}
                  onError={(e: SyntheticEvent<HTMLVideoElement, Event>) => {
                    // Fallback to image if video fails to load
                    const video = e.target as HTMLVideoElement;
                    video.style.display = 'none';
                    const img = video.parentElement?.querySelector('img');
                    if(img) img.style.display = 'block';
                  }}
                >
                  <source src="/videos/model-walk.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <Image
                  src="/images/h3.jpg"
                  alt="Model Walk"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  style={{ display: 'none' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            SHOP BY CATEGORY
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Discover our extensive collection designed for every occasion and style
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <div
                key={category.name}
                className="group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="relative w-full h-80">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      // Fallback to a default image if the category image fails to load
                      const target = e.target as HTMLImageElement;
                      target.onerror = null; // Prevent infinite loop
                      target.src = '/images/image.jpg'; // Default fallback image
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-white text-gray-900 px-6 py-3 rounded-full font-bold text-lg">
                      SHOP NOW
                    </span>
                  </div>
                </div>

                <div className="p-6 text-center bg-white">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {category.description}
                  </p>
                  <Link
                    href={`/products?category=${category.name.toLowerCase()}`}
                    className="inline-block text-ibfashionhub-red font-bold hover:text-red-700 uppercase tracking-wide text-sm"
                  >
                    Explore Collection →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              FEATURED PRODUCTS
            </h2>
            <Link
              href="/products"
              className="text-ibfashionhub-red font-bold hover:text-red-700 uppercase tracking-wide text-sm"
            >
              VIEW ALL →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group">
                <div className="relative w-full h-80 rounded-lg overflow-hidden bg-gray-100 mb-4">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white bg-opacity-80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  <div className="absolute bottom-3 left-3 bg-ibfashionhub-red text-white px-2 py-1 rounded text-xs font-bold">
                    NEW
                  </div>
                </div>

                <div className="text-center">
                  <Link
                    href={`/products/${product.id}`}
                    className="text-gray-900 font-medium hover:text-ibfashionhub-red block mb-1"
                  >
                    {product.name}
                  </Link>
                  <p className="text-gray-600 text-sm mb-2">{product.category}</p>
                  <p className="text-gray-900 font-bold">${product.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROMOTIONAL BANNER */}
      <section className="py-16 bg-gray-100 mt-16 relative overflow-hidden">
  <div className="max-w-7xl mx-auto px-4">
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 relative">
        {/* Left Text */}
        <div className="p-12 flex flex-col justify-center bg-gradient-to-r from-red-600 to-red-700 text-white relative z-10">
          <h3 className="text-2xl font-bold mb-4">
            JOIN OUR LOYALTY PROGRAM
          </h3>
          <p className="mb-6">
            Earn points with every purchase and enjoy exclusive discounts, early access to sales, and special offers.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <div className="mr-3 w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <span>Exclusive Offers</span>
            </div>
            <div className="flex items-center">
              <div className="mr-3 w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <span>Early Access</span>
            </div>
          </div>
          <Link
            href="/signup"
            className="mt-8 inline-block px-8 py-3 rounded-md bg-white text-red-600 font-bold hover:bg-gray-100 transition text-center"
          >
            SIGN UP NOW
          </Link>
        </div>

        {/* Right Video/Image */}
        <div className="relative min-h-[450px] lg:min-h-[550px]">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover object-top"
            onError={(e) => {
              const video = e.currentTarget;
              video.style.display = 'none';
              const img = video.parentElement?.querySelector('img');
              if (img) img.style.display = 'block';
            }}
          >
            <source src="/videos/fashion-show.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <Image
            src="/images/p9.jpg"
            alt="Fashion Show"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover absolute top-0 left-0"
            style={{ display: 'none' }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
       </div>
      </div>
    </div>
  </div>
  </section>
      {/* Floating WhatsApp Button */}
    <WhatsAppFloatingButton phone="923014440787" />
    </MainLayout>
  );
};

export default HomePage;

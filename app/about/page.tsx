'use client';

import React, { SyntheticEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';

const AboutPage = () => {
  return (
    <MainLayout
      title="About IBFashionHub - Pakistani Fashion Store"
      description="Learn about our story, mission, values and why you should choose us for your fashion needs"
    >
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-gray-900 text-white py-20">
          <div className="absolute inset-0">
            <Image
              src="/images/ibf.jpg"
              alt="IBFashionHub Background"
              fill
              sizes="(max-width: 1024px) 100vw, 100vw"
              className="object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About IBFashionHub</h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Your premier destination for Pakistani fashion excellence
            </p>
          </div>
        </section>

        {/* Our Vision */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/ibf.jpg"
              alt="Our Vision Background"
              fill
              sizes="(max-width: 1024px) 100vw, 100vw"
              className="object-cover opacity-10"
            />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <div className="w-24 h-1 bg-ibfashionhub-red mx-auto"></div>
            </div>
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-lg text-gray-700 leading-relaxed">
                At IBFashionHub, our vision is to become Pakistan's leading fashion destination, offering
                the finest quality clothing that celebrates our rich cultural heritage while embracing
                contemporary trends. We strive to empower individuals to express their unique style
                through thoughtfully curated collections that reflect the essence of Pakistani fashion.
              </p>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-20 relative overflow-hidden bg-gray-50">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/image.jpg"
              alt="Our Mission Background"
              fill
              sizes="(max-width: 1024px) 100vw, 100vw"
              className="object-cover opacity-10"
            />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <div className="w-24 h-1 bg-ibfashionhub-red mx-auto"></div>
            </div>
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-lg text-gray-700 leading-relaxed">
                Our mission is to deliver exceptional value to our customers by providing trendy,
                high-quality fashion at competitive prices. We are committed to supporting local
                artisans and designers, promoting sustainable practices, and creating an unparalleled
                shopping experience that combines convenience, variety, and style. Through innovation
                and customer-centricity, we aim to redefine fashion retail in Pakistan.
              </p>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/p8.jpg"
              alt="Our Values Background"
              fill
              sizes="(max-width: 1024px) 100vw, 100vw"
              className="object-cover opacity-10"
            />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
              <div className="w-24 h-1 bg-ibfashionhub-red mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="w-16 h-16 bg-ibfashionhub-red rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">Q</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Quality</h3>
                <p className="text-gray-600">
                  We are committed to delivering the highest quality products that exceed our customers' expectations.
                </p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="w-16 h-16 bg-ibfashionhub-red rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">I</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Integrity</h3>
                <p className="text-gray-600">
                  We conduct our business with honesty, transparency, and ethical practices.
                </p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="w-16 h-16 bg-ibfashionhub-red rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">S</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Service</h3>
                <p className="text-gray-600">
                  We provide exceptional customer service and support at every touchpoint.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 relative overflow-hidden bg-gray-900 text-white">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/ibf.jpg"
              alt="Why Choose Us Background"
              fill
              sizes="(max-width: 1024px) 100vw, 100vw"
              className="object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us?</h2>
              <div className="w-24 h-1 bg-ibfashionhub-red mx-auto mb-8"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-ibfashionhub-red rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Premium Quality</h3>
                <p className="text-gray-300">We offer the finest materials and craftsmanship for lasting durability.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-ibfashionhub-red rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Affordable Prices</h3>
                <p className="text-gray-300">Competitive pricing without compromising on quality or style.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-ibfashionhub-red rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Customer Satisfaction</h3>
                <p className="text-gray-300">We prioritize our customers' needs and satisfaction above all else.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-ibfashionhub-red rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
                <p className="text-gray-300">Quick and reliable delivery across Pakistan to your doorstep.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-ibfashionhub-red text-white">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Experience Pakistani Fashion Excellence?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust IBFashionHub for their fashion needs.
            </p>
            <Link
              href="/products"
              className="inline-block px-8 py-3 rounded-md bg-white text-ibfashionhub-red font-bold hover:bg-gray-100 transition text-center"
            >
              SHOP NOW
            </Link>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default AboutPage;
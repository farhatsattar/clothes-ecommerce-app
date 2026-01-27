'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useCart } from '@/lib/context/cart-context';

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

const MainLayout = ({
  children,
  title = 'IBFashionHub - Pakistani Fashion Store',
  description = 'Shop for the latest fashion trends in Pakistan',
}: MainLayoutProps) => {
  const { cart } = useCart();
  const cartItemCount = cart.items.reduce((total, item) => total + item.quantity, 0);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link
                href="/"
                className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors duration-300 flex items-center"
              >
                <span className="text-ibfashionhub-red font-bold text-3xl mr-1">I</span>
                <span className="font-light text-xl">BFASHIONHUB</span>
              </Link>

              {/* Navigation */}
              <nav className="hidden md:block">
                <ul className="flex space-x-8">
                  <li className="relative group">
                    <Link
                      href="/products?category=men"
                      className="text-gray-900 hover:text-ibfashionhub-red font-medium transition-colors duration-300 uppercase text-sm tracking-wide"
                    >
                      Men
                    </Link>
                    {/* Submenu for Men */}
                    <div className="absolute hidden group-hover:block w-64 bg-white shadow-lg z-50 left-0 pt-2">
                      <div className="border-t border-gray-200 pt-2">
                        <Link href="/products?category=men&subcategory=tops" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-ibfashionhub-red">Tops</Link>
                        <Link href="/products?category=men&subcategory=bottoms" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-ibfashionhub-red">Bottoms</Link>
                        <Link href="/products?category=men&subcategory=outerwear" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-ibfashionhub-red">Outerwear</Link>
                        <Link href="/products?category=men&subcategory=accessories" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-ibfashionhub-red">Accessories</Link>
                      </div>
                    </div>
                  </li>
                  <li className="relative group">
                    <Link
                      href="/products?category=women"
                      className="text-gray-900 hover:text-ibfashionhub-red font-medium transition-colors duration-300 uppercase text-sm tracking-wide"
                    >
                      Women
                    </Link>
                    {/* Submenu for Women */}
                    <div className="absolute hidden group-hover:block w-64 bg-white shadow-lg z-50 left-0 pt-2">
                      <div className="border-t border-gray-200 pt-2">
                        <Link href="/products?category=women&subcategory=tops" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-ibfashionhub-red">Tops</Link>
                        <Link href="/products?category=women&subcategory=bottoms" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-ibfashionhub-red">Bottoms</Link>
                        <Link href="/products?category=women&subcategory=dresses" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-ibfashionhub-red">Dresses</Link>
                        <Link href="/products?category=women&subcategory=outerwear" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-ibfashionhub-red">Outerwear</Link>
                        <Link href="/products?category=women&subcategory=accessories" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-ibfashionhub-red">Accessories</Link>
                      </div>
                    </div>
                  </li>
                  <li className="relative group">
                    <Link
                      href="/products?category=kids"
                      className="text-gray-900 hover:text-ibfashionhub-red font-medium transition-colors duration-300 uppercase text-sm tracking-wide"
                    >
                      Kids
                    </Link>
                    {/* Submenu for kids */}
                    <div className="absolute hidden group-hover:block w-64 bg-white shadow-lg z-50 left-0 pt-2">
                      <div className="border-t border-gray-200 pt-2">
                        <Link href="/products?category=kids&subcategory=tops" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-ibfashionhub-red">Tops</Link>
                        <Link href="/products?category=kids&subcategory=bottoms" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-ibfashionhub-red">Bottoms</Link>
                        <Link href="/products?category=kids&subcategory=dresses" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-ibfashionhub-red">Dresses</Link>
                        <Link href="/products?category=kids&subcategory=outerwear" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-ibfashionhub-red">Outerwear</Link>
                        <Link href="/products?category=kids&subcategory=accessories" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-ibfashionhub-red">Accessories</Link>
                      </div>
                    </div>
                  </li>
                  <li>
                    <Link
                      href="/products?sale=true"
                      className="text-gray-900 hover:text-ibfashionhub-red font-medium transition-colors duration-300 uppercase text-sm tracking-wide"
                    >
                      SALE
                    </Link>
                  </li>
                </ul>
              </nav>

              {/* Search, Dropdown Menu, Login, Cart Icons */}
              <div className="flex items-center space-x-4">
                <div className="hidden md:block relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="py-1 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-ibfashionhub-red focus:border-transparent"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>

                {/* Dropdown Menu */}
                 <div className="relative" ref={dropdownRef}>
                  <button
                  className="text-gray-700 hover:text-ibfashionhub-red transition-colors duration-300"
                       onClick={(e) => {
                       e.stopPropagation();
                    setIsDropdownOpen(!isDropdownOpen);
                     }}
  >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
               </button>

             {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg z-50 rounded-md">
              <div className="py-1">

             <Link href="/about" onClick={() => setIsDropdownOpen(false)}
             className="block px-4 py-2 text-sm hover:bg-gray-100">
             About
            </Link>

            <Link href="/contact" onClick={() => setIsDropdownOpen(false)}
            className="block px-4 py-2 text-sm hover:bg-gray-100">
            Contact
           </Link>

          <div className="border-t my-1"></div>

          <div className="px-4 py-1 text-xs font-bold text-gray-500 uppercase">
            Categories
        </div>

        <Link href="/products" onClick={() => setIsDropdownOpen(false)}
          className="block px-8 py-2 text-sm hover:bg-gray-100">
          All
        </Link>

        <Link href="/products?category=men" onClick={() => setIsDropdownOpen(false)}
          className="block px-8 py-2 text-sm hover:bg-gray-100">
          Men
        </Link>

        <Link href="/products?category=women" onClick={() => setIsDropdownOpen(false)}
          className="block px-8 py-2 text-sm hover:bg-gray-100">
          Women
        </Link>

        <Link href="/products?category=kids" onClick={() => setIsDropdownOpen(false)}
          className="block px-8 py-2 text-sm hover:bg-gray-100">
          Kids
        </Link>

      </div>
    </div>
  )}
</div>

                <Link
                  href="/profile/orders"
                  className="text-gray-700 hover:text-ibfashionhub-red transition-colors duration-300"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
                  </svg>
                </Link>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-ibfashionhub-red transition-colors duration-300"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>

                <Link
                  href="/cart"
                  className="p-1 text-gray-700 hover:text-ibfashionhub-red transition-colors duration-300 relative"
                >
                  <span className="sr-only">Cart</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-2.5 5m2.5-5l2.5 5m0 0h8"
                    />
                  </svg>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-ibfashionhub-red rounded-full">
                      {cartItemCount}
                    </span>
                  )}
                </Link>

                {/* Mobile menu button */}
                <button className="md:hidden ml-2 p-1 text-gray-700 hover:text-ibfashionhub-red">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <div className="flex justify-between items-center">
                <Link
                  href="/"
                  className="text-lg font-bold text-gray-900 hover:text-gray-700"
                >
                  <span className="text-ibfashionhub-red font-bold mr-1">I</span>
                  <span className="font-light">BFASHIONHUB</span>
                </Link>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="py-1 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-ibfashionhub-red focus:border-transparent"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              <Link
                href="/products?category=men"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-ibfashionhub-red hover:bg-gray-50 uppercase tracking-wide"
              >
                Men
              </Link>
              <Link
                href="/products?category=women"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-ibfashionhub-red hover:bg-gray-50 uppercase tracking-wide"
              >
                Women
              </Link>
              <Link
                href="/products?category=juniors"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-ibfashionhub-red hover:bg-gray-50 uppercase tracking-wide"
              >
                Kids
              </Link>
              <Link
                href="/products?sale=true"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-ibfashionhub-red hover:bg-gray-50 uppercase tracking-wide"
              >
                SALE
              </Link>

              {/* Additional Links */}
              <Link
                href="/about"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-ibfashionhub-red hover:bg-gray-50"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-ibfashionhub-red hover:bg-gray-50"
              >
                Contact
              </Link>

              <div className="flex justify-between pt-2 border-t border-gray-200">
                <Link
                  href="/profile/orders"
                  className="flex items-center text-gray-700 hover:text-ibfashionhub-red"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
                  </svg>
                  Orders
                </Link>
                <Link
                  href="/login"
                  className="flex items-center text-gray-700 hover:text-ibfashionhub-red"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Account
                </Link>
                <Link
                  href="/cart"
                  className="flex items-center text-gray-700 hover:text-ibfashionhub-red relative"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-2.5 5m2.5-5l2.5 5m0 0h8"
                    />
                  </svg>
                  Cart
                  {cartItemCount > 0 && (
                    <span className="ml-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-ibfashionhub-red rounded-full">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow">{children}</main>

        {/* Footer */}
        <footer className="bg-white text-gray-900 border-t border-gray-200">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-bold mb-4 text-ibfashionhub-red uppercase">CUSTOMER CARE</h3>
                <ul className="space-y-2">
                  <li><Link href="/contact" className="text-gray-700 hover:text-ibfashionhub-red transition-colors duration-300">Help Center</Link></li>
                  <li><Link href="#" className="text-gray-700 hover:text-ibfashionhub-red transition-colors duration-300">Order Tracking</Link></li>
                  <li><Link href="#" className="text-gray-700 hover:text-ibfashionhub-red transition-colors duration-300">Returns & Exchanges</Link></li>
                  <li><Link href="#" className="text-gray-700 hover:text-ibfashionhub-red transition-colors duration-300">Shipping Info</Link></li>
                  <li><Link href="#" className="text-gray-700 hover:text-ibfashionhub-red transition-colors duration-300">Contact Us</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4 text-ibfashionhub-red uppercase">COMPANY</h3>
                <ul className="space-y-2">
                  <li><Link href="/about" className="text-gray-700 hover:text-ibfashionhub-red transition-colors duration-300">About Us</Link></li>
                  <li><Link href="#" className="text-gray-700 hover:text-ibfashionhub-red transition-colors duration-300">Careers</Link></li>
                  <li><Link href="#" className="text-gray-700 hover:text-ibfashionhub-red transition-colors duration-300">Store Locator</Link></li>
                  <li><Link href="#" className="text-gray-700 hover:text-ibfashionhub-red transition-colors duration-300">Sitemap</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4 text-ibfashionhub-red uppercase">LEGAL</h3>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-gray-700 hover:text-ibfashionhub-red transition-colors duration-300">Privacy Policy</Link></li>
                  <li><Link href="#" className="text-gray-700 hover:text-ibfashionhub-red transition-colors duration-300">Terms of Service</Link></li>
                  <li><Link href="#" className="text-gray-700 hover:text-ibfashionhub-red transition-colors duration-300">Cookie Policy</Link></li>
                  <li><Link href="#" className="text-gray-700 hover:text-ibfashionhub-red transition-colors duration-300">Accessibility</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4 text-ibfashionhub-red uppercase">CONTACT INFO</h3>
                <p className="text-gray-700 mb-4">Have Questions? Call us at<br /><span className="font-bold">+92 333 1234567</span></p>

                <div className="mb-4">
                  <h4 className="font-bold mb-2">FOLLOW US</h4>
                  <div className="flex space-x-4">
                    <Link href="#" className="text-gray-700 hover:text-ibfashionhub-red transition-colors duration-300">
                      <span className="sr-only">Facebook</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                      </svg>
                    </Link>
                    <Link href="#" className="text-gray-700 hover:text-ibfashionhub-red transition-colors duration-300">
                      <span className="sr-only">Instagram</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                      </svg>
                    </Link>
                    <Link href="#" className="text-gray-700 hover:text-ibfashionhub-red transition-colors duration-300">
                      <span className="sr-only">Twitter</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </Link>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold mb-2">DOWNLOAD OUR APP</h4>
                  <div className="flex space-x-2">
                    <Link href="#" className="text-sm bg-gray-800 text-white px-3 py-2 rounded">
                      <span className="block">GET IT ON</span>
                      <span className="block font-bold">Google Play</span>
                    </Link>
                    <Link href="#" className="text-sm bg-black text-white px-3 py-2 rounded">
                      <span className="block">Download on the</span>
                      <span className="block font-bold">App Store</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment and Installment Options */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <h4 className="font-bold text-ibfashionhub-red uppercase mb-2">Payment Methods</h4>
                  <div className="flex space-x-2">
                    <div className="bg-gray-200 border border-gray-300 rounded px-2 py-1 text-xs">JazzCash</div>
                    <div className="bg-gray-200 border border-gray-300 rounded px-2 py-1 text-xs">EasyPaisa</div>
                    <div className="bg-gray-200 border border-gray-300 rounded px-2 py-1 text-xs">Visa</div>
                    <div className="bg-gray-200 border border-gray-300 rounded px-2 py-1 text-xs">MasterCard</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center text-sm text-gray-600">
                &copy; {new Date().getFullYear()} IBFashionHub. All rights reserved. | Designed for Pakistan
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default MainLayout;
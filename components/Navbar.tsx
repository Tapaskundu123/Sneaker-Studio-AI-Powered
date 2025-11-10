"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import logo from "../app/(auth)/logo.svg";
import { Button } from "@/components/ui/button";

type NavLink = {
  label: string;
  href: string;
};

const NAV_LINKS: readonly NavLink[] = [
  { label: "Men", href: "/products?gender=men" },
  { label: "Women", href: "/products?gender=women" },
  { label: "Kids", href: "/products?gender=unisex" },
  { label: "Collections", href: "/collections" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      const data: { success: boolean; message?: string } = await response.json();

      if (data.success) {
        window.location.href = "/sign-in"; // redirect after logout
      } else {
        console.error("Logout failed:", data.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Logout error:", error.message);
      } else {
        console.error("Unknown error during logout:", error);
      }
    }
  };

  return (
    <>
      {/* === Desktop + Mobile Header === */}
      <header className="sticky top-0 z-40 bg-white shadow-sm">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center" onClick={closeSidebar}>
            <Image
              src={logo}
              alt="Nike"
              width={28}
              height={28}
              priority
              className="invert"
            />
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-gray-900 transition-colors hover:text-gray-600"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-6 md:flex">
            <button className="text-sm font-medium text-gray-900 hover:text-gray-600">
              Search
            </button>

            <button className="relative text-sm font-medium text-gray-900 hover:text-gray-600">
              My Cart
              <span className="absolute -top-1 -right-3 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs text-white">
                2
              </span>
            </button>

            {/* ✅ Logout visible on desktop */}
            <Button
              onClick={handleLogout}
              className="rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-gray-800 cursor-pointer"
            >
              Logout
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleSidebar}
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-900 md:hidden"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {sidebarOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </nav>
      </header>

      {/* === Mobile Sidebar === */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-80 max-w-full transform bg-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <Link href="/" className="flex items-center" onClick={closeSidebar}>
            <Image
              src={logo}
              alt="Nike"
              width={32}
              height={32}
              className="invert"
            />
          </Link>
          <button
            onClick={closeSidebar}
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
            aria-label="Close menu"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeSidebar}
              className="block rounded-md px-4 py-3 text-base font-medium text-gray-900 transition-colors hover:bg-gray-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer - Actions */}
        <div className="border-t border-gray-200 px-4 py-6">
          <div className="space-y-4">
            {/* Search Button */}
            <button className="flex w-full items-center gap-3 rounded-md px-4 py-3 text-base font-medium text-gray-900 transition-colors hover:bg-gray-100">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Search
            </button>

            {/* Cart Button */}
            <button className="flex w-full items-center justify-between rounded-md px-4 py-3 text-base font-medium text-gray-900 transition-colors hover:bg-gray-100">
              <div className="flex items-center gap-3">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                My Cart
              </div>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                2
              </span>
            </button>

            {/* ✅ Logout visible on mobile sidebar */}
            <Button
              onClick={handleLogout}
              className="w-full rounded-md bg-black px-4 py-3 text-base font-medium text-white hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

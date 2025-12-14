"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold">
              Poolie
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm font-medium hover:text-gray-600 transition-colors">
                Nebeng
              </Link>
              <Link href="/drive" className="text-sm font-medium hover:text-gray-600 transition-colors">
                Nyetir
              </Link>
              <Link href="/about" className="text-sm font-medium hover:text-gray-600 transition-colors">
                Tentang
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-sm font-medium">
              Help
            </Button>
            <Button variant="ghost" size="sm" className="text-sm font-medium">
              Log in
            </Button>
            <Button size="sm" className="bg-black hover:bg-gray-800 text-white rounded-full px-6">
              Sign up
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

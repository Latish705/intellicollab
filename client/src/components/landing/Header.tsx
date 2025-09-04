import React from "react";

import { IntelliCollabLogo } from "../icons";
import Link from "next/link";

const Header: React.FC = () => (
  <header className="absolute top-0 left-0 right-0 z-10 py-4 px-4 sm:px-6 lg:px-8">
    <div className="container mx-auto flex justify-between items-center">
      <Link href="/" className="flex items-center gap-2">
        <IntelliCollabLogo className="w-8 h-8" />
        <span className="text-xl font-bold text-white">IntelliCollab</span>
      </Link>
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
        <Link href="#features" className="hover:text-white transition-colors">
          Features
        </Link>
        <Link href="#pricing" className="hover:text-white transition-colors">
          Pricing
        </Link>
        <Link href="#reviews" className="hover:text-white transition-colors">
          Reviews
        </Link>
        <Link href="#demo" className="hover:text-white transition-colors">
          Demo
        </Link>
      </nav>
      <div className="flex items-center gap-4">
        <Link
          href="/login"
          className="text-sm font-semibold hover:text-white transition-colors"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className="bg-white text-gray-900 px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-200 transition-colors"
        >
          Get Started Free
        </Link>
      </div>
    </div>
  </header>
);

export default Header;

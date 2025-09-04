import React from "react";

import { IntelliCollabLogo } from "../icons";
import Link from "next/link";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-dark-bg via-brand-purple-dark to-dark-bg animate-gradient-bg bg-[length:200%_200%]">
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 text-white">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-2">
              <IntelliCollabLogo className="w-10 h-10" />
              <span className="text-2xl font-bold">IntelliCollab</span>
            </Link>
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-gray-400">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

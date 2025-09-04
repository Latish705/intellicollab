import React from "react";

import { PlayIcon, ArrowRightIcon } from "../icons";
import Link from "next/link";

const Hero: React.FC = () => (
  <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-28 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-dark-bg via-brand-purple-dark to-dark-bg opacity-70"></div>
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative text-center animate-fade-in">
      <div className="inline-block bg-white/10 text-white text-xs px-3 py-1 rounded-full mb-4">
        Now with AI-Powered Features
      </div>
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tighter">
        Collaboration
        <br />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-pink to-brand-purple-light">
          Reimagined
        </span>
      </h1>
      <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-300">
        Transform your team dynamics with our AI-powered, enterprise-grade
        collaboration platform. Built on cutting-edge microservices architecture
        for teams that demand excellence.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/register"
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-brand-purple to-brand-pink text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
        >
          Start Free Trial
          <ArrowRightIcon className="w-5 h-5" />
        </Link>
        <button className="flex items-center justify-center gap-2 text-white font-semibold px-8 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
          <PlayIcon className="w-5 h-5" />
          Watch Demo
        </button>
      </div>
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
        <div>
          <p className="text-3xl font-bold text-white">10K+</p>
          <p className="text-gray-400">Active Teams</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-white">99.9%</p>
          <p className="text-gray-400">Uptime</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-white">50M+</p>
          <p className="text-gray-400">Messages</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-white">150+</p>
          <p className="text-gray-400">Countries</p>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;

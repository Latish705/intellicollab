import React from "react";

import { ArrowRightIcon } from "../icons";
import Link from "next/link";

const CallToAction: React.FC = () => (
  <section className="py-20 bg-dark-bg/50">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-white">
        Ready to Transform Your Team?
      </h2>
      <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
        Join over 10,000 teams worldwide who trust IntelliCollab for their
        collaboration needs. Start your free trial today and change the way your
        team communicates.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/register"
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-brand-purple to-brand-pink text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
        >
          Start Free Trial
          <ArrowRightIcon className="w-5 h-5" />
        </Link>
      </div>
      <p className="mt-4 text-sm text-gray-400">
        14-day free trial • No credit card required • Setup in 5 minutes • 24/7
        support
      </p>
    </div>
  </section>
);

export default CallToAction;

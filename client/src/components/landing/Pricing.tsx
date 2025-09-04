import React from 'react';
import PricingCard from './PricingCard';

const Pricing: React.FC = () => (
    <section id="pricing" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-white">Simple, Transparent Pricing</h2>
                <p className="mt-4 text-lg text-gray-400">Choose the perfect plan for your team. No hidden fees, no surprises.</p>
            </div>
            <div className="mt-16 grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
                <PricingCard
                    plan="Starter"
                    price="Free"
                    description="Perfect for small teams getting started"
                    features={["Up to 5 team members", "10 GB storage", "Basic chat features", "Email support", "Web access"]}
                    buttonText="Get Started"
                />
                <PricingCard
                    plan="Professional"
                    price="$12"
                    description="Ideal for growing teams and businesses"
                    features={["Up to 50 team members", "500 GB storage", "Advanced AI features", "Priority support", "Mobile & desktop apps", "Advanced analytics", "Custom integrations"]}
                    buttonText="Get Started"
                    popular
                />
                <PricingCard
                    plan="Enterprise"
                    price="Custom"
                    description="For large organizations with specific needs"
                    features={["Unlimited team members", "Unlimited storage", "Full AI suite", "24/7 dedicated support", "On-premise deployment", "Custom security policies", "SLA guarantees", "White-label options"]}
                    buttonText="Contact Sales"
                    isCustom
                />
            </div>
        </div>
    </section>
);

export default Pricing;

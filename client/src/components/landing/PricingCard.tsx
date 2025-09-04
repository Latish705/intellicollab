import React from 'react';
import { CheckIcon } from '../icons';

const PricingCard: React.FC<{ plan: string; price: string; description: string; features: string[]; popular?: boolean; buttonText: string; isCustom?: boolean }> = ({ plan, price, description, features, popular, buttonText, isCustom }) => (
    <div className={`relative bg-dark-card p-8 rounded-2xl border ${popular ? 'border-brand-purple' : 'border-dark-border'} flex flex-col`}>
        {popular && <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-brand-purple text-white text-xs font-bold px-3 py-1 rounded-full">Most Popular</div>}
        <h3 className="text-xl font-bold text-white">{plan}</h3>
        <p className="text-gray-400 mt-2">{description}</p>
        <div className="mt-6">
            <span className="text-4xl font-extrabold text-white">{price}</span>
            {!isCustom && <span className="text-gray-400">/month</span>}
        </div>
        <ul className="mt-8 space-y-4 text-gray-300 flex-grow">
            {features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                    <CheckIcon className="w-5 h-5 text-brand-purple-light" />
                    <span>{feature}</span>
                </li>
            ))}
        </ul>
        <button className={`w-full mt-8 py-3 rounded-lg font-semibold transition-colors ${popular ? 'bg-brand-purple hover:bg-brand-purple-light text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
            {buttonText}
        </button>
    </div>
);

export default PricingCard;

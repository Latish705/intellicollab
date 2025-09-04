import React from 'react';

export const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-dark-card p-6 rounded-2xl border border-dark-border transform hover:-translate-y-2 transition-transform duration-300">
        <div className="inline-block p-3 rounded-lg bg-brand-purple/20 text-brand-purple-light mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
);

export default FeatureCard;

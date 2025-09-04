import React from 'react';
import TestimonialCard from './TestimonialCard';

const Testimonials: React.FC = () => (
    <section id="reviews" className="py-20 bg-dark-bg/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-white">Loved by Teams Worldwide</h2>
                <p className="mt-4 text-lg text-gray-400">See what industry leaders are saying about IntelliCollab</p>
            </div>
            <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <TestimonialCard quote="IntelliCollab transformed how our distributed team collaborates. The AI features are game-changing." name="Sarah Chen" title="CTO, TechCorp" initials="SC" />
                <TestimonialCard quote="The microservices architecture gives us the scalability we need for our growing startup." name="Marcus Johnson" title="CEO, StartupXYZ" initials="MJ" />
                <TestimonialCard quote="Best collaboration platform we've used. The security features are enterprise-grade." name="Elena Rodriguez" title="CISO, Enterprise Inc" initials="ER" />
            </div>
        </div>
    </section>
);

export default Testimonials;
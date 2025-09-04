import React from 'react';
import { PlayIcon } from '../icons';

const Demo: React.FC = () => (
    <section id="demo" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white">See It In Action</h2>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">Experience the power of IntelliCollab with our interactive demo</p>
            <div className="mt-12 max-w-4xl mx-auto aspect-video bg-dark-card rounded-2xl border border-dark-border flex items-center justify-center p-8">
                <div className="text-center">
                    <button className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto hover:bg-white/20 transition-colors">
                        <PlayIcon className="w-10 h-10 text-white" />
                    </button>
                    <p className="mt-4 text-xl font-semibold text-white">Watch Product Demo</p>
                    <p className="text-gray-400">3 minute overview</p>
                </div>
            </div>
        </div>
    </section>
);

export default Demo;
import React from 'react';
import { SearchIcon } from '../icons';

const FindOrganization: React.FC = () => (
    <section id="find-org" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-dark-card p-8 rounded-2xl border border-dark-border text-center relative overflow-hidden">
                <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-brand-purple/20 to-transparent rounded-full blur-3xl -z-0"></div>
                <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-tl from-brand-pink/20 to-transparent rounded-full blur-3xl -z-0"></div>
                <div className="relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">Join Your Team</h2>
                    <p className="mt-4 text-lg text-gray-400">Already have a team on IntelliCollab? Find your organization to request access.</p>
                    <form className="mt-8 flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                        <input
                            type="text"
                            placeholder="Enter your organization's name or code"
                            className="flex-grow bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
                        />
                        <button type="submit" className="flex items-center justify-center gap-2 bg-gradient-to-r from-brand-purple to-brand-pink text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
                            <SearchIcon className="w-5 h-5" />
                            <span>Find</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </section>
);

export default FindOrganization;

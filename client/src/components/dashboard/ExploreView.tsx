import React, { useState } from 'react';
// Fix: Updated import path from '../../types' to '../../types/index' to correctly resolve the types module.
import { Organization } from '../../types/index';
import { SearchIcon, UsersIcon, CheckIcon, ArrowLeftIcon } from '../icons';
import { mockOrganizations } from '../../data/mockData';

const OrganizationCard: React.FC<{ org: Organization, onSelect: () => void }> = ({ org, onSelect }) => (
    <div onClick={onSelect} className="bg-dark-card border border-dark-border rounded-2xl p-4 flex flex-col hover:border-brand-purple transition-colors duration-300 transform hover:-translate-y-1 cursor-pointer">
        <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-dark-bg flex items-center justify-center text-3xl flex-shrink-0">{org.avatar}</div>
            <div className="flex-grow">
                <h3 className="font-bold text-white">{org.name}</h3>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">{org.description}</p>
            </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
            {org.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 text-xs bg-brand-purple/20 text-brand-purple-light rounded-full">{tag}</span>
            ))}
        </div>
        <div className="flex-grow" />
        <div className="mt-4 pt-4 border-t border-dark-border flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-400">
                <UsersIcon className="w-4 h-4" />
                <span>{Intl.NumberFormat('en-US', { notation: 'compact' }).format(org.members)} members</span>
            </div>
            <button className="px-4 py-1.5 text-sm font-semibold bg-white/5 text-white rounded-md hover:bg-white/10 transition-colors">View</button>
        </div>
    </div>
);

const OrganizationDetailView: React.FC<{ org: Organization; onBack: () => void }> = ({ org, onBack }) => {
    const [joinStatus, setJoinStatus] = useState<'idle' | 'requested'>('idle');

    const handleJoinRequest = () => {
        setJoinStatus('requested');
        setTimeout(() => setJoinStatus('idle'), 3000); 
    };

    return (
        <div className="relative flex-grow flex flex-col h-full bg-dark-bg animate-fade-in">
            <header className="p-4 border-b border-dark-border flex-shrink-0 flex items-center gap-4">
                <button onClick={onBack} title="Back to explore" className="p-2 rounded-md hover:bg-white/10">
                   <ArrowLeftIcon className="w-5 h-5"/>
                </button>
                <div>
                    <h2 className="font-bold text-lg">{org.name}</h2>
                    <p className="text-sm text-gray-400">Viewing organization details</p>
                </div>
            </header>
            <main className="flex-grow overflow-y-auto p-6 space-y-6">
                 <div className="bg-dark-card border border-dark-border rounded-2xl p-6 flex items-center gap-6">
                    <div className="w-24 h-24 rounded-2xl bg-dark-bg flex items-center justify-center text-5xl flex-shrink-0">{org.avatar}</div>
                    <div>
                        <h3 className="text-2xl font-bold text-white">{org.name}</h3>
                         <div className="mt-2 flex flex-wrap gap-2">
                            {org.tags.map(tag => (
                                <span key={tag} className="px-2.5 py-1 text-xs bg-brand-purple/20 text-brand-purple-light rounded-full font-semibold">{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>
                 <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                    <h4 className="font-bold text-white mb-2">About</h4>
                    <p className="text-gray-300 leading-relaxed">{org.description}</p>
                </div>

                <div className="bg-dark-card border border-dark-border rounded-2xl p-6 grid grid-cols-2 gap-4">
                     <div>
                        <h4 className="font-bold text-white text-sm text-gray-400">Members</h4>
                        <p className="text-2xl font-semibold text-white">{Intl.NumberFormat('en-US').format(org.members)}</p>
                    </div>
                     <div>
                        <h4 className="font-bold text-white text-sm text-gray-400">Established</h4>
                        <p className="text-2xl font-semibold text-white">{org.established}</p>
                    </div>
                </div>

                <button 
                    onClick={handleJoinRequest} 
                    disabled={joinStatus === 'requested'}
                    className="w-full mt-4 py-3 rounded-lg font-semibold transition-colors bg-gradient-to-r from-brand-purple to-brand-pink text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {joinStatus === 'requested' ? <><CheckIcon className="w-5 h-5" /> Request Sent!</> : 'Request to Join'}
                </button>
            </main>
            {joinStatus === 'requested' && (
                <div className="absolute bottom-5 right-5 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg animate-slide-up flex items-center gap-3">
                    <CheckIcon className="w-5 h-5" />
                    <span className="font-semibold">Join request sent successfully!</span>
                </div>
            )}
        </div>
    );
};

const ExploreView: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

    if (selectedOrg) {
        return <OrganizationDetailView org={selectedOrg} onBack={() => setSelectedOrg(null)} />;
    }

    const filteredOrgs = mockOrganizations.filter(org => 
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="flex-grow flex flex-col h-full bg-dark-bg">
            <header className="p-4 border-b border-dark-border flex-shrink-0">
                <h2 className="font-bold text-lg">Explore Organizations</h2>
                <p className="text-sm text-gray-400">Find and join public communities and open-source projects.</p>
            </header>
            <div className="p-4 flex-shrink-0 border-b border-dark-border">
                <div className="relative">
                    <SearchIcon className="w-5 h-5 absolute top-1/2 left-3 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search organizations or tags..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full bg-dark-card border border-dark-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    />
                </div>
            </div>
            <main className="flex-grow overflow-y-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredOrgs.map(org => (
                        <OrganizationCard key={org.id} org={org} onSelect={() => setSelectedOrg(org)} />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default ExploreView;
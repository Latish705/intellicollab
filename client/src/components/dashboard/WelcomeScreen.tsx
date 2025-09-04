import React from 'react';
import { IntelliCollabLogo, PlusIcon } from '../icons';

const WelcomeScreen: React.FC<{ onCreateRoom: () => void }> = ({ onCreateRoom }) => (
    <div className="flex-grow flex flex-col items-center justify-center text-center p-8">
        <div className="w-24 h-24 bg-dark-card border-2 border-dark-border rounded-2xl flex items-center justify-center mb-6">
            <IntelliCollabLogo className="w-12 h-12 opacity-50"/>
        </div>
        <h2 className="text-2xl font-bold text-white">Welcome to IntelliCollab</h2>
        <p className="mt-2 max-w-sm text-gray-400">Select a room from the sidebar to start collaborating, or create a new room to begin your conversation.</p>
        <button onClick={onCreateRoom} className="mt-8 flex items-center justify-center gap-2 bg-gradient-to-r from-brand-purple to-brand-pink text-white font-semibold px-6 py-2 rounded-lg hover:opacity-90 transition-opacity">
            <PlusIcon className="w-5 h-5"/>
            Create Your First Room
        </button>
    </div>
);

export default WelcomeScreen;
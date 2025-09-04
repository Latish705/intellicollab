import React, { useState } from 'react';
// Fix: Updated import path from '../../types' to '../../types/index' to correctly resolve the types module.
import { Message } from '../../types/index';
import { SparklesIcon, XIcon } from '../icons';

interface AiReplyModalProps {
    message: Message;
    onClose: () => void;
    onInsert: (text: string) => void;
}

const AiReplyModal: React.FC<AiReplyModalProps> = ({ message, onClose, onInsert }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [suggestion, setSuggestion] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);

    const generateSuggestion = async () => {
        setIsLoading(true);
        setSuggestion('');
        await new Promise(res => setTimeout(res, 1500));
        const generatedText = `This is an AI-generated suggestion for a reply to "${message.text}". A thoughtful and professional response could be something along these lines.`;
        setSuggestion(generatedText);
        setIsLoading(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(suggestion);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
            <div className="bg-dark-card border border-dark-border rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
                <header className="p-4 border-b border-dark-border flex justify-between items-center flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <SparklesIcon className="w-6 h-6 text-brand-purple-light"/>
                        <h2 className="font-bold text-lg">Suggest a Reply</h2>
                    </div>
                    <button onClick={onClose} className="p-1 text-gray-400 hover:text-white rounded-md hover:bg-white/10">
                        <XIcon className="w-5 h-5"/>
                    </button>
                </header>
                <main className="p-6 flex-grow overflow-y-auto">
                    <p className="text-sm text-gray-400 mb-2">Replying to:</p>
                    <div className="bg-dark-bg p-4 rounded-lg border border-dark-border">
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white text-sm ${message.isAI ? 'bg-green-500' : 'bg-brand-purple'}`}>
                                {message.user.avatar}
                            </div>
                            <div>
                                <p className="font-semibold text-white">{message.user.name}</p>
                                <p className="text-xs text-gray-400">{message.timestamp}</p>
                            </div>
                        </div>
                        <p className="mt-3 text-gray-300">{message.text}</p>
                    </div>

                    <div className="mt-6">
                        {suggestion ? (
                            <div>
                                <p className="text-sm text-gray-400 mb-2">Suggested Reply:</p>
                                <div className="bg-dark-bg p-4 rounded-lg border border-brand-purple/50 text-gray-300">
                                    {suggestion}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <button onClick={generateSuggestion} disabled={isLoading} className="bg-brand-purple hover:bg-brand-purple-light text-white font-semibold px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 mx-auto disabled:opacity-50">
                                    {isLoading ? 'Generating...' : <> <SparklesIcon className="w-5 h-5" /> Generate Suggestion </>}
                                </button>
                            </div>
                        )}
                        {isLoading && (
                             <div className="flex justify-center items-center gap-2 p-4 text-gray-400 text-sm">
                               <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-0"></span>
                               <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                               <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></span>
                               <span>AI is thinking...</span>
                            </div>
                        )}
                    </div>

                </main>
                 {suggestion && (
                    <footer className="p-4 border-t border-dark-border flex-shrink-0 flex justify-end gap-3">
                        <button onClick={handleCopy} className="bg-white/10 text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition-colors">
                            {copySuccess ? 'Copied!' : 'Copy'}
                        </button>
                        <button onClick={() => onInsert(suggestion)} className="bg-brand-purple text-white font-semibold px-4 py-2 rounded-lg hover:bg-brand-purple-light transition-colors">
                            Insert into Chat
                        </button>
                    </footer>
                )}
            </div>
        </div>
    );
};

export default AiReplyModal;
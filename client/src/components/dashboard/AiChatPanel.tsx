import React, { useState, useRef, useEffect } from 'react';
// Fix: Updated import path from '../../types' to '../../types/index' to correctly resolve the types module.
import { Room, Message } from '../../types/index';
import { SparklesIcon, XIcon, SendIcon } from '../icons';
import { currentUser, otherUser } from '../../data/mockData';

interface AiChatPanelProps {
  room: Room;
  onClose: () => void;
}

const AiChatPanel: React.FC<AiChatPanelProps> = ({ room, onClose }) => {
    const [aiMessages, setAiMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const suggestions = [
        'Summarize our discussion.',
        'What are the key takeaways?',
        'Explain the project architecture.',
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [aiMessages]);

    useEffect(() => {
        setAiMessages([
            {
                id: 'ai_welcome',
                text: `I'm ready to answer questions about #${room.name}. Ask me about recent decisions, project architecture, or to summarize the conversation.`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                user: otherUser,
                isAI: true,
            }
        ]);
        setInput('');
        setIsLoading(false);
    }, [room]);

    const submitMessage = async (messageText: string) => {
        if (!messageText || isLoading) return;

        const userMessage: Message = {
            id: `user_ai_${Date.now()}`,
            text: messageText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            user: currentUser,
        };
        
        setAiMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        await new Promise(res => setTimeout(res, 1500));

        const aiResponse: Message = {
            id: `ai_resp_${Date.now()}`,
            text: `Based on the context of #${room.name}, here's a summary regarding "${userMessage.text}": [This is a mock AI summary about the topic, mentioning key decisions and contributors from the chat history].`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            user: otherUser,
            isAI: true,
        };

        setAiMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const currentInput = input.trim();
        if (currentInput) {
            setInput('');
            await submitMessage(currentInput);
        }
    };

    return (
        <aside className="w-96 flex-shrink-0 bg-dark-card border-l border-dark-border flex flex-col h-full">
            <header className="p-4 border-b border-dark-border flex justify-between items-center flex-shrink-0">
                <div className="flex items-center gap-2">
                    <SparklesIcon className="w-6 h-6 text-brand-purple-light"/>
                    <h2 className="font-bold text-lg">AI Assistant</h2>
                </div>
                <button onClick={onClose} className="p-1 text-gray-400 hover:text-white rounded-md hover:bg-white/10">
                    <XIcon className="w-5 h-5"/>
                </button>
            </header>
            <main className="flex-grow overflow-y-auto p-4 space-y-4">
                 {aiMessages.map(msg => (
                    <div key={msg.id} className={`flex items-start gap-3 ${msg.user.email === currentUser.email ? 'justify-end' : ''}`}>
                         {msg.user.email !== currentUser.email && (
                            <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white bg-gradient-to-br from-green-500 to-teal-500">
                                {msg.user.avatar}
                            </div>
                         )}
                        <div className={`max-w-full p-3 rounded-lg ${msg.user.email === currentUser.email ? 'bg-brand-purple text-white rounded-br-none' : 'bg-dark-bg text-gray-300 rounded-bl-none'}`}>
                           <p>{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white bg-gradient-to-br from-green-500 to-teal-500">
                           {otherUser.avatar}
                        </div>
                        <div className="max-w-full p-3 rounded-lg bg-dark-bg text-gray-300 rounded-bl-none">
                            <div className="flex gap-1.5 items-center">
                               <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-0"></span>
                               <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                               <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </main>
            <footer className="p-4 flex-shrink-0">
                {!isLoading && input.length === 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-400 mb-2">Try asking:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((s) => (
                        <button
                          key={s}
                          onClick={() => submitMessage(s)}
                          className="px-3 py-1.5 bg-dark-bg border border-dark-border rounded-lg text-sm text-gray-300 hover:bg-white/5 hover:border-brand-purple transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <form onSubmit={handleFormSubmit}>
                    <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask AI..."
                            disabled={isLoading}
                            className="w-full bg-dark-bg border border-dark-border rounded-lg pl-4 pr-12 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-purple disabled:opacity-50"
                        />
                        <button type="submit" disabled={isLoading} className="absolute top-1/2 right-3 -translate-y-1/2 p-1.5 rounded-md text-gray-400 hover:text-brand-purple-light disabled:cursor-not-allowed">
                             <SendIcon className="w-5 h-5"/>
                        </button>
                    </div>
                </form>
            </footer>
        </aside>
    );
};

export default AiChatPanel;
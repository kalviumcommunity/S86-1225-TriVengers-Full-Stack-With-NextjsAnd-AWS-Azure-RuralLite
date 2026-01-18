'use client';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function Chatbot({ lessonTitle, lessonSubject }) {
    const { isAuthenticated, user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isOnline, setIsOnline] = useState(true);
    const [showAuthPrompt, setShowAuthPrompt] = useState(false);
    const [messages, setMessages] = useState([{
        role: 'assistant',
        content: `Hi! I'm your study assistant for ${lessonTitle}. I can help answer questions about this lesson. What would you like to know?`
    }]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    // Check online status
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        setIsOnline(navigator.onLine);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleChatbotOpen = () => {
        if (!isAuthenticated) {
            setShowAuthPrompt(true);
            return;
        }

        if (!isOnline) {
            return; // Will show offline message in the button
        }

        setIsOpen(true);
        setShowAuthPrompt(false);
    };

    const quickQuestions = [
        'Explain the key concepts',
        'Give me an example',
        'What are the important points?',
        'Help me understand better'
    ];

    const generateResponse = (userMessage) => {
        const lowercaseMsg = userMessage.toLowerCase();

        // Simple rule-based responses
        if (lowercaseMsg.includes('example')) {
            return `Here's an example related to ${lessonTitle}: Let me walk you through a practical example. Consider the main concepts we discussed, and try applying them step by step. Would you like me to break it down further?`;
        } else if (lowercaseMsg.includes('explain') || lowercaseMsg.includes('understand')) {
            return `Let me explain ${lessonTitle} in simpler terms: The key idea is to understand the fundamental principles first, then build upon them. Think of it as building blocks - each concept connects to create a complete understanding. What specific part would you like me to focus on?`;
        } else if (lowercaseMsg.includes('key concepts') || lowercaseMsg.includes('important')) {
            return `The most important points to remember about ${lessonTitle} are:\n\n1. Master the fundamental definitions and terms\n2. Understand how concepts relate to each other\n3. Practice with examples and exercises\n4. Apply knowledge to solve problems\n\nWhich of these would you like to explore further?`;
        } else if (lowercaseMsg.includes('practice') || lowercaseMsg.includes('quiz')) {
            return `Great initiative! To practice ${lessonTitle}, I recommend:\n\n• Review the lesson content thoroughly\n• Try the practice questions at the end\n• Take the quiz to test your understanding\n• Revisit difficult concepts\n\nWould you like me to create some practice questions for you?`;
        } else if (lowercaseMsg.includes('help') || lowercaseMsg.includes('stuck')) {
            return `I'm here to help! Don't worry, ${lessonSubject} can be challenging. Let's break it down together:\n\n• Tell me which specific concept is confusing\n• Share what you've understood so far\n• I'll explain it in a different way\n\nWhat part of ${lessonTitle} is giving you trouble?`;
        } else if (lowercaseMsg.includes('hi') || lowercaseMsg.includes('hello')) {
            return `Hello! Ready to learn more about ${lessonTitle}? Feel free to ask me anything about this ${lessonSubject} lesson. I'm here to help!`;
        } else if (lowercaseMsg.includes('thank')) {
            return `You're welcome! Keep up the great work with ${lessonTitle}. Learning ${lessonSubject} takes practice, and you're doing great! Is there anything else you'd like to know?`;
        } else {
            return `That's an interesting question about ${lessonTitle}! While I'm a basic study assistant, I can help you:\n\n• Review key concepts from the lesson\n• Understand difficult topics\n• Find practice questions\n• Get study tips for ${lessonSubject}\n\nCould you rephrase your question or pick from the quick questions below?`;
        }
    };

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const userMessage = { role: 'user', content: inputValue };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate typing delay
        setTimeout(() => {
            const response = generateResponse(inputValue);
            const assistantMessage = { role: 'assistant', content: response };
            setMessages(prev => [...prev, assistantMessage]);
            setIsTyping(false);
        }, 1000);
    };

    const handleQuickQuestion = (question) => {
        setInputValue(question);
        handleSend();
    };

    return (
        <>
            {/* Chatbot Toggle Button */}
            <button
                onClick={handleChatbotOpen}
                disabled={!isOnline && !isAuthenticated}
                className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 flex items-center justify-center group ${!isOnline ? 'opacity-50 cursor-not-allowed' : ''
                    } ${isOpen ? 'rotate-90' : ''}`}
                aria-label="Toggle chatbot"
                title={!isOnline ? 'You are offline' : !isAuthenticated ? 'Login required' : 'Open chatbot'}
            >
                {isOpen ? (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <>
                        <svg className="w-8 h-8 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>

                        {!isOnline && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                            </div>
                        )}

                        {!isAuthenticated && isOnline && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                        )}
                    </>
                )}
            </button>

            {/* Offline Message Tooltip */}
            {!isOnline && !isOpen && (
                <div className="fixed bottom-24 right-6 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-xl animate-pulse">
                    <p className="text-sm font-semibold">You are offline!</p>
                    <p className="text-xs">Chatbot unavailable without internet</p>
                </div>
            )}

            {/* Authentication Prompt Modal */}
            {showAuthPrompt && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-slideIn">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">Authentication Required</h3>
                            <p className="text-slate-600">
                                Please log in to use the AI study assistant and get personalized help with your lessons.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Link href="/login" className="w-full">
                                <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-md">
                                    Login to Continue
                                </button>
                            </Link>
                            <button
                                onClick={() => setShowAuthPrompt(false)}
                                className="w-full bg-gray-100 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                            >
                                Maybe Later
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Chatbot Window */}
            {isOpen && isAuthenticated && isOnline && (
                <div className="fixed bottom-24 right-6 z-50 w-full max-w-md h-[600px] bg-white rounded-2xl shadow-2xl border-2 border-orange-200 flex flex-col overflow-hidden animate-slideIn mx-4 sm:mx-0 sm:w-96">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Study Assistant</h3>
                                    <p className="text-xs text-white/80 flex items-center gap-1">
                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                        {lessonSubject} • Online
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-orange-50/30 to-white">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === 'user'
                                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                                            : 'bg-white border-2 border-orange-100 text-slate-800'
                                        }`}
                                >
                                    <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white border-2 border-orange-100 rounded-2xl px-4 py-3">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 rounded-full bg-orange-500 animate-bounce"></div>
                                        <div className="w-2 h-2 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Questions */}
                    {messages.length <= 2 && (
                        <div className="px-4 py-2 bg-orange-50 border-t border-orange-100">
                            <p className="text-xs text-slate-600 font-semibold mb-2">Quick questions:</p>
                            <div className="flex flex-wrap gap-2">
                                {quickQuestions.map((question, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleQuickQuestion(question)}
                                        className="text-xs px-3 py-1.5 bg-white border border-orange-200 text-orange-700 rounded-full hover:bg-orange-100 transition-colors"
                                    >
                                        {question}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <div className="p-4 bg-white border-t-2 border-orange-100">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask a question..."
                                className="flex-1 px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:border-orange-500 text-sm"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!inputValue.trim()}
                                className="px-5 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
        </>
    );
}

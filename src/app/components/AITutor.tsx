import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { groq } from '../config/groq';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AITutor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! I\'m your Edusense AI Mentor. Ask me anything about your courses, concepts, or learning journey! 🚀'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are Edusense AI Mentor, a helpful and encouraging AI tutor for a learning platform called Edusense AI. You help students with programming, cybersecurity, AI, web development, and networking concepts. Be concise, clear, and motivating. Use emojis occasionally to make learning fun.'
          },
          ...messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          { role: 'user', content: userMessage }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 500
      });

      const aiResponse = chatCompletion.choices[0]?.message?.content || 'Sorry, I could not process that.';
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again!' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-[#00E5FF] to-[#007BFF] rounded-full shadow-lg shadow-[#00E5FF]/50 flex items-center justify-center hover:shadow-[#00E5FF]/70 transition-all z-50"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] sm:h-[600px] bg-[#0A0F24] border-2 border-[#00E5FF] rounded-2xl shadow-2xl shadow-[#00E5FF]/30 flex flex-col z-50"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#00E5FF] to-[#007BFF] p-4 rounded-t-xl flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-6 h-6 text-white" />
                <div>
                  <h3 className="font-bold text-white">Edusense AI Mentor</h3>
                  <p className="text-xs text-white/80">Always here to help</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-[#00E5FF] to-[#007BFF] text-white'
                        : 'bg-[#1a2341] text-[#E6F7FF] border border-[#00E5FF]/30'
                    }`}
                  >
                    {message.role === 'assistant' ? (
                      <div className="text-sm">
                        <ReactMarkdown
                          components={{
                            p: ({node, children}) => <p className="mb-1 text-[#E6F7FF]">{children}</p>,
                            h1: ({node, children}) => <h1 className="text-lg font-bold text-[#00E5FF] mb-2">{children}</h1>,
                            h2: ({node, children}) => <h2 className="text-base font-bold text-[#00E5FF] mb-2">{children}</h2>,
                            h3: ({node, children}) => <h3 className="text-sm font-bold text-[#00E5FF] mb-1">{children}</h3>,
                            ul: ({node, children}) => <ul className="list-disc list-inside mb-1 space-y-1 text-[#E6F7FF]">{children}</ul>,
                            ol: ({node, children}) => <ol className="list-decimal list-inside mb-1 space-y-1 text-[#E6F7FF]">{children}</ol>,
                            li: ({node, children}) => <li className="ml-2">{children}</li>,
                            code: ({node, inline, children}) => 
                              inline ? (
                                <code className="bg-[#0a0f24]/50 px-1.5 py-0.5 rounded text-[#00E5FF] text-xs font-mono">{children}</code>
                              ) : (
                                <code className="block bg-[#0a0f24] border border-[#00E5FF]/30 p-2 rounded text-xs my-1 overflow-x-auto font-mono text-[#00E5FF]">{children}</code>
                              ),
                            pre: ({node, children}) => <pre className="bg-[#0a0f24] border border-[#00E5FF]/30 p-2 rounded text-xs my-1 overflow-x-auto font-mono">{children}</pre>,
                            a: ({node, children, href}) => <a href={href} className="text-[#00E5FF] underline hover:text-[#007BFF]" target="_blank" rel="noopener noreferrer">{children}</a>,
                            blockquote: ({node, children}) => <blockquote className="border-l-2 border-[#00E5FF] pl-2 italic text-[#E6F7FF]/80 my-1">{children}</blockquote>,
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm">{message.content}</p>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#1a2341] border border-[#00E5FF]/30 p-3 rounded-2xl">
                    <Loader2 className="w-5 h-5 text-[#00E5FF] animate-spin" />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-[#00E5FF]/30">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-[#1a2341] text-[#E6F7FF] border border-[#00E5FF]/30 rounded-lg px-4 py-2 focus:outline-none focus:border-[#00E5FF] transition-colors placeholder:text-[#E6F7FF]/40"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className="bg-gradient-to-br from-[#00E5FF] to-[#007BFF] text-white p-2 rounded-lg hover:shadow-lg hover:shadow-[#00E5FF]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

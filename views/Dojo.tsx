import React, { useState, useEffect, useRef } from 'react';
import { Send, XCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { Employee, Message, SessionType } from '../types';
import { generatePersonaResponse } from '../services/geminiService';

interface DojoProps {
  employee: Employee;
  sessionType: SessionType;
  onEndSession: () => void;
}

const SESSION_TITLES: Record<SessionType, string> = {
  'FEEDBACK': 'Feedback de Desempenho',
  'FIRING': 'Sessão de Desligamento',
  'CONFLICT': 'Resolução de Conflito',
  'PROMOTION': 'Conversa de Carreira',
  'COACHING': 'Mentoria 1:1'
};

export const Dojo: React.FC<DojoProps> = ({ employee, sessionType, onEndSession }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting based on type
  useEffect(() => {
    let initialText = `Oi chefe, queria falar comigo?`;
    
    if (sessionType === 'FIRING') initialText = `Oi... recebi seu convite para a reunião. Está tudo bem?`;
    if (sessionType === 'CONFLICT') initialText = `Oi. Você soube do que aconteceu no projeto?`;
    if (sessionType === 'PROMOTION') initialText = `Olá! Estou ansioso para saber sobre meu futuro na empresa.`;

    const initialMsg: Message = {
      id: 'init',
      sender: 'ai',
      text: initialText,
      timestamp: new Date()
    };
    setMessages([initialMsg]);
  }, [employee, sessionType]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Call AI Service
    const responseText = await generatePersonaResponse(employee, messages, userMsg.text, sessionType);

    // Simulate thinking delay
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500); 
  };

  return (
    <div className="h-screen flex flex-col bg-[#121212] relative overflow-hidden">
      {/* Dojo Header */}
      <div className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-surface z-10 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src={employee.avatarUrl} alt={employee.name} className="w-10 h-10 rounded-full border-2 border-accent" />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-surface"></div>
          </div>
          <div>
            <h3 className="font-bold text-white">{employee.name}</h3>
            <p className="text-xs text-textSecondary">{employee.role} • {SESSION_TITLES[sessionType]}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="danger" onClick={onEndSession} className="h-9 px-4 text-sm">
            <XCircle size={16} /> Encerrar
          </Button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl text-sm leading-relaxed shadow-md ${
              msg.sender === 'user' 
                ? 'bg-accent text-black rounded-tr-sm' 
                : 'bg-surface text-gray-200 border border-gray-700 rounded-tl-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
             <div className="bg-surface border border-gray-700 p-4 rounded-2xl rounded-tl-sm flex gap-2 items-center">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-surface border-t border-gray-800">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Mensagem para ${employee.name.split(' ')[0]}...`}
            className="flex-1 bg-[#121212] border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors"
          />
          <Button type="submit" disabled={!inputValue.trim() || isTyping} className="w-14">
            <Send size={20} />
          </Button>
        </form>
      </div>
    </div>
  );
};
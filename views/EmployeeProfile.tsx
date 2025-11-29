import React, { useState } from 'react';
import { ArrowLeft, Play, Calendar, Star, Briefcase, Frown, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { Button } from '../components/Button';
import { Employee, SessionType } from '../types';

interface EmployeeProfileProps {
  employee: Employee;
  onBack: () => void;
  onStartSession: (type: SessionType) => void;
}

const SESSION_TYPES: { id: SessionType; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'FEEDBACK', label: 'Feedback de Desempenho', icon: <TrendingUp size={18} />, desc: 'Alinhamento de expectativas e resultados.' },
  { id: 'FIRING', label: 'Demissão / Desligamento', icon: <Frown size={18} />, desc: 'Conduzir uma saída respeitosa e firme.' },
  { id: 'CONFLICT', label: 'Resolução de Conflito', icon: <AlertTriangle size={18} />, desc: 'Mediar disputas entre membros do time.' },
  { id: 'PROMOTION', label: 'Promoção e Carreira', icon: <Star size={18} />, desc: 'Comunicar aumento ou novo cargo.' },
  { id: 'COACHING', label: 'Mentoria / Coaching', icon: <Users size={18} />, desc: 'Desenvolvimento de soft skills.' },
];

export const EmployeeProfile: React.FC<EmployeeProfileProps> = ({ employee, onBack, onStartSession }) => {
  const [selectedType, setSelectedType] = useState<SessionType>('FEEDBACK');

  // Helper to render bars for OCEAN traits
  const TraitBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="font-mono font-bold">{value}%</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fade-in min-h-screen">
      <button onClick={onBack} className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft size={18} className="mr-2" /> Voltar ao Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Info & Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface border border-gray-800 rounded-2xl p-6 text-center shadow-lg">
            <img 
              src={employee.avatarUrl} 
              alt={employee.name} 
              className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-gray-700"
            />
            <h1 className="text-2xl font-bold text-white">{employee.name}</h1>
            <p className="text-accent mb-4">{employee.role}</p>
            <div className="text-left mt-6 pt-6 border-t border-gray-800">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Perfil Psicométrico (OCEAN)</h3>
              <TraitBar label="Abertura" value={employee.traits.openness} color="bg-blue-400" />
              <TraitBar label="Conscienciosidade" value={employee.traits.conscientiousness} color="bg-purple-400" />
              <TraitBar label="Extroversão" value={employee.traits.extraversion} color="bg-yellow-400" />
              <TraitBar label="Amabilidade" value={employee.traits.agreeableness} color="bg-green-400" />
              <TraitBar label="Neuroticismo" value={employee.traits.neuroticism} color="bg-red-400" />
            </div>
          </div>
        </div>

        {/* Right Column: Actions & History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Action Card */}
          <div className="bg-surface border border-gray-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Briefcase className="text-accent" />
              Iniciar Nova Simulação
            </h2>
            <p className="text-gray-400 text-sm mb-6">Escolha o cenário para praticar com {employee.name.split(' ')[0]}.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {SESSION_TYPES.map((type) => (
                <div 
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col gap-2 ${
                    selectedType === type.id 
                      ? 'bg-accent/10 border-accent' 
                      : 'bg-[#121212] border-gray-700 hover:border-gray-500'
                  }`}
                >
                  <div className={`flex items-center gap-2 font-bold ${selectedType === type.id ? 'text-accent' : 'text-white'}`}>
                    {type.icon}
                    {type.label}
                  </div>
                  <p className="text-xs text-gray-500">{type.desc}</p>
                </div>
              ))}
            </div>

            <Button onClick={() => onStartSession(selectedType)} fullWidth>
              Entrar no Dojo <Play size={18} fill="currentColor" />
            </Button>
          </div>

          {/* History Card */}
          <div className="bg-surface border border-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Calendar className="text-gray-400" />
              Histórico de Sessões
            </h2>
            
            {employee.history && employee.history.length > 0 ? (
              <div className="space-y-4">
                {employee.history.map((session) => (
                  <div key={session.id} className="bg-[#121212] p-4 rounded-xl border border-gray-800 flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white text-sm bg-gray-800 px-2 py-0.5 rounded">
                          {SESSION_TYPES.find(t => t.id === session.type)?.label || session.type}
                        </span>
                        <span className="text-xs text-gray-500">{session.date}</span>
                      </div>
                      <p className="text-sm text-gray-400">{session.summary}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-bold ${session.score >= 70 ? 'text-green-400' : 'text-yellow-400'}`}>
                        {session.score}%
                      </div>
                      <span className="text-[10px] text-gray-500 uppercase">Score</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Nenhuma sessão registrada com este perfil.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
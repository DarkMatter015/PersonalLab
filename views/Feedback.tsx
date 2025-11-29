import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Home, Repeat, CheckCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { Employee } from '../types';

interface FeedbackProps {
  employee: Employee;
  onHome: () => void;
  onRestart: () => void;
}

export const Feedback: React.FC<FeedbackProps> = ({ employee, onHome, onRestart }) => {
  const data = [
    { subject: 'Empatia', A: 85, fullMark: 100 },
    { subject: 'Clareza', A: 65, fullMark: 100 },
    { subject: 'Paciência', A: 90, fullMark: 100 },
    { subject: 'Escuta Ativa', A: 70, fullMark: 100 },
    { subject: 'Resolução', A: 50, fullMark: 100 },
  ];

  return (
    <div className="min-h-screen p-6 flex items-center justify-center animate-fade-in">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 text-accent mb-4">
            <CheckCircle size={32} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Sessão Finalizada</h2>
          <p className="text-textSecondary">Análise da sua performance com {employee.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chart Card */}
          <div className="bg-surface border border-gray-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
             <h3 className="text-lg font-bold text-white mb-4 text-center">Radar de Performance</h3>
             <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                  <PolarGrid stroke="#333" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#A1A1AA', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Performance"
                    dataKey="A"
                    stroke="#DEFF9A"
                    strokeWidth={3}
                    fill="#DEFF9A"
                    fillOpacity={0.3}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1E1E1E', borderColor: '#333', color: '#fff' }}
                    itemStyle={{ color: '#DEFF9A' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
             </div>
          </div>

          {/* Analysis Card */}
          <div className="flex flex-col gap-4">
            <div className="bg-surface border border-gray-800 rounded-2xl p-6 flex-1">
              <h3 className="text-lg font-bold text-white mb-4">Insights da IA</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Você demonstrou forte <strong>empatia</strong> em relação às preocupações de {employee.name} (Neuroticismo: {employee.traits.neuroticism}%). No entanto, sua <strong>clareza</strong> ao definir os próximos passos poderia ser melhorada. O colaborador pareceu confuso sobre os prazos finais.
              </p>
              <div className="space-y-3">
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Controle Emocional</span>
                    <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500 w-[80%]"></div>
                    </div>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Assertividade</span>
                    <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                       <div className="h-full bg-yellow-500 w-[60%]"></div>
                    </div>
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="secondary" onClick={onHome} fullWidth>
                <Home size={18} /> Voltar
              </Button>
              <Button onClick={onRestart} fullWidth>
                <Repeat size={18} /> Repetir
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
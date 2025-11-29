
import React, { useState } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { BigFive } from '../types';

interface AssessmentProps {
  onComplete: (traits: BigFive) => void;
  onCancel: () => void;
}

type Question = {
  id: number;
  text: string;
  trait: keyof BigFive;
  direction: 1 | -1; // 1 = Positive correlation, -1 = Negative correlation
};

const QUESTIONS: Question[] = [
  // Openness
  { id: 1, text: "Tenho excelentes ideias e muita imaginação.", trait: 'openness', direction: 1 },
  { id: 2, text: "Tenho dificuldade em entender conceitos abstratos.", trait: 'openness', direction: -1 },
  
  // Conscientiousness
  { id: 3, text: "Estou sempre preparado e sigo um cronograma.", trait: 'conscientiousness', direction: 1 },
  { id: 4, text: "Deixo meus pertences espalhados por aí.", trait: 'conscientiousness', direction: -1 },

  // Extraversion
  { id: 5, text: "Sinto-me confortável perto de pessoas e começo conversas.", trait: 'extraversion', direction: 1 },
  { id: 6, text: "Fico quieto perto de estranhos.", trait: 'extraversion', direction: -1 },

  // Agreeableness
  { id: 7, text: "Tenho um coração mole e me preocupo com os outros.", trait: 'agreeableness', direction: 1 },
  { id: 8, text: "Começo disputas e insulto pessoas facilmente.", trait: 'agreeableness', direction: -1 },

  // Neuroticism
  { id: 9, text: "Fico estressado e perturbado facilmente.", trait: 'neuroticism', direction: 1 },
  { id: 10, text: "Sou relaxado na maior parte do tempo.", trait: 'neuroticism', direction: -1 },
];

export const PersonalityAssessment: React.FC<AssessmentProps> = ({ onComplete, onCancel }) => {
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const handleOptionSelect = (questionId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const calculateScore = () => {
    const scores: Record<keyof BigFive, number> = {
      openness: 0,
      conscientiousness: 0,
      extraversion: 0,
      agreeableness: 0,
      neuroticism: 0
    };

    // Calculate raw scores
    // Each trait has 2 questions. Max raw score = 10, Min raw score = 2.
    // Formula to normalize to 0-100: (Raw - Min) / (Max - Min) * 100
    
    // Helper to store raw sums
    const rawSums: Record<string, number> = { openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 0, neuroticism: 0 };
    
    QUESTIONS.forEach(q => {
      const answer = answers[q.id] || 3; // Default to neutral if skipped (shouldn't happen with validation)
      let scoreToAdd = answer;
      
      // Invert score for negative questions (1 becomes 5, 5 becomes 1)
      if (q.direction === -1) {
        scoreToAdd = 6 - answer;
      }
      
      rawSums[q.trait] += scoreToAdd;
    });

    // Normalize
    (Object.keys(scores) as Array<keyof BigFive>).forEach(key => {
        const raw = rawSums[key];
        const min = 2; // 2 questions * 1 min score
        const max = 10; // 2 questions * 5 max score
        const percentage = Math.round(((raw - min) / (max - min)) * 100);
        scores[key] = Math.max(0, Math.min(100, percentage));
    });

    onComplete(scores);
  };

  const allAnswered = QUESTIONS.every(q => answers[q.id] !== undefined);
  const progress = Math.round((Object.keys(answers).length / QUESTIONS.length) * 100);

  return (
    <div className="min-h-screen p-6 animate-fade-in flex flex-col items-center">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={onCancel} className="flex items-center text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={18} className="mr-2" /> Cancelar
          </button>
          <div className="text-right">
             <span className="text-accent font-bold text-xl">{progress}%</span>
             <p className="text-xs text-gray-500">Concluído</p>
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2 text-white">Questionário de Personalidade</h1>
          <p className="text-textSecondary">Responda honestamente para calibrar o Gêmeo Digital.</p>
        </div>

        {/* Questions List */}
        <div className="space-y-8 mb-10">
          {QUESTIONS.map((q) => (
            <div key={q.id} className="bg-surface border border-gray-800 p-6 rounded-xl">
              <p className="text-lg text-white mb-6 font-medium">{q.text}</p>
              
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <span className="text-xs text-red-400 uppercase font-bold tracking-wider hidden md:block">Discordo Totalmente</span>
                
                <div className="flex gap-3 w-full md:w-auto justify-center">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      onClick={() => handleOptionSelect(q.id, val)}
                      className={`
                        w-10 h-10 md:w-12 md:h-12 rounded-full font-bold transition-all border
                        ${answers[q.id] === val 
                          ? 'bg-accent text-black border-accent scale-110 shadow-[0_0_15px_rgba(222,255,154,0.4)]' 
                          : 'bg-[#121212] text-gray-500 border-gray-700 hover:border-gray-500'
                        }
                      `}
                    >
                      {val}
                    </button>
                  ))}
                </div>

                <span className="text-xs text-green-400 uppercase font-bold tracking-wider hidden md:block">Concordo Totalmente</span>
                
                {/* Mobile Labels */}
                <div className="flex justify-between w-full md:hidden text-xs text-gray-500 font-bold uppercase mt-2">
                   <span className="text-red-400">Discordo</span>
                   <span className="text-green-400">Concordo</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Action */}
        <div className="sticky bottom-6 bg-[#121212]/90 backdrop-blur-md p-4 border border-gray-800 rounded-2xl shadow-2xl">
          <Button 
            onClick={calculateScore} 
            fullWidth 
            disabled={!allAnswered}
            className={allAnswered ? 'animate-pulse' : ''}
          >
            {allAnswered ? 'Calcular e Aplicar Perfil' : `Responda todas as perguntas (${Object.keys(answers).length}/${QUESTIONS.length})`}
            {allAnswered && <CheckCircle size={18} />}
          </Button>
        </div>
      </div>
    </div>
  );
};

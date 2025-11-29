
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, User, BrainCircuit, RefreshCw } from 'lucide-react';
import { Button } from '../components/Button';
import { Slider } from '../components/Slider';
import { Employee, BigFive, Gender } from '../types';

interface PersonaCreatorProps {
  initialData: Partial<Employee>;
  onBack: () => void;
  onSave: (employee: Employee) => void;
  onTakeAssessment: (draft: Partial<Employee>) => void;
}

export const PersonaCreator: React.FC<PersonaCreatorProps> = ({ initialData, onBack, onSave, onTakeAssessment }) => {
  const [name, setName] = useState(initialData.name || '');
  const [role, setRole] = useState(initialData.role || '');
  const [gender, setGender] = useState<Gender>(initialData.gender || 'female');
  const [traits, setTraits] = useState<BigFive>(initialData.traits || {
    openness: 50,
    conscientiousness: 50,
    extraversion: 50,
    agreeableness: 50,
    neuroticism: 50
  });
  const [avatarUrl, setAvatarUrl] = useState('');

  // Generate Avatar based on Gender
  useEffect(() => {
    // Deterministic random image based on name length if name exists, otherwise random
    const seed = name.length > 0 ? name.length + (role.length) : Math.floor(Math.random() * 99);
    const id = seed % 99; 
    setAvatarUrl(`https://randomuser.me/api/portraits/${gender === 'male' ? 'men' : 'women'}/${id}.jpg`);
  }, [gender, name, role]);

  const handleSave = () => {
    if (!name || !role) return;
    
    const newEmployee: Employee = {
      id: Date.now().toString(),
      name,
      role,
      gender,
      traits,
      avatarUrl,
      history: []
    };
    onSave(newEmployee);
  };

  const handleQuizClick = () => {
    onTakeAssessment({
      name,
      role,
      gender,
      traits
    });
  };

  const updateTrait = (key: keyof BigFive, value: number) => {
    setTraits(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 animate-fade-in">
      <button onClick={onBack} className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft size={18} className="mr-2" /> Voltar ao Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Avatar & Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface rounded-2xl border border-gray-800 p-6 text-center">
             <div className="relative inline-block mb-4">
                <img src={avatarUrl} alt="Avatar Preview" className="w-32 h-32 rounded-full border-4 border-gray-700" />
                <div className="absolute bottom-2 right-2 bg-gray-900 rounded-full p-1 border border-gray-600">
                  {gender === 'female' ? <User size={14} className="text-pink-400"/> : <User size={14} className="text-blue-400"/>}
                </div>
             </div>
             <p className="text-xs text-gray-500 mb-4">Avatar gerado automaticamente</p>
             
             <div className="text-left space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Gênero</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => setGender('female')}
                      className={`p-2 rounded-lg text-sm border ${gender === 'female' ? 'bg-accent text-black border-accent' : 'border-gray-700 text-gray-400 hover:border-gray-500'}`}
                    >
                      Feminino
                    </button>
                    <button 
                      onClick={() => setGender('male')}
                      className={`p-2 rounded-lg text-sm border ${gender === 'male' ? 'bg-accent text-black border-accent' : 'border-gray-700 text-gray-400 hover:border-gray-500'}`}
                    >
                      Masculino
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Nome Completo</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#121212] border border-gray-700 rounded-lg p-3 text-white focus:border-accent focus:outline-none"
                    placeholder="Ex: João Silva"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Cargo</label>
                  <input 
                    type="text" 
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-[#121212] border border-gray-700 rounded-lg p-3 text-white focus:border-accent focus:outline-none"
                    placeholder="Ex: Analista"
                  />
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Personality */}
        <div className="lg:col-span-2">
          <div className="bg-surface rounded-2xl border border-gray-800 p-8 shadow-2xl h-full flex flex-col">
            <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-800">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <BrainCircuit className="text-accent" />
                Personalidade
              </h2>
              <Button variant="secondary" onClick={handleQuizClick} className="text-xs h-10">
                 <RefreshCw size={14} className="mr-2" /> Calcular via Quiz
              </Button>
            </div>

            <div className="space-y-6 flex-1">
              <Slider 
                label="Abertura (Openness)" 
                value={traits.openness} 
                onChange={(v) => updateTrait('openness', v)}
                descriptionLeft="Conservador"
                descriptionRight="Criativo"
              />
              <Slider 
                label="Conscienciosidade" 
                value={traits.conscientiousness} 
                onChange={(v) => updateTrait('conscientiousness', v)}
                descriptionLeft="Improvisador"
                descriptionRight="Organizado"
              />
              <Slider 
                label="Extroversão" 
                value={traits.extraversion} 
                onChange={(v) => updateTrait('extraversion', v)}
                descriptionLeft="Reservado"
                descriptionRight="Sociável"
              />
              <Slider 
                label="Amabilidade" 
                value={traits.agreeableness} 
                onChange={(v) => updateTrait('agreeableness', v)}
                descriptionLeft="Desafiador"
                descriptionRight="Amigável"
              />
              <Slider 
                label="Neuroticismo" 
                value={traits.neuroticism} 
                onChange={(v) => updateTrait('neuroticism', v)}
                descriptionLeft="Estável"
                descriptionRight="Sensível"
              />
            </div>

            <div className="mt-8 pt-6 border-t border-gray-800 flex justify-end">
              <Button onClick={handleSave} disabled={!name || !role} className="w-full md:w-auto px-8">
                <Save size={18} /> Salvar Gêmeo Digital
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

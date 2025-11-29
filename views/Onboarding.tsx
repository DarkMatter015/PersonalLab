import React, { useState } from 'react';
import { Upload, ArrowRight, Building2 } from 'lucide-react';
import { Button } from '../components/Button';
import { CompanyInfo } from '../types';

interface OnboardingProps {
  onComplete: (info: CompanyInfo) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [fileUploaded, setFileUploaded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && industry) {
      onComplete({ name, industry, cultureCodeUploaded: fileUploaded });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full animate-fade-in">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2 tracking-tight">Persona<span className="text-accent">Lab</span></h1>
          <p className="text-textSecondary">Treine para as conversas que realmente importam.</p>
        </div>

        <div className="bg-surface p-8 rounded-2xl border border-gray-800 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Building2 className="text-accent" />
            Configurar Empresa
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Nome da Empresa</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#121212] border border-gray-700 rounded-xl p-3 text-white focus:border-accent focus:outline-none transition-colors"
                placeholder="Ex: Tech Solutions"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Ramo de Atuação</label>
              <select 
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-[#121212] border border-gray-700 rounded-xl p-3 text-white focus:border-accent focus:outline-none transition-colors"
                required
              >
                <option value="">Selecione a Indústria</option>
                <option value="tech">Tecnologia</option>
                <option value="finance">Finanças</option>
                <option value="healthcare">Saúde</option>
                <option value="retail">Varejo</option>
                <option value="education">Educação</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Código de Cultura (Opcional)</label>
              <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${fileUploaded ? 'border-accent bg-accent/5' : 'border-gray-700 hover:border-gray-500'}`}>
                <input 
                  type="file" 
                  className="hidden" 
                  id="culture-upload"
                  onChange={() => setFileUploaded(true)}
                />
                <label htmlFor="culture-upload" className="cursor-pointer w-full h-full flex flex-col items-center">
                  <Upload className={`mb-2 ${fileUploaded ? 'text-accent' : 'text-gray-500'}`} />
                  <span className="text-sm text-gray-400">
                    {fileUploaded ? 'codigo_cultura.pdf enviado' : 'Upload PDF ou DOCX'}
                  </span>
                </label>
              </div>
            </div>

            <Button type="submit" fullWidth disabled={!name || !industry}>
              Começar <ArrowRight size={18} />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
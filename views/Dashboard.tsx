import React from 'react';
import { Plus, Users, Zap, AlertTriangle, MessageSquare, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { Employee, CompanyInfo } from '../types';

interface DashboardProps {
  company: CompanyInfo;
  employees: Employee[];
  onAddEmployee: () => void;
  onSelectEmployee: (employee: Employee) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  company, 
  employees, 
  onAddEmployee, 
  onSelectEmployee 
}) => {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-1">Olá, Líder</h2>
          <p className="text-textSecondary text-sm">{company.name} • {company.industry}</p>
        </div>
        <Button onClick={onAddEmployee}>
          <Plus size={18} /> Novo Gêmeo Digital
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface p-5 rounded-2xl border border-gray-800">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Zap className="text-green-400" size={20} />
            </div>
            <span className="text-xs text-green-400 font-bold">+12%</span>
          </div>
          <h3 className="text-2xl font-bold text-white">Alta</h3>
          <p className="text-textSecondary text-sm">Moral do Time</p>
        </div>

        <div className="bg-surface p-5 rounded-2xl border border-gray-800">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <AlertTriangle className="text-yellow-400" size={20} />
            </div>
            <span className="text-xs text-textSecondary">2 Pendentes</span>
          </div>
          <h3 className="text-2xl font-bold text-white">Moderado</h3>
          <p className="text-textSecondary text-sm">Risco de Conflito</p>
        </div>

        <div className="bg-surface p-5 rounded-2xl border border-gray-800">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-accent/10 rounded-lg">
              <MessageSquare className="text-accent" size={20} />
            </div>
            <span className="text-xs text-textSecondary">Esta Semana</span>
          </div>
          <h3 className="text-2xl font-bold text-white">8 Sessões</h3>
          <p className="text-textSecondary text-sm">Treinamentos Realizados</p>
        </div>
      </div>

      {/* Employee List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Users size={20} className="text-accent" /> Seu Time
        </h3>
        
        {employees.length === 0 ? (
          <div className="bg-surface border border-gray-800 rounded-2xl p-10 text-center">
            <div className="bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-gray-500" />
            </div>
            <p className="text-gray-400 mb-4">Nenhum gêmeo digital criado ainda.</p>
            <Button variant="secondary" onClick={onAddEmployee}>Criar Primeira Persona</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {employees.map(emp => (
              <div 
                key={emp.id} 
                className="bg-surface border border-gray-800 hover:border-accent transition-colors p-5 rounded-2xl cursor-pointer group"
                onClick={() => onSelectEmployee(emp)}
              >
                <div className="flex items-center gap-4 mb-4">
                  <img src={emp.avatarUrl} alt={emp.name} className="w-12 h-12 rounded-full border-2 border-gray-700" />
                  <div>
                    <h4 className="font-bold text-white group-hover:text-accent transition-colors">{emp.name}</h4>
                    <p className="text-xs text-textSecondary">{emp.role}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="text-[10px] bg-gray-800 text-gray-300 px-2 py-1 rounded" title="Neuroticismo">N: {emp.traits.neuroticism}%</span>
                  <span className="text-[10px] bg-gray-800 text-gray-300 px-2 py-1 rounded" title="Abertura">A: {emp.traits.openness}%</span>
                  <span className="text-[10px] bg-gray-800 text-gray-300 px-2 py-1 rounded" title="Amabilidade">Am: {emp.traits.agreeableness}%</span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center">
                  <span className="text-xs text-accent">Ver Perfil</span>
                  <ArrowRight size={14} className="text-accent transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Onboarding } from './views/Onboarding';
import { Dashboard } from './views/Dashboard';
import { PersonaCreator } from './views/PersonaCreator';
import { PersonalityAssessment } from './views/PersonalityAssessment';
import { Dojo } from './views/Dojo';
import { Feedback } from './views/Feedback';
import { EmployeeProfile } from './views/EmployeeProfile';
import { AppState, CompanyInfo, Employee, SessionType, BigFive, Gender } from './types';

// MOCK DATA INITIALIZATION
const MOCK_EMPLOYEES: Employee[] = [
  {
    id: '1',
    name: 'Ana Souza',
    role: 'Gerente de Projetos',
    gender: 'female',
    avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    traits: { openness: 30, conscientiousness: 90, extraversion: 40, agreeableness: 20, neuroticism: 85 },
    history: [
      { id: 'h1', date: '10/05/2024', type: 'CONFLICT', score: 65, summary: 'Dificuldade em aceitar críticas sobre prazos.' },
      { id: 'h2', date: '12/05/2024', type: 'FEEDBACK', score: 78, summary: 'Melhorou a escuta ativa, mas ainda defensiva.' }
    ]
  },
  {
    id: '2',
    name: 'Carlos Mendes',
    role: 'Desenvolvedor Senior',
    gender: 'male',
    avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    traits: { openness: 80, conscientiousness: 40, extraversion: 20, agreeableness: 60, neuroticism: 30 },
    history: [
      { id: 'h3', date: '01/05/2024', type: 'COACHING', score: 92, summary: 'Sessão produtiva sobre novas tecnologias.' }
    ]
  },
  {
    id: '3',
    name: 'Juliana Ferreira',
    role: 'Designer UX',
    gender: 'female',
    avatarUrl: 'https://randomuser.me/api/portraits/women/63.jpg',
    traits: { openness: 90, conscientiousness: 50, extraversion: 85, agreeableness: 80, neuroticism: 60 },
    history: []
  }
];

const App: React.FC = () => {
  // State Management
  const [view, setView] = useState<AppState>(AppState.ONBOARDING);
  const [company, setCompany] = useState<CompanyInfo | null>(null);
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [activeEmployee, setActiveEmployee] = useState<Employee | null>(null);
  const [sessionType, setSessionType] = useState<SessionType>('FEEDBACK');

  // Draft state for Creator <-> Assessment navigation
  const [draftEmployee, setDraftEmployee] = useState<Partial<Employee>>({
    traits: { openness: 50, conscientiousness: 50, extraversion: 50, agreeableness: 50, neuroticism: 50 },
    name: '',
    role: '',
    gender: 'female'
  });

  // Handlers
  const handleOnboardingComplete = (info: CompanyInfo) => {
    setCompany(info);
    setView(AppState.DASHBOARD);
  };

  const handleAddEmployee = () => {
    // Reset draft
    setDraftEmployee({
      traits: { openness: 50, conscientiousness: 50, extraversion: 50, agreeableness: 50, neuroticism: 50 },
      name: '',
      role: '',
      gender: 'female'
    });
    setView(AppState.CREATOR);
  };

  const handleSaveEmployee = (emp: Employee) => {
    setEmployees(prev => [...prev, emp]);
    setView(AppState.DASHBOARD);
  };

  const handleGoToAssessment = (currentDraft: Partial<Employee>) => {
    setDraftEmployee(currentDraft);
    setView(AppState.ASSESSMENT);
  };

  const handleAssessmentComplete = (calculatedTraits: BigFive) => {
    setDraftEmployee(prev => ({ ...prev, traits: calculatedTraits }));
    setView(AppState.CREATOR);
  };

  const handleViewProfile = (emp: Employee) => {
    setActiveEmployee(emp);
    setView(AppState.PROFILE);
  };

  const handleStartSession = (type: SessionType) => {
    setSessionType(type);
    setView(AppState.DOJO);
  };

  const handleEndSession = () => {
    setView(AppState.FEEDBACK);
  };

  const handleHome = () => {
    setActiveEmployee(null);
    setView(AppState.DASHBOARD);
  };

  const handleBackToProfile = () => {
    setView(AppState.PROFILE);
  };

  const handleRestart = () => {
    setView(AppState.DOJO);
  };

  // View Routing
  return (
    <div className="bg-[#121212] min-h-screen text-white font-sans selection:bg-accent selection:text-black">
      {view === AppState.ONBOARDING && (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}
      
      {view === AppState.DASHBOARD && company && (
        <Dashboard 
          company={company} 
          employees={employees} 
          onAddEmployee={handleAddEmployee}
          onSelectEmployee={handleViewProfile}
        />
      )}

      {view === AppState.PROFILE && activeEmployee && (
        <EmployeeProfile 
          employee={activeEmployee}
          onBack={handleHome}
          onStartSession={handleStartSession}
        />
      )}

      {view === AppState.CREATOR && (
        <PersonaCreator 
          initialData={draftEmployee}
          onBack={() => setView(AppState.DASHBOARD)} 
          onSave={handleSaveEmployee}
          onTakeAssessment={handleGoToAssessment}
        />
      )}

      {view === AppState.ASSESSMENT && (
        <PersonalityAssessment 
          onComplete={handleAssessmentComplete}
          onCancel={() => setView(AppState.CREATOR)}
        />
      )}

      {view === AppState.DOJO && activeEmployee && (
        <Dojo 
          employee={activeEmployee} 
          sessionType={sessionType}
          onEndSession={handleEndSession} 
        />
      )}

      {view === AppState.FEEDBACK && activeEmployee && (
        <Feedback 
          employee={activeEmployee} 
          onHome={handleBackToProfile}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};

export default App;

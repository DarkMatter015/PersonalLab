
export interface BigFive {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

export type SessionType = 'FEEDBACK' | 'FIRING' | 'PROMOTION' | 'CONFLICT' | 'COACHING';
export type Gender = 'female' | 'male';

export interface SessionHistory {
  id: string;
  date: string;
  type: SessionType;
  score: number; // 0-100
  summary: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  gender: Gender;
  traits: BigFive;
  avatarUrl: string;
  history: SessionHistory[];
}

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export interface SessionMetrics {
  emotionalControl: number;
  clarity: number;
  empathy: number;
}

export enum AppState {
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  PROFILE = 'PROFILE',
  CREATOR = 'CREATOR',
  ASSESSMENT = 'ASSESSMENT',
  DOJO = 'DOJO',
  FEEDBACK = 'FEEDBACK'
}

export interface CompanyInfo {
  name: string;
  industry: string;
  cultureCodeUploaded: boolean;
}

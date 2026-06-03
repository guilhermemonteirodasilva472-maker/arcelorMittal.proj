export enum DocumentStatus {
  PENDING = "Pendente",
  UNDER_ANALYSIS = "Em Análise",
  APPROVED = "Aprovado",
  BLOCKED = "Bloqueado",
  NOT_APPLICABLE = "Não se Aplica"
}

export enum WorkerStatus {
  PENDING = "Pendente",
  UNDER_ANALYSIS = "Em Análise",
  APPROVED = "Aprovado",
  BLOCKED = "Bloqueado"
}

export interface TrainingQuiz {
  questionId: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface Worker {
  id: string;
  name: string;
  cpf: string;
  companyName: string;
  companyCnpj: string;
  role: string;
  asoStatus: DocumentStatus;
  asoFileUrl?: string;
  nr10Status: DocumentStatus;
  nr10FileUrl?: string;
  nr35Status: DocumentStatus;
  nr35FileUrl?: string;
  videoWatched: boolean;
  videoWatchedDuration: number; // in seconds, e.g. up to 100 for percentage
  quizCompleted: boolean;
  quizScore?: number;
  qrCodeToken?: string;
}

export interface Company {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  phone: string;
}

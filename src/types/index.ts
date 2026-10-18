export type AppointmentStatus =
  | 'agendado'
  | 'confirmado_whatsapp'
  | 'na_recepcao'
  | 'em_atendimento'
  | 'concluido'
  | 'cancelado';

export interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  cpf: string;
  birthDate: string;
  allergies: string[];
  contraindications: string[];
  notes: string;
  consentSigned: boolean;
  avatarUrl?: string;
  lastVisit?: string;
  totalSpent?: number;
}

export interface Insumo {
  id: string;
  name: string;
  brand: string;
  category: 'toxina' | 'bioestimulador' | 'emagrecimento' | 'descartavel' | 'tecnologia' | 'outro';
  lote: string;
  expiryDate: string;
  quantity: number;
  unit: 'frasco' | 'unidade' | 'ml' | 'ampola' | 'caixa' | 'disparo';
  minThreshold: number;
  costPerUnit: number;
  status: 'normal' | 'alerta' | 'critico';
}

export interface ProcedureInsumoRequirement {
  insumoId: string;
  insumoName: string;
  quantityNeeded: number;
  unit: string;
}

export interface Procedure {
  id: string;
  name: string;
  category: 'Harmonização' | 'Emagrecimento' | 'Tecnologias' | 'Cuidados Faciais';
  durationMinutes: number;
  price: number;
  estimatedCost: number;
  description: string;
  insumos: ProcedureInsumoRequirement[];
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  procedureId: string;
  procedureName: string;
  professional: string;
  room: 'Sala 1 - Injetáveis' | 'Sala 2 - Lasers & Tecnologias' | 'Sala 3 - Cuidados Faciais';
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMinutes: number;
  status: AppointmentStatus;
  notes?: string;
  whatsappStatus: 'pendente' | 'enviado' | 'confirmado_pelo_paciente' | 'falha';
  whatsappSentAt?: string;
  stockDeducted?: boolean;
}

export interface BeforeAfterRecord {
  id: string;
  patientId: string;
  patientName: string;
  procedureName: string;
  date: string;
  area: string;
  beforeImageUrl: string;
  afterImageUrl: string;
  notes: string;
  professional: string;
}

export interface BudgetPaymentOption {
  installments: number;
  installmentValue: number;
  totalValue: number;
  cardFeePercentage: number;
  netValue: number;
}

export interface BudgetItem {
  procedureId: string;
  procedureName: string;
  sessions: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Budget {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  createdAt: string;
  items: BudgetItem[];
  totalGross: number;
  discountPercentage: number;
  totalNet: number;
  status: 'aberto' | 'aprovado' | 'pago' | 'expirado';
  paymentMethod?: 'pix' | 'cartao_credito' | 'dinheiro';
  installments?: number;
  receiptNumber?: string;
}

export interface StockDeductionLog {
  id: string;
  timestamp: string;
  appointmentId: string;
  patientName: string;
  procedureName: string;
  insumoId: string;
  insumoName: string;
  quantityDeducted: number;
  unit: string;
  lote: string;
}

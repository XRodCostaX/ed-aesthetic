'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Appointment,
  Insumo,
  Patient,
  Procedure,
  BeforeAfterRecord,
  Budget,
  StockDeductionLog,
  AppointmentStatus,
} from '@/types';
import {
  INITIAL_APPOINTMENTS,
  INITIAL_INSUMOS,
  INITIAL_PATIENTS,
  INITIAL_PROCEDURES,
  INITIAL_BEFORE_AFTER,
  INITIAL_BUDGETS,
} from '@/data/mockData';

export type NavigationTab =
  | 'dashboard'
  | 'agenda'
  | 'prontuario'
  | 'catalogo'
  | 'orcamentos'
  | 'estoque';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
}

interface AppContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  appointments: Appointment[];
  insumos: Insumo[];
  patients: Patient[];
  procedures: Procedure[];
  beforeAfterRecords: BeforeAfterRecord[];
  budgets: Budget[];
  stockLogs: StockDeductionLog[];
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
  // Actions
  addAppointment: (appointment: Omit<Appointment, 'id' | 'whatsappStatus' | 'stockDeducted'>) => void;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  sendWhatsAppReminder: (appointmentId: string) => void;
  simulatePatientWhatsAppConfirmation: (appointmentId: string) => void;
  completeAppointmentAndDeductStock: (appointmentId: string) => void;
  addStockItem: (item: Omit<Insumo, 'id' | 'status'>) => void;
  adjustStockQuantity: (insumoId: string, delta: number) => void;
  createBudget: (budget: Omit<Budget, 'id' | 'createdAt' | 'status'>) => Budget;
  checkoutBudget: (budgetId: string, paymentMethod: 'pix' | 'cartao_credito' | 'dinheiro', installments?: number) => void;
  selectedPatientId: string;
  setSelectedPatientId: (id: string) => void;
  activeWhatsAppModalAppointment: Appointment | null;
  setActiveWhatsAppModalAppointment: (apt: Appointment | null) => void;
  activeCheckoutBudget: Budget | null;
  setActiveCheckoutBudget: (budget: Budget | null) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTabState] = useState<NavigationTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const setActiveTab = (tab: NavigationTab) => {
    setActiveTabState(tab);
    setIsMobileMenuOpen(false); // auto-close menu on selection
  };
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [insumos, setInsumos] = useState<Insumo[]>(INITIAL_INSUMOS);
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [procedures] = useState<Procedure[]>(INITIAL_PROCEDURES);
  const [beforeAfterRecords, setBeforeAfterRecords] = useState<BeforeAfterRecord[]>(INITIAL_BEFORE_AFTER);
  const [budgets, setBudgets] = useState<Budget[]>(INITIAL_BUDGETS);
  const [stockLogs, setStockLogs] = useState<StockDeductionLog[]>([
    {
      id: 'log-01',
      timestamp: '2026-10-18 11:30',
      appointmentId: 'apt-prev',
      patientName: 'Camila Mendonça Rocha',
      procedureName: 'Harmonização Facial: Toxina Botulínica (3 Áreas)',
      insumoId: 'ins-01',
      insumoName: 'Toxina Botulínica 100U (Botox)',
      quantityDeducted: 0.5,
      unit: 'frasco (50U)',
      lote: 'AL-2024-8891',
    },
  ]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('pat-01');
  const [activeWhatsAppModalAppointment, setActiveWhatsAppModalAppointment] = useState<Appointment | null>(null);
  const [activeCheckoutBudget, setActiveCheckoutBudget] = useState<Budget | null>(null);

  const addToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addAppointment = (newAptData: Omit<Appointment, 'id' | 'whatsappStatus' | 'stockDeducted'>) => {
    const newApt: Appointment = {
      ...newAptData,
      id: `apt-${Date.now().toString().slice(-4)}`,
      whatsappStatus: 'pendente',
      stockDeducted: false,
    };
    setAppointments((prev) => [newApt, ...prev]);
    addToast('success', 'Agendamento Criado', `Horário reservado para ${newApt.patientName}`);
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status } : apt))
    );
    addToast('info', 'Status Atualizado', `Atendimento alterado para "${status.replace('_', ' ')}"`);
  };

  const sendWhatsAppReminder = (appointmentId: string) => {
    const apt = appointments.find((a) => a.id === appointmentId);
    if (!apt) return;

    setActiveWhatsAppModalAppointment(apt);
  };

  const simulatePatientWhatsAppConfirmation = (appointmentId: string) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId
          ? {
              ...apt,
              status: 'confirmado_whatsapp',
              whatsappStatus: 'confirmado_pelo_paciente',
              whatsappSentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : apt
      )
    );
    addToast(
      'success',
      'Confirmação Recebida! 💬',
      'Paciente confirmou a presença via WhatsApp. Sala e insumos garantidos.'
    );
    setActiveWhatsAppModalAppointment(null);
  };

  const completeAppointmentAndDeductStock = (appointmentId: string) => {
    const apt = appointments.find((a) => a.id === appointmentId);
    if (!apt) return;

    if (apt.stockDeducted) {
      updateAppointmentStatus(appointmentId, 'concluido');
      return;
    }

    const procedure = procedures.find((p) => p.id === apt.procedureId);
    if (!procedure) {
      updateAppointmentStatus(appointmentId, 'concluido');
      return;
    }

    // Deduct stock for each requirement
    const newLogs: StockDeductionLog[] = [];
    setInsumos((prevInsumos) => {
      const updated = [...prevInsumos];
      procedure.insumos.forEach((req) => {
        const itemIndex = updated.findIndex((i) => i.id === req.insumoId);
        if (itemIndex >= 0) {
          const item = updated[itemIndex];
          const newQty = Math.max(0, Number((item.quantity - req.quantityNeeded).toFixed(2)));
          let status: Insumo['status'] = 'normal';
          if (newQty <= item.minThreshold / 2) status = 'critico';
          else if (newQty <= item.minThreshold) status = 'alerta';

          updated[itemIndex] = {
            ...item,
            quantity: newQty,
            status,
          };

          newLogs.push({
            id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            timestamp: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
            appointmentId: apt.id,
            patientName: apt.patientName,
            procedureName: apt.procedureName,
            insumoId: item.id,
            insumoName: item.name,
            quantityDeducted: req.quantityNeeded,
            unit: req.unit,
            lote: item.lote,
          });
        }
      });
      return updated;
    });

    setStockLogs((prev) => [...newLogs, ...prev]);

    setAppointments((prev) =>
      prev.map((a) =>
        a.id === appointmentId ? { ...a, status: 'concluido', stockDeducted: true } : a
      )
    );

    addToast(
      'success',
      'Procedimento Concluído & Estoque Abatido! 🛡️',
      `Insumos de "${procedure.name}" foram baixados com rastreabilidade de lote.`
    );
  };

  const addStockItem = (itemData: Omit<Insumo, 'id' | 'status'>) => {
    let status: Insumo['status'] = 'normal';
    if (itemData.quantity <= itemData.minThreshold / 2) status = 'critico';
    else if (itemData.quantity <= itemData.minThreshold) status = 'alerta';

    const newItem: Insumo = {
      ...itemData,
      id: `ins-${Date.now().toString().slice(-4)}`,
      status,
    };
    setInsumos((prev) => [newItem, ...prev]);
    addToast('success', 'Novo Lote Cadastrado', `${newItem.name} adicionado ao estoque.`);
  };

  const adjustStockQuantity = (insumoId: string, delta: number) => {
    setInsumos((prev) =>
      prev.map((item) => {
        if (item.id === insumoId) {
          const newQty = Math.max(0, item.quantity + delta);
          let status: Insumo['status'] = 'normal';
          if (newQty <= item.minThreshold / 2) status = 'critico';
          else if (newQty <= item.minThreshold) status = 'alerta';
          return { ...item, quantity: newQty, status };
        }
        return item;
      })
    );
    addToast('info', 'Estoque Ajustado', `Quantidade atualizada com sucesso.`);
  };

  const createBudget = (budgetData: Omit<Budget, 'id' | 'createdAt' | 'status'>): Budget => {
    const newBudget: Budget = {
      ...budgetData,
      id: `orc-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'aberto',
    };
    setBudgets((prev) => [newBudget, ...prev]);
    addToast('success', 'Orçamento Criado', `Plano para ${newBudget.patientName} pronto para envio.`);
    return newBudget;
  };

  const checkoutBudget = (
    budgetId: string,
    paymentMethod: 'pix' | 'cartao_credito' | 'dinheiro',
    installments: number = 1
  ) => {
    const receiptNum = `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setBudgets((prev) =>
      prev.map((b) =>
        b.id === budgetId
          ? {
              ...b,
              status: 'pago',
              paymentMethod,
              installments,
              receiptNumber: receiptNum,
            }
          : b
      )
    );
    addToast('success', 'Pagamento Confirmado! 💳', `Recibo ${receiptNum} emitido com sucesso.`);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        appointments,
        insumos,
        patients,
        procedures,
        beforeAfterRecords,
        budgets,
        stockLogs,
        toasts,
        addToast,
        removeToast,
        addAppointment,
        updateAppointmentStatus,
        sendWhatsAppReminder,
        simulatePatientWhatsAppConfirmation,
        completeAppointmentAndDeductStock,
        addStockItem,
        adjustStockQuantity,
        createBudget,
        checkoutBudget,
        selectedPatientId,
        setSelectedPatientId,
        activeWhatsAppModalAppointment,
        setActiveWhatsAppModalAppointment,
        activeCheckoutBudget,
        setActiveCheckoutBudget,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

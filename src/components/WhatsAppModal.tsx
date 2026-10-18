'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  X,
  Send,
  CheckCheck,
  Calendar,
  Clock,
  Sparkles,
  Copy,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';

export default function WhatsAppModal() {
  const {
    activeWhatsAppModalAppointment,
    setActiveWhatsAppModalAppointment,
    simulatePatientWhatsAppConfirmation,
    updateAppointmentStatus,
    addToast,
  } = useApp();

  const [copied, setCopied] = useState(false);

  if (!activeWhatsAppModalAppointment) return null;

  const apt = activeWhatsAppModalAppointment;

  const messageText = `Olá, *${apt.patientName}*! Tudo bem? ✨\n\nAqui é da clínica *Ed Aesthetic* da *Dra. Edilaine*.\n\nPassando para confirmar o seu horário:\n🗓 *Data:* ${apt.date.split('-').reverse().join('/')}\n⏰ *Horário:* ${apt.time}\n💉 *Procedimento:* ${apt.procedureName}\n📍 *Local:* Ed Aesthetic - Sala de Procedimentos\n\nPor favor, toque em um dos botões abaixo para confirmar seu atendimento ou nos avisar:`;

  const copyMessage = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    addToast('success', 'Mensagem Copiada', 'Texto pronto para colar no WhatsApp!');
    setTimeout(() => setCopied(false), 2500);
  };

  const openWhatsAppDirect = () => {
    const rawNumber = apt.patientPhone.replace(/\D/g, '');
    const cleanNumber = rawNumber.length === 11 ? `55${rawNumber}` : rawNumber;
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(messageText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden border border-stone-200">
        {/* Header */}
        <div className="bg-[#075E54] text-white p-3.5 sm:p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-white font-bold ring-2 ring-emerald-300/40">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Disparo de Lembrete WhatsApp</h3>
              <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                Automação Anti No-Show • Ed Aesthetic
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveWhatsAppModalAppointment(null)}
            className="text-emerald-100 hover:text-white p-1 rounded-full hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* WhatsApp Chat Simulation */}
        <div className="p-3 sm:p-4 bg-[#EFEAE2] flex-1 overflow-y-auto min-h-[200px] flex flex-col justify-end space-y-3">
          <div className="text-center">
            <span className="text-[10px] bg-white/80 backdrop-blur text-stone-600 px-3 py-1 rounded-full shadow-xs">
              Hoje às {apt.time}
            </span>
          </div>

          {/* Outgoing Message Bubble */}
          <div className="bg-[#D9FDD3] self-end p-3.5 rounded-2xl rounded-tr-xs shadow-sm max-w-[90%] text-stone-800 text-xs leading-relaxed space-y-2 border border-emerald-100">
            <p className="font-medium text-stone-900">
              Olá, <span className="font-bold">{apt.patientName}</span>! Tudo bem? ✨
            </p>
            <p>
              Aqui é da clínica <span className="font-bold">Ed Aesthetic</span> da Dra. Edilaine.
            </p>
            <div className="bg-white/70 p-2.5 rounded-xl space-y-1 text-[11px] border border-emerald-200/50">
              <div className="flex items-center gap-1.5 text-stone-700">
                <Calendar className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>{apt.date.split('-').reverse().join('/')}</span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-700">
                <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>{apt.time} ({apt.durationMinutes} min)</span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-700">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="font-semibold">{apt.procedureName}</span>
              </div>
            </div>
            <p className="text-[11px] text-stone-600">
              Por favor, toque abaixo para confirmar sua presença ou solicitar alteração:
            </p>

            {/* Simulated Interactive WhatsApp Quick Buttons */}
            <div className="pt-2 border-t border-emerald-200/60 space-y-1.5">
              <div className="w-full py-1.5 px-3 bg-white text-[#00A884] font-semibold text-center rounded-lg shadow-2xs text-[11px] border border-[#00A884]/30">
                ✅ [Confirmar Presença]
              </div>
              <div className="w-full py-1.5 px-3 bg-white text-stone-700 font-medium text-center rounded-lg shadow-2xs text-[11px] border border-stone-200">
                🔄 [Solicitar Reagendamento]
              </div>
            </div>

            <div className="text-right text-[10px] text-emerald-800/80 flex items-center justify-end gap-1 pt-1">
              <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <CheckCheck className="w-3.5 h-3.5 text-blue-500 inline" />
            </div>
          </div>
        </div>

        {/* Action Controls for Testing */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 space-y-3">
          <div className="text-xs font-semibold text-stone-700 flex items-center justify-between">
            <span>Ações de Demonstração / Teste</span>
            <span className="text-[10px] text-stone-500 font-normal">
              Paciente: {apt.patientPhone}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => simulatePatientWhatsAppConfirmation(apt.id)}
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition shadow-sm"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Simular: Paciente Confirmou</span>
            </button>

            <button
              onClick={() => {
                updateAppointmentStatus(apt.id, 'agendado');
                addToast('info', 'Solicitação de Reagendamento', 'Paciente informou necessidade de novo horário.');
                setActiveWhatsAppModalAppointment(null);
              }}
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-stone-200 text-stone-800 rounded-xl text-xs font-medium hover:bg-stone-300 transition"
            >
              <span>Simular Reagendamento</span>
            </button>
          </div>

          <div className="flex items-center gap-2 pt-1 border-t border-stone-200/80">
            <button
              onClick={copyMessage}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-100 transition"
            >
              <Copy className="w-3.5 h-3.5 text-stone-500" />
              <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
            </button>
            <button
              onClick={openWhatsAppDirect}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-300 rounded-lg hover:bg-emerald-100 transition"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
              <span>Enviar via WhatsApp Real</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

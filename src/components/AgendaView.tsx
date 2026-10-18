'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Search,
  Filter,
  User,
  Sparkles,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import { AppointmentStatus } from '@/types';

export default function AgendaView() {
  const {
    appointments,
    procedures,
    patients,
    addAppointment,
    updateAppointmentStatus,
    sendWhatsAppReminder,
    completeAppointmentAndDeductStock,
    setSelectedPatientId,
    setActiveTab,
  } = useApp();

  const [selectedRoom, setSelectedRoom] = useState<string>('todas');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isNewModalOpen, setIsNewModalOpen] = useState<boolean>(false);

  // New appointment form state
  const [newPatientName, setNewPatientName] = useState<string>('');
  const [newPatientPhone, setNewPatientPhone] = useState<string>('(11) 9');
  const [newProcedureId, setNewProcedureId] = useState<string>(procedures[0]?.id || '');
  const [newDate, setNewDate] = useState<string>('2026-10-18');
  const [newTime, setNewTime] = useState<string>('16:00');
  const [newRoom, setNewRoom] = useState<
    'Sala 1 - Injetáveis' | 'Sala 2 - Lasers & Tecnologias' | 'Sala 3 - Cuidados Faciais'
  >('Sala 1 - Injetáveis');
  const [newNotes, setNewNotes] = useState<string>('');

  const filteredAppointments = appointments.filter((apt) => {
    if (selectedRoom !== 'todas' && apt.room !== selectedRoom) return false;
    if (selectedStatus !== 'todos' && apt.status !== selectedStatus) return false;
    if (
      searchQuery &&
      !apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !apt.procedureName.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const proc = procedures.find((p) => p.id === newProcedureId);
    if (!proc) return;

    addAppointment({
      patientId: `pat-${Date.now().toString().slice(-4)}`,
      patientName: newPatientName,
      patientPhone: newPatientPhone,
      procedureId: proc.id,
      procedureName: proc.name,
      professional: 'Dra. Edilaine',
      room: newRoom,
      date: newDate,
      time: newTime,
      durationMinutes: proc.durationMinutes,
      status: 'agendado',
      notes: newNotes,
    });

    setIsNewModalOpen(false);
    setNewPatientName('');
    setNewNotes('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-serif font-bold text-stone-900">
              Agenda Visual & Gestão de Salas
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
              WhatsApp Anti No-Show Ativo
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Visualização dos horários, profissionais e status de confirmação dos pacientes
          </p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-stone-900 to-stone-800 text-stone-100 font-semibold text-xs rounded-xl hover:from-black hover:to-stone-900 transition shadow-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>Novo Agendamento</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Room filter */}
          <div className="flex items-center gap-1.5 text-xs text-stone-600 bg-stone-100/80 p-1 rounded-xl overflow-x-auto max-w-full">
            <button
              onClick={() => setSelectedRoom('todas')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedRoom === 'todas'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Todas as Salas
            </button>
            <button
              onClick={() => setSelectedRoom('Sala 1 - Injetáveis')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedRoom === 'Sala 1 - Injetáveis'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Sala 1 (Injetáveis)
            </button>
            <button
              onClick={() => setSelectedRoom('Sala 2 - Lasers & Tecnologias')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedRoom === 'Sala 2 - Lasers & Tecnologias'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Sala 2 (Lasers)
            </button>
            <button
              onClick={() => setSelectedRoom('Sala 3 - Cuidados Faciais')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedRoom === 'Sala 3 - Cuidados Faciais'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Sala 3 (Faciais)
            </button>
          </div>

          {/* Status selector */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs bg-stone-100/80 border border-stone-200 text-stone-700 rounded-xl px-3 py-2 font-medium focus:outline-none"
          >
            <option value="todos">Todos os Status</option>
            <option value="confirmado_whatsapp">Confirmados WhatsApp</option>
            <option value="agendado">Aguardando Confirmação</option>
            <option value="na_recepcao">Na Recepção</option>
            <option value="concluido">Concluídos</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-60">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filtrar por paciente ou serviço..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500/50"
          />
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-3">
        {filteredAppointments.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-stone-200 text-stone-500 text-xs">
            Nenhum agendamento encontrado para os filtros selecionados.
          </div>
        ) : (
          filteredAppointments.map((apt) => {
            const isCompleted = apt.status === 'concluido';

            return (
              <div
                key={apt.id}
                className={`bg-white rounded-3xl p-5 border transition-all duration-200 shadow-xs hover:shadow-md ${
                  isCompleted
                    ? 'border-stone-200 bg-stone-50/50 opacity-90'
                    : 'border-stone-200/90 hover:border-amber-400/70'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Time + Info */}
                  <div className="flex items-start gap-4">
                    {/* Time Box */}
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-950 flex flex-col items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-amber-700 mb-0.5" />
                      <span className="font-bold text-sm">{apt.time}</span>
                      <span className="text-[10px] text-amber-800 font-medium">
                        {apt.durationMinutes} min
                      </span>
                    </div>

                    {/* Details */}
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-serif font-bold text-base text-stone-900">
                          {apt.patientName}
                        </span>

                        {/* Status Pills */}
                        {apt.status === 'confirmado_whatsapp' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Confirmado via WhatsApp
                          </span>
                        )}
                        {apt.status === 'agendado' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-800 border border-amber-200">
                            Aguardando Confirmação
                          </span>
                        )}
                        {apt.status === 'na_recepcao' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300 animate-pulse">
                            Paciente na Recepção
                          </span>
                        )}
                        {apt.status === 'concluido' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 text-stone-600 border border-stone-200">
                            Atendimento Concluído
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs font-semibold text-stone-700">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>{apt.procedureName}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-stone-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-stone-400" />
                          {apt.room}
                        </span>
                        <span>•</span>
                        <span>Profissional: {apt.professional}</span>
                        <span>•</span>
                        <span>WhatsApp: {apt.patientPhone}</span>
                      </div>

                      {apt.notes && (
                        <p className="text-[11px] text-stone-500 italic bg-stone-50 p-1.5 rounded-lg border border-stone-100 mt-1">
                          Obs: {apt.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions Right Side */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-stone-100">
                    {/* Send WhatsApp Reminder */}
                    <button
                      onClick={() => sendWhatsAppReminder(apt.id)}
                      className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 text-xs font-medium flex items-center gap-1.5 transition"
                      title="Disparar confirmação automática via WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Lembrete WhatsApp</span>
                    </button>

                    {/* Reception check-in */}
                    {apt.status !== 'na_recepcao' && apt.status !== 'concluido' && (
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, 'na_recepcao')}
                        className="px-3 py-2 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 text-xs font-medium transition"
                      >
                        Chegou na Recepção
                      </button>
                    )}

                    {/* Conclude and Deduct Stock */}
                    {!isCompleted ? (
                      <button
                        onClick={() => completeAppointmentAndDeductStock(apt.id)}
                        className="px-3.5 py-2 rounded-xl bg-stone-900 text-white hover:bg-black text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                        <span>Concluir & Baixar Insumos</span>
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-700 font-semibold px-3 py-2 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Insumos Baixados
                      </span>
                    )}

                    {/* Go to patient chart */}
                    <button
                      onClick={() => {
                        setSelectedPatientId(apt.patientId);
                        setActiveTab('prontuario');
                      }}
                      className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition"
                      title="Abrir Prontuário e Fotos"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: New Appointment */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden border border-stone-200">
            <div className="bg-stone-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif font-bold text-base text-amber-100">
                  Agendar Novo Atendimento
                </h3>
              </div>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-stone-400 hover:text-white p-1 rounded-full"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="p-4 sm:p-6 space-y-4 text-xs overflow-y-auto">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Nome da Paciente:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Beatriz Martins"
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    WhatsApp (com DDD):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="(11) 98888-7777"
                    value={newPatientPhone}
                    onChange={(e) => setNewPatientPhone(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    Horário:
                  </label>
                  <input
                    type="time"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Procedimento:
                </label>
                <select
                  value={newProcedureId}
                  onChange={(e) => setNewProcedureId(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 text-stone-900"
                >
                  {procedures.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.durationMinutes} min) - R$ {p.price.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    Sala / Cabine:
                  </label>
                  <select
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value as any)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="Sala 1 - Injetáveis">Sala 1 - Injetáveis</option>
                    <option value="Sala 2 - Lasers & Tecnologias">Sala 2 - Lasers</option>
                    <option value="Sala 3 - Cuidados Faciais">Sala 3 - Cuidados Faciais</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    Data:
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Observações Clínicas / Preferências:
                </label>
                <textarea
                  rows={2}
                  placeholder="Informações relevantes para o atendimento..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-stone-900 to-stone-800 text-white font-semibold rounded-xl text-xs hover:bg-black transition shadow-md"
                >
                  Confirmar e Salvar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  TrendingUp,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Clock,
  Sparkles,
  MessageCircle,
  ShieldCheck,
  ChevronRight,
  DollarSign,
  Calendar,
} from 'lucide-react';

export default function DashboardView() {
  const {
    setActiveTab,
    appointments,
    insumos,
    procedures,
    budgets,
    sendWhatsAppReminder,
    completeAppointmentAndDeductStock,
    setSelectedPatientId,
  } = useApp();

  const todayAppointments = appointments.filter((a) => a.date === '2026-10-18');
  const criticalInsumos = insumos.filter((i) => i.status === 'critico');
  const totalRevenueToday = budgets
    .filter((b) => b.status === 'pago')
    .reduce((acc, curr) => acc + curr.totalNet, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner with Dra. Edilaine Welcome */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-stone-800">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-amber-500/15 to-transparent pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Painel Executivo • Ed Aesthetic</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100">
              Bem-vinda, Dra. Edilaine
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm max-w-xl leading-relaxed">
              Sistema integrado ativo. Seus insumos de alto custo estão protegidos por baixa automática e as confirmações via WhatsApp estão reduzindo faltas hoje.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('agenda')}
              className="px-4 py-2.5 bg-amber-400 text-stone-950 font-semibold text-xs rounded-xl hover:bg-amber-300 transition shadow-md flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Ver Agenda do Dia ({todayAppointments.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('orcamentos')}
              className="px-4 py-2.5 bg-stone-800/80 text-stone-200 border border-stone-700 font-medium text-xs rounded-xl hover:bg-stone-700 transition flex items-center gap-2"
            >
              <span>Gerar Novo Orçamento</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Faturamento do Dia
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-serif font-bold text-stone-900">
              R$ {totalRevenueToday > 0 ? totalRevenueToday.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '4.417,50'}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18% em relação à semana passada</span>
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Pacientes Hoje
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-serif font-bold text-stone-900">
              {todayAppointments.length} Agendamentos
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-stone-500">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>1 em atendimento • 1 na recepção</span>
            </div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Confirmação WhatsApp
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-serif font-bold text-stone-900">
              94.2% Confirmados
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Taxa de falta (no-show) zerada</span>
            </div>
          </div>
        </div>

        {/* KPI 4 */}
        <div
          onClick={() => setActiveTab('estoque')}
          className={`p-5 rounded-2xl border transition cursor-pointer ${
            criticalInsumos.length > 0
              ? 'bg-rose-50/60 border-rose-200 hover:bg-rose-50'
              : 'bg-white border-stone-200/80 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Estoque Crítico
            </span>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                criticalInsumos.length > 0
                  ? 'bg-rose-100 text-rose-700 animate-pulse'
                  : 'bg-stone-100 text-stone-600'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div
              className={`text-2xl font-serif font-bold ${
                criticalInsumos.length > 0 ? 'text-rose-900' : 'text-stone-900'
              }`}
            >
              {criticalInsumos.length} Insumos
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-rose-600 font-medium">
              <span>Dysport e Agulhas Lebel em reposição</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Schedule Today & Rentability Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Today's Schedule */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-base">
                Fila de Atendimento do Dia
              </h3>
              <p className="text-xs text-stone-500">
                Atendimentos em andamento e próximos pacientes agendados
              </p>
            </div>
            <button
              onClick={() => setActiveTab('agenda')}
              className="text-xs text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1"
            >
              <span>Abrir Agenda Completa</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {todayAppointments.map((apt) => {
              let statusBadge = (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-700 border border-stone-200">
                  Agendado
                </span>
              );

              if (apt.status === 'confirmado_whatsapp') {
                statusBadge = (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Confirmado WhatsApp
                  </span>
                );
              } else if (apt.status === 'na_recepcao') {
                statusBadge = (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 animate-pulse">
                    Na Recepção
                  </span>
                );
              } else if (apt.status === 'concluido') {
                statusBadge = (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-500">
                    Concluído & Baixado
                  </span>
                );
              }

              return (
                <div
                  key={apt.id}
                  className="p-4 rounded-2xl border border-stone-200/90 hover:border-amber-400/60 transition bg-stone-50/40 hover:bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-100/60 text-amber-900 flex flex-col items-center justify-center shrink-0 border border-amber-200/60 font-semibold text-xs">
                      <Clock className="w-3.5 h-3.5 text-amber-700 mb-0.5" />
                      <span>{apt.time}</span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs sm:text-sm text-stone-900 truncate">
                          {apt.patientName}
                        </span>
                        {statusBadge}
                      </div>

                      <div className="text-xs text-stone-600 font-medium mt-0.5 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
                        <span className="truncate">{apt.procedureName}</span>
                      </div>

                      <div className="text-[11px] text-stone-400 mt-1">
                        {apt.room} • Dra. Edilaine ({apt.durationMinutes} min)
                      </div>
                    </div>
                  </div>

                  {/* Quick Action buttons */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {apt.status !== 'concluido' ? (
                      <>
                        <button
                          onClick={() => sendWhatsAppReminder(apt.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 text-xs font-medium flex items-center gap-1 transition"
                          title="Enviar lembrete via WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="hidden sm:inline">WhatsApp</span>
                        </button>

                        <button
                          onClick={() => completeAppointmentAndDeductStock(apt.id)}
                          className="px-3 py-1.5 rounded-lg bg-stone-900 text-white hover:bg-black text-xs font-semibold flex items-center gap-1 transition shadow-xs"
                          title="Finalizar atendimento e baixar insumos"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                          <span>Finalizar & Baixar</span>
                        </button>
                      </>
                    ) : (
                      <span className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                        Insumos Abatidos ✓
                      </span>
                    )}

                    <button
                      onClick={() => {
                        setSelectedPatientId(apt.patientId);
                        setActiveTab('prontuario');
                      }}
                      className="p-1.5 text-stone-400 hover:text-stone-800 transition"
                      title="Ver Prontuário"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: High Precision Margins & Insumos Shielding */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-5">
          <div>
            <h3 className="font-serif font-bold text-stone-900 text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Margem de Contribuição Real
            </h3>
            <p className="text-xs text-stone-500">
              Lucro líquido deduzindo o custo exato dos insumos aplicados
            </p>
          </div>

          <div className="space-y-3">
            {procedures.slice(0, 4).map((proc) => {
              const profit = proc.price - proc.estimatedCost;
              const marginPercent = Math.round((profit / proc.price) * 100);

              return (
                <div key={proc.id} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-stone-900 line-clamp-1">
                      {proc.name}
                    </span>
                    <span className="font-bold text-emerald-700 shrink-0 ml-2">
                      {marginPercent}% margem
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-600 pt-1 border-t border-stone-200/60">
                    <div>
                      <span>Preço Cobrado: </span>
                      <strong className="text-stone-800">R$ {proc.price.toFixed(2)}</strong>
                    </div>
                    <div>
                      <span>Custo Insumos: </span>
                      <strong className="text-rose-700">R$ {proc.estimatedCost.toFixed(2)}</strong>
                    </div>
                  </div>

                  <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-1.5 rounded-full"
                      style={{ width: `${marginPercent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setActiveTab('catalogo')}
            className="w-full py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition text-center"
          >
            Ver Fichas Técnicas dos Insumos
          </button>
        </div>
      </div>
    </div>
  );
}

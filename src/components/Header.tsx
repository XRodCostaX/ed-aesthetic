'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Bell, Sparkles, Plus, Search, CalendarCheck } from 'lucide-react';

export default function Header() {
  const { setActiveTab, insumos, appointments } = useApp();

  const criticalStockCount = insumos.filter((i) => i.status === 'critico').length;
  const todayAppointmentsCount = appointments.filter((a) => a.date === '2026-10-18').length;

  return (
    <header className="h-18 bg-white/90 backdrop-blur-md border-b border-stone-200/80 px-6 flex items-center justify-between sticky top-0 z-30 transition-all">
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-serif font-bold tracking-tight text-stone-900">
              Ed Aesthetic
            </h1>
            <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-100/70 text-amber-900 border border-amber-200">
              Premium MVP
            </span>
          </div>
          <p className="text-xs text-stone-500 font-sans">
            Clínica Integrada de Harmonização, Tecnologias & Emagrecimento
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Search */}
        <div className="relative hidden md:block w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar paciente, prontuário..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-full bg-stone-100/80 border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500/50 text-stone-800 placeholder-stone-400"
          />
        </div>

        {/* Stock Alert Badge Button */}
        {criticalStockCount > 0 && (
          <button
            onClick={() => setActiveTab('estoque')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors animate-pulse"
            title="Clique para ver o estoque crítico"
          >
            <span className="w-2 h-2 rounded-full bg-rose-600"></span>
            <span>{criticalStockCount} insumo(s) crítico(s)</span>
          </button>
        )}

        {/* Quick Action: New Appointment */}
        <button
          onClick={() => setActiveTab('agenda')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-stone-900 to-stone-800 text-stone-100 hover:from-black hover:to-stone-900 transition-all shadow-sm"
        >
          <Plus className="w-3.5 h-3.5 text-amber-300" />
          <span>Agendar Horário</span>
        </button>

        {/* Profile Card */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-stone-200">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1594824813511-68c1737e8c33?auto=format&fit=crop&w=120&q=80"
              alt="Dra. Edilaine"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-amber-400/50"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-semibold text-stone-900 flex items-center gap-1">
              Dra. Edilaine
              <Sparkles className="w-3 h-3 text-amber-500 inline" />
            </div>
            <div className="text-[11px] text-stone-500">Responsável Técnica</div>
          </div>
        </div>
      </div>
    </header>
  );
}

'use client';

import React from 'react';
import { useApp, NavigationTab } from '@/context/AppContext';
import {
  LayoutDashboard,
  CalendarDays,
  FileText,
  Sparkles,
  CreditCard,
  Boxes,
  ShieldCheck,
  TrendingUp,
  X,
} from 'lucide-react';

interface NavItem {
  id: NavigationTab;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
}

export default function Sidebar() {
  const {
    activeTab,
    setActiveTab,
    insumos,
    appointments,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  } = useApp();

  const criticalStockCount = insumos.filter((i) => i.status === 'critico').length;
  const pendingApts = appointments.filter((a) => a.whatsappStatus === 'pendente').length;

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Visão Geral',
      sublabel: 'Métricas & Faturamento',
      icon: LayoutDashboard,
    },
    {
      id: 'agenda',
      label: 'Agenda & Salas',
      sublabel: 'Calendário & WhatsApp',
      icon: CalendarDays,
      badge: pendingApts > 0 ? `${pendingApts}` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    {
      id: 'prontuario',
      label: 'Prontuário & Avaliação',
      sublabel: 'Fotos Antes & Depois',
      icon: FileText,
    },
    {
      id: 'catalogo',
      label: 'Catálogo de Serviços',
      sublabel: 'Fichas Técnicas (BOM)',
      icon: Sparkles,
    },
    {
      id: 'orcamentos',
      label: 'Orçamentos & Checkout',
      sublabel: 'Simulador & Recibos',
      icon: CreditCard,
    },
    {
      id: 'estoque',
      label: 'Estoque de Precisão',
      sublabel: 'Lotes, Validade & Baixas',
      icon: Boxes,
      badge: criticalStockCount > 0 ? `${criticalStockCount}` : undefined,
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    },
  ];

  const renderNavContent = () => (
    <>
      <div>
        {/* Brand Header */}
        <div className="p-5 sm:p-6 border-b border-stone-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-950/40 shrink-0">
              <span className="font-serif text-stone-950 font-black text-xl">Ed</span>
            </div>
            <div>
              <div className="font-serif font-bold text-base text-amber-200 tracking-wide">
                Ed Aesthetic
              </div>
              <div className="text-[10px] tracking-widest uppercase text-stone-400 font-medium">
                Clinical ERP & CRM
              </div>
            </div>
          </div>

          {/* Close button inside mobile drawer */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-2 text-[10px] uppercase font-bold tracking-wider text-stone-400">
            Módulos do Sistema
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent text-amber-300 font-medium border-l-2 border-amber-400'
                    : 'text-stone-300 hover:bg-stone-800/60 hover:text-white'
                }`}
              >
                <Icon
                  className={`w-5 h-5 mt-0.5 shrink-0 transition-transform duration-200 ${
                    isActive ? 'text-amber-400 scale-105' : 'text-stone-400 group-hover:text-stone-200'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium tracking-tight truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold border ${item.badgeColor}`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[10px] block truncate ${
                      isActive ? 'text-amber-400/80' : 'text-stone-400'
                    }`}
                  >
                    {item.sublabel}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Strategic Clinic Card Footer */}
      <div className="p-4 m-3 rounded-2xl bg-gradient-to-b from-stone-900 to-stone-950 border border-stone-800/90 shadow-inner">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-stone-200">Blindagem de Lucro</span>
        </div>
        <p className="text-[11px] text-stone-400 leading-snug">
          Baixa automática de ampolas e toxinas vinculada a cada atendimento.
        </p>

        <div className="mt-3 pt-3 border-t border-stone-800 flex items-center justify-between text-[11px]">
          <span className="text-stone-400">Confirmação WhatsApp:</span>
          <span className="font-semibold text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 inline" /> 94%
          </span>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* 1. Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-68 bg-[#181615] text-stone-200 flex-col justify-between shrink-0 border-r border-stone-800 min-h-screen sticky top-0 h-screen overflow-y-auto">
        {renderNavContent()}
      </aside>

      {/* 2. Mobile Off-Canvas Drawer (Slide-Over) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-4/5 max-w-xs bg-[#181615] text-stone-200 flex flex-col justify-between z-10 shadow-2xl h-full overflow-y-auto animate-in slide-in-from-left duration-200">
            {renderNavContent()}
          </div>
        </div>
      )}

      {/* 3. Mobile Bottom Navigation Bar (Ultra-responsive quick bar) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#181615]/95 backdrop-blur-lg border-t border-stone-800/90 flex justify-around items-center py-2 px-1 text-stone-400 shadow-xl">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 p-1.5 transition ${
            activeTab === 'dashboard' ? 'text-amber-400 font-bold' : 'hover:text-stone-200'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="text-[10px]">Início</span>
        </button>

        <button
          onClick={() => setActiveTab('agenda')}
          className={`flex flex-col items-center gap-1 p-1.5 transition relative ${
            activeTab === 'agenda' ? 'text-amber-400 font-bold' : 'hover:text-stone-200'
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          <span className="text-[10px]">Agenda</span>
          {pendingApts > 0 && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-amber-400" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('prontuario')}
          className={`flex flex-col items-center gap-1 p-1.5 transition ${
            activeTab === 'prontuario' ? 'text-amber-400 font-bold' : 'hover:text-stone-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span className="text-[10px]">Prontuário</span>
        </button>

        <button
          onClick={() => setActiveTab('orcamentos')}
          className={`flex flex-col items-center gap-1 p-1.5 transition ${
            activeTab === 'orcamentos' ? 'text-amber-400 font-bold' : 'hover:text-stone-200'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span className="text-[10px]">Orçamentos</span>
        </button>

        <button
          onClick={() => setActiveTab('estoque')}
          className={`flex flex-col items-center gap-1 p-1.5 transition relative ${
            activeTab === 'estoque' ? 'text-amber-400 font-bold' : 'hover:text-stone-200'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span className="text-[10px]">Estoque</span>
          {criticalStockCount > 0 && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          )}
        </button>
      </nav>
    </>
  );
}

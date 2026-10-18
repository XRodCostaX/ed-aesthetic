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
  MessageSquare,
  TrendingUp,
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
  const { activeTab, setActiveTab, insumos, appointments } = useApp();

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
      sublabel: 'Calendário & Lembretes WhatsApp',
      icon: CalendarDays,
      badge: pendingApts > 0 ? `${pendingApts} pendentes` : undefined,
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
      sublabel: 'Fichas Técnicas de Insumos',
      icon: Sparkles,
    },
    {
      id: 'orcamentos',
      label: 'Orçamentos & Checkout',
      sublabel: 'Simulador Maquininha & Recibos',
      icon: CreditCard,
    },
    {
      id: 'estoque',
      label: 'Estoque de Alta Precisão',
      sublabel: 'Lotes, Validade & Baixas',
      icon: Boxes,
      badge: criticalStockCount > 0 ? `${criticalStockCount} alertas` : undefined,
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    },
  ];

  return (
    <aside className="w-68 bg-[#181615] text-stone-200 flex flex-col justify-between shrink-0 border-r border-stone-800 min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-stone-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-950/40">
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
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-2 text-[10px] uppercase font-bold tracking-wider text-stone-400">
            Navegação Principal
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
    </aside>
  );
}

'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import DashboardView from '@/components/DashboardView';
import AgendaView from '@/components/AgendaView';
import ProntuarioView from '@/components/ProntuarioView';
import CatalogoView from '@/components/CatalogoView';
import OrcamentoCheckoutView from '@/components/OrcamentoCheckoutView';
import EstoqueView from '@/components/EstoqueView';
import WhatsAppModal from '@/components/WhatsAppModal';
import CheckoutModal from '@/components/CheckoutModal';
import ToastContainer from '@/components/ToastContainer';

export default function Home() {
  const { activeTab } = useApp();

  return (
    <div className="flex min-h-screen bg-[#FAF9F6] text-stone-800 antialiased font-sans selection:bg-amber-200 selection:text-stone-900">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-3 sm:p-6 lg:p-8 pb-24 lg:pb-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'agenda' && <AgendaView />}
          {activeTab === 'prontuario' && <ProntuarioView />}
          {activeTab === 'catalogo' && <CatalogoView />}
          {activeTab === 'orcamentos' && <OrcamentoCheckoutView />}
          {activeTab === 'estoque' && <EstoqueView />}
        </main>
      </div>

      {/* Modals & Overlays */}
      <WhatsAppModal />
      <CheckoutModal />
      <ToastContainer />
    </div>
  );
}

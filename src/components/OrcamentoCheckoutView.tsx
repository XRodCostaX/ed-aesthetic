'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  FileSpreadsheet,
  Plus,
  Trash2,
  Percent,
  CreditCard,
  CheckCircle2,
  Share2,
  Sparkles,
  ArrowRight,
  Clock,
  Printer,
  ChevronRight,
} from 'lucide-react';
import { BudgetItem } from '@/types';

export default function OrcamentoCheckoutView() {
  const {
    budgets,
    patients,
    procedures,
    createBudget,
    setActiveCheckoutBudget,
    addToast,
  } = useApp();

  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');
  const [selectedItems, setSelectedItems] = useState<BudgetItem[]>([
    {
      procedureId: procedures[0]?.id || '',
      procedureName: procedures[0]?.name || '',
      sessions: 1,
      unitPrice: procedures[0]?.price || 1350,
      totalPrice: procedures[0]?.price || 1350,
    },
  ]);
  const [discountPercent, setDiscountPercent] = useState<number>(5);

  const addItemToNewBudget = () => {
    const defaultProc = procedures[0];
    if (!defaultProc) return;
    setSelectedItems((prev) => [
      ...prev,
      {
        procedureId: defaultProc.id,
        procedureName: defaultProc.name,
        sessions: 1,
        unitPrice: defaultProc.price,
        totalPrice: defaultProc.price,
      },
    ]);
  };

  const updateItemProcedure = (index: number, procedureId: string) => {
    const proc = procedures.find((p) => p.id === procedureId);
    if (!proc) return;
    setSelectedItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        procedureId: proc.id,
        procedureName: proc.name,
        unitPrice: proc.price,
        totalPrice: proc.price * updated[index].sessions,
      };
      return updated;
    });
  };

  const updateItemSessions = (index: number, sessions: number) => {
    const validSessions = Math.max(1, sessions);
    setSelectedItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        sessions: validSessions,
        totalPrice: updated[index].unitPrice * validSessions,
      };
      return updated;
    });
  };

  const removeItem = (index: number) => {
    if (selectedItems.length <= 1) return;
    setSelectedItems((prev) => prev.filter((_, i) => i !== index));
  };

  const grossTotal = selectedItems.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const netTotal = grossTotal * (1 - discountPercent / 100);

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === selectedPatientId);
    if (!patient) return;

    const newBudget = createBudget({
      patientId: patient.id,
      patientName: patient.name,
      patientPhone: patient.phone,
      items: selectedItems,
      totalGross: grossTotal,
      discountPercentage: discountPercent,
      totalNet: netTotal,
    });

    // Reset items to initial
    setSelectedItems([
      {
        procedureId: procedures[0]?.id || '',
        procedureName: procedures[0]?.name || '',
        sessions: 1,
        unitPrice: procedures[0]?.price || 1350,
        totalPrice: procedures[0]?.price || 1350,
      },
    ]);
  };

  const copyBudgetWhatsApp = (budget: typeof budgets[0]) => {
    const text = `✨ *ORÇAMENTO & PLANO DE TRATAMENTO - ED AESTHETIC*\n\nOlá, *${budget.patientName}*! Preparamos seu plano personalizado:\n\n${budget.items
      .map((it) => `• *${it.sessions}x ${it.procedureName}*\n  Valor: R$ ${it.totalPrice.toFixed(2)} (${it.sessions} sessão(ões))`)
      .join('\n\n')}\n\n*Subtotal:* R$ ${budget.totalGross.toFixed(2)}\n*Desconto de Pacote (${budget.discountPercentage}%):* -R$ ${(budget.totalGross - budget.totalNet).toFixed(2)}\n*Investimento Final:* R$ ${budget.totalNet.toFixed(2)}\n\n💳 *Condições Especiais:* Em até 10x ou 12x no cartão de crédito ou à vista com chave PIX.\n\nQualquer dúvida, a Dra. Edilaine está à disposição! 💕`;

    navigator.clipboard.writeText(text);
    addToast('success', 'Orçamento Copiado', 'Texto pronto para envio no WhatsApp da paciente!');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-serif font-bold text-stone-900">
              Orçamentos, Pacotes & Checkout
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
              Simulador Maquininha Integrado
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Geração de planos de tratamento, simulação de taxas de cartão e emissão instantânea de recibos digitais.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): New Budget Builder */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <h3 className="font-serif font-bold text-base text-stone-900">
              Criar Novo Plano / Orçamento
            </h3>
          </div>

          <form onSubmit={handleSaveBudget} className="space-y-4 text-xs">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                Selecione a Paciente:
              </label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium text-stone-900"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} • {p.phone}
                  </option>
                ))}
              </select>
            </div>

            {/* Treatment Items List */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-stone-700 font-semibold">
                  Procedimentos & Sessões:
                </label>
                <button
                  type="button"
                  onClick={addItemToNewBudget}
                  className="text-amber-800 hover:text-amber-900 font-bold flex items-center gap-1 text-[11px]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Procedimento</span>
                </button>
              </div>

              {selectedItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <select
                      value={item.procedureId}
                      onChange={(e) => updateItemProcedure(idx, e.target.value)}
                      className="flex-1 p-1.5 bg-white border border-stone-300 rounded-lg text-xs text-stone-900"
                    >
                      {procedures.map((proc) => (
                        <option key={proc.id} value={proc.id}>
                          {proc.name} (R$ {proc.price.toFixed(2)})
                        </option>
                      ))}
                    </select>
                    {selectedItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        className="p-1 text-stone-400 hover:text-rose-600 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-3 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-stone-500">Sessões:</span>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={item.sessions}
                        onChange={(e) => updateItemSessions(idx, Number(e.target.value))}
                        className="w-14 p-1 bg-white border border-stone-300 rounded text-center font-bold text-stone-900"
                      />
                    </div>
                    <div>
                      <span className="text-stone-500">Total Item: </span>
                      <strong className="text-stone-900">R$ {item.totalPrice.toFixed(2)}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Discount selector */}
            <div className="p-3 rounded-2xl bg-amber-50/50 border border-amber-200/70 flex items-center justify-between">
              <span className="text-amber-950 font-medium flex items-center gap-1">
                <Percent className="w-3.5 h-3.5 text-amber-700" />
                Desconto Pacote / À Vista:
              </span>
              <div className="flex items-center gap-1">
                {[0, 5, 8, 10].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setDiscountPercent(pct)}
                    className={`px-2 py-1 rounded-md text-[10px] font-bold transition ${
                      discountPercent === pct
                        ? 'bg-amber-600 text-white'
                        : 'bg-white text-stone-700 border border-stone-200'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Summary calculation */}
            <div className="pt-2 border-t border-stone-100 space-y-1.5">
              <div className="flex justify-between text-stone-500 text-xs">
                <span>Subtotal Bruto:</span>
                <span>R$ {grossTotal.toFixed(2)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-700 text-xs font-medium">
                  <span>Desconto ({discountPercent}%):</span>
                  <span>- R$ {(grossTotal - netTotal).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-900 font-bold text-sm pt-1 border-t border-stone-200">
                <span>Total Líquido:</span>
                <span className="font-serif text-base text-emerald-800">
                  R$ {netTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-stone-900 text-white rounded-xl font-semibold hover:bg-black transition shadow-sm text-xs flex items-center justify-center gap-2"
            >
              <span>Gerar e Salvar Orçamento</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </form>
        </div>

        {/* Right Column (7 cols): Existing Budgets & Fast Checkout */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-stone-900 text-base">
              Histórico de Orçamentos & Planos Emitidos
            </h3>
            <span className="text-xs text-stone-500 font-medium">
              {budgets.length} orçamentos
            </span>
          </div>

          <div className="space-y-3">
            {budgets.map((b) => {
              const isPaid = b.status === 'pago';

              return (
                <div
                  key={b.id}
                  className={`bg-white rounded-3xl p-5 border transition-all duration-200 shadow-xs hover:shadow-md ${
                    isPaid ? 'border-emerald-200/90 bg-emerald-50/20' : 'border-stone-200/90'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-base text-stone-900">
                          {b.patientName}
                        </span>
                        {isPaid ? (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Pago ({b.receiptNumber})
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                            Orçamento Aberto
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-stone-500 mt-0.5">
                        Código: #{b.id} • Emitido em: {b.createdAt.split('-').reverse().join('/')}
                      </div>

                      {/* Items list */}
                      <div className="mt-3 space-y-1">
                        {b.items.map((it, idx) => (
                          <div
                            key={idx}
                            className="text-xs text-stone-700 flex items-center justify-between"
                          >
                            <span>
                              {it.sessions}x {it.procedureName}
                            </span>
                            <span className="font-medium text-stone-900">
                              R$ {it.totalPrice.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-baseline gap-2">
                        <span className="text-xs text-stone-500 font-medium">Investimento:</span>
                        <span className="font-serif font-bold text-lg text-emerald-800">
                          R$ {b.totalNet.toFixed(2)}
                        </span>
                        {b.discountPercentage > 0 && (
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            {b.discountPercentage}% desconto
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:items-end gap-2 pt-2 sm:pt-0">
                      {!isPaid ? (
                        <button
                          onClick={() => setActiveCheckoutBudget(b)}
                          className="px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Receber / Checkout</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setActiveCheckoutBudget(b)}
                          className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-medium border border-stone-300 flex items-center gap-1 transition"
                        >
                          <Printer className="w-3.5 h-3.5 text-stone-600" />
                          <span>Ver Recibo Digital</span>
                        </button>
                      )}

                      <button
                        onClick={() => copyBudgetWhatsApp(b)}
                        className="px-3 py-1.5 text-xs text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 font-medium flex items-center gap-1 transition"
                      >
                        <Share2 className="w-3 h-3 text-emerald-600" />
                        <span>Copiar para WhatsApp</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

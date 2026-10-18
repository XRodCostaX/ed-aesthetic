'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Sparkles,
  Clock,
  Layers,
  Check,
  TrendingUp,
  Boxes,
  Plus,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Procedure } from '@/types';

export default function CatalogoView() {
  const { procedures, setActiveTab, addToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  const categories = [
    'todos',
    'Harmonização',
    'Emagrecimento',
    'Tecnologias',
    'Cuidados Faciais',
  ];

  const filtered = procedures.filter(
    (p) => selectedCategory === 'todos' || p.category === selectedCategory
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-serif font-bold text-stone-900">
              Catálogo de Procedimentos & Fichas Técnicas
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 font-semibold">
              BOM Integrada ao Estoque
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Cada procedimento possui insumos e tempos vinculados para baixa automática e cálculo real de margem de lucro.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('orcamentos')}
          className="px-4 py-2.5 bg-gradient-to-r from-stone-900 to-stone-800 text-white font-semibold text-xs rounded-xl hover:bg-black transition shadow-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <span>Montar Orçamento</span>
          <ArrowRight className="w-4 h-4 text-amber-300" />
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition shrink-0 ${
              selectedCategory === cat
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            {cat === 'todos' ? 'Todos os Procedimentos' : cat}
          </button>
        ))}
      </div>

      {/* Grid of Procedure Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((proc) => {
          const profit = proc.price - proc.estimatedCost;
          const margin = Math.round((profit / proc.price) * 100);

          return (
            <div
              key={proc.id}
              className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200/70">
                    {proc.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-stone-500 font-medium">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    {proc.durationMinutes} min
                  </span>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900 group-hover:text-amber-800 transition">
                    {proc.name}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                    {proc.description}
                  </p>
                </div>

                {/* Bill of Materials (BOM) / Insumos consumidos */}
                <div className="bg-stone-50 rounded-2xl p-3 border border-stone-200/80 space-y-2">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-stone-400 flex items-center gap-1">
                    <Boxes className="w-3.5 h-3.5 text-amber-600" />
                    <span>Insumos Consumidos (Baixa Automática)</span>
                  </div>
                  <div className="space-y-1">
                    {proc.insumos.map((req, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs text-stone-700"
                      >
                        <span className="truncate pr-2">• {req.insumoName}</span>
                        <span className="font-mono font-semibold text-stone-900 shrink-0 text-[11px]">
                          {req.quantityNeeded} {req.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Margins Footer */}
              <div className="pt-3 border-t border-stone-100 space-y-3">
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase font-medium">
                      Valor ao Paciente
                    </span>
                    <span className="text-xl font-serif font-bold text-stone-900">
                      R$ {proc.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 block uppercase font-medium">
                      Lucro Líquido
                    </span>
                    <span className="text-sm font-semibold text-emerald-700 flex items-center justify-end gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      R$ {profit.toFixed(2)} ({margin}%)
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('orcamentos');
                    addToast('success', 'Procedimento Selecionado', `${proc.name} pronto para orçamento.`);
                  }}
                  className="w-full py-2 bg-stone-100 hover:bg-stone-900 hover:text-white text-stone-800 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Incluir no Gerador de Orçamentos</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

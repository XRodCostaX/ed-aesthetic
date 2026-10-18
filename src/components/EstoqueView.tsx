'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Boxes,
  AlertTriangle,
  ShieldCheck,
  Plus,
  Search,
  Calendar,
  Layers,
  ArrowDownRight,
  TrendingDown,
  History,
  CheckCircle2,
} from 'lucide-react';
import { Insumo } from '@/types';

export default function EstoqueView() {
  const { insumos, stockLogs, addStockItem, adjustStockQuantity, addToast } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New stock form
  const [name, setName] = useState<string>('');
  const [brand, setBrand] = useState<string>('');
  const [category, setCategory] = useState<Insumo['category']>('toxina');
  const [lote, setLote] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<string>('2027-12-31');
  const [quantity, setQuantity] = useState<number>(5);
  const [unit, setUnit] = useState<Insumo['unit']>('frasco');
  const [minThreshold, setMinThreshold] = useState<number>(2);
  const [costPerUnit, setCostPerUnit] = useState<number>(850.0);

  const filteredInsumos = insumos.filter((item) => {
    if (selectedCategory !== 'todos' && item.category !== selectedCategory) return false;
    if (
      searchQuery &&
      !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.lote.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.brand.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const totalStockValue = insumos.reduce(
    (acc, curr) => acc + curr.quantity * curr.costPerUnit,
    0
  );
  const criticalCount = insumos.filter((i) => i.status === 'critico').length;

  const handleCreateLote = (e: React.FormEvent) => {
    e.preventDefault();
    addStockItem({
      name,
      brand,
      category,
      lote,
      expiryDate,
      quantity,
      unit,
      minThreshold,
      costPerUnit,
    });
    setIsAddModalOpen(false);
    setName('');
    setBrand('');
    setLote('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-serif font-bold text-stone-900">
              Controle de Estoque & Lotes de Alta Precisão
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
              Rastreabilidade Anvisa
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Blindagem contra desperdício de ampolas e toxinas com baixa automática atrelada a cada procedimento.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-stone-900 to-stone-800 text-white font-semibold text-xs rounded-xl hover:bg-black transition shadow-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>Cadastrar Novo Lote</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Patrimônio em Insumos
            </span>
            <div className="text-2xl font-serif font-bold text-stone-900 mt-1">
              R$ {totalStockValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">Toxinas, ampolas e bioestimuladores</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Boxes className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Alertas de Reposição
            </span>
            <div
              className={`text-2xl font-serif font-bold mt-1 ${
                criticalCount > 0 ? 'text-rose-600' : 'text-stone-900'
              }`}
            >
              {criticalCount} Insumo(s) Crítico(s)
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">Abaixo da margem de segurança</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Baixas Automáticas Hoje
            </span>
            <div className="text-2xl font-serif font-bold text-emerald-800 mt-1">
              {stockLogs.length} Movimentações
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">Integradas à agenda clínica</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Stock Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden space-y-4 p-6">
        {/* Filter & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['todos', 'toxina', 'bioestimulador', 'emagrecimento', 'descartavel', 'tecnologia'].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-stone-900 text-white shadow-2xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {cat === 'todos' ? 'Todos os Insumos' : cat}
                </button>
              )
            )}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por lote, marca ou produto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500/50"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200/80 text-stone-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Produto / Marca</th>
                <th className="py-3 px-3">Categoria</th>
                <th className="py-3 px-3">Lote & Validade</th>
                <th className="py-3 px-3">Quantidade em Estoque</th>
                <th className="py-3 px-3">Custo Unitário</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Ajuste Rápido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredInsumos.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50/60 transition">
                  <td className="py-3.5 px-3">
                    <div className="font-semibold text-stone-900">{item.name}</div>
                    <div className="text-[11px] text-stone-500">{item.brand}</div>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="capitalize px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-medium text-[11px]">
                      {item.category}
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="font-mono text-stone-900 font-semibold">{item.lote}</div>
                    <div className="text-[11px] text-stone-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-stone-400" />
                      <span>Val: {item.expiryDate.split('-').reverse().join('/')}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="text-sm font-bold text-stone-900 font-mono">
                      {item.quantity}{' '}
                      <span className="text-[11px] font-normal text-stone-500">{item.unit}(s)</span>
                    </div>
                    <div className="text-[10px] text-stone-400">
                      Mínimo seguro: {item.minThreshold} {item.unit}
                    </div>
                  </td>

                  <td className="py-3.5 px-3 font-medium text-stone-900">
                    R$ {item.costPerUnit.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-3">
                    {item.status === 'normal' && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Estoque Regular
                      </span>
                    )}
                    {item.status === 'alerta' && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        Margem Mínima
                      </span>
                    )}
                    {item.status === 'critico' && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200 animate-pulse">
                        Crítico / Repor!
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <div className="inline-flex items-center gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200">
                      <button
                        onClick={() => adjustStockQuantity(item.id, -1)}
                        className="w-6 h-6 rounded bg-white text-stone-700 hover:bg-stone-200 flex items-center justify-center font-bold text-xs shadow-2xs"
                        title="Subtrair 1 unidade"
                      >
                        -
                      </button>
                      <button
                        onClick={() => adjustStockQuantity(item.id, 1)}
                        className="w-6 h-6 rounded bg-white text-stone-700 hover:bg-stone-200 flex items-center justify-center font-bold text-xs shadow-2xs"
                        title="Adicionar 1 unidade"
                      >
                        +
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log: Automatic Deductions History */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-600" />
            <h3 className="font-serif font-bold text-base text-stone-900">
              Histórico de Baixas Automáticas (Auditoria Clínica)
            </h3>
          </div>
          <span className="text-xs text-stone-500 font-medium">
            Rastreamento de Procedimento $\rightarrow$ Insumo
          </span>
        </div>

        <div className="divide-y divide-stone-100 text-xs">
          {stockLogs.map((log) => (
            <div
              key={log.id}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="space-y-0.5">
                <div className="font-semibold text-stone-900 flex items-center gap-2">
                  <span>{log.procedureName}</span>
                  <span className="text-stone-400">•</span>
                  <span className="text-stone-600">Paciente: {log.patientName}</span>
                </div>
                <div className="text-[11px] text-stone-500">
                  Data/Hora: {log.timestamp} • Lote utilizado: <span className="font-mono font-medium">{log.lote}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1 font-mono">
                  <TrendingDown className="w-3.5 h-3.5" />
                  - {log.quantityDeducted} {log.unit} ({log.insumoName})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Cadastrar Novo Lote */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200">
            <div className="bg-stone-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Boxes className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif font-bold text-base text-amber-100">
                  Cadastrar Entrada de Novo Lote
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-white p-1 rounded-full"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLote} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Nome do Insumo / Medicamento:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Toxina Botulínica 100U"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    Fabricante / Marca:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Allergan, Galderma"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    Categoria:
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="toxina">Toxina</option>
                    <option value="bioestimulador">Bioestimulador</option>
                    <option value="emagrecimento">Emagrecimento</option>
                    <option value="descartavel">Descartável</option>
                    <option value="tecnologia">Tecnologia Laser</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    Número do Lote (Anvisa):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: AL-2026-904"
                    value={lote}
                    onChange={(e) => setLote(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    Data de Validade:
                  </label>
                  <input
                    type="date"
                    required
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    Quantidade:
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    Unidade:
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as any)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="frasco">Frasco</option>
                    <option value="ampola">Ampola</option>
                    <option value="unidade">Unidade</option>
                    <option value="caixa">Caixa</option>
                    <option value="ml">ml</option>
                    <option value="disparo">Disparo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    Alerta Mínimo:
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={minThreshold}
                    onChange={(e) => setMinThreshold(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Custo Unitário de Aquisição (R$):
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={costPerUnit}
                  onChange={(e) => setCostPerUnit(Number(e.target.value))}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-stone-900 text-white rounded-xl font-semibold hover:bg-black transition shadow-sm text-xs"
                >
                  Registrar Entrada no Estoque
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

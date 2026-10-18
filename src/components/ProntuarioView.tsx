'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  User,
  Phone,
  Mail,
  FileCheck2,
  AlertCircle,
  Camera,
  Calendar,
  Sparkles,
  Sliders,
  ShieldAlert,
  ChevronRight,
  Plus,
} from 'lucide-react';

export default function ProntuarioView() {
  const { patients, selectedPatientId, setSelectedPatientId, beforeAfterRecords, addToast } =
    useApp();

  const [activeSubTab, setActiveSubTab] = useState<'fotos' | 'anamnese'>('fotos');
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage for before/after comparison

  const patient = patients.find((p) => p.id === selectedPatientId) || patients[0];
  const patientRecords = beforeAfterRecords.filter((r) => r.patientId === patient.id);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-stone-900">
            Prontuário Clínico & Evolução Fotográfica
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Registro de anamnese, contraindicações e galeria comparativa de Antes & Depois
          </p>
        </div>

        {/* Patient quick switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider shrink-0">
            Paciente:
          </span>
          {patients.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPatientId(p.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition shrink-0 flex items-center gap-2 ${
                p.id === patient.id
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <img
                src={p.avatarUrl}
                alt={p.name}
                className="w-4 h-4 rounded-full object-cover"
              />
              <span>{p.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left patient summary card, Right content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Patient Profile & Health Card */}
        <div className="space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-4">
              <img
                src={patient.avatarUrl}
                alt={patient.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-400/60 shadow-sm"
              />
              <div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  {patient.name}
                </h3>
                <p className="text-xs text-stone-500">CPF: {patient.cpf}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  {patient.consentSigned ? (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <FileCheck2 className="w-3 h-3 text-emerald-600" />
                      Termo Assinado
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      Pendente Assinatura
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 space-y-2 text-xs">
              <div className="flex items-center justify-between text-stone-600">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  Telefone:
                </span>
                <span className="font-medium text-stone-900">{patient.phone}</span>
              </div>
              <div className="flex items-center justify-between text-stone-600">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  Email:
                </span>
                <span className="font-medium text-stone-900 truncate max-w-[150px]">
                  {patient.email}
                </span>
              </div>
              <div className="flex items-center justify-between text-stone-600">
                <span>Nascimento:</span>
                <span className="font-medium text-stone-900">
                  {patient.birthDate.split('-').reverse().join('/')}
                </span>
              </div>
              <div className="flex items-center justify-between text-stone-600">
                <span>Total Investido:</span>
                <span className="font-bold text-emerald-800 font-serif">
                  R$ {patient.totalSpent?.toFixed(2) || '0,00'}
                </span>
              </div>
            </div>

            {/* Contraindications Warning Box */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <ShieldAlert className="w-4 h-4 text-amber-700" />
                <span>Alertas Clínicos & Alergias</span>
              </div>
              <div className="space-y-1 text-[11px] text-amber-950">
                <p>
                  <strong>Alergias relatadas:</strong>{' '}
                  {patient.allergies.length > 0 ? patient.allergies.join(', ') : 'Nenhuma'}
                </p>
                <p>
                  <strong>Cuidados especiais:</strong>{' '}
                  {patient.contraindications.length > 0
                    ? patient.contraindications.join(', ')
                    : 'Nenhuma contraindicação no histórico'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Comparative Before & After / Anamnese */}
        <div className="lg:col-span-2 space-y-4">
          {/* Subtabs switcher */}
          <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
            <button
              onClick={() => setActiveSubTab('fotos')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                activeSubTab === 'fotos'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Camera className="w-4 h-4 text-amber-300" />
              <span>Fotos Antes & Depois ({patientRecords.length})</span>
            </button>
            <button
              onClick={() => setActiveSubTab('anamnese')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                activeSubTab === 'anamnese'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <FileCheck2 className="w-4 h-4 text-amber-300" />
              <span>Histórico Clínico Detalhado</span>
            </button>
          </div>

          {activeSubTab === 'fotos' && (
            <div className="space-y-6">
              {patientRecords.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 text-stone-500 text-xs space-y-3">
                  <Camera className="w-8 h-8 text-stone-300 mx-auto" />
                  <p>Nenhuma foto comparativa registrada ainda para {patient.name}.</p>
                  <button
                    onClick={() =>
                      addToast('info', 'Galeria', 'Para registrar nova foto, use a câmera do tablet ou anexe arquivos.')
                    }
                    className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-medium"
                  >
                    Anexar Fotos Deste Atendimento
                  </button>
                </div>
              ) : (
                patientRecords.map((record) => (
                  <div
                    key={record.id}
                    className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-base text-stone-900">
                            {record.procedureName}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                            {record.area}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Sessão realizada em: {record.date.split('-').reverse().join('/')} • Responsável: {record.professional}
                        </p>
                      </div>

                      <div className="text-xs font-semibold text-amber-800 bg-amber-50/80 px-3 py-1.5 rounded-xl border border-amber-200/80 self-start sm:self-auto flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5 text-amber-700" />
                        <span>Arraste o divisor para comparar</span>
                      </div>
                    </div>

                    {/* Interactive Before & After Slider */}
                    <div className="relative h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden select-none border border-stone-200 shadow-inner group">
                      {/* After Image (Background) */}
                      <img
                        src={record.afterImageUrl}
                        alt="Depois"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <span className="absolute bottom-4 right-4 z-10 text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 bg-black/60 text-emerald-300 rounded-md backdrop-blur-md">
                        Depois (15 dias)
                      </span>

                      {/* Before Image (Clipped Overlay) */}
                      <div
                        className="absolute inset-0 overflow-hidden"
                        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                      >
                        <img
                          src={record.beforeImageUrl}
                          alt="Antes"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <span className="absolute bottom-4 left-4 z-10 text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 bg-black/60 text-amber-200 rounded-md backdrop-blur-md">
                          Antes do Procedimento
                        </span>
                      </div>

                      {/* Divider Line */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none"
                        style={{ left: `${sliderPosition}%` }}
                      >
                        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-stone-900 shadow-md flex items-center justify-center font-bold text-xs border border-stone-300">
                          ⇄
                        </div>
                      </div>

                      {/* Slider Input overlay */}
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={sliderPosition}
                        onChange={(e) => setSliderPosition(Number(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20 touch-none"
                      />
                    </div>

                    {/* Clinical Note from Dra. Edilaine */}
                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-700 leading-relaxed">
                      <div className="font-semibold text-stone-900 mb-1 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>Avaliação Técnica & Evolução:</span>
                      </div>
                      <p>{record.notes}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeSubTab === 'anamnese' && (
            <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-5 text-xs">
              <div className="space-y-2">
                <h4 className="font-serif font-bold text-stone-900 text-sm">
                  Queixa Principal & Histórico Estético
                </h4>
                <p className="text-stone-600 bg-stone-50 p-4 rounded-2xl border border-stone-200 leading-relaxed">
                  {patient.notes}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-serif font-bold text-stone-900 text-sm">
                  Termo de Consentimento Livre e Esclarecido (TCLE)
                </h4>
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-start gap-3">
                  <FileCheck2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div className="space-y-1 text-emerald-950">
                    <p className="font-bold">Termo de Procedimentos Injetáveis Assinado</p>
                    <p className="text-[11px] text-emerald-800">
                      Paciente foi orientada sobre cuidados pós-aplicação, riscos transitórios (edema leve, hematoma), não deitar nas primeiras 4 horas e evitar esforço físico intenso por 24 horas.
                    </p>
                    <div className="text-[10px] text-emerald-700 font-mono pt-1">
                      Hash de Assinatura: 9a7f.48b1.ed09 • Data: 12/04/2026 às 14:22
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => addToast('success', 'Prontuário Salvo', 'As alterações clínicas foram registradas.')}
                  className="px-4 py-2.5 bg-stone-900 text-white rounded-xl font-semibold hover:bg-black transition"
                >
                  Atualizar Anamnese
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

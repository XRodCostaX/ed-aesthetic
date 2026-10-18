'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  X,
  CreditCard,
  QrCode,
  Banknote,
  CheckCircle,
  Copy,
  Printer,
  Sparkles,
  Share2,
  Percent,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CheckoutModal() {
  const { activeCheckoutBudget, setActiveCheckoutBudget, checkoutBudget, addToast } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao_credito' | 'dinheiro'>('pix');
  const [installments, setInstallments] = useState<number>(3);
  const [passFeeToClient, setPassFeeToClient] = useState<boolean>(false);
  const [receiptGenerated, setReceiptGenerated] = useState<boolean>(false);
  const [copiedReceipt, setCopiedReceipt] = useState<boolean>(false);

  if (!activeCheckoutBudget) return null;

  const budget = activeCheckoutBudget;
  const baseTotal = budget.totalNet;

  // Typical aesthetic clinic card rates:
  const cardRates: Record<number, number> = {
    1: 2.8,
    2: 3.8,
    3: 4.5,
    4: 5.2,
    5: 5.9,
    6: 6.8,
    8: 8.2,
    10: 9.5,
    12: 11.2,
  };

  const selectedRate = cardRates[installments] || 4.5;

  let totalToPay = baseTotal;
  let clinicReceives = baseTotal;

  if (paymentMethod === 'cartao_credito') {
    if (passFeeToClient) {
      totalToPay = baseTotal / (1 - selectedRate / 100);
      clinicReceives = baseTotal;
    } else {
      totalToPay = baseTotal;
      clinicReceives = baseTotal * (1 - selectedRate / 100);
    }
  }

  const installmentValue = totalToPay / installments;

  const handleConfirmPayment = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    checkoutBudget(budget.id, paymentMethod, paymentMethod === 'cartao_credito' ? installments : 1);
    setReceiptGenerated(true);
  };

  const receiptNumber = budget.receiptNumber || `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const receiptWhatsAppText = `🧾 *COMPROVANTE DE PAGAMENTO - ED AESTHETIC*\n\n*Recibo Nº:* ${receiptNumber}\n*Data:* ${new Date().toLocaleDateString('pt-BR')}\n*Paciente:* ${budget.patientName}\n\n*Itens do Tratamento:*\n${budget.items
    .map((item) => `• ${item.sessions}x ${item.procedureName} - R$ ${item.totalPrice.toFixed(2)}`)
    .join('\n')}\n\n*Forma de Pagamento:* ${
    paymentMethod === 'pix'
      ? 'PIX Instantâneo'
      : paymentMethod === 'cartao_credito'
      ? `Cartão de Crédito (${installments}x de R$ ${installmentValue.toFixed(2)})`
      : 'Dinheiro à Vista'
  }\n*Valor Total Pago:* R$ ${totalToPay.toFixed(2)}\n\n*Ed Aesthetic • Dra. Edilaine*\nAtendimento de Excelência & Alta Precisão`;

  const copyReceiptToClipboard = () => {
    navigator.clipboard.writeText(receiptWhatsAppText);
    setCopiedReceipt(true);
    addToast('success', 'Recibo Copiado', 'Texto pronto para envio no WhatsApp da paciente!');
    setTimeout(() => setCopiedReceipt(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-stone-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-amber-100">
                {receiptGenerated ? 'Comprovante & Recibo Emitido' : 'Checkout & Recebimento'}
              </h3>
              <p className="text-xs text-stone-300">
                Orçamento #{budget.id} • {budget.patientName}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveCheckoutBudget(null)}
            className="text-stone-400 hover:text-white p-1 rounded-full hover:bg-stone-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!receiptGenerated ? (
          <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 flex-1 overflow-y-auto">
            {/* Procedures summary */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-2">
              <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Procedimentos Inclusos
              </div>
              {budget.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs text-stone-700">
                  <span>
                    {item.sessions}x {item.procedureName}
                  </span>
                  <span className="font-semibold text-stone-900">
                    R$ {item.totalPrice.toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="pt-2 border-t border-stone-200 flex justify-between items-center text-sm font-bold text-stone-900">
                <span>Total Líquido:</span>
                <span className="text-emerald-700 text-base font-serif">
                  R$ {baseTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-2">
                Selecione a Forma de Pagamento
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pix')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition text-xs font-medium ${
                    paymentMethod === 'pix'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-xs'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-emerald-600" />
                  <span>PIX (À Vista)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cartao_credito')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition text-xs font-medium ${
                    paymentMethod === 'cartao_credito'
                      ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-xs'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-amber-600" />
                  <span>Cartão (1x a 12x)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('dinheiro')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition text-xs font-medium ${
                    paymentMethod === 'dinheiro'
                      ? 'border-stone-700 bg-stone-100 text-stone-900 shadow-xs'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-stone-600" />
                  <span>Dinheiro</span>
                </button>
              </div>
            </div>

            {/* Details according to payment method */}
            {paymentMethod === 'pix' && (
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex flex-col items-center text-center space-y-3">
                <div className="w-32 h-32 bg-white p-2 rounded-xl shadow-xs border border-emerald-200 flex items-center justify-center">
                  <div className="relative">
                    <QrCode className="w-24 h-24 text-emerald-900" />
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="w-6 h-6 rounded bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shadow-xs">
                        ED
                      </span>
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-emerald-950">
                    Chave Pix (CNPJ Ed Aesthetic)
                  </div>
                  <div className="text-xs font-mono text-emerald-800 bg-white/80 px-3 py-1 rounded-full border border-emerald-300 mt-1">
                    48.912.840/0001-92
                  </div>
                </div>
                <div className="text-[11px] text-emerald-700">
                  Valor com liquidação imediata na conta: <strong>R$ {baseTotal.toFixed(2)}</strong>
                </div>
              </div>
            )}

            {paymentMethod === 'cartao_credito' && (
              <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-950 flex items-center gap-1.5">
                    <Percent className="w-4 h-4 text-amber-700" />
                    Simulador de Parcelamento da Maquininha
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="passFee"
                      checked={passFeeToClient}
                      onChange={(e) => setPassFeeToClient(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                    />
                    <label htmlFor="passFee" className="text-xs text-stone-700 cursor-pointer">
                      Repassar taxa ao cliente
                    </label>
                  </div>
                </div>

                {/* Installments selection */}
                <div>
                  <label className="block text-xs text-stone-600 mb-1.5 font-medium">
                    Número de Parcelas:
                  </label>
                  <select
                    value={installments}
                    onChange={(e) => setInstallments(Number(e.target.value))}
                    className="w-full text-xs bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  >
                    {Object.entries(cardRates).map(([inst, rate]) => (
                      <option key={inst} value={inst}>
                        {inst}x de R$ {(totalToPay / Number(inst)).toFixed(2)} (Taxa da operadora: {rate}%)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Breakdown result card */}
                <div className="bg-white p-3 rounded-xl border border-amber-200/80 text-xs space-y-1.5">
                  <div className="flex justify-between text-stone-600">
                    <span>Valor cobrado da paciente:</span>
                    <span className="font-semibold text-stone-900">
                      {installments}x de R$ {installmentValue.toFixed(2)} (= R${' '}
                      {totalToPay.toFixed(2)})
                    </span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Taxa da maquininha ({selectedRate}%):</span>
                    <span className="text-rose-600 font-medium">
                      - R$ {(totalToPay - clinicReceives).toFixed(2)}
                    </span>
                  </div>
                  <div className="pt-1.5 border-t border-stone-100 flex justify-between font-bold text-emerald-800">
                    <span>Valor Líquido Recebido pela Ed Aesthetic:</span>
                    <span className="font-serif text-sm">R$ {clinicReceives.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'dinheiro' && (
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-center text-xs text-stone-600">
                Recebimento em dinheiro físico na recepção. O caixa será atualizado imediatamente.
              </div>
            )}

            <button
              onClick={handleConfirmPayment}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 text-white font-semibold rounded-2xl text-xs sm:text-sm hover:from-emerald-800 hover:to-emerald-800 shadow-md transition flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4 text-emerald-200" />
              <span>Confirmar Pagamento e Emitir Recibo Digital</span>
            </button>
          </div>
        ) : (
          /* Receipt Generated View */
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 flex-1 overflow-y-auto">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-stone-900 text-base">
                Pagamento Registrado com Sucesso!
              </h4>
              <p className="text-xs text-emerald-800 mt-1">
                Recibo Nº <span className="font-mono font-bold">{receiptNumber}</span>
              </p>
            </div>

            {/* Digital Receipt Card */}
            <div className="border border-dashed border-stone-300 rounded-2xl p-5 bg-[#FAF9F6] font-mono text-xs text-stone-800 space-y-3 shadow-inner">
              <div className="text-center pb-3 border-b border-stone-200">
                <div className="font-serif font-bold text-sm tracking-wider text-stone-900">
                  CLÍNICA ED AESTHETIC
                </div>
                <div className="text-[10px] text-stone-500 font-sans">
                  CNPJ: 48.912.840/0001-92 • Dra. Edilaine
                </div>
                <div className="text-[10px] text-stone-500 font-sans">
                  Av. Paulista, Jardins - São Paulo / SP
                </div>
              </div>

              <div className="flex justify-between text-[11px]">
                <span className="text-stone-500">Paciente:</span>
                <span className="font-bold">{budget.patientName}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-stone-500">Data/Hora:</span>
                <span>{new Date().toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-stone-500">Forma de Pagamento:</span>
                <span className="font-semibold uppercase text-emerald-700">
                  {paymentMethod.replace('_', ' ')}
                  {paymentMethod === 'cartao_credito' && ` (${installments}x)`}
                </span>
              </div>

              <div className="pt-2 border-t border-stone-200 space-y-1">
                {budget.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-[11px]">
                    <span>
                      {item.sessions}x {item.procedureName}
                    </span>
                    <span>R$ {item.totalPrice.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-stone-300 flex justify-between font-bold text-sm text-stone-900">
                <span>VALOR TOTAL PAGO:</span>
                <span>R$ {totalToPay.toFixed(2)}</span>
              </div>

              <div className="text-center text-[10px] text-stone-400 pt-2 border-t border-stone-200 font-sans">
                Autenticação Digital: {Math.random().toString(36).substring(2, 12).toUpperCase()}
              </div>
            </div>

            {/* Actions for the receipt */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={copyReceiptToClipboard}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedReceipt ? 'Copiado!' : 'Enviar no WhatsApp'}</span>
              </button>

              <button
                onClick={() => {
                  window.print();
                }}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-stone-100 text-stone-800 rounded-xl text-xs font-semibold hover:bg-stone-200 transition border border-stone-300"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir Recibo</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

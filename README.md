# Ed Aesthetic — Sistema Integrado de Gestão & Atendimento

Sistema web moderno em **Next.js (App Router)** e **TypeScript** desenvolvido com foco na experiência de clínicas estéticas de alto padrão (Harmonização Facial, Emagrecimento, Lasers e Cuidados Faciais).

O objetivo do sistema é **blindar o estoque de insumos de alto custo** (toxinas botulínicas, ampolas de Mounjaro, bioestimuladores de colágeno e disparos de laser), **eliminar faltas (no-show) via confirmações ativas por WhatsApp** e **otimizar o faturamento com simulação transparente de maquininha de cartão e emissão de recibos digitais**.

---

## 🌟 Módulos Implementados no MVP

### 1. Painel Executivo & Faturamento (Dashboard)
* **Indicadores do dia em tempo real**: faturamento diário, atendimentos agendados, taxa de resposta do WhatsApp (94%) e contagem de insumos críticos.
* **Fila de atendimento do dia**: controle visual de pacientes agendados, confirmados, na recepção e concluídos.
* **Margem de Contribuição Real**: cálculo automático de lucro líquido deduzindo o custo exato dos insumos consumidos por procedimento.

### 2. Agenda Visual & Gestão de Salas
* **Visualização por Salas / Cabines**:
  * *Sala 1 — Injetáveis* (Dra. Edilaine)
  * *Sala 2 — Lasers & Tecnologias*
  * *Sala 3 — Cuidados Faciais*
* **Automação Anti No-Show (WhatsApp)**:
  * Modal interativo simulando a mensagem oficial enviada para a paciente com botões rápidos (*Confirmar Presença*, *Solicitar Reagendamento*).
  * Botão de teste para simular a resposta imediata da paciente e link direto para envio via WhatsApp Web/Desktop.
* **Agendamento Ágil**: modal para criação de novos atendimentos com cálculo automático da duração do procedimento.

### 3. Prontuário Clínico & Evolução Fotográfica
* **Comparador Interativo de Antes & Depois**: slider interativo onde a profissional ou paciente arrasta o divisor central para comparar o resultado da sessão.
* **Ficha de Anamnese & Alertas**: histórico de alergias (ex.: Dipirona, Látex), contraindicações e Termo de Consentimento Livre e Esclarecido (TCLE) com hash de assinatura digital.

### 4. Catálogo de Procedimentos com Ficha Técnica (BOM)
* Cadastro completo de serviços (Botox 3 Áreas, Mounjaro 5mg, Sculptra, Laser Lavieen, Peeling Retinóico).
* **Ficha Técnica (Bill of Materials)**: lista de insumos consumidos por cada sessão para que a clínica saiba exatamente quanto custa executar o procedimento.

### 5. Orçamentos & Checkout com Simulador de Maquininha
* **Gerador de Planos de Tratamento**: emissão de orçamentos avulsos ou pacotes multi-sessões com desconto progressivo.
* **Simulador de Parcelamento de Maquininha (1x a 12x)**:
  * Permite alternar entre *repassar taxa ao paciente* ou *absorver no faturamento da clínica*.
  * Mostra o valor exato da parcela do paciente e o valor líquido que entra na conta da Ed Aesthetic.
* **Recibo Digital Formatado**: comprovante com autenticação digital pronto para impressão ou cópia direta para o WhatsApp da paciente.
* **Pagamento Instantâneo via PIX**: exibição de QR Code e chave Pix da clínica.

### 6. Controle de Estoque & Lotes de Alta Precisão (Rastreabilidade Anvisa)
* Tabela de insumos com marca, lote, data de validade, quantidade em estoque e nível mínimo de reposição.
* **Baixa Automática**: ao finalizar uma consulta na agenda, o sistema abate instantaneamente as ampolas, frascos e descartáveis correspondentes.
* **Log de Auditoria Clínica**: histórico com registro de qual lote foi utilizado em cada paciente.

---

## 🚀 Como Rodar Localmente

Certifique-se de ter o Node.js instalado. No terminal, execute:

```bash
# Instalar dependências (caso não tenha instalado)
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 📤 Como Subir para o GitHub

1. Crie um novo repositório vazio na sua conta do [GitHub](https://github.com/new) (exemplo: `ed-aesthetic`).
2. No terminal, execute os comandos abaixo substituindo pelo link do seu repositório:

```bash
git add .
git commit -m "feat: MVP Ed Aesthetic - Sistema Integrado de Gestao e Atendimento"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/ed-aesthetic.git
git push -u origin main
```

---

## ⚡ Como Lançar na Vercel (1 Minuto)

1. Acesse [vercel.com](https://vercel.com) e faça login com sua conta do GitHub.
2. Clique em **"Add New..."** $\rightarrow$ **"Project"**.
3. Selecione o repositório `ed-aesthetic` que você acabou de subir.
4. Deixe todas as configurações padrão (o Next.js é detectado automaticamente na raiz).
5. Clique em **"Deploy"**.

Em menos de 1 minuto você terá um link público (ex.: `https://ed-aesthetic.vercel.app`) pronto para enviar e encantar a Dra. Edilaine!

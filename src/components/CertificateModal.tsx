import React, { useRef } from "react";
import { 
  X, Award, ShieldCheck, Printer, Calendar, Download, 
  User, Landmark, CheckCircle, FileText, BadgeCheck
} from "lucide-react";
import { Worker } from "../types";

interface CertificateModalProps {
  worker: Worker;
  isOpen: boolean;
  onClose: () => void;
}

export default function CertificateModal({ worker, isOpen, onClose }: CertificateModalProps) {
  const certificateRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Generate unique certificate serial
  const serialHash = `AM-CERT-${worker.cpf.replace(/\D/g, "") || "000"}-${worker.id.substring(worker.id.length - 4, worker.id.length).toUpperCase()}`;
  
  // Date format
  const today = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  // Simple print action optimized for client-side target
  const handlePrint = () => {
    const printContent = certificateRef.current?.innerHTML;
    const originalContent = document.body.innerHTML;

    if (printContent) {
      // Open clean print window
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Certificado - ${worker.name}</title>
              <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
              <style>
                @media print {
                  body { padding: 40px; background-color: white; }
                  .no-print { display: none; }
                }
                body {
                  font-family: 'Inter', sans-serif;
                }
              </style>
            </head>
            <body>
              <div class="p-6">
                ${printContent}
              </div>
              <script>
                window.onload = function() {
                  window.print();
                  setTimeout(() => { window.close(); }, 500);
                }
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="certificate-viewer-modal" 
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col overflow-hidden max-h-[95vh]"
      >
        {/* Modal Topbar Actions */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-850 flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span className="font-sans font-bold text-sm">Visualizador de Certificado Oficial</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Salvar PDF</span>
            </button>
            
            <button
              onClick={onClose}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950">
          
          {/* Certificate Print-Friendly Target Area */}
          <div 
            ref={certificateRef} 
            className="bg-white border-[14px] border-slate-900 rounded-lg p-6 sm:p-12 relative overflow-hidden shadow-2xl text-slate-900"
            style={{ minHeight: "560px" }}
          >
            {/* Visual Guilloche Margin Corner Accents */}
            <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-orange-500 m-2"></div>
            <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-orange-500 m-2"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-orange-500 m-2"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-orange-500 m-2"></div>

            {/* Faint Center Watermark Background Logo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] select-none pointer-events-none">
              <Award className="w-96 h-96 text-slate-900" />
            </div>

            {/* Certificate Header layout */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <span className="font-sans font-black tracking-tight text-xl uppercase border-b-2 border-slate-900 pb-1 text-slate-950">
                  ArcelorMittal
                </span>
                <span className="bg-orange-500 text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded font-mono select-none uppercase tracking-wider">
                  Usinas
                </span>
              </div>
              
              <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-slate-500 block">
                SISTEMA INTEGRADO DE PREVENÇÃO E CONTROLE DE RISCOS
              </span>
              
              <div className="py-2">
                <h1 className="font-sans font-extrabold text-2xl sm:text-3.5xl text-slate-900 tracking-tight leading-none uppercase">
                  Certificado de Conclusão de Treinamento
                </h1>
                <div className="h-1 w-20 bg-orange-500 mx-auto mt-3"></div>
              </div>
            </div>

            {/* Certificate Main Text content with exact details */}
            <div className="mt-8 text-center max-w-2xl mx-auto space-y-6 text-sm sm:text-base leading-relaxed text-slate-800">
              <p>
                Certificamos para fins técnicos, de portaria e civis de responsabilidade de campo que o(a) colaborador(a):
              </p>

              <div className="py-2">
                <h2 className="font-sans font-black text-2xl sm:text-3xl text-orange-600 tracking-tight uppercase underline decoration-2 decoration-orange-500 font-sans">
                  {worker.name}
                </h2>
                <p className="text-xs font-mono text-slate-500 mt-1.5">
                  DOCUMENTO CPF: <strong className="font-bold text-slate-800">{worker.cpf}</strong> &bull; FUNÇÃO: <strong className="font-bold text-slate-800">{worker.role || "Técnico Especialista"}</strong>
                </p>
              </div>

              <p>
                concluiu de forma integral o treinamento regulamentar de <strong className="text-slate-950 font-bold uppercase">Integração de Segurança Mandatória e Auditoria das Regras de Ouro</strong>, obtendo o aproveitamento e regularidade técnica comprovada com pontuação de <strong className="text-orange-600 font-bold font-mono">{worker.quizScore ?? 3} / 3 acertos</strong> na avaliação teórica.
              </p>

              <p className="text-xs sm:text-sm text-slate-500">
                O referido portador encontra-se apto para ingressar nos canteiros de obras e pátios industriais sob chancela de conformidade da empresa parceira <strong className="text-slate-850 font-semibold">{worker.companyName}</strong> (CNPJ: {worker.companyCnpj}).
              </p>
            </div>

            {/* Signatures & Certification block */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 pt-6 border-t border-slate-100 max-w-2xl mx-auto align-bottom">
              
              <div className="space-y-1 text-center flex flex-col justify-end">
                <div className="h-6 flex items-end justify-center">
                  <span className="font-mono text-xs text-orange-600 font-bold uppercase tracking-wider select-none">
                    STAMP: AM-OK-PORTARIA
                  </span>
                </div>
                <div className="h-[2px] bg-slate-900 w-full"></div>
                <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Selo de Intertravamento LOTO Integrado
                </span>
              </div>

              <div className="space-y-1 text-center">
                <div className="h-10 flex flex-col items-center justify-end">
                  <span className="text-[9px] font-bold bg-green-150 text-green-900 px-1.5 py-0.5 rounded font-mono uppercase tracking-wide border border-green-200 select-none">
                    E-SIGNATURE HOMOLOGADA
                  </span>
                  <span className="font-mono text-xs font-extrabold text-slate-900 select-none">
                    Eng. Ricardo Neves de Souza
                  </span>
                </div>
                <div className="h-[2px] bg-slate-900 w-full"></div>
                <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Diretor do Comitê de HSE (Segurança &amp; Vida)
                </span>
              </div>

            </div>

            {/* Serial code details */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-slate-400 border-t border-slate-150 pt-4 uppercase">
              <span>Código Autenticador: {serialHash}</span>
              <span>Emitido em: {today} &bull; ArcelorMittal Tubarão</span>
            </div>

          </div>
          
        </div>

        {/* Action Bottom Tip Bar */}
        <div className="bg-slate-900 px-6 py-4 border-t border-slate-850 flex items-center justify-between">
          <p className="text-[11px] text-slate-400 leading-normal max-w-xl">
            💡 <strong>Formato PDF/Impressão:</strong> Ao clicar em "Imprimir / Salvar PDF", o navegador abrirá uma janela limpa com o tamanho já otimizado. Você pode escolher imprimir diretamente ou selecionar "Salvar como PDF" no menu de sua máquina.
          </p>

          <button
            onClick={onPrint}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-350 hover:text-white rounded-xl text-xs font-bold transition-colors border border-slate-700 shadow-sm cursor-pointer"
          >
            Fechar Janela
          </button>
        </div>

      </div>
    </div>
  );

  // Fallback close connection
  function onPrint() {
    onClose();
  }
}

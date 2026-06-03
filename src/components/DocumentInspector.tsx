import React, { useState, useEffect } from "react";
import { 
  X, Check, AlertCircle, FileCheck, ShieldCheck, 
  User, Calendar, Stamp, FileText, Info
} from "lucide-react";
import { Worker, DocumentStatus } from "../types";

interface DocumentInspectorProps {
  worker: Worker;
  docType: "aso" | "nr10" | "nr35";
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}

export default function DocumentInspector({
  worker,
  docType,
  isOpen,
  onClose,
  onApprove,
  onReject
}: DocumentInspectorProps) {
  // Checklist verification states
  const [checklist, setChecklist] = useState({
    nameCpfMatch: false,
    dateInRange: false,
    signatureDoctor: false,
    courseLoadValid: false // only for NRs
  });

  // Reset checklist when document type or worker changes
  useEffect(() => {
    setChecklist({
      nameCpfMatch: false,
      dateInRange: false,
      signatureDoctor: false,
      courseLoadValid: false
    });
  }, [worker.id, docType]);

  if (!isOpen) return null;

  // Document labels
  const docTitle = {
    aso: "Atestado de Saúde Ocupacional (ASO)",
    nr10: "Certificado de Segurança em Eletricidade (NR-10)",
    nr35: "Certificado de Trabalho em Altura (NR-35)"
  }[docType];

  const docCode = docType.toUpperCase();

  const isNRAviso = docType !== "aso";
  const allVerified = checklist.nameCpfMatch && checklist.dateInRange && checklist.signatureDoctor && (!isNRAviso || checklist.courseLoadValid);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="document-inspector-modal" 
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[90vh]"
      >
        {/* Left Side: Mock Scanned PDF Doc Preview */}
        <div className="flex-1 bg-white p-6 relative overflow-y-auto text-slate-800 flex flex-col justify-between min-h-[350px] md:min-h-0">
          <div className="space-y-6">
            {/* Header Document template */}
            <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1 relative">
              <div className="absolute top-0 left-0 text-[10px] uppercase font-mono bg-slate-900 text-white px-2 py-0.5 rounded-sm">
                PDF Simulado
              </div>
              <Stamp className="w-10 h-10 mx-auto text-slate-800" />
              <h4 className="font-sans font-extrabold text-xs uppercase tracking-wider text-slate-900">
                REPÚBLICA FEDERATIVA DO BRASIL
              </h4>
              <p className="text-[10px] font-sans font-medium text-slate-600">
                SISTEMA INTEGRADO DE SAÚDE E SEGURANÇA INDUSTRIAL
              </p>
              <p className="text-xs font-bold text-slate-950 underline mt-2 font-sans">
                {docTitle.toUpperCase()}
              </p>
            </div>

            {/* Main content body template */}
            <div className="space-y-4 text-xs font-sans">
              <p className="leading-relaxed">
                Declaramos para os devidos fins de conformidade legal e portuária da ArcelorMittal, que o profissional listado abaixo foi submetido a exames e avaliações técnicas detalhadas e encontra-se com parecer apto.
              </p>

              {/* Data Table block */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block uppercase font-mono text-[9px]">Nome do Cooperado</span>
                    <strong className="text-slate-900 uppercase font-sans text-xs">{worker.name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block uppercase font-mono text-[9px]">CPF do Cooperado</span>
                    <strong className="text-slate-900 font-mono text-xs">{worker.cpf}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-100">
                  <div>
                    <span className="text-slate-400 block uppercase font-mono text-[9px]">Empresa Contratante</span>
                    <strong className="text-slate-900 font-sans text-xs">{worker.companyName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block uppercase font-mono text-[9px]">CNPJ</span>
                    <strong className="text-slate-900 font-mono text-xs">{worker.companyCnpj}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-100">
                  <div>
                    <span className="text-slate-400 block uppercase font-mono text-[9px]">Função Registrada</span>
                    <strong className="text-slate-900 font-sans text-xs">{worker.role}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block uppercase font-mono text-[9px]">Status Técnico / Vigência</span>
                    <span className="text-emerald-700 font-bold text-[11px] font-sans flex items-center">
                      <ShieldCheck className="w-3.5 h-3.5 mr-1" /> ATIVO &amp; REGULAR
                    </span>
                  </div>
                </div>
              </div>

              {/* Document specific terms info */}
              {docType === "aso" ? (
                <div className="space-y-1 bg-emerald-50/50 p-2.5 rounded border border-emerald-100">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase font-mono block">Parecer Médico:</span>
                  <p className="text-[11px] text-emerald-950 inline-italic">
                    "O funcionário encontra-se APTO para o pleno exercício das atividades industriais de risco especificado, não apresentando contraindicações clínicas."
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5 bg-blue-50/70 p-2.5 rounded border border-blue-100">
                  <span className="text-[10px] font-bold text-blue-800 uppercase font-mono block">Ementa do Curso de Capacitação:</span>
                  <div className="grid grid-cols-2 gap-1.5 text-[10px] text-blue-950">
                    <div>• Teoria de Análise de Riscos</div>
                    <div>• EPI / EPC de uso mandatório</div>
                    <div>• Primeiros Socorros Aplicados</div>
                    <div>• Teste prático de campo com instrutor</div>
                  </div>
                  <div className="text-[10px] font-bold text-blue-900 pt-1 border-t border-blue-200">
                    Carga Horária Mínima Exigida: 16 Horas de treinamento.
                  </div>
                </div>
              )}
            </div>

            {/* Signature stamps */}
            <div className="grid grid-cols-2 gap-8 text-center pt-6 border-t border-slate-200">
              <div className="space-y-1">
                <div className="h-6 flex items-end justify-center">
                  <span className="font-mono text-xs text-slate-400 select-none inline-italic">Carlos E. O.</span>
                </div>
                <div className="h-[1px] bg-slate-300 w-full"></div>
                <span className="text-[9px] text-slate-500 block font-mono">Assinatura do Trabalhador</span>
              </div>

              <div className="space-y-1">
                <div className="h-6 flex flex-col items-center justify-end">
                  <span className="bg-blue-600/10 text-blue-700 text-[8px] font-bold px-1.5 py-0.2 rounded-sm select-none uppercase font-mono mb-0.5 border border-blue-300">
                    CRM/MTE HOMOLOGADO
                  </span>
                  <span className="font-mono text-[10px] font-bold text-slate-700 select-none">Dr. Eduardo Ramos de Góis</span>
                </div>
                <div className="h-[1px] bg-slate-300 w-full"></div>
                <span className="text-[9px] text-slate-500 block font-mono">
                  {docType === "aso" ? "Anotador Médico (CRM 14.852-ES)" : "Eng. de Segurança (CREA-ES 44.91)"}
                </span>
              </div>
            </div>
          </div>

          <div className="text-[9px] font-sans font-semibold text-slate-400 mt-6 flex justify-between uppercase">
            <span>Emitido em: 15/01/2026</span>
            <span>Autenticidade Criptografada: AM-SISTEMAS-VALIDATOR-2026</span>
          </div>
        </div>

        {/* Right Side: Interactive audit checklist */}
        <div className="md:w-96 bg-slate-900 p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-800 text-white">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold font-mono tracking-wider bg-orange-600 text-slate-950 px-1.5 py-0.5 rounded select-none">
                  AUDITORIA PORTARIA
                </span>
                <h3 className="font-sans font-bold text-white text-base">Checklist Técnico</h3>
              </div>
              <button 
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-normal">
              <strong>Procedimento de Segurança:</strong> Conforme os padrões ArcelorMittal, o inspetor precisa auditar e dar visto de conferência física abaixo para habilitar o deferimento.
            </p>

            <div className="space-y-3.5 pt-4">
              {/* Item 1 */}
              <label className="flex items-start space-x-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800 cursor-pointer select-none hover:border-slate-700 transition-colors">
                <input
                  type="checkbox"
                  checked={checklist.nameCpfMatch}
                  onChange={(e) => setChecklist({ ...checklist, nameCpfMatch: e.target.checked })}
                  className="rounded text-orange-500 focus:ring-orange-500 w-4 h-4 mt-0.5 border-slate-700 bg-slate-900"
                />
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">Nome e CPF são idênticos?</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">O CPF no PDF confere com o cadastro sistêmico: {worker.cpf}.</p>
                </div>
              </label>

              {/* Item 2 */}
              <label className="flex items-start space-x-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800 cursor-pointer select-none hover:border-slate-700 transition-colors">
                <input
                  type="checkbox"
                  checked={checklist.dateInRange}
                  onChange={(e) => setChecklist({ ...checklist, dateInRange: e.target.checked })}
                  className="rounded text-orange-500 focus:ring-orange-500 w-4 h-4 mt-0.5 border-slate-700 bg-slate-900"
                />
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">Documento está dentro da validade?</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Mínimo de 1 ano de vigência restante para evitar expiração em campo.</p>
                </div>
              </label>

              {/* Item 3 */}
              <label className="flex items-start space-x-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800 cursor-pointer select-none hover:border-slate-700 transition-colors">
                <input
                  type="checkbox"
                  checked={checklist.signatureDoctor}
                  onChange={(e) => setChecklist({ ...checklist, signatureDoctor: e.target.checked })}
                  className="rounded text-orange-500 focus:ring-orange-500 w-4 h-4 mt-0.5 border-slate-700 bg-slate-900"
                />
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">
                    {docType === "aso" ? "Carimbo & CRM válidos?" : "Visto de Engenheiro habilitado?"}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Presença visível do médico examinador e de seu número ativo de registro.</p>
                </div>
              </label>

              {/* Item 4 - Special Course validation */}
              {isNRAviso && (
                <label className="flex items-start space-x-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800 cursor-pointer select-none hover:border-slate-700 transition-colors">
                  <input
                    type="checkbox"
                    checked={checklist.courseLoadValid}
                    onChange={(e) => setChecklist({ ...checklist, courseLoadValid: e.target.checked })}
                    className="rounded text-orange-500 focus:ring-orange-500 w-4 h-4 mt-0.5 border-slate-700 bg-slate-900"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">Carga horária está correta (mín. 16h)?</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Certificados de NR devem expressar as horas e conteúdo técnico.</p>
                  </div>
                </label>
              )}
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-slate-800">
            {/* Guide Info */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 flex items-start space-x-2">
              <Info className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-400 leading-normal">
                {allVerified 
                  ? "Tudo pronto! O checklist foi auditado com sucesso. Selecione uma ação para atualizar a portaria."
                  : "Por favor, leia atentamente o documento simulado ao lado e marque todos os checks obrigatórios para liberar os botões de ação."
                }
              </p>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                disabled={!allVerified}
                onClick={() => {
                  onApprove();
                  onClose();
                }}
                className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-all text-white ${
                  allVerified 
                    ? "bg-emerald-600 hover:bg-emerald-500 cursor-pointer active:scale-95 shadow-md" 
                    : "bg-slate-850 text-slate-600 cursor-not-allowed"
                }`}
              >
                <Check className="w-4 h-4" />
                <span>Simular Deferimento</span>
              </button>

              <button
                onClick={() => {
                  onReject();
                  onClose();
                }}
                className="py-2 px-3 bg-red-950 border border-red-700/30 hover:bg-red-900 text-red-200 hover:text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer active:scale-95 shadow-md"
              >
                <X className="w-4 h-4" />
                <span>Recusar Doc</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

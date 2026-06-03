import React, { useState } from "react";
import { 
  Smartphone, Signal, Battery, Lock, Unlock, CheckCircle2, 
  Clock, XCircle, AlertCircle, Eye, ChevronRight, User, 
  MapPin, ShieldAlert, Award, QrCode, FileCheck, LogIn, ArrowLeft, RefreshCw, Fingerprint, FileText, Gift 
} from "lucide-react";
import { Worker, DocumentStatus } from "../types";
import { motion, AnimatePresence } from "motion/react";
import SafetyQuiz from "./SafetyQuiz";
import { SAFETY_QUESTIONS } from "../utils/mockData";
import CertificateModal from "./CertificateModal";
import { LanguageType, TRANSLATIONS } from "../utils/translations";

interface WorkerPortalProps {
  workers: Worker[];
  onUpdateWorker: (updated: Worker) => void;
  workerSelectedCpf?: string; // preselected CPF from admin portal
  currentLang?: LanguageType;
}

export default function WorkerPortal({ 
  workers, 
  onUpdateWorker,
  workerSelectedCpf,
  currentLang = "pt"
}: WorkerPortalProps) {
  const [cpfInput, setCpfInput] = useState(workerSelectedCpf || "");
  const [loggedInWorkerId, setLoggedInWorkerId] = useState<string | null>(
    workers.find(w => w.cpf === workerSelectedCpf)?.id || null
  );
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<"checklist" | "quiz" | "qrcode">("checklist");
  const [isPortalCertOpen, setIsPortalCertOpen] = useState(false);
  
  // Simulated clock
  const [currentTime] = useState("22:51");

  // Handle mobile login
  const handleLogin = (cpf: string) => {
    const cleaned = cpf.replace(/\D/g, "");
    const found = workers.find(w => w.cpf.replace(/\D/g, "") === cleaned);
    
    if (found) {
      setLoggedInWorkerId(found.id);
      setLoginError("");
      setActiveTab("checklist");
    } else {
      setLoginError("CPF não cadastrado. Verifique com o RH ou sua empresa parceira.");
    }
  };

  const handleLogout = () => {
    setLoggedInWorkerId(null);
    setCpfInput("");
  };

  const activeWorker = workers.find(w => w.id === loggedInWorkerId);

  // Sync if preselected CPF updates from parent
  React.useEffect(() => {
    if (workerSelectedCpf) {
      setCpfInput(workerSelectedCpf);
      const found = workers.find(w => w.cpf === workerSelectedCpf);
      if (found) {
        setLoggedInWorkerId(found.id);
        setActiveTab("checklist");
      }
    }
  }, [workerSelectedCpf, workers]);

  // Document requirement assessment:
  // Is worker fully approved for gate access?
  const isAsoOk = activeWorker?.asoStatus === DocumentStatus.APPROVED;
  const isNr10Ok = activeWorker?.nr10Status === DocumentStatus.APPROVED || activeWorker?.nr10Status === DocumentStatus.NOT_APPLICABLE;
  const isNr35Ok = activeWorker?.nr35Status === DocumentStatus.APPROVED || activeWorker?.nr35Status === DocumentStatus.NOT_APPLICABLE;
  const isQuizOk = activeWorker?.quizCompleted === true;
  const isFullyReleased = isAsoOk && isNr10Ok && isNr35Ok && isQuizOk;

  // Render a lovely visual block for NRs
  const renderDocumentCard = (
    title: string, 
    status: DocumentStatus, 
    iconText: string, 
    description: string
  ) => {
    let cardBg = "border-slate-200 bg-white";
    let statusIcon = <Clock className="w-5 h-5 text-slate-400" />;
    let statusText = "Pendente";
    let textColor = "text-slate-500 font-mono";

    if (status === DocumentStatus.APPROVED) {
      cardBg = "border-emerald-200 bg-emerald-50/20";
      statusIcon = <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      statusText = "Aprovado e Válido";
      textColor = "text-emerald-700 font-bold";
    } else if (status === DocumentStatus.UNDER_ANALYSIS) {
      cardBg = "border-amber-200 bg-amber-50/20";
      statusIcon = <Eye className="w-5 h-5 text-amber-500 animate-pulse" />;
      statusText = "Em Análise pela Portaria";
      textColor = "text-amber-700 font-medium";
    } else if (status === DocumentStatus.BLOCKED) {
      cardBg = "border-red-200 bg-red-50/20";
      statusIcon = <XCircle className="w-5 h-5 text-red-600" />;
      statusText = "Recusado / Vencido";
      textColor = "text-red-700 font-bold";
    } else if (status === DocumentStatus.NOT_APPLICABLE) {
      cardBg = "border-slate-200 bg-slate-100 opacity-70";
      statusIcon = <CheckCircle2 className="w-5 h-5 text-slate-400" />;
      statusText = "Não Exigido para esta Função";
      textColor = "text-slate-500";
    }

    return (
      <div className={`p-4 rounded-xl border ${cardBg} transition-all duration-200 flex items-start space-x-3`}>
        {/* Document type abstract representation bubble */}
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-900 text-white font-mono text-[10px] font-bold flex items-center justify-center">
          {iconText}
        </span>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-bold text-slate-900 leading-none">{title}</h5>
            <span className={`text-[10px] uppercase tracking-wide font-semibold ${textColor} flex items-center space-x-1`}>
              {statusIcon}
              <span className="hidden xs:inline">{statusText}</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">{description}</p>
          
          {status === DocumentStatus.BLOCKED && (
            <div className="text-[10px] text-red-800 font-medium bg-red-50 p-2 rounded mt-1.5 border border-red-200 leading-normal">
              ⚠️ Motivo: Documento ilegível ou data de validade expirada. Solicite a reemissão e envie novamente.
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center py-4">
      
      {/* 3D SmartPhone Frame (Simulated Mobile Device) */}
      <div className="w-full max-w-[395px] h-[780px] bg-slate-950 rounded-[48px] p-3.5 shadow-2xl border-4 border-slate-800 relative flex flex-col overflow-hidden">
        
        {/* Smartphone Hardware Elements */}
        {/* Camera Notch Area */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-950 rounded-b-2xl z-50 flex items-center justify-around px-4">
          <span className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-800 relative">
            <span className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-blue-900"></span>
          </span>
          <div className="w-12 h-1 bg-slate-900 rounded-full"></div>
        </div>

        {/* Dynamic iOS-style Status Bar */}
        <div className="flex items-center justify-between text-white text-[11px] font-semibold px-6 pt-3 pb-2 select-none z-40 bg-slate-950 shrink-0">
          <span className="font-mono">{currentTime}</span>
          <div className="flex items-center space-x-1.5">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">AM-Core 5G</span>
            <Signal className="w-3.5 h-3.5 text-white" />
            <Battery className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Smartphone Screen Viewport */}
        <div className="flex-1 bg-slate-100 rounded-[32px] overflow-hidden flex flex-col relative text-slate-800 shadow-inner">
          
          {/* Active Logged-In Mobile Screen */}
          {activeWorker ? (
            <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
              
              {/* App Mobile Internal Header */}
              <div className="bg-slate-900 text-white p-4 pt-5 shrink-0 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-full bg-orange-600 flex items-center justify-center font-bold text-sm text-white">
                      {activeWorker.name[0]}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold leading-none">{activeWorker.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-1 font-mono tracking-wide">{activeWorker.role}</p>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    title="Desconectar do app"
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Sub navbar navigation for Mobile view */}
              <div className="grid grid-cols-3 bg-white border-b border-slate-200 text-center shrink-0">
                <button
                  onClick={() => setActiveTab("checklist")}
                  className={`py-2.5 text-xs font-bold border-b-2 transition-all ${
                    activeTab === "checklist"
                      ? "border-orange-500 text-slate-900"
                      : "border-transparent text-slate-400"
                  }`}
                >
                  Documentos
                </button>
                <button
                  onClick={() => {
                    // Force watch if needed
                    setActiveTab("quiz");
                  }}
                  className={`py-2.5 text-xs font-bold border-b-2 transition-all ${
                    activeTab === "quiz"
                      ? "border-orange-500 text-slate-900"
                      : "border-transparent text-slate-400"
                  }`}
                >
                  Segurança {activeWorker.quizCompleted ? "✓" : ""}
                </button>
                <button
                  onClick={() => setActiveTab("qrcode")}
                  className={`py-2.5 text-xs font-bold border-b-2 transition-all ${
                    activeTab === "qrcode"
                      ? "border-orange-500 text-slate-900"
                      : "border-transparent text-slate-400"
                  }`}
                >
                  QR Pass
                </button>
              </div>

              {/* Mobile Content Safe Area - Scrollable */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                
                <AnimatePresence mode="wait">
                  
                  {/* TAB 1: Document Checklist */}
                  {activeTab === "checklist" && (
                    <motion.div
                      key="checklist"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="space-y-4"
                    >
                      {/* Gate Pass Status Header */}
                      <div className={`p-4 rounded-xl border text-center ${
                        isFullyReleased 
                          ? "bg-green-100 border-green-200 text-green-950" 
                          : "bg-red-50 border-red-100 text-red-950"
                      }`}>
                        {isFullyReleased ? (
                          <div className="space-y-2">
                            <Unlock className="w-8 h-8 text-green-600 mx-auto animate-bounce" />
                            <div>
                              <h4 className="font-bold text-xs uppercase tracking-wider">Acesso Liberado de Entrada</h4>
                              <p className="text-[11px] text-green-800 leading-normal mt-1">
                                Seu QR Code de portaria está ativo! Vá para a aba <strong>QR Pass</strong> para entrar na usina Tubarão.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Lock className="w-8 h-8 text-red-600 mx-auto" />
                            <div>
                              <h4 className="font-bold text-xs uppercase tracking-wider">Acesso Bloqueado na Portaria</h4>
                              <p className="text-[11px] text-red-800 leading-normal mt-1">
                                Complete seus envios obrigatórios de NR e realize o quiz de segurança para gerar seu QR Code de entrada.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Workers Action list */}
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Requisitos Obrigatórios</span>
                      
                      <div className="space-y-3">
                        {renderDocumentCard(
                          "ASO Ocupacional", 
                          activeWorker.asoStatus, 
                          "ASO", 
                          "Exame de aptidão para trabalho industrial na usina ArcelorMittal devidamente assinado."
                        )}

                        {activeWorker.nr10Status !== DocumentStatus.NOT_APPLICABLE && renderDocumentCard(
                          "NR-10 (Elétrica)", 
                          activeWorker.nr10Status, 
                          "10", 
                          "Curso obrigatório de segurança em eletricidade para eletrotécnicos autorizados."
                        )}

                        {activeWorker.nr35Status !== DocumentStatus.NOT_APPLICABLE && renderDocumentCard(
                          "NR-35 (Altura)", 
                          activeWorker.nr35Status, 
                          "35", 
                          "Certificação para atividades acima de 2 metros com uso de cabo de ancoragem."
                        )}

                        {/* Interactive Quiz Trigger Box */}
                        <div 
                          onClick={() => setActiveTab("quiz")}
                          className={`p-4 rounded-xl border text-left cursor-pointer transition-all hover:scale-[1.01] flex items-center justify-between ${
                            activeWorker.quizCompleted 
                              ? "bg-emerald-50/20 border-emerald-200" 
                              : "bg-orange-50/20 border-orange-200"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-900 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                              AM
                            </span>
                            <div>
                              <h5 className="text-xs font-bold text-slate-900">Vídeo-Treinamento e Quiz</h5>
                              <p className="text-[11px] text-slate-500 mt-1">
                                {activeWorker.quizCompleted 
                                  ? `Aprovado com ${activeWorker.quizScore}/3 acertos.` 
                                  : "Assista as regras para liberar seu quiz."}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            {activeWorker.quizCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-orange-600" />
                            )}
                          </div>
                        </div>

                        {/* Special Award Certification Card directly when completed */}
                        {activeWorker.quizCompleted && (
                          <div className="p-4 bg-gradient-to-br from-amber-500/10 to-orange-500/5 rounded-2xl border-2 border-dashed border-orange-400 flex flex-col space-y-3 shadow-inner">
                            <div className="flex items-start space-x-3">
                              <div className="w-9 h-9 rounded-full bg-orange-600 flex items-center justify-center text-white flex-shrink-0">
                                <Award className="w-5 h-5" />
                              </div>
                              <div className="space-y-0.5">
                                <h5 className="text-xs font-bold text-slate-900">Certificado Homologado</h5>
                                <p className="text-[10px] text-slate-500">Seu documento de regularidade civil está pronto para emissão digital.</p>
                              </div>
                            </div>

                            <button
                              onClick={() => setIsPortalCertOpen(true)}
                              className="w-full py-2 bg-slate-900 hover:bg-slate-850 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md"
                            >
                              <FileText className="w-4 h-4 text-orange-500" />
                              <span>Emitir Certificado (PDF)</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Portal Certificate Modal component instantiation */}
                      {activeWorker && (
                        <CertificateModal
                          worker={activeWorker}
                          isOpen={isPortalCertOpen}
                          onClose={() => setIsPortalCertOpen(false)}
                        />
                      )}

                    </motion.div>
                  )}

                  {/* TAB 2: Quiz interactive player */}
                  {activeTab === "quiz" && (
                    <motion.div
                      key="quiz"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                    >
                      <SafetyQuiz 
                        worker={activeWorker} 
                        onUpdateWorker={onUpdateWorker} 
                      />
                    </motion.div>
                  )}

                  {/* TAB 3: QR Code Generator gate screen */}
                  {activeTab === "qrcode" && (
                    <motion.div
                      key="qrcode"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      {isFullyReleased ? (
                        <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center space-y-4 shadow-sm">
                          <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] font-mono px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                            Portaria Liberada
                          </span>
                          
                          <h4 className="font-sans font-bold text-sm text-slate-900">
                            Passe Digital de Entrada de Campo
                          </h4>

                          {/* Simulating QR CODE image using customizable beautiful layout */}
                          <div className="bg-white p-4 rounded-xl border border-dashed border-slate-300 inline-block mx-auto">
                            <div className="relative flex items-center justify-center bg-slate-950 p-2.5 rounded-lg w-44 h-44 mx-auto">
                              {/* Realistic QR code blocks generated via vector simulation */}
                              <div className="absolute inset-2 bg-white flex flex-wrap p-2 rounded justify-between gap-1">
                                {/* Simulated QR pixels with our brand orange block center */}
                                <div className="w-8 h-8 border-4 border-slate-950 flex-shrink-0"></div>
                                <div className="w-8 h-8 border-4 border-slate-950 flex-shrink-0"></div>
                                <div className="w-8 h-8 border-4 border-slate-950 flex-shrink-0"></div>
                                <div className="w-full h-1 bg-slate-950 my-1"></div>
                                <div className="flex-1 grid grid-cols-6 gap-0.5">
                                  {Array.from({ length: 48 }).map((_, i) => (
                                    <div 
                                      key={i} 
                                      className={`h-2 w-2 rounded-2xs ${
                                        (i % 3 === 0 || i % 7 === 0 || i === 12 || i === 25 || i === 34) 
                                          ? "bg-slate-950" 
                                          : "bg-white"
                                      }`}
                                    ></div>
                                  ))}
                                </div>
                                {/* Central safety orange ArcelorMittal mini logo anchor */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 text-orange-500 font-mono text-[8px] font-extrabold p-1 rounded-sm border-2 border-white shadow">
                                  AM
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="text-left bg-slate-50 p-3 rounded-lg text-slate-700 space-y-1.5 font-sans border border-slate-200">
                            <div className="flex justify-between text-[11px] font-mono">
                              <span className="text-slate-400">Trabalhador:</span>
                              <span className="font-bold text-slate-800 truncate max-w-[180px]">{activeWorker.name}</span>
                            </div>
                            <div className="flex justify-between text-[11px] font-mono">
                              <span className="text-slate-400">CPF:</span>
                              <span className="font-bold text-slate-800">{activeWorker.cpf}</span>
                            </div>
                            <div className="flex justify-between text-[11px] font-mono">
                              <span className="text-slate-400">Empresa:</span>
                              <span className="font-bold text-slate-800">{activeWorker.companyName}</span>
                            </div>
                            <div className="flex justify-between text-[11px] font-mono">
                              <span className="text-slate-400">ID Acesso:</span>
                              <span className="font-bold text-orange-600">{activeWorker.qrCodeToken}</span>
                            </div>
                          </div>

                          <div className="p-3 bg-blue-50 text-blue-900 rounded-lg text-left text-[11px] flex items-start space-x-2 border border-blue-200">
                            <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5 animate-pulse" />
                            <p className="leading-relaxed">
                              Apresente este QR Code no leitor óptico das portarias das usinas Tubarão, Vitória ou Jeceaba para liberar a catraca física automaticamente.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center space-y-3 shadow-xs">
                          <Lock className="w-12 h-12 text-slate-300 mx-auto" />
                          <h4 className="font-sans font-bold text-sm text-slate-900">QR Code Bloqueado</h4>
                          
                          <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                            O QR Code de entrada automática só é disponibilizado após a validação presencial ou remota de todos os seus pré-requisitos corporativos.
                          </p>

                          <div className="text-left bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-200 text-xs">
                            <span className="font-bold text-slate-700">Pendências verificadas:</span>
                            
                            <ul className="space-y-2 text-slate-600 mt-1.5 font-mono text-[11px]">
                              <li className="flex items-center space-x-2">
                                <span className={`w-2.5 h-2.5 rounded-full ${isAsoOk ? "bg-green-500" : "bg-red-500 animate-ping"}`}></span>
                                <span>Aprovação de ASO Médica ({activeWorker.asoStatus})</span>
                              </li>
                              {activeWorker.nr10Status !== DocumentStatus.NOT_APPLICABLE && (
                                <li className="flex items-center space-x-2">
                                  <span className={`w-2.5 h-2.5 rounded-full ${isNr10Ok ? "bg-green-500" : "bg-red-500 animate-ping"}`}></span>
                                  <span>Conclusão Curso NR-10 ({activeWorker.nr10Status})</span>
                                </li>
                              )}
                              {activeWorker.nr35Status !== DocumentStatus.NOT_APPLICABLE && (
                                <li className="flex items-center space-x-2">
                                  <span className={`w-2.5 h-2.5 rounded-full ${isNr35Ok ? "bg-green-500" : "bg-red-500 animate-ping"}`}></span>
                                  <span>Conclusão Curso NR-35 ({activeWorker.nr35Status})</span>
                                </li>
                              )}
                              <li className="flex items-center space-x-2">
                                <span className={`w-2.5 h-2.5 rounded-full ${isQuizOk ? "bg-green-500" : "bg-red-500 animate-ping"}`}></span>
                                <span>Vídeo + Teste das Regras de Ouro ({activeWorker.quizCompleted ? "Aprovado" : "Pendente"})</span>
                              </li>
                            </ul>
                          </div>

                          <div className="bg-orange-500/10 text-orange-800 text-[10px] p-2.5 rounded border border-orange-500/20 text-left flex items-start space-x-1.5 leading-normal">
                            <ShieldAlert className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-orange-600" />
                            <p>
                              <strong>Dica do Mentor técnico:</strong> Use a aba <strong>Empresa Parceira</strong> (topo do painel) para enviar todos os documentos de NRs e aprovar no Painel do Portaria lateral! Assim você vê o QR Code liberar imediatamente!
                            </p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                </AnimatePresence>

              </div>

              {/* Bottom Mobile iOS bar */}
              <div className="h-6 bg-slate-900 border-t border-slate-800 flex items-center justify-center shrink-0">
                <div className="w-24 h-1 bg-slate-400 rounded-full"></div>
              </div>

            </div>
          ) : (
            /* Login screen inside phone */
            <div className="flex-1 p-6 flex flex-col justify-between bg-slate-900 text-white">
              
              {/* Top visuals */}
              <div className="space-y-4 text-center mt-12">
                <div className="w-16 h-16 bg-orange-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg animate-bounce">
                  <Fingerprint className="w-9 h-9" />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-lg tracking-tight">Onboarding Terceiros</h3>
                  <p className="text-[11px] text-slate-400 font-mono text-center max-w-xs mx-auto mt-1 uppercase">
                    Portaria Digital Integrada ArcelorMittal
                  </p>
                </div>
              </div>

              {/* Input details */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider font-mono text-slate-400 block font-bold">
                    Identificação por CPF do Trabalhador:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 123.456.789-00"
                    value={cpfInput}
                    onChange={(e) => setCpfInput(e.target.value)}
                    className="w-full bg-slate-950 font-mono text-sm px-4 py-3 rounded-xl border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-orange-500 text-center"
                  />
                  {loginError && (
                    <span className="text-[10px] text-red-500 leading-tight block text-center">
                      ⚠ {loginError}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleLogin(cpfInput)}
                  className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-[0.98] flex items-center justify-center space-x-1"
                >
                  <LogIn className="w-4 h-4 mr-1 pb-0.5" />
                  <span>Acessar Meu Cadastro</span>
                </button>
              </div>

              {/* Shortcuts for user simulation ease */}
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold block">
                  Escolha um perfil para simular rápido:
                </span>
                
                <div className="grid grid-cols-2 gap-1.5">
                  {workers.map((w, idx) => (
                    <button
                      key={w.id}
                      onClick={() => {
                        setCpfInput(w.cpf);
                        handleLogin(w.cpf);
                      }}
                      className="text-[9px] text-left truncate p-1.5 bg-slate-900 border border-slate-800 rounded hover:border-slate-700 font-mono text-slate-300"
                    >
                      👤 {w.name.split(" ")[0]} ({w.quizCompleted ? "Aprovado" : "Quiz Pendente"})
                    </button>
                  ))}
                </div>
              </div>

              {/* footer copyright / security message */}
              <div className="text-[9px] text-slate-500 text-center font-mono">
                ArcelorMittal Sistemas de Portaria Segura • Licença 2026
              </div>

            </div>
          )}

        </div>
      </div>
      
      {/* Short usage instructions beneath mock phone */}
      <p className="text-xs text-slate-500 font-medium text-center mt-3 max-w-sm">
        📱 Esta simulação representa a experiência mobile do trabalhador ao chegar na portaria da usina.
      </p>
    </div>
  );
}

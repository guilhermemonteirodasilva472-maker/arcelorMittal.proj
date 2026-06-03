import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import CompanyPortal from "./components/CompanyPortal";
import WorkerPortal from "./components/WorkerPortal";
import InteractiveTutorial from "./components/InteractiveTutorial";
import { Worker, DocumentStatus } from "./types";
import { getStoredWorkers, saveWorkers, INITIAL_WORKERS } from "./utils/mockData";
import { HelpCircle, ChevronRight, CheckCircle, Smartphone, Award, ClipboardCheck } from "lucide-react";
import { LanguageType, TRANSLATIONS } from "./utils/translations";

export default function App() {
  const [persona, setPersona] = useState<"company" | "worker">("company");
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [selectedMobileWorkerCpf, setSelectedMobileWorkerCpf] = useState<string>("");
  const [lang, setLang] = useState<LanguageType>("pt");

  // Load workers
  useEffect(() => {
    const data = getStoredWorkers();
    setWorkers(data);
  }, []);

  const handleUpdateWorkers = (updatedList: Worker[]) => {
    setWorkers(updatedList);
    saveWorkers(updatedList);
  };

  const handleUpdateSingleWorker = (updatedWorker: Worker) => {
    const updatedList = workers.map(w => w.id === updatedWorker.id ? updatedWorker : w);
    setWorkers(updatedList);
    saveWorkers(updatedList);
  };

  const handleResetDemoData = () => {
    const confirmMsg = TRANSLATIONS[lang].btnResetConfirm;
    if (confirm(confirmMsg)) {
      localStorage.removeItem("cl_onboarding_workers");
      setWorkers(INITIAL_WORKERS);
      setSelectedMobileWorkerCpf("");
      alert(TRANSLATIONS[lang].alertReset);
    }
  };

  const handleSelectWorkerForMobile = (cpf: string) => {
    setSelectedMobileWorkerCpf(cpf);
    setPersona("worker");
  };

  const handleSimulateLucas = (lucas: Worker) => {
    const filtered = workers.filter(w => w.id !== lucas.id);
    const newList = [lucas, ...filtered];
    setWorkers(newList);
    saveWorkers(newList);
    setSelectedMobileWorkerCpf(lucas.cpf);
    
    const message = {
      pt: "Simulação de Lucas Mendes ativada!\n\nEle foi adicionado no sistema como Soldador da Sul Metalúrgica.\n\nPróximos passos sugeridos:\n1. Vá na aba 'Empresa Parceira' abaixo para auditar seus documentos.\n2. Alterne para a aba 'Trabalhador (Mobile)' e faça login com seu CPF para concluir o treinamento!",
      en: "Lucas Mendes simulation enabled!\n\nHe has been registered as an Industrial Welder for Sul Metalúrgica.\n\nRecommended next steps:\n1. Check 'Partner Company' tab below to review/audit his PDFs.\n2. Switch to 'Worker (Mobile)' and log in using his CPF to take the safety video and quiz!",
      es: "¡Simulación de Lucas Mendes activada!\n\nSe ha añadido como Soldador Mecánico para Sul Metalúrgica.\n\nPasos recomendados:\n1. Mire la pestaña 'Empresa Contratista' abajo para auditar sus archivos.\n2. Cambie a 'Trabajador (Móvil)' e inicie sesión con su CPF para tomar el entrenamiento teórico!"
    }[lang];
    
    alert(message);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header component */}
      <Header 
        currentPersona={persona} 
        setPersona={setPersona} 
        onReset={handleResetDemoData} 
        currentLang={lang}
        setLang={setLang}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* Dynamic Instructional Banner (Mentor Guidance Box) */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl border border-slate-800 text-white p-6 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/5 rounded-full blur-3xl"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-3xl">
              <span className="bg-orange-500 text-slate-950 font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                {TRANSLATIONS[lang].subtitleBanner}
              </span>
              <h1 className="font-sans font-bold text-lg md:text-xl text-white tracking-tight">
                {TRANSLATIONS[lang].titleBanner}
              </h1>
              <p className="text-xs text-slate-300 leading-relaxed">
                {TRANSLATIONS[lang].helperTextBanner}
              </p>
            </div>
            
            <div className="flex-shrink-0 bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2 max-w-xs">
              <p className="text-[10px] font-bold uppercase text-orange-400 tracking-wider font-mono">
                {lang === "en" ? "ACADEMIC FLOW TIPS" : lang === "es" ? "CONSEJOS DE FLUJO" : "DICA DE FLUXO ACADÊMICO"}
              </p>
              <div className="flex items-center space-x-1.5 text-xs text-slate-200">
                <span className="font-bold text-orange-500">1.</span>
                <span>{TRANSLATIONS[lang].flowStep1}</span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-slate-200">
                <span className="font-bold text-orange-500">2.</span>
                <span>{TRANSLATIONS[lang].flowStep2}</span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-slate-200">
                <span className="font-bold text-orange-500">3.</span>
                <span>{TRANSLATIONS[lang].flowStep3}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Tutorial Component */}
        <InteractiveTutorial 
          currentLang={lang} 
          workers={workers} 
          onSimulateLucas={handleSimulateLucas} 
        />

        {/* Dynamic Views based on persona */}
        {persona === "company" ? (
          <div className="space-y-6">
            <CompanyPortal 
              workers={workers}
              onUpdateWorkers={handleUpdateWorkers}
              onSelectWorkerForMobile={handleSelectWorkerForMobile}
              currentLang={lang}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 rounded-2xl border border-slate-200">
            {/* Guide Explainer left column */}
            <div className="lg:col-span-6 space-y-5">
              <span className="bg-green-500/10 text-green-700 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-green-500/20 uppercase tracking-wider">
                {TRANSLATIONS[lang].mobileUXSubtitle}
              </span>
              <h2 className="font-sans font-bold text-slate-900 text-lg md:text-xl tracking-tight">
                {TRANSLATIONS[lang].mobileUXTitle}
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === "en" 
                  ? "Field workers and technical personnel access the customized system directly on their smart devices through SMS hyperlinks or QR terminal codes. The user interface has been engineered to withstand glare, dust, visual fatigue, and glove-wearing constraints."
                  : lang === "es"
                  ? "Los trabajadores de campo y el personal técnico acceden al sistema directamente en sus dispositivos inteligentes mediante enlaces SMS o códigos QR. La interfaz ha sido diseñada para soportar reflejos, fatiga visual y el uso de guantes de protección."
                  : "Operários e prestadores de serviços de campo acessam o sistema diretamente de seus celulares através de links SMS ou totens de acesso. A interface foi desenhada seguindo rigorosos padrões de usabilidade para cansaço visual, luvas de proteção (grandes alvos de toque) e alto contraste para uso sob luz solar intensa."
                }
              </p>

              <div className="space-y-3.5">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start space-x-3.5">
                  <div className="p-2 bg-slate-900 rounded-lg text-white">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{TRANSLATIONS[lang].mobileUXCard1Title}</h4>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {TRANSLATIONS[lang].mobileUXCard1Desc}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start space-x-3.5">
                  <div className="p-2 bg-orange-600/10 text-orange-600 rounded-lg">
                    <ClipboardCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{TRANSLATIONS[lang].mobileUXCard2Title}</h4>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {TRANSLATIONS[lang].mobileUXCard2Desc}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start space-x-3.5">
                  <div className="p-2 bg-green-100 text-green-700 rounded-lg">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{TRANSLATIONS[lang].mobileUXCard3Title}</h4>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {TRANSLATIONS[lang].mobileUXCard3Desc}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Smartphone simulator right column */}
            <div className="lg:col-span-6 flex justify-center">
              <WorkerPortal 
                workers={workers}
                onUpdateWorker={handleUpdateSingleWorker}
                workerSelectedCpf={selectedMobileWorkerCpf}
                currentLang={lang}
              />
            </div>
          </div>
        )}

      </main>

      {/* Corporate footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
          <p className="text-xs text-slate-500">
            <strong>Trabalho de Conclusão de Curso Acadêmico</strong> • Central de Integração e Treinamento de Terceiros (Onboarding Digital - ArcelorMittal)
          </p>
          <p className="text-[10px] text-slate-400 font-mono">
            Versão para fins didáticos de UX/UI e Modelagem Relacional de Portarias Seguras © 2026.
          </p>
        </div>
      </footer>
    </div>
  );
}

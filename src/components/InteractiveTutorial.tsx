import React from "react";
import { 
  BookOpen, Compass, Gift, ArrowRight, UserCheck, 
  Settings, CheckSquare, Sparkles, Smartphone, Award
} from "lucide-react";
import { Worker, DocumentStatus } from "../types";
import { TRANSLATIONS, LanguageType } from "../utils/translations";

interface InteractiveTutorialProps {
  currentLang: LanguageType;
  workers: Worker[];
  onSimulateLucas: (worker: Worker) => void;
}

export default function InteractiveTutorial({
  currentLang,
  workers,
  onSimulateLucas
}: InteractiveTutorialProps) {
  const t = TRANSLATIONS[currentLang];

  const handleTriggerSimulation = () => {
    // Generate a high fidelity demo preset for Lucas Mendes
    const mockLucas: Worker = {
      id: "w-lucas-mendes",
      name: "Lucas Mendes de Oliveira",
      cpf: "044.891.123-55",
      companyName: "Sul Metalúrgica LTDA",
      companyCnpj: "12.345.678/0001-99",
      role: currentLang === "en" ? "Industrial Welder" : currentLang === "es" ? "Soldador Industrial" : "Soldador Industrial",
      asoStatus: DocumentStatus.UNDER_ANALYSIS,
      asoFileUrl: "aso_lucas_mendes_simulado.pdf",
      nr10Status: DocumentStatus.PENDING, // needs company to fill or upload
      nr35Status: DocumentStatus.UNDER_ANALYSIS,
      nr35FileUrl: "nr35_lucas_mendes_simulado.pdf",
      videoWatched: false,
      videoWatchedDuration: 0,
      quizCompleted: false,
      qrCodeToken: undefined
    };

    onSimulateLucas(mockLucas);
  };

  const isLucasAlreadyInDemo = workers.some(w => w.id === "w-lucas-mendes");

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 relative overflow-hidden" id="interactive-tutorial-section">
      <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-orange-500 to-orange-600"></div>
      
      <div className="space-y-4">
        {/* Header Title with localized badges */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 bg-orange-600/10 text-orange-600 rounded-xl mt-0.5">
              <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <h2 className="font-sans font-bold text-slate-900 text-sm md:text-base">
                {t.tutorialTitle}
              </h2>
              <p className="text-xs text-slate-500">
                {t.tutorialSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="bg-slate-100 text-slate-700 font-mono text-[9px] font-bold px-2 py-1 rounded-md border border-slate-200">
              {t.tutorialFictionalLabel}: <strong className="text-orange-600">Lucas Mendes</strong>
            </span>
            <span className="bg-orange-500 text-slate-950 font-mono text-[9px] font-bold px-2 py-1 rounded-md">
              CPF: 044.891.123-55
            </span>
          </div>
        </div>

        {/* Introduction text */}
        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200/60">
          ✨ <strong>{currentLang === "en" ? "How to use this prototype" : currentLang === "es" ? "Cómo usar este prototipo" : "Como utilizar este protótipo"}:</strong> {t.tutorialIntro} <strong>Lucas Mendes</strong>. {currentLang === "en" ? "He represents a typical contractor arriving at the steel plant. Toggle languages or trigger the simulator to see his status progress instantly." : currentLang === "es" ? "Representa a un contratista típico que llega a la planta metalúrgica. Cambie idiomas o inicie la simulación para ver el progreso de su estatus." : "Ele representa um contratista típico que chega à usina siderúrgica. Mude os idiomas ou inicie a simulação para ver o progresso do seu status."}
        </p>

        {/* 4 Interactive Visual Steps cards layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {t.tutorialSteps.map((step, idx) => {
            const stepColors = [
              "border-l-indigo-500 text-indigo-600 bg-indigo-50/30",
              "border-l-amber-500 text-amber-600 bg-amber-50/30",
              "border-l-blue-500 text-blue-600 bg-blue-50/30",
              "border-l-emerald-500 text-emerald-600 bg-emerald-50/30"
            ];
            
            return (
              <div 
                key={idx} 
                className={`p-3.5 rounded-xl border border-slate-150 border-l-4 ${stepColors[idx]} flex flex-col justify-between space-y-2`}
              >
                <div>
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider font-mono">
                      {step.badge}
                    </span>
                    <span className="w-4 h-4 rounded-full bg-white flex items-center justify-center border border-slate-200 text-[10px] font-mono font-bold text-slate-500">
                      {idx + 1}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">
                    {step.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Central interactive automation button to instantly load Lucas Mendes in appropriate state */}
        <div className="pt-2">
          <button
            onClick={handleTriggerSimulation}
            className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2.5 transition-all text-white border select-none ${
              isLucasAlreadyInDemo
                ? "bg-slate-900 hover:bg-slate-800 border-slate-850 shadow-md transform hover:-translate-y-0.5"
                : "bg-orange-600 hover:bg-orange-500 border-orange-700 shadow-md tracking-wide transform hover:-translate-y-0.5 animate-bounce"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300 flex-shrink-0 animate-pulse" />
            <span>
              {isLucasAlreadyInDemo 
                ? (currentLang === "en" ? "🔄 Reset / Reload Lucas Mendes Simulation" : currentLang === "es" ? "🔄 Restablecer / Recargar Simulación de Lucas Mendes" : "🔄 Resetar / Recarregar Simulação do Lucas Mendes")
                : t.tutorialActionText
              }
            </span>
          </button>
        </div>

      </div>
    </div>
  );
}

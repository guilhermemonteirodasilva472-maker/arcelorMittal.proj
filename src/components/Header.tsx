import React from "react";
import { HardHat, ShieldCheck, RefreshCw, Users, Globe } from "lucide-react";
import { LanguageType, TRANSLATIONS } from "../utils/translations";

interface HeaderProps {
  currentPersona: "company" | "worker";
  setPersona: (persona: "company" | "worker") => void;
  onReset: () => void;
  currentLang: LanguageType;
  setLang: (lang: LanguageType) => void;
}

export default function Header({ 
  currentPersona, 
  setPersona, 
  onReset,
  currentLang,
  setLang
}: HeaderProps) {
  const t = TRANSLATIONS[currentLang];

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-3 md:h-16 gap-3">
          {/* Logo Brand */}
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center w-10 h-10 bg-orange-600 rounded-lg text-white shadow-lg overflow-hidden">
              <HardHat className="w-6 h-6 animate-pulse" />
              <div className="absolute top-0 right-0 w-2 h-2 bg-green-400 rounded-full border border-slate-950"></div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-sans font-bold tracking-tight text-lg text-white">
                  ArcelorMittal
                </span>
                <span className="bg-orange-500 text-slate-950 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                  {currentLang === "en" ? "PLANTS" : currentLang === "es" ? "PLANTAS" : "USINAS"}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wider uppercase font-mono">
                {currentLang === "en" ? "Third-Party Onboarding" : currentLang === "es" ? "Onboarding de Terceros" : "Onboarding de Terceiros"}
              </p>
            </div>
          </div>

          {/* Navigation Switches & Language Switcher */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Language Picker */}
            <div className="bg-slate-950 p-1 rounded-xl flex border border-slate-800 items-center space-x-1">
              <span className="p-1 text-slate-500 hidden sm:inline" title="Alterar Idioma / Change Language">
                <Globe className="w-3.5 h-3.5" />
              </span>
              <button
                onClick={() => setLang("pt")}
                className={`px-2 py-1 rounded text-[10px] font-bold font-mono transition-all uppercase flex items-center space-x-1 ${
                  currentLang === "pt"
                    ? "bg-orange-600 text-slate-950 font-black shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
                title="Português"
              >
                <span>🇧🇷</span> <span className="hidden xs:inline">PT</span>
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-2 py-1 rounded text-[10px] font-bold font-mono transition-all uppercase flex items-center space-x-1 ${
                  currentLang === "en"
                    ? "bg-orange-600 text-slate-950 font-black shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
                title="English"
              >
                <span>🇺🇸</span> <span className="hidden xs:inline">EN</span>
              </button>
              <button
                onClick={() => setLang("es")}
                className={`px-2 py-1 rounded text-[10px] font-bold font-mono transition-all uppercase flex items-center space-x-1 ${
                  currentLang === "es"
                    ? "bg-orange-600 text-slate-950 font-black shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
                title="Español"
              >
                <span>🇪🇸</span> <span className="hidden xs:inline">ES</span>
              </button>
            </div>

            <div className="bg-slate-950 p-1 rounded-xl flex border border-slate-800">
              <button
                id="btn-persona-company"
                onClick={() => setPersona("company")}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  currentPersona === "company"
                    ? "bg-slate-800 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Users className="w-3.5 h-3.5 text-orange-500" />
                <span>{t.partnerCompanyPersona}</span>
              </button>
              
              <button
                id="btn-persona-worker"
                onClick={() => setPersona("worker")}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  currentPersona === "worker"
                    ? "bg-slate-800 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                <span>{t.workerPersona}</span>
              </button>
            </div>

            <button
              id="btn-reset-demo"
              onClick={onReset}
              title={t.btnReset}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-slate-800"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Brand Safety Strip Alert */}
      <div className="bg-amber-500 text-slate-950 text-xs px-4 py-1.5 text-center font-semibold font-mono tracking-wide flex items-center justify-center space-x-2">
        <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
        <span className="text-[10px] sm:text-xs">{t.goldRulesAlert}</span>
      </div>
    </header>
  );
}

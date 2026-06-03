import React from "react";
import { HardHat, ShieldCheck, RefreshCw, Users, Key } from "lucide-react";

interface HeaderProps {
  currentPersona: "company" | "worker";
  setPersona: (persona: "company" | "worker") => void;
  onReset: () => void;
}

export default function Header({ currentPersona, setPersona, onReset }: HeaderProps) {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
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
                  Usinas
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wider uppercase font-mono">
                Onboarding de Terceiros
              </p>
            </div>
          </div>

          {/* Navigation Switches */}
          <div className="flex items-center space-x-4">
            <span className="text-xs text-slate-400 font-medium hidden md:inline">
              Ambiente de Demonstração Acadêmica:
            </span>
            
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
                <span>Empresa Parceira</span>
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
                <span>Trabalhador (Mobile)</span>
              </button>
            </div>

            <button
              id="btn-reset-demo"
              onClick={onReset}
              title="Resetar dados locais da simulação"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-slate-800"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Brand Safety Strip Alert */}
      <div className="bg-amber-500 text-slate-950 text-xs px-4 py-1 text-center font-semibold font-mono tracking-wide flex items-center justify-center space-x-2">
        <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
        <span>REGRAS DE OURO ARCELORMITTAL: SEGURANÇA EM PRIMEIRO LUGAR - TOLERÂNCIA ZERO A DESVIOS</span>
      </div>
    </header>
  );
}

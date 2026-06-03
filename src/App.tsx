import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import CompanyPortal from "./components/CompanyPortal";
import WorkerPortal from "./components/WorkerPortal";
import { Worker, DocumentStatus } from "./types";
import { getStoredWorkers, saveWorkers, INITIAL_WORKERS } from "./utils/mockData";
import { HelpCircle, ChevronRight, CheckCircle, Smartphone, Award, ClipboardCheck } from "lucide-react";

export default function App() {
  const [persona, setPersona] = useState<"company" | "worker">("company");
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [selectedMobileWorkerCpf, setSelectedMobileWorkerCpf] = useState<string>("");

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
    if (confirm("Deseja resetar a simulação para o estado inicial de fábrica?")) {
      localStorage.removeItem("am_onboarding_workers");
      setWorkers(INITIAL_WORKERS);
      setSelectedMobileWorkerCpf("");
      alert("Dados resetados!");
    }
  };

  const handleSelectWorkerForMobile = (cpf: string) => {
    setSelectedMobileWorkerCpf(cpf);
    setPersona("worker");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header component */}
      <Header 
        currentPersona={persona} 
        setPersona={setPersona} 
        onReset={handleResetDemoData} 
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* Dynamic Instructional Banner (Mentor Guidance Box) */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl border border-slate-800 text-white p-6 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/5 rounded-full blur-3xl"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-3xl">
              <span className="bg-orange-500 text-slate-950 font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                Mentoria Técnica UI/UX & Dev Sênior
              </span>
              <h1 className="font-sans font-bold text-lg md:text-xl text-white tracking-tight">
                Central de Integração e Onboarding de Terceiros — Protótipo de Engenharia
              </h1>
              <p className="text-xs text-slate-300 leading-relaxed">
                Este sistema simula o fim de filas físicas e eliminação de processos burocráticos manuais. 
                Use a aba <strong>Empresa Parceira</strong> abaixo para cadastrar eletricistas ou mecânicos, preencher e submeter seus documentos obrigatórios e simular a aprovação técnica deles. 
                Depois, troque para o modo <strong>Trabalhador (Mobile)</strong> para assistir ao treinamento animado, responder ao quiz interativo de segurança e liberar o selo QR Code de acesso instantâneo na portaria física!
              </p>
            </div>
            
            <div className="flex-shrink-0 bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2 max-w-xs">
              <p className="text-[10px] font-bold uppercase text-orange-400 tracking-wider font-mono">Dica de Fluxo Acadêmico</p>
              <div className="flex items-center space-x-1.5 text-xs text-slate-200">
                <span className="font-bold text-orange-500">1.</span>
                <span>Submeta as NRs no Painel da Empresa</span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-slate-200">
                <span className="font-bold text-orange-500">2.</span>
                <span>Aprove os documentos no Painel Direita</span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-slate-200">
                <span className="font-bold text-orange-500">3.</span>
                <span>Emule o trabalhador no celular e faça o Quiz!</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Views based on persona */}
        {persona === "company" ? (
          <div className="space-y-6">
            <CompanyPortal 
              workers={workers}
              onUpdateWorkers={handleUpdateWorkers}
              onSelectWorkerForMobile={handleSelectWorkerForMobile}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 rounded-2xl border border-slate-200">
            {/* Guide Explainer left column */}
            <div className="lg:col-span-6 space-y-5">
              <span className="bg-green-500/10 text-green-700 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-green-500/20 uppercase tracking-wider">
                Simulação Smartphone
              </span>
              <h2 className="font-sans font-bold text-slate-900 text-lg md:text-xl tracking-tight">
                Mobile-First UX: Interface Direta com o Trabalhador de Campo
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Operários e prestadores de serviços de campo acessam o sistema diretamente de seus celulares 
                através de links SMS ou totens de acesso. A interface foi desenhada seguindo rigorosos padrões de 
                usabilidade para cansaço visual, luvas de proteção (grandes alvos de toque) e alto contraste para 
                uso sob luz solar intensa.
              </p>

              <div className="space-y-3.5">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start space-x-3.5">
                  <div className="p-2 bg-slate-900 rounded-lg text-white">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Alvos de Clique Ampliados (Mín. 44px)</h4>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Teclados de CPF simplificados e cards largos para evitar erros de clique de operários que regressam do trecho.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start space-x-3.5">
                  <div className="p-2 bg-orange-600/10 text-orange-600 rounded-lg">
                    <ClipboardCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Acessibilidade Cromática (Color-Safe)</h4>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Os estados de aprovação usam tanto símbolos e ícones gráficos distintos quanto cores. Usuários daltônicos conseguem ler o texto e distinguir as formas instantaneamente sem confusão.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start space-x-3.5">
                  <div className="p-2 bg-green-100 text-green-700 rounded-lg">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Lógica Gated (Passe Seguro de Entrada)</h4>
                    <p className="text-[11px] text-slate-500 mt-1">
                      O QR code dinâmico possui autenticação criptografada simulada que muda automaticamente de Bloqueado para Ativo apenas com aprovação de 100% dos requisitos mandatórios.
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

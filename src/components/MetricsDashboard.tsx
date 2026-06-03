import React from "react";
import { 
  TrendingUp, Award, Clock, FileBadge, Activity, CheckCircle, 
  AlertTriangle, Users, Landmark, FileText 
} from "lucide-react";
import { Worker, DocumentStatus } from "../types";

interface MetricsDashboardProps {
  workers: Worker[];
}

export default function MetricsDashboard({ workers }: MetricsDashboardProps) {
  // Aggregate statistics
  const total = workers.length;
  const approved = workers.filter(w => w.qrCodeToken).length;
  const underReview = workers.filter(w => 
    w.asoStatus === DocumentStatus.UNDER_ANALYSIS ||
    w.nr10Status === DocumentStatus.UNDER_ANALYSIS ||
    w.nr35Status === DocumentStatus.UNDER_ANALYSIS
  ).length;
  const blocked = workers.filter(w => 
    w.asoStatus === DocumentStatus.BLOCKED ||
    w.nr10Status === DocumentStatus.BLOCKED ||
    w.nr35Status === DocumentStatus.BLOCKED
  ).length;
  const pending = total - approved - underReview - blocked;

  const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;

  // Real-time Event Feed simulation
  const mockLogs = [
    { time: "Há 1 min", msg: "Portaria C2: Carlos Silva liberou com crachá QR-Code", type: "success" },
    { time: "Há 12 min", msg: "Análise: ASO de Mariana Souza aceito após auditoria de CRM", type: "info" },
    { time: "Há 41 min", msg: "Sistema: Bloqueio automático de Roberto Gonçalves por ASO expirado", type: "warning" },
    { time: "Há 1 hora", msg: "Empresa: Sul Metalúrgica cadastrou Jeferson de Oliveira na base", type: "neutral" }
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6" id="metrics-dashboard-container">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-orange-600/10 text-orange-600 rounded-lg">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-slate-900 text-sm md:text-base">Painel Analítico de Conformidade</h3>
            <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Tempo Real das Contratadas</p>
          </div>
        </div>
        <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold font-mono tracking-wider bg-orange-100 text-orange-850 animate-pulse">
          • LIVE METRICS
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Metric 1: Visual Gauge (Doughnut Simulation) */}
        <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl flex flex-col justify-between h-48">
          <div className="flex justify-between items-start">
            <h4 className="text-xs font-bold text-slate-700 uppercase font-mono">Taxa de Liberação de Acesso</h4>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>

          <div className="flex items-center justify-center space-x-6 py-2">
            {/* Simple Elegant SVG Ring Chart */}
            <div className="relative w-24 h-24">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-500 transition-all duration-700 stroke-dasharray"
                  strokeWidth="3.5"
                  strokeDasharray={`${approvalRate}, 100`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold font-mono text-slate-900">{approvalRate}%</span>
                <span className="text-[8px] text-slate-400 font-mono font-bold uppercase">Aprovados</span>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-slate-600 font-mono">{approved} Ativos</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span className="text-slate-600 font-mono">{blocked} Barrados</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                <span className="text-slate-600 font-mono">{pending} Restantes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Metric 2: Document statuses details */}
        <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl flex flex-col justify-between h-48">
          <h4 className="text-xs font-bold text-slate-700 uppercase font-mono mb-2">Resumo Técnico Geral</h4>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white p-2.5 rounded-lg border border-slate-100 flex flex-col justify-between shadow-xs">
              <span className="text-[10px] text-slate-400 font-mono">ASOs Regulares</span>
              <span className="text-base font-bold font-mono text-slate-900 mt-1">
                {workers.filter(w => w.asoStatus === DocumentStatus.APPROVED).length}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-slate-100 flex flex-col justify-between shadow-xs">
              <span className="text-[10px] text-slate-400 font-mono">NRs Validadas</span>
              <span className="text-base font-bold font-mono text-slate-900 mt-1">
                {workers.filter(w => w.nr10Status === DocumentStatus.APPROVED).length + 
                 workers.filter(w => w.nr35Status === DocumentStatus.APPROVED).length}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-slate-100 flex flex-col justify-between shadow-xs">
              <span className="text-[10px] text-slate-400 font-mono">Quiz Concluídos</span>
              <span className="text-base font-bold font-mono text-slate-900 mt-1">
                {workers.filter(w => w.quizCompleted).length}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-slate-100 flex flex-col justify-between shadow-xs">
              <span className="text-[10px] text-slate-400 font-mono">Sob Análise</span>
              <span className="text-base font-bold font-mono text-amber-600 mt-1">
                {underReview}
              </span>
            </div>
          </div>
        </div>

        {/* Metric 3: Live Gate Activity Log */}
        <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl flex flex-col justify-between h-48">
          <h4 className="text-xs font-bold text-slate-700 uppercase font-mono flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-orange-500" />
            <span>Fluxo de Eventos Recentes</span>
          </h4>

          <div className="space-y-2 mt-2 h-32 overflow-y-auto pr-1">
            {mockLogs.map((log, idx) => {
              let tagStyle = "bg-slate-200 text-slate-800";
              if (log.type === "success") tagStyle = "bg-emerald-150 text-emerald-800";
              if (log.type === "warning") tagStyle = "bg-red-100 text-red-800";
              if (log.type === "info") tagStyle = "bg-blue-100 text-blue-800";

              return (
                <div key={idx} className="flex items-start space-x-2 text-[10px] font-sans">
                  <span className={`px-1.5 py-0.2 rounded font-mono text-[8px] font-bold ${tagStyle} flex-shrink-0`}>
                    {log.time}
                  </span>
                  <p className="text-slate-600 font-medium truncate leading-normal" title={log.msg}>
                    {log.msg}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

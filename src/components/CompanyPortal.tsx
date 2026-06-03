import React, { useState } from "react";
import { 
  Building2, Users, UserPlus, Upload, ShieldCheck, 
  Trash2, Search, CheckCircle, XCircle, AlertCircle, FileText, 
  HelpCircle, Eye, CornerDownRight, ShieldAlert, ArrowRight,
  Database, BarChart3
} from "lucide-react";
import { Worker, DocumentStatus } from "../types";
import { motion } from "motion/react";
import { getStoredWorkers, saveWorkers } from "../utils/mockData";
import DocumentInspector from "./DocumentInspector";
import MetricsDashboard from "./MetricsDashboard";
import DatabaseSchemaViewer from "./DatabaseSchemaViewer";

interface CompanyPortalProps {
  workers: Worker[];
  onUpdateWorkers: (updated: Worker[]) => void;
  onSelectWorkerForMobile: (workerCpf: string) => void;
}

export default function CompanyPortal({ 
  workers, 
  onUpdateWorkers,
  onSelectWorkerForMobile 
}: CompanyPortalProps) {
  // Main Active Tab for Portal
  const [activeTab, setActiveTab] = useState<"directory" | "metrics" | "database">("directory");

  // Document Auditor Inspector states
  const [inspectorDocType, setInspectorDocType] = useState<"aso" | "nr10" | "nr35" | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [companyFilter, setCompanyFilter] = useState("all");
  
  // Registration Form State
  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    companyName: "Sul Metalúrgica LTDA",
    companyCnpj: "12.345.678/0001-99",
    role: "",
    needsNr10: true,
    needsNr35: true
  });

  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // Select a worker to view/manage details in panel
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(workers[0]?.id || null);

  // Handle worker registration
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.cpf || !formData.role) {
      setFormError("Por favor preencha todos os campos obrigatórios.");
      return;
    }

    // CPF validation simple simulation
    if (formData.cpf.length < 11) {
      setFormError("Insira um CPF válido para cadastro.");
      return;
    }

    // Check duplicate CPF
    if (workers.some(w => w.cpf.replace(/\D/g, '') === formData.cpf.replace(/\D/g, ''))) {
      setFormError("Este CPF já está registrado no sistema.");
      return;
    }

    // Format CPF if simple digits
    let formattedCpf = formData.cpf;
    if (/^\d{11}$/.test(formData.cpf)) {
      formattedCpf = formData.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }

    const newWorker: Worker = {
      id: "w_" + Date.now(),
      name: formData.name,
      cpf: formattedCpf,
      companyName: formData.companyName,
      companyCnpj: formData.companyCnpj,
      role: formData.role,
      asoStatus: DocumentStatus.PENDING,
      nr10Status: formData.needsNr10 ? DocumentStatus.PENDING : DocumentStatus.NOT_APPLICABLE,
      nr35Status: formData.needsNr35 ? DocumentStatus.PENDING : DocumentStatus.NOT_APPLICABLE,
      videoWatched: false,
      videoWatchedDuration: 0,
      quizCompleted: false,
      qrCodeToken: undefined
    };

    const updated = [newWorker, ...workers];
    onUpdateWorkers(updated);
    
    // Reset form
    setFormData({
      ...formData,
      name: "",
      cpf: "",
      role: ""
    });
    setFormError("");
    setFormSuccess("Trabalhador cadastrado com sucesso! Prossiga para o upload de documentos.");
    setSelectedWorkerId(newWorker.id);

    setTimeout(() => {
      setFormSuccess("");
    }, 4000);
  };

  // Simulates uploading a document
  const handleSimulateUpload = (workerId: string, docType: "aso" | "nr10" | "nr35") => {
    const updated = workers.map(w => {
      if (w.id === workerId) {
        const fileUrl = `mock_upload_${docType}_${w.id.substring(0,6)}.pdf`;
        if (docType === "aso") {
          return { ...w, asoStatus: DocumentStatus.UNDER_ANALYSIS, asoFileUrl: fileUrl };
        } else if (docType === "nr10") {
          return { ...w, nr10Status: DocumentStatus.UNDER_ANALYSIS, nr10FileUrl: fileUrl };
        } else {
          return { ...w, nr35Status: DocumentStatus.UNDER_ANALYSIS, nr35FileUrl: fileUrl };
        }
      }
      return w;
    });
    onUpdateWorkers(updated);
  };

  // Admin Simulator helper to change document status directly
  const handleUpdateDocStatus = (workerId: string, docType: "aso" | "nr10" | "nr35", status: DocumentStatus) => {
    const updated = workers.map(w => {
      if (w.id === workerId) {
        let updatedWorker = { ...w };
        if (docType === "aso") {
          updatedWorker.asoStatus = status;
          if (status === DocumentStatus.PENDING) updatedWorker.asoFileUrl = undefined;
        } else if (docType === "nr10") {
          updatedWorker.nr10Status = status;
          if (status === DocumentStatus.PENDING) updatedWorker.nr10FileUrl = undefined;
        } else {
          updatedWorker.nr35Status = status;
          if (status === DocumentStatus.PENDING) updatedWorker.nr35FileUrl = undefined;
        }

        // Check if QR code can be generated
        const lotoOk = updatedWorker.nr10Status === DocumentStatus.APPROVED || updatedWorker.nr10Status === DocumentStatus.NOT_APPLICABLE;
        const heightOk = updatedWorker.nr35Status === DocumentStatus.APPROVED || updatedWorker.nr35Status === DocumentStatus.NOT_APPLICABLE;
        const asoOk = updatedWorker.asoStatus === DocumentStatus.APPROVED;
        const quizOk = updatedWorker.quizCompleted;

        if (asoOk && lotoOk && heightOk && quizOk) {
          updatedWorker.qrCodeToken = `AM-${updatedWorker.cpf.replace(/\D/g, "")}-${updatedWorker.id.substring(w.id.length - 4, w.id.length).toUpperCase()}-OK`;
        } else {
          updatedWorker.qrCodeToken = undefined;
        }

        return updatedWorker;
      }
      return w;
    });
    onUpdateWorkers(updated);
  };

  // Remove worker
  const handleDeleteWorker = (id: string) => {
    if (confirm("Confirmar a remoção do cadastro deste trabalhador?")) {
      const updated = workers.filter(w => w.id !== id);
      onUpdateWorkers(updated);
      if (selectedWorkerId === id) {
        setSelectedWorkerId(updated[0]?.id || null);
      }
    }
  };

  const selectedWorker = workers.find(w => w.id === selectedWorkerId);

  // Get distinct list of companies
  const companies = Array.from(new Set(workers.map(w => w.companyName)));

  // Filter workers list
  const filteredWorkers = workers.filter(w => {
    const matchesSearch = w.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          w.cpf.includes(searchTerm) || 
                          w.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCompany = companyFilter === "all" || w.companyName === companyFilter;
    return matchesSearch && matchesCompany;
  });

  // Helper to render accessible double-coded status labels
  const renderStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case DocumentStatus.APPROVED:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Aprovado</span>
          </span>
        );
      case DocumentStatus.UNDER_ANALYSIS:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold">
            <Eye className="w-3.5 h-3.5" />
            <span>Em Análise</span>
          </span>
        );
      case DocumentStatus.BLOCKED:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-red-50 text-red-700 border border-red-200 text-xs font-semibold">
            <XCircle className="w-3.5 h-3.5" />
            <span>Bloqueado</span>
          </span>
        );
      case DocumentStatus.NOT_APPLICABLE:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-100 text-slate-500 border border-slate-200 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>N/A</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-100 text-slate-500 border border-slate-200 text-xs font-semibold">
            <AlertCircle className="w-3.5 h-3.5 animate-pulse" />
            <span>Pendente</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview stats panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="p-3.5 bg-slate-100 text-slate-800 rounded-lg">
            <Building2 className="w-6 h-6 text-slate-700" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Empresas Parceiras</p>
            <p className="text-2xl font-bold font-mono mt-0.5">{companies.length || 2}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="p-3.5 bg-orange-100 text-orange-600 rounded-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Terceiros</p>
            <p className="text-2xl font-bold font-mono mt-0.5">{workers.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="p-3.5 bg-emerald-100 text-emerald-600 rounded-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Aprovados / Integrados</p>
            <p className="text-2xl font-bold font-mono mt-0.5">
              {workers.filter(w => w.qrCodeToken).length}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-4 animate-pulse">
          <div className="p-3.5 bg-amber-100 text-amber-600 rounded-lg">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Docs sob Revisão</p>
            <p className="text-2xl font-bold font-mono mt-0.5">
              {workers.filter(w => 
                w.asoStatus === DocumentStatus.UNDER_ANALYSIS ||
                w.nr10Status === DocumentStatus.UNDER_ANALYSIS ||
                w.nr35Status === DocumentStatus.UNDER_ANALYSIS
              ).length}
            </p>
          </div>
        </div>
      </div>

      {/* Subtab Selector */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("directory")}
          className={`flex items-center space-x-2 pb-3 px-4 font-sans text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "directory"
              ? "border-orange-500 text-orange-600 font-extrabold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Gestão de Colaboradores</span>
        </button>
        <button
          onClick={() => setActiveTab("metrics")}
          className={`flex items-center space-x-2 pb-3 px-4 font-sans text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "metrics"
              ? "border-orange-500 text-orange-600 font-extrabold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Métricas de Conformidade</span>
        </button>
        <button
          onClick={() => setActiveTab("database")}
          className={`flex items-center space-x-2 pb-3 px-4 font-sans text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "database"
              ? "border-orange-500 text-orange-600 font-extrabold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Modelagem BD &amp; APIs (TCC)</span>
        </button>
      </div>

      {activeTab === "directory" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left column: Directory list & Registration form */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Form to add a worker */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center space-x-2.5 mb-4 pb-3 border-b border-slate-100">
              <UserPlus className="w-5 h-5 text-orange-600" />
              <h2 className="font-sans font-bold text-slate-900 text-base">
                Cadastrar Novo Colaborador Terceirizado
              </h2>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 uppercase">Nome Completo do Funcionário *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Carlos Eduardo de Oliveira"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 bg-slate-50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 uppercase">CPF *</label>
                  <input
                    type="text"
                    required
                    placeholder="000.000.000-00"
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 bg-slate-50 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 uppercase">Empresa Parceira Responsável</label>
                  <select
                    value={formData.companyName}
                    onChange={(e) => {
                      const cName = e.target.value;
                      const cCnpj = cName === "Sul Metalúrgica LTDA" ? "12.345.678/0001-99" : "98.765.432/0001-11";
                      setFormData({ ...formData, companyName: cName, companyCnpj: cCnpj });
                    }}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none bg-slate-50"
                  >
                    <option value="Sul Metalúrgica LTDA">Sul Metalúrgica LTDA</option>
                    <option value="Sinal Verde Construções">Sinal Verde Construções</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 uppercase">Cargo / Função *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Eletricista de Alta Tensão"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 bg-slate-50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 uppercase">Requisitos de NRs de Campo</label>
                  <div className="flex items-center space-x-3 pt-2">
                    <label className="flex items-center space-x-1.5 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.needsNr10}
                        onChange={(e) => setFormData({ ...formData, needsNr10: e.target.checked })}
                        className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span>NR-10 (Elétrica)</span>
                    </label>
                    <label className="flex items-center space-x-1.5 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.needsNr35}
                        onChange={(e) => setFormData({ ...formData, needsNr35: e.target.checked })}
                        className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span>NR-35 (Altura)</span>
                    </label>
                  </div>
                </div>
              </div>

              {formError && (
                <div className="p-3 bg-red-50 text-red-800 text-xs rounded-lg border border-red-200">
                  {formError}
                </div>
              )}

              {formSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-lg border border-emerald-200">
                  {formSuccess}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg transition-all shadow-md cursor-pointer active:scale-95"
                >
                  Registrar Colaborador
                </button>
              </div>
            </form>
          </div>

          {/* Workers Directory List with Filters */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100">
              <h3 className="font-sans font-bold text-slate-900 text-sm md:text-base flex items-center space-x-2">
                <Users className="w-5 h-5 text-slate-500" />
                <span>Quadro Geral de Terceiros e Status de Entrada</span>
              </h3>

              {/* Company Switcher Tab Filter */}
              <div className="flex items-center space-x-2">
                <div className="relative flex-1 md:w-48">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-400">
                    <Search className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    placeholder="Filtrar por nome/cargo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full text-[11px] pl-8 pr-2 py-1.5 border border-slate-200 rounded-lg focus:outline-none bg-slate-50"
                  />
                </div>

                <select
                  value={companyFilter}
                  onChange={(e) => setCompanyFilter(e.target.value)}
                  className="text-[11px] p-1.5 border border-slate-200 rounded-lg bg-slate-50"
                >
                  <option value="all">Todas as Empresas</option>
                  {companies.map((c, i) => (
                    <option key={i} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-500 border-collapse">
                <thead className="text-[10px] uppercase font-mono tracking-wider text-slate-400 bg-slate-50/50">
                  <tr>
                    <th scope="col" className="px-4 py-3">Funcionário / Empresa</th>
                    <th scope="col" className="px-3 py-3">Cargo</th>
                    <th scope="col" className="px-3 py-3 text-center">ASO</th>
                    <th scope="col" className="px-3 py-3 text-center">NR-10</th>
                    <th scope="col" className="px-3 py-3 text-center">NR-35</th>
                    <th scope="col" className="px-3 py-3 text-center">Integração</th>
                    <th scope="col" className="px-3 py-3 text-center">Portaria (Acesso)</th>
                    <th scope="col" className="px-4 py-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredWorkers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                        Nenhum trabalhador encontrado com os filtros atuais.
                      </td>
                    </tr>
                  ) : (
                    filteredWorkers.map((w) => {
                      const isSelected = w.id === selectedWorkerId;
                      const hasLoto = w.nr10Status === DocumentStatus.APPROVED || w.nr10Status === DocumentStatus.NOT_APPLICABLE;
                      const hasHeight = w.nr35Status === DocumentStatus.APPROVED || w.nr35Status === DocumentStatus.NOT_APPLICABLE;
                      const hasAso = w.asoStatus === DocumentStatus.APPROVED;
                      const quizOk = w.quizCompleted;
                      const activeGatePass = hasAso && hasLoto && hasHeight && quizOk;

                      return (
                        <tr 
                          key={w.id} 
                          onClick={() => setSelectedWorkerId(w.id)}
                          className={`cursor-pointer transition-colors hover:bg-slate-50/80 ${
                            isSelected ? "bg-slate-50 font-medium text-slate-900 border-l-2 border-orange-500" : ""
                          }`}
                        >
                          <td className="px-4 py-3.5">
                            <div className="font-semibold text-slate-900 text-xs">{w.name}</div>
                            <div className="text-[10px] font-mono text-slate-400 mt-0.5">{w.cpf} • {w.companyName}</div>
                          </td>
                          <td className="px-3 py-3.5 text-slate-600">{w.role}</td>
                          <td className="px-3 py-3.5 text-center">{renderStatusBadge(w.asoStatus)}</td>
                          <td className="px-3 py-3.5 text-center">{renderStatusBadge(w.nr10Status)}</td>
                          <td className="px-3 py-3.5 text-center">{renderStatusBadge(w.nr35Status)}</td>
                          <td className="px-3 py-3.5 text-center">
                            {w.quizCompleted ? (
                              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase font-mono">
                                Aprovado ({w.quizScore}/3)
                              </span>
                            ) : w.videoWatched ? (
                              <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold uppercase font-mono animate-pulse">
                                Quiz pendente
                              </span>
                            ) : (
                              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-100 text-slate-400 border border-slate-200 text-[10px] font-medium font-mono">
                                Não assistido
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-3.5 text-center">
                            {activeGatePass ? (
                              <span className="px-2 py-1 rounded bg-green-100 text-green-900 font-bold text-[10px] uppercase tracking-wider font-mono border border-green-300">
                                ✓ Liberado
                              </span>
                            ) : (
                              <span className="px-2 py-1 rounded bg-red-100 text-red-900 font-bold text-[10px] uppercase tracking-wider font-mono border border-red-300">
                                ✗ Bloqueado
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end space-x-1.5">
                              {/* Open Worker in Mobile View trigger */}
                              <button
                                onClick={() => onSelectWorkerForMobile(w.cpf)}
                                title="Visualizar como Usuário final no Celular"
                                className="p-1 text-emerald-600 hover:bg-emerald-50 rounded border border-emerald-100 cursor-pointer"
                              >
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteWorker(w.id)}
                                title="Excluir cadastro"
                                className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right column: Selected Worker Files Upload / Admin simulation console */}
        <div className="space-y-6">
          {selectedWorker ? (
            <div className="bg-slate-900 rounded-xl border border-slate-800 text-white p-6 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/5 rounded-full blur-2xl"></div>
              
              <div className="pb-4 border-b border-slate-800">
                <span className="bg-orange-500 text-slate-950 px-1.5 py-0.5 rounded text-[10px] font-bold font-mono uppercase tracking-wider">
                  Painel de Controle
                </span>
                <h3 className="font-sans font-bold text-base mt-2 text-white">{selectedWorker.name}</h3>
                <p className="text-xs text-slate-400 mt-1 font-mono">{selectedWorker.cpf} • {selectedWorker.companyName}</p>
              </div>

              {/* 1. Document Upload Simulation Area */}
              <div className="py-4 space-y-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1">
                  <FileText className="w-3.5 h-3.5 text-orange-400" />
                  <span>1. Envio de Arquivos (Empresa)</span>
                </h4>

                <div className="space-y-3">
                  {/* ASO Upload Block */}
                  <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold">ASO (Atestado Saúde Ocupacional)</span>
                      {renderStatusBadge(selectedWorker.asoStatus)}
                    </div>
                    
                    {!selectedWorker.asoFileUrl ? (
                      <button
                        onClick={() => handleSimulateUpload(selectedWorker.id, "aso")}
                        className="w-full py-2 bg-slate-800 hover:bg-slate-700 hover:text-orange-400 border border-dashed border-slate-700 hover:border-orange-500 rounded text-center text-xs text-slate-400 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Simular Envio ASO (PDF)</span>
                      </button>
                    ) : (
                      <div className="p-2 bg-slate-900 rounded text-[11px] font-mono text-slate-400 flex justify-between items-center border border-slate-800">
                        <span className="truncate">📎 {selectedWorker.asoFileUrl}</span>
                        <span className="text-emerald-400 text-[10px]">Enviado</span>
                      </div>
                    )}
                  </div>

                  {/* NR-10 Upload Block */}
                  {selectedWorker.nr10Status !== DocumentStatus.NOT_APPLICABLE && (
                    <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold">Curso de NR-10 (Segurança em Eletricidade)</span>
                        {renderStatusBadge(selectedWorker.nr10Status)}
                      </div>
                      
                      {!selectedWorker.nr10FileUrl ? (
                        <button
                          onClick={() => handleSimulateUpload(selectedWorker.id, "nr10")}
                          className="w-full py-2 bg-slate-800 hover:bg-slate-700 hover:text-orange-400 border border-dashed border-slate-700 hover:border-orange-500 rounded text-center text-xs text-slate-400 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Simular Envio NR-10 (PDF)</span>
                        </button>
                      ) : (
                        <div className="p-2 bg-slate-900 rounded text-[11px] font-mono text-slate-400 flex justify-between items-center border border-slate-800">
                          <span className="truncate">📎 {selectedWorker.nr10FileUrl}</span>
                          <span className="text-emerald-400 text-[10px]">Enviado</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* NR-35 Upload Block */}
                  {selectedWorker.nr35Status !== DocumentStatus.NOT_APPLICABLE && (
                    <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold">Curso de NR-35 (Trabalho em Altura)</span>
                        {renderStatusBadge(selectedWorker.nr35Status)}
                      </div>
                      
                      {!selectedWorker.nr35FileUrl ? (
                        <button
                          onClick={() => handleSimulateUpload(selectedWorker.id, "nr35")}
                          className="w-full py-2 bg-slate-800 hover:bg-slate-700 hover:text-orange-400 border border-dashed border-slate-700 hover:border-orange-500 rounded text-center text-xs text-slate-400 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Simular Envio NR-35 (PDF)</span>
                        </button>
                      ) : (
                        <div className="p-2 bg-slate-900 rounded text-[11px] font-mono text-slate-400 flex justify-between items-center border border-slate-800">
                          <span className="truncate">📎 {selectedWorker.nr35FileUrl}</span>
                          <span className="text-emerald-400 text-[10px]">Enviado</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Admin Review Simulation Console */}
              <div className="pt-3 border-t border-slate-800 space-y-4">
                <div className="bg-orange-500/10 border border-orange-500/20 p-2.5 rounded-lg flex items-start space-x-2">
                  <ShieldAlert className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] text-orange-200 leading-normal">
                    <strong>VISTORIA DE PORTARIA ARCELORMITTAL:</strong>
                    <br />Simule abaixo o trabalho de verificação e auditoria de assinaturas eletrônicas. Clique para abrir o visualizador de PDF completo com checklist!
                  </p>
                </div>

                <div className="space-y-3">
                  {/* ASO Admin review */}
                  {selectedWorker.asoFileUrl && (
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 space-y-2 text-xs">
                      <div className="flex justify-between items-center pb-1 border-b border-slate-850">
                        <span className="font-mono text-[11px] font-bold">ASO (Atestado Médico)</span>
                        <span className="text-[10px] text-slate-500 font-mono">Pendente de Visto</span>
                      </div>
                      <button
                        onClick={() => {
                          setInspectorDocType("aso");
                          setIsInspectorOpen(true);
                        }}
                        className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded text-center text-xs text-white font-bold transition-all cursor-pointer flex items-center justify-center space-x-1 shadow"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Abrir &amp; Auditar ASO</span>
                      </button>
                    </div>
                  )}

                  {/* NR-10 Admin review */}
                  {selectedWorker.nr10FileUrl && (
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 space-y-2 text-xs">
                      <div className="flex justify-between items-center pb-1 border-b border-slate-850">
                        <span className="font-mono text-[11px] font-bold">Capacitação NR-10</span>
                        <span className="text-[10px] text-slate-500 font-mono">Pendente de Visto</span>
                      </div>
                      <button
                        onClick={() => {
                          setInspectorDocType("nr10");
                          setIsInspectorOpen(true);
                        }}
                        className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded text-center text-xs text-white font-bold transition-all cursor-pointer flex items-center justify-center space-x-1 shadow"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Abrir &amp; Auditar NR-10</span>
                      </button>
                    </div>
                  )}

                  {/* NR-35 Admin review */}
                  {selectedWorker.nr35FileUrl && (
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 space-y-2 text-xs">
                      <div className="flex justify-between items-center pb-1 border-b border-slate-850">
                        <span className="font-mono text-[11px] font-bold">Capacitação NR-35</span>
                        <span className="text-[10px] text-slate-500 font-mono">Pendente de Visto</span>
                      </div>
                      <button
                        onClick={() => {
                          setInspectorDocType("nr35");
                          setIsInspectorOpen(true);
                        }}
                        className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded text-center text-xs text-white font-bold transition-all cursor-pointer flex items-center justify-center space-x-1 shadow"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Abrir &amp; Auditar NR-35</span>
                      </button>
                    </div>
                  )}

                  {!selectedWorker.asoFileUrl && !selectedWorker.nr10FileUrl && !selectedWorker.nr35FileUrl && (
                    <p className="text-[10px] text-center text-slate-500 italic py-2">
                      Sem documentos enviados para análise no momento. Use o painel superior para simular o upload de arquivos corporativos pelas terceirizadas.
                    </p>
                  )}
                </div>
              </div>

              {/* Redirect to simulated Mobile view for that worker */}
              <div className="pt-4 mt-2 border-t border-slate-800">
                <button
                  onClick={() => onSelectWorkerForMobile(selectedWorker.cpf)}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md active:scale-95"
                >
                  <span>Ver Onboarding no Celular do Operário</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-slate-100 rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500 text-xs">
              Selecione um trabalhador para visualizar detalhes de sua documentação.
            </div>
          )}
        </div>

      </div>
      )}

      {/* Conformity dashboard metrics */}
      {activeTab === "metrics" && (
        <MetricsDashboard workers={workers} />
      )}

      {/* Relational database modeling and interactive REST API sandbox */}
      {activeTab === "database" && (
        <DatabaseSchemaViewer workers={workers} />
      )}

      {/* High Fidelity Interactive Document Inspection checklist window */}
      {isInspectorOpen && selectedWorker && inspectorDocType && (
        <DocumentInspector
          worker={selectedWorker}
          docType={inspectorDocType}
          isOpen={isInspectorOpen}
          onClose={() => {
            setIsInspectorOpen(false);
            setInspectorDocType(null);
          }}
          onApprove={() => handleUpdateDocStatus(selectedWorker.id, inspectorDocType, DocumentStatus.APPROVED)}
          onReject={() => handleUpdateDocStatus(selectedWorker.id, inspectorDocType, DocumentStatus.BLOCKED)}
        />
      )}
    </div>
  );
}

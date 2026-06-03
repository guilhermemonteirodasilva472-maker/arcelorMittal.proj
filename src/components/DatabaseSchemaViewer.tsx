import React, { useState } from "react";
import { 
  Database, Code2, Server, Terminal, Play, 
  CheckCircle, XCircle, FileCode2, Copy, Check, Eye
} from "lucide-react";
import { Worker, DocumentStatus } from "../types";

interface DatabaseSchemaViewerProps {
  workers: Worker[];
}

export default function DatabaseSchemaViewer({ workers }: DatabaseSchemaViewerProps) {
  // Tabs: Schema SQL vs API Simulator vs Portaria Solenoid Logic
  const [activeSubTab, setActiveSubTab] = useState<"sql" | "api" | "logic">("sql");
  
  // Swagger simulator states
  const [selectedCpf, setSelectedCpf] = useState<string>(workers[0]?.cpf || "123.456.789-00");
  const [apiResponse, setApiResponse] = useState<any | null>(null);
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  const activeWorkerData = workers.find(w => w.cpf === selectedCpf) || workers[0];

  const handleCopySql = () => {
    const sqlText = `
-- =======================================================
-- ARCELORMITTAL: SCHEMA DO BANCO DE DADOS DE PORTARIA (TCC)
-- =======================================================

CREATE TABLE empresas_parceiras (
    id VARCHAR(50) PRIMARY KEY,
    razao_social VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) UNIQUE NOT NULL,
    status_contrato VARCHAR(20) DEFAULT 'ATIVO'
);

CREATE TABLE trabalhadores (
    id VARCHAR(50) PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    fk_empresa VARCHAR(50) REFERENCES empresas_parceiras(id) ON DELETE CASCADE,
    cargo VARCHAR(100) NOT NULL,
    aso_status VARCHAR(20) DEFAULT 'PENDENTE',
    aso_file_url VARCHAR(255),
    nr10_status VARCHAR(20) DEFAULT 'PENDENTE',
    nr10_file_url VARCHAR(255),
    nr35_status VARCHAR(20) DEFAULT 'PENDENTE',
    nr35_file_url VARCHAR(255),
    video_assistido BOOLEAN DEFAULT FALSE,
    nota_quiz INT,
    qr_code_token VARCHAR(100) UNIQUE,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
    `.trim();

    navigator.clipboard.writeText(sqlText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleSimulateApi = () => {
    setIsLoadingApi(true);
    setApiResponse(null);

    setTimeout(() => {
      if (!activeWorkerData) {
        setIsLoadingApi(false);
        setApiResponse({
          status: 404,
          error: "Not Found",
          message: "Trabalhador com o CPF especificado não foi cadastrado no sistema."
        });
        return;
      }

      const hasLoto = activeWorkerData.nr10Status === DocumentStatus.APPROVED || activeWorkerData.nr10Status === DocumentStatus.NOT_APPLICABLE;
      const hasHeight = activeWorkerData.nr35Status === DocumentStatus.APPROVED || activeWorkerData.nr35Status === DocumentStatus.NOT_APPLICABLE;
      const hasAso = activeWorkerData.asoStatus === DocumentStatus.APPROVED;
      const quizOk = activeWorkerData.quizCompleted;
      const allowed = hasAso && hasLoto && hasHeight && quizOk;

      const missingRequirements: string[] = [];
      if (!hasAso) missingRequirements.push("ASO Aprovado");
      if (!hasLoto) missingRequirements.push("NR-10 (Elétrica) Regular");
      if (!hasHeight) missingRequirements.push("NR-35 (Altura) Regular");
      if (!quizOk) missingRequirements.push("Treinamento de Segurança Assistido & Quiz Aprovado");

      setApiResponse({
        status: allowed ? 200 : 403,
        payload: {
          allowed: allowed,
          gatepass_status: allowed ? "LIBERADO_AUTO" : "BLOQUEADO_RESTRICAO",
          timestamp_solicitacao: new Date().toISOString(),
          portaria_analise: "PORTARIA_SUL_C2",
          trabalhador: {
            id: activeWorkerData.id,
            nome: activeWorkerData.name,
            cpf: activeWorkerData.cpf,
            empresa_fantasia: activeWorkerData.companyName,
            cnpj: activeWorkerData.companyCnpj,
            cargo: activeWorkerData.role
          },
          requisitos_auditoria: {
            aso_regular: hasAso,
            nr10_regular: hasLoto,
            nr35_regular: hasHeight,
            treinamento_integral_completo: quizOk,
            nota_avaliacao: activeWorkerData.quizScore ?? 0
          },
          detalhes_acesso: allowed ? {
            qr_code_token: activeWorkerData.qrCodeToken || `AM-${activeWorkerData.cpf.replace(/\D/g, "")}-OK`,
            liberacao_solenoide_id: "SOL-G4-TUBARAO-3000",
            validade_cracha: "2026-12-31T23:59:59Z"
          } : null,
          restricoes_pendentes: !allowed ? missingRequirements : []
        }
      });
      setIsLoadingApi(false);
    }, 600);
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 text-white p-6 shadow-md" id="database-schema-viewer-container">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-sm text-white">Guia de Engenharia e Banco de Dados (TCC)</h3>
            <p className="text-[10px] uppercase font-mono tracking-wider text-indigo-400">Modelagem Relacional de Portaria Segura</p>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="bg-slate-950 p-1 rounded-lg flex border border-slate-850">
          <button 
            onClick={() => setActiveSubTab("sql")}
            className={`px-3 py-1 rounded text-[10px] font-bold font-mono tracking-wider transition-all cursor-pointer ${activeSubTab === "sql" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}
          >
            SQL DDL
          </button>
          <button 
            onClick={() => {
              setActiveSubTab("api");
              if (!apiResponse) handleSimulateApi();
            }}
            className={`px-3 py-1 rounded text-[10px] font-bold font-mono tracking-wider transition-all cursor-pointer ${activeSubTab === "api" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}
          >
            API Simulator
          </button>
          <button 
            onClick={() => setActiveSubTab("logic")}
            className={`px-3 py-1 rounded text-[10px] font-bold font-mono tracking-wider transition-all cursor-pointer ${activeSubTab === "logic" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}
          >
            Lógica Crachá (LOTO)
          </button>
        </div>
      </div>

      <div className="py-4 min-h-[340px]">
        {activeSubTab === "sql" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400 leading-normal max-w-lg">
                Este script SQL de criação de tabelas representa a modelagem relacional de nosso protótipo acadêmico para o PostgreSQL da ArcelorMittal.
              </p>
              <button 
                onClick={handleCopySql}
                className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1.5 rounded transition-colors flex items-center space-x-1 border border-slate-700 cursor-pointer"
              >
                {copiedText ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedText ? "Copiado!" : "Copiar SQL"}</span>
              </button>
            </div>

            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-[11px] overflow-x-auto max-h-72 select-text text-indigo-300">
              <pre className="leading-relaxed">
{`-- DDL Postgre/MySQL de Portaria
CREATE TABLE empresas_parceiras (
    id VARCHAR(50) PRIMARY KEY,
    razao_social VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) UNIQUE NOT NULL,
    status_contrato VARCHAR(20) DEFAULT 'ATIVO'
);

CREATE TABLE trabalhadores (
    id VARCHAR(50) PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    fk_empresa REFERENCES empresas_parceiras(id),
    aso_status VARCHAR(20) DEFAULT 'PENDENTE',
    nr10_status VARCHAR(20) DEFAULT 'PENDENTE',
    nr35_status VARCHAR(20) DEFAULT 'PENDENTE',
    nota_quiz INT DEFAULT 0,
    qr_code_token VARCHAR(100) UNIQUE
);`}
              </pre>
            </div>
          </div>
        )}

        {activeSubTab === "api" && (
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-950 p-3 rounded-lg border border-slate-850">
              <div className="flex items-center space-x-2">
                <span className="bg-emerald-600 text-slate-950 text-[10px] font-bold font-mono px-2 py-0.5 rounded">GET</span>
                <span className="font-mono text-xs text-slate-300 overflow-x-auto">/api/v1/portaria/valida-acesso</span>
              </div>

              <div className="flex items-center space-x-2">
                <select 
                  value={selectedCpf}
                  onChange={(e) => {
                    setSelectedCpf(e.target.value);
                    setApiResponse(null);
                  }}
                  className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white focus:outline-none"
                >
                  {workers.map((w) => (
                    <option key={w.id} value={w.cpf}>
                      {w.name.split(" ")[0]} ({w.cpf})
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleSimulateApi}
                  disabled={isLoadingApi}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded text-xs font-bold text-white transition-all flex items-center space-x-1 cursor-pointer active:scale-95"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{isLoadingApi ? "Simulando..." : "Testar API"}</span>
                </button>
              </div>
            </div>

            {/* Simulated Swagger response terminal */}
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-850 font-mono text-[11px] h-60 overflow-y-auto relative select-text">
              {apiResponse ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 text-[10px] text-slate-500">
                    <span>STATUS: {apiResponse.status === 200 ? <span className="text-emerald-400 font-bold">200 OK</span> : <span className="text-red-400 font-bold">403 Forbidden</span>}</span>
                    <span>Tamanho: ~420 bytes</span>
                  </div>
                  <pre className="text-indigo-400 leading-relaxed overflow-x-auto">
                    {JSON.stringify(apiResponse.payload, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs text-center space-y-2">
                  <Terminal className="w-8 h-8 text-slate-600 animate-pulse" />
                  <p>Execute um GET no simulador acima para analisar o payload JSON retornado pela portaria integrada da ArcelorMittal.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeSubTab === "logic" && (
          <div className="space-y-4">
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong>Regra de Negócio de Liberação Solenoide:</strong> O algoritmo de cancelas físicas em usinas industriais segue regras condicionais em cascata que protegem a integridade jurídica da planta.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 rounded-xl p-4 border border-slate-850 font-mono text-[10px] leading-relaxed text-indigo-400 space-y-2">
                <span className="text-slate-500 uppercase text-[9px] font-bold block border-b border-slate-800 pb-1">Pseudocódigo do Hardware</span>
                <p>
                  {`FUNCTION check_portaria_unlock(worker_row) {
  // 1. Audit ASO expiry medical proof
  IF worker_row.aso_status != 'APPROVED' THEN
    RETURN FALSE, 'Código de Erro 403-ASO-Pendente'

  // 2. Audit NR10 electrical scope validation
  IF worker_row.nr10_status_required AND worker_row.nr10_status != 'APPROVED' THEN
    RETURN FALSE, 'Código de Erro 403-NR10-Pendente'

  // 3. Audit NR35 height hazard safety
  IF worker_row.nr35_status_required AND worker_row.nr35_status != 'APPROVED' THEN
    RETURN FALSE, 'Código de Erro 403-NR35-Pendente'

  // 4. Require interactive training passing test
  IF NOT worker_row.quiz_passed OR worker_row.quiz_score < 2 THEN
    RETURN FALSE, 'Código de Erro 403-Quiz-Reprovado'

  // Success: Trigger physical solenoid signal relay
  PORT_SOLENOID_RELAY_STATE = HIGH
  RETURN TRUE, 'Código 200-Acesso-Ok'
}`}
                </p>
              </div>

              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-850 flex flex-col justify-between">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Comportamento Ativo do Sistema</h4>
                <div className="space-y-3 pt-1">
                  <div className="flex items-start space-x-2 text-xs">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] text-slate-300">
                      <strong>Intertravamento:</strong> Se um único documento do trabalhador expirar, o crachá é bloqueado imediatamente, impedindo que o catraca abra fisicamente na usina.
                    </p>
                  </div>

                  <div className="flex items-start space-x-2 text-xs">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] text-slate-300">
                      <strong>Auditabilidade de Campo:</strong> O fiscal da usina pode scannear o crachá de qualquer eletricista diretamente no trecho e ver este mesmo JSON na tela do tablet de auditoria móvel.
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-2 bg-indigo-950 text-indigo-300 border border-indigo-700/30 rounded text-[10px] leading-relaxed text-center font-mono">
                  LOTO Integrado ativo: Bloqueio Lógico-Físico redundante.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

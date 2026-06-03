export type LanguageType = "pt" | "en" | "es";

export interface TranslationsDict {
  goldRulesAlert: string;
  demoModeLabel: string;
  partnerCompanyPersona: string;
  workerPersona: string;
  titleBanner: string;
  subtitleBanner: string;
  helperTextBanner: string;
  flowStep1: string;
  flowStep2: string;
  flowStep3: string;
  tutorialTitle: string;
  tutorialSubtitle: string;
  tutorialIntro: string;
  tutorialFictionalLabel: string;
  tutorialSteps: {
    title: string;
    description: string;
    badge: string;
  }[];
  tutorialActionText: string;
  btnReset: string;
  btnResetConfirm: string;
  alertReset: string;
  workersManagement: string;
  metricsLabel: string;
  databaseLabel: string;
  noWorkersText: string;
  mobileUXTitle: string;
  mobileUXSubtitle: string;
  mobileUXCard1Title: string;
  mobileUXCard1Desc: string;
  mobileUXCard2Title: string;
  mobileUXCard2Desc: string;
  mobileUXCard3Title: string;
  mobileUXCard3Desc: string;
}

export const TRANSLATIONS: Record<LanguageType, TranslationsDict> = {
  pt: {
    goldRulesAlert: "REGRAS DE OURO ARCELORMITTAL: SEGURANÇA EM PRIMEIRO LUGAR - TOLERÂNCIA ZERO A DESVIOS",
    demoModeLabel: "Ambiente de Demonstração Acadêmica:",
    partnerCompanyPersona: "Empresa Parceira",
    workerPersona: "Trabalhador (Mobile)",
    titleBanner: "Central de Integração e Onboarding de Terceiros — Protótipo de Engenharia",
    subtitleBanner: "Mentoria Técnica UI/UX & Dev Sênior",
    helperTextBanner: "Este sistema simula o fim de filas físicas e eliminação de processos burocráticos manuais. Use a aba Empresa Parceira abaixo para cadastrar colaboradores, submeter seus documentos (ASO, NR-10, NR-35) e fazer a auditoria deles. Posteriormente, troque para o modo Trabalhador (Mobile) para assistir ao treinamento animado, realizar o quiz interativo e emitir seu Certificado e Crachá QR Code!",
    flowStep1: "Submeta as NRs no Painel da Empresa",
    flowStep2: "Aprove os documentos no Painel Direita",
    flowStep3: "Emule o trabalhador e faça o Quiz!",
    tutorialTitle: "Guia do Novo Aluno & Funcionário (Exemplo Prático)",
    tutorialSubtitle: "Siga o passo a passo com nosso colaborador fictício para entender a tarefa",
    tutorialIntro: "Para entender perfeitamente o processo de integração digital, preparamos o exemplo do colaborador fictício",
    tutorialFictionalLabel: "Trabalhador Exemplo",
    tutorialSteps: [
      {
        badge: "Passo 1",
        title: "Cadastro & Upload de Documentos",
        description: "A empresa terceirizada cadastra Lucas Mendes no sistema e faz o upload virtual de seus arquivos (ASO de Aptidão Médica, Treinamento NR-10 de Elétrica e NR-35 de Altura)."
      },
      {
        badge: "Passo 2",
        title: "Auditoria Portaria (RH/Segurança)",
        description: "A equipe de portaria da ArcelorMittal audita os arquivos de Lucas utilizando uma lista de verificação detalhada (nomes idênticos, carimbo oficial do médico, CRM ativo)."
      },
      {
        badge: "Passo 3",
        title: "Treinamento & Avaliação de Conhecimento",
        description: "Lucas acessa o portal pelo celular. Ele assiste ao vídeo das Regras de Ouro de Segurança da Planta e responde o quiz teórico para fixação do conteúdo."
      },
      {
        badge: "Passo 4",
        title: "Emissão de Crachá & Certificado PDF",
        description: "Após obter aprovação em todos os documentos e finalizar o teste, o sistema emite o Certificado Oficial de Segurança em PDF e libera o Crachá de Acesso."
      }
    ],
    tutorialActionText: "Clique aqui para simular o caso do Lucas Mendes instantaneamente!",
    btnReset: "Resetar Dados",
    btnResetConfirm: "Deseja resetar a simulação para o estado inicial de fábrica?",
    alertReset: "Dados de simulação restaurados com sucesso!",
    workersManagement: "Gestão de Colaboradores",
    metricsLabel: "Métricas de Conformidade",
    databaseLabel: "Modelagem BD & APIs (TCC)",
    noWorkersText: "Nenhum trabalhador cadastrado. Cadastre o Lucas Mendes ou crie um novo colaborador no formulário ao lado!",
    mobileUXTitle: "Mobile-First UX: Interface Direta com o Trabalhador de Campo",
    mobileUXSubtitle: "Smartphone Simulator",
    mobileUXCard1Title: "Alvos de Clique Ampliados (Mín. 44px)",
    mobileUXCard1Desc: "Teclados com numerais simplificados e cards largos evitam erros de clique em canteiros industriais de alta periculosidade.",
    mobileUXCard2Title: "Acessibilidade Cromática (Color-Safe)",
    mobileUXCard2Desc: "O status dos documentos usa ícones com contornos diferenciados associados às cores para perfeito discernimento visual.",
    mobileUXCard3Title: "Lógica Gated (Passe Seguro de Entrada)",
    mobileUXCard3Desc: "A liberação física do solenoide de catracas portuárias intertravadas necessita de 100% de conformidade documental e teste aprovado."
  },
  en: {
    goldRulesAlert: "ARCELORMITTAL GOLDEN RULES: SAFETY FIRST - ZERO TOLERANCE FOR DEVIATIONS",
    demoModeLabel: "Academic Demonstration Environment:",
    partnerCompanyPersona: "Partner Company",
    workerPersona: "Worker (Mobile)",
    titleBanner: "Third-Party Integration & Onboarding Hub — Engineering Prototype",
    subtitleBanner: "Technical UI/UX Mentorship & Senior Dev",
    helperTextBanner: "This system simulates cutting down gate physical queues and eliminating manual bureaucratic paperwork. Use the Partner Company tab below to register collaborators, submit their mandatory files (ASO, NR-10, NR-35) and audit them. Then, switch to Worker (Mobile) mode to watch the animative training, take the safety quiz and generate your PDF Certificate and Gate QR Code!",
    flowStep1: "Submit NRs in the Company Dashboard",
    flowStep2: "Approve files in the Inspector panel",
    flowStep3: "Emulate the worker and pass the Quiz!",
    tutorialTitle: "New Student & Worker Tutorial (Practical Example)",
    tutorialSubtitle: "Follow our interactive steps with a fictional worker to understand the assignment",
    tutorialIntro: "To easily grasp how the digital onboarding works, we customized a walk-through using a fictional technician",
    tutorialFictionalLabel: "Example Worker",
    tutorialSteps: [
      {
        badge: "Step 1",
        title: "Registration & Uploads",
        description: "The third-party contractor registers Lucas Mendes on the portal and performs virtual uploads of his medical clearance (ASO), Electrical Safety (NR-10), and Height Safety (NR-35)."
      },
      {
        badge: "Step 2",
        title: "Gate Officer Audit (HR/Safety)",
        description: "ArcelorMittal's onsite gate team audits Lucas's files using an inline checklist (checking matching IDs, validating official doctor stamp, and physical signatures)."
      },
      {
        badge: "Step 3",
        title: "Safety Training & Quiz Assessment",
        description: "Lucas logs onto his phone portal. He watches the plant's essential Golden Rules instructional video and answers the high-priority safety test to lock-in knowledge."
      },
      {
        badge: "Step 4",
        title: "Access Badge & PDF Certificate",
        description: "Once all required items align in perfect synergy, the system unleashes the PDF Certificate for print/save and spawns the gatepass QR-Code!"
      }
    ],
    tutorialActionText: "Click here to auto-simulate Lucas Mendes's training case!",
    btnReset: "Reset Demo",
    btnResetConfirm: "Would you like to reset the simulation back to initial factory state?",
    alertReset: "Simulation records have been restored successfully!",
    workersManagement: "Employee Directory",
    metricsLabel: "Compliance Dashboard",
    databaseLabel: "DB Model & API Sandbox",
    noWorkersText: "No registered employees. Quick-launch Lucas Mendes or register a new technician in the form to get started!",
    mobileUXTitle: "Mobile-First UX: Clean Handheld Experience for Onsite Teams",
    mobileUXSubtitle: "Smartphone Simulator",
    mobileUXCard1Title: "Enlarged Click Targets (Min 44px)",
    mobileUXCard1Desc: "Keypads with large buttons and wide card boundaries prevent accidental inputs under high sunlight conditions or wearing gloves.",
    mobileUXCard2Title: "Accessible Contrast Design (Color-Safe)",
    mobileUXCard2Desc: "Status trackers pair colorful state rings with distinct shapes to support colorblind field personnel.",
    mobileUXCard3Title: "Gated Validation (Solenoid Release Logic)",
    mobileUXCard3Desc: "Plant gate turnstiles remain physically locked until the system verifies 100% database compliance."
  },
  es: {
    goldRulesAlert: "REGLAS DE ORO DE ARCELORMITTAL: SEGURIDAD PRIMERO - TOLERANCIA CERO A DESVIACIONES",
    demoModeLabel: "Entorno de Demostración Académica:",
    partnerCompanyPersona: "Empresa Contratista",
    workerPersona: "Trabajador (Móvil)",
    titleBanner: "Central de Integración y Onboarding de Terceros — Prototipo de Ingeniería",
    subtitleBanner: "Mentoría Técnica UI/UX y Dev Senior",
    helperTextBanner: "Este sistema simula la erradicación de las filas físicas de portería y papeleo manual. Utilice la pestaña Empresa Contratista para registrar operarios, subir sus documentos obligatorios (ASO, NR-10, NR-35) y auditarlos. Luego, ¡cambie al modo Trabajador (Móvil) para ver el video educativo, responder el cuestionario de seguridad y emitir su Certificado PDF y pase de acceso!",
    flowStep1: "Suba las NRs en el Panel de la Empresa",
    flowStep2: "Apruebe archivos en el Panel de Auditoría",
    flowStep3: "Emule al operario y responda el Cuestionario!",
    tutorialTitle: "Guía para Nuevos Alumnos y Operarios (Ejemplo Práctico)",
    tutorialSubtitle: "Siga el paso a paso con nuestro operario ficticio para comprender la tarea",
    tutorialIntro: "Para entender perfectamente cómo funciona el proceso de inducción digital, vea el ejemplo de nuestro operario de muestra",
    tutorialFictionalLabel: "Trabajador de Muestra",
    tutorialSteps: [
      {
        badge: "Paso 1",
        title: "Registro y Carga de Documentos",
        description: "La empresa contratista registra a Lucas Mendes en el sistema y carga digitalmente sus documentos (Certificado Médico ASO, curso de Electricidad NR-10 y de Alturas NR-35)."
      },
      {
        badge: "Paso 2",
        title: "Auditoría en Portería (Recursos Humanos)",
        description: "El personal de portería de ArcelorMittal audita los PDFs utilizando una lista de verificación física (nombres idénticos, firma médica, sello de habilitación)."
      },
      {
        badge: "Paso 3",
        title: "Video de Inducción y Cuestionario",
        description: "Lucas accede a la app desde su móvil. Mira el video de las Reglas de Oro de Seguridad de la Planta y responde la evaluación teórica de seguridad."
      },
      {
        badge: "Paso 4",
        title: "Emisión de Carnet y Certificado en PDF",
        description: "Tras aprobar la auditoría de documentos y completar el cuestionario, el sistema expide su Certificado en PDF y activa el código QR para liberar el molinete."
      }
    ],
    tutorialActionText: "¡Haga clic aquí para simular el caso de Lucas Mendes instantáneamente!",
    btnReset: "Restaurar Simulación",
    btnResetConfirm: "¿Desea restaurar de fábrica todos los estados y datos locales?",
    alertReset: "¡Los datos de demostración han sido restaurados exitosamente!",
    workersManagement: "Directorio de Colaboradores",
    metricsLabel: "Métricas de Cumplimiento",
    databaseLabel: "Modelo de BD y Sandbox de API",
    noWorkersText: "Ningún operario registrado. ¡Cargue a Lucas Mendes o registre un nuevo colaborador en el formulario lateral!",
    mobileUXTitle: "UX Mobile-First: Interfaz Directa para Operarios de Campo",
    mobileUXSubtitle: "Smartphone Simulator",
    mobileUXCard1Title: "Objetivos de Toque Ampliados (Mín. 44px)",
    mobileUXCard1Desc: "Teclados numéricos grandes y tarjetas amplias evitan clics erróneos en patios industriales complejos de alta operación.",
    mobileUXCard2Title: "Contraste Accesible (Para daltónicos)",
    mobileUXCard2Desc: "Los estados de los documentos se identifican tanto por símbolos gráficos claros como por colores de seguridad.",
    mobileUXCard3Title: "Lógica de Cancelas (Interbloqueo LOTO)",
    mobileUXCard3Desc: "Los solenoides de torniquetes físicos en planta solo reciben tensión tras la aprobación del 100% de los exámenes de ingreso."
  }
};

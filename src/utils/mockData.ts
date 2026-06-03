import { Worker, DocumentStatus } from "../types";

export const SAFETY_QUESTIONS = [
  {
    id: "q1",
    questionText: "De acordo com as Regras de Ouro da ArcelorMittal, ao realizar atividades em altura (acima de 2 metros), qual é o procedimento obrigatório?",
    options: [
      "Subir rapidamente se a atividade durar menos de 5 minutos, sem necessidade de EPIs.",
      "Utilizar cinto de segurança do tipo paraquedista conectado a um ponto de ancoragem seguro por meio de talabarte duplo.",
      "Apenas utilizar calçado de segurança e capacete com jugular comum.",
      "Subir acompanhado de um colega de trabalho segurando a base da escada comum."
    ],
    correctOptionIndex: 1,
    explanation: "Regra de Ouro nº 1 (Trabalho em Altura): Todo trabalho em altura acima de 2,0m exige o uso de cinto de segurança tipo paraquedista fixo em ponto de ancoragem seguro/linha de vida redundante."
  },
  {
    id: "q2",
    questionText: "Antes de efetuar qualquer manutenção em equipamentos industriais (elétricos ou mecânicos), qual medida de segurança contra energias perigosas deve ser rigorosamente executada?",
    options: [
      "Apenas desligar o botão do interruptor local do painel.",
      "Iniciar os trabalhos sem aviso e terminar o mais rápido possível para evitar paradas.",
      "Aplicar o procedimento LOTO (Lockout / Tagout) para isolar, bloquear com cadeado e etiquetar todas as fontes de energia, testando a ausência de tensão.",
      "Retirar as barreiras de proteção metálicas físicas sem desligar o motor."
    ],
    correctOptionIndex: 2,
    explanation: "Regra de Ouro (Isolamento de Energias/LOTO): O bloqueio físico de fontes de energia elétrica, hidráulica, mecânica ou pneumática é indispensável para anular riscos de partida acidental."
  },
  {
    id: "q3",
    questionText: "Ao avistar uma carga suspensa sendo movimentada por uma ponte rolante na usina, como você deve proceder?",
    options: [
      "Passar rapidamente por baixo da carga para cortar caminho.",
      "Ajudar a empurrá-la manualmente com o próprio corpo para acelerar a movimentação.",
      "Manter distância segura e JAMAIS se posicionar ou transitar sob cargas suspensas.",
      "Olhar para cima e caminhar sob ela apenas se estiver usando óculos de proteção."
    ],
    correctOptionIndex: 3,
    explanation: "Regra de Ouro (Carga Suspensa): É terminantemente proibido circular ou permanecer sob a projeção de cargas suspensas ou nos raios de ação de equipamentos móveis."
  }
];

export const INITIAL_WORKERS: Worker[] = [];

export const getStoredWorkers = (): Worker[] => {
  const cached = localStorage.getItem("cl_onboarding_workers");
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      console.error(e);
    }
  }
  localStorage.setItem("cl_onboarding_workers", JSON.stringify(INITIAL_WORKERS));
  return INITIAL_WORKERS;
};

export const saveWorkers = (workers: Worker[]) => {
  localStorage.setItem("cl_onboarding_workers", JSON.stringify(workers));
};

import React, { useState, useEffect, useRef } from "react";
import { 
  Play, Pause, RotateCw, CheckCircle2, AlertTriangle, 
  HelpCircle, ChevronRight, Award, ShieldAlert, Video, Eye, ThumbsUp, FileText 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Worker, DocumentStatus } from "../types";
import { SAFETY_QUESTIONS } from "../utils/mockData";
import CertificateModal from "./CertificateModal";

interface SafetyQuizProps {
  worker: Worker;
  onUpdateWorker: (updated: Worker) => void;
}

export default function SafetyQuiz({ worker, onUpdateWorker }: SafetyQuizProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(worker.videoWatchedDuration || 0); // 0 to 100
  const [videoFinished, setVideoFinished] = useState(worker.videoWatched);
  
  // Quiz states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(worker.quizCompleted);
  const [isCertOpen, setIsCertOpen] = useState(false);
  
  // Video simulation timer
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying && videoProgress < 100) {
      intervalRef.current = setInterval(() => {
        setVideoProgress((prev) => {
          const next = prev + 5; // increment progress
          if (next >= 100) {
            setIsPlaying(false);
            setVideoFinished(true);
            if (intervalRef.current) clearInterval(intervalRef.current);
            return 100;
          }
          return next;
        });
      }, 500);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, videoProgress]);

  // If worker changes, sync state
  useEffect(() => {
    setVideoFinished(worker.videoWatched);
    setVideoProgress(worker.videoWatched ? 100 : worker.videoWatchedDuration);
    setQuizFinished(worker.quizCompleted);
    if (!worker.quizCompleted) {
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setIsAnswered(false);
      setCorrectAnswersCount(0);
    }
  }, [worker]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRestartVideo = () => {
    setVideoProgress(0);
    setVideoFinished(false);
    setIsPlaying(true);
  };

  const handleSkipVideo = () => {
    setVideoProgress(100);
    setIsPlaying(false);
    setVideoFinished(true);
  };

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswered) return;
    
    const currentQuestion = SAFETY_QUESTIONS[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correctOptionIndex;
    
    if (isCorrect) {
      setCorrectAnswersCount((prev) => prev + 1);
    }
    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < SAFETY_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Quiz finished! Save results
      const finalScore = correctAnswersCount;
      setQuizFinished(true);
      
      const updatedWorker: Worker = {
        ...worker,
        videoWatched: true,
        videoWatchedDuration: 100,
        quizCompleted: true,
        quizScore: finalScore
      };
      onUpdateWorker(updatedWorker);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setCorrectAnswersCount(0);
    setQuizFinished(false);
  };

  const getSubtitles = () => {
    if (videoProgress < 20) return "Bem-vindo ao Treinamento de Integração ArcelorMittal.";
    if (videoProgress < 40) return "Nós valorizamos a vida e a saúde física de todos os colaboradores e parceiros.";
    if (videoProgress < 60) return "Executar as Regras de Ouro é mandatório em nossas plantas industriais.";
    if (videoProgress < 85) return "Isolar energias perigosas e usar o cinto com dupla ancoragem salva vidas diariamente.";
    return "Assista o vídeo até o final para liberar sua avaliação técnica de segurança.";
  };

  const currentQuestion = SAFETY_QUESTIONS[currentQuestionIndex];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm" id="interactive-safety-quiz-container">
      {/* Visual Identity Header */}
      <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-orange-600/10 rounded-lg text-orange-500">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-sm text-white tracking-tight">
              Integração de Segurança Mandatória
            </h3>
            <p className="text-[10px] uppercase tracking-wider font-mono text-slate-400">
              Regras de Ouro ArcelorMittal
            </p>
          </div>
        </div>
        
        <span className="bg-orange-500/10 text-orange-500 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-orange-500/20">
          Módulo 01 - Vital
        </span>
      </div>

      <div className="p-6 space-y-6">
        
        {/* Step 1: Simulator Video Player */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono flex items-center space-x-1.5">
              <span className={`w-2 h-2 rounded-full ${videoFinished ? "bg-green-500" : isPlaying ? "bg-amber-500 animate-ping" : "bg-slate-400"}`}></span>
              <span>1. Vídeo de Segurança</span>
            </span>
            <span className="text-xs font-mono text-slate-400">
              Progresso: {Math.round(videoProgress)}%
            </span>
          </div>

          {/* Player Shell */}
          <div className="relative aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-inner group">
            {/* Mock Video Graphic Frame */}
            <div className="absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/20">
              {/* Top info */}
              <div className="flex justify-between items-start">
                <span className="bg-slate-900/90 text-[10px] text-white px-2.5 py-1 rounded-full font-mono flex items-center space-x-1.5 backdrop-blur-xs">
                  <Eye className="w-3 h-3 text-orange-500" />
                  <span>Câmera Principal: Usina Tubarão</span>
                </span>
                
                {!videoFinished && (
                  <button 
                    onClick={handleSkipVideo}
                    className="bg-orange-600 hover:bg-orange-500 text-white text-[10px] font-bold font-mono px-2 py-1 rounded-sm transition-all shadow-md cursor-pointer uppercase"
                  >
                    Atalhar Assistir
                  </button>
                )}
              </div>

              {/* Central play button when paused */}
              {!isPlaying && !videoFinished && (
                <button
                  onClick={handlePlayPause}
                  className="mx-auto flex items-center justify-center w-14 h-14 rounded-full bg-orange-600 hover:bg-orange-500 text-white shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  style={{ touchAction: "manipulation" }}
                >
                  <Play className="w-6 h-6 fill-current ml-1" />
                </button>
              )}

              {videoFinished && (
                <div className="mx-auto flex flex-col items-center justify-center p-4 bg-slate-900/95 rounded-2xl border border-green-500/30 text-center max-w-xs backdrop-blur-md">
                  <CheckCircle2 className="w-10 h-10 text-green-500 mb-2" />
                  <p className="text-sm font-bold text-white">Treinamento Concluído</p>
                  <p className="text-slate-400 text-xs mt-1">O teste teórico de segurança já está disponível abaixo.</p>
                </div>
              )}

              {/* Lower subtitles & overlay */}
              <div className="space-y-2">
                {/* Simulated Subtitles */}
                {isPlaying && (
                  <div className="bg-black/80 px-3 py-1.5 rounded-lg text-center mx-auto max-w-md">
                    <p className="text-xs text-amber-300 font-sans leading-relaxed">
                      {getSubtitles()}
                    </p>
                  </div>
                )}

                {/* Progress bar and controls */}
                <div className="flex items-center space-x-3 bg-slate-900/90 p-2 rounded-lg backdrop-blur-md">
                  <button
                    onClick={handlePlayPause}
                    disabled={videoFinished}
                    className={`p-1.5 rounded text-white ${videoFinished ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-800 cursor-pointer"}`}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current text-orange-500" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>

                  <button
                    onClick={handleRestartVideo}
                    title="Reiniciar Vídeo"
                    className="p-1.5 rounded text-white hover:bg-slate-800 cursor-pointer"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>

                  {/* Progress Line */}
                  <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
                    <div 
                      className="absolute top-0 left-0 bottom-0 bg-orange-500 transition-all rounded-full duration-300"
                      style={{ width: `${videoProgress}%` }}
                    ></div>
                  </div>

                  <span className="font-mono text-[10px] text-slate-300">
                    {Math.floor((videoProgress / 100) * 8)}s / 8s
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Quiz Panel (Enabled after video completes) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono flex items-center space-x-1.5">
              <span className={`w-2 h-2 rounded-full ${quizFinished ? "bg-green-500" : videoFinished ? "bg-orange-500" : "bg-slate-300"}`}></span>
              <span>2. Avaliação de Aprendizado</span>
            </span>
            {videoFinished && !quizFinished && (
              <span className="text-xs font-mono text-slate-400">
                Questão {currentQuestionIndex + 1} de {SAFETY_QUESTIONS.length}
              </span>
            )}
          </div>

          <AnimatePresence mode="wait">
            {!videoFinished ? (
              /* Gated screen overlay */
              <motion.div 
                key="gated"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center flex flex-col items-center justify-center space-y-3"
              >
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-sm text-slate-800">
                    Quiz Bloqueado
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mt-1 leading-normal">
                    Você deve assistir ao vídeo de segurança completo para liberar as perguntas de múltipla escolha.
                  </p>
                </div>
              </motion.div>
            ) : quizFinished ? (
              /* Finished/Passed quiz state */
              <motion.div 
                key="finished"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center flex flex-col items-center justify-center space-y-4"
              >
                <div className="h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-200">
                  <Award className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-base text-slate-900">
                    Aprovado no Treinamento Técnico!
                  </h4>
                  <p className="text-xs text-slate-600 max-w-md mt-1 leading-relaxed">
                    Você acertou <strong className="text-emerald-700">{worker.quizScore || correctAnswersCount} de {SAFETY_QUESTIONS.length} perguntas</strong> e provou conhecer muito bem as Regras de Ouro de Segurança da ArcelorMittal!
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2 w-full max-w-xs">
                  <button
                    onClick={handleRetakeQuiz}
                    className="w-full sm:w-auto px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg transition-all cursor-pointer"
                  >
                    Refazer Teste
                  </button>
                  <button
                    onClick={() => setIsCertOpen(true)}
                    className="w-full sm:w-auto px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center space-x-1 shadow-sm"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Ver Certificado (PDF)</span>
                  </button>
                  <div className="flex items-center space-x-1 bg-green-200 text-green-900 border border-green-300 font-mono text-[10px] font-bold px-3 py-2 rounded-lg">
                    <ThumbsUp className="w-3.5 h-3.5 mr-1" />
                    <span>Frequência Ok</span>
                  </div>
                </div>

                <CertificateModal 
                  worker={worker} 
                  isOpen={isCertOpen} 
                  onClose={() => setIsCertOpen(false)} 
                />
              </motion.div>
            ) : (
              /* Active quiz state */
              <motion.div 
                key="active"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4 bg-slate-50 border border-slate-200 rounded-xl p-5"
              >
                {/* Question text */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-amber-600 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    Regra de Ouro da Usina
                  </span>
                  <h4 className="font-semibold text-slate-900 text-sm md:text-base leading-snug mt-1.5">
                    {currentQuestion.questionText}
                  </h4>
                </div>

                {/* Option buttons */}
                <div className="space-y-2 mt-3">
                  {currentQuestion.options.map((option, idx) => {
                    // Double-code states for accessibility (colorblind safety). Let's use letters & specific active ticks.
                    const isSelected = selectedOption === idx;
                    const isCorrectOption = idx === currentQuestion.correctOptionIndex;
                    
                    let optionStyle = "border-slate-200 bg-white text-slate-800 hover:bg-slate-100";
                    let prefixLabel = String.fromCharCode(65 + idx); // A, B, C, D
                    
                    if (isAnswered) {
                      if (isCorrectOption) {
                        optionStyle = "border-emerald-500 bg-emerald-50/50 text-emerald-900 font-medium ring-1 ring-emerald-500";
                      } else if (isSelected) {
                        optionStyle = "border-red-500 bg-red-50/50 text-red-900 ring-1 ring-red-500";
                      } else {
                        optionStyle = "border-slate-200 bg-slate-100 opacity-60 text-slate-500";
                      }
                    } else if (isSelected) {
                      optionStyle = "border-orange-500 bg-orange-50/30 text-orange-900 font-medium ring-1 ring-orange-500";
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={isAnswered}
                        style={{ touchAction: "manipulation" }}
                        className={`w-full text-left px-4 py-3 rounded-xl border text-xs leading-relaxed transition-all flex items-start space-x-3 cursor-pointer ${optionStyle}`}
                      >
                        <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                          isAnswered && isCorrectOption 
                            ? "bg-emerald-600 text-white" 
                            : isAnswered && isSelected 
                            ? "bg-red-600 text-white" 
                            : isSelected 
                            ? "bg-orange-500 text-white" 
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}>
                          {isAnswered && isCorrectOption ? "✓" : isAnswered && isSelected ? "✗" : prefixLabel}
                        </span>
                        <span className="flex-1 font-sans">{option}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation feedback block */}
                {isAnswered && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className={`p-4 rounded-xl text-xs leading-relaxed border space-y-1.5 ${
                      selectedOption === currentQuestion.correctOptionIndex
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : "bg-red-50 border-red-200 text-red-800"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {selectedOption === currentQuestion.correctOptionIndex ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <ShieldAlert className="w-4 h-4 text-red-600" />
                      )}
                      <strong className="font-bold">
                        {selectedOption === currentQuestion.correctOptionIndex 
                          ? "Resposta Correta!" 
                          : "Resposta Incorreta!"}
                      </strong>
                    </div>
                    <p className="font-medium text-slate-700">
                      {currentQuestion.explanation}
                    </p>
                  </motion.div>
                )}

                {/* Control buttons */}
                <div className="flex justify-end pt-2">
                  {!isAnswered ? (
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={selectedOption === null}
                      className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                        selectedOption === null
                          ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                          : "bg-orange-600 hover:bg-orange-500 text-white shadow-md active:scale-95"
                      }`}
                    >
                      <span>Validar Resposta</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="px-5 py-2.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all active:scale-95 flex items-center space-x-2 cursor-pointer"
                    >
                      <span>
                        {currentQuestionIndex === SAFETY_QUESTIONS.length - 1 
                          ? "Concluir e Liberar Próxima Etapa" 
                          : "Próxima Pergunta"}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

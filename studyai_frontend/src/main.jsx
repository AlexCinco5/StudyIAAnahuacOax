import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BrainCircuit, BookOpen, UploadCloud, FileText, Image as ImageIcon,
  File as FileIcon, Sparkles, ChevronDown, ChevronRight, CheckCircle2,
  CircleHelp, Clock3, ShieldCheck, ArrowRight, X, LoaderCircle,
  ClipboardList, RotateCcw, GraduationCap, Menu, Download, ScanText
} from "lucide-react";
import "./styles.css";

const demoSummary = [
  {
    title: "¿Qué es el reconocimiento óptico de caracteres?",
    body: "El OCR (Optical Character Recognition) es una tecnología que identifica caracteres dentro de una imagen y los convierte en texto digital que puede procesarse en una computadora."
  },
  {
    title: "¿Cómo funciona un Transformer?",
    body: "Los modelos Transformer procesan secuencias de texto mediante mecanismos de atención, lo que les permite relacionar palabras y contexto para tareas como resumir información y generar preguntas."
  },
  {
    title: "¿Cómo se combinan en StudyAI?",
    body: "El OCR se utiliza cuando la fuente es una imagen o un documento escaneado. Después, el texto extraído se prepara y se envía a un modelo Transformer para generar material de estudio."
  }
];

const demoQuestions = [
  {
    question: "¿Cuál es la función principal de un sistema OCR?",
    options: [
      "Diseñar páginas web automáticamente",
      "Convertir texto presente en imágenes a texto digital",
      "Entrenar un modelo desde cero",
      "Almacenar documentos en una base de datos"
    ],
    answer: 1,
    explanation: "El OCR reconoce caracteres dentro de imágenes y los convierte en texto procesable."
  },
  {
    question: "Los modelos Transformer pueden utilizarse para generar resúmenes de texto.",
    options: ["Verdadero", "Falso"],
    answer: 0,
    explanation: "Los modelos Transformer preentrenados pueden utilizarse en tareas de generación y resumen de texto."
  },
  {
    question: "¿En qué momento se utiliza OCR dentro del flujo de StudyAI?",
    options: [
      "Después de calificar el cuestionario",
      "Únicamente al guardar resultados",
      "Cuando el material de entrada contiene texto en imágenes",
      "Para construir la interfaz de React"
    ],
    answer: 2,
    explanation: "El OCR se utiliza cuando hace falta extraer texto de una imagen o documento escaneado."
  }
];

function App() {
  const [activeTab, setActiveTab] = useState("summary");
  const [inputText, setInputText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const fileInput = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    const allowed = ["application/pdf", "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/png", "image/jpeg", "image/webp", "text/plain"];
    const extOk = /\.(pdf|doc|docx|png|jpe?g|webp|txt)$/i.test(file.name);
    if (!allowed.includes(file.type) && !extOk) {
      alert("Formato no compatible. Usa PDF, Word, TXT, JPG, PNG o WEBP.");
      return;
    }
    setSelectedFile(file);
    setGenerated(false);
    setSubmitted(false);
    if (file.type === "text/plain" || file.name.toLowerCase().endsWith(".txt")) {
      const reader = new FileReader();
      reader.onload = (event) => setInputText(String(event.target.result || ""));
      reader.readAsText(file);
    }
  };

  // --- FUNCIÓN ACTUALIZADA PARA CONECTAR CON FASTAPI ---
  const generate = async () => {
    if (!inputText.trim() && !selectedFile) {
      alert("Escribe un texto o carga un archivo para comenzar.");
      return;
    }
    
    setIsGenerating(true);
    setGenerated(false);
    setSubmitted(false);
    setAnswers({});

    const formData = new FormData();
    if (selectedFile) {
      formData.append("file", selectedFile);
    } else if (inputText) {
      formData.append("text_input", inputText);
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/generate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error de conexión con el backend");
      }

      const data = await response.json();
      console.log("Datos recibidos de la IA:", data);
      
      setIsGenerating(false);
      setGenerated(true);
      setActiveTab("summary");
      
    } catch (error) {
      console.error(error);
      alert("Hubo un problema al contactar con la IA local.");
      setIsGenerating(false);
    }
  };
  // -----------------------------------------------------

  const reset = () => {
    setSelectedFile(null);
    setInputText("");
    setGenerated(false);
    setSubmitted(false);
    setAnswers({});
    if (fileInput.current) fileInput.current.value = "";
  };

  const score = demoQuestions.reduce((sum, q, index) => sum + (answers[index] === q.answer ? 1 : 0), 0);
  const hasInput = Boolean(inputText.trim() || selectedFile);

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><BrainCircuit size={24} strokeWidth={2.2} /></div>
          <div><span className="brand-name">StudyAI</span><span className="brand-caption">STUDY SMARTER</span></div>
          <button className="mobile-close icon-button" onClick={() => setMobileMenu(false)} aria-label="Cerrar menú"><X size={18}/></button>
        </div>

        <div className="workspace-label">TU ESPACIO</div>
        <button className="nav-item active" onClick={() => { setMobileMenu(false); }}>
          <div className="nav-icon"><BookOpen size={18}/></div><span>Mi material de estudio</span>
        </button>
        <button className="nav-item" onClick={() => { setActiveTab("quiz"); setMobileMenu(false); }}>
          <div className="nav-icon"><ClipboardList size={18}/></div><span>Cuestionario</span>
        </button>

        <div className="sidebar-bottom">
          <div className="sidebar-help-icon"><GraduationCap size={20}/></div>
          <div className="sidebar-help-title">Aprende a tu ritmo</div>
          <p>Convierte tus apuntes en una forma más clara de estudiar.</p>
          <div className="sidebar-mini-line"><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
          <div className="profile">
            <div className="avatar">S</div>
            <div className="profile-text"><strong>Estudiante</strong><span>Espacio personal</span></div>
            <ChevronDown size={16} className="muted-icon"/>
          </div>
        </div>
      </aside>

      {mobileMenu && <div className="mobile-scrim" onClick={() => setMobileMenu(false)} />}

      <main className="main-area">
        <header className="topbar">
          <button className="icon-button mobile-menu-button" onClick={() => setMobileMenu(true)} aria-label="Abrir menú"><Menu size={20}/></button>
          <div className="breadcrumb">Workspace <ChevronRight size={14}/> <strong>Mi material de estudio</strong></div>
          <div className="topbar-right"><span className="status-dot"></span><span>Prototipo académico</span><div className="top-avatar">S</div></div>
        </header>

        <div className="content">
          <section className="welcome-row">
            <div>
              <div className="eyebrow"><Sparkles size={14}/> TU ASISTENTE DE ESTUDIO</div>
              <h1>Estudia de forma <span>más inteligente.</span></h1>
              <p className="welcome-subtitle">Sube tus apuntes y transforma la información en resúmenes y cuestionarios.</p>
            </div>
            <div className="welcome-illustration" aria-hidden="true">
              <div className="orbit orbit-one"></div><div className="orbit orbit-two"></div>
              <div className="illustration-card card-back"><FileText size={23}/><span></span><span></span></div>
              <div className="illustration-card card-front"><BrainCircuit size={38}/><span className="sparkle sparkle-a">✦</span><span className="sparkle sparkle-b">✧</span></div>
            </div>
          </section>

          <section className="steps-strip">
            <div className="step-item"><div className="step-number">1</div><div><strong>Sube tu material</strong><span>PDF, Word, texto o imagen</span></div></div>
            <div className="step-connector"></div>
            <div className="step-item"><div className="step-number">2</div><div><strong>Procesa con IA</strong><span>OCR + Transformers</span></div></div>
            <div className="step-connector"></div>
            <div className="step-item"><div className="step-number">3</div><div><strong>Practica</strong><span>Resumen y cuestionario</span></div></div>
          </section>

          <div className="main-grid">
            <section className="panel upload-panel">
              <div className="panel-heading">
                <div><div className="section-kicker">PASO 01</div><h2>Agrega tu material</h2></div>
                <span className="heading-icon"><UploadCloud size={19}/></span>
              </div>
              <p className="panel-description">Usa un archivo o pega el texto de tus apuntes para comenzar.</p>

              <div
                className={`drop-zone ${isDragging ? "dragging" : ""} ${selectedFile ? "has-file" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files?.[0]); }}
                onClick={() => fileInput.current?.click()}
                role="button" tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInput.current?.click(); }}
              >
                <input ref={fileInput} type="file" hidden accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.webp" onChange={(e) => handleFile(e.target.files?.[0])}/>
                {selectedFile ? (
                  <div className="selected-file">
                    <div className="file-type-icon">{selectedFile.type.startsWith("image/") ? <ImageIcon size={23}/> : <FileIcon size={23}/>}</div>
                    <div className="file-info"><strong>{selectedFile.name}</strong><span>{(selectedFile.size / 1024).toFixed(0)} KB · Archivo seleccionado</span></div>
                    <button className="remove-file" onClick={(e) => { e.stopPropagation(); setSelectedFile(null); if(fileInput.current) fileInput.current.value = ""; }} aria-label="Quitar archivo"><X size={17}/></button>
                  </div>
                ) : (
                  <>
                    <div className="upload-symbol"><UploadCloud size={25}/></div>
                    <strong>Arrastra tu archivo aquí</strong>
                    <span>o <em>selecciona un archivo</em> desde tu equipo</span>
                    <div className="format-pills"><span>PDF</span><span>DOCX</span><span>JPG</span><span>PNG</span><span>TXT</span></div>
                  </>
                )}
              </div>

              <div className="or-divider"><span></span><small>O PEGA TU TEXTO</small><span></span></div>
              <label className="input-label" htmlFor="study-text">Contenido de tus apuntes</label>
              <textarea id="study-text" value={inputText} onChange={(e) => { setInputText(e.target.value); setGenerated(false); }} placeholder="Pega aquí un fragmento de tus apuntes, clase o lectura..." rows={5}/>
              <div className="textarea-footer"><span>{inputText.length.toLocaleString("es-MX")} caracteres</span><span>Español <ChevronDown size={13}/></span></div>

              <div className="privacy-note"><ShieldCheck size={16}/><span>Prototipo de demostración. Los archivos no se envían a un servidor en esta versión.</span></div>
              <button className="primary-button" onClick={generate} disabled={isGenerating || !hasInput}>
                {isGenerating ? <><LoaderCircle size={18} className="spin"/> Analizando con IA local...</> : <><Sparkles size={17}/> Generar material de estudio <ArrowRight size={17}/></>}
              </button>
              <button className="reset-button" onClick={reset}><RotateCcw size={14}/> Limpiar y empezar de nuevo</button>
            </section>

            <section className="panel results-panel">
              <div className="panel-heading results-heading">
                <div><div className="section-kicker">PASO 02</div><h2>Tu material de estudio</h2></div>
                <span className="ai-pill"><span></span> AI STUDY SPACE</span>
              </div>

              {!generated ? (
                <div className="empty-state">
                  <div className="empty-graphic">
                    <div className="empty-paper"><div></div><div></div><div></div><div></div></div>
                    <div className="empty-bubble"><Sparkles size={22}/></div>
                  </div>
                  <h3>Tu próximo tema, más fácil de estudiar</h3>
                  <p>Agrega un documento o pega tu texto. Aquí aparecerán el resumen y el cuestionario.</p>
                  <div className="preview-features">
                    <div><span className="feature-icon purple"><BookOpen size={17}/></span><span><strong>Resumen claro</strong><small>Conceptos principales organizados</small></span></div>
                    <div><span className="feature-icon peach"><CircleHelp size={17}/></span><span><strong>Preguntas para practicar</strong><small>Comprueba lo que aprendiste</small></span></div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="source-banner"><CheckCircle2 size={16}/><span>Entrada lista para demostración</span><span className="demo-tag">DATOS DE EJEMPLO</span></div>
                  <div className="result-tabs">
                    <button className={activeTab === "summary" ? "selected" : ""} onClick={() => setActiveTab("summary")}><BookOpen size={16}/> Resumen</button>
                    <button className={activeTab === "quiz" ? "selected" : ""} onClick={() => setActiveTab("quiz")}><ClipboardList size={16}/> Cuestionario <span className="tab-count">3</span></button>
                  </div>
                  {activeTab === "summary" ? (
                    <div className="summary-content">
                      <div className="summary-meta"><span><Sparkles size={14}/> Resumen organizado</span><span><Clock3 size={14}/> Lectura de 2 min</span></div>
                      <h3>Conceptos clave</h3>
                      {demoSummary.map((item, index) => (
                        <article className="summary-section" key={item.title}>
                          <div className="summary-index">0{index + 1}</div>
                          <div><h4>{item.title}</h4><p>{item.body}</p></div>
                        </article>
                      ))}
                      <div className="source-reminder"><ShieldCheck size={16}/><span>En la versión final, el contenido se generará a partir del documento que proporciones y deberá validarse con la fuente original.</span></div>
                      <button className="secondary-button" onClick={() => setActiveTab("quiz")}>Practicar con preguntas <ArrowRight size={16}/></button>
                    </div>
                  ) : (
                    <div className="quiz-content">
                      <div className="quiz-topline"><div><span className="quiz-label">REPASO RÁPIDO</span><h3>Comprueba lo que sabes</h3></div><div className="question-total">03 <span>preguntas</span></div></div>
                      {demoQuestions.map((q, index) => (
                        <div className="question-card" key={q.question}>
                          <div className="question-title"><span>{String(index + 1).padStart(2, "0")}</span><strong>{q.question}</strong></div>
                          <div className="options-list">
                            {q.options.map((option, optionIndex) => {
                              const isChosen = answers[index] === optionIndex;
                              const isCorrect = submitted && optionIndex === q.answer;
                              const isWrong = submitted && isChosen && optionIndex !== q.answer;
                              return <button key={option} className={`option ${isChosen ? "chosen" : ""} ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`} onClick={() => { if (!submitted) setAnswers({...answers, [index]: optionIndex}); }}>
                                <span className="option-letter">{String.fromCharCode(65 + optionIndex)}</span><span>{option}</span>{isCorrect && <CheckCircle2 size={16}/>}
                              </button>;
                            })}
                          </div>
                          {submitted && <div className={`explanation ${answers[index] === q.answer ? "explanation-correct" : ""}`}><strong>{answers[index] === q.answer ? "¡Correcto!" : "Respuesta correcta: " + q.options[q.answer]}</strong><span>{q.explanation}</span></div>}
                        </div>
                      ))}
                      {submitted ? (
                        <div className="score-panel"><div className="score-icon"><GraduationCap size={24}/></div><div><span>Tu resultado</span><strong>{score} de {demoQuestions.length} correctas</strong></div><button className="secondary-button compact" onClick={() => { setAnswers({}); setSubmitted(false); }}>Volver a intentar</button></div>
                      ) : (
                        <button className="primary-button quiz-submit" onClick={() => setSubmitted(true)} disabled={Object.keys(answers).length !== demoQuestions.length}>Calificar respuestas <ArrowRight size={17}/></button>
                      )}
                      <p className="quiz-disclaimer">Preguntas de ejemplo para mostrar la interacción del prototipo.</p>
                    </div>
                  )}
                </>
              )}
            </section>
          </div>

          <footer className="page-footer">
            <div className="footer-brand"><div className="footer-mark"><BrainCircuit size={16}/></div><strong>StudyAI</strong><span>·</span><span>Proyecto académico</span></div>
            <div className="footer-note"><span className="footer-dot"></span> Interfaz demostrativa · OCR + Transformers por integrar</div>
          </footer>
        </div>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
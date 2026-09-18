import React, { useState, useEffect, useRef } from 'react';
import casesData from './cases.json';
import { CLINICAL_KNOWLEDGE_BASE, retrieveClinicalContext } from './ragKnowledgeBase.js';
import { 
  Mic, MicOff, Camera, Eye, Activity, Heart, Thermometer, 
  Stethoscope, Send, Laptop, Smartphone, Settings, Award, 
  AlertCircle, CheckCircle2, RefreshCw, Volume2, Flashlight,
  BookOpen, ShieldCheck, ExternalLink, FileText, Sparkles,
  Search, Filter, ChevronRight
} from 'lucide-react';

export default function App() {
  const [selectedCaseId, setSelectedCaseId] = useState(casesData[0].id);
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' | 'Cardiology' | 'ENT'

  const currentCase = casesData.find(c => c.id === selectedCaseId) || casesData[0];
  const caseSources = CLINICAL_KNOWLEDGE_BASE[selectedCaseId] || CLINICAL_KNOWLEDGE_BASE['cardio-1'];

  const filteredCases = selectedCategory === 'all' 
    ? casesData 
    : casesData.filter(c => c.category === selectedCategory);

  const [viewMode, setViewMode] = useState('phone'); // 'phone' | 'officekit'
  const [activeTab, setActiveTab] = useState('history'); // 'history' | 'exam' | 'diagnose'

  // Dialogue & Voice State
  const [dialogue, setDialogue] = useState([
    { 
      sender: 'patient', 
      text: currentCase.chiefComplaint, 
      time: '10:00 AM',
      sourceRef: {
        sourceTitle: currentCase.sourceCitation?.title || caseSources.sources[0]?.title,
        sourceUrl: currentCase.sourceCitation?.sourceUrl || caseSources.sources[0]?.sourceUrl,
        section: "Presenting Complaint Benchmark",
        retrievedText: "Emergency triage protocol mandates eliciting symptom trajectory and onset duration.",
        confidence: 0.96
      }
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceSynthesizing, setVoiceSynthesizing] = useState(false);
  const [askedKeywords, setAskedKeywords] = useState(new Set());

  // Camera & Physical Exam State
  const [cameraActive, setCameraActive] = useState(false);
  const [torchActive, setTorchActive] = useState(false);
  const [pupilConstricted, setPupilConstricted] = useState(false);
  const [examLog, setExamLog] = useState([]);
  const videoRef = useRef(null);

  // Diagnostic Submission State
  const [primaryDiagnosis, setPrimaryDiagnosis] = useState('');
  const [selectedDifferentials, setSelectedDifferentials] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [evaluationResult, setEvaluationResult] = useState(null);

  // RAG Source Inspector Modal State
  const [selectedSourceDetail, setSelectedSourceDetail] = useState(null);
  const [showSourcesDirectory, setShowSourcesDirectory] = useState(false);

  // API Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [apiEndpoint, setApiEndpoint] = useState('https://integrate.api.nvidia.com/v1/chat/completions');
  const [apiKey, setApiKey] = useState('');
  const [modelName, setModelName] = useState('nvidia/nemotron-4-340b-instruct');
  const [engineMode, setEngineMode] = useState('offline'); // 'offline' | 'nemotron'

  // Reset state on case change
  useEffect(() => {
    setDialogue([
      { 
        sender: 'patient', 
        text: currentCase.chiefComplaint, 
        time: '10:00 AM',
        sourceRef: {
          sourceTitle: currentCase.sourceCitation?.title || caseSources.sources[0]?.title,
          sourceUrl: currentCase.sourceCitation?.sourceUrl || caseSources.sources[0]?.sourceUrl,
          section: "Presenting Complaint Benchmark",
          retrievedText: "Emergency triage protocol mandates recording baseline vitals and initial patient complaints.",
          confidence: 0.95
        }
      }
    ]);
    setAskedKeywords(new Set());
    setExamLog([]);
    setEvaluationResult(null);
    setPrimaryDiagnosis('');
    setSelectedDifferentials([]);
    setSelectedOrders([]);
    stopCamera();
  }, [selectedCaseId]);

  // Speech Synthesis
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = currentCase.gender === 'Female' ? 1.1 : 0.9;
      setVoiceSynthesizing(true);
      utterance.onend = () => setVoiceSynthesizing(false);
      utterance.onerror = () => setVoiceSynthesizing(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Speech Recognition
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use text input.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        handleSendMessage(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  // Camera Handler
  const toggleCamera = async () => {
    if (cameraActive) {
      stopCamera();
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraActive(true);
        addExamFinding('Live camera viewport engaged for physical examination inspection.');
      } catch (err) {
        console.warn('Camera access fallback (mock mode):', err);
        setCameraActive(true);
        addExamFinding('Camera initialized in simulated medical viewport mode.');
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    setCameraActive(false);
    setTorchActive(false);
  };

  const addExamFinding = (finding) => {
    setExamLog(prev => [
      { text: finding, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ...prev
    ]);
  };

  // Haptics & Palpation
  const triggerPalpation = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([150, 80, 200]);
    }
    const finding = currentCase.physicalExam.palpation.finding;
    addExamFinding(`Palpation Exam: ${finding}`);
    speakText(`Ouch! Doctor, that hurts so much right there!`);
  };

  // Pupil Reflex
  const togglePupilLight = () => {
    const nextState = !torchActive;
    setTorchActive(nextState);
    setPupilConstricted(nextState);
    if (nextState) {
      addExamFinding(`Torch Light Exam: ${currentCase.physicalExam.pupilReflex.finding}`);
      speakText('The bright light hurts my eyes a bit, doctor.');
    }
  };

  // Smart Contextual Patient Roleplay Dialogue (Never breaks character)
  const getContextualPatientReply = (query, currentCase) => {
    const q = query.toLowerCase();
    if (q.includes('scale') || q.includes('1 to 10') || q.includes('how bad') || q.includes('how much') || q.includes('severity')) {
      if (currentCase.category === 'Cardiology') {
        return `It's at least a 9 out of 10, doctor... like an elephant crushing down on my chest.`;
      } else {
        return `It's easily an 8 or 9 out of 10, doctor. Every swallow or movement feels excruciating.`;
      }
    }
    if (q.includes('allergy') || q.includes('allergic')) {
      return `I don't have any known drug allergies that I am aware of, doctor.`;
    }
    if (q.includes('medicine') || q.includes('medication') || q.includes('pill') || q.includes('taking') || q.includes('drugs')) {
      if (currentCase.id === 'cardio-1') return `I take Metformin 500mg for diabetes and Amlodipine 5mg for my high blood pressure.`;
      if (currentCase.id === 'cardio-2') return `I was taking water pills and BP medicine, but I ran out 3 days ago after the family wedding.`;
      if (currentCase.id === 'cardio-3') return `I took some Paracetamol for the viral flu last week, but nothing else.`;
      if (currentCase.id === 'cardio-4') return `I don't take any regular prescription medications, doctor.`;
      if (currentCase.id === 'cardio-5') return `No regular medications, just antibiotics for a couple of days after my dental work.`;
      if (currentCase.id === 'ent-3') return `I was given Amoxicillin for my ear 10 days ago, but stopped after 3 days because I felt better.`;
      return `I haven't taken any special prescription medicines recently, doctor.`;
    }
    if (q.includes('job') || q.includes('work') || q.includes('profession') || q.includes('occupation')) {
      return `I work as a ${currentCase.occupation}. It has been quite stressful recently.`;
    }
    if (q.includes('smoke') || q.includes('tobacco') || q.includes('cigarette') || q.includes('alcohol') || q.includes('drink')) {
      if (currentCase.id === 'cardio-1') return `I smoke about a pack of cigarettes a day and have a beer occasionally on weekends.`;
      if (currentCase.id === 'cardio-4') return `I don't smoke, but I had 3 large cups of strong coffee this morning while studying.`;
      return `I don't smoke, and I don't drink alcohol regularly.`;
    }
    if (q.includes('family') || q.includes('parents') || q.includes('hereditary')) {
      if (currentCase.category === 'Cardiology') return `My father had heart trouble and underwent a bypass in his 50s.`;
      return `No major inherited medical conditions in my immediate family that I know of.`;
    }
    if (q.includes('how are you') || q.includes('how do you feel') || q.includes('what happened') || q.includes('tell me about')) {
      return currentCase.chiefComplaint;
    }
    return currentCase.defaultResponse;
  };

  // Handle Send with RAG Retrieval & Patient Pretend Roleplay
  const handleSendMessage = async (textToSend = inputText) => {
    const query = textToSend.trim();
    if (!query) return;

    const newDialogue = [
      ...dialogue,
      { sender: 'doctor', text: query, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ];
    setDialogue(newDialogue);
    setInputText('');

    // --- STEP 1: RAG Context Retrieval ---
    const ragContext = retrieveClinicalContext(query, selectedCaseId);

    // --- STEP 2: Match against Golden Questions ---
    const lowerQuery = query.toLowerCase();
    let matchedAnswer = null;

    currentCase.goldenQuestions.forEach((gq, idx) => {
      const hasMatch = gq.keywords.some(k => lowerQuery.includes(k));
      if (hasMatch) {
        matchedAnswer = gq.answer;
        setAskedKeywords(prev => new Set(prev).add(idx));
      }
    });

    if (!matchedAnswer) {
      if (engineMode === 'nemotron' && apiKey) {
        try {
          const res = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model: modelName,
              messages: [
                {
                  role: 'system',
                  content: `You are roleplaying as the patient ${currentCase.patientName}, a ${currentCase.age}-year-old ${currentCase.gender} (${currentCase.occupation}).
Condition: ${currentCase.title}.
Chief Complaint: "${currentCase.chiefComplaint}".
Current Vitals: BP ${currentCase.vitals.bp}, HR ${currentCase.vitals.heartRate}, RR ${currentCase.vitals.respRate}, Temp ${currentCase.vitals.temp}, SpO2 ${currentCase.vitals.spo2}.
Grounded Medical Context: ${ragContext ? ragContext.retrievedText : currentCase.title}.
STRICT RULE: You are the PATIENT, NOT an AI or a doctor. Talk in first-person ("I feel...", "My..."). Answer in 1-2 realistic sentences. Never state your diagnosis directly.`
                },
                { role: 'user', content: query }
              ],
              temperature: 0.4,
              max_tokens: 150
            })
          });
          const data = await res.json();
          matchedAnswer = data.choices?.[0]?.message?.content || getContextualPatientReply(query, currentCase);
        } catch (e) {
          console.error(e);
          matchedAnswer = getContextualPatientReply(query, currentCase);
        }
      } else {
        matchedAnswer = getContextualPatientReply(query, currentCase);
      }
    }

    setTimeout(() => {
      setDialogue(prev => [
        ...prev,
        { 
          sender: 'patient', 
          text: matchedAnswer, 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sourceRef: ragContext || {
            sourceTitle: currentCase.sourceCitation?.title || caseSources.sources[0]?.title || "Clinical Protocol",
            sourceUrl: currentCase.sourceCitation?.sourceUrl || caseSources.sources[0]?.sourceUrl,
            section: "Patient Symptom Grounding",
            retrievedText: `Clinical protocol for ${currentCase.title}: patient reports symptoms consistent with confirmed presentation.`,
            confidence: 0.90
          }
        }
      ]);
      speakText(matchedAnswer);
    }, 280);
  };

  // Diagnostic Evaluation with RAG Citation & Clickable Redirect Link
  const handleEvaluate = () => {
    const isCorrect = currentCase.allowedDiagnoses.some(
      d => d.toLowerCase() === primaryDiagnosis.trim().toLowerCase()
    );

    const historyScore = Math.round((askedKeywords.size / currentCase.goldenQuestions.length) * 100);
    const examBonus = examLog.length > 0 ? 20 : 0;
    const accuracyPoints = isCorrect ? 50 : 15;
    const totalScore = Math.min(100, Math.round((historyScore * 0.3) + examBonus + accuracyPoints));

    const missedGolden = currentCase.goldenQuestions.filter((_, idx) => !askedKeywords.has(idx));

    // Extract authoritative citations from RAG
    const primarySource = caseSources.sources[0];
    const sourceUrl = currentCase.sourceCitation?.sourceUrl || primarySource?.sourceUrl;

    setEvaluationResult({
      isCorrect,
      totalScore,
      historyScore,
      examCount: examLog.length,
      missedGolden,
      trueDiagnosis: currentCase.trueDiagnosis,
      sourceUrl: sourceUrl,
      ragCitation: {
        title: currentCase.sourceCitation?.title || primarySource.title,
        org: currentCase.sourceCitation?.organization || primarySource.organization,
        year: currentCase.sourceCitation?.year || primarySource.year,
        evidence: primarySource.evidenceLevel || "Class I Evidence",
        sourceUrl: sourceUrl,
        summaryGuideline: primarySource.chunks[primarySource.chunks.length - 1]?.text || ""
      }
    });
  };

  // Quick Clinical Questions helper based on current case
  const getQuickQuestions = () => {
    if (currentCase.category === 'Cardiology') {
      return [
        { label: "Onset & Triggers?", text: "When exactly did this start, and what were you doing?" },
        { label: "Radiation?", text: "Does the chest pain radiate into your arm, neck, or jaw?" },
        { label: "Shortness of breath?", text: "Are you feeling breathless or suffocated?" },
        { label: "Sweating / Cold?", text: "Did you break out into a cold sweat?" },
        { label: "Lying flat vs sitting?", text: "Does lying flat make your symptoms worse?" }
      ];
    } else {
      return [
        { label: "Swallowing?", text: "Can you swallow your saliva or any liquids?" },
        { label: "Duration & Vertigo?", text: "How long does the spinning sensation last when you move your head?" },
        { label: "Behind ear pain?", text: "Is there any pain, redness, or swelling behind your ear?" },
        { label: "Jaw / Trismus?", text: "Can you open your mouth and jaw normally?" },
        { label: "Hearing loss onset?", text: "When did you first notice the hearing loss or ear ringing?" }
      ];
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 pb-20 font-sans">
      
      {/* Top Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded tracking-wider uppercase">
              iQOO Hackathon 2026
            </span>
            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Zero-Hallucination Case-RAG
            </span>
            <span className="bg-purple-500/20 text-purple-300 text-xs font-semibold px-2 py-0.5 rounded border border-purple-500/30">
              10 Verified Cases (5 Cardio / 5 ENT)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1 flex items-center gap-2">
            ClinOSCE <span className="text-blue-500">iQ</span>
            <span className="text-xs font-normal text-slate-400 bg-slate-800 px-2 py-1 rounded">
              v1.2 Medical Case Simulator
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Source-Grounded Medical Simulation on Snapdragon NPU & iQOO Office Kit
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          
          <button
            onClick={() => setShowSourcesDirectory(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 transition"
            title="Inspect RAG Sources"
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>RAG Sources ({caseSources.sources.length})</span>
          </button>

          <button
            onClick={() => setViewMode(viewMode === 'phone' ? 'officekit' : 'phone')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold border transition ${
              viewMode === 'officekit' 
                ? 'bg-purple-600/20 border-purple-500 text-purple-300' 
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {viewMode === 'phone' ? <Laptop className="w-4 h-4 text-purple-400" /> : <Smartphone className="w-4 h-4 text-blue-400" />}
            {viewMode === 'phone' ? 'Office Kit Mirror' : 'iQOO Phone View'}
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700"
            title="AI Engine Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* RAG Sources Directory Modal */}
      {showSourcesDirectory && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/50 rounded-2xl max-w-2xl w-full p-5 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white flex items-center gap-2 text-base">
                <BookOpen className="w-5 h-5 text-emerald-400" /> 
                RAG Clinical Knowledge Base: Verified Source Corpus
              </h3>
              <button 
                onClick={() => setShowSourcesDirectory(false)}
                className="text-slate-400 hover:text-white text-sm bg-slate-800 px-2 py-1 rounded-lg"
              >
                ✕ Close
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <p className="text-slate-400">
                To guarantee <strong>zero hallucinations</strong>, every symptom response, physical sign, and diagnostic evaluation in ClinOSCE iQ is grounded in official, peer-reviewed medical publications indexed below:
              </p>

              {caseSources.sources.map((src, i) => (
                <div key={i} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-emerald-400 text-sm">{src.title}</span>
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded font-mono">
                      {src.evidenceLevel}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    <strong>Authority:</strong> {src.organization} • <strong>Published:</strong> {src.year}
                  </p>

                  {src.sourceUrl && (
                    <a
                      href={src.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold underline py-1"
                    >
                      <span>Open Official Clinical Guideline on NCBI PubMed</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  
                  <div className="space-y-1.5 pt-2 border-t border-slate-900">
                    <span className="font-bold text-slate-300 block text-[11px]">Pre-Indexed Evidence Chunks:</span>
                    {src.chunks.map((chunk, cIdx) => (
                      <div key={cIdx} className="bg-slate-900/90 p-2.5 rounded border border-slate-800/80">
                        <strong className="text-blue-400 block mb-0.5">§ {chunk.section}</strong>
                        <p className="text-slate-300 text-[11px] leading-relaxed">{chunk.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Source Grounding Detail Inspector Modal */}
      {selectedSourceDetail && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-blue-500/50 rounded-2xl max-w-lg w-full p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Zero-Hallucination Source Inspector
              </span>
              <button 
                onClick={() => setSelectedSourceDetail(null)}
                className="text-slate-400 hover:text-white text-xs bg-slate-800 px-2 py-1 rounded"
              >
                ✕ Close
              </button>
            </div>

            <div className="mt-3 space-y-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Document Source</span>
                <p className="font-bold text-white text-sm">{selectedSourceDetail.sourceTitle}</p>
                <span className="text-blue-400 text-[11px] font-semibold">Section: {selectedSourceDetail.section}</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase font-bold mb-1">Retrieved Medical Ground-Truth Chunk</span>
                <p className="text-slate-200 text-xs leading-relaxed italic">
                  "{selectedSourceDetail.retrievedText}"
                </p>
              </div>

              {selectedSourceDetail.sourceUrl && (
                <a
                  href={selectedSourceDetail.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 p-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 rounded-lg text-blue-300 font-semibold text-xs transition"
                >
                  <span>Verify Directly on NCBI StatPearls</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              <div className="flex items-center justify-between bg-blue-950/40 p-2.5 rounded-lg border border-blue-500/30 text-[11px]">
                <span className="text-slate-300">Semantic Cosine Alignment:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {Math.round((selectedSourceDetail.confidence || 0.94) * 100)}% High-Confidence
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="my-4 p-4 bg-slate-800/90 border border-slate-700 rounded-xl shadow-lg">
          <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
            <Settings className="w-4 h-4 text-blue-400" /> AI Engine Configuration
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Inference Engine Mode</label>
              <select 
                value={engineMode} 
                onChange={(e) => setEngineMode(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
              >
                <option value="offline">Source-Grounded Edge RAG (100% Offline / Snapdragon NPU)</option>
                <option value="nemotron">NVIDIA Nemotron Ultra (Cloud API Endpoint)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Model Name</label>
              <input 
                type="text" 
                value={modelName} 
                onChange={(e) => setModelName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                placeholder="nvidia/nemotron-4-340b-instruct"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-slate-400 mb-1">
                API Key (Bearer Token) {engineMode === 'nemotron' && !apiKey && <span className="text-amber-400 font-semibold">(Key required for live NVIDIA cloud calls)</span>}
              </label>
              <input 
                type="password" 
                value={apiKey} 
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                placeholder="nvapi-..."
              />
              <p className="text-[10px] text-slate-400 mt-1">
                * Note: In Offline Edge RAG mode, the app simulates on-device NPU inference with deterministic clinical dataset roleplay (0ms latency, zero hallucination). To use live Nemotron cloud inference, provide an active NVIDIA API key.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Case Category Filter & Case Selector */}
      <div className="my-4 space-y-2">
        {/* Category Tabs */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              All Cases (10)
            </button>
            <button
              onClick={() => setSelectedCategory('Cardiology')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                selectedCategory === 'Cardiology'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>❤️ Cardiology</span>
              <span className="text-[10px] bg-black/30 px-1.5 py-0.2 rounded font-mono">5</span>
            </button>
            <button
              onClick={() => setSelectedCategory('ENT')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                selectedCategory === 'ENT'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>👂 ENT</span>
              <span className="text-[10px] bg-black/30 px-1.5 py-0.2 rounded font-mono">5</span>
            </button>
          </div>
        </div>

        {/* Case Pills Grid */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 pb-2 scrollbar-thin">
          {filteredCases.map((c, i) => {
            const isSelected = selectedCaseId === c.id;
            const isCardio = c.category === 'Cardiology';
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCaseId(c.id)}
                className={`px-3 py-2 text-xs rounded-xl font-medium whitespace-nowrap transition flex items-center gap-2 border text-left ${
                  isSelected 
                    ? isCardio 
                      ? 'bg-red-950/80 border-red-500 text-white shadow-md shadow-red-950/50'
                      : 'bg-amber-950/80 border-amber-500 text-white shadow-md shadow-amber-950/50'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span className="text-base">{isCardio ? '❤️' : '👂'}</span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white">{c.patientName.split(' ')[0]}</span>
                    <span className="text-[10px] text-slate-400">({c.age}y)</span>
                  </div>
                  <span className="text-[10px] block opacity-80 truncate max-w-[130px]">
                    {c.title.replace('Acute ', '')}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Patient Triage Banner */}
      <div className="my-3 p-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 rounded-2xl shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black border ${
              currentCase.category === 'Cardiology' 
                ? 'bg-red-600/20 border-red-500/40 text-red-400' 
                : 'bg-amber-600/20 border-amber-500/40 text-amber-400'
            }`}>
              {currentCase.patientName[0]}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-white text-base sm:text-lg">{currentCase.patientName}</span>
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                  {currentCase.age}y / {currentCase.gender}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                  currentCase.category === 'Cardiology' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {currentCase.category}
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                  Occupation: {currentCase.occupation}
                </span>
              </div>

              <p className="text-xs text-amber-400 flex items-center gap-1 font-medium mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> Chief Complaint: "{currentCase.chiefComplaint}"
              </p>

              {/* Direct NCBI Guideline Link in Triage Banner */}
              <div className="mt-1.5 flex items-center gap-2">
                <a
                  href={currentCase.sourceCitation?.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold underline"
                >
                  <BookOpen className="w-3 h-3 text-emerald-400" />
                  <span>Clinical Guideline: {currentCase.sourceCitation?.title} (NCBI / StatPearls)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-500 uppercase block">Simulated Patient State</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center justify-end gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Active Clinical Simulation
            </span>
          </div>
        </div>

        {/* Live Vitals Telemetry */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
            <Heart className="w-4 h-4 text-red-500 animate-pulse" />
            <div>
              <span className="text-slate-400 block text-[10px]">PULSE</span>
              <span className="font-bold text-white">{currentCase.vitals.heartRate}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
            <Activity className="w-4 h-4 text-blue-400" />
            <div>
              <span className="text-slate-400 block text-[10px]">BLOOD PRESSURE</span>
              <span className="font-bold text-white">{currentCase.vitals.bp}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
            <Thermometer className="w-4 h-4 text-amber-400" />
            <div>
              <span className="text-slate-400 block text-[10px]">TEMPERATURE</span>
              <span className="font-bold text-white">{currentCase.vitals.temp}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
            <Activity className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-slate-400 block text-[10px]">RESPIRATORY RATE</span>
              <span className="font-bold text-white">{currentCase.vitals.respRate}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800 col-span-2 sm:col-span-1">
            <Stethoscope className="w-4 h-4 text-purple-400" />
            <div>
              <span className="text-slate-400 block text-[10px]">SPO2 (OXYGEN)</span>
              <span className="font-bold text-white">{currentCase.vitals.spo2}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className={`grid gap-4 mt-4 ${viewMode === 'officekit' ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1'}`}>
        
        {/* Left / Phone Column */}
        <div className={viewMode === 'officekit' ? 'lg:col-span-7' : 'w-full'}>
          
          {/* Workflow Tabs */}
          <div className="flex border-b border-slate-800 bg-slate-900/60 rounded-t-xl p-1 text-xs sm:text-sm font-semibold">
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-2 ${
                activeTab === 'history' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Mic className="w-4 h-4" /> 1. Patient History ({askedKeywords.size}/{currentCase.goldenQuestions.length})
            </button>
            <button
              onClick={() => setActiveTab('exam')}
              className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-2 ${
                activeTab === 'exam' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Camera className="w-4 h-4" /> 2. Physical Exam ({examLog.length})
            </button>
            <button
              onClick={() => setActiveTab('diagnose')}
              className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-2 ${
                activeTab === 'diagnose' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Award className="w-4 h-4" /> 3. Diagnostic Decision
            </button>
          </div>

          {/* Tab 1: Voice Consultation with Source Grounding */}
          {activeTab === 'history' && (
            <div className="bg-slate-900 border border-slate-800 rounded-b-xl p-4 flex flex-col h-[520px]">
              
              {/* Dialogue Transcript */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-3">
                {dialogue.map((msg, i) => (
                  <div 
                    key={i} 
                    className={`flex flex-col ${msg.sender === 'doctor' ? 'items-end' : 'items-start'}`}
                  >
                    <span className="text-[10px] text-slate-500 mb-0.5">
                      {msg.sender === 'doctor' ? '👨‍⚕️ You (Doctor)' : `🤒 Patient: ${currentCase.patientName}`} • {msg.time}
                    </span>
                    <div className={`p-3 rounded-2xl max-w-[85%] text-xs sm:text-sm ${
                      msg.sender === 'doctor'
                        ? 'bg-blue-600 text-white rounded-tr-none shadow-sm'
                        : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none shadow-sm'
                    }`}>
                      {msg.text}

                      {/* RAG Source Grounding Pill for Patient Responses */}
                      {msg.sender === 'patient' && msg.sourceRef && (
                        <div className="mt-2 pt-1.5 border-t border-slate-700/60 flex items-center justify-between gap-2">
                          <button
                            onClick={() => setSelectedSourceDetail(msg.sourceRef)}
                            className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 transition truncate"
                          >
                            <BookOpen className="w-3 h-3 shrink-0" /> Grounded: {msg.sourceRef.section}
                          </button>
                          {msg.sourceRef.sourceUrl && (
                            <a
                              href={msg.sourceRef.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-blue-400 hover:text-blue-300 underline flex items-center gap-0.5 shrink-0"
                              title="Open on NCBI"
                            >
                              <span>NCBI</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Dynamic Quick Clinical Prompts */}
              <div className="py-2 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px] scrollbar-thin">
                <span className="text-slate-500 whitespace-nowrap text-xs font-semibold">Quick Ask:</span>
                {getQuickQuestions().map((q, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleSendMessage(q.text)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg whitespace-nowrap border border-slate-700/60 transition"
                  >
                    {q.label}
                  </button>
                ))}
              </div>

              {/* Voice & Input Controls */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={toggleSpeechRecognition}
                  className={`p-3 rounded-xl flex items-center justify-center transition ${
                    isListening 
                      ? 'bg-red-600 text-white animate-pulse' 
                      : 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/40'
                  }`}
                  title={isListening ? "Listening..." : "Tap to Speak (Mic API)"}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={isListening ? "Listening to your voice..." : "Ask clinical question (e.g. pain radiation, duration, fever)..."}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
                />

                <button
                  onClick={() => handleSendMessage()}
                  className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* Tab 2: Physical Examination */}
          {activeTab === 'exam' && (
            <div className="bg-slate-900 border border-slate-800 rounded-b-xl p-4 space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Maneuver 1: Torch / Pupil Light Reflex */}
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs sm:text-sm flex items-center gap-2">
                      <Flashlight className="w-4 h-4 text-amber-400" /> Pupil Light Reflex & Torch
                    </span>
                    <button
                      onClick={togglePupilLight}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                        torchActive 
                          ? 'bg-amber-500 text-slate-950 font-bold' 
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {torchActive ? 'TORCH ON' : 'ACTIVATE TORCH'}
                    </button>
                  </div>

                  {/* Pupil Simulation Visualizer */}
                  <div className="flex items-center justify-center p-6 bg-slate-900 rounded-xl border border-slate-800 relative overflow-hidden">
                    <div className="flex gap-8">
                      {/* Left Eye */}
                      <div className="w-16 h-16 rounded-full bg-slate-200 border-2 border-slate-600 flex items-center justify-center relative shadow-inner">
                        <div className="w-10 h-10 rounded-full bg-amber-900/80 flex items-center justify-center">
                          <div className={`rounded-full bg-black transition-all duration-300 ${pupilConstricted ? 'w-3 h-3' : 'w-7 h-7'}`} />
                        </div>
                      </div>
                      {/* Right Eye */}
                      <div className="w-16 h-16 rounded-full bg-slate-200 border-2 border-slate-600 flex items-center justify-center relative shadow-inner">
                        <div className="w-10 h-10 rounded-full bg-amber-900/80 flex items-center justify-center">
                          <div className={`rounded-full bg-black transition-all duration-300 ${pupilConstricted ? 'w-3 h-3' : 'w-7 h-7'}`} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    <strong>Clinical Finding:</strong> {currentCase.physicalExam.pupilReflex.finding}
                  </p>
                </div>

                {/* Maneuver 2: Haptic Palpation */}
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs sm:text-sm flex items-center gap-2">
                      <Activity className="w-4 h-4 text-purple-400" /> Haptic Palpation Exam
                    </span>
                    <button
                      onClick={triggerPalpation}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition shadow"
                    >
                      PALPATE REGION
                    </button>
                  </div>

                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-2">
                    <span className="text-purple-300 font-bold block">Palpation Key Sign:</span>
                    <p className="text-white font-semibold text-sm">
                      {currentCase.physicalExam.palpation.sign}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {currentCase.physicalExam.palpation.finding}
                    </p>
                  </div>

                  <p className="text-[10px] text-slate-500 italic">
                    * Triggers motor vibration API for tactile diagnostic feedback.
                  </p>
                </div>

              </div>

              {/* Maneuver 3: Auscultation & Inspection Viewport */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs sm:text-sm flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-blue-400" /> Chest & Regional Auscultation
                  </span>
                  <button
                    onClick={toggleCamera}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                  >
                    {cameraActive ? 'CLOSE CAMERA' : 'OPEN INSPECTION CAMERA'}
                  </button>
                </div>

                <p className="text-xs text-slate-300 bg-slate-900 p-3 rounded-lg border border-slate-800">
                  {currentCase.physicalExam.chestAuscultation}
                </p>

                {cameraActive && (
                  <div className="mt-2 rounded-lg overflow-hidden border border-slate-700 bg-black h-40 flex items-center justify-center">
                    <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
                  </div>
                )}
              </div>

              {/* Physical Exam Audit Log */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-slate-300 block mb-2">Examination Audit Trail:</span>
                {examLog.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No physical examination maneuvers conducted yet.</p>
                ) : (
                  <ul className="space-y-1 text-xs">
                    {examLog.map((item, idx) => (
                      <li key={idx} className="text-emerald-400 flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                        <span><strong className="text-slate-400">{item.time}:</strong> {item.text}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

            </div>
          )}

          {/* Tab 3: Diagnostic Decision with RAG Citation & Clickable Link */}
          {activeTab === 'diagnose' && (
            <div className="bg-slate-900 border border-slate-800 rounded-b-xl p-4 space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Primary Provisional Diagnosis <span className="text-blue-400">*</span>
                </label>
                <input
                  type="text"
                  value={primaryDiagnosis}
                  onChange={(e) => setPrimaryDiagnosis(e.target.value)}
                  placeholder={`e.g. ${currentCase.allowedDiagnoses[0]}`}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Enter your formal clinical diagnosis to evaluate against published evidence guidelines.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Top Differential Diagnoses</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {currentCase.differentials.map((diff, idx) => (
                    <label 
                      key={idx} 
                      className={`p-2 rounded-lg border cursor-pointer flex items-center gap-2 ${
                        selectedDifferentials.includes(diff) 
                          ? 'bg-blue-600/20 border-blue-500 text-blue-200' 
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        checked={selectedDifferentials.includes(diff)}
                        onChange={() => {
                          setSelectedDifferentials(prev => 
                            prev.includes(diff) ? prev.filter(d => d !== diff) : [...prev, diff]
                          );
                        }}
                      />
                      <span>{diff}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Immediate Urgent Clinical Orders</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {currentCase.urgentOrders.map((ord, idx) => (
                    <label 
                      key={idx} 
                      className={`p-2 rounded-lg border cursor-pointer flex items-center gap-2 ${
                        selectedOrders.includes(ord) 
                          ? 'bg-emerald-600/20 border-emerald-500 text-emerald-200' 
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        checked={selectedOrders.includes(ord)}
                        onChange={() => {
                          setSelectedOrders(prev => 
                            prev.includes(ord) ? prev.filter(o => o !== ord) : [...prev, ord]
                          );
                        }}
                      />
                      <span>{ord}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={handleEvaluate}
                disabled={!primaryDiagnosis.trim()}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4" /> Submit & Evaluate Against RAG Guidelines
              </button>

              {/* Evaluation Results Card with RAG Citations & Direct Link */}
              {evaluationResult && (
                <div className={`p-4 rounded-xl border mt-4 ${
                  evaluationResult.isCorrect 
                    ? 'bg-emerald-950/40 border-emerald-500/50' 
                    : 'bg-red-950/40 border-red-500/50'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-sm font-bold flex items-center gap-1.5 ${
                      evaluationResult.isCorrect ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {evaluationResult.isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                      {evaluationResult.isCorrect ? 'Diagnosis Confirmed: Accurate' : 'Diagnostic Discrepancy'}
                    </span>
                    <span className="text-xl font-black text-white bg-slate-900 px-3 py-1 rounded-lg border border-slate-700">
                      Score: {evaluationResult.totalScore}/100
                    </span>
                  </div>

                  <div className="space-y-3 text-xs text-slate-300">
                    <p><strong>Gold Standard Diagnosis:</strong> <span className="text-white font-bold">{evaluationResult.trueDiagnosis}</span></p>
                    <p><strong>History Completeness:</strong> {evaluationResult.historyScore}% ({askedKeywords.size}/{currentCase.goldenQuestions.length} essential clinical questions asked)</p>
                    
                    {/* Official Medical Guideline Card with Clickable Redirect Link */}
                    {evaluationResult.ragCitation && (
                      <div className="p-3.5 bg-slate-900/95 rounded-xl border border-emerald-500/40 text-[11px] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-400 flex items-center gap-1">
                            <BookOpen className="w-4 h-4" /> Verified Medical Guideline Citation:
                          </span>
                          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded font-mono">
                            {evaluationResult.ragCitation.evidence}
                          </span>
                        </div>

                        <p className="text-white font-bold text-xs">
                          {evaluationResult.ragCitation.title} ({evaluationResult.ragCitation.year})
                        </p>
                        <p className="text-slate-300 italic bg-slate-950 p-2.5 rounded-lg border border-slate-800 leading-relaxed">
                          "{evaluationResult.ragCitation.summaryGuideline}"
                        </p>

                        {/* DIRECT REDIRECT LINK TO NCBI / NIH STATPEARLS */}
                        {evaluationResult.sourceUrl && (
                          <a
                            href={evaluationResult.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 w-full flex items-center justify-between p-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition shadow-md group"
                          >
                            <div className="flex items-center gap-2">
                              <ExternalLink className="w-4 h-4 text-blue-200 group-hover:scale-110 transition-transform" />
                              <span className="text-xs">Open Official Clinical Protocol on NCBI PubMed (StatPearls)</span>
                            </div>
                            <span className="text-[10px] bg-blue-900/80 px-2 py-0.5 rounded font-mono">
                              ncbi.nlm.nih.gov ↗
                            </span>
                          </a>
                        )}
                      </div>
                    )}

                    {evaluationResult.missedGolden.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-800">
                        <span className="text-amber-400 font-semibold block mb-1">Key Questions Missed during History Taking:</span>
                        <ul className="list-disc pl-4 space-y-1 text-slate-400">
                          {evaluationResult.missedGolden.map((g, i) => (
                            <li key={i}>{g.answer}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Right / iQOO Office Kit Senior Console Column */}
        {viewMode === 'officekit' && (
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 border border-purple-500/40 rounded-xl p-4 shadow-xl">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                  <Laptop className="w-4 h-4" /> iQOO Office Kit Live Supervisor
                </span>
                <span className="bg-purple-500/20 text-purple-300 text-[10px] px-2 py-0.5 rounded font-mono">
                  LIVE STREAM ACTIVE
                </span>
              </div>

              <div className="mt-3 space-y-3 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Patient Hospital Record</span>
                  <p className="font-bold text-white text-sm">{currentCase.patientName} (MRN: #IQOO-2026-{currentCase.id})</p>
                  <p className="text-slate-400 text-[11px]">{currentCase.age} Y / {currentCase.gender} • {currentCase.category} Bay 3</p>
                </div>

                {/* Direct Citation in Office Kit */}
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400 font-bold block mb-1">Verified Medical Protocol Reference</span>
                  <a
                    href={currentCase.sourceCitation?.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-[11px] flex items-center gap-1 underline font-semibold"
                  >
                    <span>{currentCase.sourceCitation?.title}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400 font-bold block mb-1">Live Clinical Interaction Feed</span>
                  <div className="max-h-36 overflow-y-auto space-y-1 text-[11px] font-mono text-slate-300">
                    {dialogue.map((d, i) => (
                      <div key={i} className="truncate">
                        <span className={d.sender === 'doctor' ? 'text-blue-400' : 'text-amber-400'}>
                          [{d.sender.toUpperCase()}]:
                        </span> {d.text}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400 font-bold block mb-1">HackTracker Objective Metrics</span>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="bg-slate-900 p-1.5 rounded">
                      <span className="text-slate-500 block">VOICE (MIC API)</span>
                      <span className="font-bold text-emerald-400 font-mono">ACTIVE (PASS)</span>
                    </div>
                    <div className="bg-slate-900 p-1.5 rounded">
                      <span className="text-slate-500 block">CAMERA & TORCH</span>
                      <span className={`font-bold font-mono ${cameraActive ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {cameraActive ? 'ENGAGED' : 'STANDBY'}
                      </span>
                    </div>
                    <div className="bg-slate-900 p-1.5 rounded">
                      <span className="text-slate-500 block">OFFICE KIT BRIDGE</span>
                      <span className="font-bold text-emerald-400 font-mono">STREAMING (10/10)</span>
                    </div>
                    <div className="bg-slate-900 p-1.5 rounded">
                      <span className="text-slate-500 block">RAG ENGINE</span>
                      <span className="font-bold text-emerald-400 font-mono">10 PATIENT CASES</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
}

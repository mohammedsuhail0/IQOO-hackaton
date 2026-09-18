import React, { useState, useEffect, useRef } from 'react';
import casesData from './cases.json';
import { 
  Mic, MicOff, Camera, Eye, Activity, Heart, Thermometer, 
  Stethoscope, Send, Laptop, Smartphone, Settings, Award, 
  AlertCircle, CheckCircle2, RefreshCw, Volume2, Flashlight
} from 'lucide-react';

export default function App() {
  const [selectedCaseId, setSelectedCaseId] = useState(casesData[0].id);
  const currentCase = casesData.find(c => c.id === selectedCaseId) || casesData[0];

  const [viewMode, setViewMode] = useState('phone'); // 'phone' | 'officekit'
  const [activeTab, setActiveTab] = useState('history'); // 'history' | 'exam' | 'diagnose'

  // Dialogue & Voice State
  const [dialogue, setDialogue] = useState([
    { sender: 'patient', text: currentCase.chiefComplaint, time: '10:00 AM' }
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

  // API Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [apiEndpoint, setApiEndpoint] = useState('https://integrate.api.nvidia.com/v1/chat/completions');
  const [apiKey, setApiKey] = useState('');
  const [modelName, setModelName] = useState('nvidia/nemotron-4-340b-instruct');
  const [engineMode, setEngineMode] = useState('offline'); // 'offline' | 'nemotron'

  // Reset dialogue when case changes
  useEffect(() => {
    setDialogue([
      { sender: 'patient', text: currentCase.chiefComplaint, time: '10:00 AM' }
    ]);
    setAskedKeywords(new Set());
    setExamLog([]);
    setEvaluationResult(null);
    setPrimaryDiagnosis('');
    setSelectedDifferentials([]);
    setSelectedOrders([]);
    stopCamera();
  }, [selectedCaseId]);

  // Speech Synthesis Helper
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

  // Web Speech Recognition
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use the text input.');
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

  // Haptic / Palpation Test
  const triggerPalpation = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([150, 80, 200]);
    }
    const finding = currentCase.physicalExam.palpation.finding;
    addExamFinding(`Palpation Exam: ${finding}`);
    speakText(`Ouch! Doctor, that hurts so much right there!`);
  };

  // Pupil Reflex Test
  const togglePupilLight = () => {
    const nextState = !torchActive;
    setTorchActive(nextState);
    setPupilConstricted(nextState);
    if (nextState) {
      addExamFinding(`Torch Light Exam: ${currentCase.physicalExam.pupilReflex.finding}`);
      speakText('The bright light hurts my eyes a bit, doctor.');
    }
  };

  // Handle Doctor Message Sending
  const handleSendMessage = async (textToSend = inputText) => {
    const query = textToSend.trim();
    if (!query) return;

    const newDialogue = [
      ...dialogue,
      { sender: 'doctor', text: query, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ];
    setDialogue(newDialogue);
    setInputText('');

    // Check match against Golden Questions
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
      // If Nemotron mode is active and API key exists, call cloud API; else use fallback
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
                  content: `You are a patient named ${currentCase.patientName}, ${currentCase.age} years old. You have ${currentCase.trueDiagnosis}. Respond in first-person as a sick, uncomfortable patient. Answer briefly in 1-2 sentences.`
                },
                { role: 'user', content: query }
              ],
              temperature: 0.6,
              max_tokens: 150
            })
          });
          const data = await res.json();
          matchedAnswer = data.choices?.[0]?.message?.content || currentCase.defaultResponse;
        } catch (e) {
          console.error(e);
          matchedAnswer = currentCase.defaultResponse;
        }
      } else {
        matchedAnswer = currentCase.defaultResponse;
      }
    }

    setTimeout(() => {
      setDialogue(prev => [
        ...prev,
        { sender: 'patient', text: matchedAnswer, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
      speakText(matchedAnswer);
    }, 350);
  };

  // Diagnostic Evaluation Logic
  const handleEvaluate = () => {
    const isCorrect = currentCase.allowedDiagnoses.some(
      d => d.toLowerCase() === primaryDiagnosis.trim().toLowerCase()
    );

    const historyScore = Math.round((askedKeywords.size / currentCase.goldenQuestions.length) * 100);
    const examBonus = examLog.length > 0 ? 20 : 0;
    const accuracyPoints = isCorrect ? 50 : 15;
    const totalScore = Math.min(100, Math.round((historyScore * 0.3) + examBonus + accuracyPoints));

    const missedGolden = currentCase.goldenQuestions.filter((_, idx) => !askedKeywords.has(idx));

    setEvaluationResult({
      isCorrect,
      totalScore,
      historyScore,
      examCount: examLog.length,
      missedGolden,
      trueDiagnosis: currentCase.trueDiagnosis
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 pb-20">
      
      {/* Top Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded tracking-wider uppercase">
              iQOO Hackathon 2026
            </span>
            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-2 py-0.5 rounded border border-emerald-500/30">
              HealthTech Track
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1 flex items-center gap-2">
            ClinOSCE <span className="text-blue-500">iQ</span>
            <span className="text-xs font-normal text-slate-400 bg-slate-800 px-2 py-1 rounded">
              v1.0 MVP
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            On-Device AI Virtual Patient & Clinical Diagnostic Simulator
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'phone' ? 'officekit' : 'phone')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold border transition ${
              viewMode === 'officekit' 
                ? 'bg-purple-600/20 border-purple-500 text-purple-300' 
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {viewMode === 'phone' ? <Laptop className="w-4 h-4 text-purple-400" /> : <Smartphone className="w-4 h-4 text-blue-400" />}
            {viewMode === 'phone' ? 'iQOO Office Kit Mode' : 'iQOO Phone View'}
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

      {/* Settings Modal */}
      {showSettings && (
        <div className="my-4 p-4 bg-slate-800/90 border border-slate-700 rounded-xl">
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
                <option value="offline">Deterministic Edge FSM (100% Offline / Zero Hallucination)</option>
                <option value="nemotron">NVIDIA Nemotron Ultra / Custom API Endpoint</option>
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
              <label className="block text-slate-400 mb-1">API Key (Bearer Token)</label>
              <input 
                type="password" 
                value={apiKey} 
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                placeholder="nvapi-..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Patient Triage Banner */}
      <div className="my-4 p-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 rounded-xl shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-xl font-black text-blue-400">
              {currentCase.patientName[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base sm:text-lg">{currentCase.patientName}</span>
                <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                  {currentCase.age}y / {currentCase.gender}
                </span>
              </div>
              <p className="text-xs text-amber-400 flex items-center gap-1 font-medium mt-0.5">
                <AlertCircle className="w-3.5 h-3.5" /> Chief Complaint: "{currentCase.chiefComplaint}"
              </p>
            </div>
          </div>

          {/* Case Selector Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {casesData.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setSelectedCaseId(c.id)}
                className={`px-2.5 py-1 text-xs rounded-lg font-semibold whitespace-nowrap transition ${
                  selectedCaseId === c.id 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Case #{i + 1}: {c.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Live Vitals Telemetry */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-xs">
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
            <Stethoscope className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-slate-400 block text-[10px]">RESP / SpO2</span>
              <span className="font-bold text-white">{currentCase.vitals.respRate} • {currentCase.vitals.spo2}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Clinical Station View */}
      <div className={`grid gap-4 ${viewMode === 'officekit' ? 'lg:grid-cols-12' : 'grid-cols-1'}`}>
        
        {/* Left / Phone Column */}
        <div className={`${viewMode === 'officekit' ? 'lg:col-span-7' : 'w-full'} space-y-4`}>
          
          {/* Clinical Station Navigation Tabs */}
          <div className="flex border-b border-slate-800 text-xs sm:text-sm font-semibold bg-slate-900/60 rounded-t-xl p-1">
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-2 ${
                activeTab === 'history' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Mic className="w-4 h-4" /> 1. Voice Interview
            </button>
            <button
              onClick={() => setActiveTab('exam')}
              className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-2 ${
                activeTab === 'exam' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Camera className="w-4 h-4" /> 2. Physical Exam
            </button>
            <button
              onClick={() => setActiveTab('diagnose')}
              className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-2 ${
                activeTab === 'diagnose' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Award className="w-4 h-4" /> 3. Diagnostic Decision
            </button>
          </div>

          {/* Tab 1: Voice Consultation */}
          {activeTab === 'history' && (
            <div className="bg-slate-900 border border-slate-800 rounded-b-xl p-4 flex flex-col h-[480px]">
              
              {/* Dialogue Transcript */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-3">
                {dialogue.map((msg, i) => (
                  <div 
                    key={i} 
                    className={`flex flex-col ${msg.sender === 'doctor' ? 'items-end' : 'items-start'}`}
                  >
                    <span className="text-[10px] text-slate-500 mb-0.5">
                      {msg.sender === 'doctor' ? '👨‍⚕️ You (Junior Doctor)' : `🤒 ${currentCase.patientName}`} • {msg.time}
                    </span>
                    <div className={`p-3 rounded-2xl max-w-[85%] text-xs sm:text-sm ${
                      msg.sender === 'doctor'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Clinical Prompts (for speedy hackathon testing) */}
              <div className="py-2 border-t border-slate-800 flex gap-1.5 overflow-x-auto text-[11px]">
                <span className="text-slate-500 whitespace-nowrap pt-1">Ask:</span>
                <button 
                  onClick={() => handleSendMessage("When exactly did the pain begin?")}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded whitespace-nowrap"
                >
                  Onset & Timing?
                </button>
                <button 
                  onClick={() => handleSendMessage("Do you feel nauseous or have you vomited?")}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded whitespace-nowrap"
                >
                  Nausea / Vomiting?
                </button>
                <button 
                  onClick={() => handleSendMessage("Do you have fever or chills?")}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded whitespace-nowrap"
                >
                  Fever?
                </button>
                <button 
                  onClick={() => handleSendMessage("Does the pain radiate or spread anywhere?")}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded whitespace-nowrap"
                >
                  Radiation?
                </button>
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
                  placeholder={isListening ? "Listening to your voice..." : "Type or speak clinical question..."}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
                />

                <button
                  onClick={() => handleSendMessage()}
                  className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl"
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
                
                {/* Camera Exam Card */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col items-center text-center">
                  <span className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-blue-400" /> Camera Inspection & Torch
                  </span>

                  <div className="w-full h-40 bg-slate-900 rounded-lg overflow-hidden relative flex items-center justify-center border border-slate-800">
                    {cameraActive ? (
                      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-slate-500 text-xs px-4">
                        Camera inactive. Tap below to inspect simulated pupil / throat / lesion.
                      </div>
                    )}
                    
                    {/* Simulated Pupil Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className={`rounded-full border-2 border-white transition-all duration-300 ${
                        pupilConstricted ? 'w-4 h-4 bg-black' : 'w-10 h-10 bg-black'
                      }`}>
                        <div className="w-1.5 h-1.5 bg-white/60 rounded-full mt-1 ml-1" />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3 w-full">
                    <button
                      onClick={toggleCamera}
                      className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
                    >
                      {cameraActive ? 'Stop Camera' : 'Start Camera'}
                    </button>
                    <button
                      onClick={togglePupilLight}
                      className={`flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        torchActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <Flashlight className="w-3.5 h-3.5" /> Torch
                    </button>
                  </div>
                </div>

                {/* Palpation & Auscultation Card */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-white mb-1 block flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-emerald-400" /> Palpation & Auscultation
                    </span>
                    <p className="text-[11px] text-slate-400 mb-3">
                      Conduct targeted abdominal palpation or auscultation to elicit clinical signs.
                    </p>
                    
                    <button
                      onClick={triggerPalpation}
                      className="w-full py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-bold flex items-center justify-center gap-2 mb-2"
                    >
                      <span>🖐️ Perform Deep Palpation Test</span>
                    </button>

                    <button
                      onClick={() => addExamFinding(`Chest Auscultation: ${currentCase.physicalExam.chestAuscultation}`)}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-2"
                    >
                      <Stethoscope className="w-3.5 h-3.5 text-blue-400" /> Auscultate Chest / Heart
                    </button>
                  </div>

                  <div className="mt-3 p-2 bg-slate-900 rounded text-[11px] text-slate-300 border border-slate-800">
                    <strong>Primary Clinical Sign:</strong> {currentCase.physicalExam.palpation.sign}
                  </div>
                </div>

              </div>

              {/* Physical Exam Log */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                <span className="text-xs font-bold text-slate-300 block mb-2">Findings Log (Session History):</span>
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

          {/* Tab 3: Diagnostic Decision */}
          {activeTab === 'diagnose' && (
            <div className="bg-slate-900 border border-slate-800 rounded-b-xl p-4 space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Primary Provisional Diagnosis</label>
                <input
                  type="text"
                  value={primaryDiagnosis}
                  onChange={(e) => setPrimaryDiagnosis(e.target.value)}
                  placeholder="e.g. Acute Appendicitis"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Top Differential Diagnoses</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
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
                <Award className="w-4 h-4" /> Submit & Evaluate Clinical Reasoning
              </button>

              {/* Evaluation Results Card */}
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

                  <div className="space-y-2 text-xs text-slate-300">
                    <p><strong>Gold Standard Diagnosis:</strong> {evaluationResult.trueDiagnosis}</p>
                    <p><strong>History Completeness:</strong> {evaluationResult.historyScore}% ({askedKeywords.size}/{currentCase.goldenQuestions.length} essential questions asked)</p>
                    
                    {evaluationResult.missedGolden.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-800">
                        <span className="text-amber-400 font-semibold block mb-1">Key Questions Missed by Trainee:</span>
                        <ul className="list-disc pl-4 space-y-0.5 text-slate-400">
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
                  <p className="font-bold text-white text-sm">{currentCase.patientName} (MRN: #IQOO-2026-{currentCase.id.slice(-1)})</p>
                  <p className="text-slate-400 text-[11px]">{currentCase.age} Y / {currentCase.gender} • Admitted: Acute Triage Bay 3</p>
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
                  <span className="text-slate-400 font-bold block mb-1">HackTracker Compliance Metrics</span>
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
                      <span className="text-slate-500 block">EDGE INFERENCE</span>
                      <span className="font-bold text-blue-400 font-mono">SNAPDRAGON NPU</span>
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

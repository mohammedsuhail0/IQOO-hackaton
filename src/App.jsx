import React, { useState, useEffect, useRef } from 'react';
import casesData from './cases.json';
import { 
  Send, RotateCcw, ChevronDown, HeartPulse, 
  Wifi, Battery, Signal, Sparkles, CheckCheck
} from 'lucide-react';

export default function App() {
  const [selectedCaseId, setSelectedCaseId] = useState(casesData[0].id);
  const [showCaseSelector, setShowCaseSelector] = useState(false);
  const currentCase = casesData.find(c => c.id === selectedCaseId) || casesData[0];

  // Dialogue state
  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      sender: 'patient',
      text: currentCase.chiefComplaint,
      time: '10:00 AM'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Reset dialogue when case changes
  useEffect(() => {
    setMessages([
      {
        id: `case-init-${currentCase.id}`,
        sender: 'patient',
        text: currentCase.chiefComplaint,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setInputText('');
    setIsTyping(false);
    setShowCaseSelector(false);
  }, [selectedCaseId]);

  // Restart current case
  const handleRestart = () => {
    setMessages([
      {
        id: `restart-${Date.now()}`,
        sender: 'patient',
        text: currentCase.chiefComplaint,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setInputText('');
    setIsTyping(false);
  };

  // Local Patient Response Generator (Instant, Reliable, No Hallucinations)
  const generatePatientReply = (query, currentCase) => {
    const q = query.toLowerCase().trim();

    // Check golden questions from cases.json first
    for (const gq of currentCase.goldenQuestions) {
      if (gq.keywords.some(k => q.includes(k))) {
        return gq.answer;
      }
    }

    // Direct diagnosis or urgent panic reaction
    if (q.includes('heart attack') || q.includes('infarct') || q.includes('cardiac') || q.includes('dying') || q.includes('die')) {
      return `A heart attack?! Oh god, doctor, please save me! The pressure in my chest is agonizing... what can you do?!`;
    }

    // Name & Identity
    if (q.includes('name') || q.includes('who are you') || q.includes('who r u') || q.includes('what is your name')) {
      return `My name is ${currentCase.patientName}, doctor. Thank you for seeing me so urgently.`;
    }

    // Age
    if (q.includes('age') || q.includes('how old') || q.includes('years old')) {
      return `I am ${currentCase.age} years old, doctor.`;
    }

    // Occupation
    if (q.includes('job') || q.includes('work') || q.includes('occupation') || q.includes('profession')) {
      return `I work as a ${currentCase.occupation}. The work has been very stressful recently.`;
    }

    // Greetings
    if (q === 'hi' || q === 'hello' || q.startsWith('hi ') || q.startsWith('hello ') || q.includes('good morning') || q.includes('good evening')) {
      return `Hello doctor... (grimacing in discomfort) Please help me, I am feeling terrible right now.`;
    }

    // Pain Scale (1-10)
    if (q.includes('scale') || q.includes('1 to 10') || q.includes('1-10') || q.includes('how bad') || q.includes('rate your pain') || q.includes('severity')) {
      if (currentCase.category === 'Cardiology') {
        return `It's easily a 9 or 10 out of 10, doctor! It feels like a massive boulder crushing down on my chest.`;
      } else {
        return `Easily an 8 or 9 out of 10! Swallowing or moving my head brings sharp, unbearable agony.`;
      }
    }

    // Location & Radiation
    if (q.includes('where') || q.includes('point') || q.includes('location') || q.includes('radiat') || q.includes('spread') || q.includes('arm') || q.includes('jaw') || q.includes('neck')) {
      if (currentCase.id === 'cardio-1') return `The pressure is centered right behind my breastbone, and it spreads heavily into my left shoulder, left arm, and jaw.`;
      if (currentCase.id === 'cardio-2') return `My whole chest feels congested and suffocated, and both of my legs and ankles are swollen up to the knees.`;
      if (currentCase.id === 'cardio-3') return `It's sharp pain right behind the center of my breastbone that shoots into my left shoulder ridge.`;
      if (currentCase.id === 'cardio-4') return `Right in the middle of my chest and up into my throat — my heart feels like it's racing at 200 beats a minute.`;
      if (currentCase.id === 'cardio-5') return `Generalized body aches, high fevers, and tender spots on my fingers and toes.`;
      if (currentCase.id === 'ent-1') return `Intense pain on the right side of my throat that shoots right up into my right ear whenever I swallow.`;
      if (currentCase.id === 'ent-2') return `It's not pain, doctor — it's severe vertigo. The whole room spins violently whenever I turn my head to the right.`;
      if (currentCase.id === 'ent-3') return `Right behind my left ear! The mastoid bone is throbbing, hot, and pushed my ear forward.`;
      if (currentCase.id === 'ent-4') return `Deep in my throat near my windpipe. It feels like a hot coal stuck there and I can't swallow my spit.`;
      if (currentCase.id === 'ent-5') return `In my right ear. It feels totally blocked and deaf, with a high-pitched buzzing ringing.`;
    }

    // Timing & Onset
    if (q.includes('when') || q.includes('how long') || q.includes('start') || q.includes('begin') || q.includes('hours') || q.includes('minutes') || q.includes('sudden')) {
      if (currentCase.id === 'cardio-1') return `It struck suddenly about 45 minutes ago while climbing the office staircase.`;
      if (currentCase.id === 'cardio-2') return `It has been worsening progressively over the last 4 days.`;
      if (currentCase.id === 'cardio-3') return `The sharp chest pain started 2 days ago, about a week after I recovered from a viral flu.`;
      if (currentCase.id === 'cardio-4') return `It started abruptly 30 minutes ago out of nowhere.`;
      if (currentCase.id === 'ent-1') return `I had a mild sore throat for 3 days, but this morning it became impossible to open my mouth or swallow.`;
      if (currentCase.id === 'ent-2') return `Over the past 3 days, especially when I roll over in bed or look up.`;
      return `It started earlier today and has been getting steadily worse.`;
    }

    // Aggravating / Relieving Factors
    if (q.includes('better') || q.includes('worse') || q.includes('reliev') || q.includes('position') || q.includes('lying') || q.includes('flat') || q.includes('rest')) {
      if (currentCase.id === 'cardio-3') return `Sitting upright and leaning forward helps relieve the pain significantly, but lying flat on my back makes it agonizing!`;
      if (currentCase.id === 'cardio-2') return `Lying flat makes me feel like I am drowning immediately! I have to sleep propped on 3 pillows.`;
      if (currentCase.id === 'ent-2') return `Keeping my head completely still calms the spinning, but moving my head triggers violent dizziness.`;
      return `Resting hasn't helped at all, doctor. Nothing seems to relieve it.`;
    }

    // Breathing / Shortness of breath
    if (q.includes('breath') || q.includes('shortness') || q.includes('suffocat') || q.includes('dyspnea') || q.includes('air') || q.includes('lungs')) {
      if (currentCase.id === 'cardio-2') return `I am desperately gasping for air. I wake up in the middle of the night feeling like I am suffocating.`;
      if (currentCase.id === 'ent-4') return `My windpipe feels swollen shut, every breath produces a whistling, raspy noise.`;
      return `Yes doctor, I feel very short of breath and tight in my chest.`;
    }

    // Sweating / Clammy
    if (q.includes('sweat') || q.includes('cold') || q.includes('clammy') || q.includes('perspir')) {
      if (currentCase.id === 'cardio-1') return `Yes! I broke out into a drenching cold sweat as soon as the chest pain started.`;
      return `Yes, I feel cold, clammy, and really unsettled.`;
    }

    // Past Medical History & Comorbidities
    if (q.includes('history') || q.includes('past') || q.includes('diabetes') || q.includes('sugar') || q.includes('hypertension') || q.includes('bp') || q.includes('pressure')) {
      if (currentCase.id === 'cardio-1') return `I have had type 2 diabetes and high blood pressure for 9 years.`;
      if (currentCase.id === 'cardio-2') return `I was diagnosed with congestive heart failure and hypertension 3 years ago.`;
      return `I haven't had major medical conditions in the past, I was mostly healthy until now.`;
    }

    // Smoking / Habits
    if (q.includes('smoke') || q.includes('cigarette') || q.includes('tobacco') || q.includes('alcohol') || q.includes('drink')) {
      if (currentCase.id === 'cardio-1') return `I smoke about a pack of cigarettes a day and have smoked for 25 years. I rarely drink alcohol.`;
      if (currentCase.id === 'cardio-4') return `I don't smoke or drink, but I drank 3 cups of strong espresso coffee this morning to finish a deadline.`;
      return `I don't smoke and drink very occasionally.`;
    }

    // Medications
    if (q.includes('medicin') || q.includes('pill') || q.includes('drug') || q.includes('prescription')) {
      if (currentCase.id === 'cardio-1') return `I take Metformin for diabetes and Amlodipine for blood pressure.`;
      if (currentCase.id === 'cardio-2') return `I was prescribed Furosemide water pills and Enalapril, but ran out of refills 3 days ago.`;
      return `I don't take any regular medications, doctor.`;
    }

    // Default conversational fallback
    const fallbacks = [
      `Doctor, I feel so much distress right now... please tell me what you think is wrong with me.`,
      `I'm trying to answer as clearly as I can, doctor, but this discomfort is really overwhelming.`,
      `Please help me doctor, I'm really frightened by what's happening to my body.`
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  };

  // Handle sending a message
  const handleSend = (textToSend = inputText) => {
    const text = textToSend.trim();
    if (!text || isTyping) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'doctor',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate realistic mobile response delay (600ms)
    setTimeout(() => {
      const replyText = generatePatientReply(text, currentCase);
      const patientMessage = {
        id: `patient-${Date.now()}`,
        sender: 'patient',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, patientMessage]);
      setIsTyping(false);
    }, 600);
  };

  // Quick Clinical Suggestion Chips tailored to current case
  const quickQuestions = currentCase.category === 'Cardiology' ? [
    { label: "📍 Where does it hurt?", text: "Where exactly does it hurt, and does the pain radiate anywhere?" },
    { label: "📊 Rate pain 1-10", text: "On a scale of 1 to 10, how severe is the pain?" },
    { label: "⏱️ When did it start?", text: "When did this start, and what were you doing?" },
    { label: "💧 Cold sweating?", text: "Are you having cold sweats or feeling clammy?" },
    { label: "🫁 Shortness of breath?", text: "Are you feeling breathless or suffocated?" },
    { label: "🛌 Lying flat vs sitting?", text: "Does lying flat make your symptoms worse?" },
    { label: "🚬 Smoking & BP history?", text: "Do you have a history of smoking, diabetes, or high blood pressure?" }
  ] : [
    { label: "📍 Where is the pain?", text: "Where is the pain located and does it spread to your ear?" },
    { label: "📊 Rate pain 1-10", text: "On a scale of 1 to 10, how severe is the discomfort?" },
    { label: "💧 Can you swallow?", text: "Can you swallow your saliva or liquids?" },
    { label: "⏱️ How long has this lasted?", text: "How long have you had these symptoms?" },
    { label: "🌀 Does the room spin?", text: "Does the room spin when you turn your head?" },
    { label: "👂 Any hearing loss or ringing?", text: "Are you having any hearing loss, ear fullness, or ringing?" }
  ];

  return (
    <div className="fixed inset-0 w-full h-full bg-[#070b14] text-slate-100 flex items-center justify-center p-0 sm:p-2 overflow-hidden select-none">
      {/* Android Device Shell Frame (Edge-to-edge on mobile, sleek frame on desktop) */}
      <div className="w-full sm:max-w-[410px] h-full sm:h-[min(760px,calc(100dvh-1rem))] bg-[#0c1220] sm:border-[6px] sm:border-slate-800 sm:rounded-[36px] sm:shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* Android Native Status Bar */}
        <div className="h-6 bg-[#0c1220] px-4 flex items-center justify-between text-[11px] text-slate-400 font-medium select-none z-20 shrink-0">
          <span>10:00</span>
          {/* Top Notch / Camera Punch-hole on desktop preview */}
          <div className="hidden sm:block w-3 h-3 bg-black rounded-full border border-slate-700/50 mx-auto"></div>
          <div className="flex items-center gap-1.5">
            <Signal className="w-3 h-3 text-slate-400" />
            <Wifi className="w-3 h-3 text-slate-400" />
            <Battery className="w-3.5 h-3.5 text-slate-300" />
          </div>
        </div>

        {/* Android Top App Bar */}
        <div className="bg-[#0f172a] border-b border-slate-800/80 px-3 py-2 flex items-center justify-between gap-2 z-10 shadow-md shrink-0">
          {/* Patient Profile Info */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm shadow-inner">
                {currentCase.patientName.charAt(0)}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0f172a] rounded-full"></span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h1 className="font-semibold text-slate-100 text-xs truncate">
                  {currentCase.patientName}
                </h1>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium whitespace-nowrap">
                  {currentCase.age}y • {currentCase.gender.charAt(0)}
                </span>
              </div>
              <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Active Patient • {currentCase.category}
              </p>
            </div>
          </div>

          {/* Action Buttons: Case Dropdown & Reset */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowCaseSelector(!showCaseSelector)}
              title="Switch Patient Case"
              className="px-2.5 py-1 rounded-full hover:bg-slate-800 text-slate-300 transition flex items-center gap-1 text-xs border border-slate-700/60"
            >
              <span>Cases</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${showCaseSelector ? 'rotate-180' : ''}`} />
            </button>

            <button
              onClick={handleRestart}
              title="Restart Patient Consultation"
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Case Switcher Dropdown Modal / Drawer */}
        {showCaseSelector && (
          <div className="absolute top-[80px] left-0 right-0 bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-700/80 p-3 z-30 shadow-2xl max-h-[340px] overflow-y-auto">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2 flex items-center justify-between">
              <span>Select Patient Case (10 Total)</span>
              <span className="text-blue-400">{casesData.length} Cases</span>
            </div>
            <div className="space-y-1.5">
              {casesData.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCaseId(c.id)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition flex items-center justify-between gap-2 ${
                    c.id === selectedCaseId 
                      ? 'bg-blue-600 text-white font-medium shadow' 
                      : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/40'
                  }`}
                >
                  <div className="truncate">
                    <div className="font-semibold truncate">{c.patientName} ({c.age}y, {c.gender})</div>
                    <div className={`text-[11px] truncate ${c.id === selectedCaseId ? 'text-blue-100' : 'text-slate-400'}`}>
                      {c.title}
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${
                    c.id === selectedCaseId ? 'bg-blue-700 text-white' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {c.category}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Patient Vitals Quick Bar */}
        <div className="bg-[#0b101c] border-b border-slate-800/60 px-3.5 py-1 flex items-center justify-between text-[10.5px] text-slate-400 overflow-x-auto whitespace-nowrap gap-2.5 scrollbar-none shrink-0">
          <span className="flex items-center gap-1 font-medium text-slate-300">
            <HeartPulse className="w-3 h-3 text-rose-500" />
            HR: <strong className="text-slate-200">{currentCase.vitals.heartRate}</strong>
          </span>
          <span>BP: <strong className="text-slate-200">{currentCase.vitals.bp}</strong></span>
          <span>SpO2: <strong className="text-slate-200">{currentCase.vitals.spo2}</strong></span>
          <span>Temp: <strong className="text-slate-200">{currentCase.vitals.temp}</strong></span>
        </div>

        {/* Message Stream with min-h-0 to avoid pushing bottom bar */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2.5 scrollbar-thin">
          {/* Medical Privacy & Simulation Banner */}
          <div className="text-center my-1">
            <span className="text-[10px] bg-slate-800/80 text-slate-400 border border-slate-700/50 px-2.5 py-0.5 rounded-full inline-block">
              Clinical OSCE Simulation Session
            </span>
          </div>

          {messages.map((m) => {
            const isDoctor = m.sender === 'doctor';
            return (
              <div 
                key={m.id} 
                className={`flex flex-col ${isDoctor ? 'items-end' : 'items-start'}`}
              >
                <div 
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed shadow-sm transition-all ${
                    isDoctor 
                      ? 'bg-blue-600 text-white rounded-br-xs' 
                      : 'bg-slate-800/90 text-slate-100 border border-slate-700/60 rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  
                  <div className={`flex items-center justify-end gap-1 mt-0.5 text-[9px] ${
                    isDoctor ? 'text-blue-200' : 'text-slate-400'
                  }`}>
                    <span>{m.time}</span>
                    {isDoctor && <CheckCheck className="w-3 h-3 text-blue-200" />}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Animated Patient Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2">
              <div className="bg-slate-800/90 border border-slate-700/60 rounded-2xl rounded-bl-xs px-3 py-2 flex items-center gap-1.5 shadow-sm">
                <span className="text-[11px] text-slate-400 mr-1 font-medium">{currentCase.patientName} is typing</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Suggestion Chips */}
        <div className="bg-[#0b101c] border-t border-slate-800/70 py-1.5 px-2.5 shrink-0">
          <div className="flex items-center gap-1 mb-1 text-[9px] text-slate-400 font-medium px-1">
            <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
            <span>Suggested Questions</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q.text)}
                disabled={isTyping}
                className="shrink-0 text-[11px] bg-slate-800/90 hover:bg-slate-700 active:bg-blue-600 text-slate-300 hover:text-white border border-slate-700/60 rounded-full px-2.5 py-1 transition whitespace-nowrap shadow-xs disabled:opacity-50"
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        {/* Android Bottom Input Bar */}
        <div className="bg-[#0f172a] border-t border-slate-800 px-3 py-2 z-10 shrink-0">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <div className="flex-1 relative flex items-center">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask patient a question..."
                disabled={isTyping}
                className="w-full bg-[#1e293b] text-slate-100 placeholder-slate-400 text-xs rounded-full pl-3.5 pr-3 py-2 border border-slate-700/70 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-inner disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-500 active:scale-95 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-white transition shadow-md shrink-0"
              title="Send question"
            >
              <Send className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

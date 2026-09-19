import React from 'react';
import { X, Printer, Download, FileText, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function HospitalReportModal({ report, onClose }) {
  if (!report) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white text-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col my-auto border border-slate-300 max-h-[95vh]">
        
        {/* Modal Action Bar (Hidden in Print) */}
        <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-white tracking-wide">Official Hospital Diagnostic Report</h2>
              <p className="text-[10px] text-slate-400">{report.id} • Accredited Clinical Record</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow transition active:scale-95"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Save as PDF / Print</span>
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Hospital Document Body */}
        <div id="hospital-printable-report" className="p-6 overflow-y-auto space-y-5 text-xs bg-[#ffffff] font-sans">
          
          {/* Official Letterhead Header */}
          <div className="border-b-2 border-slate-900 pb-3 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-slate-900 text-white font-black text-sm flex items-center justify-center">
                  M+
                </div>
                <div>
                  <h1 className="text-sm font-extrabold tracking-tight text-slate-900 uppercase">
                    Metropolitan Academic Medical Center
                  </h1>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    {report.department}
                  </p>
                </div>
              </div>
              <p className="text-[9px] text-slate-500 mt-1">
                450 Healthcare Boulevard • Level 1 Trauma Center • CLIA / CAP / JCAHO Accredited
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-mono font-bold border border-slate-300">
                {report.id}
              </span>
              <p className="text-[9px] text-slate-400 mt-0.5">STAT EMERGENCY SERVICE</p>
            </div>
          </div>

          {/* Patient Demographics & Requisition Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px]">
            <div>
              <span className="text-[9.5px] uppercase font-bold text-slate-500 block">Patient Name</span>
              <span className="font-bold text-slate-900">{report.patientName}</span>
            </div>
            <div>
              <span className="text-[9.5px] uppercase font-bold text-slate-500 block">Demographics</span>
              <span className="font-medium text-slate-800">{report.age} yrs • {report.gender}</span>
            </div>
            <div>
              <span className="text-[9.5px] uppercase font-bold text-slate-500 block">Medical Record (MRN)</span>
              <span className="font-mono font-bold text-slate-800">{report.mrn}</span>
            </div>
            <div>
              <span className="text-[9.5px] uppercase font-bold text-slate-500 block">Date & Time</span>
              <span className="font-medium text-slate-800">{report.date} • {report.time}</span>
            </div>
          </div>

          {/* Report Title */}
          <div className="border-l-4 border-blue-600 pl-2.5 py-0.5">
            <h2 className="text-xs font-black uppercase text-slate-900 tracking-wide">
              {report.reportTitle}
            </h2>
            {report.indication && (
              <p className="text-[10.5px] text-slate-600 mt-0.5">
                <span className="font-semibold text-slate-700">Clinical Indication:</span> {report.indication}
              </p>
            )}
          </div>

          {/* 1. X-RAY RADIOLOGY REPORT & VISUAL RADIOGRAPH */}
          {report.type === 'xray' && (
            <div className="space-y-4">
              {/* Visual Radiograph Viewport (Inverted Medical Film Representation) */}
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-black p-3 shadow-inner text-white flex flex-col items-center">
                <div className="w-full flex items-center justify-between text-[10px] font-mono text-slate-400 pb-1.5 border-b border-slate-800 mb-2">
                  <span className="truncate max-w-[280px]">METRO PACS VIEWPORT • {report.reportTitle}</span>
                  <span className="shrink-0">{report.technique ? report.technique.slice(0, 30) : "STANDARD ACQUISITION"}</span>
                </div>

                {/* SVG Visual Radiograph & Imaging Viewport */}
                <div className="w-full max-w-[440px] aspect-[4/3] bg-gradient-to-b from-[#0a0e14] via-[#05070a] to-[#020305] rounded-lg relative flex items-center justify-center p-2 border border-slate-800/80">
                  <svg viewBox="0 0 400 300" className="w-full h-full">
                    {/* CT TEMPORAL BONE / MASTOIDITIS */}
                    {report.svgType === 'ct-mastoid' ? (
                      <g>
                        {/* Axial Skull Base Bone Ring */}
                        <ellipse cx="200" cy="150" rx="140" ry="110" fill="#090d16" stroke="#cbd5e1" strokeWidth="6" opacity="0.8" />
                        {/* Petrous Ridges */}
                        <path d="M 90 150 L 160 170 L 190 185" stroke="#e2e8f0" strokeWidth="8" fill="none" opacity="0.9" />
                        <path d="M 310 150 L 240 170 L 210 185" stroke="#e2e8f0" strokeWidth="8" fill="none" opacity="0.9" />
                        {/* Normal Right Mastoid Air Cells (Clear black honeycomb) */}
                        <g opacity="0.7">
                          <circle cx="95" cy="170" r="8" fill="#020617" stroke="#94a3b8" strokeWidth="1.5" />
                          <circle cx="110" cy="175" r="7" fill="#020617" stroke="#94a3b8" strokeWidth="1.5" />
                          <circle cx="100" cy="188" r="9" fill="#020617" stroke="#94a3b8" strokeWidth="1.5" />
                        </g>
                        {/* Opacified Left Mastoid (Dense white fluid fill + cortical breakdown) */}
                        <g>
                          <ellipse cx="295" cy="180" rx="22" ry="18" fill="#cbd5e1" opacity="0.85" />
                          <path d="M 305 168 Q 320 180 308 198" stroke="#ef4444" strokeWidth="3" fill="none" strokeDasharray="3 2" />
                          <circle cx="310" cy="182" r="16" stroke="#ef4444" strokeWidth="2" fill="none" strokeDasharray="3 3" />
                          <text x="210" y="225" fill="#ef4444" fontSize="10" fontWeight="bold" fontFamily="monospace">Cortical Erosion & Fluid Fill</text>
                        </g>
                        {/* Orientation Marker */}
                        <text x="25" y="35" fill="#f8fafc" fontSize="16" fontWeight="bold">R</text>
                        <text x="360" y="35" fill="#f8fafc" fontSize="16" fontWeight="bold">L</text>
                        <text x="175" y="280" fill="#64748b" fontSize="10" fontFamily="monospace">AXIAL BONE</text>
                      </g>
                    ) : report.svgType === 'ct-neck' ? (
                      /* CT NECK / PERITONSILLAR ABSCESS */
                      <g>
                        {/* Neck Cross Section Outline */}
                        <ellipse cx="200" cy="150" rx="130" ry="110" fill="#0b1120" stroke="#475569" strokeWidth="4" />
                        {/* Cervical Vertebra */}
                        <circle cx="200" cy="210" r="22" fill="#334155" stroke="#94a3b8" strokeWidth="3" />
                        {/* Trachea / Airway column */}
                        <circle cx="200" cy="115" r="14" fill="#020617" stroke="#1e293b" strokeWidth="2" />
                        {/* Right Peritonsillar Rim-Enhancing Collection */}
                        <g>
                          <ellipse cx="165" cy="120" rx="24" ry="18" fill="#1e293b" stroke="#f59e0b" strokeWidth="3" />
                          <circle cx="165" cy="120" r="14" fill="#334155" opacity="0.9" />
                          <path d="M 185 115 Q 195 118 205 115" stroke="#ef4444" strokeWidth="2" fill="none" />
                          <text x="80" y="75" fill="#f59e0b" fontSize="10" fontWeight="bold" fontFamily="monospace">Rim-Enhancing Quinsy (3.2cm)</text>
                        </g>
                        <text x="25" y="35" fill="#f8fafc" fontSize="16" fontWeight="bold">R</text>
                        <text x="360" y="35" fill="#f8fafc" fontSize="16" fontWeight="bold">L</text>
                        <text x="175" y="280" fill="#64748b" fontSize="10" fontFamily="monospace">AXIAL CONTRAST</text>
                      </g>
                    ) : report.svgType === 'mri-iac' ? (
                      /* MRI BRAIN / IAC PROTOCOL */
                      <g>
                        {/* Posterior Fossa Brain Parenchyma */}
                        <ellipse cx="200" cy="150" rx="125" ry="110" fill="#1e293b" stroke="#475569" strokeWidth="3" />
                        {/* Cerebellar Folia */}
                        <ellipse cx="200" cy="180" rx="80" ry="50" fill="#0f172a" opacity="0.8" />
                        {/* 4th Ventricle */}
                        <polygon points="190,165 210,165 200,180" fill="#020617" />
                        {/* Bilateral Internal Auditory Canals & 7th/8th Nerve Bundles */}
                        <line x1="140" y1="145" x2="185" y2="152" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
                        <line x1="260" y1="145" x2="215" y2="152" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
                        <circle cx="140" cy="145" r="4" fill="#38bdf8" />
                        <circle cx="260" cy="145" r="4" fill="#38bdf8" />
                        <text x="105" y="115" fill="#38bdf8" fontSize="10" fontWeight="bold" fontFamily="monospace">Bilateral Intact CN VII / VIII</text>
                        <text x="120" y="275" fill="#22c55e" fontSize="10" fontWeight="bold" fontFamily="monospace">No Acoustic Neuroma Detected</text>
                        <text x="25" y="35" fill="#f8fafc" fontSize="16" fontWeight="bold">R</text>
                        <text x="360" y="35" fill="#f8fafc" fontSize="16" fontWeight="bold">L</text>
                      </g>
                    ) : report.svgType === 'echo-tte' ? (
                      /* ECHOCARDIOGRAM / ULTRASOUND APICAL 4-CHAMBER */
                      <g>
                        {/* Sector Probe Beam */}
                        <path d="M 200 40 L 70 260 A 160 160 0 0 0 330 260 Z" fill="#030712" stroke="#1e293b" strokeWidth="2" />
                        {/* Interventricular Septum */}
                        <line x1="200" y1="70" x2="200" y2="180" stroke="#64748b" strokeWidth="7" strokeLinecap="round" />
                        {/* Left Ventricle (LV) & Right Ventricle (RV) Cavities */}
                        <path d="M 203 70 Q 255 120 235 180" stroke="#64748b" strokeWidth="5" fill="none" />
                        <path d="M 197 70 Q 145 120 165 180" stroke="#64748b" strokeWidth="5" fill="none" />
                        {/* Mitral & Tricuspid Valves */}
                        <line x1="203" y1="180" x2="240" y2="185" stroke="#38bdf8" strokeWidth="3" />
                        <line x1="197" y1="180" x2="160" y2="185" stroke="#38bdf8" strokeWidth="3" />
                        {/* Left Atrium & Right Atrium */}
                        <path d="M 203 185 Q 260 215 230 250" stroke="#475569" strokeWidth="4" fill="none" />
                        <path d="M 197 185 Q 140 215 170 250" stroke="#475569" strokeWidth="4" fill="none" />
                        {/* Labels */}
                        <text x="215" y="130" fill="#94a3b8" fontSize="12" fontWeight="bold">LV</text>
                        <text x="170" y="130" fill="#94a3b8" fontSize="12" fontWeight="bold">RV</text>
                        <text x="215" y="220" fill="#64748b" fontSize="11" fontWeight="bold">LA</text>
                        <text x="170" y="220" fill="#64748b" fontSize="11" fontWeight="bold">RA</text>
                        <text x="135" y="280" fill="#38bdf8" fontSize="10" fontFamily="monospace">APICAL 4-CHAMBER</text>
                      </g>
                    ) : report.svgType === 'cath-lab' ? (
                      /* CORONARY ANGIOGRAPHY FLUOROSCOPY */
                      <g>
                        {/* Fluoroscopy Background */}
                        <rect width="400" height="300" fill="#020617" />
                        {/* Diagnostic Guide Catheter */}
                        <path d="M 200 20 Q 200 70 160 90" stroke="#e2e8f0" strokeWidth="6" fill="none" strokeLinecap="round" />
                        {/* Coronary Artery Tree (RCA C-shape) */}
                        <path d="M 160 90 Q 90 140 100 210 Q 110 260 180 270" stroke="#94a3b8" strokeWidth="5" fill="none" />
                        {/* Acute Mid-RCA Cut-off / Occlusion Marker */}
                        <g>
                          <circle cx="95" cy="170" r="8" fill="#ef4444" opacity="0.9" />
                          <line x1="90" y1="165" x2="100" y2="175" stroke="#ffffff" strokeWidth="2.5" />
                          <line x1="100" y1="165" x2="90" y2="175" stroke="#ffffff" strokeWidth="2.5" />
                          <text x="115" y="174" fill="#ef4444" fontSize="10" fontWeight="bold" fontFamily="monospace">100% Occlusion (Culprit TIMI 0)</text>
                        </g>
                        <text x="25" y="35" fill="#f8fafc" fontSize="14" fontWeight="bold" fontFamily="monospace">LAO 30° / CRANIAL</text>
                        <text x="230" y="280" fill="#22c55e" fontSize="10" fontWeight="bold" fontFamily="monospace">Post-PCI: Stent Placed (TIMI 3)</text>
                      </g>
                    ) : (
                      /* CHEST & NECK RADIOGRAPHS */
                      <g>
                        {/* Spine & Mediastinum */}
                        <rect x="194" y="20" width="12" height="260" rx="3" fill="#334155" opacity="0.6" />
                        
                        {/* Clavicles */}
                        <path d="M 60 50 Q 150 40 200 65" stroke="#475569" strokeWidth="6" fill="none" opacity="0.7" />
                        <path d="M 340 50 Q 250 40 200 65" stroke="#475569" strokeWidth="6" fill="none" opacity="0.7" />

                        {/* Ribs bilateral */}
                        {[80, 110, 140, 170, 200, 230].map((y, i) => (
                          <g key={i} stroke="#334155" strokeWidth="5" fill="none" opacity="0.45">
                            <path d={`M 195 ${y - 15} Q 110 ${y} 50 ${y + 25}`} />
                            <path d={`M 205 ${y - 15} Q 290 ${y} 350 ${y + 25}`} />
                          </g>
                        ))}

                        {/* Lung Fields (Dark translucency) */}
                        <path d="M 90 70 Q 60 120 60 220 Q 120 250 180 230 Q 180 120 120 70 Z" fill="#0f172a" opacity="0.9" />
                        <path d="M 310 70 Q 340 120 340 220 Q 280 250 220 230 Q 220 120 280 70 Z" fill="#0f172a" opacity="0.9" />

                        {/* Cardiac Silhouette */}
                        {report.svgType === 'cxr-edema' ? (
                          /* Cardiomegaly (Enlarged Heart) + Bat-wing Edema */
                          <g>
                            <path d="M 170 120 Q 270 160 270 235 Q 190 255 130 235 Q 110 170 170 120 Z" fill="#94a3b8" opacity="0.7" />
                            <circle cx="150" cy="160" r="38" fill="#cbd5e1" opacity="0.4" filter="blur(6px)" />
                            <circle cx="240" cy="160" r="38" fill="#cbd5e1" opacity="0.4" filter="blur(6px)" />
                            <line x1="55" y1="210" x2="80" y2="210" stroke="#f1f5f9" strokeWidth="2" opacity="0.7" />
                            <line x1="56" y1="218" x2="82" y2="218" stroke="#f1f5f9" strokeWidth="2" opacity="0.7" />
                            <line x1="58" y1="226" x2="84" y2="226" stroke="#f1f5f9" strokeWidth="2" opacity="0.7" />
                          </g>
                        ) : report.svgType === 'neck-epiglottitis' ? (
                          /* Epiglottitis Lateral Neck Thumbprint Sign */
                          <g>
                            <rect x="120" y="40" width="70" height="220" rx="15" fill="#334155" opacity="0.6" />
                            <path d="M 210 30 Q 210 140 220 270" stroke="#020617" strokeWidth="26" fill="none" />
                            <ellipse cx="218" cy="125" rx="16" ry="24" fill="#e2e8f0" opacity="0.85" />
                            <circle cx="218" cy="125" r="24" stroke="#ef4444" strokeWidth="2" fill="none" strokeDasharray="3 3" />
                            <text x="248" y="130" fill="#ef4444" fontSize="11" fontWeight="bold" fontFamily="monospace">Thumbprint Sign</text>
                          </g>
                        ) : (
                          /* Normal Cardiac Silhouette (STEMI/Clear CXR) */
                          <path d="M 180 130 Q 235 160 235 230 Q 180 245 140 230 Q 130 180 180 130 Z" fill="#64748b" opacity="0.6" />
                        )}

                        {/* Diaphragm Domes */}
                        <path d="M 40 250 Q 120 220 190 245" stroke="#475569" strokeWidth="5" fill="none" />
                        <path d="M 360 250 Q 280 225 210 245" stroke="#475569" strokeWidth="5" fill="none" />

                        {/* Film Orientation & Patient Side Marker */}
                        <text x="20" y="40" fill="#f8fafc" fontSize="18" fontWeight="bold" fontFamily="sans-serif">R</text>
                        <text x="365" y="40" fill="#94a3b8" fontSize="12" fontFamily="monospace">AP</text>
                      </g>
                    )}
                  </svg>
                </div>
              </div>

              {/* Radiologist Formal Findings List */}
              <div className="space-y-2">
                <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
                  Radiologist Examination Findings
                </h3>
                <ul className="space-y-1.5 list-disc pl-4 text-slate-700 text-[11px] leading-relaxed">
                  {report.findings.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>

              {/* Radiologic Impression */}
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                <span className="font-bold text-amber-900 block uppercase text-[10px] tracking-wide">
                  Final Radiologic Impression:
                </span>
                <p className="font-bold text-slate-900 text-xs mt-0.5 leading-snug">
                  {report.impression}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-200">
                <span>Technique: {report.technique}</span>
                <span className="font-semibold text-slate-700">{report.radiologist}</span>
              </div>
            </div>
          )}

          {/* 2. 12-LEAD ECG REPORT & GRID STRIP */}
          {report.type === 'ecg' && (
            <div className="space-y-4">
              {/* ECG Metrics Header Strip */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 p-2.5 rounded-lg bg-slate-100 border border-slate-300 text-[10.5px]">
                <div><span className="text-[9px] text-slate-500 block">HR (Vent. Rate)</span><span className="font-bold text-slate-900">{report.metrics.rate} bpm</span></div>
                <div><span className="text-[9px] text-slate-500 block">PR Interval</span><span className="font-bold text-slate-900">{report.metrics.pr}</span></div>
                <div><span className="text-[9px] text-slate-500 block">QRS Duration</span><span className="font-bold text-slate-900">{report.metrics.qrs}</span></div>
                <div><span className="text-[9px] text-slate-500 block">QT / QTc</span><span className="font-bold text-slate-900">{report.metrics.qtc}</span></div>
                <div><span className="text-[9px] text-slate-500 block">P-QRS Axis</span><span className="font-bold text-slate-900">{report.metrics.axis}</span></div>
                <div><span className="text-[9px] text-slate-500 block">Speed / Calib</span><span className="font-mono text-slate-700">25mm/s 10mm/mV</span></div>
              </div>

              {/* Realistic Millimeter Salmon-Pink ECG Grid Waveform Strip */}
              <div className="rounded-xl overflow-hidden border border-rose-300 bg-[#fff5f5] p-3 shadow-inner flex flex-col items-center">
                <div className="w-full flex items-center justify-between text-[10px] font-mono text-rose-900 font-bold pb-1 border-b border-rose-200 mb-2">
                  <span>LEAD II RHYTHM STRIP (25 mm/sec • 10 mm/mV)</span>
                  <span>STANDARD CALIBRATION</span>
                </div>

                <div className="w-full aspect-[4/1] bg-[#ffe4e6] relative overflow-hidden rounded border border-rose-300">
                  {/* Millimeter Grid Pattern */}
                  <div 
                    className="absolute inset-0 opacity-40" 
                    style={{
                      backgroundImage: `
                        linear-gradient(to right, #fb7185 1px, transparent 1px),
                        linear-gradient(to bottom, #fb7185 1px, transparent 1px)
                      `,
                      backgroundSize: '12px 12px'
                    }} 
                  />

                  {/* SVG Waveform Tracing */}
                  <svg viewBox="0 0 800 120" className="w-full h-full relative z-10">
                    {report.ecgType === 'stemi' ? (
                      /* STEMI Tracing: Marked convex ST elevation */
                      <path
                        d="M 10 70 L 40 70 Q 50 55 60 70 L 75 70 L 80 85 L 90 10 L 100 95 L 105 35 Q 130 35 155 70 L 210 70 Q 220 55 230 70 L 245 70 L 250 85 L 260 10 L 270 95 L 275 35 Q 300 35 325 70 L 380 70 Q 390 55 400 70 L 415 70 L 420 85 L 430 10 L 440 95 L 445 35 Q 470 35 495 70 L 550 70 Q 560 55 570 70 L 585 70 L 590 85 L 600 10 L 610 95 L 615 35 Q 640 35 665 70 L 790 70"
                        stroke="#1e293b"
                        strokeWidth="2.2"
                        fill="none"
                      />
                    ) : report.ecgType === 'psvt' ? (
                      /* PSVT Tracing: Narrow complex tachycardia at 195 bpm */
                      <path
                        d="M 10 70 L 25 70 L 30 85 L 35 15 L 40 95 L 45 65 Q 52 65 60 70 L 75 70 L 80 85 L 85 15 L 90 95 L 95 65 Q 102 65 110 70 L 125 70 L 130 85 L 135 15 L 140 95 L 145 65 Q 152 65 160 70 L 175 70 L 180 85 L 185 15 L 190 95 L 195 65 Q 202 65 210 70 L 225 70 L 230 85 L 235 15 L 240 95 L 245 65 Q 252 65 260 70 L 275 70 L 280 85 L 285 15 L 290 95 L 295 65 Q 302 65 310 70 L 325 70 L 330 85 L 335 15 L 340 95 L 345 65 Q 352 65 360 70 L 790 70"
                        stroke="#1e293b"
                        strokeWidth="2.2"
                        fill="none"
                      />
                    ) : (
                      /* Pericarditis: Diffuse concave ST elevations */
                      <path
                        d="M 10 70 L 40 70 Q 50 58 60 70 L 75 76 L 80 85 L 90 15 L 100 95 L 105 50 Q 125 45 150 70 L 210 70 Q 220 58 230 70 L 245 76 L 250 85 L 260 15 L 270 95 L 275 50 Q 295 45 320 70 L 790 70"
                        stroke="#1e293b"
                        strokeWidth="2.2"
                        fill="none"
                      />
                    )}
                  </svg>
                </div>
              </div>

              {/* ST-T Analysis */}
              <div className="space-y-1.5">
                <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
                  Morphologic Waveform & ST-T Segment Analysis
                </h3>
                <ul className="space-y-1 list-disc pl-4 text-slate-700 text-[11px]">
                  {report.stAnalysis.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              {/* Cardiologist Impression */}
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200">
                <span className="font-bold text-rose-900 block uppercase text-[10px] tracking-wide">
                  Confirmed Cardiologist Interpretation:
                </span>
                <p className="font-bold text-slate-900 text-xs mt-0.5 leading-snug">
                  {report.impression}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-200">
                <span>Telemetry Unit: ED Trauma Bay 3</span>
                <span className="font-semibold text-slate-700">{report.cardiologist}</span>
              </div>
            </div>
          )}

          {/* 2.5. PURE TONE AUDIOMETRY REPORT & GRAPH */}
          {report.type === 'audiogram' && (
            <div className="space-y-4">
              {/* Audiometry Numerical Metrics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-2.5 rounded-lg bg-slate-100 border border-slate-300 text-[10.5px]">
                <div>
                  <span className="text-[9px] text-slate-500 block uppercase font-bold">Right Ear Pure Tone Avg</span>
                  <span className="font-bold text-rose-600">{report.ptaResults.rightEarAvg}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 block uppercase font-bold">Left Ear Pure Tone Avg</span>
                  <span className="font-bold text-blue-600">{report.ptaResults.leftEarAvg}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 block uppercase font-bold">Speech Discrimination (R)</span>
                  <span className="font-bold text-slate-900">{report.ptaResults.speechDiscrimRight}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 block uppercase font-bold">Speech Discrimination (L)</span>
                  <span className="font-bold text-slate-900">{report.ptaResults.speechDiscrimLeft}</span>
                </div>
              </div>

              {/* Visual Clinical Audiogram Chart (Standard ISO 8253-1 format) */}
              <div className="rounded-xl overflow-hidden border border-slate-300 bg-white p-3 shadow-inner flex flex-col items-center">
                <div className="w-full flex items-center justify-between text-[10px] font-mono text-slate-700 pb-1 border-b border-slate-200 mb-2 font-bold">
                  <span>PURE TONE AUDIOGRAM (AIR CONDUCTION)</span>
                  <div className="flex items-center gap-3">
                    <span className="text-rose-600">● Right Ear (O)</span>
                    <span className="text-blue-600">✕ Left Ear (X)</span>
                  </div>
                </div>

                <div className="w-full max-w-[460px] aspect-[4/3] relative bg-[#fdfdfd] rounded border border-slate-200 p-2">
                  <svg viewBox="0 0 400 260" className="w-full h-full font-mono text-[9px]">
                    {/* Grid Lines for Frequencies (X: 250, 500, 1000, 2000, 4000, 8000 Hz) */}
                    {[
                      { hz: "250", x: 60 },
                      { hz: "500", x: 120 },
                      { hz: "1k", x: 180 },
                      { hz: "2k", x: 240 },
                      { hz: "4k", x: 300 },
                      { hz: "8k", x: 360 }
                    ].map((f, i) => (
                      <g key={i}>
                        <line x1={f.x} y1="30" x2={f.x} y2="230" stroke="#e2e8f0" strokeWidth="1" />
                        <text x={f.x - 10} y="22" fill="#64748b" fontWeight="bold">{f.hz}</text>
                      </g>
                    ))}

                    {/* Grid Lines for Hearing Level dB HL (Y: 0, 20, 40, 60, 80, 100 dB) */}
                    {[
                      { db: "0", y: 40 },
                      { db: "20", y: 75 },
                      { db: "40", y: 110 },
                      { db: "60", y: 145 },
                      { db: "80", y: 180 },
                      { db: "100", y: 215 }
                    ].map((d, i) => (
                      <g key={i}>
                        <line x1="50" y1={d.y} x2="370" y2={d.y} stroke={d.db === "20" ? "#22c55e" : "#e2e8f0"} strokeWidth={d.db === "20" ? 1.5 : 1} strokeDasharray={d.db === "20" ? "4 2" : "none"} />
                        <text x="25" y={d.y + 3} fill={d.db === "20" ? "#16a34a" : "#64748b"} fontWeight="bold">{d.db}</text>
                      </g>
                    ))}

                    {/* Normal Hearing Boundary Label */}
                    <text x="280" y="70" fill="#16a34a" fontSize="8" fontWeight="bold">Normal Threshold Limit (20 dB)</text>

                    {/* Axis Labels */}
                    <text x="180" y="248" fill="#475569" fontWeight="bold">Frequency (Hz)</text>
                    <text x="5" y="15" fill="#475569" fontWeight="bold">dB HL</text>

                    {/* Left Ear Waveform Tracing (Normal: ~10-15 dB HL across all) */}
                    <polyline
                      points="60,58 120,66 180,58 240,66 300,58 360,66"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="2"
                    />
                    {[
                      { x: 60, y: 58 },
                      { x: 120, y: 66 },
                      { x: 180, y: 58 },
                      { x: 240, y: 66 },
                      { x: 300, y: 58 },
                      { x: 360, y: 66 }
                    ].map((pt, i) => (
                      <g key={i} stroke="#2563eb" strokeWidth="2">
                        <line x1={pt.x - 4} y1={pt.y - 4} x2={pt.x + 4} y2={pt.y + 4} />
                        <line x1={pt.x + 4} y1={pt.y - 4} x2={pt.x - 4} y2={pt.y + 4} />
                      </g>
                    ))}

                    {/* Right Ear Waveform Tracing (SSNHL: drops down to 65-75 dB) */}
                    <polyline
                      points="60,92 120,136 180,154 240,171 300,163 360,171"
                      fill="none"
                      stroke="#dc2626"
                      strokeWidth="2.5"
                    />
                    {[
                      { x: 60, y: 92 },
                      { x: 120, y: 136 },
                      { x: 180, y: 154 },
                      { x: 240, y: 171 },
                      { x: 300, y: 163 },
                      { x: 360, y: 171 }
                    ].map((pt, i) => (
                      <circle key={i} cx={pt.x} cy={pt.y} r="4.5" fill="none" stroke="#dc2626" strokeWidth="2.2" />
                    ))}
                  </svg>
                </div>
              </div>

              {/* Middle Ear Status */}
              <div className="grid grid-cols-2 gap-2 text-[10.5px] p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-[9px] text-slate-500 block uppercase font-bold">Right Tympanogram</span>
                  <span className="font-medium text-slate-800">{report.ptaResults.tympanogramRight}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 block uppercase font-bold">Left Tympanogram</span>
                  <span className="font-medium text-slate-800">{report.ptaResults.tympanogramLeft}</span>
                </div>
              </div>

              {/* Audiologist Impression */}
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                <span className="font-bold text-amber-900 block uppercase text-[10px] tracking-wide">
                  Confirmed Audiologist Interpretation:
                </span>
                <p className="font-bold text-slate-900 text-xs mt-0.5 leading-snug">
                  {report.impression}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-200">
                <span>Soundproof Booth 2 • Interacoustics AC40 Clinical Audiometer</span>
                <span className="font-semibold text-slate-700">{report.audiologist}</span>
              </div>
            </div>
          )}

          {/* 3. LABORATORY BLOOD & ENZYME PANEL */}
          {report.type === 'labs' && (
            <div className="space-y-4">
              {/* Structured Lab Analyte Table */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[9.5px] border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Test / Analyte Name</th>
                      <th className="p-2.5">Result</th>
                      <th className="p-2.5">Units</th>
                      <th className="p-2.5">Reference Range</th>
                      <th className="p-2.5 text-right">Flag</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono">
                    {report.labRows.map((row, i) => (
                      <tr key={i} className={row.flag.includes('CRITICAL') ? 'bg-rose-50/70 font-bold' : row.flag.includes('HIGH') ? 'bg-amber-50/50' : ''}>
                        <td className="p-2.5 font-sans font-medium text-slate-800">{row.analyte}</td>
                        <td className={`p-2.5 font-bold ${row.flag.includes('CRITICAL') ? 'text-rose-600' : 'text-slate-900'}`}>{row.result}</td>
                        <td className="p-2.5 text-slate-500">{row.unit}</td>
                        <td className="p-2.5 text-slate-600">{row.ref}</td>
                        <td className="p-2.5 text-right font-sans">
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                            row.flag.includes('CRITICAL') 
                              ? 'bg-rose-600 text-white' 
                              : row.flag.includes('HIGH') || row.flag.includes('LOW')
                                ? 'bg-amber-500 text-white'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}>
                            {row.flag}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pathologist Note */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-700 block uppercase text-[10px] tracking-wide">
                  Pathologist Clinical Correlation:
                </span>
                <p className="text-slate-800 text-[11px] mt-0.5 leading-relaxed font-medium">
                  {report.pathologistNote}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-200">
                <span>Methodology: Automated Chemiluminescent Immunoassay / Ion Selective Electrode</span>
                <span className="font-semibold text-slate-700">{report.pathologist}</span>
              </div>
            </div>
          )}

          {/* Footer Accreditation & Barcode */}
          <div className="pt-4 border-t-2 border-slate-900 flex items-center justify-between text-[9px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Electronically Verified & Digitally Certified by Hospital Laboratory Information System (LIS).</span>
            </div>
            <div className="font-mono tracking-widest text-slate-400">
              ||| | |||| | ||| || |||||| |
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

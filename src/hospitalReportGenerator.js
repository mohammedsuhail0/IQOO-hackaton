// Hospital Diagnostic Report Generator
// Generates official clinical laboratory, 12-lead ECG, and radiology (X-ray/CT/MRI) diagnostic documents
// Formatted as clinical hospital records ready for on-screen viewing and one-click PDF printing.

export function generateHospitalReport(orderQuery, currentCase) {
  const q = orderQuery.toLowerCase().trim();
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const mrn = `MRN-${Math.floor(100000 + Math.random() * 900000)}`;

  // 0A. PURE TONE AUDIOMETRY & AUDIOGRAM (Case ent-5 & Hearing evaluations)
  if (
    q.includes('audiometry') || 
    q.includes('audiogram') || 
    q.includes('hearing test') || 
    q.includes('pta') ||
    q.includes('hearing loss')
  ) {
    const isSSNHL = currentCase.id === 'ent-5';
    return {
      id: `AUD-${Date.now().toString().slice(-6)}`,
      type: 'audiogram',
      reportTitle: "COMPREHENSIVE PURE TONE AUDIOMETRY & TYMPANOMETRY REPORT",
      department: "DEPARTMENT OF OTOLARYNGOLOGY & CLINICAL AUDIOLOGY",
      patientName: currentCase.patientName,
      age: currentCase.age,
      gender: currentCase.gender,
      mrn,
      date: dateStr,
      time: timeStr,
      indication: `Acute sensorineural hearing evaluation: ${currentCase.chiefComplaint}`,
      ptaResults: {
        rightEarAvg: isSSNHL ? "68 dB HL (Severe)" : "15 dB HL (Normal)",
        leftEarAvg: "14 dB HL (Normal Hearing)",
        speechDiscrimRight: isSSNHL ? "36% at 85 dB" : "96% at 40 dB",
        speechDiscrimLeft: "98% at 40 dB",
        tympanogramRight: "Type A (Normal Compliance & Middle Ear Pressure)",
        tympanogramLeft: "Type A (Normal Compliance & Middle Ear Pressure)",
        acousticReflex: isSSNHL ? "Absent right ipsilateral" : "Present bilaterally"
      },
      audiogramPoints: {
        frequencies: [250, 500, 1000, 2000, 4000, 8000],
        rightEar: isSSNHL ? [30, 55, 65, 75, 70, 75] : [15, 15, 10, 15, 15, 20],
        leftEar: [10, 15, 10, 15, 10, 15]
      },
      impression: isSSNHL
        ? "ACUTE MODERATE-TO-SEVERE SENSORINEURAL HEARING LOSS (SSNHL) OF THE RIGHT EAR ACROSS 3 CONTIGUOUS FREQUENCIES. CRITICAL 'GOLDEN WINDOW' TREATMENT WITH SYSTEMIC CORTICOSTEROIDS INDICATED."
        : "NORMAL BILATERAL PURE TONE THRESHOLDS AND NORMAL MIDDLE EAR STATUS.",
      audiologist: "Dr. Elena Rostova, AuD, CCC-A (Chief Clinical Audiologist)"
    };
  }

  // 0B. CORONARY ANGIOGRAPHY & CARDIAC CATH LAB (Case cardio-1 & PCI)
  if (
    q.includes('cath lab') || 
    q.includes('catheterization') || 
    q.includes('angioplasty') || 
    q.includes('pci') || 
    q.includes('coronary angiogram') ||
    q.includes('stent')
  ) {
    return {
      id: `CATH-${Date.now().toString().slice(-6)}`,
      type: 'xray',
      svgType: 'cath-lab',
      reportTitle: "EMERGENT CORONARY ANGIOGRAPHY & PERCUTANEOUS CORONARY INTERVENTION (PCI)",
      department: "CARDIAC CATHETERIZATION LABORATORY • INVASIVE CARDIOLOGY",
      technique: "Right femoral/radial 6 French arterial access; selective coronary angiography and primary PCI",
      patientName: currentCase.patientName,
      age: currentCase.age,
      gender: currentCase.gender,
      mrn,
      date: dateStr,
      time: timeStr,
      indication: `Emergent STEMI evaluation: ${currentCase.chiefComplaint}`,
      findings: [
        "Left Main Coronary Artery (LMCA): Normal without significant atherosclerotic plaque.",
        "Left Anterior Descending (LAD): Minor luminal irregularities (20-30% non-flow-limiting stenosis).",
        "Left Circumflex (LCx): Normal caliber with TIMI 3 flow.",
        "Right Coronary Artery (RCA): Acute 100% thrombotic occlusion at mid-vessel with TIMI 0 flow (Culprit Lesion).",
        "Intervention: Successful manual aspiration thrombectomy followed by deployment of a 3.5 x 24 mm Drug-Eluting Stent (DES) post-dilated to 16 atm. Restored TIMI 3 flow with 0% residual stenosis."
      ],
      impression: "SUCCESSFUL PRIMARY PCI OF 100% ACUTE THROMBOTIC MID-RCA OCCLUSION. COMPLETE REVASCULARIZATION WITH TIMI 3 DISTAL PERFUSION RESTORED.",
      radiologist: "Dr. David Chen, MD, FACC, FSCAI (Interventional Cardiologist)"
    };
  }

  // 0C. ECHOCARDIOGRAM / ULTRASOUND / POCUS (TTE / TEE)
  if (
    q.includes('echo') || 
    q.includes('echocardiogram') || 
    q.includes('ultrasound') || 
    q.includes('pocus') || 
    q.includes('sonogram') || 
    q.includes('tte') || 
    q.includes('tee')
  ) {
    const isSTEMI = currentCase.id === 'cardio-1';
    const isHeartFailure = currentCase.id === 'cardio-2';
    const isPericarditis = currentCase.id === 'cardio-3';
    const isEndocarditis = currentCase.id === 'cardio-5';

    let ef = "55-60%";
    let title = "TRANSTHORACIC ECHOCARDIOGRAM (TTE) & DOPPLER STUDY";
    let findings = [];
    let impression = "";

    if (isHeartFailure) {
      ef = "22%";
      findings = [
        "Left Ventricle: Severely dilated (LVEDD 64 mm) with global hypokinesia; Left Ventricular Ejection Fraction (LVEF) severely reduced at ~22%.",
        "Left Atrium: Severely dilated (LA volume index 48 mL/m²).",
        "Mitral Valve: Structurally intact leaflets with severe functional mitral regurgitation (vena contracta 0.7 cm) secondary to annular dilatation.",
        "Right Heart: Dilated right ventricle with moderately reduced systolic function (TAPSE 12 mm). Estimated RVSP 52 mmHg (moderate pulmonary hypertension).",
        "Inferior Vena Cava (IVC): Markedly plethoric (>2.5 cm) with <10% inspiratory collapse (CVP estimated at 15-20 mmHg)."
      ];
      impression = "SEVERE BIVENTRICULAR FAILURE WITH SEVERE SYSTOLIC DEPRESSION (LVEF 22%) AND MARKEDLY ELEVATED FILLING PRESSURES.";
    } else if (isSTEMI) {
      ef = "44%";
      findings = [
        "Left Ventricle: Regional wall motion abnormality: dense akinesis of the basal, mid-inferior, and inferolateral walls matching right coronary distribution.",
        "Anterior / Septal Segments: Hyperdynamic compensatory wall motion preserved.",
        "Valves: Structurally normal, trivial tricuspid regurgitation.",
        "Pericardium: No pericardial effusion identified.",
        "Ejection Fraction: Moderately depressed global LVEF ~44%."
      ];
      impression = "ACUTE REGIONAL WALL MOTION ABNORMALITY (INFERIOR/INFEROLATERAL AKINESIS) CORRESPONDING TO ACUTE INFERIOR STEMI.";
    } else if (isPericarditis) {
      findings = [
        "Pericardium: Small circumferential pericardial effusion measuring 6 mm along posterior wall.",
        "Hemodynamics: No evidence of right atrial systolic collapse or right ventricular diastolic collapse.",
        "Ventricular Dimensions & Function: Normal LV size and preserved systolic function (LVEF 62%). No regional wall motion abnormalities.",
        "Doppler: Mitral inflow respiratory variation <15% (ruling out early cardiac tamponade physiology)."
      ];
      impression = "SMALL CIRCUMFERENTIAL PERICARDIAL EFFUSION WITHOUT TAMPONADE HEMODYNAMICS. HIGHLY CONSISTENT WITH ACUTE PERICARDITIS.";
    } else if (isEndocarditis) {
      title = "TRANSESOPHAGEAL ECHOCARDIOGRAM (TEE) • STAT STUDY";
      findings = [
        "Mitral Valve: 8.5 x 6.0 mm dense, mobile, oscillating vegetation attached to the atrial surface of the anterior mitral valve leaflet (A2 segment).",
        "Regurgitation: Moderate to severe eccentric mitral regurgitation directed toward posterior left atrial wall.",
        "Aortic Valve: Mild congenital bicuspid morphology without aortic root abscess or fistulous tract.",
        "Left Ventricle: Normal cavity dimensions with preserved systolic function (LVEF 58%)."
      ];
      impression = "DEFINITIVE INFECTIVE ENDOCARDITIS WITH MOBILE 8.5MM MITRAL VEGETATION AND SEVERE REGURGITANT JET. DUKE CRITERIA MAJOR CRITERION MET.";
    } else {
      findings = [
        "Ventricular Size & Function: Normal LV internal dimensions with normal systolic function (LVEF 60-65%).",
        "Valvular Anatomy: Aortic, mitral, tricuspid, and pulmonary valves structurally unremarkable.",
        "Pericardium: No pericardial effusion or thickening.",
        "IVC: Normal caliber with >50% inspiratory collapse."
      ];
      impression = "NORMAL TRANSTHORACIC ECHOCARDIOGRAM. NO STRUCTURAL, VALVULAR, OR PERICARDIAL PATHOLOGY.";
    }

    return {
      id: `ECHO-${Date.now().toString().slice(-6)}`,
      type: 'xray',
      svgType: 'echo-tte',
      reportTitle: title,
      department: "NON-INVASIVE CARDIOVASCULAR ULTRASOUND LABORATORY",
      technique: "2D, M-Mode, Color Flow, and Spectral Doppler examination at bedside",
      patientName: currentCase.patientName,
      age: currentCase.age,
      gender: currentCase.gender,
      mrn,
      date: dateStr,
      time: timeStr,
      indication: `Urgent bedside cardiac evaluation: ${currentCase.chiefComplaint}`,
      findings,
      impression,
      radiologist: "Dr. Jonathan Hayes, MD, FASE (Director of Cardiac Echocardiography)"
    };
  }

  // 0D. CT SCANS (Computed Tomography) & MRI
  if (
    q.includes('ct scan') || 
    q.includes('cat scan') || 
    q.includes('computed tomography') || 
    q.includes('mri') || 
    q.includes('magnetic resonance') ||
    q.includes('scan')
  ) {
    const isMastoiditis = currentCase.id === 'ent-3';
    const isQuinsy = currentCase.id === 'ent-1';
    const isSSNHL = currentCase.id === 'ent-5';

    let title = "STAT CONTRAST-ENHANCED COMPUTED TOMOGRAPHY (CT)";
    let technique = "Helical multi-detector acquisition with axial, coronal, and sagittal reconstructions";
    let svgType = 'ct-mastoid';
    let findings = [];
    let impression = "";

    if (isMastoiditis) {
      title = "STAT HIGH-RESOLUTION CT OF TEMPORAL BONES";
      technique = "0.625 mm submillimeter bone algorithm axial and coronal reformations";
      svgType = 'ct-mastoid';
      findings = [
        "Left Mastoid: Complete fluid opacification of left mastoid air cells and middle ear cavity.",
        "Bony Architecture: Marked osteolysis with loss of fine mastoid bony trabeculae, diagnostic of coalescent mastoiditis.",
        "Cortical Plate: Frank thinning and focal dehiscent erosion of the lateral mastoid cortex with adjacent subperiosteal soft tissue edema.",
        "Intracranial Extent: Sigmoid sinus plate is intact without epidural abscess or sigmoid sinus thrombosis.",
        "Right Temporal Bone: Normal pneumatic mastoid air cells and intact ossicular chain."
      ];
      impression = "ACUTE COALESCENT LEFT MASTOIDITIS WITH LATERAL CORTICAL BONE EROSION AND IMPENDING SUBPERIOSTEAL ABSCESS. URGENT ENT CONSULTATION REQUIRED.";
    } else if (isQuinsy) {
      title = "STAT CONTRAST-ENHANCED CT OF THE SOFT TISSUES OF THE NECK";
      technique = "Axial 2.5 mm helical volumetric scans from skull base to thoracic inlet with IV iodinated contrast";
      svgType = 'ct-neck';
      findings = [
        "Right Peritonsillar Space: Discrete 3.2 x 2.4 x 2.8 cm rim-enhancing fluid collection containing central non-enhancing hypodensity.",
        "Oropharynx: Marked medial displacement of the enlarged right palatine tonsil with contralateral deviation of the uvula.",
        "Airway: Moderate extrinsic effacement and narrowing of the oropharyngeal airway without complete occlusion.",
        "Lymph Nodes: Prominent bilateral jugulodigastric lymphadenopathy, largest measuring 1.8 cm on the right.",
        "Deep Spaces: Parapharyngeal and retropharyngeal spaces are clear without dangerous fluid extension."
      ];
      impression = "RIPE RIGHT PERITONSILLAR ABSCESS (QUINSY) MEASURING 3.2 CM WITH AIRWAY DISPLACEMENT. CANDIDATE FOR URGENT DRAINAGE.";
    } else if (isSSNHL) {
      title = "HIGH-RESOLUTION 3-TESLA BRAIN & INTERNAL AUDITORY CANAL (IAC) MRI";
      technique = "Axial and coronal T1 pre- and post-gadolinium, 3D CISS/FIESTA submillimeter thin-slice sequences";
      svgType = 'mri-iac';
      findings = [
        "7th & 8th Cranial Nerve Complexes: Symmetrical, smooth caliber bilateral cisternal and canalicular segments without mass or nodularity.",
        "Internal Auditory Canals: No evidence of vestibular schwannoma (acoustic neuroma) or meningioma.",
        "Cochlea & Vestibule: Normal fluid signal on heavily T2-weighted sequences; no intralabyrinthine hemorrhage or schwannoma.",
        "Brain Parenchyma: Normal gray-white differentiation, no acute demyelinating lesions (MS) or ischemic infarction."
      ];
      impression = "UNREMARKABLE MRI OF THE INTERNAL AUDITORY CANALS. EXCLUDES RETROCOCHLEAR LESION (ACOUSTIC NEUROMA). CONSISTENT WITH IDIOPATHIC SUDDEN SENSORINEURAL HEARING LOSS.";
    } else {
      title = "NON-CONTRAST HEAD COMPUTED TOMOGRAPHY (CT)";
      technique = "Axial non-contrast CT brain slices from skull base to vertex";
      svgType = 'ct-head';
      findings = [
        "Brain Parenchyma: Normal attenuation throughout cerebral hemispheres, brainstem, and cerebellum.",
        "Hemorrhage: No acute intracranial, subarachnoid, subdural, or epidural hemorrhage.",
        "Mass Effect: Ventricles and sulci are normal in size and configuration; no midline shift.",
        "Calvarium: Normal calvarial bone structure, no acute fracture."
      ];
      impression = "ACUTE NON-CONTRAST HEAD CT IS NORMAL. NO ACUTE INTRACRANIAL BLEED OR MASS EFFECT.";
    }

    return {
      id: `CT-${Date.now().toString().slice(-6)}`,
      type: 'xray',
      svgType,
      reportTitle: title,
      department: "DEPARTMENT OF RADIOLOGY & ADVANCED CROSS-SECTIONAL IMAGING",
      technique,
      patientName: currentCase.patientName,
      age: currentCase.age,
      gender: currentCase.gender,
      mrn,
      date: dateStr,
      time: timeStr,
      indication: `Stat diagnostic imaging: ${currentCase.chiefComplaint}`,
      findings,
      impression,
      radiologist: "Dr. Gregory Vance, MD, FACR (Neuroradiologist / Senior Radiologist)"
    };
  }

  // 0E. MICROBIOLOGY, SWABS, NEEDLE ASPIRATION & BLOOD CULTURES
  if (
    q.includes('culture') || 
    q.includes('swab') || 
    q.includes('aspiration') || 
    q.includes('gram stain') ||
    q.includes('drainage') ||
    q.includes('pus')
  ) {
    const isQuinsy = currentCase.id === 'ent-1';
    const isEndocarditis = currentCase.id === 'cardio-5';

    let labRows = [];
    let title = "STAT MICROBIOLOGY & GRAM STAIN REPORT";
    let pathologistNote = "Microbial analysis performed under standard CLSI quality control guidelines.";

    if (isQuinsy) {
      title = "STAT PERITONSILLAR NEEDLE ASPIRATE ANALYSIS & GRAM STAIN";
      labRows = [
        { analyte: "Specimen Volume", result: "4.0", unit: "mL", ref: "N/A", flag: "NORMAL" },
        { analyte: "Gross Appearance", result: "Thick, Purulent, Foul-smelling", unit: "Description", ref: "Clear/Sterile", flag: "CRITICAL HIGH" },
        { analyte: "Polymorphonuclear Leukocytes (PMNs)", result: "Many (4+)", unit: "Microscopic", ref: "None", flag: "CRITICAL HIGH" },
        { analyte: "Gram-Positive Cocci in Chains", result: "Moderate (3+)", unit: "Microscopic", ref: "None", flag: "CRITICAL HIGH" },
        { analyte: "Gram-Negative Anaerobic Bacilli (Fusobacterium)", result: "Few (1+)", unit: "Microscopic", ref: "None", flag: "HIGH" },
        { analyte: "Rapid Strep Antigen (Group A)", result: "POSITIVE", unit: "Assay", ref: "Negative", flag: "CRITICAL HIGH" }
      ];
      pathologistNote = "Gram stain confirms polymicrobial peritonsillar abscess infection with Streptococcus pyogenes (GAS) and oral anaerobes. Intravenous Ampicillin-Sulbactam recommended.";
    } else if (isEndocarditis) {
      title = "STAT BLOOD CULTURES (3 INDEPENDENT VENIPUNCTURE SETS)";
      labRows = [
        { analyte: "Blood Culture Bottle 1 (Aerobic - Arm L)", result: "POSITIVE (Gram-Positive Cocci)", unit: "Growth in 14 hrs", ref: "No growth in 5 days", flag: "CRITICAL HIGH" },
        { analyte: "Blood Culture Bottle 2 (Anaerobic - Arm L)", result: "POSITIVE (Gram-Positive Cocci)", unit: "Growth in 16 hrs", ref: "No growth in 5 days", flag: "CRITICAL HIGH" },
        { analyte: "Blood Culture Bottle 3 (Aerobic - Arm R)", result: "POSITIVE (Gram-Positive Cocci)", unit: "Growth in 15 hrs", ref: "No growth in 5 days", flag: "CRITICAL HIGH" },
        { analyte: "Organism Identification (MALDI-TOF)", result: "Streptococcus sanguinis (Viridans group)", unit: "Species", ref: "Sterile", flag: "CRITICAL HIGH" },
        { analyte: "Penicillin Minimum Inhibitory Conc. (MIC)", result: "0.06", unit: "µg/mL (Susceptible)", ref: "MIC <= 0.12", flag: "NORMAL" }
      ];
      pathologistNote = "Continuous bacteremia with typical viridans group Streptococcus sanguinis across 3 of 3 culture sets fulfills Duke Major Microbiologic Criterion.";
    } else {
      title = "STAT CLINICAL MICROBIOLOGY SPECIMEN REPORT";
      labRows = [
        { analyte: "Gram Stain", result: "No bacteria or yeast seen", unit: "Microscopic", ref: "No organisms", flag: "NORMAL" },
        { analyte: "Polymorphonuclear Cells", result: "Few", unit: "Microscopic", ref: "Few to none", flag: "NORMAL" },
        { analyte: "Preliminary 24-hr Culture", result: "No growth at 24 hours", unit: "Incubation", ref: "No growth", flag: "NORMAL" }
      ];
      pathologistNote = "No pathogenic organisms recovered on preliminary review.";
    }

    return {
      id: `MIC-${Date.now().toString().slice(-6)}`,
      type: 'labs',
      reportTitle: title,
      department: "DIVISION OF CLINICAL MICROBIOLOGY & INFECTIOUS DISEASE",
      patientName: currentCase.patientName,
      age: currentCase.age,
      gender: currentCase.gender,
      mrn,
      date: dateStr,
      time: timeStr,
      labRows,
      pathologistNote,
      pathologist: "Dr. Evelyn Reed, MD, PhD, D(ABMM) (Director of Clinical Microbiology)"
    };
  }

  // 0F. ARTERIAL BLOOD GAS (ABG / VBG)
  if (
    q.includes('abg') || 
    q.includes('vbg') || 
    q.includes('blood gas') || 
    q.includes('arterial blood') || 
    q.includes('acid') ||
    q.includes('base')
  ) {
    const isHeartFailure = currentCase.id === 'cardio-2';
    const labRows = [
      { analyte: "Arterial pH", result: isHeartFailure ? "7.31" : "7.41", unit: "pH units", ref: "7.35 - 7.45", flag: isHeartFailure ? "CRITICAL LOW" : "NORMAL" },
      { analyte: "PaCO2", result: isHeartFailure ? "48.2" : "38.5", unit: "mmHg", ref: "35.0 - 45.0", flag: isHeartFailure ? "HIGH" : "NORMAL" },
      { analyte: "PaO2 (Room Air)", result: isHeartFailure ? "58.0" : "89.0", unit: "mmHg", ref: "80.0 - 100.0", flag: isHeartFailure ? "CRITICAL LOW" : "NORMAL" },
      { analyte: "Serum Bicarbonate (HCO3-)", result: isHeartFailure ? "23.8" : "24.2", unit: "mEq/L", ref: "22.0 - 26.0", flag: "NORMAL" },
      { analyte: "Base Excess", result: isHeartFailure ? "-2.1" : "+0.5", unit: "mEq/L", ref: "-2.0 to +2.0", flag: isHeartFailure ? "LOW" : "NORMAL" },
      { analyte: "Oxygen Saturation (SaO2)", result: isHeartFailure ? "88.2" : "97.4", unit: "%", ref: "> 95.0", flag: isHeartFailure ? "CRITICAL LOW" : "NORMAL" },
      { analyte: "L-Lactate (Whole Blood)", result: isHeartFailure ? "2.4" : "1.1", unit: "mmol/L", ref: "0.5 - 1.6", flag: isHeartFailure ? "HIGH" : "NORMAL" }
    ];

    return {
      id: `ABG-${Date.now().toString().slice(-6)}`,
      type: 'labs',
      reportTitle: "STAT ARTERIAL BLOOD GAS (ABG) & RESPIRATORY PROFILE",
      department: "PULMONARY PHYSIOLOGY & BLOOD GAS LABORATORY",
      patientName: currentCase.patientName,
      age: currentCase.age,
      gender: currentCase.gender,
      mrn,
      date: dateStr,
      time: timeStr,
      labRows,
      pathologistNote: isHeartFailure 
        ? "Acute hypoxemic respiratory acidosis secondary to severe alveolar pulmonary edema and ventilation-perfusion mismatch. Urgent supplemental oxygen and preload reduction indicated."
        : "Normal arterial acid-base balance and adequate room air oxygenation.",
      pathologist: "Dr. Marcus Vance, MD, FCAP (Chief of Clinical Pathology)"
    };
  }

  // 1. CHEST X-RAY / RADIOLOGY IMAGING
  if (q.includes('x-ray') || q.includes('xray') || q.includes('radiograph') || q.includes('cxr') || q.includes('chest film') || q.includes('neck film')) {
    const isEpiglottitis = currentCase.id === 'ent-4';
    const isHeartFailure = currentCase.id === 'cardio-2';
    const isSTEMI = currentCase.id === 'cardio-1';

    let title = "PORTABLE ANTEROPOSTERIOR (AP) CHEST RADIOGRAPH";
    let indication = `Acute emergency department evaluation: ${currentCase.chiefComplaint}`;
    let findings = [];
    let impression = "";
    let svgType = 'cxr-normal';

    if (isEpiglottitis) {
      title = "STAT SOFT TISSUE LATERAL NECK RADIOGRAPH";
      findings = [
        "Epiglottis: Markedly enlarged, rounded, and edematous measuring 9.5 mm in thickness (normal <3 mm).",
        "Supraglottic Space: Classic 'Thumbprint sign' demonstrating massive ballooning of aryepiglottic folds.",
        "Airway: Severe narrowing of the hypopharyngeal and subglottic airway column on inspiration.",
        "Soft Tissues: Retropharyngeal soft tissue space is preserved without gas tracking or retropharyngeal abscess."
      ];
      impression = "ACUTE EPIGLOTTITIS / SUPRAGLOTTITIS WITH THREATENED AIRWAY OBSTRUCTION. CRITICAL VALUE PHONED TO ATTENDING PHYSICIAN.";
      svgType = 'neck-epiglottitis';
    } else if (isHeartFailure) {
      findings = [
        "Cardiothoracic Ratio: Markedly enlarged cardiac silhouette (CTR > 0.62) with left ventricular configuration.",
        "Pulmonary Vasculature: Marked cephalization of pulmonary veins and engorgement of upper lobe vessels.",
        "Lung Parenchyma: Extensive bilateral perihilar alveolar infiltrates ('bat-wing' appearance) with diffuse interstitial edema.",
        "Pleural Spaces: Prominent bilateral costophrenic angle blunting and visible Kerley B lines at periphery."
      ];
      impression = "SEVERE ACUTE ALVEOLAR AND INTERSTITIAL PULMONARY EDEMA WITH CARDIOMEGALY. CONSISTENT WITH ACUTE DECOMPENSATED HEART FAILURE.";
      svgType = 'cxr-edema';
    } else {
      findings = [
        "Cardiothoracic Ratio: Normal cardiac contour and size (CTR = 0.46).",
        "Pulmonary Vasculature: Normal caliber and distribution; no vascular congestion.",
        "Lung Parenchyma: Clear bilaterally without focal consolidation, atelectasis, or active infiltrates.",
        "Mediastinum: Normal mediastinal contour, no widening of thoracic aorta (excluding acute aortic dissection).",
        "Pleural Spaces: Clear bilateral costophrenic angles; no pneumothorax or effusion identified."
      ];
      impression = isSTEMI 
        ? "NO ACUTE PULMONARY EDEMA OR MEDIASTINAL WIDENING. CLINICAL ACUTE CORONARY SYNDROME / STEMI MUST BE CORRELATED WITH 12-LEAD ECG AND CARDIAC TROPONINS."
        : "NORMAL AP CHEST RADIOGRAPH. NO CONSOLIDATION, EFFUSION, OR PNEUMOTHORAX.";
      svgType = 'cxr-normal';
    }

    return {
      id: `RAD-${Date.now().toString().slice(-6)}`,
      type: 'xray',
      reportTitle: title,
      department: "DEPARTMENT OF DIAGNOSTIC RADIOLOGY & IMAGING",
      technique: isEpiglottitis ? "Single lateral upright soft tissue cervical projection" : "Single view portable AP supine projection at bedside",
      patientName: currentCase.patientName,
      age: currentCase.age,
      gender: currentCase.gender,
      mrn,
      date: dateStr,
      time: timeStr,
      indication,
      findings,
      impression,
      radiologist: "Dr. Sarah Jenkins, MD, FACR (Board Certified Radiologist)",
      svgType
    };
  }

  // 2. 12-LEAD ELECTROCARDIOGRAM (ECG)
  if (q.includes('ecg') || q.includes('ekg') || q.includes('electrocardiogram') || q.includes('12 lead') || q.includes('12-lead') || q.includes('rhythm strip') || q.includes('tracing')) {
    let rate = 108;
    let rhythm = "Sinus Tachycardia";
    let pr = "164 ms";
    let qrs = "92 ms";
    let qtc = "468 ms";
    let axis = "+65° (Normal Axis)";
    let stAnalysis = [];
    let impression = "";
    let ecgType = 'stemi';

    if (currentCase.id === 'cardio-1') {
      rate = 108;
      rhythm = "Sinus Tachycardia at 108 bpm";
      stAnalysis = [
        "Leads II, III, aVF: Marked convex-upward ST-segment elevation of 3.5 mm with hyperacute T waves.",
        "Leads I, aVL: Reciprocal horizontal ST-segment depression of 2.0 mm.",
        "Precordial Leads (V1-V4): Mild ST flattening with preserved R wave progression."
      ];
      impression = "ACUTE INFERIOR ST-ELEVATION MYOCARDIAL INFARCTION (STEMI). IMMEDIATE PRIMARY PERCUTANEOUS CORONARY INTERVENTION (PCI) ACTIVATION RECOMMENDED.";
      ecgType = 'stemi';
    } else if (currentCase.id === 'cardio-3') {
      rate = 94;
      rhythm = "Normal Sinus Rhythm at 94 bpm";
      stAnalysis = [
        "Diffuse Leads (I, II, aVF, V2-V6): Widespread concave-upward ST-segment elevation without reciprocal depression (except in aVR).",
        "Lead II & aVR: PR-segment depression in lead II with reciprocal PR elevation in lead aVR."
      ];
      impression = "DIFFUSE ST-ELEVATION WITH PR DEPRESSION, HIGHLY CHARACTERISTIC OF STAGE 1 ACUTE PERICARDITIS. CORRELATE WITH ECHOCARDIOGRAM.";
      ecgType = 'pericarditis';
    } else if (currentCase.id === 'cardio-4') {
      rate = 195;
      rhythm = "Regular Narrow-Complex Supraventricular Tachycardia (PSVT) at 195 bpm";
      qrs = "84 ms";
      pr = "Indiscernible (Retrograde P waves buried in QRS / pseudo-r' in V1)";
      stAnalysis = [
        "Narrow QRS complex (<100ms) with absolute regular RR intervals.",
        "Secondary rate-dependent diffuse ST depression (<1mm) across precordial leads."
      ];
      impression = "PAROXYSMAL SUPRAVENTRICULAR TACHYCARDIA (AVNRT / AVRT). RECOMMEND MODIFIED VALSALVA OR RAPID IV ADENOSINE 6MG BOLUS.";
      ecgType = 'psvt';
    } else {
      rate = 112;
      rhythm = "Sinus Tachycardia at 112 bpm";
      stAnalysis = [
        "Precordial Leads: Voltage criteria met for Left Ventricular Hypertrophy (Sokolow-Lyon index > 35mm).",
        "Lateral Leads: Secondary repolarization strain pattern with asymmetric T wave inversions."
      ];
      impression = "SINUS TACHYCARDIA WITH LEFT VENTRICULAR HYPERTROPHY AND REPOLARIZATION ABNORMALITIES.";
      ecgType = 'tachy';
    }

    return {
      id: `ECG-${Date.now().toString().slice(-6)}`,
      type: 'ecg',
      reportTitle: "12-LEAD RESTING CARDIAC ELECTROCARDIOGRAM",
      department: "DIVISION OF CARDIOVASCULAR MEDICINE & ELECTROPHYSIOLOGY",
      patientName: currentCase.patientName,
      age: currentCase.age,
      gender: currentCase.gender,
      mrn,
      date: dateStr,
      time: timeStr,
      metrics: { rate, rhythm, pr, qrs, qtc, axis },
      stAnalysis,
      impression,
      cardiologist: "Dr. David Chen, MD, FACC (Director of Interventional Cardiology)",
      ecgType
    };
  }

  // 3. STAT CARDIAC LABS & BLOOD PANEL (Troponin, BNP, Chem, ABG)
  let labRows = [];
  let labTitle = "STAT COMPREHENSIVE LABORATORY DIAGNOSTIC PANEL";
  let pathologistNote = "Specimens processed under emergency clinical laboratory protocols.";

  if (currentCase.id === 'cardio-1') {
    labTitle = "STAT CARDIAC BIOMARKERS & METABOLIC PROFILE";
    labRows = [
      { analyte: "High-Sensitivity Cardiac Troponin I (hs-cTnI)", result: "4.20", unit: "ng/mL", ref: "< 0.04", flag: "CRITICAL HIGH" },
      { analyte: "Creatine Kinase-MB (CK-MB)", result: "48.6", unit: "ng/mL", ref: "0.0 - 5.0", flag: "CRITICAL HIGH" },
      { analyte: "Total Serum Creatine Kinase (CK)", result: "412", unit: "U/L", ref: "30 - 200", flag: "HIGH" },
      { analyte: "Serum Potassium (K+)", result: "4.1", unit: "mEq/L", ref: "3.5 - 5.0", flag: "NORMAL" },
      { analyte: "Serum Sodium (Na+)", result: "139", unit: "mEq/L", ref: "135 - 145", flag: "NORMAL" },
      { analyte: "Serum Creatinine", result: "1.05", unit: "mg/dL", ref: "0.7 - 1.3", flag: "NORMAL" },
      { analyte: "Estimated GFR (eGFR)", result: "88", unit: "mL/min/1.73m²", ref: "> 60", flag: "NORMAL" },
      { analyte: "Blood Glucose (Random)", result: "182", unit: "mg/dL", ref: "70 - 140", flag: "HIGH" }
    ];
    pathologistNote = "Markedly elevated hs-Troponin I (>100x upper reference limit) indicates massive acute myocardial transmural necrosis. Emergency cath lab activation indicated.";
  } else if (currentCase.id === 'cardio-2') {
    labTitle = "STAT HEART FAILURE & RENAL METABOLIC PANEL";
    labRows = [
      { analyte: "N-Terminal pro-BNP (NT-proBNP)", result: "8,450", unit: "pg/mL", ref: "< 125", flag: "CRITICAL HIGH" },
      { analyte: "High-Sensitivity Troponin I", result: "0.08", unit: "ng/mL", ref: "< 0.04", flag: "HIGH" },
      { analyte: "Blood Urea Nitrogen (BUN)", result: "38", unit: "mg/dL", ref: "7 - 20", flag: "HIGH" },
      { analyte: "Serum Creatinine", result: "1.65", unit: "mg/dL", ref: "0.7 - 1.3", flag: "HIGH" },
      { analyte: "Arterial pH", result: "7.31", unit: "pH units", ref: "7.35 - 7.45", flag: "CRITICAL LOW" },
      { analyte: "Arterial PaO2 (Room Air)", result: "58.0", unit: "mmHg", ref: "80 - 100", flag: "CRITICAL LOW" },
      { analyte: "Arterial PaCO2", result: "48.2", unit: "mmHg", ref: "35 - 45", flag: "HIGH" },
      { analyte: "Serum Sodium (Na+)", result: "132", unit: "mEq/L", ref: "135 - 145", flag: "LOW" }
    ];
    pathologistNote = "Massively elevated NT-proBNP confirming severe acute decompensated heart failure with secondary cardiorenal syndrome and acute hypoxemic respiratory acidosis.";
  } else {
    labTitle = "STAT EMERGENCY CLINICAL LABORATORY PANEL";
    labRows = [
      { analyte: "White Blood Cell Count (WBC)", result: "14.8", unit: "x10³/µL", ref: "4.5 - 11.0", flag: "HIGH" },
      { analyte: "Hemoglobin (Hgb)", result: "14.2", unit: "g/dL", ref: "13.0 - 17.5", flag: "NORMAL" },
      { analyte: "Platelet Count", result: "284", unit: "x10³/µL", ref: "150 - 450", flag: "NORMAL" },
      { analyte: "C-Reactive Protein (CRP)", result: "42.5", unit: "mg/L", ref: "< 3.0", flag: "CRITICAL HIGH" },
      { analyte: "Erythrocyte Sed Rate (ESR)", result: "68", unit: "mm/hr", ref: "0 - 15", flag: "CRITICAL HIGH" },
      { analyte: "High-Sensitivity Troponin I", result: "0.02", unit: "ng/mL", ref: "< 0.04", flag: "NORMAL" },
      { analyte: "Serum Potassium (K+)", result: "4.2", unit: "mEq/L", ref: "3.5 - 5.0", flag: "NORMAL" }
    ];
    pathologistNote = "Marked acute systemic inflammatory response with leukocytosis and significantly elevated acute phase reactants.";
  }

  return {
    id: `LAB-${Date.now().toString().slice(-6)}`,
    type: 'labs',
    reportTitle: labTitle,
    department: "DEPARTMENT OF PATHOLOGY & CLINICAL LABORATORY MEDICINE",
    patientName: currentCase.patientName,
    age: currentCase.age,
    gender: currentCase.gender,
    mrn,
    date: dateStr,
    time: timeStr,
    labRows,
    pathologistNote,
    pathologist: "Dr. Marcus Vance, MD, FCAP (Chief of Clinical Pathology)"
  };
}

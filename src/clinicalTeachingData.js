// Clinical Teaching Database & In-Chat Diagnostic Intent Parser
// Provides rich medical pathophysiology, diagnostic clues, emergency protocols,
// and high-yield clinical pearls for all 10 Cardiology & ENT cases.
// Directly mapped to verified NCBI / NIH StatPearls & Professional Guidelines.

export const CLINICAL_TEACHING_DATA = {
  "cardio-1": {
    topic: "Acute ST-Elevation Myocardial Infarction (STEMI)",
    trueDiagnosis: "Acute ST-Elevation Myocardial Infarction (STEMI)",
    pathophysiology: "Sudden rupture or erosion of an unstable, thin-cap fibroatheroma in an epicardial coronary artery (most commonly LAD, RCA, or LCx). Plaque disruption exposes thrombogenic subendothelial collagen and tissue factor, triggering rapid platelet adhesion, activation, and thrombus propagation. This causes 100% transmural ischemia and acute wavefront necrosis of the underlying myocardium within 20-30 minutes.",
    keyClues: [
      "Retrosternal crushing chest tightness ('elephant on chest') lasting >20 minutes, unimproved by rest.",
      "Radiation to left shoulder, left arm, and angle of the mandible (cervicothoracic dermatomes C7-T4).",
      "Profound cold diaphoresis, nausea, and pale clammy skin reflecting massive autonomic sympathetic surge.",
      "Cardiovascular risk profile: 56-year-old male with 25-pack-year smoking history, 9-year diabetes mellitus, and essential hypertension.",
      "Auscultatory S4 gallop indicative of non-compliant, ischemic left ventricle."
    ],
    emergencyProtocol: [
      "12-Lead ECG within 10 minutes of presentation (evaluate for ST elevation ≥1mm in ≥2 contiguous leads).",
      "Immediate Cardiac Catheterization Lab Activation: Goal door-to-balloon primary PCI time <90 minutes.",
      "Chewable Aspirin 325 mg + P2Y12 Inhibitor (Ticagrelor 180 mg or Prasugrel 60 mg).",
      "Unfractionated Heparin (60 units/kg bolus, max 4000 units) + IV access x 2.",
      "Supplemental O2 only if SpO2 <90% (routine hyperoxia induces coronary vasoconstriction)."
    ],
    highYieldPearls: "Time is muscle: every 30-minute delay in reperfusion increases 1-year mortality by 7.5%. In inferior STEMI (leads II, III, aVF), always obtain right-sided leads (V4R) to check for Right Ventricular Infarction; if present, Nitrates and Morphine are contraindicated as they precipitate catastrophic preload collapse.",
    paperTitle: "AHA/ACC STEMI Clinical Practice Guidelines & Management",
    paperSource: "National Center for Biotechnology Information (NCBI) / StatPearls",
    paperUrl: "https://www.ncbi.nlm.nih.gov/books/NBK532281/"
  },

  "cardio-2": {
    topic: "Acute Decompensated Heart Failure (ADHF) & Pulmonary Edema",
    trueDiagnosis: "Acute Decompensated Heart Failure with Pulmonary Edema",
    pathophysiology: "Severe reduction in left ventricular forward stroke volume and compliance leading to marked rise in Left Ventricular End-Diastolic Pressure (LVEDP). Retrograde transmission of high pressures raises pulmonary capillary hydrostatic pressure above plasma oncotic pressure (>18-20 mmHg), forcing rapid transudation of serosanguinous fluid across the alveolar-capillary membrane into alveolar spaces, causing acute alveolar drowning.",
    keyClues: [
      "Severe orthopnea: inability to lie flat without suffocating, requiring 3 pillows to sleep.",
      "Paroxysmal Nocturnal Dyspnea (PND): waking up abruptly after 1-2 hours gasping and coughing for air.",
      "Productive cough with pink, frothy sputum reflecting alveolar capillary transudation.",
      "Bilateral coarse inspiratory crackles (rales) extending halfway up both lung fields.",
      "Marked systemic venous congestion: Jugular Venous Distension (JVD >8 cm) and 3+ pitting pedal edema."
    ],
    emergencyProtocol: [
      "Immediate Non-Invasive Positive Pressure Ventilation (CPAP 5-10 cmH2O or BiPAP) to increase functional residual capacity and drive fluid out of alveoli.",
      "Intravenous Loop Diuretic: IV Furosemide (Lasix) 40-80 mg bolus (or 2.5x home oral dose).",
      "IV Vasodilators: Sublingual/IV Nitroglycerin if systolic BP >100 mmHg to reduce preload and afterload.",
      "Urgent Bedside Point-of-Care Ultrasound (POCUS) / Echocardiogram to assess LV ejection fraction and rule out acute valvular rupture.",
      "Continuous telemetry, strict fluid restriction, and foley catheter to monitor hourly urine output."
    ],
    highYieldPearls: "Never initiate or up-titrate beta-blockers during an acute decompensated wet/cold crisis! Optimize diuresis first until the patient is completely euvolemic. Distinguish cardiac asthma (crackles + S3 + pink sputum) from bronchial asthma (polyphonic wheezing + prolonged expiratory phase).",
    paperTitle: "Heart Failure: Evaluation and Management Guidelines",
    paperSource: "National Center for Biotechnology Information (NCBI) / StatPearls",
    paperUrl: "https://www.ncbi.nlm.nih.gov/books/NBK448195/"
  },

  "cardio-3": {
    topic: "Acute Pericarditis",
    trueDiagnosis: "Acute Pericarditis",
    pathophysiology: "Acute inflammation of the parietal and visceral pericardium, commonly following a viral prodrome (Coxsackie, Echovirus, Influenza, SARS-CoV-2). Infiltration of polymorphonuclear leukocytes and fibrin deposition causes roughening of the pericardial surfaces. As the beating heart moves within the inflamed pericardial sac, mechanical friction produces sharp pleuritic pain.",
    keyClues: [
      "Sharp, retrosternal pleuritic chest pain that worsens markedly with inspiration, coughing, or lying supine.",
      "Postural relief: pain significantly improves when sitting upright and leaning forward (moves pericardium away from adjacent pleura).",
      "Pathognomonic triphasic superficial scratchy pericardial friction rub heard best at left lower sternal border at end-expiration.",
      "Radiation along phrenic nerve distribution to the bilateral trapezius ridges.",
      "Recent viral respiratory or gastrointestinal illness 1-2 weeks prior."
    ],
    emergencyProtocol: [
      "12-Lead ECG: Look for diffuse concave-upward ST segment elevation with reciprocal ST depression in aVR/V1, and PR segment depression.",
      "First-Line Medical Therapy: High-dose oral NSAIDs (Ibuprofen 600-800 mg TID or Indomethacin 50 mg TID) for 1-2 weeks.",
      "Mandatory Adjunctive Colchicine: 0.5 mg daily (or BID if >70 kg) for 3 months to prevent recurrent pericarditis.",
      "Urgent Transthoracic Echocardiogram (TTE) to rule out pericardial effusion and cardiac tamponade.",
      "Avoid strenuous physical exertion until CRP normalizes."
    ],
    highYieldPearls: "PR-segment depression is the most specific early ECG finding of acute pericarditis! Colchicine must ALWAYS be co-prescribed with NSAIDs—clinical trials prove it cuts recurrence in half (from 38% down to 16%). Systemic corticosteroids are contraindicated in first episodes because they stimulate viral replication and heighten recurrence.",
    paperTitle: "Acute Pericarditis: Pathophysiology and Practice",
    paperSource: "National Center for Biotechnology Information (NCBI) / StatPearls",
    paperUrl: "https://www.ncbi.nlm.nih.gov/books/NBK431080/"
  },

  "cardio-4": {
    topic: "Paroxysmal Supraventricular Tachycardia (PSVT)",
    trueDiagnosis: "Paroxysmal Supraventricular Tachycardia (PSVT / AVNRT)",
    pathophysiology: "Re-entrant tachyarrhythmia originating above the bifurcation of the bundle of His, most frequently Atrioventricular Nodal Re-entrant Tachycardia (AVNRT ~60%) or Atrioventricular Re-entrant Tachycardia (AVRT ~30%). In AVNRT, functional longitudinal dissociation of the AV node into dual pathways (slow pathway with short refractory period, fast pathway with long refractory period) permits an atrial premature beat to trigger a continuous micro-reentrant loop.",
    keyClues: [
      "Abrupt, 'light-switch' onset and termination of rapid, regular palpitations (160-220 bpm).",
      "Pounding sensation in the neck ('frog sign') caused by right atrial contraction against a closed tricuspid valve.",
      "Lightheadedness, presyncope, and breathlessness secondary to shortened diastolic filling time.",
      "Precipitated by caffeine binge, sleep deprivation, stress, or sympathomimetics.",
      "ECG demonstrates narrow QRS complex (<120 ms) regular tachycardia with retrograde P waves buried within or immediately after QRS."
    ],
    emergencyProtocol: [
      "Continuous cardiac telemetry and immediate 12-lead ECG capture.",
      "First-Line Non-Pharmacologic: Modified Valsalva Maneuver (REVERT protocol: 15 seconds blowing against 40 mmHg into syringe, then supine with passive leg raise for 15 seconds).",
      "First-Line Pharmacologic: IV Adenosine 6 mg rapid bolus via large antecubital vein with immediate 20 mL normal saline flush. If no conversion in 2 minutes, escalate to 12 mg bolus.",
      "Secondary options if adenosine fails: IV non-dihydropyridine calcium channel blocker (Diltiazem or Verapamil) or IV Beta-blocker.",
      "Synchronized DC Cardioversion (50-100 J) indicated immediately if hemodynamically unstable (hypotension, altered mental status, pulmonary edema)."
    ],
    highYieldPearls: "The REVERT modified Valsalva maneuver dramatically increases cardioversion success from 17% to 43% without needing drugs. When administering Adenosine, warn the patient about 5-10 seconds of intense chest pressure, flushing, and impending doom as transient complete AV block occurs.",
    paperTitle: "Supraventricular Tachycardia Emergency Management",
    paperSource: "National Center for Biotechnology Information (NCBI) / StatPearls",
    paperUrl: "https://www.ncbi.nlm.nih.gov/books/NBK482348/"
  },

  "cardio-5": {
    topic: "Acute Infective Endocarditis",
    trueDiagnosis: "Acute Infective Endocarditis",
    pathophysiology: "Microbial infection of the endothelial lining of the heart, predominantly targeting native or prosthetic cardiac valves. Endothelial micro-damage from turbulent flow (e.g. bicuspid aortic valve) leads to fibrin-platelet thrombus deposition (non-bacterial thrombotic endocarditis). Transient bacteremia (e.g., from dental extraction or skin breach) colonizes this nidus, forming an infected vegetation that destroys valve cusps, causes chordal rupture, and continuously sheds septic emboli.",
    keyClues: [
      "Persistent spiking fevers, drenching nocturnal diaphoresis, anorexia, and unexplained weight loss for 2-4 weeks.",
      "Recent invasive dental procedure (wisdom tooth extraction) without antibiotic prophylaxis.",
      "Pre-existing cardiac risk: known congenital bicuspid aortic valve murmur.",
      "New or changing regurgitant murmur (harsh early diastolic decrescendo murmur of aortic regurgitation).",
      "Peripheral vascular/immunologic stigmata: painless Janeway lesions on palms/soles, Roth spots on fundoscopy, and subungual splinter hemorrhages."
    ],
    emergencyProtocol: [
      "Blood Cultures: 3 separate sets drawn from different venipuncture sites with ≥1 hour spacing before starting antibiotics.",
      "Urgent Echocardiogram: Transesophageal Echocardiography (TEE) has 95% sensitivity (superior to TTE 65%) for detecting vegetations and perivalvular abscess.",
      "Empiric IV Antibiotics post-cultures: IV Vancomycin (15-20 mg/kg q8-12h) + IV Ceftriaxone 2g daily (or Gentamicin).",
      "Serial ECGs to monitor PR interval (prolongation signals aortic root abscess eroding through AV conduction bundle).",
      "Early Cardiothoracic Surgical Consultation for urgent valve replacement if acute refractory heart failure, annular abscess, or large mobile vegetation >10 mm."
    ],
    highYieldPearls: "Modified Duke Criteria is the clinical cornerstone: Requires 2 Major criteria (typical organisms in ≥2 blood cultures + echo vegetation/abscess) OR 1 Major + 3 Minor criteria. Never give 'just one dose' of oral antibiotics before blood cultures are drawn, as partial suppression renders cultures false-negative for weeks.",
    paperTitle: "Infective Endocarditis Duke Criteria & Practice Guide",
    paperSource: "National Center for Biotechnology Information (NCBI) / StatPearls",
    paperUrl: "https://www.ncbi.nlm.nih.gov/books/NBK537130/"
  },

  "ent-1": {
    topic: "Acute Peritonsillar Abscess (Quinsy)",
    trueDiagnosis: "Peritonsillar Abscess (Quinsy)",
    pathophysiology: "Suppurative infection that originates as acute exudative palatine tonsillitis and penetrates through the fibrous tonsillar capsule into the peritonsillar space (loose areolar tissue between the tonsil and superior pharyngeal constrictor muscle). Fluid accumulation transitions from cellulitis/phlegmon to a mature loculated abscess, pushing the tonsil medially and anteriorly and causing reflex spasm of the internal pterygoid muscle.",
    keyClues: [
      "Severe unilateral (one-sided) sore throat with marked odynophagia (swallowing feels like swallowing razor blades).",
      "Inability to swallow saliva, resulting in drooling into a cup.",
      "Severe trismus: patient can barely open their mouth (interincisal opening <20 mm) due to pterygoid irritation.",
      "'Hot potato' voice: muffled, guttural speech resonance caused by palatopharyngeal distortion.",
      "Physical Exam: marked medial bulging of the superior tonsillar pole with contralateral deviation of the uvula."
    ],
    emergencyProtocol: [
      "Urgent Diagnostic & Therapeutic Drainage: Needle aspiration using an 18-gauge needle with a cut plastic sheath (leaving 1.0-1.5 cm exposed to prevent carotid injury) or Formal Incision & Drainage (I&D).",
      "Intravenous Antimicrobial Therapy: IV Ampicillin-Sulbactam (Unasyn) 3g q6h or IV Ceftriaxone + Metronidazole (or Clindamycin if penicillin-allergic).",
      "Intravenous Corticosteroid: Single-dose IV Dexamethasone 10 mg (dramatically accelerates resolution of pain and trismus).",
      "Airway Assessment and continuous pulse oximetry; keep suction and emergency airway cart at bedside.",
      "IV fluid resuscitation for dehydration secondary to total dysphagia."
    ],
    highYieldPearls: "Never aspirate or incise pointing laterally! The internal carotid artery runs approximately 1.5 to 2.0 cm posterolateral to the tonsillar capsule. Direct the needle strictly in the sagittal (anteroposterior) plane into the most prominent bulge. Guard the needle tip with a cut needle cap.",
    paperTitle: "Peritonsillar Abscess: Emergency Drainage and Care",
    paperSource: "National Center for Biotechnology Information (NCBI) / StatPearls",
    paperUrl: "https://www.ncbi.nlm.nih.gov/books/NBK519520/"
  },

  "ent-2": {
    topic: "Benign Paroxysmal Positional Vertigo (BPPV)",
    trueDiagnosis: "Benign Paroxysmal Positional Vertigo (BPPV - Posterior Canal)",
    pathophysiology: "Otoconia (calcium carbonate crystals) naturally located in the utricular macula detach due to aging, mild head trauma, or viral labyrinthitis, and migrate into one of the semicircular canals (posterior canal in >85-90% of cases). In canalithiasis, changes in head position cause the free-floating particles to move under gravity, generating hydrodynamic fluid drag on the endolymph that deflects the cupula, producing false signals of intense angular rotation.",
    keyClues: [
      "Episodic, violent rotational vertigo lasting <60 seconds (typically 20-30 seconds).",
      "Triggered exclusively by changes in head position relative to gravity: rolling over in bed, tilting head backwards ('top shelf vertigo'), or bending down.",
      "Absence of cochlear symptoms: no hearing loss, tinnitus, or ear fullness.",
      "Absence of focal neurological deficits: no ataxia, dysarthria, diplopia, or motor weakness.",
      "Positive Dix-Hallpike Test: torsional upbeating nystagmus toward the affected ear after a 2-5 second latency, fatiguing in <30 seconds."
    ],
    emergencyProtocol: [
      "Dix-Hallpike Diagnostic Maneuver: 45° head turn, briskly lay supine with neck extended 20° off exam table; observe for crescendo-decrescendo torsional upbeating nystagmus.",
      "Immediate Epley Maneuver (Canalith Repositioning): 4 sequential 90° head-turn cycles maintained for 30-60 seconds each, guiding otoconia out of the posterior canal back into the utricle.",
      "Post-maneuver instructions: Avoid extreme head extensions for 24 hours; fall precautions for elderly patients.",
      "Avoid routine vestibular suppressants (Meclizine, Benzodiazepines) as they impair central vestibular compensation and do not treat the underlying mechanical crystal displacement.",
      "If nystagmus is direction-changing, downbeating, or non-fatigable, perform emergent brain MRI to rule out cerebellar or brainstem stroke."
    ],
    highYieldPearls: "The Epley maneuver has a >85-90% cure rate in a single clinic visit! Vestibular suppressants like Meclizine are NOT indicated for BPPV because the vertigo is momentary and mechanical, not continuous. Remember the HINTS exam: Head Impulse, Nystagmus, Test of Skew to differentiate central vertigo (stroke) from peripheral.",
    paperTitle: "Benign Paroxysmal Positional Vertigo Assessment & Epley Maneuver",
    paperSource: "National Center for Biotechnology Information (NCBI) / StatPearls",
    paperUrl: "https://www.ncbi.nlm.nih.gov/books/NBK470308/"
  },

  "ent-3": {
    topic: "Acute Mastoiditis",
    trueDiagnosis: "Acute Coalescent Mastoiditis",
    pathophysiology: "Direct progression of acute suppurative otitis media into the adjacent mastoid air cell system. Inflammation leads to fluid and purulent exudate retention in the mastoid trabeculae. When pressure exceeds capillary perfusion, osteoclastic destruction of the thin bony septa occurs (coalescent mastoiditis), followed by subperiosteal abscess formation over the mastoid cortex, displacing the auricle laterally and anteriorly.",
    keyClues: [
      "Severe, persistent throbbing postauricular pain and headache.",
      "Fever and marked tenderness over the mastoid process.",
      "Visible postauricular erythema, boggy swelling, and loss of the retroauricular crease.",
      "Protrusion of the external auricle forward and outward ('pinna sticking out').",
      "History of recent acute otitis media treated with an incomplete antibiotic course, with bulging erythematous tympanic membrane and purulent drainage."
    ],
    emergencyProtocol: [
      "High-Resolution Contrast-Enhanced Computed Tomography (CT) of the Temporal Bones to evaluate bone erosion, coalescent cavities, and intracranial extension.",
      "Urgent Otolaryngology (ENT) Surgical Consultation.",
      "Immediate High-Dose Intravenous Antibiotics: IV Ceftriaxone (2g daily) + IV Vancomycin (coverage for S. pneumoniae, S. pyogenes, S. aureus, and P. aeruginosa).",
      "Surgical Intervention: Emergency Myringotomy with Tympanostomy Tube insertion +/- Cortical Mastoidectomy for drainage.",
      "Serial Neurological Assessments: monitor for signs of intracranial spread (sigmoid sinus thrombosis, epidural abscess, meningitis, or brain abscess)."
    ],
    highYieldPearls: "Acute mastoiditis is a clinical diagnosis requiring emergent imaging to rule out dangerous intracranial complications. The postauricular subperiosteal abscess classically pushes the ear down and out. Never discharge a suspected mastoiditis on oral antibiotics—they require inpatient IV therapy and ENT evaluation.",
    paperTitle: "Mastoiditis: Diagnosis and Surgical Intervention Protocols",
    paperSource: "National Center for Biotechnology Information (NCBI) / StatPearls",
    paperUrl: "https://www.ncbi.nlm.nih.gov/books/NBK544332/"
  },

  "ent-4": {
    topic: "Acute Adult Epiglottitis (Supraglottitis)",
    trueDiagnosis: "Acute Epiglottitis / Supraglottitis",
    pathophysiology: "Rapidly progressive bacterial cellulitis and edema of the supraglottic structures (epiglottis, vallecula, arytenoids, and aryepiglottic folds). Because the supraglottic submucosa is loose and highly vascular, marked edema can quadruple the thickness of the epiglottis in hours, precipitating acute functional ball-valve obstruction of the laryngeal inlet and catastrophic asphyxiation.",
    keyClues: [
      "The '4 Ds': Dysphagia, Dysphonia (muffled 'hot potato' voice), Drooling, and severe respiratory Distress.",
      "Tripod Posture: patient sits upright, leaning forward with neck hyperextended and chin thrust forward to maintain airway patency.",
      "Inspiratory stridor and tachypnea, with anxiety and air hunger.",
      "Severe throat pain and odynophagia completely out of proportion to a normal or mildly erythematous oropharyngeal exam.",
      "Rapid clinical evolution: deterioration from mild sore throat to airway crisis within 6-12 hours."
    ],
    emergencyProtocol: [
      "AIRWAY SECURITY IS PARAMOUNT: Immediately assemble the Difficult Airway Team (experienced Senior Anesthesiologist and ENT Surgeon).",
      "STRICT DO NOTS: DO NOT use a tongue depressor or lay the patient supine—this can trigger reflex laryngospasm and instant total airway arrest.",
      "Keep patient calm in a seated position; provide gentle blow-by humidified oxygen.",
      "Definitive Airway: Prepare for fiberoptic awake nasotracheal intubation in the operating room with emergency tracheostomy/cricothyrotomy setup open and ready.",
      "Emergency Pharmacotherapy: IV Ceftriaxone (2g) + IV Vancomycin + IV Dexamethasone (10mg)."
    ],
    highYieldPearls: "Pain out of proportion to oropharyngeal physical findings in a toxic, drooling patient sitting in tripod posture is EPIGLOTTITIS until proven otherwise! The lateral soft tissue neck X-ray classic 'Thumbprint Sign' must NEVER delay definitive airway management.",
    paperTitle: "Epiglottitis: Emergency Airway Management Guidelines",
    paperSource: "National Center for Biotechnology Information (NCBI) / StatPearls",
    paperUrl: "https://www.ncbi.nlm.nih.gov/books/NBK430960/"
  },

  "ent-5": {
    topic: "Sudden Sensorineural Hearing Loss (SSNHL)",
    trueDiagnosis: "Idiopathic Sudden Sensorineural Hearing Loss (SSNHL)",
    pathophysiology: "Acute sensorineural hearing loss of ≥30 dB across at least 3 contiguous audiometric frequencies developing over <72 hours. While the definitive trigger is frequently idiopathic, proposed mechanisms include microvascular cochlear ischemia (labyrinthine artery spasm or thrombosis), viral cochleitis (reactivation of HSV-1 or VZV in the spiral ganglion), or autoimmune inner ear microangiopathy leading to rapid hair cell apoptosis in the organ of Corti.",
    keyClues: [
      "Sudden, catastrophic unilateral hearing drop noticed immediately upon waking up ('dead ear on morning telephone call').",
      "Accompanied by loud, high-pitched tinnitus (ringing/buzzing) and aural fullness in the affected ear.",
      "Completely normal otoscopic examination: normal tympanic membrane with no effusion, hemotympanum, or cerumen impaction.",
      "Tuning Fork Exam (512 Hz): Weber test lateralizes to the NORMAL (contralateral) ear; Rinne test is positive bilaterally (Air conduction > Bone conduction).",
      "Absence of other cranial neuropathies or vertigo (though mild imbalance may accompany)."
    ],
    emergencyProtocol: [
      "Emergent Formal Pure Tone Audiometry (PTA) within 24-48 hours to confirm sensorineural vs conductive loss and establish baseline severity.",
      "Immediate High-Dose Systemic Corticosteroids: Oral Prednisone 1 mg/kg/day (maximum 60 mg/day) for 7-14 days followed by a gradual taper, initiated ideally within 72 hours of symptom onset.",
      "Intratympanic (IT) Dexamethasone Injections: Recommended as primary therapy or salvage therapy if oral steroids fail or are contraindicated (e.g. severe uncontrolled diabetes).",
      "Hyperbaric Oxygen Therapy (HBOT) within 2-4 weeks of onset as adjunctive therapy.",
      "Contrast-Enhanced MRI of the Brain and Internal Auditory Canals (IAC) to rule out acoustic neuroma (vestibular schwannoma in up to 3-5% of presentations) or demyelinating disease."
    ],
    highYieldPearls: "SSNHL is a medical emergency with a strict 'Golden Window'! Treatment initiated within 72 hours yields recovery rates up to 70-80%, whereas delays beyond 2 weeks drop recovery to <20%. Never send a patient with sudden hearing loss and a normal eardrum home with nasal spray or ear drops for 'supposed Eustachian tube dysfunction'!",
    paperTitle: "Sudden Sensorineural Hearing Loss Practice Guideline",
    paperSource: "National Center for Biotechnology Information (NCBI) / StatPearls",
    paperUrl: "https://www.ncbi.nlm.nih.gov/books/NBK448109/"
  }
};

// Recognized clinical condition glossary for matching in-chat diagnostic disclosures
export const MEDICAL_CONDITIONS_CATALOG = [
  // Cardiology
  { canonical: "Acute ST-Elevation Myocardial Infarction (STEMI)", caseId: "cardio-1", keywords: ["stemi", "heart attack", "heatattack", "myocardial infarction", "coronary syndrome", "cardiac arrest", "infarct"] },
  { canonical: "Acute Decompensated Heart Failure (ADHF)", caseId: "cardio-2", keywords: ["heart failure", "pulmonary edema", "adhf", "congestive heart failure", "cardiac asthma", "chf"] },
  { canonical: "Acute Pericarditis", caseId: "cardio-3", keywords: ["pericarditis", "pericardial", "pericardial rub", "viral pericarditis"] },
  { canonical: "Paroxysmal Supraventricular Tachycardia (PSVT)", caseId: "cardio-4", keywords: ["psvt", "svt", "supraventricular tachycardia", "avnrt", "avrt", "atrial tachycardia"] },
  { canonical: "Acute Infective Endocarditis", caseId: "cardio-5", keywords: ["endocarditis", "infective endocarditis", "bacterial endocarditis", "subacute endocarditis"] },

  // ENT
  { canonical: "Peritonsillar Abscess (Quinsy)", caseId: "ent-1", keywords: ["quinsy", "peritonsillar abscess", "peritonsillar phlegmon", "tonsillar abscess"] },
  { canonical: "Benign Paroxysmal Positional Vertigo (BPPV)", caseId: "ent-2", keywords: ["bppv", "benign paroxysmal positional vertigo", "positional vertigo", "canalithiasis", "vertigo"] },
  { canonical: "Acute Mastoiditis", caseId: "ent-3", keywords: ["mastoiditis", "acute mastoiditis", "suppurative mastoiditis"] },
  { canonical: "Acute Epiglottitis", caseId: "ent-4", keywords: ["epiglottitis", "acute epiglottitis", "supraglottitis"] },
  { canonical: "Sudden Sensorineural Hearing Loss (SSNHL)", caseId: "ent-5", keywords: ["ssnhl", "sensorineural hearing loss", "sudden hearing loss", "acute hearing loss", "deafness"] },

  // Common Misdiagnoses / Differentials
  { canonical: "Bronchial Asthma", caseId: null, keywords: ["asthma", "asthma attack", "bronchospasm"] },
  { canonical: "Gastroesophageal Reflux Disease (GERD)", caseId: null, keywords: ["gerd", "acid reflux", "heartburn", "esophageal spasm"] },
  { canonical: "Pulmonary Embolism", caseId: null, keywords: ["pulmonary embolism", "pe", "blood clot in lung"] },
  { canonical: "Aortic Dissection", caseId: null, keywords: ["aortic dissection", "dissection", "thoracic dissection"] },
  { canonical: "Acute Pneumonia", caseId: null, keywords: ["pneumonia", "chest infection", "lung infection"] },
  { canonical: "Panic Attack / Anxiety Disorder", caseId: null, keywords: ["panic attack", "anxiety", "hyperventilation"] },
  { canonical: "Acute Otitis Media", caseId: null, keywords: ["otitis media", "ear infection", "middle ear infection"] },
  { canonical: "Meniere's Disease", caseId: null, keywords: ["meniere", "menieres disease", "endolymphatic hydrops"] },
  { canonical: "Vestibular Neuritis", caseId: null, keywords: ["vestibular neuritis", "labyrinthitis"] },
  { canonical: "Acute Tonsillitis", caseId: null, keywords: ["tonsillitis", "strep throat", "pharyngitis"] },
  { canonical: "Cerumen Impaction", caseId: null, keywords: ["earwax", "cerumen", "wax blockage"] },
  { canonical: "Respiratory Disorder / Lung Disease", caseId: null, keywords: ["lungs problem", "lung problem", "lung disease", "lung issue", "lungs issue", "respiratory problem", "lung infection"] }
];

// Detect if query is a Surrender / Give Up request
export function detectSurrenderPhrase(rawText) {
  if (!rawText) return false;
  const q = rawText.toLowerCase().trim();

  const surrenderPatterns = [
    /\bi don'?t know\b/i,
    /\bdont know\b/i,
    /\bidk\b/i,
    /\bi have no idea\b/i,
    /\bno idea\b/i,
    /\bgive up\b/i,
    /\bi give up\b/i,
    /\btell me the answer\b/i,
    /\bshow me the answer\b/i,
    /\bwhat is the answer\b/i,
    /\bwhat'?s the answer\b/i,
    /\bwhat is the diagnosis\b/i,
    /\bwhat'?s the diagnosis\b/i,
    /\btell me the diagnosis\b/i,
    /\bshow the solution\b/i,
    /\breveal solution\b/i,
    /\bwhat do you have\b/i,
    /\bwhat is wrong with you\b/i,
    /\bi surrender\b/i,
    /\bhelp me doc\b/i,
    /\bi cannot figure\b/i,
    /\bi can'?t figure\b/i
  ];

  return surrenderPatterns.some(pattern => pattern.test(q));
}

// Detect if query is an in-chat diagnosis disclosure (e.g. "you are getting an heart attack")
export function detectInChatDiagnosis(rawText, currentCase) {
  if (!rawText) return null;

  const trimmed = rawText.trim();
  const lower = trimmed.toLowerCase();

  // 1. Inquiries about family history, past medical history, or general questions -> NEVER a diagnosis disclosure
  const isQuestion = trimmed.includes('?') || 
    /^(do you|did you|have you|has anyone|can you|could you|would you|is there|are there|tell me if|any|what|why|how|when|where|who)\b/i.test(trimmed);

  const isHistoryOrFamilyInquiry = /\b(history|family|relatives|parents|father|mother|brother|sister|before|prior|previous|past|ever|years ago|months ago|first time)\b/i.test(trimmed);

  // If asking a question or inquiring about past/family, only allow if explicit formal diagnosis declaration is present
  const hasExplicitDoctorDeclaration = /^(my diagnosis is|i diagnose you with|i believe your diagnosis is|official diagnosis is)\b/i.test(trimmed);

  if ((isQuestion || isHistoryOrFamilyInquiry) && !hasExplicitDoctorDeclaration) {
    return null;
  }

  // 2. Normalize: handle common shorthand e.g. "u r", "ur", "u have", typos like "haing", "heatattack"
  let clean = lower
    .replace(/\bu r\b/g, "you are")
    .replace(/\bur\b/g, "your")
    .replace(/\bu have\b/g, "you have")
    .replace(/\bu are\b/g, "you are")
    .replace(/\bhaing\b/g, "having")
    .replace(/\bhavng\b/g, "having")
    .replace(/\bhavin\b/g, "having")
    .replace(/\bhve\b/g, "have")
    .replace(/heatattack/g, "heart attack")
    .replace(/heartattack/g, "heart attack")
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // 3. Affirmative diagnostic declaration prefixes
  const statementPrefixes = [
    /^(?:you are|you're)\s+(?:having|getting|suffering from)\b/i,
    /^(?:you have|you've got)\b/i,
    /^(?:the\s+)?patient\s+(?:has|is\s+having)\b/i,
    /^(?:i diagnose you with|i diagnose|my diagnosis is|my diagnose is)\b/i,
    /^(?:the diagnosis is|the diagnose is|diagnosis is|diagnose is)\b/i,
    /^(?:this is|it is|it's|looks like|seems like|i think you have|i suspect you have|i believe you have|my impression is)\b/i,
    /^(?:the\s+)?(?:diagnosis|diagnose|impression|assessment)\b/i
  ];

  const matchedPrefixRx = statementPrefixes.find(rx => rx.test(clean));
  const hasStatementPrefix = Boolean(matchedPrefixRx);

  // Check against all conditions in the catalog
  for (const item of MEDICAL_CONDITIONS_CATALOG) {
    for (const kw of item.keywords) {
      const kwRegex = new RegExp(`\\b${kw}\\b`, 'i');
      if (kwRegex.test(clean)) {
        // Standalone check: user just typed the disease name (e.g., "heart attack", "STEMI", "asthma")
        const stripped = clean.replace(/^(?:the\s+)?(?:diagnosis|diagnose|assessment|impression|case|condition)\s*[:=-]?\s*(?:is\s*)?/i, '').trim();
        const isExactStandalone = stripped === kw || stripped === `a ${kw}` || stripped === `an ${kw}`;

        if (hasStatementPrefix || isExactStandalone) {
          // Check if this condition matches the current case
          const isCaseMatch = item.caseId === currentCase.id || 
            currentCase.allowedDiagnoses.some(ad => ad.toLowerCase().includes(kw) || kw.includes(ad.toLowerCase()));

          return {
            isDiagnosis: true,
            extractedDiagnosis: item.canonical,
            matchedKeyword: kw,
            isCorrect: isCaseMatch
          };
        }
      }
    }
  }

  // Also directly check currentCase.allowedDiagnoses in case of exact medical acronym
  for (const ad of currentCase.allowedDiagnoses) {
    const adLower = ad.toLowerCase();
    const adRegex = new RegExp(`\\b${adLower}\\b`, 'i');
    if (adRegex.test(clean)) {
      const stripped = clean.replace(/^(?:the\s+)?(?:diagnosis|diagnose|assessment|impression|case|condition)\s*[:=-]?\s*(?:is\s*)?/i, '').trim();
      const isExactStandalone = stripped === adLower || stripped === `a ${adLower}` || stripped === `an ${adLower}`;
      if (hasStatementPrefix || isExactStandalone) {
        return {
          isDiagnosis: true,
          extractedDiagnosis: currentCase.trueDiagnosis,
          matchedKeyword: ad,
          isCorrect: true
        };
      }
    }
  }

  // If user explicitly said "the diagnose is X" / "my diagnosis is X", treat X as a diagnosis even if not in catalog
  if (hasStatementPrefix && matchedPrefixRx) {
    let rawExtracted = clean.replace(matchedPrefixRx, '').trim();
    // Strip leading articles or filler words
    rawExtracted = rawExtracted.replace(/^(?:a|an|the|this|that|your|my)\s+/i, '').trim();
    if (rawExtracted.length >= 2 && !/^(what|why|how|when|where|who|is|are|can)\b/i.test(rawExtracted)) {
      const isAllowed = currentCase.allowedDiagnoses.some(ad => 
        ad.toLowerCase().includes(rawExtracted) || rawExtracted.includes(ad.toLowerCase())
      );
      const capitalized = rawExtracted.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      return {
        isDiagnosis: true,
        extractedDiagnosis: isAllowed ? currentCase.trueDiagnosis : capitalized,
        matchedKeyword: rawExtracted,
        isCorrect: isAllowed
      };
    }
  }

  return null;
}

// Bedside Diagnostic Orders, Labs, and Physical Examination Parser
export const detectBedsideOrderOrExam = (query, currentCase) => {
  if (!query || !currentCase) return null;
  const q = query.toLowerCase().trim();

  // 1. 12-Lead ECG / EKG / Rhythm Strip Orders
  if (
    q.includes('ecg') || 
    q.includes('ekg') || 
    q.includes('electrocardiogram') || 
    q.includes('12 lead') || 
    q.includes('12-lead') || 
    q.includes('heart tracing') || 
    q.includes('rhythm strip') || 
    q.includes('cardiac monitor') ||
    (q.includes('run') && (q.includes('strip') || q.includes('leads') || q.includes('tracing') || q.includes('report')))
  ) {
    if (currentCase.id === 'cardio-1') {
      return "The triage nurse runs the 12-lead ECG immediately: It shows marked ST-segment elevation of 3.5mm in leads II, III, and aVF with reciprocal ST depression in leads I and aVL. Doctor, what does it mean?!";
    }
    if (currentCase.id === 'cardio-2') {
      return "The 12-lead ECG shows sinus tachycardia at 112 bpm with left ventricular hypertrophy and strain pattern. My breathing feels so heavy doctor.";
    }
    if (currentCase.id === 'cardio-3') {
      return "The nurse hands you the 12-lead ECG: Diffuse concave-upward ST-segment elevations across precordial leads with PR depression in lead II. Leaning forward is the only thing easing my chest.";
    }
    if (currentCase.id === 'cardio-4') {
      return "The monitor shows regular narrow-complex tachycardia at 195 bpm with absent P waves. My heart feels like it is pounding right out of my ribs!";
    }
    if (currentCase.id === 'cardio-5') {
      return "The 12-lead ECG shows normal sinus rhythm with first-degree AV block (PR interval 220ms). My fevers and chills have been terrible doctor.";
    }
    return "The triage nurse attaches the leads and prints the 12-lead ECG: It shows normal sinus rhythm with no acute ST elevation. What should we do next, doctor?";
  }

  // 2. Cardiac Enzymes / Troponin / Stat Labs / Blood Tests
  if (
    q.includes('troponin') || 
    q.includes('blood test') || 
    q.includes('enzymes') || 
    q.includes('cardiac markers') || 
    q.includes('bnp') || 
    q.includes('d-dimer') || 
    q.includes('stat lab') || 
    q.includes('draw blood') || 
    q.includes('blood draw') ||
    q.includes('chem panel') ||
    q.includes('labs')
  ) {
    if (currentCase.id === 'cardio-1') {
      return "The stat bedside lab returns: High-sensitivity Cardiac Troponin I is 4.2 ng/mL (critically elevated above normal 0.04). Doctor, please help me with this pressure!";
    }
    if (currentCase.id === 'cardio-2') {
      return "Bedside blood panel: NT-proBNP is critically elevated at 8,450 pg/mL, with BUN 38 and Creatinine 1.6. My breathing is so heavy doctor.";
    }
    if (currentCase.id === 'cardio-5') {
      return "Stat blood panel: ESR is 88 mm/hr and CRP is markedly elevated at 64 mg/L. Blood cultures x3 have been drawn and sent to microbiology.";
    }
    return "The nurse draws blood from my vein for the urgent lab panel and sends it stat. Please tell me what you find, doctor.";
  }

  // 3. Emergency Interventions & Stat Medications
  if (
    q.includes('aspirin') || 
    q.includes('nitro') || 
    q.includes('oxygen') || 
    q.includes('lasix') || 
    q.includes('furosemide') || 
    q.includes('o2') || 
    q.includes('spray') || 
    q.includes('morphine') ||
    q.includes('adenosine') ||
    q.includes('valsalva') ||
    q.includes('vagal')
  ) {
    if (q.includes('aspirin')) {
      return "I chewed and swallowed the 325mg aspirin tablets the nurse gave me. It tasted bitter, but I took it. My chest is still very tight, doctor.";
    }
    if (q.includes('oxygen') || q.includes('o2') || q.includes('mask') || q.includes('cannula')) {
      return "The nurse placed the oxygen mask over my nose and mouth. The air feels cool and helps me take a breath, but the pressure is still there.";
    }
    if (q.includes('nitro')) {
      return "The nurse sprayed the nitroglycerin under my tongue. It tingled and gave me a slight headache, but my chest is still aching.";
    }
    if (q.includes('lasix') || q.includes('furosemide')) {
      return "The nurse pushed the IV medication into my line. I really hope it starts clearing this fluid out of my chest soon.";
    }
    if (q.includes('adenosine') || q.includes('valsalva') || q.includes('vagal')) {
      return "The nurse pushes the rapid IV medicine while I bear down — my heart felt like it stopped for a terrifying second, but it slowed right down!";
    }
    return "The nurse administers that right into my IV line. Doctor, is it going to help me recover?";
  }

  // 4. Stethoscope Auscultation (Heart / Lungs)
  if (
    q.includes('stethoscope') || 
    q.includes('auscultat') || 
    q.includes('listen to your heart') || 
    q.includes('listen to heart') || 
    q.includes('listen to your lungs') || 
    q.includes('listen to lungs') || 
    q.includes('listen to your chest') || 
    q.includes('listen to chest') || 
    q.includes('heart sound') || 
    q.includes('lung sound') || 
    q.includes('breath sound') || 
    q.includes('murmur') || 
    q.includes('friction rub')
  ) {
    if (currentCase.id === 'cardio-1') {
      return "As you place your stethoscope on my chest, you hear a soft S4 gallop over my heart apex, and my lung fields sound clear.";
    }
    if (currentCase.id === 'cardio-2') {
      return "You listen to my lungs: there are coarse wet bubbling crackles across both lung bases, and my neck veins are clearly engorged.";
    }
    if (currentCase.id === 'cardio-3') {
      return "With your stethoscope against my lower breastbone, you hear a distinct scratching, leathery friction rub that gets louder when I lean forward.";
    }
    if (currentCase.id === 'cardio-4') {
      return "My heart rate is galloping at nearly 200 beats per minute, regular but impossibly rapid to count by ear.";
    }
    if (currentCase.id === 'cardio-5') {
      return "You hear a distinct harsh regurgitant murmur over my mitral area.";
    }
    if (currentCase.id === 'ent-4') {
      return "You can hear high-pitched harsh stridor with every breath I draw in, even without putting your stethoscope on my neck.";
    }
    return "You listen to my chest with your stethoscope. Everything feels tight and labored, doctor.";
  }

    // Needle Aspiration & Throat Drainage
    if (
      q.includes('needle aspiration') || 
      q.includes('aspiration') || 
      q.includes('incision') || 
      q.includes('drain') || 
      q.includes('drainage') || 
      q.includes('swab')
    ) {
      if (currentCase.id === 'ent-1') {
        return "Under local anesthesia, needle aspiration of my right peritonsillar fullness yields 4 mL of thick, foul-smelling purulent pus, immediately relieving my throat pressure and allowing me to breathe easier!";
      }
      return "The procedural kit is opened at bedside and sterile cultures are prepared for the microbiology laboratory.";
    }

    // 5. Throat / Mouth Inspection & Tongue Depressor
    if (
      q.includes('open your mouth') || 
      q.includes('open mouth') || 
      q.includes('look in your throat') || 
      q.includes('check throat') || 
      q.includes('examine throat') || 
      q.includes('tongue depressor') || 
      q.includes('tonsil') || 
      q.includes('uvula')
    ) {
      if (currentCase.id === 'ent-1') {
        return "I can barely open my teeth wider than a finger width because of the muscle spasm. You shine your light and see my right tonsil huge, inflamed, and pushing my uvula way to the left side.";
      }
      if (currentCase.id === 'ent-4') {
        return "Please don't put a wooden stick down my throat, doctor! It feels like my airway will clamp shut! I can only breathe sitting up and leaning forward.";
      }
      return "I open my mouth for you as best as I can, doctor.";
    }

    // 6. Ear & Mastoid Inspection & Tuning Fork Tests
    if (
      q.includes('otoscope') || 
      q.includes('mastoid') || 
      q.includes('behind your ear') || 
      q.includes('behind ear') || 
      q.includes('tuning fork') || 
      q.includes('weber') || 
      q.includes('rinne')
    ) {
      if (currentCase.id === 'ent-3') {
        return "Ow! Touching behind my left ear is agonizing — the bone is red, swollen, and has pushed my whole ear forward.";
      }
      if (currentCase.id === 'ent-5') {
        return "You inspect with your otoscope: my eardrum looks pearly and intact. When you strike the tuning fork, I only hear it vibrating in my left ear, nothing in my right!";
      }
      return "You examine my ear with your light. What does it look like, doctor?";
    }

    // Epley Canalith Repositioning Maneuver
    if (
      q.includes('epley') || 
      q.includes('repositioning') || 
      q.includes('canalith')
    ) {
      if (currentCase.id === 'ent-2') {
        return "You guide me through the 4-step Epley canalith repositioning sequence: after tilting my head through each angle, the dizziness subsides and my room stops spinning!";
      }
      return "I follow along as you guide my head through the repositioning sequence, doctor.";
    }

    // 7. Dix-Hallpike Maneuver & Positional Vertigo Testing
    if (
      q.includes('dix-hallpike') || 
      q.includes('hallpike') || 
      q.includes('nystagmus') ||
      (q.includes('maneuver') && !q.includes('vagal') && !q.includes('valsalva'))
    ) {
      if (currentCase.id === 'ent-2') {
        return "You quickly lay me back and turn my head 45 degrees to the right: after about 5 seconds, the room violently starts spinning and you can see my eyes jerking in a rapid upward twist!";
      }
      return "I follow your instructions and move my head as you guide me, doctor.";
    }

  // 8. Leg & Ankle Swelling (Pitting Edema)
  if (
    q.includes('pitting') || 
    q.includes('edema') || 
    (q.includes('swell') && (q.includes('leg') || q.includes('ankle') || q.includes('feet') || q.includes('shin')))
  ) {
    if (currentCase.id === 'cardio-2') {
      return "When you press your fingers into my shins, it leaves deep pits that take several seconds to bounce back. Both ankles are swollen up to my mid-calves.";
    }
    if (currentCase.id === 'cardio-1') {
      return "No swelling in my legs doctor, but my feet and hands are completely cold and drenched in sweat.";
    }
    return "No swelling in my legs, doctor.";
  }

  // 9. Chest X-Ray / Radiograph / CXR / Lateral Neck X-Ray
  if (
    q.includes('x-ray') || 
    q.includes('xray') || 
    q.includes('radiograph') || 
    q.includes('cxr') || 
    q.includes('chest film') || 
    q.includes('neck film')
  ) {
    if (currentCase.id === 'cardio-2') {
      return "Portable Chest X-Ray report: Marked cardiomegaly, prominent bilateral perihilar bat-wing alveolar opacities, and Kerley B lines indicative of acute interstitial pulmonary edema.";
    }
    if (currentCase.id === 'cardio-1') {
      return "Chest X-Ray report: Clear lung fields bilaterally, normal cardiac silhouette, and no widened mediastinum or pneumothorax.";
    }
    if (currentCase.id === 'cardio-3') {
      return "Chest X-Ray report: Lung fields are clear. Cardiac silhouette is borderline enlarged, but no massive globular 'water-bottle' enlargement yet.";
    }
    if (currentCase.id === 'ent-4') {
      return "Stat lateral soft-tissue neck radiograph: Demonstrates a classic marked 'Thumbprint sign' representing massive swelling of the epiglottis and aryepiglottic folds.";
    }
    return "The portable x-ray machine arrives at bedside: the technician takes the film and uploads the images to the viewer for you, doctor.";
  }

  // 10. Echocardiogram / Ultrasound / POCUS / TTE / TEE
  if (
    q.includes('echo') || 
    q.includes('echocardiogram') || 
    q.includes('ultrasound') || 
    q.includes('pocus') || 
    q.includes('sonogram') || 
    q.includes('tte') || 
    q.includes('tee')
  ) {
    if (currentCase.id === 'cardio-1') {
      return "Bedside POCUS Echocardiogram: Demonstrates acute regional wall motion abnormalities with akinesis of the inferior and posterior left ventricular wall; anterior wall motion preserved.";
    }
    if (currentCase.id === 'cardio-2') {
      return "Bedside Echocardiogram: Severely depressed left ventricular systolic function (LVEF ~25%) with global hypokinesia and secondary severe mitral regurgitation.";
    }
    if (currentCase.id === 'cardio-3') {
      return "Bedside Echocardiogram: Small circumferential pericardial effusion without evidence of right ventricular diastolic collapse or hemodynamic tamponade.";
    }
    if (currentCase.id === 'cardio-5') {
      return "Bedside TTE/TEE: Visualizes a mobile 8mm oscillating vegetation on the anterior mitral valve leaflet with moderate regurgitant jet.";
    }
    return "The ultrasound machine is brought to my bedside. The sonographer captures the views for your evaluation, doctor.";
  }

  // 11. CT Scan / CAT Scan / MRI
  if (
    q.includes('ct scan') || 
    q.includes('cat scan') || 
    q.includes('computed tomography') || 
    q.includes('mri') || 
    q.includes('magnetic resonance')
  ) {
    if (currentCase.id === 'ent-3') {
      return "Stat Contrast-Enhanced CT of Temporal Bones: Shows complete opacification of left mastoid air cells with bony trabecular destruction and lateral cortical bone erosion.";
    }
    if (currentCase.id === 'ent-5') {
      return "Brain & Internal Auditory Canal MRI: Normal symmetrical course of 7th and 8th cranial nerve complexes with no evidence of vestibular schwannoma (acoustic neuroma) or cerebellopontine angle mass.";
    }
    return "The radiology department confirms the scan order and is preparing the scanner room, doctor.";
  }

  // 12. Cath Lab Activation / Coronary Angiography (PCI)
  if (
    q.includes('cath lab') || 
    q.includes('catheterization') || 
    q.includes('angioplasty') || 
    q.includes('pci') || 
    q.includes('angiogram') || 
    q.includes('stent')
  ) {
    if (currentCase.id === 'cardio-1') {
      return "Emergency Cardiac Catheterization Lab is activated! The interventional cardiology team is mobilizing immediately for primary PCI within the 90-minute window!";
    }
    return "The cardiology fellow notes your request for catheterization consultation, doctor.";
  }

  // 14. Pure Tone Audiometry & Hearing Tests
  if (
    q.includes('audiometry') || 
    q.includes('audiogram') || 
    q.includes('hearing test') || 
    q.includes('pta')
  ) {
    if (currentCase.id === 'ent-5') {
      return "Stat Pure Tone Audiometry (PTA) report: Confirms a severe 55 dB sensorineural hearing loss across three contiguous frequencies (500, 1000, 2000 Hz) in the right ear.";
    }
    return "The audiologist performs the diagnostic hearing exam and prints the audiogram tracing for your chart, doctor.";
  }

  // 16. Arterial Blood Gas (ABG / VBG) & Electrolytes
  if (
    q.includes('abg') || 
    q.includes('vbg') || 
    q.includes('blood gas') || 
    q.includes('arterial blood') || 
    q.includes('electrolytes') || 
    q.includes('potassium') || 
    q.includes('magnesium')
  ) {
    if (currentCase.id === 'cardio-2') {
      return "Stat Arterial Blood Gas (ABG): pH 7.31, PaCO2 48 mmHg, PaO2 58 mmHg, HCO3 24 mEq/L, consistent with acute respiratory acidosis and hypoxemia on room air.";
    }
    if (currentCase.id === 'cardio-4') {
      return "Stat Electrolyte Panel: Potassium 4.1 mEq/L, Magnesium 2.0 mg/dL, Sodium 139 mEq/L, within normal limits.";
    }
    return "Stat blood gas sample drawn from radial artery: shows PaO2 76 mmHg with mild respiratory alkalosis.";
  }

  return null;
};


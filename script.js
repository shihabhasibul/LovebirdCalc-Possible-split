let lastCalcData = null;

// ==========================================
// DARK / LIGHT THEME
// ==========================================
function syncThemeIcon() {
    const icon = document.getElementById("theme-toggle-icon");
    if (!icon) return;
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    icon.innerHTML = isDark ? "&#9728;" : "&#9789;"; 
}

function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("agapornis-theme", next); } catch (e) {}
    syncThemeIcon();
}

document.addEventListener("DOMContentLoaded", syncThemeIcon);

// ==========================================
// 1. LINKAGE DATABASE (Z Chromosome Map)
// ==========================================
const linkageDB = [
    { loci: ["opaline", "cinnamon"], recombination: 0.33 },
    { loci: ["opaline", "ino"], recombination: 0.30 },
    { loci: ["cinnamon", "ino"], recombination: 0.03 }
];

// ==========================================
// 2. MUTATION DATABASE
// ==========================================
const mutationDB = [
    { id: "aqua", symbol: "bl^{aq}", name: "aqua", cat: 1, type: "AR", locus: "bl", locusGroup: "Multiple Alleles of bl-locus", alleles: ["aqua"], sp: { white_eye_ring: "original", roseicollis: "original" } },
    { id: "blue1", symbol: "bl^{1}", name: "blue1", cat: 1, type: "AR", locus: "bl", locusGroup: "Multiple Alleles of bl-locus", alleles: ["blue1"], sp: { white_eye_ring: "original" } },
    { id: "blue2", symbol: "bl^{2}", name: "blue2", cat: 1, type: "AR", locus: "bl", locusGroup: "Multiple Alleles of bl-locus", alleles: ["blue2"], sp: { white_eye_ring: "original" } },
    { id: "rose_blue", symbol: "bl", name: "*blue*", cat: 1, type: "AR", locus: "bl", locusGroup: "Multiple Alleles of bl-locus", alleles: ["rose_blue"], sp: { roseicollis: "original" }, note: "** needs further investigation", shortNote: "** needs further investigation" },
    { id: "turquoise", symbol: "bl^{tq}", name: "turquoise", cat: 1, type: "AR", locus: "bl", locusGroup: "Multiple Alleles of bl-locus", alleles: ["turquoise"], sp: { roseicollis: "original" } },
    { id: "teal", symbol: "tl", name: "teal", cat: 1, type: "AR", locus: "teal", locusGroup: "default", alleles: ["teal"], sp: { taranta: "original" } },

    { id: "aqua_blue1", symbol: "bl^{aq}/bl^{1}", name: "AquaBlue1", cat: 1, type: "AR", isCompound: true, locus: "bl", locusGroup: "Allelic Compounds of bl-locus", alleles: ["aqua", "blue1"], sp: { white_eye_ring: "original" } },
    { id: "aqua_blue2", symbol: "bl^{aq}/bl^{2}", name: "AquaBlue2", cat: 1, type: "AR", isCompound: true, locus: "bl", locusGroup: "Allelic Compounds of bl-locus", alleles: ["aqua", "blue2"], sp: { white_eye_ring: "original" } },
    { id: "blue1_blue2", symbol: "bl^{1}/bl^{2}", name: "Blue1Blue2", cat: 1, type: "AR", isCompound: true, locus: "bl", locusGroup: "Allelic Compounds of bl-locus", alleles: ["blue1", "blue2"], sp: { white_eye_ring: "original" } },
    { id: "aqua_rose_blue", symbol: "bl^{aq}/bl", name: "Aqua*Blue*", cat: 1, type: "AR", isCompound: true, locus: "bl", locusGroup: "Allelic Compounds of bl-locus", alleles: ["aqua", "rose_blue"], sp: { roseicollis: "original" }, note: "** needs further investigation", shortNote: "** needs further investigation" },
    { id: "turquoise_rose_blue", symbol: "bl^{tq}/bl", name: "Turquoise*Blue*", cat: 1, type: "AR", isCompound: true, locus: "bl", locusGroup: "Allelic Compounds of bl-locus", alleles: ["turquoise", "rose_blue"], sp: { roseicollis: "original" }, note: "** needs further investigation", shortNote: "** needs further investigation" },
    { id: "aqua_turquoise", symbol: "bl^{aq}/bl^{tq}", name: "AquaTurquoise", cat: 1, type: "AR", isCompound: true, locus: "bl", locusGroup: "Allelic Compounds of bl-locus", alleles: ["aqua", "turquoise"], sp: { roseicollis: "original" } },

    { id: "sapphire", symbol: "bl^{1}_bl^{2}/bl^{1}_bl^{2}", selector_label: "Sapphire (blue1-blue2)", result_label: "Sapphire", name: "Sapphire", cat: 1, type: "AR", locus: "bl", locusGroup: "Sapphire", isCompound: false, alleles: ["cis_bl1_bl2"], sp: { white_eye_ring: "original" }, shortNote: "Sapphire is not a separate mutation — it's the blue1-blue2 crossed-over mutant, not a new gene." },
    { id: "sapphire_blue1", symbol: "bl^{1}_bl^{2}/bl^{1}_bl^{+}", selector_label: "SapphireBlue1 (blue1-blue2/blue1)", result_label: "SapphireBlue1", name: "SapphireBlue1", cat: 1, type: "AR", locus: "bl", locusGroup: "Sapphire", isCompound: true, alleles: ["cis_bl1_bl2", "blue1"], sp: { white_eye_ring: "original" }, shortNote: "Sapphire is not a separate mutation — it's the blue1-blue2 crossed-over mutant, not a new gene." },
    { id: "sapphire_blue2", symbol: "bl^{1}_bl^{2}/bl^{+}_bl^{2}", selector_label: "SapphireBlue2 (blue1-blue2/blue2)", result_label: "SapphireBlue2", name: "SapphireBlue2", cat: 1, type: "AR", locus: "bl", locusGroup: "Sapphire", isCompound: true, alleles: ["cis_bl1_bl2", "blue2"], sp: { white_eye_ring: "original" }, shortNote: "Sapphire is not a separate mutation — it's the blue1-blue2 crossed-over mutant, not a new gene." },
    { id: "aqua_sapphire", symbol: "bl^{1}_bl^{2}/bl^{aq}_bl^{+}", selector_label: "AquaSapphire (blue1-blue2/aqua)", result_label: "AquaSapphire", name: "AquaSapphire", cat: 1, type: "AR", locus: "bl", locusGroup: "Sapphire", isCompound: true, alleles: ["cis_bl1_bl2", "aqua"], sp: { white_eye_ring: "original" }, shortNote: "Sapphire is not a separate mutation — it's the blue1-blue2 crossed-over mutant, not a new gene." },

    { id: "dark_factor", symbol: "D", name: "dark factor", cat: 2, type: "AID", locus: "dark_factor", locusGroup: "default", alleles: ["dark_factor"], sp: { taranta: "original", roseicollis: "original", white_eye_ring: "original" } },

    { id: "misty", symbol: "Mt", name: "misty", cat: 3, type: "AID", locus: "misty", locusGroup: "default", alleles: ["misty"], sp: { taranta: "original", white_eye_ring: "original" } },
    { id: "violet", symbol: "V", name: "violet", cat: 3, type: "AID", locus: "violet", locusGroup: "default", alleles: ["violet"], sp: { roseicollis: "original", white_eye_ring: "original" } },
    { id: "slaty", symbol: "Slt", name: "slaty", cat: 3, type: "AD", locus: "slaty", locusGroup: "default", alleles: ["slaty"], sp: { white_eye_ring: "original" } },

    { id: "dom_pied", symbol: "Pi", name: "dominant pied", cat: 4, type: "AD", locus: "dom_pied", locusGroup: "default", alleles: ["dom_pied"], sp: { roseicollis: "original", white_eye_ring: "original" } },
    { id: "dom_reduced", symbol: "Rdu", name: "dominant reduced", cat: 4, type: "AD", locus: "dom_reduced", locusGroup: "default", alleles: ["dom_reduced"], sp: { white_eye_ring: "original" }, infoNote: "Note: Dominant reduced is an autosomal dominant mutation with variable expressivity. Birds carrying the mutation may show different levels of visual expression, from very mild to very strong. This calculator predicts inheritance only, not the intensity of the phenotype.", shortNote: "Expression varies bird to bird (mild to strong); this predicts inheritance only, not intensity." },
    { id: "dom_edged", symbol: "Ed", name: "dominant edged", cat: 4, type: "AID", locus: "dom_edged", locusGroup: "default", alleles: ["dom_edged"], sp: { white_eye_ring: "original" } },
    { id: "euwing", symbol: "Ew", name: "euwing", cat: 4, type: "AID", locus: "euwing", locusGroup: "default", alleles: ["euwing"], sp: { white_eye_ring: "original" } },
    { id: "grey_factor", symbol: "Gf", name: "grey factor", cat: 4, type: "AID", locus: "grey_factor", locusGroup: "default", alleles: ["grey_factor"], sp: { roseicollis: "original" } },

    { id: "nsl_ino", symbol: "a", name: "NSL ino", cat: 4, type: "AR", locus: "a", locusGroup: "Multiple Alleles of a-locus", alleles: ["nsl_ino"], sp: { white_eye_ring: "original" } },
    { id: "dec", symbol: "a^{dec}", name: "dark eyed clear", cat: 4, type: "AR", locus: "a", locusGroup: "Multiple Alleles of a-locus", alleles: ["dec"], sp: { white_eye_ring: "original" } },
    { id: "pastel", symbol: "a^{pa}", name: "pastel", cat: 4, type: "AR", locus: "a", locusGroup: "Multiple Alleles of a-locus", alleles: ["pastel"], sp: { white_eye_ring: "original" } },
    { id: "bronze_fallow", symbol: "a^{bz}", name: "bronze fallow", cat: 4, type: "AR", locus: "a", locusGroup: "Multiple Alleles of a-locus", alleles: ["bronze_fallow"], sp: { taranta: "original", roseicollis: "original", white_eye_ring: "original" } },

    { id: "pastel_ino", symbol: "a^{pa}/a", name: "PastelIno", cat: 4, type: "AR", isCompound: true, locus: "a", locusGroup: "Allelic Compounds of a-locus", alleles: ["pastel", "nsl_ino"], sp: { white_eye_ring: "original" } },
    { id: "dec_ino", symbol: "a^{dec}/a", name: "DecIno", cat: 4, type: "AR", isCompound: true, locus: "a", locusGroup: "Allelic Compounds of a-locus", alleles: ["dec", "nsl_ino"], sp: { white_eye_ring: "original" } },
    { id: "pastel_dec", symbol: "a^{pa}/a^{dec}", name: "PastelDec", cat: 4, type: "AR", isCompound: true, locus: "a", locusGroup: "Allelic Compounds of a-locus", alleles: ["pastel", "dec"], sp: { white_eye_ring: "original" } },
    { id: "bronze_fallow_ino", symbol: "a^{bz}/a", name: "BronzeFallowIno", cat: 4, type: "AR", isCompound: true, locus: "a", locusGroup: "Allelic Compounds of a-locus", alleles: ["bronze_fallow", "nsl_ino"], sp: { white_eye_ring: "original" } },
    { id: "bronze_fallow_dec", symbol: "a^{bz}/a^{dec}", name: "BronzeFallowDec", cat: 4, type: "AR", isCompound: true, locus: "a", locusGroup: "Allelic Compounds of a-locus", alleles: ["bronze_fallow", "dec"], sp: { white_eye_ring: "original" } },
    { id: "bronze_fallow_pastel", symbol: "a^{bz}/a^{pa}", name: "BronzeFallowPastel", cat: 4, type: "AR", isCompound: true, locus: "a", locusGroup: "Allelic Compounds of a-locus", alleles: ["bronze_fallow", "pastel"], sp: { white_eye_ring: "original" } },

    { id: "dilute", symbol: "dil", name: "dilute", cat: 4, type: "AR", locus: "dilute", locusGroup: "Multiple Alleles of dil-locus", alleles: ["dilute"], sp: { roseicollis: "original", white_eye_ring: "original" } },
    { id: "pale_fallow", symbol: "pf", name: "pale fallow", cat: 4, type: "AR", locus: "pale_fallow", locusGroup: "Independent Loci", alleles: ["pale_fallow"], sp: { taranta: "original", roseicollis: "original", white_eye_ring: "original" } },
    { id: "dun_fallow", symbol: "df", name: "dun fallow", cat: 4, type: "AR", locus: "dun_fallow", locusGroup: "Independent Loci", alleles: ["dun_fallow"], sp: { white_eye_ring: "original" } },
    { id: "rec_pied", symbol: "s", name: "recessive pied", cat: 4, type: "AR", locus: "rec_pied", locusGroup: "Independent Loci", alleles: ["rec_pied"], sp: { roseicollis: "original", white_eye_ring: "original" } },
    { id: "faded", symbol: "fd", name: "*faded*", cat: 4, type: "AR", locus: "faded", locusGroup: "Independent Loci", alleles: ["faded"], sp: { white_eye_ring: "original" }, note: "** needs further investigation", shortNote: "** needs further investigation" },
    { id: "marbled", symbol: "mb", name: "marbled", cat: 4, type: "AR", locus: "marbled", locusGroup: "Independent Loci", alleles: ["marbled"], sp: { roseicollis: "original" } },
    { id: "dm_jade", symbol: "ja", name: "DM jade", cat: 4, type: "AR", locus: "dm_jade", locusGroup: "Independent Loci", alleles: ["dm_jade"], sp: { roseicollis: "original" }, infoNote: "Note: DM Jade is an autosomal recessive, sexually dimorphic mutation. Although inheritance is predicted accurately, males and females with the same genotype may look different. Therefore, the visual appearance of offspring depends on their sex as well as their genotype.", shortNote: "Sexually dimorphic — males and females with the same genotype can look different." },

    { id: "sl_ino", symbol: "ino", name: "SL ino", cat: 4, type: "SLR", locus: "ino", locusGroup: "Multiple Alleles of ino-locus", alleles: ["sl_ino"], sp: { roseicollis: "original" } },
    { id: "pallid", symbol: "ino^{pd}", name: "pallid", cat: 4, type: "SLR", locus: "ino", locusGroup: "Multiple Alleles of ino-locus", alleles: ["pallid"], sp: { roseicollis: "original", white_eye_ring: "original" } },
    { id: "pale", symbol: "ino^{pe}", name: "pale", cat: 4, type: "SLR", locus: "ino", locusGroup: "Multiple Alleles of ino-locus", alleles: ["pale"], sp: { roseicollis: "original", white_eye_ring: "original" } },

    { id: "pallid_ino", symbol: "ino^{pd}/ino", name: "PallidIno", cat: 4, type: "SLR", isCompound: true, locus: "ino", locusGroup: "Allelic Compounds of ino-locus", alleles: ["pallid", "sl_ino"], sp: { roseicollis: "original" } },
    { id: "pale_ino", symbol: "ino^{pe}/ino", name: "PaleIno", cat: 4, type: "SLR", isCompound: true, locus: "ino", locusGroup: "Allelic Compounds of ino-locus", alleles: ["pale", "sl_ino"], sp: { roseicollis: "original" } },
    { id: "pale_pallid", symbol: "ino^{pe}/ino^{pd}", name: "PalePallid", cat: 4, type: "SLR", isCompound: true, locus: "ino", locusGroup: "Allelic Compounds of ino-locus", alleles: ["pale", "pallid"], sp: { roseicollis: "original", white_eye_ring: "original" } },

    { id: "cinnamon", symbol: "cin", name: "cinnamon", cat: 4, type: "SLR", locus: "cinnamon", locusGroup: "Independent Loci", alleles: ["cinnamon"], sp: { roseicollis: "original", white_eye_ring: "original" } },
    { id: "sl_dom_greywing", symbol: "Grw", name: "SL dominant greywing", cat: 4, type: "SLID", locus: "sl_dom_greywing", locusGroup: "default", alleles: ["sl_dom_greywing"], sp: { white_eye_ring: "original" }, warningNote: "Note: The crossover (linkage) rate between SL dominant greywing and other sex-linked mutations (opaline, pallid, pale, cinnamon) has not yet been established by researchers. Until this data becomes available, the calculator assumes these mutations are inherited completely independently of one another." },

    { id: "opaline", symbol: "op", name: "opaline", cat: 5, type: "SLR", locus: "opaline", locusGroup: "default", alleles: ["opaline"], sp: { roseicollis: "original", white_eye_ring: "original" } },

    { id: "orange_face", symbol: "of", name: "orange face", cat: 6, type: "AR", locus: "orange_face", locusGroup: "default", alleles: ["orange_face"], sp: { roseicollis: "original", white_eye_ring: "original" } },
    { id: "pale_headed", symbol: "Ph", name: "pale headed", cat: 6, type: "AID", locus: "pale_headed", locusGroup: "default", alleles: ["pale_headed"], sp: { roseicollis: "original" } }
];

const CAT_NAME_ORDER = { 6: 1, 5: 2, 4: 3, 3: 4, 2: 5, 1: 6 };
function nameRank(cat) { return CAT_NAME_ORDER[cat] ?? 99; }

const allZloci = [...new Set(mutationDB.filter(m => m.type.includes("SL")).map(m => m.locus))];
const zMapOrder = ["opaline", "ino", "cinnamon", ...allZloci.filter(l => !["opaline", "ino", "cinnamon"].includes(l))];
const zNamingOrder = ["opaline", "cinnamon", "ino", ...allZloci.filter(l => !["opaline", "cinnamon", "ino"].includes(l))];

const categoriesOrder = ["Basic colour mutation", "Dark factor", "Dominant factor influencing the appearance of basic psittacofulvin mutations", "Eumelanin mutations", "Mutation influencing both eumelanin and psittacofulvin expression", "Mutation influencing pigment expression in the mask"];
const moiLabels = { "AR": "Autosomal Recessive", "AD": "Autosomal Dominant", "AID": "Autosomal Incomplete Dominant", "SLR": "Sex-Linked Recessive", "SLID": "Sex-Linked Incomplete Dominant", "SLD": "Sex-Linked Dominant" };
const lociGroups = { 'bl': ['aqua', 'blue1', 'blue2', 'rose_blue', 'turquoise', 'aqua_blue1', 'aqua_blue2', 'blue1_blue2', 'aqua_rose_blue', 'turquoise_rose_blue', 'aqua_turquoise', 'sapphire', 'sapphire_blue1', 'sapphire_blue2', 'aqua_sapphire'], 'a': ['nsl_ino', 'dec', 'pastel', 'bronze_fallow', 'pastel_ino', 'dec_ino', 'pastel_dec', 'bronze_fallow_ino', 'bronze_fallow_dec', 'bronze_fallow_pastel'], 'dil': ['dilute'], 'ino': ['sl_ino', 'pallid', 'pale', 'pallid_ino', 'pale_ino', 'pale_pallid'] };

// ==========================================
// INTEGRATED UPDATE UI & SEARCH ENGINE CORE
// ==========================================
let searchAppliedState = { male: [], female: [] };
let possibleAxesState = { male: [], female: [] };
let blockSearchInputEvent = false;

function resetSearchEngine() {
    searchAppliedState = { male: [], female: [] };
    possibleAxesState = { male: [], female: [] };
    blockSearchInputEvent = true;
    ['sire', 'dam'].forEach(prefix => {
        let inputEl = document.getElementById(`${prefix}-search-input`);
        let suggestionsEl = document.getElementById(`${prefix}-suggestions-container`);
        let linkageEl = document.getElementById(`${prefix}-linkage-controls`);
        let warningEl = document.getElementById(`${prefix}-search-warning`);
        if (inputEl) inputEl.value = '';
        if (suggestionsEl) suggestionsEl.innerHTML = '';
        if (linkageEl) linkageEl.innerHTML = '';
        if (warningEl) warningEl.style.display = 'none';
    });
    setTimeout(() => { blockSearchInputEvent = false; }, 50);
}

function updateUI() {
    const species = document.getElementById("species").value;
    const ui = document.getElementById("calculator-ui");
    const btn = document.getElementById("calc-btn");
    const rBtn = document.getElementById("reset-btn");
    const symToggleWrap = document.getElementById("symbol-toggle-wrap");
    const symToggleBtn2 = document.getElementById("toggle-symbols-btn-2");
    const results = document.getElementById("results-container");

    const sireSearch = document.getElementById("sire-search-container");
    const damSearch = document.getElementById("dam-search-container");
    const mobileHub = document.getElementById("mobile-unified-search-hub");

    if (species === "none") {
        ui.style.display = "none"; btn.style.display = "none"; rBtn.style.display = "none";
        if (symToggleWrap) symToggleWrap.style.display = "none";
        if (symToggleBtn2) symToggleBtn2.style.display = "none";
        results.style.display = "none";
        
        if (sireSearch) sireSearch.style.display = "none";
        if (damSearch) damSearch.style.display = "none";
        if (mobileHub) mobileHub.classList.remove("is-active"); 
        
        resetSearchEngine();
        renderLivePreview();
        return;
    }
    
    ui.style.display = "flex"; btn.style.display = "inline-block"; rBtn.style.display = "inline-block";
    if (symToggleWrap) symToggleWrap.style.display = "block";
    if (symToggleBtn2) symToggleBtn2.style.display = "inline-block";
    results.style.display = "none";
    
    if (sireSearch) sireSearch.style.display = "block";
    if (damSearch) damSearch.style.display = "block";
    if (mobileHub) mobileHub.classList.add("is-active"); 

    resetSearchEngine();
    
    renderBird("sire-categories", species, "male");
    renderBird("dam-categories", species, "female");
    renderLivePreview();
}
let geneticSymbolsHidden = true;
const dnaSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="button-icon" style="margin-right: 6px; vertical-align: -4px;"><path d="M2 15c6.667-6 13.333 0 20-6"/><path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993"/><path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993"/><path d="m17 6-2.5-2.5"/><path d="m14 8-1-1"/><path d="m7 18 2.5 2.5"/><path d="m3.5 14.5.5.5"/><path d="m20 9 .5.5"/><path d="m10 16 1 1"/></svg>`;

function toggleGeneticSymbols() {
    geneticSymbolsHidden = !geneticSymbolsHidden;
    document.body.classList.toggle("hide-genetic-symbols", geneticSymbolsHidden);
    const label = geneticSymbolsHidden ? "Show Genetic Symbols" : "Hide Genetic Symbols";
    document.querySelectorAll(".js-toggle-symbols-btn").forEach(btn => { 
        btn.innerHTML = dnaSvg + label; 
    });
}

// Ensure the DNA icon appears on all existing buttons instantly when the page loads
document.addEventListener("DOMContentLoaded", () => {
    const label = geneticSymbolsHidden ? "Show Genetic Symbols" : "Hide Genetic Symbols";
    document.querySelectorAll(".js-toggle-symbols-btn").forEach(btn => { 
        btn.innerHTML = dnaSvg + label; 
    });
});

function resetCalculator() {
    document.querySelectorAll('.mutation-item input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
        let itemDiv = cb.closest('.mutation-item');
        itemDiv.classList.remove('active');
        itemDiv.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
    });
    document.getElementById("results-container").style.display = "none";
    clearValidationReminder();
    handleConstraints('sire-categories', 'male');
    handleConstraints('dam-categories', 'female');

    ['sire-auto-select', 'dam-auto-select'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.checked = true;
    });
    resetSearchEngine();
    renderLivePreview();
}

function findMissingSelections(containerId, sex) {
    const container = document.getElementById(containerId);
    const missing = [];
    if (!container) return missing;
    container.querySelectorAll('.mutation-item.active').forEach(item => {
        const cb = item.querySelector('input[type="checkbox"]');
        const mut = mutationDB.find(m => m.id === cb.dataset.id);
        if (!mut) return;
        const primaryChecked = item.querySelector(`input[type="radio"][name="${sex}_${mut.id}"]:checked`);
        if (!primaryChecked) missing.push(mut.name);
    });
    return missing;
}

function showValidationReminder(needsSpecies, missingSire, missingDam) {
    const el = document.getElementById("validation-reminder");
    if (!el) return;
    const lines = [];
    if (needsSpecies) lines.push("Select a species before generating results.");
    if (missingSire.length) lines.push(`Sire: finish selecting Split/Visual for ${missingSire.join(", ")}.`);
    if (missingDam.length) lines.push(`Dam: finish selecting Split/Visual for ${missingDam.join(", ")}.`);
    el.innerHTML = `<strong>Before you can generate results:</strong><br>${lines.join("<br>")}`;
    el.style.display = "flex";
    el.scrollIntoView({ behavior: "smooth", block: "center" });
}

function clearValidationReminder() {
    const el = document.getElementById("validation-reminder");
    if (el) { el.style.display = "none"; el.innerHTML = ""; }
}

function toggleMutation(checkbox, containerId, sex) {
    const itemDiv = checkbox.closest('.mutation-item');
    if (checkbox.checked) {
        itemDiv.classList.add('active');
        const mut = mutationDB.find(m => m.id === checkbox.dataset.id);
        const defaultVal = ["AD", "AID", "SLID", "SLD"].includes(mut.type) ? "1" : "2";
        const radio = itemDiv.querySelector(`input[type="radio"][value="${defaultVal}"]`) || itemDiv.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
    } else {
        itemDiv.classList.remove('active');
        itemDiv.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
    }
    handleConstraints(containerId, sex);
}

function handleConstraints(containerId, sex) {
    clearValidationReminder();
    const container = document.getElementById(containerId);
    for (const [locus, mutIds] of Object.entries(lociGroups)) {
        let activeId = null;
        mutIds.forEach(id => {
            const cb = container.querySelector(`input[data-id="${id}"]`);
            if (cb && cb.checked) activeId = id;
        });
        mutIds.forEach(id => {
            const cb = container.querySelector(`input[data-id="${id}"]`);
            if (!cb) return;
            cb.disabled = (activeId !== null && id !== activeId);
            cb.closest('label').style.opacity = cb.disabled ? '0.5' : '1';
        });
    }

    container.querySelectorAll('.mutation-item.active').forEach(item => {
        const mut = mutationDB.find(m => m.id === item.querySelector('input[type="checkbox"]').dataset.id);
        if (mut.type.includes("SL") && sex === "male") {
            const zAssign = item.querySelector('.z-assign');
            if (zAssign) zAssign.style.display = (item.querySelector('input[value="1"]:checked')) ? "flex" : "none";
        }
        if (mut.id === "dark_factor") {
            const blSplit = container.querySelectorAll('.mutation-item.active input[data-id^="blue1"], .mutation-item.active input[data-id^="blue2"], .mutation-item.active input[data-id^="aqua"], .mutation-item.active input[data-id^="turquoise"], .mutation-item.active input[data-id^="rose_blue"], .mutation-item.active input[data-id="sapphire"]');
            let blSplitActive = false;
            let blVisActive = false;
            blSplit.forEach(el => {
                if (el.closest('.mutation-item').querySelector('input[value="1"]:checked')) blSplitActive = true;
                if (el.closest('.mutation-item').querySelector('input[value="2"]:checked')) blVisActive = true;
            });
            const tAssign = item.querySelector('.t-assign');
            if (tAssign) {
                tAssign.style.display = (item.querySelector('input[value="1"]:checked') && blSplitActive && !blVisActive) ? "flex" : "none";
            }
        }
    });
}

function renderBird(containerId, species, sex) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    categoriesOrder.forEach((catName, index) => {
        const catNum = index + 1;
        const validMuts = mutationDB.filter(mut => mut.cat === catNum && mut.sp[species]);

        if (validMuts.length > 0) {
            let catHTML = `<details class="category"${index === 0 ? " open" : ""}><summary class="category-title">${catName}</summary>`;
            let groupedByMOI = {};

            validMuts.forEach(mut => {
                if (sex === "female" && mut.isCompound && mut.type === "SLR") return;
                if (!groupedByMOI[mut.type]) groupedByMOI[mut.type] = {};
                let groupName = mut.locusGroup || "default";
                if (!groupedByMOI[mut.type][groupName]) groupedByMOI[mut.type][groupName] = [];
                groupedByMOI[mut.type][groupName].push(mut);
            });

            const sortedMOI = Object.keys(groupedByMOI).sort((a, b) =>
                ["AR", "AID", "AD", "SLR", "SLID", "SLD"].indexOf(a) - ["AR", "AID", "AD", "SLR", "SLID", "SLD"].indexOf(b)
            );

            sortedMOI.forEach(type => {
                let locusGroupsObj = groupedByMOI[type];
                catHTML += `<ul><div class="moi-subtitle">&middot; ${moiLabels[type] || type}</div>`;

                const sortedLocus = Object.keys(locusGroupsObj).sort((a, b) => {
                    if (a === "default") return -1;
                    if (b === "default") return 1;
                    if (a === "Independent Loci") return 1;
                    if (b === "Independent Loci") return -1;
                    const getBaseLocus = (name) => {
                        if (name === "Sapphire") return "bl-locus";
                        if (name.includes("of ")) return name.split("of ")[1];
                        return name;
                    };
                    const rank = (name) => {
                        if (name.startsWith("Multiple Alleles")) return 1;
                        if (name.startsWith("Allelic Compounds")) return 2;
                        if (name === "Sapphire") return 3;
                        return 4;
                    };
                    let baseA = getBaseLocus(a);
                    let baseB = getBaseLocus(b);
                    if (baseA !== baseB) return baseA.localeCompare(baseB);
                    let rankA = rank(a);
                    let rankB = rank(b);
                    if (rankA !== rankB) return rankA - rankB;
                    return a.localeCompare(b);
                });

                sortedLocus.forEach(locusGroup => {
                    let muts = locusGroupsObj[locusGroup];
                    const isNested = locusGroup !== "default";
                    let groupHTML = "";

                    muts.forEach(mut => {
                        const inputName = `${sex}_${mut.id}`;
                        const nestedClass = isNested ? "locus-nested" : "";

                        let geneButtons = "";
                        
                        if (mut.isCompound) {
                            geneButtons = `<label><input type="radio" name="${inputName}" value="2" onchange="handleConstraints('${containerId}', '${sex}')"> <span>Visual</span></label>`;
                        } else if (mut.id === "dark_factor") {
                            geneButtons = `<label><input type="radio" name="${inputName}" value="1" onchange="handleConstraints('${containerId}', '${sex}')"> <span>D</span></label><label><input type="radio" name="${inputName}" value="2" onchange="handleConstraints('${containerId}', '${sex}')"> <span>DD</span></label><div class="t-assign"><div class="linkage-row"><span class="linkage-label">Phase:</span><label><input type="radio" name="${inputName}_t" value="T1" checked> T1</label><label><input type="radio" name="${inputName}_t" value="T2"> T2</label></div><div class="linkage-hint">Note on Dark Factor Linkage: <strong>T1</strong> = Dark factor linked to green/wildtype chromosome (Type 1). <strong>T2</strong> = Dark factor linked to blue mutant chromosome (Type 2). This affects breeding outcomes when paired with blue-series birds.</div></div>`;
                        } else if (mut.type === "AR") {
                            geneButtons = `<label><input type="radio" name="${inputName}" value="1" onchange="handleConstraints('${containerId}', '${sex}')"> <span>Split</span></label><label><input type="radio" name="${inputName}" value="2" onchange="handleConstraints('${containerId}', '${sex}')"> <span>Visual</span></label>`;
                        } else if (mut.type.includes("SL")) {
                            if (sex === "male") {
                                let lbl1 = mut.type === "SLR" ? "Split" : "SF";
                                let lbl2 = mut.type === "SLR" ? "Visual" : "DF";
                                geneButtons = `<label><input type="radio" name="${inputName}" value="1" onchange="handleConstraints('${containerId}', '${sex}')"> <span>${lbl1}</span></label><label><input type="radio" name="${inputName}" value="2" onchange="handleConstraints('${containerId}', '${sex}')"> <span>${lbl2}</span></label>`;
                                
                                if (mut.type === "SLR") {
                                    geneButtons += `<div class="z-assign"><div class="linkage-row"><span class="linkage-label">Assign to:</span><label><input type="radio" name="${inputName}_z" value="z1" checked> Z1</label><label><input type="radio" name="${inputName}_z" value="z2"> Z2</label></div><div class="linkage-hint">Z Chromosome Note: In males, each Z chromosome can carry different mutations. Placing two SL recessive mutations on the same Z (e.g., <strong>both on Z1</strong>) is required to create crossover phenotypes like <strong>opaline-SL ino</strong>, <strong>opaline-cinnamon</strong>, etc.</div></div>`;
                                } else {
                                    geneButtons += `<div class="z-assign"><div class="linkage-row"><span class="linkage-label">Assign to:</span><label><input type="radio" name="${inputName}_z" value="z1" checked> Z1</label><label><input type="radio" name="${inputName}_z" value="z2"> Z2</label></div></div>`;
                                }
                            } else {
                                let lbl = (mut.type === "SLID" || mut.type === "SLD") ? "SF" : "Visual";
                                geneButtons = `<label><input type="radio" name="${inputName}" value="1" onchange="handleConstraints('${containerId}', '${sex}')"> <span>${lbl}</span></label>`;
                            }
                        } else {
                            geneButtons = `<label><input type="radio" name="${inputName}" value="1" onchange="handleConstraints('${containerId}', '${sex}')"> <span>SF</span></label><label><input type="radio" name="${inputName}" value="2" onchange="handleConstraints('${containerId}', '${sex}')"> <span>DF</span></label>`;
                        }

                        groupHTML += `
                            <div class="mutation-item ${nestedClass}">
                                <label class="mutation-label"><input type="checkbox" data-id="${mut.id}" onchange="toggleMutation(this, '${containerId}', '${sex}')"><div class="mutation-columns"><div class="symbol-col">${renderFormat(mut.symbol)}</div><div class="name-col">${mut.selector_label || mut.name}</div></div></label>
                                <div class="gene-options"><div class="gene-btn-group">${geneButtons}</div></div>
                                ${mut.warningNote ? `<div class="mutation-warning-note">${mut.warningNote}</div>` : ""}
                                ${mut.note ? `<div class="mutation-note">${mut.note}</div>` : ""}
                                ${mut.infoNote ? `<div class="mutation-info-note">${mut.infoNote}</div>` : ""}
                            </div>`;
                    });

                    if (locusGroup === "Sapphire") {
                        groupHTML += `<div class="mutation-warning-note">Sapphire is not a separate mutation. It's the result of blue1 and blue2 recombining onto one chromosome during egg or sperm formation — a crossing-over event, not a new gene. This combined chromosome is called blue1-blue2. Sapphire, SapphireBlue1, SapphireBlue2 and AquaSapphire are all birds carrying this recombinant chromosome.</div>`;
                    }

                    if (isNested) {
                        const defaultClosed = locusGroup === "Sapphire" || locusGroup.startsWith("Allelic Compounds");
                        catHTML += `<details class="locus-group"${defaultClosed ? "" : " open"}><summary class="locus-subtitle">${locusGroup}:</summary>${groupHTML}</details>`;
                    } else {
                        catHTML += groupHTML;
                    }
                });
                catHTML += `</ul>`;
            });
            catHTML += `</details>`;
            container.innerHTML += catHTML;
        }
    });
    handleConstraints(containerId, sex);
}

function parseState(containerId, isMale) {
    const container = document.getElementById(containerId);
    const active = container.querySelectorAll('.mutation-item.active');
    const autoGenes = {}, z1 = [], z2 = [];
    let splitCount = 0, dfPhase = null;
    active.forEach(item => {
        const cb = item.querySelector('input[type="checkbox"]');
        const mut = mutationDB.find(m => m.id === cb.dataset.id);
        const geneVal = parseInt(item.querySelector('input[type="radio"]:checked').value);
        if (mut.type.includes("SL")) {
            if (isMale) {
                if (mut.isCompound) { mut.alleles.forEach((a, i) => i === 0 ? z1.push(a) : z2.push(a)); }
                else if (geneVal === 2) mut.alleles.forEach(a => { z1.push(a); z2.push(a); });
                else {
                    const zRadio = item.querySelector(`input[name="male_${mut.id}_z"]:checked`);
                    (zRadio?.value === "z1" || (!zRadio && splitCount++ % 2 === 0)) ? mut.alleles.forEach(a => z1.push(a)) : mut.alleles.forEach(a => z2.push(a));
                }
            } else mut.alleles.forEach(a => z1.push(a));
        } else {
            let locus = mut.locus;
            if (!autoGenes[locus]) autoGenes[locus] = [];
            if (mut.isCompound) {
                autoGenes[locus].push(mut.alleles[0], mut.alleles[1]);
            } else if (geneVal === 2) {
                autoGenes[locus].push(mut.alleles[0], mut.alleles[0]);
            } else {
                autoGenes[locus].push(mut.alleles[0], "+");
            }
            if (mut.id === "dark_factor" && geneVal === 1) {
                const tRadio = item.querySelector(`input[name="${isMale ? 'male' : 'female'}_dark_factor_t"]:checked`);
                if(tRadio) dfPhase = tRadio.value;
            }
        }
    });

    let isDFHetero = autoGenes['dark_factor'] && autoGenes['dark_factor'][0] !== autoGenes['dark_factor'][1];
    let blMutants = autoGenes['bl'] ? autoGenes['bl'].filter(a => a !== "+") : [];
    if (!isDFHetero || blMutants.length !== 1) dfPhase = null;
    else if (isDFHetero && blMutants.length === 1 && !dfPhase) dfPhase = "T1"; 

    return { z1, z2, autoGenes, dfPhase };
}

function generateZGametesMale(z1, z2) {
    let chrom1 = zMapOrder.map(l => z1.find(a => mutationDB.find(m => m.id === a)?.locus === l) || "+");
    let chrom2 = zMapOrder.map(l => z2.find(a => mutationDB.find(m => m.id === a)?.locus === l) || "+");
    if (JSON.stringify(chrom1) === JSON.stringify(chrom2)) return [{ chr: 'Z', genes: chrom1.filter(a => a !== "+"), prob: 1.0 }];
    let gametes = [], perms = 1 << zMapOrder.length;
    for (let i = 0; i < perms; i++) {
        let genes = [], p = 1.0;
        for (let j = 0; j < zMapOrder.length; j++) {
            let from2 = (i & (1 << j)) !== 0;
            genes.push(from2 ? chrom2[j] : chrom1[j]);
            if (j > 0) {
                let cross = from2 !== ((i & (1 << (j - 1))) !== 0);
                let link = linkageDB.find(x => x.loci.includes(zMapOrder[j - 1]) && x.loci.includes(zMapOrder[j]));
                p *= cross ? (link ? link.recombination : 0.5) : (link ? (1 - link.recombination) : 0.5);
            }
        }
        gametes.push({ genes: genes.filter(a => a !== "+"), prob: p / 2 });
    }
    let condensed = {};
    gametes.forEach(g => { let k = g.genes.sort().join("_"); if (!condensed[k]) condensed[k] = { genes: g.genes, prob: 0 }; condensed[k].prob += g.prob; });
    return Object.values(condensed).filter(g => g.prob > 0);
}

function generateAutosomalGametes(autoGenes, dfPhase) {
    let pool = [{ genes: {}, prob: 1.0 }];
    let loci = Object.keys(autoGenes);
    let isDfHet = autoGenes['dark_factor'] && autoGenes['dark_factor'][0] !== autoGenes['dark_factor'][1];
    let blMutants = autoGenes['bl'] ? autoGenes['bl'].filter(a => a !== "+") : [];
    let hasLinkedDF_BL = dfPhase && isDfHet && blMutants.length === 1;

    if (hasLinkedDF_BL) {
        loci = loci.filter(l => l !== 'dark_factor' && l !== 'bl');
        let df_mut = autoGenes['dark_factor'].find(a => a !== "+");
        let bl_mut = blMutants[0];
        
        let p1 = dfPhase === "T1" ? [{ 'dark_factor': df_mut, 'bl': "+" }, { 'dark_factor': "+", 'bl': bl_mut }] : [{ 'dark_factor': df_mut, 'bl': bl_mut }, { 'dark_factor': "+", 'bl': "+" }];
        let r1 = dfPhase === "T1" ? [{ 'dark_factor': df_mut, 'bl': bl_mut }, { 'dark_factor': "+", 'bl': "+" }] : [{ 'dark_factor': df_mut, 'bl': "+" }, { 'dark_factor': "+", 'bl': bl_mut }];
        let next = [];
        pool.forEach(g => {
            p1.forEach(set => next.push({ genes: { ...g.genes, ...set }, prob: g.prob * 0.43 }));
            r1.forEach(set => next.push({ genes: { ...g.genes, ...set }, prob: g.prob * 0.07 }));
        });
        pool = next;
    }
    loci.forEach(l => {
        let next = [];
        pool.forEach(g => { next.push({ genes: { ...g.genes, [l]: autoGenes[l][0] }, prob: g.prob * 0.5 }); next.push({ genes: { ...g.genes, [l]: autoGenes[l][1] }, prob: g.prob * 0.5 }); });
        pool = next;
    });
    return pool;
}

function capitalizeFirst(str) {
    if (!str) return str;
    if (str.startsWith('*')) {
        if (str.length > 1) return '*' + str.charAt(1).toUpperCase() + str.slice(2);
        return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function getWTSymbol(locus) {
    const mapping = { "bl": "bl^{+}", "a": "a^{+}", "ino": "ino^{+}", "dilute": "dil^{+}" };
    if (mapping[locus]) return mapping[locus];
    let mut = mutationDB.find(m => m.locus === locus);
    if (mut && mut.symbol) return mut.symbol.split('^')[0].split('_')[0] + "^{+}";
    return "+";
}

function formatSymbol(alleles, locus) {
    let wt = getWTSymbol(locus);
    if (alleles[0] === "+" && alleles[1] === "+") return `${wt}/${wt}`;
    let sortedAlleles = [...alleles];
    if (sortedAlleles.includes("cis_bl1_bl2")) {
        sortedAlleles.sort((a, b) => a === "cis_bl1_bl2" ? -1 : (b === "cis_bl1_bl2" ? 1 : a.localeCompare(b)));
    } else {
        sortedAlleles.sort();
    }
    let a1 = sortedAlleles[0] === "+" ? wt : (sortedAlleles[0] === "cis_bl1_bl2" ? "bl^{1}_bl^{2}" : (mutationDB.find(x => x.id === sortedAlleles[0])?.symbol || "+"));
    let a2 = sortedAlleles[1] === "+" ? wt : (sortedAlleles[1] === "cis_bl1_bl2" ? "bl^{1}_bl^{2}" : (mutationDB.find(x => x.id === sortedAlleles[1])?.symbol || "+"));

    if (sortedAlleles.includes("cis_bl1_bl2")) {
        if (a1 === "bl^{1}") a1 = "bl^{1}_bl^{+}";
        if (a1 === "bl^{2}") a1 = "bl^{+}_bl^{2}";
        if (a1 === "bl^{aq}") a1 = "bl^{aq}_bl^{+}";
        if (a2 === "bl^{1}") a2 = "bl^{1}_bl^{+}";
        if (a2 === "bl^{2}") a2 = "bl^{+}_bl^{2}";
        if (a2 === "bl^{aq}") a2 = "bl^{aq}_bl^{+}";
    }
    return `${a1}/${a2}`;
}

function renderFormat(str) {
    return str.replace(/\//g, "/<wbr>").replace(/\^\{(.*?)\}/g, "<sup>$1</sup>").replace(/_\{(.*?)\}/g, "<sub>$1</sub>");
}

function buildLinkedBlDfSymbol(bl_c1, df_c1, bl_c2, df_c2) {
    function sym(id, locus) {
        if (id === "+") return getWTSymbol(locus);
        if (id === "cis_bl1_bl2") return "bl^{1}_bl^{2}";
        const m = mutationDB.find(x => x.id === id);
        return m ? m.symbol : "+";
    }
    let c1_prefix = sym(bl_c1, "bl");
    let c2_prefix = sym(bl_c2, "bl");

    if (bl_c1 === "cis_bl1_bl2" || bl_c2 === "cis_bl1_bl2") {
        if (bl_c1 === "blue1") c1_prefix = "bl^{1}_bl^{+}";
        if (bl_c1 === "blue2") c1_prefix = "bl^{+}_bl^{2}";
        if (bl_c1 === "aqua") c1_prefix = "bl^{aq}_bl^{+}";
        if (bl_c2 === "blue1") c2_prefix = "bl^{1}_bl^{+}";
        if (bl_c2 === "blue2") c2_prefix = "bl^{+}_bl^{2}";
        if (bl_c2 === "aqua") c2_prefix = "bl^{aq}_bl^{+}";
    }

    const chrom1 = `${c1_prefix}_${sym(df_c1, "dark_factor")}`;
    const chrom2 = `${c2_prefix}_${sym(df_c2, "dark_factor")}`;
    let arr = [chrom1, chrom2];
    arr.sort((a, b) => {
        if (a.includes("bl^{1}_bl^{2}") && !b.includes("bl^{1}_bl^{2}")) return -1;
        if (b.includes("bl^{1}_bl^{2}") && !a.includes("bl^{1}_bl^{2}")) return 1;
        return a.localeCompare(b);
    });
    const [a, b] = arr;
    return `${a}/${b}`;
}

function getParentBlDfChromosomes(autoGenes, dfPhase) {
    const dfAlleles = autoGenes['dark_factor'] || ["+", "+"];
    const blAlleles = autoGenes['bl'] || ["+", "+"];
    const dfMut = dfAlleles.find(a => a !== "+");
    const blMutants = blAlleles.filter(a => a !== "+");

    if (dfPhase && dfMut && blMutants.length === 1) {
        const blMut = blMutants[0];
        if (dfPhase === "T1") {
            return { df_c1: dfMut, bl_c1: "+", df_c2: "+", bl_c2: blMut };
        }
        return { df_c1: dfMut, bl_c1: blMut, df_c2: "+", bl_c2: "+" };
    }
    return { df_c1: dfAlleles[0] ?? "+", bl_c1: blAlleles[0] ?? "+", df_c2: dfAlleles[1] ?? "+", bl_c2: blAlleles[1] ?? "+" };
}

function translatePhenotype(z1, z2, auto, sex, indPhase, hasSL, offspringMode, blDfBlock) {
    let visualTraits = [];
    let splitTraits = [];
    let symbolParts = [];
    let expressedIDs = [];

    const orderedLoci = Object.keys(auto).sort((a, b) => {
        const repA = mutationDB.find(m => m.locus === a);
        const repB = mutationDB.find(m => m.locus === b);
        return nameRank(repA ? repA.cat : 99) - nameRank(repB ? repB.cat : 99);
    });

    orderedLoci.forEach(locus => {
        let alleles = [...auto[locus]];
        if (alleles.includes("cis_bl1_bl2")) {
            alleles.sort((a, b) => a === "cis_bl1_bl2" ? -1 : (b === "cis_bl1_bl2" ? 1 : a.localeCompare(b)));
        } else {
            alleles.sort();
        }
        
        if (!(blDfBlock && (locus === "bl" || locus === "dark_factor"))) {
            symbolParts.push(formatSymbol(alleles, locus));
        }

        if (alleles[0] === "+" && alleles[1] === "+") return;

        if (alleles[0] === alleles[1]) {
            let m = mutationDB.find(x => x.id === alleles[0] && !x.isCompound);
            if (!m && alleles[0] === "cis_bl1_bl2") m = mutationDB.find(x => x.id === "sapphire");
            if (m) {
                visualTraits.push({ ...m, zygosity: ["AID", "AD"].includes(m.type) ? "DF" : "VISUAL" });
                expressedIDs.push(m.id);
            }
        } else if (alleles[0] === "+" || alleles[1] === "+") {
            let mutId = alleles[0] !== "+" ? alleles[0] : alleles[1];
            let m = mutationDB.find(x => x.id === mutId && !x.isCompound);
            if (!m && mutId === "cis_bl1_bl2") m = mutationDB.find(x => x.id === "sapphire");
            if (m) {
                if (["AID", "AD"].includes(m.type)) {
                    visualTraits.push({ ...m, zygosity: "SF" }); expressedIDs.push(m.id);
                } else {
                    splitTraits.push(m);
                }
            }
        } else {
            let comp = mutationDB.find(x => x.isCompound && x.alleles.includes(alleles[0]) && x.alleles.includes(alleles[1]));
            if (comp) {
                visualTraits.push({ ...comp, zygosity: "VISUAL" }); expressedIDs.push(comp.id);
            } else {
                let m1 = mutationDB.find(x => x.id === alleles[0]);
                let m2 = mutationDB.find(x => x.id === alleles[1]);
                if (m1 && m2) {
                    visualTraits.push({ ...m1, customName: `${m1.result_label || m1.name}-${m2.result_label || m2.name}` });
                    expressedIDs.push(m1.id, m2.id);
                }
            }
        }
    });

    if (blDfBlock) {
        symbolParts.unshift(blDfBlock);
    }

    const getZSymbol = (zArr, otherZArr = []) => {
        const combinedLoci = [...new Set([...zArr, ...otherZArr]
            .map(id => mutationDB.find(m => m.id === id)?.locus)
            .filter(Boolean))];
        if (combinedLoci.length === 0) return "Z^{+}";
        const sortedLoci = combinedLoci.sort((a, b) => {
            const order = offspringMode ? zNamingOrder : zMapOrder;
            return order.indexOf(a) - order.indexOf(b);
        });
        const syms = sortedLoci.map(locus => {
            const id = zArr.find(a => mutationDB.find(m => m.id === a)?.locus === locus);
            return id ? mutationDB.find(x => x.id === id).symbol : getWTSymbol(locus);
        });
        return "Z " + syms.join("_");
    };

    if (hasSL) {
        if (sex === "female") {
            symbolParts.push(`${getZSymbol(z1)}/W`);
        } else {
            symbolParts.push(`${getZSymbol(z1, z2)}/${getZSymbol(z2, z1)}`);
        }
    }

    if (sex === "female") {
        z1.forEach(id => {
            let m = mutationDB.find(x => x.id === id);
            if (m) { 
                let zygosity = (m.type === "SLID" || m.type === "SLD") ? "SF" : "VISUAL";
                visualTraits.push({ ...m, zygosity: zygosity }); 
                expressedIDs.push(m.id); 
            }
        });
    } else {
        let filteredZ1 = [...z1];
        let filteredZ2 = [...z2];

        const slCompounds = mutationDB.filter(m => m.type === "SLR" && m.isCompound);
        for (let comp of slCompounds) {
            if ((filteredZ1.includes(comp.alleles[0]) && filteredZ2.includes(comp.alleles[1])) ||
                (filteredZ1.includes(comp.alleles[1]) && filteredZ2.includes(comp.alleles[0]))) {
                visualTraits.push({ ...comp, zygosity: "VISUAL" });
                expressedIDs.push(comp.id);
                filteredZ1 = filteredZ1.filter(id => id !== comp.alleles[0] && id !== comp.alleles[1]);
                filteredZ2 = filteredZ2.filter(id => id !== comp.alleles[0] && id !== comp.alleles[1]);
            }
        }

        const allZ = [...new Set([...filteredZ1, ...filteredZ2])];
        allZ.forEach(id => {
            let m = mutationDB.find(x => x.id === id);
            if (!m) return;
            if (filteredZ1.includes(id) && filteredZ2.includes(id)) {
                visualTraits.push({ ...m, zygosity: (m.type.includes("ID") || m.type.includes("AD") || m.type.includes("SLD")) ? "DF" : "VISUAL" });
                expressedIDs.push(m.id);
            } else if (m.type.includes("ID") || m.type.includes("AD") || m.type.includes("SLD")) {
                visualTraits.push({ ...m, zygosity: "SF" });
                expressedIDs.push(m.id);
            } else {
                const zKey = filteredZ1.includes(id) ? "z1" : "z2";
                splitTraits.push({ ...m, zKey });
            }
        });
    }

    let finalWords = [];
    let modifiers = visualTraits.filter(m => m.cat > 1).sort((a, b) => nameRank(a.cat) - nameRank(b.cat));
    let baseColorMuts = visualTraits.filter(m => m.cat === 1);

    function formatModWord(m) {
        let pName = m.customName ? m.customName : (m.result_label || m.name);
        if (m.id === "dark_factor") return m.zygosity === "DF" ? "DD" : "D";
        if (m.zygosity === "SF" || m.zygosity === "DF") return `${m.zygosity} ${pName}`;
        return pName;
    }

    let zLinkedMods = modifiers.filter(m => m.type === "SLR" || m.type === "SLID" || m.type === "SLD");
    let otherMods = modifiers.filter(m => !(m.type === "SLR" || m.type === "SLID" || m.type === "SLD"));
    let outputUnits = otherMods.map(m => ({ rank: nameRank(m.cat), text: formatModWord(m) }));

    if (zLinkedMods.length > 0) {
        zLinkedMods.sort((a, b) => {
            let idxA = zNamingOrder.indexOf(a.locus);
            let idxB = zNamingOrder.indexOf(b.locus);
            if(idxA === -1) idxA = 99;
            if(idxB === -1) idxB = 99;
            return idxA - idxB;
        });
        const zRank = Math.min(...zLinkedMods.map(m => nameRank(m.cat)));
        outputUnits.push({ rank: zRank, text: zLinkedMods.map(formatModWord).join("-") });
    }

    outputUnits.sort((a, b) => a.rank - b.rank);
    outputUnits.forEach(u => finalWords.push(u.text));

    let baseName = baseColorMuts.length > 0 ? baseColorMuts.map(m => m.result_label || m.name).join(" ") : "green";
    finalWords.push(baseName);

    let finalName = finalWords.join(" ");
    finalName = capitalizeFirst(finalName);

    function phaseSuffix() {
        if (!indPhase) return "";
        return indPhase === "T1" ? " type 1" : (indPhase === "T2" ? " type 2" : " " + indPhase);
    }

    if (splitTraits.length > 0) {
        splitTraits.sort((a, b) => nameRank(a.cat) - nameRank(b.cat));
        const zGroups = {};
        const zOrder = [];
        const splitUnits = [];

        splitTraits.forEach(m => {
            if (m.zKey) {
                if (!zGroups[m.zKey]) { zGroups[m.zKey] = []; zOrder.push(m.zKey); }
                zGroups[m.zKey].push(m);
            } else {
                const suffix = m.locus === "bl" ? phaseSuffix() : "";
                splitUnits.push((m.result_label || m.name) + suffix);
            }
        });
        
        zOrder.forEach(k => {
            zGroups[k].sort((a, b) => {
                let idxA = zNamingOrder.indexOf(a.locus);
                let idxB = zNamingOrder.indexOf(b.locus);
                if(idxA === -1) idxA = 99;
                if(idxB === -1) idxB = 99;
                return idxA - idxB;
            });
            splitUnits.push(zGroups[k].map(m => m.result_label || m.name).join("-"));
        });

        finalName += "/" + splitUnits.join("/");
    }

    if (hasSL) finalName += ` (${sex})`;

    return { symbol: renderFormat(symbolParts.join("; ")), name: finalName, expressedIDs: expressedIDs, splitIDs: splitTraits.map(m => m.id) };
}

function computeParentsPhenotypes() {
    const sire = parseState("sire-categories", true);
    const dam = parseState("dam-categories", false);
    const hasSL = sire.z1.length > 0 || sire.z2.length > 0 || dam.z1.length > 0;

    let sIndPhase = null, dIndPhase = null;
    let sBlHets = sire.autoGenes['bl'] ? sire.autoGenes['bl'].filter(a => a !== "+") : [];
    if (sire.dfPhase && sBlHets.length === 1) sIndPhase = sire.dfPhase;
    let dBlHets = dam.autoGenes['bl'] ? dam.autoGenes['bl'].filter(a => a !== "+") : [];
    if (dam.dfPhase && dBlHets.length === 1) dIndPhase = dam.dfPhase;

    const sireBlDfChr = getParentBlDfChromosomes(sire.autoGenes, sire.dfPhase);
    const sireBlDfBlock = buildLinkedBlDfSymbol(sireBlDfChr.bl_c1, sireBlDfChr.df_c1, sireBlDfChr.bl_c2, sireBlDfChr.df_c2);
    const damBlDfChr = getParentBlDfChromosomes(dam.autoGenes, dam.dfPhase);
    const damBlDfBlock = buildLinkedBlDfSymbol(damBlDfChr.bl_c1, damBlDfChr.df_c1, damBlDfChr.bl_c2, damBlDfChr.df_c2);

    const sirePheno = translatePhenotype(sire.z1, sire.z2, sire.autoGenes, "male", sIndPhase, true, false, sireBlDfBlock);
    const damPheno = translatePhenotype(dam.z1, [], dam.autoGenes, "female", dIndPhase, true, false, damBlDfBlock);

    const sireName = sirePheno.name.replace(" (male)", "");
    const damName = damPheno.name.replace(" (female)", "");

    return { sire, dam, hasSL, sirePheno, damPheno, sireName, damName };
}

// Modify the signature to include pairingWarnings
function buildParentsTableHTML(sireName, sireSymbol, damName, damSymbol, sireWarnings = [], damWarnings = [], pairingWarnings = []) {
    // We are putting the actual table HTML back here instead of the "..." placeholder
    let html = `
        <div class="parents-heading">Parents</div>
        <table class="parents-table">
            <thead><tr><th>Genotype / Mutation Name</th><th class="col-genetic-formula">Genetic Formulas</th></tr></thead>
            <tbody>
                <tr><td><strong>1.0 Sire (Male):</strong> ${sireName}</td><td class="genetic-formula col-genetic-formula">${sireSymbol}</td></tr>
                <tr><td><strong>0.1 Dam (Female):</strong> ${damName}</td><td class="genetic-formula col-genetic-formula">${damSymbol}</td></tr>
            </tbody>
        </table>`;
        
    if (sireWarnings.length > 0 || damWarnings.length > 0 || pairingWarnings.length > 0) {
        html += `<div style="margin-top: 15px;">`;
        sireWarnings.forEach(w => {
            html += `<div class="mutation-warning-note" style="margin-left:0;"><strong>Sire Warning:</strong> ${w}</div>`;
        });
        damWarnings.forEach(w => {
            html += `<div class="mutation-warning-note" style="margin-left:0;"><strong>Dam Warning:</strong> ${w}</div>`;
        });
        // Inject Pairing Warnings
        pairingWarnings.forEach(w => {
            html += `<div class="mutation-warning-note" style="margin-left:0;"><strong>Pairing Warning:</strong> ${w}</div>`;
        });
        html += `</div>`;
    }
    
    return html;
}

function renderLivePreview() {
    const speciesEl = document.getElementById("species");
    const speciesVal = speciesEl ? speciesEl.value : "none";
    const desktopBody = document.getElementById("live-preview-body");
    const mobileBody = document.getElementById("mobile-preview-body");
    const mobileNames = document.getElementById("mobile-preview-compact-names");

    if (speciesVal === "none") {
        if (desktopBody) desktopBody.innerHTML = `<p class="live-preview-empty"></p>`;
        if (mobileBody) mobileBody.innerHTML = `<p class="live-preview-empty"></p>`;
        if (mobileNames) mobileNames.textContent = "";
        updateMobileBarVisibility();
        return;
    }

    let data;
    try {
        data = computeParentsPhenotypes();
        const hasAxes = (possibleAxesState.male && possibleAxesState.male.length > 0) ||
                        (possibleAxesState.female && possibleAxesState.female.length > 0);
        if (hasAxes) {
            // Possible-split traits never touch the DOM, so the plain confirmed-only
            // computeParentsPhenotypes() above can't see them — use the same '?'-aware
            // renderer the final results screen uses (rule 8).
            const sireBase = parseState("sire-categories", true);
            const damBase = parseState("dam-categories", false);
            const sireDisplay = buildParentsSummaryDisplay(sireBase, possibleAxesState.male, "male");
            const damDisplay = buildParentsSummaryDisplay(damBase, possibleAxesState.female, "female");
            data = {
                sire: data.sire, dam: data.dam, hasSL: data.hasSL,
                sirePheno: { symbol: sireDisplay.symbol }, damPheno: { symbol: damDisplay.symbol },
                sireName: sireDisplay.name, damName: damDisplay.name
            };
        }
    } catch (e) {
        console.error("renderLivePreview:", e);
        updateMobileBarVisibility();
        return;
    }

    const isSireEmpty = data.sireName.toLowerCase() === "green" && data.sirePheno.symbol === "+/+";
    const isDamEmpty = data.damName.toLowerCase() === "green" && data.damPheno.symbol === "+/+";

    if (isSireEmpty && isDamEmpty) {
        if (desktopBody) desktopBody.innerHTML = `<p class="live-preview-empty"></p>`;
        if (mobileBody) mobileBody.innerHTML = `<p class="live-preview-empty"></p>`;
        if (mobileNames) mobileNames.textContent = "";
    } else {
        let pairingWarnings = getPairingWarnings(); // Fetch the combination warnings

        // Live Preview only shows pairing (offspring-risk) warnings -- sire/dam individual
        // warnings are still shown in the Quick Add search box and on the final Results screen.
        let tableHTML = buildParentsTableHTML(data.sireName, data.sirePheno.symbol, data.damName, data.damPheno.symbol, [], [], pairingWarnings);

        if (desktopBody) desktopBody.innerHTML = tableHTML;
        if (mobileBody) mobileBody.innerHTML = tableHTML;
        if (mobileNames) mobileNames.textContent = `${data.sireName} \u00D7 ${data.damName}`;
    }
    updateMobileBarVisibility();
}

document.addEventListener("change", (e) => {
    if (e.target && e.target.closest && (e.target.closest("#sire-categories") || e.target.closest("#dam-categories"))) {
        renderLivePreview();
    }
});

// ==========================================
// POSSIBLE SPLIT — SCENARIO EXPANSION (Path A, Step 3)
// ==========================================
function possMutName(trait) {
    let m = mutationDB.find(x => x.id === trait.id);
    return m ? (m.result_label || m.name).replace(/\*/g, '') : trait.id;
}

// Capitalized display name for a trait inside a scenario phrase (mutationDB
// names are stored lowercase for plain mutations, e.g. "blue1", "dilute").
function possMutDisplayName(trait) {
    return capitalizeFirst(possMutName(trait));
}

// Builds the plain-English option set for ONE axis, in the finalized breeder-
// friendly wording. Each option carries the resolved phrase plus which
// candidate traits are asserted present in that branch.
function axisOptionSet(ax) {
    if (ax.type === 'or_pair') {
        // A confirmed either/or -- the breeder knows one is true, just not
        // which, so no "only" qualifier and no mention of the alternative.
        return ax.candidates.map(t => ({ traits: [t], phrase: `split ${possMutDisplayName(t)}` }));
    }
    if (ax.type === 'poss_pair_same_locus') {
        let [a, b] = ax.candidates;
        return [
            { traits: [], phrase: `not split for either ${possMutDisplayName(a)} or ${possMutDisplayName(b)}` },
            { traits: [a], phrase: `split ${possMutDisplayName(a)} only` },
            { traits: [b], phrase: `split ${possMutDisplayName(b)} only` }
        ];
    }
    if (ax.type === 'poss_single') {
        let t = ax.candidates[0];
        return [
            { traits: [], phrase: `NOT split ${possMutDisplayName(t)}` },
            { traits: [t], phrase: `split ${possMutDisplayName(t)}` }
        ];
    }
    if (ax.type === 'confirmed_plus_poss') {
        return [
            { traits: [ax.confirmed], phrase: `split ${possMutDisplayName(ax.confirmed)} only` },
            { traits: [ax.confirmed, ax.poss], phrase: `split ${possMutDisplayName(ax.confirmed)} and ${possMutDisplayName(ax.poss)} (both)` }
        ];
    }
    if (ax.type === 'confirmed_only_passthrough') {
        return [{ traits: [ax.confirmed], phrase: `split ${possMutDisplayName(ax.confirmed)}` }];
    }
    return [{ traits: [], phrase: '' }];
}

// Turns one bird's axes (rules 3, 4, 4b, 4c) into the full list of concrete
// scenarios for that bird — each a plain-English phrase plus the extra traits
// assumed true for that branch.
function expandAxesForBird(axes) {
    let axesToProcess = [...(axes || [])];

    // Special case: two independent poss_single axes on DIFFERENT loci (e.g.
    // "poss Blue1 poss Dilute") are two separate uncertain traits that can
    // each independently be present or absent -- unlike poss_pair_same_locus
    // (one shared allele slot), "both" IS a real, biologically valid outcome
    // here. Merge them up front into the same neither/A-only/B-only/both
    // wording used for the same-locus case, instead of letting the generic
    // per-axis join below produce an awkward double-negative phrase.
    let possSingleIdxs = axesToProcess
        .map((ax, i) => (ax.type === 'poss_single' ? i : -1))
        .filter(i => i !== -1);
    if (possSingleIdxs.length === 2) {
        let [i1, i2] = possSingleIdxs;
        let a = axesToProcess[i1].candidates[0];
        let b = axesToProcess[i2].candidates[0];
        let mergedAxis = {
            type: '__poss_independent_pair__',
            options: [
                { traits: [], phrase: `not split for either ${possMutDisplayName(a)} or ${possMutDisplayName(b)}` },
                { traits: [a], phrase: `split ${possMutDisplayName(a)} only` },
                { traits: [b], phrase: `split ${possMutDisplayName(b)} only` },
                { traits: [a, b], phrase: `split ${possMutDisplayName(a)} and ${possMutDisplayName(b)} (both)` }
            ]
        };
        axesToProcess = axesToProcess.filter((_, i) => i !== i1 && i !== i2);
        axesToProcess.push(mergedAxis);
    }

    let current = [{ label: '', extraTraits: [] }];
    axesToProcess.forEach(ax => {
        let options = ax.type === '__poss_independent_pair__' ? ax.options : axisOptionSet(ax);
        let next = [];
        current.forEach(c => {
            options.forEach(o => {
                next.push({
                    label: c.label && o.phrase ? `${c.label} and ${o.phrase}` : (c.label || o.phrase),
                    extraTraits: [...c.extraTraits, ...o.traits]
                });
            });
        });
        current = next;
    });
    return current;
}

// Reformats a bird's already-confirmed genotype name (unrelated to any
// possible-split/OR axis) from translatePhenotype's "Base/Split1/Split2"
// convention into breeder-friendly prose, e.g. "Green/Blue1" -> "Green split
// Blue1", or "Green" -> "Green" when there are no confirmed splits at all.
function computeBaseNamePhrase(baseState, sex) {
    const hasSLBase = baseState.z1.length > 0 || baseState.z2.length > 0;
    const nameOnly = translatePhenotype(baseState.z1, baseState.z2, baseState.autoGenes, sex, null, hasSLBase, false, null);
    let raw = nameOnly.name.replace(` (${sex})`, "");
    let parts = raw.split("/");
    let visual = parts[0];
    let splits = parts.slice(1);
    return splits.length === 0 ? visual : `${visual} split ${splits.join(" and ")}`;
}

// Combines a bird's base phrase (confirmed genotype, always true) with the
// axis-resolved phrase for one scenario branch (may be empty, a positive
// "split X..." addition, or a negative "NOT split X" / "not split for
// either..." note) into one natural sentence fragment.
function combineBaseAndAxisPhrase(basePhrase, axisPhrase) {
    if (!axisPhrase) return basePhrase;
    if (/^split /i.test(axisPhrase)) {
        // basePhrase may already read "... split X" from a pre-existing,
        // non-axis confirmed split -- merge into one list rather than
        // saying "split" twice.
        if (/ split /i.test(basePhrase)) {
            return `${basePhrase} and ${axisPhrase.replace(/^split /i, '')}`;
        }
        return `${basePhrase} ${axisPhrase}`;
    }
    // Negative / uncertain-absence phrase reads as a parenthetical note.
    return `${basePhrase} (${axisPhrase})`;
}

// A lone Z-linked trait's chromosome side is arbitrary (nothing to be in phase
// with), so it doesn't branch. The second and every subsequent Z-linked trait
// added on top of whatever's already fixed DOES need both phase options shown.
//
// With exactly 2 total Z-linked alleles in play, "cis"/"trans" relative to the
// base is unambiguous. With 3+ (e.g. a confirmed SL trait plus two possible-
// split SL traits), that binary check only asks "are the extras all opposite
// the base?" -- it can't tell that two of the EXTRA traits are cis with each
// other while both sit trans to the base. That collapsed 3 genuinely distinct
// arrangements into one duplicate-labeled "trans phase" bucket and silently
// dropped the cis-with-each-other case. For 3+ alleles we now build an
// explicit per-chromosome description instead of a single cis/trans flag.
function alleleDisplayName(allele) {
    const m = mutationDB.find(x => x.alleles && x.alleles.includes(allele));
    return m ? (m.result_label || m.name) : allele;
}

function describeMultiZPhase(z1, z2) {
    let z1Names = z1.map(alleleDisplayName);
    let z2Names = z2.map(alleleDisplayName);
    // With 3+ genes on only 2 chromosomes, pigeonhole guarantees at least one
    // pair always ends up cis -- so a single blanket "(trans phase)" suffix
    // for the whole arrangement is never accurate once 2+ genes share a Z.
    // Instead, name each chromosome's contents directly and only add "cis"
    // next to a group that actually has 2+ genes on it.
    if (z1Names.length === 0 || z2Names.length === 0) {
        let all = z1Names.length ? z1Names : z2Names;
        return `${all.join(' + ')} (all cis, same Z)`;
    }
    let z1Label = z1Names.length > 1 ? `${z1Names.join(' + ')} cis` : z1Names[0];
    let z2Label = z2Names.length > 1 ? `${z2Names.join(' + ')} cis` : z2Names[0];
    return `${z1Label} / ${z2Label}`;
}

function expandZPhaseVariants(baseZ1, baseZ2, extraSLAlleles) {
    let variants = [{ z1: [...baseZ1], z2: [...baseZ2] }];
    extraSLAlleles.forEach(allele => {
        let next = [];
        variants.forEach(v => {
            let totalExisting = v.z1.length + v.z2.length;
            if (totalExisting === 0) {
                next.push({ z1: [...v.z1, allele], z2: [...v.z2] });
            } else {
                next.push({ z1: [...v.z1, allele], z2: [...v.z2] });
                next.push({ z1: [...v.z1], z2: [...v.z2, allele] });
            }
        });
        variants = next;
    });

    // Flag the variants so the scenario builder knows how to format the text.
    // If this branch didn't add any new sex-linked trait at all (e.g. the
    // "not split for X" outcome), there's no new phase uncertainty being
    // resolved here -- the bird's existing phase is already implied by its
    // confirmed genotype name, so the heading shouldn't restate it.
    variants.forEach(v => {
        let total = v.z1.length + v.z2.length;
        if (extraSLAlleles.length === 0) {
            v.phaseLabel = '';
        } else if (total > 2) {
            v.phaseLabel = describeMultiZPhase(v.z1, v.z2);
            v.phaseIsCustom = true;
        } else if (total > 1) {
            v.phaseLabel = (v.z2.length === 0 || v.z1.length === 0) ? 'cis' : 'trans';
        } else {
            v.phaseLabel = '';
        }
    });

    return variants;
}

// Layers a scenario's extra (possible-split) traits on top of the bird's confirmed
// DOM state, cloning rather than mutating so the original parseState() output is
// never touched. Returns an array because Z-linked phase branching can turn one
// scenario into two or more concrete genetic states.
function applyExtraTraitsToState(baseState, extraTraits) {
    let autoGenes = {};
    Object.keys(baseState.autoGenes).forEach(k => autoGenes[k] = [...baseState.autoGenes[k]]);
    let extraSL = [];
    extraTraits.forEach(t => {
        let mut = mutationDB.find(m => m.id === t.id);
        if (!mut) return;
        if (mut.type.includes("SL")) {
            extraSL.push(mut.alleles[0]);
        } else {
            let locus = mut.locus;
            if (!autoGenes[locus]) autoGenes[locus] = ["+", "+"];
            let idx = autoGenes[locus].indexOf("+");
            if (idx !== -1) autoGenes[locus][idx] = mut.alleles[0];
        }
    });
    let zVariants = expandZPhaseVariants(baseState.z1, baseState.z2, extraSL);
    return zVariants.map(v => ({
        autoGenes, z1: v.z1, z2: v.z2, dfPhase: baseState.dfPhase, phaseLabel: v.phaseLabel, phaseIsCustom: v.phaseIsCustom
    }));
}

// Full list of concrete genetic states for one bird: every axis-branch combination,
// each further split into Z-linked phase variants where relevant.
function buildBirdScenarios(baseState, axes) {
    let branches = expandAxesForBird(axes);
    if (branches.length === 1 && branches[0].extraTraits.length === 0) {
        return [{ label: '', state: baseState }];
    }
    let out = [];
    branches.forEach(b => {
        let states = applyExtraTraitsToState(baseState, b.extraTraits);
        states.forEach(s => {
            let fullLabel = b.label || '';

            // Intercept Z-linked scenarios to apply exact text formatting
            if (s.phaseIsCustom) {
                // 3+ Z-linked alleles: describeMultiZPhase already names every
                // trait per chromosome, so it fully replaces the generic
                // "split X and Y (both)" phrasing rather than patching it.
                fullLabel = s.phaseLabel;
            } else if (s.phaseLabel === 'cis') {
                fullLabel = fullLabel.replace(' and ', '-').replace(' (both)', '');
                fullLabel = fullLabel ? `${fullLabel} (cis phase)` : '(cis phase)';
            } else if (s.phaseLabel === 'trans') {
                fullLabel = fullLabel.replace(' and ', ' and split ').replace(' (both)', '');
                fullLabel = fullLabel ? `${fullLabel} (trans phase)` : '(trans phase)';
            } else if (s.phaseLabel) {
                fullLabel = fullLabel ? `${fullLabel} (${s.phaseLabel})` : s.phaseLabel;
            }

            out.push({ label: fullLabel, state: { autoGenes: s.autoGenes, z1: s.z1, z2: s.z2, dfPhase: s.dfPhase } });
        });
    });
    return out;
}

// The pure cross-computation core, factored out of calculateGenetics so it can be
// run once per scenario pair without touching the DOM.
function runCross(sire, dam) {
    const hasSL = sire.z1.length > 0 || sire.z2.length > 0 || dam.z1.length > 0;

    let sIndPhase = null, dIndPhase = null;
    let sBlHets = sire.autoGenes['bl'] ? sire.autoGenes['bl'].filter(a => a !== "+") : [];
    if (sire.dfPhase && sBlHets.length === 1) sIndPhase = sire.dfPhase;
    let dBlHets = dam.autoGenes['bl'] ? dam.autoGenes['bl'].filter(a => a !== "+") : [];
    if (dam.dfPhase && dBlHets.length === 1) dIndPhase = dam.dfPhase;

    const sireBlDfChr = getParentBlDfChromosomes(sire.autoGenes, sire.dfPhase);
    const sireBlDfBlock = buildLinkedBlDfSymbol(sireBlDfChr.bl_c1, sireBlDfChr.df_c1, sireBlDfChr.bl_c2, sireBlDfChr.df_c2);
    const damBlDfChr = getParentBlDfChromosomes(dam.autoGenes, dam.dfPhase);
    const damBlDfBlock = buildLinkedBlDfSymbol(damBlDfChr.bl_c1, damBlDfChr.df_c1, damBlDfChr.bl_c2, damBlDfChr.df_c2);

    const sirePheno = translatePhenotype(sire.z1, sire.z2, sire.autoGenes, "male", sIndPhase, true, false, sireBlDfBlock);
    const damPheno = translatePhenotype(dam.z1, [], dam.autoGenes, "female", dIndPhase, true, false, damBlDfBlock);
    const sireName = sirePheno.name.replace(" (male)", "");
    const damName = damPheno.name.replace(" (female)", "");

    const sireZGametes = generateZGametesMale(sire.z1, sire.z2);
    const sireAutoGametes = generateAutosomalGametes(sire.autoGenes, sire.dfPhase);
    const damZGametes = [{ chr: 'Z', genes: dam.z1, prob: 0.5 }, { chr: 'W', genes: [], prob: 0.5 }];
    const damAutoGametes = generateAutosomalGametes(dam.autoGenes, dam.dfPhase);

    let rawOffspring = {};
    sireZGametes.forEach(sz => {
        damZGametes.forEach(dz => {
            const sex = dz.chr === "W" ? "female" : "male";
            sireAutoGametes.forEach(sa => {
                damAutoGametes.forEach(da => {
                    const prob = sz.prob * dz.prob * sa.prob * da.prob;
                    if (prob === 0) return;
                    const auto = {};
                    [...Object.keys(sa.genes), ...Object.keys(da.genes)].forEach(l => {
                        auto[l] = [sa.genes[l] || "+", da.genes[l] || "+"];
                    });
                    let indPhase = null;
                    let df_c1 = sa.genes['dark_factor'] || "+", bl_c1 = sa.genes['bl'] || "+";
                    let df_c2 = da.genes['dark_factor'] || "+", bl_c2 = da.genes['bl'] || "+";
                    let isDfHet = (df_c1 !== "+" || df_c2 !== "+") && !(df_c1 !== "+" && df_c2 !== "+");
                    let isBlSplit = ((bl_c1 !== "+" ? 1 : 0) + (bl_c2 !== "+" ? 1 : 0)) === 1;
                    if (isDfHet && isBlSplit) indPhase = df_c1 !== "+" ? (bl_c1 !== "+" ? "type 2" : "type 1") : (bl_c2 !== "+" ? "type 2" : "type 1");
                    const blDfBlock = buildLinkedBlDfSymbol(bl_c1, df_c1, bl_c2, df_c2);
                    const pheno = translatePhenotype(sz.genes, dz.genes, auto, sex, indPhase, hasSL, true, blDfBlock);
                    const key = pheno.symbol + pheno.name;
                    if (!rawOffspring[key]) rawOffspring[key] = { ...pheno, prob: 0 };
                    rawOffspring[key].prob += prob;
                });
            });
        });
    });

    const offspringArray = Object.values(rawOffspring);
    let offspringWarningsSet = new Set();
    offspringArray.forEach(r => {
        let birdWarnings = generateBreedingWarnings(r.expressedIDs, r.splitIDs);
        birdWarnings.forEach(w => offspringWarningsSet.add(w));
    });
    let sireWarnings = generateBreedingWarnings(sirePheno.expressedIDs, sirePheno.splitIDs).filter(w => !offspringWarningsSet.has(w));
    let damWarnings = generateBreedingWarnings(damPheno.expressedIDs, damPheno.splitIDs).filter(w => !offspringWarningsSet.has(w));

    return { offspringArray, hasSL, sirePheno, damPheno, sireName, damName, sireWarnings, damWarnings };
}

// ==========================================
// POSSIBLE SPLIT — "?" NOTATION (Path A, Step 5)
// ==========================================
// Purpose-built symbol renderer for the Parents Summary only, so uncertain loci can
// be marked '?' without touching translatePhenotype's shared, order-sensitive symbol
// assembly (which every offspring table also depends on). Offspring tables inside
// each scenario accordion always use the real translatePhenotype output, unmodified.
function buildUncertainBlDfBlock(displayAutoGenes, dfPhase, uncertainAutoLoci) {
    const blUncertain = uncertainAutoLoci.has('bl');
    const dfUncertain = uncertainAutoLoci.has('dark_factor');
    const chr = getParentBlDfChromosomes(displayAutoGenes, dfPhase);

    if (!blUncertain && !dfUncertain) {
        // Nothing uncertain on this pair -- identical to the real engine's own output.
        return buildLinkedBlDfSymbol(chr.bl_c1, chr.df_c1, chr.bl_c2, chr.df_c2);
    }

    function sym(id, locus) {
        if (id === "+") return getWTSymbol(locus);
        if (id === "cis_bl1_bl2") return "bl^{1}_bl^{2}";
        const m = mutationDB.find(x => x.id === id);
        return m ? m.symbol : "+";
    }
    let c1_bl = sym(chr.bl_c1, "bl"), c2_bl = sym(chr.bl_c2, "bl");
    let c1_df = sym(chr.df_c1, "dark_factor"), c2_df = sym(chr.df_c2, "dark_factor");

    // Same single-slot convention used everywhere else in this display: since a
    // possible split's chromosome side genuinely isn't known, only one slot (here,
    // chromosome 1) is marked '?' rather than trying to represent the full shape of
    // the uncertainty. True cis/trans branching for an uncertain bl/dark-factor pair
    // isn't modeled the way it is for Z-linked traits (rule 6) — this is a display
    // simplification only.
    if (blUncertain && chr.bl_c1 === "+") c1_bl = "?";
    if (dfUncertain && chr.df_c1 === "+") c1_df = "?";

    return `${c1_bl}_${c1_df}/${c2_bl}_${c2_df}`;
}

function buildUncertainParentSymbol(displayAutoGenes, uncertainAutoLoci, z1, z2, uncertainSLLoci, sex, dfPhase) {
    let symbolParts = [];
    const orderedLoci = [...new Set([...Object.keys(displayAutoGenes), ...uncertainAutoLoci])]
        .filter(l => l !== 'bl' && l !== 'dark_factor')
        .sort((a, b) => {
            const repA = mutationDB.find(m => m.locus === a);
            const repB = mutationDB.find(m => m.locus === b);
            return nameRank(repA ? repA.cat : 99) - nameRank(repB ? repB.cat : 99);
        });

    orderedLoci.forEach(locus => {
        if (uncertainAutoLoci.has(locus)) {
            symbolParts.push(`${getWTSymbol(locus)}/?`);
        } else {
            symbolParts.push(formatSymbol(displayAutoGenes[locus] || ["+", "+"], locus));
        }
    });

    // bl and dark_factor are physically linked, so — exactly like the real engine —
    // they always render as one combined chromosome-pair block, never as two
    // separate loci, whether or not either side is uncertain.
    symbolParts.unshift(buildUncertainBlDfBlock(displayAutoGenes, dfPhase, uncertainAutoLoci));

    if (z1.length > 0 || z2.length > 0 || uncertainSLLoci.size > 0) {
        const zSym = (mainArr, otherArr, markUncertain) => {
            const combinedLoci = [...new Set([...mainArr, ...otherArr]
                .map(id => mutationDB.find(m => m.id === id)?.locus)
                .filter(Boolean).concat(markUncertain ? [...uncertainSLLoci] : []))];
            if (combinedLoci.length === 0) return "Z^{+}";
            const sortedLoci = combinedLoci.sort((a, b) => zMapOrder.indexOf(a) - zMapOrder.indexOf(b));
            const syms = sortedLoci.map(locus => {
                if (markUncertain && uncertainSLLoci.has(locus)) return "?";
                const id = mainArr.find(a => mutationDB.find(m => m.id === a)?.locus === locus);
                return id ? mutationDB.find(x => x.id === id).symbol : getWTSymbol(locus);
            });
            return "Z " + syms.join("_");
        };
        if (sex === "female") {
            symbolParts.push(`${zSym(z1, [], true)}/W`);
        } else {
            symbolParts.push(`${zSym(z1, z2, true)}/${zSym(z2, z1, false)}`);
        }
    }

    return renderFormat(symbolParts.join("; "));
}

// Builds the Parents Summary name + symbol for a bird with possible-split axes:
// genuinely certain traits (including the confirmed half of a "split X poss Y" axis)
// render normally; every uncertain candidate renders as '?' in the symbol and as a
// "//Name" suffix on the name (rule 8's naming convention — first uncertain item
// after a genuine confirm gets a single '/', which for an OR-pair is purely a
// text-rendering convention since neither side is more "confirmed" than the other).
function buildParentsSummaryDisplay(baseState, axes, sex) {
    let displayAutoGenes = {};
    Object.keys(baseState.autoGenes).forEach(k => displayAutoGenes[k] = [...baseState.autoGenes[k]]);
    let displayZ1 = [...baseState.z1], displayZ2 = [...baseState.z2];
    let uncertainAutoLoci = new Set();
    let uncertainSLLoci = new Set();
    let nameSuffix = "";

    const markUncertain = (t) => {
        let mut = mutationDB.find(m => m.id === t.id);
        if (!mut) return;
        if (mut.type.includes("SL")) uncertainSLLoci.add(mut.locus);
        else uncertainAutoLoci.add(mut.locus);
    };
    const addConfirmed = (t) => {
        let mut = mutationDB.find(m => m.id === t.id);
        if (!mut) return;
        if (mut.type.includes("SL")) {
            displayZ1.push(mut.alleles[0]);
        } else {
            let locus = mut.locus;
            if (!displayAutoGenes[locus]) displayAutoGenes[locus] = ["+", "+"];
            let idx = displayAutoGenes[locus].indexOf("+");
            if (idx !== -1) displayAutoGenes[locus][idx] = mut.alleles[0];
        }
    };

    (axes || []).forEach(ax => {
        if (ax.type === 'confirmed_plus_poss') {
            addConfirmed(ax.confirmed);
            markUncertain(ax.poss);
            nameSuffix += `//${possMutName(ax.poss)}`;
        } else if (ax.type === 'confirmed_only_passthrough') {
            addConfirmed(ax.confirmed);
        } else if (ax.type === 'or_pair') {
            ax.candidates.forEach(markUncertain);
            nameSuffix += `/${possMutName(ax.candidates[0])}//${possMutName(ax.candidates[1])}`;
        } else if (ax.type === 'poss_pair_same_locus' || ax.type === 'poss_single') {
            ax.candidates.forEach(markUncertain);
            ax.candidates.forEach(t => { nameSuffix += `//${possMutName(t)}`; });
        }
    });

    const hasSLBase = displayZ1.length > 0 || displayZ2.length > 0;
    const nameOnly = translatePhenotype(displayZ1, displayZ2, displayAutoGenes, sex, null, hasSLBase, false, null);
    const baseName = nameOnly.name.replace(` (${sex})`, "");

    return {
        name: baseName + nameSuffix,
        symbol: buildUncertainParentSymbol(displayAutoGenes, uncertainAutoLoci, displayZ1, displayZ2, uncertainSLLoci, sex, baseState.dfPhase)
    };
}

function calculateGenetics() {
    const speciesVal = document.getElementById("species").value;
    const missingSire = findMissingSelections("sire-categories", "male");
    const missingDam = findMissingSelections("dam-categories", "female");
    if (speciesVal === "none" || missingSire.length || missingDam.length) {
        showValidationReminder(speciesVal === "none", missingSire, missingDam);
        return;
    }
    clearValidationReminder();

    const sireBase = parseState("sire-categories", true);
    const damBase = parseState("dam-categories", false);
    const sireScenarios = buildBirdScenarios(sireBase, possibleAxesState.male);
    const damScenarios = buildBirdScenarios(damBase, possibleAxesState.female);

    const resultsContentEl = document.getElementById("results-content");
    const parentsSummaryEl = document.getElementById("parents-summary");

    // Always reveal the results panel -- both branches below populate it, but
    // only the multi-scenario (possible-split/OR) branch used to flip this
    // back to visible, leaving the panel hidden (display:none from CSS /
    // resetCalculator) for ordinary plain selections.
    const resultsContainerElTop = document.getElementById("results-container");
    if (resultsContainerElTop) resultsContainerElTop.style.display = "block";

    if (sireScenarios.length === 1 && damScenarios.length === 1) {
        // No possible-split branching in play -- identical single-table behavior as before.
        const r = runCross(sireScenarios[0].state, damScenarios[0].state);
        parentsSummaryEl.innerHTML = buildParentsTableHTML(r.sireName, r.sirePheno.symbol, r.damName, r.damPheno.symbol, r.sireWarnings, r.damWarnings, []);
        renderResults(r.offspringArray, r.hasSL);
        lastCalcData = {
            sire: { symbol: r.sirePheno.symbol, name: r.sireName, warnings: r.sireWarnings },
            dam: { symbol: r.damPheno.symbol, name: r.damName, warnings: r.damWarnings },
            hasSL: r.hasSL,
            offspring: r.offspringArray.map(o => ({ symbol: o.symbol, name: o.name, prob: o.prob, expressedIDs: o.expressedIDs, splitIDs: o.splitIDs }))
        };
    } else {
        // One or both birds carry possible-split traits -- render one collapsible
        // accordion per sire x dam scenario combination, each a self-contained,
        // fully-resolved cross (rules 4/4b/4c/6/7).
        let combos = [];
        sireScenarios.forEach(ss => damScenarios.forEach(ds => combos.push({ ss, ds })));
        let combosResults = combos.map(c => runCross(c.ss.state, c.ds.state));

        const sireDisplay = buildParentsSummaryDisplay(sireBase, possibleAxesState.male, "male");
        const damDisplay = buildParentsSummaryDisplay(damBase, possibleAxesState.female, "female");

        const sireBasePhrase = computeBaseNamePhrase(sireBase, "male");
        const damBasePhrase = computeBaseNamePhrase(damBase, "female");

        const combosData = combos.map((c, idx) => {
            let maleFull = capitalizeFirst(combineBaseAndAxisPhrase(sireBasePhrase, c.ss.label));
            let femaleFull = capitalizeFirst(combineBaseAndAxisPhrase(damBasePhrase, c.ds.label));
            return {
                summaryLabel: `If male is ${maleFull}, and female is ${femaleFull}`,
                hasSL: combosResults[idx].hasSL,
                offspring: combosResults[idx].offspringArray.map(o => ({ symbol: o.symbol, name: o.name, prob: o.prob, expressedIDs: o.expressedIDs, splitIDs: o.splitIDs }))
            };
        });

        renderMultiScenarioResults(sireDisplay, damDisplay, combosData, true);

        lastCalcData = {
            type: "multi",
            sire: sireDisplay,
            dam: damDisplay,
            combos: combosData
        };
    }

    const resultsEl = document.getElementById("results-container");
    if (resultsEl) resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });

    document.getElementById("share-link-box").style.display = "none";
    document.getElementById("share-link-box").innerHTML = "";
}

function buildOffspringResultsHTML(resultsData, hasSL) {
    resultsData = [...resultsData].sort((a, b) => b.prob - a.prob);
    let allExpressedIDs = [];
    resultsData.forEach(r => allExpressedIDs = allExpressedIDs.concat(r.expressedIDs));

    function formatOffspringName(name) {
        if (name.endsWith(" (male)")) return "1.0 " + name.slice(0, -" (male)".length);
        if (name.endsWith(" (female)")) return "0.1 " + name.slice(0, -" (female)".length);
        return name;
    }

    function buildTableHTML(data, useOffspringSexPrefix = false) {
        return `<table><thead><tr><th>Genotype / Mutation Name</th><th>Probability</th><th class="col-genetic-formula">Genetic Formulas</th></tr></thead><tbody>` +
            data.map(r => `<tr><td>${useOffspringSexPrefix ? formatOffspringName(r.name) : r.name}</td><td>${(r.prob * 100).toFixed(2)}%</td><td class="genetic-formula col-genetic-formula">${r.symbol}</td></tr>`).join("") + `</tbody></table>`;
    }

    let html;
    if (!hasSL) {
        html = `<h3>Offspring</h3>` + buildTableHTML(resultsData);
    } else {
        let maleOffspring = resultsData.filter(r => r.name.includes('(male)'));
        let femaleOffspring = resultsData.filter(r => r.name.includes('(female)'));
        html = "";
        if (maleOffspring.length > 0) html += `<h3>Male Offspring (1.0)</h3>` + buildTableHTML(maleOffspring, true);
        if (femaleOffspring.length > 0) html += `<h3>Female Offspring (0.1)</h3>` + buildTableHTML(femaleOffspring, true);
    }

    if (allExpressedIDs.includes("blue1_blue2")) {
        html += `<div class="mutation-warning-note">This result does not include crossing-over. A blue1-blue2 recombination event — which can produce Sapphire, SapphireBlue1, or SapphireBlue2 — is possible in this pairing, but its rate hasn't been established, so it isn't factored into the odds shown above.</div>`;
    }

    let uniqueWarnings = new Set();
    resultsData.forEach(r => {
        let birdWarnings = generateBreedingWarnings(r.expressedIDs, r.splitIDs);
        birdWarnings.forEach(w => uniqueWarnings.add(w));
    });
    uniqueWarnings.forEach(note => {
        html += `<div class="mutation-warning-note">${note}</div>`;
    });

    return html;
}

function buildScenarioAccordionsHTML(combos) {
    // combos: [{ summaryLabel, hasSL, offspring }]
    return combos.map((c, idx) => `<details class="category poss-scenario-accordion"${idx === 0 ? ' open' : ''}>
                <summary class="category-title">${c.summaryLabel}</summary>
                <div class="poss-scenario-body">${buildOffspringResultsHTML(c.offspring, c.hasSL)}</div>
            </details>`).join('');
}

function renderMultiScenarioResults(sireInfo, damInfo, combos, showShareButton = true) {
    const resultsContentEl = document.getElementById("results-content");
    const parentsSummaryEl = document.getElementById("parents-summary");
    const resultsContainerEl = document.getElementById("results-container");

    parentsSummaryEl.innerHTML = buildParentsTableHTML(sireInfo.name, sireInfo.symbol, damInfo.name, damInfo.symbol, [], [], []) +
        `<div class="mutation-warning-note" style="margin-left:0;">This pairing includes possible-split (uncertain) traits — marked '?' above — so ${combos.length} scenario${combos.length > 1 ? 's are' : ' is'} shown below, each assuming a different combination is actually true.</div>`;

    resultsContentEl.innerHTML = buildScenarioAccordionsHTML(combos);

    if (resultsContainerEl) resultsContainerEl.style.display = "block";
    const shareContainer = document.getElementById("share-container");
    const shareBtn = document.getElementById("share-btn");
    if (shareContainer) shareContainer.style.display = "block";
    if (shareBtn) shareBtn.style.display = showShareButton ? "inline-flex" : "none";
}

function renderResults(resultsData, hasSL, showShareButton = true) {
    const container = document.getElementById("results-container");
    const content = document.getElementById("results-content");
    content.innerHTML = buildOffspringResultsHTML(resultsData, hasSL);
    container.scrollIntoView({ behavior: 'smooth' });

    const shareContainer = document.getElementById("share-container");
    const shareBtn = document.getElementById("share-btn");
    
    // Always show the container so the Print button is available
    if (shareContainer) shareContainer.style.display = "block";
    
    // Selectively hide ONLY the Share button when in read-only mode
    if (shareBtn) shareBtn.style.display = showShareButton ? "inline-flex" : "none";
}

function generateBreedingWarnings(visualIDs, splitIDs = []) {
    const warnings = [];
    const eumelaninIDs = ["nsl_ino", "dec", "pastel", "bronze_fallow", "dilute", "pale_fallow", "dun_fallow", "rec_pied", "faded", "marbled", "dm_jade", "sl_ino", "pallid", "pale", "cinnamon", "dom_pied", "dom_reduced", "dom_edged", "euwing", "grey_factor", "sl_dom_greywing"];
    const psittacineIDs = ["aqua", "blue1", "blue2", "rose_blue", "turquoise", "teal", "orange_face", "pale_headed", "sapphire", "sapphire_blue1", "sapphire_blue2", "aqua_sapphire"];

    // Does trait `id` belong to `categoryIDs` -- either directly, or via one of
    // the alleles that make up a named compound (e.g. "aqua_blue1" counts
    // because its alleles ["aqua","blue1"] are both psittacine)?
    function inCategory(id, categoryIDs) {
        if (categoryIDs.includes(id)) return true;
        let m = mutationDB.find(x => x.id === id);
        return m && m.alleles && m.alleles.some(a => categoryIDs.includes(a));
    }

    // Rules 1-3 evaluate ONLY what the bird visually expresses (visualIDs).
    // A gene that is merely split (hidden, single recessive copy) never
    // reaches visualIDs, so it can never trip these three checks.

    // 1. Multiple Eumelanin Check
    let euCount = visualIDs.filter(id => inCategory(id, eumelaninIDs)).length;
    if (euCount >= 2) {
        warnings.push("This combines multiple eumelanin mutations. Such combinations reduce dark pigment and are generally considered visually unrecognisable/not accepted by breed standards.");
    }

    // 2. Multiple Psittacine Check (ignored entirely if every involved trait's own locus is "bl")
    let psitMutations = visualIDs.filter(id => inCategory(id, psittacineIDs));
    let allAreBl = psitMutations.every(id => {
        let m = mutationDB.find(x => x.id === id);
        return m && m.locus === "bl";
    });

    // 2a/2b. Mask-pigment checks. Unlike the visual-only rule above, these two also count a
    // mutation that is merely SPLIT (carried but not visually expressed) toward the combination,
    // since a bird split for a bl-locus or mask mutation can still pass it on and produce the
    // same unrecognizable-mask outcome in offspring. This only ever adds an advisory note --
    // it never blocks selecting mutations or generating offspring.
    const maskIDs = ["orange_face", "pale_headed"];
    let fullPsitIDs = [...visualIDs, ...splitIDs].filter(id => inCategory(id, psittacineIDs));
    let maskMutations = fullPsitIDs.filter(id => inCategory(id, maskIDs));
    let nonMaskPsitCount = fullPsitIDs.length - maskMutations.length;

    // 2a. Mask mutation (Orange Face / Pale Headed) combined with a bl-locus (blue-series) mutation:
    // the blue mutation removes the psittacofulvin pigment the mask mutation acts on, so the mask
    // coloring can no longer be visually confirmed.
    if (maskMutations.length >= 1 && nonMaskPsitCount >= 1) {
        warnings.push("This combines a mask-pigment mutation (Orange Face / Pale Headed) with a blue-series (bl-locus) mutation, either visually or as a split carrier. The blue mutation strips out the psittacofulvin pigment the mask mutation acts on, so the mask colouring is not visually recognisable in this combination.");
    }

    // 2b. Two mask mutations present on the same bird (visual or split): they act on the same
    // facial pigment, so neither trait's expression can be reliably told apart.
    if (maskMutations.length >= 2) {
        warnings.push("This combines more than one mask-pigment mutation (Orange Face and Pale Headed) on the same bird, either visually or as a split carrier. Stacking these makes the mask colouring visually unrecognisable, so neither trait can be reliably confirmed.");
    }

    // 2c. Fallback for any other multi-psittacine combination not covered by the mask-specific
    // rules above (e.g. any future non-bl, non-mask additions to this category). This one stays
    // visual-only, matching the original behavior for traits outside the mask/bl scope.
    if (maskMutations.length === 0 && psitMutations.length >= 2 && !allAreBl) {
        warnings.push("This combines multiple psittacine mutations, which is generally avoided as the visual result is not clearly recognizable.");
    }

    // 3. Allelic Compound Check (ignores bl-locus compounds like Parblue/Sapphire)
    if (visualIDs.some(id => {
        const m = mutationDB.find(x => x.id === id);
        return m && m.isCompound && m.locus !== "bl";
    })) {
        warnings.push("These mutations are alleles of the same gene. Combining them typically produces an intermediate, non-standard result rather than a distinct new mutation, and such combinations are not accepted at exhibitions.");
    }

    // 4. SL Greywing Linkage Check -- the ONLY rule that must evaluate the
    // entire genotype, so it looks at visual traits AND hidden splits together.
    let fullGenotypeIDs = [...visualIDs, ...splitIDs];
    let hasGreywing = fullGenotypeIDs.includes("sl_dom_greywing");
    let hasOtherSL = fullGenotypeIDs.some(id => {
        const m = mutationDB.find(x => x.id === id);
        return m && m.type.includes("SL") && id !== "sl_dom_greywing";
    });

    if (hasGreywing && hasOtherSL) {
        warnings.push("Linkage rates between SL Greywing and other sex-linked mutations are currently unknown. The calculator assumes independent inheritance.");
    }

    return warnings;
}

function encodeSharePayload(obj) {
    return btoa(unescape(encodeURIComponent(JSON.stringify(obj))));
}

function decodeSharePayload(str) {
    return JSON.parse(decodeURIComponent(escape(atob(str))));
}

const copySvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="button-icon" style="margin-right: 6px; vertical-align: -4px;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;

function shareResults() {
    if (!lastCalcData) return;
    const encoded = encodeSharePayload(lastCalcData);
    const url = `${window.location.origin}${window.location.pathname}#shared=${encoded}`;

    const box = document.getElementById("share-link-box");
    box.style.display = "flex";
    box.innerHTML = `<input type="text" id="share-link-input" readonly><button type="button" id="copy-link-btn" onclick="copyShareLink()">${copySvg} Copy Link</button>`;
    const input = document.getElementById("share-link-input");
    input.value = url;
    input.focus();
    input.select();
}

function copyShareLink() {
    const input = document.getElementById("share-link-input");
    const btn = document.getElementById("copy-link-btn");
    if (!input) return;
    input.select();
    input.setSelectionRange(0, input.value.length);

    const showResult = (ok) => {
        if (!btn) return;
        const original = `${copySvg} Copy Link`;
        btn.innerHTML = ok ? `${copySvg} Copied!` : `${copySvg} Press Ctrl+C`;
        setTimeout(() => { btn.innerHTML = original; }, 1500);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(input.value).then(() => showResult(true)).catch(() => {
            try { showResult(document.execCommand("copy")); } catch (e) { showResult(false); }
        });
    } else {
        try { showResult(document.execCommand("copy")); } catch (e) { showResult(false); }
    }
}

function enterSharedView(payload) {
    const headerControls = document.getElementById("header-controls");
    const symbolToggle = document.getElementById("symbol-toggle-wrap");
    const calcUI = document.getElementById("calculator-ui");
    const controls = document.getElementById("controls-container");
    if (headerControls) headerControls.style.display = "none";
    if (symbolToggle) symbolToggle.style.display = "none";
    if (calcUI) calcUI.style.display = "none";
    if (controls) controls.style.display = "none";

    const banner = document.getElementById("shared-banner");
    if (banner) {
        banner.style.display = "flex";
        const symbolsLabel = geneticSymbolsHidden ? "Show Genetic Symbols" : "Hide Genetic Symbols";
        const newCalcSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="button-icon" style="margin-right: 6px; vertical-align: -4px;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>`;
        
        banner.innerHTML = `<span>You're viewing shared breeding results (read-only).</span><button type="button" class="js-toggle-symbols-btn" onclick="toggleGeneticSymbols()">${dnaSvg}${symbolsLabel}</button><button type="button" onclick="exitSharedView()">${newCalcSvg}Start New Calculation</button>`;
    }

    if (payload.type === "multi") {
        // Shared possible-split pairing: rebuild the same collapsible per-scenario
        // accordions the live calculator shows, just read-only (no Share button).
        renderMultiScenarioResults(payload.sire, payload.dam, payload.combos, false);
        return;
    }

    let sireWarnings = payload.sire.warnings || [];
    let damWarnings = payload.dam.warnings || [];
    // We purposefully ignore pairingWarnings here so they only show up in the offspring box

    document.getElementById("parents-summary").innerHTML = buildParentsTableHTML(
        payload.sire.name, 
        payload.sire.symbol, 
        payload.dam.name, 
        payload.dam.symbol, 
        sireWarnings, 
        damWarnings, 
        [] // Keep empty here so the offspring box handles these instead
    );

    renderResults(payload.offspring, payload.hasSL, false);
}

function exitSharedView() {
    window.location.hash = "";
    window.location.reload();
}

function initSharedViewFromURL() {
    const hash = window.location.hash;
    if (!hash.startsWith("#shared=")) return;
    try {
        const payload = decodeSharePayload(hash.slice("#shared=".length));
        enterSharedView(payload);
    } catch (e) {
        console.error("Failed to load shared results link:", e);
    }
}

function initSpeciesDropdown() {
    const wrapper = document.getElementById("species-custom");
    const trigger = document.getElementById("species-trigger");
    const triggerLabel = document.getElementById("species-trigger-label");
    const optionsList = document.getElementById("species-options");
    const hiddenSelect = document.getElementById("species");
    if (!wrapper || !trigger || !optionsList || !hiddenSelect) return;

    function closeList() {
        optionsList.style.display = "none";
        trigger.setAttribute("aria-expanded", "false");
    }

    trigger.addEventListener("click", () => {
        const isOpen = optionsList.style.display === "block";
        optionsList.style.display = isOpen ? "none" : "block";
        trigger.setAttribute("aria-expanded", String(!isOpen));
    });

    optionsList.querySelectorAll("li[role=\"option\"]").forEach(li => {
        li.addEventListener("click", () => {
            const value = li.getAttribute("data-value");
            triggerLabel.innerHTML = li.innerHTML;
            hiddenSelect.value = value;
            closeList();
            updateUI();
        });
    });

    document.addEventListener("click", (e) => {
        if (!wrapper.contains(e.target)) closeList();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeList();
    });
}

document.addEventListener("DOMContentLoaded", initSpeciesDropdown);
document.addEventListener("DOMContentLoaded", initSharedViewFromURL);

let mobilePreviewExpanded = false;
function toggleMobilePreview() {
    const bar = document.getElementById("mobile-preview-bar");
    const arrow = document.getElementById("mobile-preview-arrow");
    const expandBtn = bar ? bar.querySelector(".mobile-preview-expand-btn") : null;
    if (!bar) return;
    mobilePreviewExpanded = !mobilePreviewExpanded;
    bar.classList.toggle("expanded", mobilePreviewExpanded);
    if (arrow) arrow.innerHTML = mobilePreviewExpanded ? "&#9662;" : "&#9652;";
    if (expandBtn) expandBtn.setAttribute("aria-expanded", String(mobilePreviewExpanded));
}

// Once a species is picked, the bar stays visible the whole time the user is
// on the page -- it used to hide itself once scrolled down to the on-page
// Reset/Generate buttons below the columns (via a sentinel + IntersectionObserver),
// but that made the floating preview disappear right as people reached those
// buttons, which is exactly when they still want it. No more scroll-based hiding.
function updateMobileBarVisibility() {
    const bar = document.getElementById("mobile-preview-bar");
    if (!bar) return;
    const speciesEl = document.getElementById("species");
    const speciesVal = speciesEl ? speciesEl.value : "none";
    bar.classList.toggle("is-visible", speciesVal !== "none");
}
document.addEventListener("DOMContentLoaded", updateMobileBarVisibility);

// Keep the bar visible for as long as either search box is focused, and keep
// it riding above the on-screen keyboard instead of sliding out of view behind
// it. The primary fix is the interactive-widget=resizes-content flag on the
// <meta name="viewport"> tag in index.html -- on browsers that honor it
// (Chrome/Android, Firefox), the browser itself shrinks window.innerHeight to
// exclude the keyboard (and its autofill suggestion strip), so a plain
// `position:fixed; bottom:0` bar already sits flush above it with no JS
// needed -- window.innerHeight and visualViewport.height end up equal, so
// keyboardInset below naturally computes to ~0 and this is a no-op there.
// Safari does not yet support that meta flag (elements with position:fixed
// stay pinned to the full, unshrunk layout viewport there), so this transform
// is what keeps the bar above the keyboard on iOS specifically.
function adjustMobileBarForKeyboard() {
    const bar = document.getElementById("mobile-preview-bar");
    if (!bar || !window.visualViewport) return;
    const vv = window.visualViewport;
    const keyboardInset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
    bar.style.transform = keyboardInset > 0 ? `translateY(-${keyboardInset}px)` : "";
}

function initMobileBarKeyboardHandling() {
    if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", adjustMobileBarForKeyboard);
        window.visualViewport.addEventListener("scroll", adjustMobileBarForKeyboard);
    }
    const inputs = [document.getElementById("sire-search-input"), document.getElementById("dam-search-input")];
    inputs.forEach(input => {
        if (!input) return;
        input.addEventListener("focus", adjustMobileBarForKeyboard);
        input.addEventListener("blur", () => {
            // Let the keyboard-closing resize settle before un-shifting the bar,
            // so it doesn't flash/jump.
            setTimeout(adjustMobileBarForKeyboard, 50);
        });
    });
}
document.addEventListener("DOMContentLoaded", initMobileBarKeyboardHandling);

// ==========================================
// QUICK ADD MUTATION (SMART SEARCH ENGINE)
// ==========================================
const compoundReplacements = {
    "blue 1": "blue1",
    "blue 2": "blue2",
    "b 1 b 2": "b1b2",
    "b 1": "b1",
    "b 2": "b2",
    "aquab1": "aquablue1",
    "aquab2": "aquablue2",
    "sapphireb1": "sapphireblue1",
    "sapphireb2": "sapphireblue2",
    "aqua b1": "aquablue1",
    "aqua b2": "aquablue2",
    "blue1 blue2": "b1b2",
    "b1 b2": "b1b2",
    "aqua blue1": "aquablue1",
    "aqua blue2": "aquablue2",
    "aqua turquoise": "aquaturquoise",
    "pallid ino": "pallidino",
    "pastel ino": "pastelino",
    "dec ino": "decino",
    "pastel dec": "pasteldec",
    "bronze fallow ino": "bronzefallowino",
    "bronze fallow dec": "bronzefallowdec",
    "bronze fallow pastel": "bronzefallowpastel",
    "pale pallid": "palepallid",
    "pale ino": "paleino",
    "sapphire blue1": "sapphireblue1",
    "sapphire blue2": "sapphireblue2",
    "aqua sapphire": "aquasapphire",
    "sapphire aqua": "aquasapphire",
    "sapphire b1": "sapphireblue1",
    "sapphire b2": "sapphireblue2"
};

function levenshteinDistance(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
                );
            }
        }
    }
    return matrix[b.length][a.length];
}

function isFuzzyMatch(input, target) {
    if (input === target) return true;
    if (input.length < 4) return false; 
    let inputNum = input.match(/\d+/);
    let targetNum = target.match(/\d+/);
    if (inputNum || targetNum) {
        if ((inputNum ? inputNum[0] : null) !== (targetNum ? targetNum[0] : null)) return false;
    }
    const distance = levenshteinDistance(input, target);
    const maxErrors = target.length <= 6 ? 1 : 2;
    return distance <= maxErrors;
}

// ==========================================
// POSSIBLE SPLIT — PARSING & CLASSIFICATION (Path A, Step 1)
// ==========================================
// Canonical keyword families. "or split" behaves like bare "or" (mutual exclusivity),
// NOT like the possible-split family, even though it contains the word "split".
const OR_KEYWORDS = ["or split", "or"];
const POSS_KEYWORDS = [
    "possible split", "posibol split", "posible split", "pos split", "poss split",
    "possible", "posibol", "posible", "poss", "pos"
];
const POSS_ALL_DELIMS = [
    ...OR_KEYWORDS.map(k => ({ key: k, type: "OR" })),
    ...POSS_KEYWORDS.map(k => ({ key: k, type: "POSS" }))
].sort((a, b) => b.key.split(' ').length - a.key.split(' ').length);

function fuzzyKeywordMatchWords(words, startIdx, keyPhrase) {
    let keyWords = keyPhrase.split(' ');
    if (startIdx + keyWords.length > words.length) return false;
    for (let j = 0; j < keyWords.length; j++) {
        if (!isFuzzyMatch(words[startIdx + j], keyWords[j])) return false;
    }
    return true;
}

// Finds where the "split section" of a raw query begins: the first '/', the first
// bare word "split", or the first possible/or keyword — whichever comes first.
// Everything before that point is the visual portion; everything from that point
// onward is handed to the possible-split tokenizer/classifier below.
function findSplitSectionStart(query) {
    let lower = query.toLowerCase();
    let slashIdx = lower.indexOf('/');

    let normalized = lower.replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
    let words = normalized.split(' ').filter(w => w);
    let charPositions = [];
    let pos = 0;
    words.forEach(w => {
        let idx = normalized.indexOf(w, pos);
        charPositions.push(idx);
        pos = idx + w.length;
    });

    let earliestWordIdx = -1;
    for (let i = 0; i < words.length; i++) {
        if (words[i] === 'split') { earliestWordIdx = i; break; }
        let hit = false;
        for (let d of POSS_ALL_DELIMS) {
            if (fuzzyKeywordMatchWords(words, i, d.key)) { hit = true; break; }
        }
        if (hit) { earliestWordIdx = i; break; }
    }

    let wordCharIdx = earliestWordIdx !== -1 ? charPositions[earliestWordIdx] : -1;

    if (slashIdx === -1 && wordCharIdx === -1) return -1; // no split section at all
    if (slashIdx === -1) return wordCharIdx;
    if (wordCharIdx === -1) return slashIdx;
    return Math.min(slashIdx, wordCharIdx);
}

// Breaks the split-section text into chunks separated by OR / POSS delimiters
// (including the "//" shorthand), preserving which delimiter preceded each chunk.
function tokenizeSplitSection(text) {
    let norm = text.replace(/\/\//g, ' §§poss§§ ').replace(/\//g, ' split ').replace(/\s+/g, ' ').trim();
    let words = norm.split(' ').filter(w => w);

    let chunks = [];
    let currentWords = [];
    let pendingDelim = null;
    let i = 0;
    while (i < words.length) {
        if (words[i] === '§§poss§§') {
            chunks.push({ text: currentWords.join(' ').trim(), delimiter: pendingDelim });
            currentWords = [];
            pendingDelim = 'POSS';
            i++;
            continue;
        }
        let matched = null;
        for (let d of POSS_ALL_DELIMS) {
            if (fuzzyKeywordMatchWords(words, i, d.key)) { matched = d; break; }
        }
        if (matched) {
            chunks.push({ text: currentWords.join(' ').trim(), delimiter: pendingDelim });
            currentWords = [];
            pendingDelim = matched.type;
            i += matched.key.split(' ').length;
            continue;
        }
        // Treat "split" as a delimiter that resets back to confirmed/certain status
        if (words[i] === 'split') {
            chunks.push({ text: currentWords.join(' ').trim(), delimiter: pendingDelim });
            currentWords = [];
            pendingDelim = null; 
            i++; 
            continue; 
        }
        currentWords.push(words[i]);
        i++;
    }
    chunks.push({ text: currentWords.join(' ').trim(), delimiter: pendingDelim });
    return chunks.filter(c => c.text.length > 0);
}

window.applyPossibleSmartFix = function(sex, id1, id2, dropText) {
    const prefix = sex === 'male' ? 'sire' : 'dam';
    const inputEl = document.getElementById(`${prefix}-search-input`);
    let m1 = mutationDB.find(m => m.id === id1);
    let m2 = mutationDB.find(m => m.id === id2);
    if (!m1 || !m2) return;
    let replacement = `split ${m1.result_label || m1.name} or ${m2.result_label || m2.name}`;
    inputEl.value = inputEl.value.replace(dropText, replacement);
    handleSearchInput(sex);
};
window.applyCompoundSplitFix = function(sex, baseVisStr, split1Id, split2Id) {
    const prefix = sex === 'male' ? 'sire' : 'dam';
    const inputEl = document.getElementById(`${prefix}-search-input`);
    let m1 = mutationDB.find(m => m.id === split1Id);
    let m2 = mutationDB.find(m => m.id === split2Id);
    let s1 = m1 ? m1.name : split1Id;
    let s2 = m2 ? m2.name : split2Id;
    let vis = baseVisStr ? baseVisStr + " " : "";
    inputEl.value = `${vis}split ${s1} poss ${s2}`.trim();
    handleSearchInput(sex);
};
// Same-locus OR pairing where a compound mutation is involved has no safe default
// (e.g. "split aquablue2 or blue1" — aquablue2 isn't a single splittable allele).
// Surface a note with every valid pairwise reading rather than guessing.
function buildOrAxis(a, b, species, sex, rawMatchedText) {
    let aMut = a.dbMut, bMut = b.dbMut;
    if (!aMut || !bMut) return { axes: [{ type: 'or_pair', candidates: [a.trait, b.trait] }], notes: [] };

    let involvesCompound = aMut.isCompound || bMut.isCompound;
    if (involvesCompound && aMut.locus === bMut.locus) {
        let alleleIds = new Set();
        [aMut, bMut].forEach(m => {
            if (m.isCompound) m.alleles.forEach(id => alleleIds.add(id));
            else alleleIds.add(m.id);
        });
        let alleleList = [...alleleIds].filter(id => mutationDB.find(m => m.id === id && !m.isCompound));
        if (alleleList.length >= 3) {
            let pairs = [];
            for (let x = 0; x < alleleList.length; x++) {
                for (let y = x + 1; y < alleleList.length; y++) {
                    let m1 = mutationDB.find(m => m.id === alleleList[x]);
                    let m2 = mutationDB.find(m => m.id === alleleList[y]);
                    if (m1 && m2) pairs.push({ m1, m2 });
                }
            }
            let optionsHtml = pairs.map(p => {
                let label = `Split ${p.m1.name} or ${p.m2.name}`;
                let fixFn = `applyPossibleSmartFix('${sex}', '${p.m1.id}', '${p.m2.id}', '${(rawMatchedText || '').replace(/'/g, "\\'")}')`;
                return `<a href="javascript:void(0)" onclick="${fixFn}" class="smart-fix-btn" style="color:#007bff;text-decoration:underline;cursor:pointer;">${label}</a>`;
            }).join(" &nbsp;|&nbsp; ");
            let note = `⚠️ <strong>Notice:</strong> '${aMut.name}' is a two-allele compound, not a single splittable allele — a bird cannot be "split for" a compound on the ${aMut.locus}-locus. Did you mean:<br>${optionsHtml}`;
            return { axes: [], notes: [note] };
        }
    }
    return { axes: [{ type: 'or_pair', candidates: [a.trait, b.trait] }], notes: [] };
}

// Parses the split-section text into: confirmedTraits (regular splits, unchanged
// behavior), axes (the possible-split / OR scenario structures — rules 3, 4, 4b, 4c),
// and notes (educational notices for genuine forks — rule 10).
function resolvePossibleSplitSection(rawSplitSegment, species, sex) {
    let text = rawSplitSegment.toLowerCase().replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
    for (const [spaced, fused] of Object.entries(compoundReplacements)) {
        text = text.replace(new RegExp(spaced, 'g'), fused);
    }
    let chunks = tokenizeSplitSection(text);

    // Each chunk's text can itself contain more than one resolved trait when words
    // aren't separated by a delimiter (e.g. "dun fallow b1"). Only the LAST trait in
    // a chunk is eligible to pair with a following delimiter; earlier ones are
    // unambiguous confirmed splits mentioned in passing.
    let resolvedChunks = chunks.map(c => {
        let parsed = parseTraitsStr(c.text, species, true);
        let allTraits = parsed.foundTraits;
        let trait = allTraits.length ? allTraits[allTraits.length - 1] : null;
        let extraTraits = allTraits.slice(0, -1);
        let dbMut = trait ? mutationDB.find(m => m.id === trait.id) : null;
        return { ...c, trait, dbMut, extraTraits, allTraits, leftover: parsed.leftover };
    });

    let confirmedTraits = [];
    let axes = [];
    let notes = [];
    let possCount = 0;
    const POSS_CAP = 2;

    // Group consecutive chunks chained by OR into a single group; a group's
    // "entryDelimiter" is whatever delimiter introduced its first member (null or
    // POSS) — that's what decides whether the group keeps "neither" as an option.
    let groups = [];
    resolvedChunks.forEach(chunk => {
        if (!chunk.trait) return;
        // Extra traits inside a POSS-introduced chunk (e.g. "poss dilute blue1") are
        // themselves independently possible, not confirmed — handled per-group below.
        if (chunk.delimiter !== 'POSS') confirmedTraits.push(...chunk.extraTraits);
        if (chunk.delimiter === 'OR' && groups.length > 0) {
            groups[groups.length - 1].members.push(chunk);
        } else {
            groups.push({ entryDelimiter: chunk.delimiter, members: [chunk] });
        }
    });

    let i = 0;
    while (i < groups.length) {
        let g = groups[i];
        if (g.members.length >= 2) {
            // OR-chain: exactly one of the candidates is true (rule 3), unless the
            // chain was itself introduced by a possible-split keyword, in which case
            // "neither" also stays on the table (both are unconfirmed AND mutually
            // exclusive of each other).
            let candidates = g.members.map(m => m.trait);
            if (g.entryDelimiter === null && g.members.length === 2) {
                let res = buildOrAxis(g.members[0], g.members[1], species, sex,
                    `${g.members[0].text} or ${g.members[1].text}`);
                axes.push(...res.axes);
                notes.push(...res.notes);
            } else if (g.entryDelimiter === null) {
                axes.push({ type: 'or_pair', candidates });
            } else {
                if (possCount >= POSS_CAP) {
                    notes.push(`⚠️ <strong>Notice:</strong> Maximum of 2 possible-split mutations per bird — the '${g.members.map(m=>m.dbMut?(m.dbMut.result_label||m.dbMut.name):m.text).join('/')}' possibility was ignored.`);
                } else {
                    axes.push({ type: 'poss_pair_same_locus', candidates });
                    possCount++;
                }
            }
            i++;
            continue;
        }

        // Single-member group.
        let chunk = g.members[0];
        const flushExtraPoss = (traits) => {
            traits.forEach(t => {
                if (possCount >= POSS_CAP) {
                    let dbm = mutationDB.find(m => m.id === t.id);
                    notes.push(`⚠️ <strong>Notice:</strong> Maximum of 2 possible-split mutations per bird — '${dbm ? (dbm.result_label || dbm.name) : t.id}' was ignored.`);
                    return;
                }
                let dbm = mutationDB.find(m => m.id === t.id);
                axes.push({ type: 'poss_single', candidates: [t], dbMut: dbm });
                possCount++;
            });
        };
        if (g.entryDelimiter === null) {
            // Might pair with a following POSS group (rule 4 / rule 10).
            let next = groups[i + 1];
            if (next && next.entryDelimiter === 'POSS' && next.members.length === 1) {
                let possChunk = next.members[0];
                if (possCount >= POSS_CAP) {
                    let name = possChunk.dbMut ? (possChunk.dbMut.result_label || possChunk.dbMut.name) : possChunk.text;
                    notes.push(`⚠️ <strong>Notice:</strong> Maximum of 2 possible-split mutations per bird — '${name}' was ignored.`);
                    confirmedTraits.push(chunk.trait);
                } else if (chunk.dbMut && possChunk.dbMut && chunk.dbMut.locus === possChunk.dbMut.locus &&
                    chunk.dbMut.locus !== "default" && chunk.dbMut.locus !== "Independent Loci") {
                    // Rule 10, silent collapse: "split X poss Y" on a shared locus is really "X or Y"
                    axes.push({ type: 'or_pair', candidates: [chunk.trait, possChunk.trait] });
                } else {
                    axes.push({ type: 'poss_single', candidates: [possChunk.trait], dbMut: possChunk.dbMut });
                    confirmedTraits.push(chunk.trait); 
                    possCount++;
                }
                flushExtraPoss(possChunk.extraTraits);
                i += 2;
                continue;
            }
            confirmedTraits.push(chunk.trait);
            i++;
        } else {
            // Possible-split group with nothing preceding it — every trait mentioned
            // (e.g. "poss dilute blue1") becomes independently possible.
            flushExtraPoss(chunk.allTraits);
            i++;
        }
    }

    // Merge independent poss_single axes that turn out to share a locus into the
    // 3-way "neither / X / Y" form (rule 4c) — "both" is dropped as locus-impossible.
    let mergedAxes = [];
    let usedIdx = new Set();
    axes.forEach((ax, idx) => {
        if (usedIdx.has(idx)) return;
        if (ax.type === 'poss_single') {
            let pairIdx = axes.findIndex((ax2, idx2) =>
                idx2 > idx && !usedIdx.has(idx2) && ax2.type === 'poss_single' &&
                ax2.dbMut && ax.dbMut && ax2.dbMut.locus === ax.dbMut.locus);
            if (pairIdx !== -1) {
                mergedAxes.push({ type: 'poss_pair_same_locus', candidates: [ax.candidates[0], axes[pairIdx].candidates[0]] });
                usedIdx.add(idx); usedIdx.add(pairIdx);
                return;
            }
        }
        mergedAxes.push(ax);
        usedIdx.add(idx);
    });

    let leftover = resolvedChunks.map(c => c.leftover || "").filter(Boolean).join(" ");
    return { confirmedTraits, axes: mergedAxes, notes, leftover };
}

// Rule 1's full scope: "possible split" only ever applies to a genuinely hidden
// carrier state. That excludes two categories, checked here regardless of how the
// axis was built (typed text or, eventually, the manual selector): sex-linked
// recessive traits in females (hemizygous — no carrier state to begin with), and
// any dominant / incomplete-dominant trait (any dose is visibly expressed, so
// there's nothing to be hidden about).
function filterAxesForBird(axesRaw, sex) {
    const isSL = (t) => { let m = mutationDB.find(mm => mm.id === t.id); return m && m.type.includes("SL"); };
    const isDomLike = (t) => { let m = mutationDB.find(mm => mm.id === t.id); return m && ["AID", "AD", "SLID", "SLD"].includes(m.type); };
    let axes = [];
    let notes = [];
    axesRaw.forEach(ax => {
        let candidates = ax.type === 'confirmed_plus_poss' ? [ax.poss] : (ax.candidates || []);

        let domHit = candidates.find(isDomLike);
        if (domHit) {
            notes.push(`⚠️ <strong>Notice:</strong> '${possMutName(domHit)}' is dominant or incomplete-dominant — any dose is visibly expressed, so there's no hidden carrier state for it to be a "possible split." This was ignored; use the regular selector to mark it directly.`);
            if (ax.type === 'confirmed_plus_poss') axes.push({ type: 'confirmed_only_passthrough', confirmed: ax.confirmed });
            return;
        }

        if (sex === "female" && candidates.some(isSL)) {
            notes.push(`⚠️ <strong>Notice:</strong> A possible/uncertain split status doesn't apply to sex-linked traits in female birds (she only has one Z chromosome, so there's no hidden carrier state) — this was ignored.`);
            if (ax.type === 'confirmed_plus_poss') axes.push({ type: 'confirmed_only_passthrough', confirmed: ax.confirmed });
            return;
        }

        axes.push(ax);
    });
    return { axes, notes };
}

const customDictionary = [
    { keys: ["dd", "double dark factor", "double dark", "olive", "df dark", "df dark factor"], res: () => [{id:"dark_factor", val:2}] },
    { keys: ["d", "dark factor", "dark", "sf dark", "sf dark factor"], res: () => [{id:"dark_factor", val:1}] },
    { keys: ["mauve"], res: (sp) => [{id:"dark_factor", val:2}, {id: sp==="roseicollis"?"rose_blue":"blue1", val:2}] },
    { keys: ["cobalt"], res: (sp) => [{id:"dark_factor", val:1}, {id: sp==="roseicollis"?"rose_blue":"blue1", val:2}] },
    { keys: ["aqua homo", "aqua homozygote", "aqua homozygotic"], res: () => [{id:"aqua", val:2}] },
    { keys: ["b1b2", "parblue", "par-blue", "par blue", "pb"], sp: "white_eye_ring", res: () => [{id:"blue1_blue2", val:2}] },
    { keys: ["parblue", "par-blue", "par blue"], sp: "roseicollis", res: () => [{id:"turquoise", val:2}], suggest: () => [{id:"aqua", val:2}] },
    { keys: ["b1", "bl1", "blue", "white collared", "white collar", "white-collared", "white-collar", "whitecollar", "whitecollared", "sky blue", "skyblue)"], sp: "white_eye_ring", res: () => [{id:"blue1", val:2}] },
    { keys: ["blue", "sky blue", "skyblue)", "bl"], sp: "roseicollis", res: () => [{id:"rose_blue", val:2}] },
    { keys: ["b2", "bl2", "b2 white collared", "b2 white collar", "b2 white-collared", "b2 white-collar", "b2 whitecollar", "b2 whitecollared", "bl2 white collared", "bl2 white collar", "bl2 white-collared", "bl2 white-collar", "bl2whitecollar", "bl2whitecollared", "blue2 white collared", " blue2 white collar", " blue2 white-collared", " blue2 white-collar", " blue2whitecollar", " blue2whitecollared", "white collared b2", "white collar b2", "white-collared b2", "white-collar b2", "whitecollar b2", "whitecollared b2", "white collared bl2", "white collar bl2", "white-collared bl2", "white-collar bl2", "whitecollar bl2", "whitecollared bl2", "white collared blue2", "white collar blue2", "white-collared blue2", "white-collar blue2", "whitecollar blue2", "whitecollared blue2"], res: () => [{id:"blue2", val:2}] },
    { keys: ["aqua blue"], sp: "white_eye_ring", res: () => [{id:"aqua_blue1", val:2}] },
    { keys: ["sapphire blue", "orange fronted"], res: () => [{id:"sapphire_blue1", val:2}] },
    { keys: ["sapphire"], res: () => [{id:"sapphire", val:2}] },
    { keys: ["slate", "slaty"], sp: "white_eye_ring", res: () => [{id:"slaty", val:1}] }, 
    { keys: ["slate", "grey"], sp: "roseicollis", res: () => [{id:"grey_factor", val:1}] }, 
    { keys: ["jade", "dm jade"], sp: "roseicollis", res: () => [{id:"dm_jade", val:2}] }, 
    { keys: ["edged", "edge"], sp: "white_eye_ring", res: () => [{id:"dom_edged", val:1}] }, 
    { keys: ["edged", "edge"], sp: "roseicollis", res: () => [{id:"marbled", val:2}] }, 
    { keys: ["lutino black eye", "yellow"], res: () => [{id:"dec", val:2}] },
    { keys: ["albino black eye", "black eye albino", "white"], sp: "white_eye_ring", res: () => [{id:"dec", val:2}, {id:"blue1", val:2}] },
    { keys: ["cremino black eye", "black eye cremino"], sp: "white_eye_ring", res: () => [{id:"dec", val:2}, {id:"blue1_blue2", val:2}] },
    { keys: ["albino red eye", "red eye albino"], sp: "white_eye_ring", res: () => [{id:"nsl_ino", val:2}, {id:"blue1", val:2}] },
    { keys: ["lutino red eye", "red eye lutino"], sp: "white_eye_ring", res: () => [{id:"nsl_ino", val:2}] },
    { keys: ["cremino red eye", "red eye cremino", "creamino red eye", "red eye creamino"], sp: "white_eye_ring", res: () => [{id:"nsl_ino", val:2}, {id:"blue1_blue2", val:2}] },
    { keys: ["albino blue2"], sp: "white_eye_ring", res: () => [{id:"nsl_ino", val:2}, {id:"blue2", val:2}] },
    { keys: ["lutino", "ino"], sp: "roseicollis", res: () => [{id:"sl_ino", val:2}] },
    { keys: ["albino"], sp: "roseicollis", res: () => [{id:"sl_ino", val:2}, {id:"rose_blue", val:2}] },
    { keys: ["cremino", "creamino"], sp: "roseicollis", res: () => [{id:"sl_ino", val:2}, {id:"turquoise", val:2}], suggest: () => [{id:"sl_ino", val:2}, {id:"aqua", val:2}] },
    { keys: ["lutino", "ino"], sp: "white_eye_ring", res: () => [{id:"nsl_ino", val:2}] },
    { keys: ["albino"], sp: "white_eye_ring", res: () => [{id:"nsl_ino", val:2}, {id:"blue1", val:2}] },
    { keys: ["cremino", "creamino"], sp: "white_eye_ring", res: () => [{id:"nsl_ino", val:2}, {id:"blue1_blue2", val:2}] },
    { keys: ["dec"], res: () => [{id:"dec", val:2}] },
    { keys: ["split pied"], res: () => [{id:"rec_pied", val:1}] }, 
    { keys: ["pied"], res: (sp, isSplit) => isSplit ? [{id:"rec_pied", val:1}] : [{id:"dom_pied", val:2}] },
    { keys: ["faded"], res: () => [{id:"faded", val:2}] },
    { keys: ["dominant yellow", "reduced"], res: () => [{id:"dom_reduced", val:1}] }, 
    { keys: ["greywing"], res: () => [{id:"sl_dom_greywing", val:1}] }, 
    { keys: ["australian yellow face", "yellow face", "yellowface", "yf", "orangeface"], res: () => [{id:"orange_face", val:2}] },
    { keys: ["australian cinnamon", "isabel"], res: () => [{id:"pallid", val:2}] },
    { keys: ["american cinnamon", "cinnamon"], res: () => [{id:"cinnamon", val:2}] },
    { keys: ["lacewing"], sp: "roseicollis", res: () => [{id:"cinnamon", val:2}, {id:"sl_ino", val:2}] }, 
    { keys: ["lacewing"], sp: "white_eye_ring", res: () => [{id:"nsl_ino", val:2}, {id:"cinnamon", val:2}] },
    { keys: ["pallidino"], res: () => [{id:"pallid_ino", val:2}] },
    { keys: ["pastelino"], res: () => [{id:"pastel_ino", val:2}] },
    { keys: ["green", "wildtype"], res: () => [] },
    { keys: ["yellow collar", "yellow collared", "yellow-collar", "yellow-collared", "yellowcollar", "yellowcollared"], sp: "white_eye_ring", res: () => [] }, 
    // --- Blue2 ---
    { keys: ["blue2 mauve", "b2 mauve", "bl2 mauve", "mauve blue2", "mauve b2", "mauve bl2"], res: () => [{id:"dark_factor", val:2}, {id:"blue2", val:2}] },
    { keys: ["blue2 cobalt", "b2 cobalt", "bl2 cobalt", "cobalt blue2", "cobalt b2", "cobalt bl2"], res: () => [{id:"dark_factor", val:1}, {id:"blue2", val:2}] },

    // --- Aqua & Turquoise ---
    { keys: ["aqua mauve", "mauve aqua"], res: () => [{id:"dark_factor", val:2}, {id:"aqua", val:2}] },
    { keys: ["aqua cobalt", "cobalt aqua"], res: () => [{id:"dark_factor", val:1}, {id:"aqua", val:2}] },
    { keys: ["turquoise mauve", "mauve turquoise"], sp: "roseicollis", res: () => [{id:"dark_factor", val:2}, {id:"turquoise", val:2}] },
    { keys: ["turquoise cobalt", "cobalt turquoise"], sp: "roseicollis", res: () => [{id:"dark_factor", val:1}, {id:"turquoise", val:2}] },
    // --- Blue1Blue2 (Parblue) ---
    { keys: ["b1b2 mauve", "parblue mauve", "mauve b1b2", "mauve parblue"], sp: "white_eye_ring", res: () => [{id:"dark_factor", val:2}, {id:"blue1_blue2", val:2}] },
    { keys: ["b1b2 cobalt", "parblue cobalt", "cobalt b1b2", "cobalt parblue"], sp: "white_eye_ring", res: () => [{id:"dark_factor", val:1}, {id:"blue1_blue2", val:2}] },

    // --- AquaBlue1 & AquaBlue2 ---
    { keys: ["aquablue1 mauve", "mauve aquablue1", "aqua blue mauve", "mauve aqua blue"], sp: "white_eye_ring", res: () => [{id:"dark_factor", val:2}, {id:"aqua_blue1", val:2}] },
    { keys: ["aquablue1 cobalt", "cobalt aquablue1", "aqua blue cobalt", "cobalt aqua blue"], sp: "white_eye_ring", res: () => [{id:"dark_factor", val:1}, {id:"aqua_blue1", val:2}] },
    
    { keys: ["aquablue2 mauve", "mauve aquablue2", "aqua bl2 mauve", "mauve aqua bl2"], sp: "white_eye_ring", res: () => [{id:"dark_factor", val:2}, {id:"aqua_blue2", val:2}] },
    { keys: ["aquablue2 cobalt", "cobalt aquablue2", "aqua bl2 cobalt", "cobalt aqua bl2"], sp: "white_eye_ring", res: () => [{id:"dark_factor", val:1}, {id:"aqua_blue2", val:2}] },

    // --- AquaTurquoise ---
    { keys: ["aquaturquoise mauve", "mauve aquaturquoise"], sp: "roseicollis", res: () => [{id:"dark_factor", val:2}, {id:"aqua_turquoise", val:2}] },
    { keys: ["aquaturquoise cobalt", "cobalt aquaturquoise"], sp: "roseicollis", res: () => [{id:"dark_factor", val:1}, {id:"aqua_turquoise", val:2}] },
    // --- Sapphire Group ---
    { keys: ["sapphire mauve", "mauve sapphire"], sp: "white_eye_ring", res: () => [{id:"dark_factor", val:2}, {id:"sapphire", val:2}] },
    { keys: ["sapphire cobalt", "cobalt sapphire"], sp: "white_eye_ring", res: () => [{id:"dark_factor", val:1}, {id:"sapphire", val:2}] },
    
    { keys: ["sapphireblue1 mauve", "mauve sapphireblue1", "sapphire blue mauve", "mauve sapphire blue"], sp: "white_eye_ring", res: () => [{id:"dark_factor", val:2}, {id:"sapphire_blue1", val:2}] },
    { keys: ["sapphireblue1 cobalt", "cobalt sapphireblue1", "sapphire blue cobalt", "cobalt sapphire blue"], sp: "white_eye_ring", res: () => [{id:"dark_factor", val:1}, {id:"sapphire_blue1", val:2}] },

    { keys: ["sapphireblue2 mauve", "mauve sapphireblue2", "sapphire bl2 mauve", "mauve sapphire bl2"], sp: "white_eye_ring", res: () => [{id:"dark_factor", val:2}, {id:"sapphire_blue2", val:2}] },
    { keys: ["sapphireblue2 cobalt", "cobalt sapphireblue2", "sapphire bl2 cobalt", "cobalt sapphire bl2"], sp: "white_eye_ring", res: () => [{id:"dark_factor", val:1}, {id:"sapphire_blue2", val:2}] },

    { keys: ["aquasapphire mauve", "mauve aquasapphire"], sp: "white_eye_ring", res: () => [{id:"dark_factor", val:2}, {id:"aqua_sapphire", val:2}] },
    { keys: ["aquasapphire cobalt", "cobalt aquasapphire"], sp: "white_eye_ring", res: () => [{id:"dark_factor", val:1}, {id:"aqua_sapphire", val:2}] },
    // --- Translate Turquoise to Parblue for White Eye-Rings ---
    { keys: ["turquoise", "turquoise blue"], sp: "white_eye_ring", res: () => [{id:"blue1_blue2", val:2}] },
    { keys: ["turquoise mauve", "mauve turquoise"], sp: "white_eye_ring", res: () => [{id:"dark_factor", val:2}, {id:"blue1_blue2", val:2}] },
    { keys: ["turquoise cobalt", "cobalt turquoise"], sp: "white_eye_ring", res: () => [{id:"dark_factor", val:1}, {id:"blue1_blue2", val:2}] },
    // --- New Common Names & Nicknames ---
    { keys: ["dun"], res: () => [{id:"dun_fallow", val:2}] },
    { keys: ["bronz", "bronze"], res: () => [{id:"bronze_fallow", val:2}] },
    { keys: ["opa", "biola"], res: () => [{id:"opaline", val:2}] },
    { keys: ["medium green", "medium"], res: () => [{id:"dark_factor", val:1}] },
    { keys: ["laurel", "laurel green"], res: () => [{id:"dark_factor", val:2}] },
    
    // Roseicollis Head & Face Modifiers
    { keys: ["white face", "whiteface"], sp: "roseicollis", res: () => [{id:"rose_blue", val:2}] },
    { keys: ["white head", "whitehead", "white headed", "whiteheaded"], sp: "roseicollis", res: () => [{id:"opaline", val:2}, {id:"rose_blue", val:2}] },
    { keys: ["red head", "redhead", "red headed", "redheaded"], sp: "roseicollis", res: () => [{id:"opaline", val:2}] },
    { keys: ["orange head", "orangehead", "orange headed", "orangeheaded"], sp: "roseicollis", res: () => [{id:"orange_face", val:2}, {id:"opaline", val:2}] },
    
    // Sea Green (Species Split)
    { keys: ["sea green", "seagreen"], sp: "roseicollis", res: () => [{id:"aqua", val:2}] },
    { keys: ["sea green", "seagreen"], sp: "white_eye_ring", res: () => [{id:"blue1_blue2", val:2}] },
    
    // Lime (Applies Pallid, Suggests Pastel)
    { keys: ["lime"], sp: "roseicollis", res: () => [{id:"pallid", val:2}], suggest: () => [{id:"pastel", val:2}] },
    
    // Lavender (Species Split for correct blue allele)
    { keys: ["lavender"], sp: "white_eye_ring", res: () => [{id:"pallid", val:2}, {id:"violet", val:2}, {id:"dark_factor", val:1}, {id:"blue1", val:2}] },
    { keys: ["lavender"], sp: "roseicollis", res: () => [{id:"pallid", val:2}, {id:"violet", val:2}, {id:"dark_factor", val:1}, {id:"rose_blue", val:2}] },
    
    // Dutch Blue
    { keys: ["dutch blue", "dutchblue"], sp: "roseicollis", res: () => [{id:"turquoise", val:2}] },
    
    // Pied Modifiers
    { keys: ["clear pied", "clearpied", "heavy pied", "heavypied"], res: () => [{id:"dom_pied", val:2}] },
];

function buildDynamicDictionary(species) {
    let entries = [];
    customDictionary.forEach(entry => {
        if (!entry.sp || entry.sp === species) {
            entry.keys.forEach(k => entries.push({ key: k, res: entry.res, suggest: entry.suggest }));
        }
    });
    mutationDB.forEach(mut => {
        if (mut.sp[species]) {
            let name = mut.result_label || mut.name;
            name = name.replace(/\*/g, '').toLowerCase(); 
            entries.push({ key: name, res: () => [{id: mut.id, val: 2}] });
        }
    });
    return entries.sort((a, b) => b.key.length - a.key.length);
}

function parseTraitsStr(str, species, isSplit) {
    let text = str.toLowerCase().replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
    // Pre-process compound text so spaces don't break them
    for (const [spaced, fused] of Object.entries(compoundReplacements)) {
        text = text.replace(new RegExp(spaced, 'g'), fused);
    }

    let foundTraits = [];
    let suggestedTraits = [];
    let allEntries = buildDynamicDictionary(species);
    let words = text.split(' ');

    // NEW LOGIC: Left-to-Right Chronological Parsing
    let i = 0;
    while (i < words.length) {
        let matchFound = false;
        
        // allEntries is still sorted longest-to-shortest, so it correctly 
        // prioritizes "double dark" over "dark" at this exact word position
        for (let entry of allEntries) {
            let keyWords = entry.key.split(' ');
            
            // Check if there are enough words left in the array to match this key
            if (i + keyWords.length <= words.length) {
                let isMatch = true;
                for (let j = 0; j < keyWords.length; j++) {
                    if (!isFuzzyMatch(words[i+j], keyWords[j])) {
                        isMatch = false;
                        break;
                    }
                }
                
                if (isMatch) {
                    // Look for modifiers right before or right after the matched term
                    let explicitZyg = null, explicitZ = null, explicitT = null;
                    let modBefore = i > 0 ? words[i-1] : null;
                    let modAfter = i + keyWords.length < words.length ? words[i + keyWords.length] : null;

                    [modBefore, modAfter].forEach(mod => {
                        if (!mod) return;
                        if (mod === 'sf') explicitZyg = 1;
                        if (mod === 'df') explicitZyg = 2;
                        if (mod === 'z1' || mod === 'z2') explicitZ = mod;
                        if (mod === 't1' || mod === 'type1') explicitT = 'T1';
                        if (mod === 't2' || mod === 'type2') explicitT = 'T2';
                    });

                    let traitsToApply = entry.res(species, isSplit);
                    let traitsToSuggest = entry.suggest ? entry.suggest(species, isSplit) : [];
                    
                    const processTrait = (t, targetArray) => {
                        let dbMut = mutationDB.find(m => m.id === t.id);
                        if (!dbMut) return;
                        if (!dbMut.sp[species]) return;

                        let finalVal = isSplit ? 1 : (t.val || 2); 
                        if (!isSplit && dbMut.id !== "dark_factor") {
                            if (dbMut.type === "AID" || dbMut.type === "SLID" || dbMut.type === "SLD") finalVal = 1;
                            if (dbMut.type === "AD") finalVal = 2;
                        }
                        if (explicitZyg !== null && !isSplit && dbMut.id !== "dark_factor") finalVal = explicitZyg;

                        let traitObj = { id: t.id, val: finalVal, isSplit: isSplit, locus: dbMut.locus, type: dbMut.type };
                        let needsLinkage = isSplit || finalVal === 1; 
                        
                        if (dbMut.type.includes("SL") && needsLinkage) traitObj.z = explicitZ;
                        if (dbMut.id === "dark_factor" && needsLinkage) traitObj.t = explicitT || "T1";
                        
                        targetArray.push(traitObj);
                    };

                    traitsToApply.forEach(t => processTrait(t, foundTraits));
                    traitsToSuggest.forEach(t => processTrait(t, suggestedTraits));

                    // Remove the matched words from the array and stop checking dictionary
                    words.splice(i, keyWords.length);
                    matchFound = true;
                    break; 
                }
            }
        }
        
        // Only move to the next word if we didn't find a match at this position
        if (!matchFound) {
            i++;
        }
    }

    return { foundTraits, suggestedTraits, leftover: words.join(' ') };
}

window.applySmartFix = function(sex, compoundId) {
    const prefix = sex === 'male' ? 'sire' : 'dam';
    const inputEl = document.getElementById(`${prefix}-search-input`);
    const species = document.getElementById("species").value;
    
    // Parse current input quietly
    let parsed = processSearchQuery(inputEl.value, species, sex);
    
    let newQueryParts = [];
    let splitParts = [];
    let compoundMut = mutationDB.find(x => x.id === compoundId);
    
    // Harvest valid visuals
    parsed.visuals.forEach(t => {
        let m = mutationDB.find(x => x.id === t.id);
        // Exclude alleles belonging to the fixed compound
        if (compoundMut && compoundMut.alleles.includes(t.id)) return;
        if (m) newQueryParts.push(m.result_label || m.name);
    });
    
    // Inject the new compound visual
    if (compoundMut) {
        newQueryParts.push(compoundMut.result_label || compoundMut.name);
    }
    
    // Harvest valid splits
    parsed.splits.forEach(t => {
        let m = mutationDB.find(x => x.id === t.id);
        if (compoundMut && compoundMut.alleles.includes(t.id)) return;
        if (m) splitParts.push(m.result_label || m.name);
    });
    
    // Reconstruct the perfect string
    let finalString = newQueryParts.join(" ");
    if (splitParts.length > 0) {
        finalString += " split " + splitParts.join(" split ");
    }
    
    inputEl.value = finalString.trim();
    handleSearchInput(sex); // Refresh the engine with the fixed text
};

function processSearchQuery(query, species, sex) {
    if (!query) return { visuals: [], splits: [], suggested: [], leftover: "", warningText: "", ownBreedingWarnings: [], possibleAxes: [] };

    // Boundary now also opens on any possible-split / "or" keyword, not just '/' or
    // a bare "split", since "possible split X" and "poss X" are valid entry points
    // on their own (e.g. "Green poss dilute" has no literal "split" word before it).
    let splitSectionStart = findSplitSectionStart(query);
    let visualStr = splitSectionStart === -1 ? query : query.slice(0, splitSectionStart);
    let splitSectionRaw = splitSectionStart === -1 ? "" : query.slice(splitSectionStart);

    let parsedVis = parseTraitsStr(visualStr, species, false);
    let possibleParsed = resolvePossibleSplitSection(splitSectionRaw, species, sex);

    let rawVisuals = parsedVis.foundTraits;
    let rawSplits = possibleParsed.confirmedTraits;
    let suggested = [...parsedVis.suggestedTraits];
    let possibleAxes = possibleParsed.axes;
    let possibleNotes = possibleParsed.notes;

    // --- BUG 1 (SCENARIO A): COMPOUND SPLIT INTERCEPT ---
    let compoundMut = null;
    let locusAlleles = new Set();

    const checkCompound = (t) => {
        if (!t) return;
        let m = mutationDB.find(x => x.id === t.id);
        if (m && m.isCompound && m.locus !== "default" && m.locus !== "Independent Loci") {
            compoundMut = m;
        }
    };

    rawSplits.forEach(checkCompound);
    possibleAxes.forEach(ax => {
        if (ax.type === 'confirmed_plus_poss') { checkCompound(ax.confirmed); checkCompound(ax.poss); }
        else if (ax.candidates) { ax.candidates.forEach(checkCompound); }
    });

    if (compoundMut) {
        const addAlleles = (t) => {
            if (!t) return;
            let m = mutationDB.find(x => x.id === t.id);
            if (m && m.locus === compoundMut.locus) {
                if (m.isCompound) m.alleles.forEach(a => locusAlleles.add(a));
                else locusAlleles.add(m.id);
            }
        };
        rawSplits.forEach(addAlleles);
        possibleAxes.forEach(ax => {
            if (ax.type === 'confirmed_plus_poss') { addAlleles(ax.confirmed); addAlleles(ax.poss); }
            else if (ax.candidates) { ax.candidates.forEach(addAlleles); }
        });

        rawSplits = rawSplits.filter(t => {
            let m = mutationDB.find(x => x.id === t.id);
            return !(m && m.isCompound && m.locus === compoundMut.locus);
        });

        let validAxesPre = [];
        possibleAxes.forEach(ax => {
            let involvesCompoundLocus = false;
            let cands = ax.type === 'confirmed_plus_poss' ? [ax.confirmed, ax.poss] : (ax.candidates || []);
            cands.forEach(t => {
                if (!t) return;
                let m = mutationDB.find(x => x.id === t.id);
                if (m && m.locus === compoundMut.locus) involvesCompoundLocus = true;
            });
            if (!involvesCompoundLocus) validAxesPre.push(ax);
        });
        possibleAxes = validAxesPre;

        let arrIds = Array.from(locusAlleles);
        let arrNames = arrIds.map(id => {
            let dbm = mutationDB.find(m => m.id === id);
            return dbm ? (dbm.result_label || dbm.name).toLowerCase() : id;
        });
        
        let baseVisNames = parsedVis.foundTraits.map(t => {
            let m = mutationDB.find(x => x.id === t.id);
            return m ? m.name : t.id;
        }).join(" ");
        let visPrefix = baseVisNames || "Green";
        
        let opts = [];
        if (arrIds.length >= 3) {
            let a0 = arrNames[0], a1 = arrNames[1], a2 = arrNames[2];
            let id0 = arrIds[0], id1 = arrIds[1], id2 = arrIds[2];
            opts.push(`1. <a href="javascript:void(0)" onclick="applyCompoundSplitFix('${sex}', '${baseVisNames.replace(/'/g, "\\'")}', '${id0}', '${id1}')" style="color:#007bff;text-decoration:underline;">${visPrefix} / ${a0} // ${a1}</a>`);
            opts.push(`2. <a href="javascript:void(0)" onclick="applyCompoundSplitFix('${sex}', '${baseVisNames.replace(/'/g, "\\'")}', '${id0}', '${id2}')" style="color:#007bff;text-decoration:underline;">${visPrefix} / ${a0} // ${a2}</a>`);
            opts.push(`3. <a href="javascript:void(0)" onclick="applyCompoundSplitFix('${sex}', '${baseVisNames.replace(/'/g, "\\'")}', '${id1}', '${id2}')" style="color:#007bff;text-decoration:underline;">${visPrefix} / ${a1} // ${a2}</a>`);
        } else if (arrIds.length === 2) {
            let a0 = arrNames[0], a1 = arrNames[1];
            let id0 = arrIds[0], id1 = arrIds[1];
            opts.push(`1. <a href="javascript:void(0)" onclick="applyCompoundSplitFix('${sex}', '${baseVisNames.replace(/'/g, "\\'")}', '${id0}', '${id1}')" style="color:#007bff;text-decoration:underline;">${visPrefix} / ${a0} // ${a1}</a>`);
        }

        let optionsHtml = opts.length > 0 ? `<br><br>If you are unsure of the bird's exact genetics, try one of these valid options instead (click to apply):<br>${opts.join("<br>")}` : "";
        let compoundName = compoundMut.result_label || compoundMut.name;
        possibleNotes.push(`⚠️ <strong>Notice:</strong> A bird cannot be "split" for <strong>${compoundName}</strong>. Because ${compoundName} is a compound mutation, it already takes up both available spots on the gene. It cannot be carried as a single hidden split.${optionsHtml}`);
    }
    // ---------------------------------------------------

    let mergedVisuals = [];
    rawVisuals.forEach(t => {
        if (t.locus === "default" || t.locus === "Independent Loci") {
            mergedVisuals.push(t);
        } else {
            let existingIdx = mergedVisuals.findIndex(v => v.locus === t.locus);
            if (existingIdx !== -1) {
                let t1 = mergedVisuals[existingIdx];
                let m1 = mutationDB.find(m => m.id === t1.id);
                let m2 = mutationDB.find(m => m.id === t.id);

                if (t1.id === t.id) {
                    t1.val = 2; 
                } else if (m1 && m2 && !m1.isCompound && !m2.isCompound) {
                    let allele1 = m1.alleles[0];
                    let allele2 = m2.alleles[0];
                    let compound = mutationDB.find(m => m.isCompound && m.alleles.includes(allele1) && m.alleles.includes(allele2));
                    if (compound) {
                        t1.id = compound.id;
                        t1.val = 2;
                        t1.type = compound.type;
                    } else {
                        mergedVisuals.push(t);
                    }
                } else {
                    mergedVisuals.push(t); 
                }
            } else {
                mergedVisuals.push(t);
            }
        }
    });

    let mergedSplits = [];
    let splitWarnings = [];

    // ==========================================
    // Intra-Array Split-Split Fusion Loop 
    // ==========================================
    rawSplits.forEach(t => {
        if (t.locus === "default" || t.locus === "Independent Loci") {
            mergedSplits.push(t);
        } else {
            let existingIdx = mergedSplits.findIndex(s => s.locus === t.locus);
            if (existingIdx !== -1) {
                let t1 = mergedSplits[existingIdx];
                let m1 = mutationDB.find(m => m.id === t1.id);
                let m2 = mutationDB.find(m => m.id === t.id);

                if (t1.id === t.id) {
                    splitWarnings.push(`Notice: '${m2.name}' (split) was ignored as it was already added.`);
                } else if (m1 && m2 && !m1.isCompound && !m2.isCompound) {
                    let allele1 = m1.alleles[0];
                    let allele2 = m2.alleles[0];
                    let compound = mutationDB.find(m => m.isCompound && m.alleles.includes(allele1) && m.alleles.includes(allele2));
                    
                    if (compound) {
                        let compoundName = compound.result_label || compound.name;
                        
                        let baseVisNames = parsedVis.foundTraits.map(x => {
                            let m = mutationDB.find(dbm => dbm.id === x.id);
                            return m ? m.name : x.id;
                        }).join(" ");
                        let visPrefix = baseVisNames || "Green";
                        
                        let a0 = (m1.result_label || m1.name).toLowerCase();
                        let a1 = (m2.result_label || m2.name).toLowerCase();
                        
                        let opts = [];
                        opts.push(`1. <a href="javascript:void(0)" onclick="applyCompoundSplitFix('${sex}', '${baseVisNames.replace(/'/g, "\\'")}', '${m1.id}', '${m2.id}')" style="color:#007bff;text-decoration:underline;">${visPrefix} / ${a0} // ${a1}</a>`);
                        opts.push(`2. <a href="javascript:void(0)" onclick="applyCompoundSplitFix('${sex}', '${baseVisNames.replace(/'/g, "\\'")}', '${m2.id}', '${m1.id}')" style="color:#007bff;text-decoration:underline;">${visPrefix} / ${a1} // ${a0}</a>`);

                        let optionsHtml = `<br><br>If you are unsure of the bird's exact genetics, try one of these valid options instead (click to apply):<br>${opts.join("<br>")}`;

                        splitWarnings.push(`⚠️ <strong>Notice:</strong> '${m2.name}' (split) was ignored. A bird cannot carry two hidden alleles on the same gene (${t.locus}-locus). Carrying both '${m1.name}' and '${m2.name}' would automatically make this bird a visual ${compoundName} compound.${optionsHtml}`);
                    } else {
                        splitWarnings.push(`⚠️ <strong>Notice:</strong> '${m2.name}' (split) was ignored. A bird cannot carry two hidden alleles on the same gene (${t.locus}-locus).`);
                    }
                } else {
                    splitWarnings.push(`⚠️ <strong>Notice:</strong> '${m2.name}' (split) was ignored due to biological capacity limits on the ${t.locus}-locus.`);
                }
            } else {
                mergedSplits.push(t);
            }
        }
    });

    let finalRawSplits = [];
    
    // ==========================================
    // Cross-Array Fusion 
    // ==========================================
    mergedSplits.forEach(s => {
        let vIndex = mergedVisuals.findIndex(v => v.locus === s.locus && v.locus !== "default" && v.locus !== "Independent Loci");
        if (vIndex !== -1) {
            let v = mergedVisuals[vIndex];
            let mv = mutationDB.find(m => m.id === v.id);
            let ms = mutationDB.find(m => m.id === s.id);

            if (v.id === s.id) {
                splitWarnings.push(`Notice: '${ms.name}' (split) was ignored because the bird is already visually '${mv.name}'.`);
            } else if (mv && ms && !mv.isCompound && !ms.isCompound) {
                let vAllele = mv.alleles[0];
                let sAllele = ms.alleles[0];
                let compound = mutationDB.find(m => m.isCompound && m.alleles.includes(vAllele) && m.alleles.includes(sAllele));
                if (compound) {
                    let compoundName = compound.result_label || compound.name;
                    let fixFn = `applySmartFix('${sex}', '${compound.id}')`;
                    splitWarnings.push(`⚠️ <strong>Notice:</strong> '${ms.name}' (split) was ignored. A bird cannot be visually '${mv.name}' and split to '${ms.name}' at the same time (${s.locus}-locus). This combination automatically creates a visual ${compoundName} compound.<br><br>💡 <strong>Did you mean to create a visual compound?</strong> <a href="javascript:void(0)" onclick="${fixFn}" class="smart-fix-btn" style="color: #007bff; text-decoration: underline; cursor: pointer;">Click here to apply: <strong>[${compoundName}]</strong></a>`);
                } else {
                    if (v.val === 2) {
                        splitWarnings.push(`⚠️ <strong>Notice:</strong> This combination is biologically impossible. A visual <strong>${mv.result_label || mv.name}</strong> bird already has both spots on its gene filled (it has two copies of ${mv.result_label || mv.name}). Because there is no room left, it cannot carry an extra hidden <strong>${ms.result_label || ms.name}</strong> split.`);
                    } else {
                        splitWarnings.push(`⚠️ <strong>Notice:</strong> '${ms.name}' (split) was ignored due to a biological conflict on the ${s.locus}-locus with visual '${mv.name}'.`);
                    }
                }
            } else {
                if (v.val === 2) {
                    splitWarnings.push(`⚠️ <strong>Notice:</strong> This combination is biologically impossible. A visual <strong>${mv.result_label || mv.name}</strong> bird already has both spots on its gene filled (it has two copies of ${mv.result_label || mv.name}). Because there is no room left, it cannot carry an extra hidden <strong>${ms.result_label || ms.name}</strong> split.`);
                } else {
                    splitWarnings.push(`⚠️ <strong>Notice:</strong> '${ms.name}' (split) was ignored due to a biological conflict on the ${s.locus}-locus with visual '${mv.name}'.`);
                }
            }
        } else {
            finalRawSplits.push(s);
        }
    });

    let finalVisuals = [];
    let finalSplits = [];
    let rejectedNames = [];
    let locusCapacity = {};

    let allCombined = [...mergedVisuals, ...finalRawSplits];
    allCombined.forEach(t => {
        let dbMut = mutationDB.find(m => m.id === t.id);
        if (!dbMut) return;

        let capacityKey = t.locus;
        if (capacityKey !== "default" && capacityKey !== "Independent Loci" && locusCapacity[capacityKey]) {
            rejectedNames.push(dbMut.name);
        } else {
            if (capacityKey !== "default" && capacityKey !== "Independent Loci") {
                locusCapacity[capacityKey] = true;
            }
            if (t.isSplit) finalSplits.push(t);
            else finalVisuals.push(t);
        }
    });

    // --- BUG 1 (SCENARIO B): POSSIBLE SPLIT CAPACITY CHECK ---
    let locusSlots = {};
    finalVisuals.concat(finalSplits).forEach(t => {
        let dbMut = mutationDB.find(m => m.id === t.id);
        if (!dbMut || dbMut.locus === "default" || dbMut.locus === "Independent Loci") return;
        locusSlots[dbMut.locus] = (locusSlots[dbMut.locus] || 0) + (t.isSplit ? 1 : (t.val || 2));
    });

    let validAxesPost = [];
    possibleAxes.forEach(ax => {
        let candidates = ax.type === 'confirmed_plus_poss' ? [ax.poss] : (ax.candidates || []);
        let conflictTrait = null;
        let visualTrait = null;
        
        candidates.forEach(t => {
            let dbMut = mutationDB.find(m => m.id === t.id);
            if (!dbMut || dbMut.locus === "default" || dbMut.locus === "Independent Loci") return;
            
            if (locusSlots[dbMut.locus] >= 2) {
                conflictTrait = dbMut;
                let v = finalVisuals.find(x => mutationDB.find(m => m.id === x.id)?.locus === dbMut.locus);
                if (v) visualTrait = mutationDB.find(m => m.id === v.id);
            }
        });
        
        if (conflictTrait && visualTrait) {
            splitWarnings.push(`⚠️ <strong>Notice:</strong> This combination is biologically impossible. A visual <strong>${visualTrait.result_label || visualTrait.name}</strong> bird already has both spots on its gene filled (it has two copies of ${visualTrait.result_label || visualTrait.name}). Because there is no room left, it cannot carry an extra hidden <strong>${conflictTrait.result_label || conflictTrait.name}</strong> split.`);
            if (ax.type === 'confirmed_plus_poss') {
                validAxesPost.push({ type: 'confirmed_only_passthrough', confirmed: ax.confirmed });
            }
        } else {
            validAxesPost.push(ax);
        }
    });
    possibleAxes = validAxesPost;
    // ---------------------------------------------------------

    let hasViolet = finalVisuals.concat(finalSplits).some(t => t.id === "violet");
    if (hasViolet) {
        let baseColors = ["green", "blue2", "aqua", "aqua_blue1", "aqua_blue2", "blue1_blue2", "sapphire", "sapphire_blue1", "sapphire_blue2", "aqua_sapphire", "turquoise", "rose_blue"];
        let hasBase = finalVisuals.concat(finalSplits).some(t => baseColors.includes(t.id));
        
        if (!hasBase && !finalVisuals.concat(finalSplits).some(t => t.id === "blue1")) {
            if (species === "white_eye_ring") {
                finalVisuals.push({id: "blue1", val: 2, isSplit: false, locus: "bl", type: "AR"});
            } else if (species === "roseicollis") {
                finalVisuals.push({id: "rose_blue", val: 2, isSplit: false, locus: "bl", type: "AR"});
            }
        }
    }
    
    let leftoverRaw = (parsedVis.leftover + " " + (possibleParsed.leftover || "")).trim().toLowerCase();
    
    // FIX: Added 'split' and '/' to ignorePhrases so they are silently removed from leftovers
    let ignorePhrases = [
        "lovebird", "love bird", "agapornis",
        "and", "with", "the", "a", "sf", "df", "z1", "z2", "t1", "t2", "type", "type1", "type2",
        "split", "/"
    ];
    
    if (species === "white_eye_ring") {
        ignorePhrases.push("fischeri", "fischer", "fisher", "fisheri", "fishri", "fischri", "black-masked", "black masked", "black-mask", "black mask", "yellow-collared", "yellow collared", "yellow collar", "yellow-collar", "personatus", "personata", "blackmask", "blackmasked", "yellowcollared", "yellowcollar", "lilianae", "nyasa", "black-cheeked", "black cheeked", "black cheek", "black-cheek", "nigrigenis", "blackcheeked", "blackcheek");
    } else if (species === "roseicollis") {
        ignorePhrases.push("roseicollis", "rosy-faced", "rosy faced", "rosyfaced", "rosy face", "rosy-face", "rosy", "peach-faced", "peach faced", "peach face", "peach-face", "peachface", "rosyface", "peachfaced");
    } else if (species === "taranta") {
        ignorePhrases.push("black-winged", "black winged", "black wing", "black-wing", "abyssinian", "abyssinia", "blackwinged", "blackwing");
    }

    ignorePhrases.sort((a, b) => b.length - a.length);

    ignorePhrases.forEach(phrase => {
        let escapedPhrase = phrase.replace(/[-]/g, '\\-');
        let regex = new RegExp("\\b" + escapedPhrase + "\\b", "g"); 
        leftoverRaw = leftoverRaw.replace(regex, " ");
    });

    let remainingWords = leftoverRaw.split(/[\s]+/).filter(w => w);
    let leftover = remainingWords.join(' ').trim();

    // --- Unified Quick Add Warnings for Parents ---
    // Delegates to the single canonical rule-checker (generateBreedingWarnings)
    // instead of a second hand-written copy of the same 4 rules, so the
    // Search Box can never drift out of sync with the Live Preview / Final
    // Results warnings again.
    let visualIDs = finalVisuals.map(t => t.id);
    let splitOnlyIDs = finalSplits.map(t => t.id);

    let ownBreedingWarnings = generateBreedingWarnings(visualIDs, splitOnlyIDs);
    ownBreedingWarnings.forEach(msg => {
        splitWarnings.push(`⚠️ <strong>Notice:</strong> ${msg}`);
    });
    // ---------------------------------------------------
    


    let warningText = [...splitWarnings, ...possibleNotes].join("<br><br>");
    if (rejectedNames.length > 0) {
        if (warningText) warningText += "<br><br>";
        warningText += `Notice: The selection '${rejectedNames.join(", ")}' was ignored because the maximum capacity (2 alleles) for this locus is already full. `;
    }
    if (leftover.length > 0) {
        if (warningText) warningText += "<br><br>";
        warningText += `Unrecognized term detected: '${leftover}'. Please check your spelling.`;
    }

    return { visuals: finalVisuals, splits: finalSplits, suggested: suggested, leftover: leftover, warningText: warningText.trim(), ownBreedingWarnings: ownBreedingWarnings, possibleAxes: possibleAxes };
}

function applyTraitToUI(trait, containerId, sex) {
    const container = document.getElementById(containerId);
    let cb = container.querySelector(`input[data-id="${trait.id}"]`);
    if (!cb) return;

    if (!cb.checked) {
        cb.checked = true;
        toggleMutation(cb, containerId, sex);
    }
    
    let valRadio = container.querySelector(`input[name="${sex}_${trait.id}"][value="${trait.val}"]`);
    if (valRadio) valRadio.checked = true;

    if (trait.z && sex === "male") {
        let zRadio = container.querySelector(`input[name="${sex}_${trait.id}_z"][value="${trait.z}"]`);
        if (zRadio) zRadio.checked = true;
    }
    if (trait.t) {
        let tRadio = container.querySelector(`input[name="${sex}_${trait.id}_t"][value="${trait.t}"]`);
        if (tRadio) tRadio.checked = true;
    }
}

function renderLinkageUI(visuals, splits, containerId, sex) {
    const linkageControls = document.getElementById(`${containerId.split('-')[0]}-linkage-controls`);
    linkageControls.innerHTML = '';
    if (sex !== "male") return;

    let allTraits = [...visuals, ...splits];
    let html = '';

    let hasDF = allTraits.some(t => t.id === "dark_factor" && (t.val === 1 || t.isSplit));
    let blueTrait = allTraits.find(t => t.locus === "bl" && t.id !== "green");
    
    if (hasDF && blueTrait && (blueTrait.val === 1 || blueTrait.isSplit)) {
        let dfTrait = allTraits.find(t => t.id === "dark_factor");
        let activeT = dfTrait.t || "T1";
        html += `
        <div class="t-assign" style="display:flex;">
            <div class="linkage-row">
                <span class="linkage-label">Dark Factor Phase</span>
                <label><input type="radio" name="${sex}_search_df_t" value="T1" ${activeT === 'T1' ? 'checked' : ''} onchange="updateSearchLinkage('${containerId}', '${sex}', 'dark_factor', 't', 'T1')"> T1</label>
                <label><input type="radio" name="${sex}_search_df_t" value="T2" ${activeT === 'T2' ? 'checked' : ''} onchange="updateSearchLinkage('${containerId}', '${sex}', 'dark_factor', 't', 'T2')"> T2</label>
            </div>
            <div class="linkage-hint">Note on Dark Factor Linkage: <strong>T1</strong> = Dark factor linked to green/wildtype chromosome (Type 1). <strong>T2</strong> = Dark factor linked to blue mutant chromosome (Type 2). This affects breeding outcomes when paired with blue-series birds.</div>
        </div>`;
    }

    let slTraits = allTraits.filter(t => t.type.includes("SL") && (t.val === 1 || t.isSplit));
    slTraits.forEach(trait => {
        let activeZ = trait.z || "z1";
        let dbMut = mutationDB.find(m => m.id === trait.id);
        let mutName = dbMut.name;
        let hintHTML = dbMut.type === "SLR" ? `<div class="linkage-hint">Z Chromosome Note: In males, each Z chromosome can carry different mutations. Placing two SL recessive mutations on the same Z (e.g., <strong>both on Z1</strong>) is required to create crossover phenotypes like <strong>opaline-SL ino</strong>, <strong>opaline-cinnamon</strong>, etc.</div>` : "";
        
        html += `
        <div class="z-assign" style="display:flex;">
            <div class="linkage-row">
                <span class="linkage-label">${mutName.charAt(0).toUpperCase() + mutName.slice(1)} Assignment</span>
                <label><input type="radio" name="${sex}_search_${trait.id}_z" value="z1" ${activeZ === 'z1' ? 'checked' : ''} onchange="updateSearchLinkage('${containerId}', '${sex}', '${trait.id}', 'z', 'z1')"> Z1</label>
                <label><input type="radio" name="${sex}_search_${trait.id}_z" value="z2" ${activeZ === 'z2' ? 'checked' : ''} onchange="updateSearchLinkage('${containerId}', '${sex}', '${trait.id}', 'z', 'z2')"> Z2</label>
            </div>
            ${hintHTML}
        </div>`;
    });

    linkageControls.innerHTML = html;
}

window.updateSearchLinkage = function(containerId, sex, traitId, type, val) {
    const container = document.getElementById(containerId);
    let targetRadio = container.querySelector(`input[name="${sex}_${traitId}_${type}"][value="${val}"]`);
    if (targetRadio) {
        targetRadio.checked = true;
        handleConstraints(containerId, sex);
        renderLivePreview();
    }
};

function buildSuggestionButton(t, containerId, sex, autoSelectMode, isAlternative = false, isPoss = false) {
    let dbMut = mutationDB.find(m => m.id === t.id);
    if (!dbMut) return null;
    let btn = document.createElement('button');
    btn.className = 'suggestion-btn';
    
    let cb = document.getElementById(containerId).querySelector(`input[data-id="${t.id}"]`);
    let isCurrentlyApplied = cb && cb.checked;
    
    let labelPrefix = isAlternative ? "Alt: " : "";
    let zygosityLabel = "";
    
    if (isPoss) {
        zygosityLabel = "possible split";
    } else if (dbMut.id === "dark_factor") {
        zygosityLabel = t.val === 1 ? "D" : "DD";
    } else if (dbMut.type.includes("SL") && sex === "female") {
        zygosityLabel = (dbMut.type === "SLID" || dbMut.type === "SLD") ? "SF" : "Visual";
    } else if (dbMut.type === "AD" || dbMut.type === "AID" || dbMut.type === "SLID" || dbMut.type === "SLD") {
        zygosityLabel = (t.val === 1 || t.isSplit) ? "SF" : "DF";
    } else {
        zygosityLabel = (t.val === 1 || t.isSplit) ? "Split" : "Visual";
    }
    
    if (isPoss) {
        btn.classList.add('added');
        btn.textContent = `? ${labelPrefix}${dbMut.name} (${zygosityLabel})`;
        btn.onclick = () => {
            const prefix = sex === 'male' ? 'sire' : 'dam';
            const inputEl = document.getElementById(`${prefix}-search-input`);
            
            // Extract all traits currently parsed in the engine, EXCEPT this clicked trait
            let parsed = processSearchQuery(inputEl.value, document.getElementById("species").value, sex);
            
            let newVis = parsed.visuals.map(tt => mutationDB.find(m=>m.id===tt.id).name);
            let newSplits = parsed.splits.map(tt => mutationDB.find(m=>m.id===tt.id).name);
            let newPoss = [];
            
            parsed.possibleAxes.forEach(ax => {
                let cands = ax.type === 'confirmed_plus_poss' ? [ax.poss] : (ax.candidates || []);
                cands.forEach(c => {
                    if (c.id !== t.id) {
                        newPoss.push(mutationDB.find(m=>m.id===c.id).name);
                    }
                });
            });
            
            // Reconstruct the text box cleanly without the dropped trait
            let finalStr = newVis.join(" ");
            if (newSplits.length) finalStr += " split " + newSplits.join(" and ");
            if (newPoss.length) finalStr += " poss " + newPoss.join(" poss ");
            
            inputEl.value = finalStr.trim();
            handleSearchInput(sex);
        };
        return btn;
    }
    
    if (autoSelectMode) {
        btn.classList.add('added');
        btn.classList.add('read-only-mode');
        btn.textContent = `✓ ${labelPrefix}${dbMut.name} (${zygosityLabel})`;
        return btn;
    }

    if (isCurrentlyApplied) btn.classList.add('added');
    btn.textContent = `${isCurrentlyApplied ? '✓' : '+'} ${labelPrefix}${dbMut.name} (${zygosityLabel})`;
    
    btn.onclick = () => {
        let cbLive = document.getElementById(containerId).querySelector(`input[data-id="${t.id}"]`);
        let liveApplied = cbLive && cbLive.checked;

        if (!liveApplied) {
            applyTraitToUI(t, containerId, sex);
            searchAppliedState[sex].push(t.id);
            btn.classList.add('added');
            btn.textContent = `✓ ${labelPrefix}${dbMut.name} (${zygosityLabel})`;
        } else {
            if (cbLive) {
                cbLive.checked = false;
                toggleMutation(cbLive, containerId, sex);
            }
            searchAppliedState[sex] = searchAppliedState[sex].filter(id => id !== t.id);
            btn.classList.remove('added');
            btn.textContent = `+ ${labelPrefix}${dbMut.name} (${zygosityLabel})`;
        }
        handleConstraints(containerId, sex);
        
        let currentState = processSearchQuery(document.getElementById(`${sex === 'male' ? 'sire' : 'dam'}-search-input`).value, document.getElementById("species").value, sex);
        renderLinkageUI(currentState.visuals, currentState.splits, containerId, sex);
        renderLivePreview();
    };
    return btn;
}

function getPairingWarnings() {
    const speciesVal = document.getElementById("species").value;
    const missingSire = findMissingSelections("sire-categories", "male");
    const missingDam = findMissingSelections("dam-categories", "female");

    // Skip if the form is incomplete or missing species
    if (speciesVal === "none" || missingSire.length || missingDam.length) return [];

    try {
        const parents = computeParentsPhenotypes();
        const { sire, dam, hasSL } = parents;

        // SAFETY CHECK: Abort if phenotype translation failed due to incomplete UI state
        if (!sire || !dam || !sire.autoGenes || !dam.autoGenes) return [];

        // Generate gametes silently
        const sireZGametes = generateZGametesMale(sire.z1, sire.z2);
        const sireAutoGametes = generateAutosomalGametes(sire.autoGenes, sire.dfPhase);
        const damZGametes = [{ chr: 'Z', genes: dam.z1, prob: 0.5 }, { chr: 'W', genes: [], prob: 0.5 }];
        const damAutoGametes = generateAutosomalGametes(dam.autoGenes, dam.dfPhase);

        let uniqueWarnings = new Set();

        sireZGametes.forEach(sz => {
            damZGametes.forEach(dz => {
                const sex = dz.chr === "W" ? "female" : "male";
                sireAutoGametes.forEach(sa => {
                    damAutoGametes.forEach(da => {
                        const auto = {};
                        [...Object.keys(sa.genes), ...Object.keys(da.genes)].forEach(l => {
                            auto[l] = [sa.genes[l] || "+", da.genes[l] || "+"];
                        });

                        let df_c1 = sa.genes['dark_factor'] || "+", bl_c1 = sa.genes['bl'] || "+";
                        let df_c2 = da.genes['dark_factor'] || "+", bl_c2 = da.genes['bl'] || "+";
                        let indPhase = null;
                        let isDfHet = (df_c1 !== "+" || df_c2 !== "+") && !(df_c1 !== "+" && df_c2 !== "+");
                        let isBlSplit = ((bl_c1 !== "+" ? 1 : 0) + (bl_c2 !== "+" ? 1 : 0)) === 1;
                        if (isDfHet && isBlSplit) indPhase = df_c1 !== "+" ? (bl_c1 !== "+" ? "type 2" : "type 1") : (bl_c2 !== "+" ? "type 2" : "type 1");

                        const blDfBlock = buildLinkedBlDfSymbol(bl_c1, df_c1, bl_c2, df_c2);
                        const pheno = translatePhenotype(sz.genes, dz.genes, auto, sex, indPhase, hasSL, true, blDfBlock);

                        // Extract warnings for this specific offspring outcome
                        let offspringWarnings = generateBreedingWarnings(pheno.expressedIDs, pheno.splitIDs);
                        offspringWarnings.forEach(w => uniqueWarnings.add(w));
                    });
                });
            });
        });

        return Array.from(uniqueWarnings);
    } catch (e) {
        // Silently catch intermediate UI states
        return [];
    }
}

function handleSearchInput(sex) {
    if (blockSearchInputEvent) return;

    const species = document.getElementById("species").value;
    if (species === "none") return;

    const prefix = sex === "male" ? "sire" : "dam";
    const containerId = `${prefix}-categories`;
    const inputEl = document.getElementById(`${prefix}-search-input`);
    const autoSelect = document.getElementById(`${prefix}-auto-select`).checked;
    const warningEl = document.getElementById(`${prefix}-search-warning`);
    const suggestionsEl = document.getElementById(`${prefix}-suggestions-container`);

    let query = inputEl.value;
    let parsed = processSearchQuery(query, species, sex);
    let allParsedTraits = [...parsed.visuals, ...parsed.splits];

    let axesRaw = parsed.possibleAxes || [];
    let filterResult = filterAxesForBird(axesRaw, sex);
    axesRaw = filterResult.axes;
    let sexAxisNotes = filterResult.notes;
    possibleAxesState[sex] = axesRaw;

    // Extract possible traits for suggestion buttons
    let possTraits = [];
    axesRaw.forEach(ax => {
        if (ax.type === 'poss_single') possTraits.push(ax.candidates[0]);
        if (ax.type === 'poss_pair_same_locus') possTraits.push(...ax.candidates);
        if (ax.type === 'or_pair') possTraits.push(...ax.candidates);
        if (ax.type === 'confirmed_plus_poss') possTraits.push(ax.poss);
    });

    suggestionsEl.innerHTML = '';

    if (autoSelect) {
        searchAppliedState[sex].forEach(id => {
            if (!allParsedTraits.find(t => t.id === id)) {
                let cb = document.getElementById(containerId).querySelector(`input[data-id="${id}"]`);
                if (cb && cb.checked) {
                    cb.checked = false;
                    toggleMutation(cb, containerId, sex);
                }
            }
        });

        searchAppliedState[sex] = allParsedTraits.map(t => t.id);
        allParsedTraits.forEach(t => applyTraitToUI(t, containerId, sex));
        
        allParsedTraits.forEach(t => {
            let btn = buildSuggestionButton(t, containerId, sex, true);
            if (btn) suggestionsEl.appendChild(btn);
        });
        possTraits.forEach(t => {
            let btn = buildSuggestionButton(t, containerId, sex, true, false, true);
            if (btn) suggestionsEl.appendChild(btn);
        });
        parsed.suggested.forEach(t => {
            let btn = buildSuggestionButton(t, containerId, sex, true, true);
            if (btn) suggestionsEl.appendChild(btn);
        });

        handleConstraints(containerId, sex);
        renderLinkageUI(parsed.visuals, parsed.splits, containerId, sex);
        renderLivePreview();

    } else {
        allParsedTraits.forEach(t => {
            let btn = buildSuggestionButton(t, containerId, sex, false);
            if (btn) suggestionsEl.appendChild(btn);
        });
        possTraits.forEach(t => {
            let btn = buildSuggestionButton(t, containerId, sex, false, false, true);
            if (btn) suggestionsEl.appendChild(btn);
        });
        parsed.suggested.forEach(t => {
            let btn = buildSuggestionButton(t, containerId, sex, false, true);
            if (btn) suggestionsEl.appendChild(btn);
        });
    }

    // NEW: Render Warnings at the end, injecting cross-pairing warnings
    let finalWarningText = parsed.warningText || "";
    if (sexAxisNotes.length > 0) {
        if (finalWarningText) finalWarningText += "<br><br>";
        finalWarningText += sexAxisNotes.join("<br><br>");
    }

    // Shortened mutation notes (e.g. Sapphire, DM Jade, Dominant Reduced, "needs further
    // investigation" traits) for whatever is currently parsed in this bird's search box.
    let noteLines = [];
    let seenNoteIds = new Set();
    allParsedTraits.forEach(t => {
        if (seenNoteIds.has(t.id)) return;
        let dbMut = mutationDB.find(m => m.id === t.id);
        if (dbMut && dbMut.shortNote) {
            seenNoteIds.add(t.id);
            noteLines.push(`${dbMut.name}: ${dbMut.shortNote}`);
        }
    });
    if (noteLines.length > 0) {
        if (finalWarningText) finalWarningText += "<br><br>";
        finalWarningText += "📝 <strong>Notes:</strong><br>" + noteLines.map(n => `• ${n}`).join("<br>");
    }

    // Only show a "Pairing Warning" if it's telling the user something new -- if this same
    // bird's own selections already trigger the identical message (e.g. it already carries both
    // conflicting mutations itself), showing it again under "Offspring Risk" is redundant.
    let ownWarningSet = new Set(parsed.ownBreedingWarnings || []);
    let pairingWarnings = getPairingWarnings().filter(w => !ownWarningSet.has(w));
    if (pairingWarnings.length > 0) {
        if (finalWarningText) finalWarningText += "<br><br>";
        finalWarningText += "🧬 <strong>Pairing Warning (Offspring Risk):</strong><br>" + pairingWarnings.map(w => `• ${w}`).join("<br><br>");
    }

    if (finalWarningText) {
        warningEl.innerHTML = finalWarningText;
        warningEl.style.display = 'block';
    } else {
        warningEl.style.display = 'none';
    }
}

document.getElementById('sire-search-input').addEventListener('input', () => handleSearchInput('male'));
document.getElementById('sire-auto-select').addEventListener('change', () => handleSearchInput('male'));
document.getElementById('dam-search-input').addEventListener('input', () => handleSearchInput('female'));
document.getElementById('dam-auto-select').addEventListener('change', () => handleSearchInput('female'));
// ==========================================
// MOBILE UNIFIED SEARCH REPARENTING
// ==========================================
function initMobileUnifiedSearch() {
    const mql = window.matchMedia("(max-width: 600px)");
    const hubBody = document.getElementById("unified-hub-body");
    
    const sireSearch = document.getElementById("sire-search-container");
    const damSearch = document.getElementById("dam-search-container");
    const sireCategories = document.getElementById("sire-categories");
    const damCategories = document.getElementById("dam-categories");

    // Target the labels to inject context when they move into the unified hub
    const sireLabel = sireSearch ? sireSearch.querySelector('.search-header label strong') : null;
    const damLabel = damSearch ? damSearch.querySelector('.search-header label strong') : null;

    function handleUnifiedLayoutChange(e) {
        if (!sireSearch || !damSearch) return;

        if (e.matches) {
            // Mobile: Move containers into the unified hub
            if (hubBody) {
                hubBody.appendChild(sireSearch);
                hubBody.appendChild(damSearch);
            }
            // Update the internal labels (Auto Select toggles naturally remain right-aligned)
            if (sireLabel) sireLabel.innerHTML = "<span style='color:var(--sire); font-size:1.1em;'>1.0 Sire (Male)</span>";
            if (damLabel) damLabel.innerHTML = "<span style='color:var(--dam); font-size:1.1em;'>0.1 Dam (Female)</span>";
        } else {
            // Desktop: Move back to their original columns above the mutation categories
            if (sireCategories && sireCategories.parentNode) {
                sireCategories.parentNode.insertBefore(sireSearch, sireCategories);
            }
            if (damCategories && damCategories.parentNode) {
                damCategories.parentNode.insertBefore(damSearch, damCategories);
            }
            // Restore default text
            if (sireLabel) sireLabel.innerHTML = "SmartMuta Search";
            if (damLabel) damLabel.innerHTML = "SmartMuta Search";
        }
    }

    // Bind listener for live rotation/resizing
    mql.addEventListener("change", handleUnifiedLayoutChange);
    
    // Execute immediately on page load
    handleUnifiedLayoutChange(mql); 
}

document.addEventListener("DOMContentLoaded", initMobileUnifiedSearch);

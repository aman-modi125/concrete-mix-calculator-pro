/**
 * Concrete Mix Design Calculator Pro - Controller & UI Renderer
 * IS 10262:2019 & IS 456:2000 Conformance
 */

document.addEventListener("DOMContentLoaded", () => {
    let currentCalculationResults = null;
    let chartInstance = null;

    // --- DOM Elements ---
    const navTabs = document.querySelectorAll(".nav-tab");
    const tabContents = document.querySelectorAll(".tab-content");

    // Inputs
    const inputFck = document.getElementById("inputFck");
    const inputExposure = document.getElementById("inputExposure");
    const inputStructureType = document.getElementById("inputStructureType");
    const inputSlump = document.getElementById("inputSlump");
    const inputIsPumped = document.getElementById("inputIsPumped");
    const inputSDMode = document.getElementById("inputSDMode");
    const inputCustomS = document.getElementById("inputCustomS");

    const inputCementCurve = document.getElementById("inputCementCurve");
    const inputSgOPC = document.getElementById("inputSgOPC");
    const inputUseSCM = document.getElementById("inputUseSCM");
    const scmFields = document.getElementById("scmFields");
    const inputScmType = document.getElementById("inputScmType");
    const inputScmPct = document.getElementById("inputScmPct");
    const inputSgSCM = document.getElementById("inputSgSCM");

    const inputMsa = document.getElementById("inputMsa");
    const inputZone = document.getElementById("inputZone");
    const inputAggregateShape = document.getElementById("inputAggregateShape");
    const inputSgCA = document.getElementById("inputSgCA");
    const inputSgFA = document.getElementById("inputSgFA");
    const inputCa1Fraction = document.getElementById("inputCa1Fraction");

    const inputUseAdmix = document.getElementById("inputUseAdmix");
    const inputWaterReductionPct = document.getElementById("inputWaterReductionPct");
    const inputAdmixDosagePct = document.getElementById("inputAdmixDosagePct");

    const inputFaAbs = document.getElementById("inputFaAbs");
    const inputFaMois = document.getElementById("inputFaMois");
    const inputCa1Abs = document.getElementById("inputCa1Abs");
    const inputCa1Mois = document.getElementById("inputCa1Mois");
    const inputCa2Abs = document.getElementById("inputCa2Abs");
    const inputCa2Mois = document.getElementById("inputCa2Mois");

    const inputBatchVolume = document.getElementById("inputBatchVolume");

    // Action Buttons
    const btnLoadAnnexA = document.getElementById("btnLoadAnnexA");
    const btnLoadAnnexB = document.getElementById("btnLoadAnnexB");
    const btnMobileAnnexA = document.getElementById("btnMobileAnnexA");
    const btnMobileAnnexB = document.getElementById("btnMobileAnnexB");
    const btnPrintBtn = document.getElementById("btnPrintBtn");
    const btnMobilePrintReport = document.getElementById("btnMobilePrintReport");
    const btnBackToTop = document.getElementById("btnBackToTop");
    const btnMobileMenu = document.getElementById("btnMobileMenu");
    const mobileMenuDrawer = document.getElementById("mobileMenuDrawer");

    // --- Tab Navigation ---
    navTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const target = tab.getAttribute("data-tab");
            
            navTabs.forEach(t => {
                t.classList.remove("active", "text-sky-400");
                t.classList.add("text-slate-400");
            });
            tab.classList.add("active", "text-sky-400");
            tab.classList.remove("text-slate-400");

            tabContents.forEach(content => {
                if (content.id === target) {
                    content.classList.remove("hidden");
                } else {
                    content.classList.add("hidden");
                }
            });

            if (window.MixAnalytics) {
                window.MixAnalytics.trackTabSwitch(target);
            }
        });
    });

    // Mobile Hamburger Menu
    if (btnMobileMenu) {
        btnMobileMenu.addEventListener("click", () => {
            mobileMenuDrawer.classList.toggle("hidden");
        });
    }

    // Custom S input toggle
    inputSDMode.addEventListener("change", () => {
        if (inputSDMode.value === "custom") {
            inputCustomS.classList.remove("hidden");
        } else {
            inputCustomS.classList.add("hidden");
        }
        recalculate();
    });

    // SCM input toggle
    inputUseSCM.addEventListener("change", () => {
        if (inputUseSCM.value === "true") {
            scmFields.classList.remove("hidden");
        } else {
            scmFields.classList.add("hidden");
        }
        recalculate();
    });

    // Add recalculate listeners to all inputs
    const allInputs = [
        inputFck, inputExposure, inputStructureType, inputSlump, inputIsPumped, inputSDMode, inputCustomS,
        inputCementCurve, inputSgOPC, inputUseSCM, inputScmType, inputScmPct, inputSgSCM,
        inputMsa, inputZone, inputAggregateShape, inputSgCA, inputSgFA, inputCa1Fraction,
        inputUseAdmix, inputWaterReductionPct, inputAdmixDosagePct,
        inputFaAbs, inputFaMois, inputCa1Abs, inputCa1Mois, inputCa2Abs, inputCa2Mois,
        inputBatchVolume
    ];

    allInputs.forEach(input => {
        if (input) {
            input.addEventListener("input", recalculate);
            input.addEventListener("change", recalculate);
        }
    });

    // Helper: Collect Inputs
    function getInputs() {
        return {
            fck: inputFck.value,
            exposure: inputExposure.value,
            structureType: inputStructureType.value,
            slump: inputSlump.value,
            isPumped: inputIsPumped.value === "true",
            customS: inputSDMode.value === "custom" && inputCustomS.value ? parseFloat(inputCustomS.value) : null,
            
            cementCurve: inputCementCurve.value,
            sgOPC: inputSgOPC.value,
            useSCM: inputUseSCM.value === "true",
            scmType: inputScmType.value,
            scmPct: inputScmPct.value,
            sgSCM: inputSgSCM.value,

            msa: inputMsa.value,
            zone: inputZone.value,
            aggregateShape: inputAggregateShape.value,
            sgCA: inputSgCA.value,
            sgFA: inputSgFA.value,
            ca1Fraction: inputCa1Fraction.value,

            useAdmix: inputUseAdmix.value === "true",
            waterReductionPct: inputWaterReductionPct.value,
            admixDosagePct: inputAdmixDosagePct.value,

            faAbs: inputFaAbs.value,
            faMois: inputFaMois.value,
            ca1Abs: inputCa1Abs.value,
            ca1Mois: inputCa1Mois.value,
            ca2Abs: inputCa2Abs.value,
            ca2Mois: inputCa2Mois.value,

            batchVolume: inputBatchVolume.value
        };
    }

    // --- Main Calculation Engine Execution ---
    function recalculate() {
        const inputs = getInputs();
        const res = IS10262Engine.calculateMix(inputs);
        currentCalculationResults = res;

        renderSidebarResults(res);
        renderStepByStep(res);
        renderVerificationSuite(res);
        renderBatching(res);
        renderReport(res);

        // Update mobile sticky badge
        const mobileBadge = document.getElementById("mobileStickyGrade");
        if (mobileBadge) {
            mobileBadge.innerText = `M${res.targetStrength.fck} | w/c ${res.adoptedWC}`;
        }
    }

    // --- Render Tab 1: Live Results Sidebar ---
    function renderSidebarResults(res) {
        document.getElementById("resMixGrade").innerText = `M${res.targetStrength.fck} CONCRETE`;
        document.getElementById("resTargetStrength").innerText = `${res.targetStrength.targetStrength} MPa`;
        document.getElementById("resAdoptedWC").innerText = res.adoptedWC.toFixed(3);
        document.getElementById("resMixRatio").innerText = res.ssdQuantities.ratio;

        // Grade Validation Badge
        const gradeBadge = document.getElementById("resGradeCheckBadge");
        if (res.cementitious.isGradeValid) {
            gradeBadge.className = "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-bold px-3 py-1 rounded-full shadow-sm";
            gradeBadge.innerText = "GRADE PASS ✅";
        } else {
            gradeBadge.className = "bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[11px] font-bold px-3 py-1 rounded-full shadow-sm animate-pulse";
            gradeBadge.innerText = `INVALID GRADE (Min M${res.cementitious.minGrade}) ❌`;
        }

        // Cement Maximum Limit Badge (IS 456 Cl. 8.2.5 = 450 kg/m³)
        const cementBadge = document.getElementById("resCementCheckBadge");
        if (res.cementitious.isWithinMax) {
            cementBadge.className = "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-bold px-3 py-1 rounded-full shadow-sm";
            cementBadge.innerText = "CEMENT PASS ✅";
        } else {
            cementBadge.className = "bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[11px] font-bold px-3 py-1 rounded-full shadow-sm";
            cementBadge.innerText = "MAX CEMENT EXCEEDED ⚠️";
        }

        // Table Rows
        const tbody = document.getElementById("resMixTable");
        let rowsHtml = `
            <tr class="hover:bg-slate-800/50">
                <td class="p-2.5 font-semibold text-slate-200">Water</td>
                <td class="p-2.5 text-right font-bold">${res.ssdQuantities.water} kg</td>
                <td class="p-2.5 text-right font-bold bg-blue-950/20 text-blue-300">${res.fieldQuantities.water} kg</td>
            </tr>
            <tr class="hover:bg-slate-800/50">
                <td class="p-2.5 font-semibold text-slate-200">OPC Cement</td>
                <td class="p-2.5 text-right font-bold">${res.ssdQuantities.opc} kg</td>
                <td class="p-2.5 text-right font-bold bg-blue-950/20 text-blue-300">${res.ssdQuantities.opc} kg</td>
            </tr>
        `;

        if (res.cementitious.scm > 0) {
            rowsHtml += `
                <tr class="hover:bg-slate-800/50 text-emerald-400">
                    <td class="p-2.5 font-semibold">${res.cementitious.scmType} (${res.cementitious.scmPct}%)</td>
                    <td class="p-2.5 text-right font-bold">${res.ssdQuantities.scm} kg</td>
                    <td class="p-2.5 text-right font-bold bg-blue-950/20">${res.ssdQuantities.scm} kg</td>
                </tr>
            `;
        }

        rowsHtml += `
            <tr class="hover:bg-slate-800/50">
                <td class="p-2.5 font-semibold text-slate-200">Fine Aggregate (Sand)</td>
                <td class="p-2.5 text-right font-bold">${res.ssdQuantities.fa} kg</td>
                <td class="p-2.5 text-right font-bold bg-blue-950/20 text-blue-300">${res.fieldQuantities.fa} kg</td>
            </tr>
            <tr class="hover:bg-slate-800/50">
                <td class="p-2.5 font-semibold text-slate-200">Coarse Agg 1 (20mm)</td>
                <td class="p-2.5 text-right font-bold">${res.ssdQuantities.ca1} kg</td>
                <td class="p-2.5 text-right font-bold bg-blue-950/20 text-blue-300">${res.fieldQuantities.ca1} kg</td>
            </tr>
            <tr class="hover:bg-slate-800/50">
                <td class="p-2.5 font-semibold text-slate-200">Coarse Agg 2 (10mm)</td>
                <td class="p-2.5 text-right font-bold">${res.ssdQuantities.ca2} kg</td>
                <td class="p-2.5 text-right font-bold bg-blue-950/20 text-blue-300">${res.fieldQuantities.ca2} kg</td>
            </tr>
        `;

        if (res.ssdQuantities.admixture > 0) {
            rowsHtml += `
                <tr class="hover:bg-slate-800/50 text-amber-400">
                    <td class="p-2.5 font-semibold">Chemical Admixture</td>
                    <td class="p-2.5 text-right font-bold">${res.ssdQuantities.admixture} kg</td>
                    <td class="p-2.5 text-right font-bold bg-blue-950/20">${res.ssdQuantities.admixture} kg</td>
                </tr>
            `;
        }

        tbody.innerHTML = rowsHtml;

        // Render Chart
        renderProportionChart(res);
    }

    // --- Doughnut Chart ---
    function renderProportionChart(res) {
        const canvas = document.getElementById("chartMixPie");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        const labels = ["Water", "OPC Cement", "Fine Aggregate", "Coarse Aggregate"];
        const data = [res.ssdQuantities.water, res.ssdQuantities.opc, res.ssdQuantities.fa, res.ssdQuantities.caTotal];
        const colors = ["#38bdf8", "#0284c7", "#f59e0b", "#10b981"];

        if (res.cementitious.scm > 0) {
            labels.splice(2, 0, res.cementitious.scmType);
            data.splice(2, 0, res.ssdQuantities.scm);
            colors.splice(2, 0, "#34d399");
        }

        if (chartInstance) {
            chartInstance.destroy();
        }

        chartInstance = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    borderColor: "#0f172a",
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: {
                            color: "#94a3b8",
                            boxWidth: 12,
                            font: { size: 10 }
                        }
                    }
                }
            }
        });
    }

    // --- Render Tab 2: Step-by-Step Math Audit ---
    function renderStepByStep(res) {
        const container = document.getElementById("stepsContainer");
        if (!container) return;

        let html = "";
        res.steps.forEach(s => {
            const valuesList = s.values.map(v => `<li class="text-xs text-slate-300">• ${v}</li>`).join("");
            const noteBadge = s.note ? `<div class="mt-2 text-[11px] font-semibold text-amber-300 bg-amber-950/30 border border-amber-500/30 p-2 rounded-lg">${s.note}</div>` : "";

            html += `
                <div class="bg-slate-900/60 border border-slate-700/80 rounded-2xl p-5 shadow-sm">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-xs font-bold text-sky-400 uppercase tracking-wider">Step ${s.step}: ${s.title}</span>
                        <span class="text-[10px] text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700">${s.clause}</span>
                    </div>
                    <div class="bg-slate-950 p-2.5 rounded-xl font-mono text-xs text-emerald-400 border border-slate-800 mb-3 overflow-x-auto">
                        ${s.formula}
                    </div>
                    <ul class="space-y-1 mb-3">
                        ${valuesList}
                    </ul>
                    <div class="flex justify-between items-center pt-2 border-t border-slate-800/80">
                        <span class="text-xs text-slate-400">Step Result:</span>
                        <span class="text-xs font-mono font-bold text-white bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">${s.result}</span>
                    </div>
                    ${noteBadge}
                </div>
            `;
        });

        container.innerHTML = html;
    }

    // --- Render Tab 3: Durability Verification Suite ---
    function renderVerificationSuite(res) {
        const exposureTitle = document.getElementById("verExposureTitle");
        const minGrade = document.getElementById("verMinGrade");
        const selectedGrade = document.getElementById("verSelectedGrade");
        const maxWC = document.getElementById("verMaxWC");
        const minCement = document.getElementById("verMinCement");
        const msaAdj = document.getElementById("verMSAAdjustment");
        const opcCheck = document.getElementById("verOPCCheck");
        const airContent = document.getElementById("verAirContent");

        if (exposureTitle) exposureTitle.innerText = `${res.inputs.exposure} Exposure (${res.inputs.structureType})`;
        if (minGrade) minGrade.innerText = `M${res.cementitious.minGrade}`;
        
        if (selectedGrade) {
            if (res.cementitious.isGradeValid) {
                selectedGrade.className = "text-emerald-400 font-bold";
                selectedGrade.innerText = `M${res.targetStrength.fck} (PASS ✅)`;
            } else {
                selectedGrade.className = "text-rose-400 font-bold animate-pulse";
                selectedGrade.innerText = `M${res.targetStrength.fck} (REJECTED ❌)`;
            }
        }

        if (maxWC) maxWC.innerText = res.durabilityLimits.max_wc.toFixed(2);
        if (minCement) minCement.innerText = `${res.cementitious.minimum} kg/m³`;
        if (msaAdj) msaAdj.innerText = `${res.inputs.msa == 10 ? "+40" : (res.inputs.msa == 40 ? "-30" : "0")} kg/m³ (${res.inputs.msa}mm MSA)`;
        
        if (opcCheck) {
            if (res.cementitious.isWithinMax) {
                opcCheck.className = "text-emerald-400 font-bold";
                opcCheck.innerText = `${res.cementitious.opc} kg/m³ (PASS ✅)`;
            } else {
                opcCheck.className = "text-rose-400 font-bold";
                opcCheck.innerText = `${res.cementitious.opc} kg/m³ (EXCEEDED ⚠️)`;
            }
        }

        if (airContent) airContent.innerText = `${res.airContentPct}% (Table 3)`;
    }

    // --- Render Tab 4: Lab Batching ---
    function renderBatching(res) {
        const lblVol = document.getElementById("lblBatchVolumeDisplay");
        if (lblVol) lblVol.innerText = `${res.batchVolume} m³`;

        const tbody = document.getElementById("batchTable");
        if (tbody) {
            let html = `
                <tr class="hover:bg-slate-800/50">
                    <td class="p-3 font-semibold">Water</td>
                    <td class="p-3 text-right font-bold">${res.batchQuantities.waterSSD} kg</td>
                    <td class="p-3 text-right font-bold bg-blue-950/20 text-blue-300">${res.batchQuantities.waterField} kg</td>
                </tr>
                <tr class="hover:bg-slate-800/50">
                    <td class="p-3 font-semibold">OPC Cement</td>
                    <td class="p-3 text-right font-bold">${res.batchQuantities.opc} kg</td>
                    <td class="p-3 text-right font-bold bg-blue-950/20 text-blue-300">${res.batchQuantities.opc} kg</td>
                </tr>
            `;

            if (res.cementitious.scm > 0) {
                html += `
                    <tr class="hover:bg-slate-800/50 text-emerald-400">
                        <td class="p-3 font-semibold">${res.cementitious.scmType}</td>
                        <td class="p-3 text-right font-bold">${res.batchQuantities.scm} kg</td>
                        <td class="p-3 text-right font-bold bg-blue-950/20">${res.batchQuantities.scm} kg</td>
                    </tr>
                `;
            }

            html += `
                <tr class="hover:bg-slate-800/50">
                    <td class="p-3 font-semibold">Fine Aggregate (Sand)</td>
                    <td class="p-3 text-right font-bold">${res.batchQuantities.faSSD} kg</td>
                    <td class="p-3 text-right font-bold bg-blue-950/20 text-blue-300">${res.batchQuantities.faField} kg</td>
                </tr>
                <tr class="hover:bg-slate-800/50">
                    <td class="p-3 font-semibold">Coarse Aggregate (20mm)</td>
                    <td class="p-3 text-right font-bold">${res.batchQuantities.ca1SSD} kg</td>
                    <td class="p-3 text-right font-bold bg-blue-950/20 text-blue-300">${res.batchQuantities.ca1Field} kg</td>
                </tr>
                <tr class="hover:bg-slate-800/50">
                    <td class="p-3 font-semibold">Coarse Aggregate (10mm)</td>
                    <td class="p-3 text-right font-bold">${res.batchQuantities.ca2SSD} kg</td>
                    <td class="p-3 text-right font-bold bg-blue-950/20 text-blue-300">${res.batchQuantities.ca2Field} kg</td>
                </tr>
            `;

            if (res.batchQuantities.admixture > 0) {
                html += `
                    <tr class="hover:bg-slate-800/50 text-amber-400">
                        <td class="p-3 font-semibold">Chemical Admixture</td>
                        <td class="p-3 text-right font-bold">${res.batchQuantities.admixture} kg</td>
                        <td class="p-3 text-right font-bold bg-blue-950/20">${res.batchQuantities.admixture} kg</td>
                    </tr>
                `;
            }

            tbody.innerHTML = html;
        }

        // Render Trial Mixes
        const trialTbody = document.getElementById("trialMixesTable");
        if (trialTbody && res.trialMixes) {
            let trialHtml = "";
            res.trialMixes.forEach(t => {
                trialHtml += `
                    <tr class="hover:bg-slate-800/50">
                        <td class="p-3 font-bold text-sky-300">${t.name}</td>
                        <td class="p-3 font-mono">${t.wc.toFixed(3)}</td>
                        <td class="p-3 text-right font-mono">${t.water.toFixed(1)} kg</td>
                        <td class="p-3 text-right font-mono">${t.cementitious.toFixed(1)} kg</td>
                        <td class="p-3 text-slate-400 text-[11px]">${t.note}</td>
                    </tr>
                `;
            });
            trialTbody.innerHTML = trialHtml;
        }
    }

    // --- Render Tab 5: Printable Formal Lab Report ---
    function renderReport(res) {
        document.getElementById("reportDate").innerText = new Date().toLocaleDateString("en-IN", {
            day: "2-digit", month: "short", year: "numeric"
        });

        document.getElementById("repFck").innerText = `M${res.targetStrength.fck}`;
        document.getElementById("repExposure").innerText = res.inputs.exposure;
        document.getElementById("repStructure").innerText = res.inputs.structureType;
        document.getElementById("repSlump").innerText = `${res.inputs.slump} mm`;
        document.getElementById("repPlacement").innerText = res.inputs.isPumped ? "Pumped" : "Non-Pumped";
        document.getElementById("repMsa").innerText = `${res.inputs.msa} mm`;

        // Report Summary List
        const list = document.getElementById("reportSummaryList");
        list.innerHTML = `
            <li>Target Mean Compressive Strength: <strong>${res.targetStrength.targetStrength} N/mm²</strong> (Governed by: ${res.targetStrength.fck_prime_1 >= res.targetStrength.fck_prime_2 ? "fck + 1.65S" : "fck + X"})</li>
            <li>Grade Durability Status: <strong>${res.cementitious.isGradeValid ? "COMPLIANT PASS ✅" : `REJECTED (Min M${res.cementitious.minGrade} Required) ❌`}</strong></li>
            <li>Adopted Free w/c Ratio: <strong>${res.adoptedWC.toFixed(3)}</strong> (Maximum Durability Allowed: ${res.durabilityLimits.max_wc.toFixed(2)})</li>
            <li>Calculated Water Content: <strong>${res.water.final} kg/m³</strong> (Slump Adj: ${res.water.slumpAdj} kg, Shape Adj: ${res.water.shapeAdjKg} kg)</li>
            <li>Total Cementitious Material: <strong>${res.cementitious.adopted} kg/m³</strong> (Min Limit: ${res.cementitious.minimum} kg/m³)</li>
            <li>OPC Content: <strong>${res.cementitious.opc} kg/m³</strong> | SCM (${res.cementitious.scmType}): <strong>${res.cementitious.scm} kg/m³</strong></li>
            <li>Max OPC Limit Check (&le;450 kg/m³): <strong>${res.cementitious.isWithinMax ? "PASS ✅" : "EXCEEDED ⚠️"}</strong></li>
            <li>Coarse Aggregate Proportion: <strong>${(res.proportions.caFinalProp * 100).toFixed(2)}%</strong> | Fine Aggregate: <strong>${(res.proportions.faFinalProp * 100).toFixed(2)}%</strong></li>
            <li>SSD Batch Mix Ratio (Cement : Sand : Coarse Agg): <strong>${res.ssdQuantities.ratio}</strong></li>
            <li>Field Batch Mix Ratio (Corrected for Moisture): <strong>${res.fieldQuantities.ratio}</strong></li>
        `;

        // Report Proportions Table
        const rTbody = document.getElementById("reportMixTable");
        let rHtml = `
            <tr>
                <td class="p-2 border border-slate-300 font-sans font-semibold">Water</td>
                <td class="p-2 text-right border border-slate-300">${res.ssdQuantities.water}</td>
                <td class="p-2 text-right border border-slate-300 bg-slate-100">${res.fieldQuantities.water}</td>
            </tr>
            <tr>
                <td class="p-2 border border-slate-300 font-sans font-semibold">OPC Cement</td>
                <td class="p-2 text-right border border-slate-300">${res.ssdQuantities.opc}</td>
                <td class="p-2 text-right border border-slate-300 bg-slate-100">${res.ssdQuantities.opc}</td>
            </tr>
        `;

        if (res.cementitious.scm > 0) {
            rHtml += `
                <tr>
                    <td class="p-2 border border-slate-300 font-sans font-semibold">${res.cementitious.scmType} (${res.cementitious.scmPct}%)</td>
                    <td class="p-2 text-right border border-slate-300">${res.ssdQuantities.scm}</td>
                    <td class="p-2 text-right border border-slate-300 bg-slate-100">${res.ssdQuantities.scm}</td>
                </tr>
            `;
        }

        rHtml += `
            <tr>
                <td class="p-2 border border-slate-300 font-sans font-semibold">Fine Aggregate (Sand)</td>
                <td class="p-2 text-right border border-slate-300">${res.ssdQuantities.fa}</td>
                <td class="p-2 text-right border border-slate-300 bg-slate-100">${res.fieldQuantities.fa}</td>
            </tr>
            <tr>
                <td class="p-2 border border-slate-300 font-sans font-semibold">Coarse Agg 1 (20mm)</td>
                <td class="p-2 text-right border border-slate-300">${res.ssdQuantities.ca1}</td>
                <td class="p-2 text-right border border-slate-300 bg-slate-100">${res.fieldQuantities.ca1}</td>
            </tr>
            <tr>
                <td class="p-2 border border-slate-300 font-sans font-semibold">Coarse Agg 2 (10mm)</td>
                <td class="p-2 text-right border border-slate-300">${res.ssdQuantities.ca2}</td>
                <td class="p-2 text-right border border-slate-300 bg-slate-100">${res.fieldQuantities.ca2}</td>
            </tr>
        `;

        if (res.ssdQuantities.admixture > 0) {
            rHtml += `
                <tr>
                    <td class="p-2 border border-slate-300 font-sans font-semibold">Chemical Admixture</td>
                    <td class="p-2 text-right border border-slate-300">${res.ssdQuantities.admixture}</td>
                    <td class="p-2 text-right border border-slate-300 bg-slate-100">${res.ssdQuantities.admixture}</td>
                </tr>
            `;
        }

        rTbody.innerHTML = rHtml;
    }

    // --- Case Studies Loader ---
    document.querySelectorAll(".btn-load-case").forEach(btn => {
        btn.addEventListener("click", () => {
            const caseId = btn.getAttribute("data-case");
            
            if (caseId === "1") {
                // Case 1: Marine Bridge Pier Substructure (M40 Extreme, 30% Fly Ash)
                inputFck.value = "40";
                inputExposure.value = "Extreme";
                inputStructureType.value = "RCC";
                inputSlump.value = "120";
                inputIsPumped.value = "true";
                inputCementCurve.value = "Curve 2 (OPC 43)";
                inputUseSCM.value = "true";
                scmFields.classList.remove("hidden");
                inputScmType.value = "Fly Ash";
                inputScmPct.value = "30";
                inputSgSCM.value = "2.20";
                inputMsa.value = "20";
                inputZone.value = "Zone I";
                inputUseAdmix.value = "true";
                inputWaterReductionPct.value = "23";
                inputAdmixDosagePct.value = "1.0";
            } else if (caseId === "2") {
                // Case 2: High-Rise Shear Core Walls (M50 Severe, Pumped)
                inputFck.value = "50";
                inputExposure.value = "Severe";
                inputStructureType.value = "RCC";
                inputSlump.value = "130";
                inputIsPumped.value = "true";
                inputCementCurve.value = "Curve 3 (OPC 53)";
                inputUseSCM.value = "false";
                scmFields.classList.add("hidden");
                inputMsa.value = "20";
                inputZone.value = "Zone II";
                inputUseAdmix.value = "true";
                inputWaterReductionPct.value = "25";
                inputAdmixDosagePct.value = "1.2";
            } else if (caseId === "3") {
                // Case 3: Heavy Duty Warehouse Raft (M30 Moderate, 40mm MSA)
                inputFck.value = "30";
                inputExposure.value = "Moderate";
                inputStructureType.value = "RCC";
                inputSlump.value = "60";
                inputIsPumped.value = "false";
                inputCementCurve.value = "Curve 2 (OPC 43)";
                inputUseSCM.value = "false";
                scmFields.classList.add("hidden");
                inputMsa.value = "40";
                inputZone.value = "Zone II";
                inputCa1Fraction.value = "70";
                inputUseAdmix.value = "false";
                inputWaterReductionPct.value = "0";
                inputAdmixDosagePct.value = "0";
            }

            recalculate();
            
            // Smooth scroll to calculator
            document.getElementById("calculator").scrollIntoView({ behavior: "smooth" });

            if (window.MixAnalytics) {
                window.MixAnalytics.trackCaseStudy(`Case_${caseId}`);
            }
        });
    });

    // --- Preset Loaders ---
    function loadAnnexA() {
        inputFck.value = "40";
        inputExposure.value = "Severe";
        inputStructureType.value = "RCC";
        inputSlump.value = "100";
        inputIsPumped.value = "true";
        inputSDMode.value = "auto";
        inputCustomS.classList.add("hidden");
        inputCementCurve.value = "Curve 2 (OPC 43)";
        inputSgOPC.value = "3.15";
        inputUseSCM.value = "false";
        scmFields.classList.add("hidden");
        inputMsa.value = "20";
        inputZone.value = "Zone I";
        inputAggregateShape.value = "Angular";
        inputSgCA.value = "2.74";
        inputSgFA.value = "2.74";
        inputCa1Fraction.value = "60";
        inputUseAdmix.value = "true";
        inputWaterReductionPct.value = "20";
        inputAdmixDosagePct.value = "1.0";
        inputFaAbs.value = "1.0";
        inputFaMois.value = "0.0";
        inputCa1Abs.value = "0.5";
        inputCa1Mois.value = "0.0";
        inputCa2Abs.value = "0.5";
        inputCa2Mois.value = "0.0";

        recalculate();
        if (window.MixAnalytics) window.MixAnalytics.trackPreset("Annex_A_M40_OPC");
    }

    function loadAnnexB() {
        loadAnnexA();
        inputUseSCM.value = "true";
        scmFields.classList.remove("hidden");
        inputScmType.value = "Fly Ash";
        inputScmPct.value = "30";
        inputSgSCM.value = "2.20";

        recalculate();
        if (window.MixAnalytics) window.MixAnalytics.trackPreset("Annex_B_M40_FlyAsh");
    }

    if (btnLoadAnnexA) btnLoadAnnexA.addEventListener("click", loadAnnexA);
    if (btnLoadAnnexB) btnLoadAnnexB.addEventListener("click", loadAnnexB);
    if (btnMobileAnnexA) btnMobileAnnexA.addEventListener("click", () => { loadAnnexA(); mobileMenuDrawer.classList.add("hidden"); });
    if (btnMobileAnnexB) btnMobileAnnexB.addEventListener("click", () => { loadAnnexB(); mobileMenuDrawer.classList.add("hidden"); });

    // --- FAQ Accordions ---
    document.querySelectorAll(".faq-toggle").forEach(btn => {
        btn.addEventListener("click", () => {
            const content = btn.nextElementSibling;
            const icon = btn.querySelector("i");
            const isExpanded = btn.getAttribute("aria-expanded") === "true";

            btn.setAttribute("aria-expanded", !isExpanded);
            content.classList.toggle("hidden");
            if (icon) {
                icon.style.transform = isExpanded ? "rotate(0deg)" : "rotate(180deg)";
            }

            if (!isExpanded && window.MixAnalytics) {
                window.MixAnalytics.trackFaqToggle(btn.innerText.trim());
            }
        });
    });

    // --- Print Functionality ---
    function triggerPrintReport() {
        // Activate report tab first
        const reportTab = document.querySelector('[data-tab="tab-report"]');
        if (reportTab) reportTab.click();

        setTimeout(() => {
            window.print();
            if (window.MixAnalytics && currentCalculationResults) {
                window.MixAnalytics.trackReportPrint(currentCalculationResults.targetStrength.fck);
            }
        }, 150);
    }

    if (btnPrintBtn) btnPrintBtn.addEventListener("click", triggerPrintReport);
    if (btnMobilePrintReport) btnMobilePrintReport.addEventListener("click", triggerPrintReport);

    // --- Back to Top Button ---
    window.addEventListener("scroll", () => {
        if (window.scrollY > 400) {
            btnBackToTop.classList.remove("hidden-state");
            btnBackToTop.classList.add("visible");
        } else {
            btnBackToTop.classList.remove("visible");
            btnBackToTop.classList.add("hidden-state");
        }
    });

    btnBackToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Initial calculation trigger
    recalculate();
});

/*
 * Authors: Group 14 -- Marc Joseph Millare, Alexandru Josu
 * Date of Submission: September 28, 2026
 * Description: This program is a unit converter capable of converting
 *   single values or an array of values. Conversions supported are
 *   kg to lbs, mi to km, ℃ to ℉ and vice versa. Utilizing "hidden"
 *   class, this program is able to render the correct conversion card
 *   for each tab in the navigation bar. In the card, the user can enter
 *   inputs and once the convert button is clicked the output is displayed.
 */
// Global vars
const tabIDs = document.querySelectorAll("#weight, #distance, #temperature");
const cards = document.querySelectorAll("#weight-card, #distance-card, #temperature-card");
const swapBtn = document.querySelectorAll("#swap-btn-weight, #swap-btn-distance, #swap-btn-temperature");
const wtLabel = document.querySelector('label[for="weight-input"]');
const distLabel = document.querySelector('label[for="distance-input"]');
const tempLabel = document.querySelector('label[for="temperature-input"]');
const wtCurrent = document.getElementById("current-conversion-weight");
const distCurrent = document.getElementById("current-conversion-distance");
const tempCurrent = document.getElementById("current-conversion-temperature");
const wtResultLabel = document.getElementById("weight-result-label");
const distResultLabel = document.getElementById("distance-result-label");
const tempResultLabel = document.getElementById("temperature-result-label");
const wtResult = document.getElementById("weight-result");
const distResult = document.getElementById("distance-result");
const tempResult = document.getElementById("temperature-result");
const weightInput = document.getElementById("weight-input");
const distanceInput = document.getElementById("distance-input");
const temperatureInput = document.getElementById("temperature-input");
// Tab switching logic
tabIDs.forEach((tab) => {
    const handleTabs = (e) => {
        e.preventDefault();
        const target = tab.id;
        //add the hidden element to all tabs
        cards.forEach((card) => {
            card.classList.add("hidden");
        });
        //then check what tab was clicked and render corresponding card
        const activeCard = document.getElementById(`${target}-card`);
        if (activeCard) {
            activeCard.classList.remove("hidden");
        }
    };
    tab.addEventListener("click", handleTabs);
});
//Conversion reversal logic
swapBtn.forEach((swap) => {
    const handleSwap = (e) => {
        e.preventDefault();
        const fullID = swap.id;
        //split the ID to get target form (ex. get 'weight' from the id 'swap-btn-weight')
        const idParts = fullID.split("-");
        const target = idParts[2];
        if (target == "weight" && wtLabel) {
            if (wtLabel.textContent.trim() == "Kilograms") {
                swap.textContent = "🔁 kg to lbs";
                wtCurrent.textContent = "Pounds to Kilograms";
                wtLabel.textContent = "Pounds";
                wtResultLabel.textContent = "Kilograms";
            }
            else {
                swap.textContent = "🔁 lbs to kg ";
                wtCurrent.textContent = "Kilograms to Pounds";
                wtLabel.textContent = "Kilograms";
                wtResultLabel.textContent = "Pounds";
            }
        }
        else if (target == "distance" && distLabel) {
            if (distLabel.textContent.trim() == "Miles") {
                swap.textContent = "🔁 mi to km";
                distCurrent.textContent = "Kilometres to Miles";
                distLabel.textContent = "Kilometres";
                distResultLabel.textContent = "Miles";
            }
            else {
                swap.textContent = "🔁 km to mi ";
                distCurrent.textContent = "Miles to Kilometres";
                distLabel.textContent = "Miles";
                distResultLabel.textContent = "Kilometres";
            }
        }
        else if (target == "temperature" && tempLabel) {
            if (tempLabel.textContent.trim() == "Celsius") {
                swap.textContent = "🔁 ℃ to ℉";
                tempCurrent.textContent = "Farenheit to Celsius";
                tempLabel.textContent = "Farenheit";
                tempResultLabel.textContent = "Celsius";
            }
            else {
                swap.textContent = "🔁 ℉ to ℃";
                tempCurrent.textContent = "Celsius to Farenheit";
                tempLabel.textContent = "Celsius";
                tempResultLabel.textContent = "Farenheit";
            }
        }
    };
    swap.addEventListener("click", handleSwap);
});
// Higher-order conversion function
const conversionFormulas = {
    "kg->lbs": (kg) => kg * 2.20462,
    "lbs->kg": (lbs) => lbs / 2.20462,
    "mi->km": (mi) => mi * 1.60934,
    "km->mi": (km) => km / 1.60934,
    "c->f": (c) => (c * 9) / 5 + 32,
    "f->c": (f) => ((f - 32) * 5) / 9,
};
/**
 * Higher-order function: takes the unit to convert FROM and the unit to convert TO,
 * and returns an arrow function that performs that specific conversion.
 */
function createConverter(from, to) {
    const formula = conversionFormulas[`${from}->${to}`];
    return (value) => {
        if (!formula) {
            throw new Error(`No conversion available from "${from}" to "${to}"`);
        }
        if (Array.isArray(value)) {
            return value.map(formula);
        }
        return formula(value);
    };
}
// Helpers for reading/writing form values
function parseInputValue(raw) {
    const parts = raw
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    if (parts.length <= 1) {
        return Number(parts[0]);
    }
    return parts.map(Number);
}
// Formats a single number or array of numbers for display, 2 decimal places.
function formatResult(value) {
    if (Array.isArray(value)) {
        return value.map((v) => (Number.isNaN(v) ? "—" : v.toFixed(2))).join(", ");
    }
    return Number.isNaN(value) ? "—" : value.toFixed(2);
}
// Maps the human-readable label text shown on each card to a Unit code.
const unitFromLabelText = {
    Kilograms: "kg",
    Pounds: "lbs",
    Miles: "mi",
    Kilometres: "km",
    Celsius: "c",
    Farenheit: "f",
};
// Submit handlers (one per card, each reads only its own input)
function handleConvertSubmit(e, fromLabel, toLabel, input, resultEl) {
    e.preventDefault();
    if (!fromLabel)
        return;
    const fromUnit = unitFromLabelText[fromLabel.textContent.trim()];
    const toUnit = unitFromLabelText[toLabel.textContent.trim()];
    if (!fromUnit || !toUnit)
        return;
    const converter = createConverter(fromUnit, toUnit);
    const parsedValue = parseInputValue(input.value);
    const converted = converter(parsedValue);
    resultEl.textContent = formatResult(converted);
}
document
    .getElementById("weight-card")
    ?.addEventListener("submit", (e) => handleConvertSubmit(e, wtLabel, wtResultLabel, weightInput, wtResult));
document
    .getElementById("distance-card")
    ?.addEventListener("submit", (e) => handleConvertSubmit(e, distLabel, distResultLabel, distanceInput, distResult));
document
    .getElementById("temperature-card")
    ?.addEventListener("submit", (e) => handleConvertSubmit(e, tempLabel, tempResultLabel, temperatureInput, tempResult));
export {};
//# sourceMappingURL=main.js.map
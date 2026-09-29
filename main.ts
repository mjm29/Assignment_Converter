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

// Types
type WeightUnit = "kg" | "lbs";
type DistanceUnit = "mi" | "km";
type TempUnit = "c" | "f";
type Unit = WeightUnit | DistanceUnit | TempUnit;

// Global vars
const tabIDs = document.querySelectorAll<HTMLAnchorElement>(
  "#weight, #distance, #temperature",
);
const cards = document.querySelectorAll<HTMLFormElement>(
  "#weight-card, #distance-card, #temperature-card",
);
const swapBtn = document.querySelectorAll<HTMLButtonElement>(
  "#swap-btn-weight, #swap-btn-distance, #swap-btn-temperature",
);
const wtLabel = document.querySelector<HTMLLabelElement>(
  'label[for="weight-input"]',
);
const distLabel = document.querySelector<HTMLLabelElement>(
  'label[for="distance-input"]',
);
const tempLabel = document.querySelector<HTMLLabelElement>(
  'label[for="temperature-input"]',
);
const wtCurrent = document.getElementById(
  "current-conversion-weight",
) as HTMLParagraphElement;
const distCurrent = document.getElementById(
  "current-conversion-distance",
) as HTMLParagraphElement;
const tempCurrent = document.getElementById(
  "current-conversion-temperature",
) as HTMLParagraphElement;
const wtResultLabel = document.getElementById(
  "weight-result-label",
) as HTMLParagraphElement;
const distResultLabel = document.getElementById(
  "distance-result-label",
) as HTMLParagraphElement;
const tempResultLabel = document.getElementById(
  "temperature-result-label",
) as HTMLParagraphElement;
const wtResult = document.getElementById(
  "weight-result",
) as HTMLParagraphElement;
const distResult = document.getElementById(
  "distance-result",
) as HTMLParagraphElement;
const tempResult = document.getElementById(
  "temperature-result",
) as HTMLParagraphElement;
const weightInput = document.getElementById(
  "weight-input",
) as HTMLTextAreaElement;
const distanceInput = document.getElementById(
  "distance-input",
) as HTMLTextAreaElement;
const temperatureInput = document.getElementById(
  "temperature-input",
) as HTMLTextAreaElement;

// Tab switching logic
tabIDs.forEach((tab: HTMLAnchorElement) => {
  const handleTabs = (e: MouseEvent): void => {
    e.preventDefault();

    const target: string = tab.id;
    //add the hidden element to all tabs
    cards.forEach((card: HTMLFormElement) => {
      card.classList.add("hidden");
    });
    //then check what tab was clicked and render corresponding card
    const activeCard = document.getElementById(
      `${target}-card`,
    ) as HTMLDivElement | null;

    if (activeCard) {
      activeCard.classList.remove("hidden");
    }
  };
  tab.addEventListener("click", handleTabs);
});

//Conversion reversal logic
swapBtn.forEach((swap: HTMLButtonElement) => {
  const handleSwap = (e: MouseEvent): void => {
    e.preventDefault();
    const fullID: string = swap.id;
    //split the ID to get target form (ex. get 'weight' from the id 'swap-btn-weight')
    const idParts = fullID.split("-");
    const target = idParts[2];
    if (target == "weight" && wtLabel) {
      if (wtLabel.textContent.trim() == "Kilograms") {
        swap.textContent = "🔁 kg to lbs";
        wtCurrent.textContent = "Pounds to Kilograms";
        wtLabel.textContent = "Pounds";
        wtResultLabel.textContent = "Kilograms";
      } else {
        swap.textContent = "🔁 lbs to kg ";
        wtCurrent.textContent = "Kilograms to Pounds";
        wtLabel.textContent = "Kilograms";
        wtResultLabel.textContent = "Pounds";
      }
    } else if (target == "distance" && distLabel) {
      if (distLabel.textContent.trim() == "Miles") {
        swap.textContent = "🔁 mi to km";
        distCurrent.textContent = "Kilometres to Miles";
        distLabel.textContent = "Kilometres";
        distResultLabel.textContent = "Miles";
      } else {
        swap.textContent = "🔁 km to mi ";
        distCurrent.textContent = "Miles to Kilometres";
        distLabel.textContent = "Miles";
        distResultLabel.textContent = "Kilometres";
      }
    } else if (target == "temperature" && tempLabel) {
      if (tempLabel.textContent.trim() == "Celsius") {
        swap.textContent = "🔁 ℃ to ℉";
        tempCurrent.textContent = "Farenheit to Celsius";
        tempLabel.textContent = "Farenheit";
        tempResultLabel.textContent = "Celsius";
      } else {
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

const conversionFormulas: Record<string, (value: number) => number> = {
  "kg->lbs": (kg: number): number => kg * 2.20462,
  "lbs->kg": (lbs: number): number => lbs / 2.20462,
  "mi->km": (mi: number): number => mi * 1.60934,
  "km->mi": (km: number): number => km / 1.60934,
  "c->f": (c: number): number => (c * 9) / 5 + 32,
  "f->c": (f: number): number => ((f - 32) * 5) / 9,
};

/**
 * Higher-order function: takes the unit to convert FROM and the unit to convert TO,
 * and returns an arrow function that performs that specific conversion.
 */
function createConverter(from: Unit, to: Unit) {
  const formula = conversionFormulas[`${from}->${to}`];

  return (value: number | number[]): number | number[] => {
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
function parseInputValue(raw: string): number | number[] {
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
function formatResult(value: number | number[]): string {
  if (Array.isArray(value)) {
    return value.map((v) => (Number.isNaN(v) ? "—" : v.toFixed(2))).join(", ");
  }
  return Number.isNaN(value) ? "—" : value.toFixed(2);
}

// Maps the human-readable label text shown on each card to a Unit code.
const unitFromLabelText: Record<string, Unit> = {
  Kilograms: "kg",
  Pounds: "lbs",
  Miles: "mi",
  Kilometres: "km",
  Celsius: "c",
  Farenheit: "f",
};

// Submit handlers (one per card, each reads only its own input)
function handleConvertSubmit(
  e: SubmitEvent,
  fromLabel: HTMLLabelElement | null,
  toLabel: HTMLParagraphElement,
  input: HTMLTextAreaElement,
  resultEl: HTMLParagraphElement,
): void {
  e.preventDefault();
  if (!fromLabel) return;

  const fromUnit = unitFromLabelText[fromLabel.textContent.trim()];
  const toUnit = unitFromLabelText[toLabel.textContent.trim()];
  if (!fromUnit || !toUnit) return;

  const converter = createConverter(fromUnit, toUnit);
  const parsedValue = parseInputValue(input.value);
  const converted = converter(parsedValue);

  resultEl.textContent = formatResult(converted);
}

document
  .getElementById("weight-card")
  ?.addEventListener("submit", (e: SubmitEvent) =>
    handleConvertSubmit(e, wtLabel, wtResultLabel, weightInput, wtResult),
  );

document
  .getElementById("distance-card")
  ?.addEventListener("submit", (e: SubmitEvent) =>
    handleConvertSubmit(
      e,
      distLabel,
      distResultLabel,
      distanceInput,
      distResult,
    ),
  );

document
  .getElementById("temperature-card")
  ?.addEventListener("submit", (e: SubmitEvent) =>
    handleConvertSubmit(
      e,
      tempLabel,
      tempResultLabel,
      temperatureInput,
      tempResult,
    ),
  );

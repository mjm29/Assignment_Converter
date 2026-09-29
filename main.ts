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

// ---------------------------------------------------------------------------
// Higher-order conversion function
// ---------------------------------------------------------------------------
// Recognized unit codes.
type Unit = "lb" | "kg" | "mi" | "km" | "c" | "f";
 
// A conversion function accepts either a single number or an array of
// numbers, and returns the same shape it was given.
type ConversionFn = (value: number | number[]) => number | number[];
 
// Plain math for a single value, per direction.
const singleValueConversions: Record<string, (n: number) => number> = {
  "lb-kg": (n) => n * 0.45359237,
  "kg-lb": (n) => n / 0.45359237,
  "mi-km": (n) => n * 1.609344,
  "km-mi": (n) => n / 1.609344,
  "c-f": (n) => (n * 9) / 5 + 32,
  "f-c": (n) => ((n - 32) * 5) / 9,
};
 
/**
 * Higher-order function: takes the unit to convert FROM and the unit to
 * convert TO, and returns a new function that performs that specific
 * conversion. The returned function accepts either a single number or an
 * array of numbers.
 */
function createConverter(fromUnit: Unit, toUnit: Unit): ConversionFn {
  const key = `${fromUnit}-${toUnit}`;
  const convertOne = singleValueConversions[key];
 
  if (!convertOne) {
    throw new Error(`No conversion available from "${fromUnit}" to "${toUnit}".`);
  }
 
  return (value: number | number[]): number | number[] =>
    Array.isArray(value) ? value.map((n) => convertOne(n)) : convertOne(value);
}
 
// ---------------------------------------------------------------------------
// Global vars
// ---------------------------------------------------------------------------
const tabIDs = document.querySelectorAll<HTMLAnchorElement>('#weight, #distance, #temperature');
const cards = document.querySelectorAll<HTMLFormElement>('#weight-card, #distance-card, #temperature-card');
const swapBtn = document.querySelectorAll<HTMLButtonElement>('#swap-btn-weight, #swap-btn-distance, #swap-btn-temperature');
const wtLabel = document.querySelector<HTMLLabelElement>('label[for="weight-input"]');
const distLabel = document.querySelector<HTMLLabelElement>('label[for="distance-input"]');
const tempLabel = document.querySelector<HTMLLabelElement>('label[for="temperature-input"]');
const wtCurrent = document.getElementById("current-conversion-weight") as HTMLParagraphElement;
const distCurrent = document.getElementById("current-conversion-distance") as HTMLParagraphElement;
const tempCurrent = document.getElementById("current-conversion-temperature") as HTMLParagraphElement;
const wtResultLabel = document.getElementById("weight-result-label") as HTMLParagraphElement;
const distResultLabel = document.getElementById("distance-result-label") as HTMLParagraphElement;
const tempResultLabel = document.getElementById("temperature-result-label") as HTMLParagraphElement;
const wtResult = document.getElementById("weight-result") as HTMLParagraphElement;
const distResult = document.getElementById("distance-result") as HTMLParagraphElement;
const tempResult = document.getElementById("temperature-result") as HTMLParagraphElement;
const inputs = document.querySelectorAll<HTMLTextAreaElement>('#weight-input, #distance-input, #temperature-input');
 
// ---------------------------------------------------------------------------
// Tab switching logic
// ---------------------------------------------------------------------------
tabIDs.forEach((tab: HTMLAnchorElement) => {
  const handleTabs = (e: MouseEvent): void => {
    e.preventDefault();
 
    const target: string = tab.id;
 
    // highlight the active tab, un-highlight the rest
    tabIDs.forEach((t) => t.classList.remove("text-teal-300", "border-teal-300"));
    tabIDs.forEach((t) => t.classList.add("border-transparent"));
    tab.classList.remove("border-transparent");
    tab.classList.add("text-teal-300", "border-teal-300");
 
    // add the hidden class to all tabs
    cards.forEach((card: HTMLFormElement) => {
      card.classList.add("hidden");
    });
    // then check what tab was clicked and render corresponding card
    const activeCard = document.getElementById(`${target}-card`) as HTMLDivElement | null;
 
    if (activeCard) {
      activeCard.classList.remove("hidden");
    }
  };
  tab.addEventListener("click", handleTabs);
});
 
// ---------------------------------------------------------------------------
// Conversion reversal logic
// ---------------------------------------------------------------------------
swapBtn.forEach((swap: HTMLButtonElement) => {
  const handleSwap = (e: MouseEvent): void => {
    e.preventDefault();
    const fullID: string = swap.id;
    // split the ID to get target form (ex. get 'weight' from the id 'swap-btn-weight')
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
        tempCurrent.textContent = "Fahrenheit to Celsius";
        tempLabel.textContent = "Fahrenheit";
        tempResultLabel.textContent = "Celsius";
      } else {
        swap.textContent = "🔁 ℉ to ℃";
        tempCurrent.textContent = "Celsius to Fahrenheit";
        tempLabel.textContent = "Celsius";
        tempResultLabel.textContent = "Fahrenheit";
      }
    }
  };
  swap.addEventListener("click", handleSwap);
});
 
// ---------------------------------------------------------------------------
// Helper: format a converted value (or array of values) back into a string
// ---------------------------------------------------------------------------
function formatResult(value: number | number[]): string {
  const round = (n: number) => Math.round(n * 100) / 100;
  if (Array.isArray(value)) {
    return value.map(round).join(", ");
  }
  return String(round(value));
}
 
// ---------------------------------------------------------------------------
// Turning user input in the textArea elements into number arrays and
// running them through the correct conversion function
// ---------------------------------------------------------------------------
cards.forEach((card: HTMLFormElement) => {
  const handleInput = (e: SubmitEvent): void => {
    e.preventDefault();
 
    inputs.forEach((input): void => {
      // converts input to number array e.g. "1,2,3" -> [1, 2, 3]
      const parsedInput = input.value
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v.length > 0)
        .map(Number);
      if (parsedInput.length === 0) return;
 
      // a single value is passed through as a plain number, not a
      // one-element array, so the converter's return type matches
      const [firstValue] = parsedInput;
      const valueToConvert: number | number[] =
        parsedInput.length === 1 && firstValue !== undefined ? firstValue : parsedInput;
 
      if (input.id == "weight-input" && wtLabel) {
        const converter =
          wtLabel.textContent.trim() == "Kilograms" ? createConverter("kg", "lb") : createConverter("lb", "kg");
        wtResult.textContent = formatResult(converter(valueToConvert));
      } else if (input.id == "distance-input" && distLabel) {
        const converter =
          distLabel.textContent.trim() == "Miles" ? createConverter("mi", "km") : createConverter("km", "mi");
        distResult.textContent = formatResult(converter(valueToConvert));
      } else if (input.id == "temperature-input" && tempLabel) {
        const converter =
          tempLabel.textContent.trim() == "Celsius" ? createConverter("c", "f") : createConverter("f", "c");
        tempResult.textContent = formatResult(converter(valueToConvert));
      }
    });
  };
  card.addEventListener("submit", handleInput);
});
 
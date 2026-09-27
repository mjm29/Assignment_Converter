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
const tabIDs =  document.querySelectorAll<HTMLAnchorElement>('#weight, #distance, #temperature');
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


// Tab switching logic
tabIDs.forEach((tab: HTMLAnchorElement) => {
  const handleTabs = (e: MouseEvent): void => {
  e.preventDefault();

    const target: string = tab.id;
    //add the hidden element to all tabs 
    cards.forEach((card: HTMLFormElement) => {
      card.classList.add('hidden');
    });
    //then check what tab was clicked and render corresponding card
    const activeCard = document.getElementById(`${target}-card`) as HTMLDivElement | null;

    if (activeCard) {
      activeCard.classList.remove('hidden');
    };
  }
  tab.addEventListener("click", handleTabs);
});



//Conversion reversal logic
swapBtn.forEach((swap: HTMLButtonElement) => {
  const handleSwap = (e: MouseEvent): void => {
    e.preventDefault();
    const fullID: string = swap.id;
    //split the ID to get target form (ex. get 'weight' from the id 'swap-btn-weight')
    const idParts = fullID.split('-');
    const target = idParts[2];
    console.log(target);
    if (target == 'weight' && wtLabel) {
      if(wtLabel.textContent.trim() == "Kilograms") {
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
    } else if (target == 'distance' && distLabel) {
      if(distLabel.textContent.trim() == "Miles") {
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
    } else if (target == 'temperature' && tempLabel) {
      if(tempLabel.textContent.trim() == "Celsius") {
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


//TODO: insert formula convertion logic here

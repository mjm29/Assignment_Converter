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

//Tab Switching Logic
const tabIDs =  document.querySelectorAll<HTMLAnchorElement>('#weight, #distance, #temperature');
const cards = document.querySelectorAll<HTMLDivElement>('#weight-card, #distance-card, #temperature-card');

tabIDs.forEach((tab: HTMLAnchorElement) => {
  tab.addEventListener('click', (e:MouseEvent) =>{
    e.preventDefault();

    const target: string = tab.id;
    //add the hidden element to all tabs 
    cards.forEach((card: HTMLDivElement) => {
      card.classList.add('hidden');
    });
    //then check what tab was clicked and render corresponding card
    const activeCard = document.getElementById(`${target}-card`) as HTMLDivElement | null;

    if (activeCard) {
      activeCard.classList.remove('hidden');
    }

  });
});

//Conversion reversal logic



//TODO: insert formula convertion logic here
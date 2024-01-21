/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)


// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

    // loop over each item in the data
    for(let i =0; i<games.length; i++){
        // create a new div element, which will become the game card
        const newDiv = document.createElement('div')

        // add the class game-card to the list
        newDiv.classList.add('game-card')

        // set the inner HTML using a template literal to display some info 
        // about each game
        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")
        newDiv.innerHTML = ` <img src="${games[i].img}" class="game-img" alt="${games[i].name} Image">
        <h2>${games[i].name}</h2>
        <p>Pledged: ${games[i].pledged}</p>
        <p>Goal: ${games[i].goal}</p>`

        // append the game to the games-container
         gamesContainer.appendChild(newDiv);
    }


}


// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games
addGamesToPage(GAMES_JSON);


/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalContributions = GAMES_JSON.reduce((accumulator, game) => {
    return accumulator + game.backers;
  }, 0);

  contributionsCard.textContent = `Total Contributions: ${totalContributions.toLocaleString()}`;
// set the inner HTML using a template literal and toLocaleString to get a number with commas


// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");

const totalRaised = GAMES_JSON.reduce((accumulator, games) => {
    return accumulator + games.pledged;
}, 0);

raisedCard.textContent = `Total Pledged: ${totalRaised.toLocaleString()}`;

// set inner HTML using template literal


// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
// const numberOfGames = GAMES_JSON.length;

const totalGames = GAMES_JSON.reduce((accumulator, games)=>{
    return accumulator + 1;
}, 0);

gamesCard.textContent = `Total Games: ${totalGames}`;


/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    const unfundedGames = GAMES_JSON.filter(game => game.pledged < game.goal);

    // use the function we previously created to add the unfunded games to the DOM
    //gamesContainer.textContent = `Unfunded Games: ${filterUnfundedOnly}`;
    addGamesToPage(unfundedGames);
}

//filterUnfundedOnly(GAMES_JSON);

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    const fundedGames = GAMES_JSON.filter(game => game.pledged >= game.goal);

    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(fundedGames);
}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);

}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const totalUnfunded = GAMES_JSON.reduce((accumulator, game) => {
    return accumulator + (game.pledged < game.goal ? 1 : 0);
}, 0);

// create a string that explains the number of unfunded games using the ternary operator
let unfundedSTR = `We have raised $${totalRaised.toLocaleString()} across ${totalGames} games.
${totalUnfunded > 0
    ? `Unfortunately, ${totalUnfunded} game${totalUnfunded > 1 ? 's are' : ' is'} still unfunded.`
    : 'All games are funded! Thank you for your support!'
}`;

// create a new DOM element containing the template string and append it to the description container
const descriptionParagraph = document.createElement('p');
descriptionParagraph.textContent = unfundedSTR;
descriptionContainer.appendChild(descriptionParagraph);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
const [firstGame, secondGame, ...remainingGames] = sortedGames;

// create a new element to hold the name of the top pledge game, then append it to the correct element
firstGameContainer.textContent = `🥇 Top Funded Game: ${firstGame.name}, Pledged: $${firstGame.pledged.toLocaleString()}`;
secondGameContainer.textContent = `🥈 Runner Up: ${secondGame.name}, Pledged: $${secondGame.pledged.toLocaleString()}`;
// do the same for the runner up item

// Grab the search bar and search button elements
const searchBar = document.getElementById("search-bar");
const searchBtn = document.getElementById("search-btn");

// Add an event listener to the search button
searchBtn.addEventListener("click", handleSearch);

// Function to handle the search
function handleSearch() {
    // Get the value entered in the search bar
    const searchTerm = searchBar.value.toLowerCase();

    // Filter games based on the search term
    const filteredGames = GAMES_JSON.filter(game => game.name.toLowerCase().includes(searchTerm));

    // Display the filtered games on the page
    deleteChildElements(gamesContainer);
    addGamesToPage(filteredGames);
}

// Add an event listener to reset the games when the search bar is cleared
searchBar.addEventListener("input", function() {
    if (searchBar.value === "") {
        showAllGames();
    }
});
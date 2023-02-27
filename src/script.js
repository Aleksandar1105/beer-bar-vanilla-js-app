'use strict';
const beerBarBtn = document.querySelector('#beer-bar-btn');
const beersBtn = document.querySelector('#beers-btn');
const randomBeerBtn = document.querySelector('#random-beer-btn');
const homeSreenSection = document.querySelector('#beer-bar-section');
const beersSection = document.querySelector('#beers-section');
const randomBeerSection = document.querySelector('.random-beer-container');
const beerList = document.querySelector('.beers-list');
const sortBeersOption = document.querySelector('#sort-beers');
const pageSizeOption = document.querySelector('#page-size');
const previousButton = document.querySelector('#previous-btn');
const nextButton = document.querySelector('#next-btn');
const backButton = document.querySelector('#back-btn');
const searchButton = document.querySelector('#search-btn');
let searchInput = document.querySelector('#search-input');
let show0OptionPageSize = document.querySelector('option[value="Page Size"]');
let show0OptionSortBy = document.querySelector('option[value="Sort by"]');

let pageNumber = 1;
let beersPerPage = 10;
let beerId = [];

const baseUrl = `https://api.punkapi.com/v2/beers`;
const randomBeerUrl = 'https://api.punkapi.com/v2/beers/random';

beersSection.classList.add('hidden');
randomBeerSection.classList.add('hidden');

// FETCHING DATA
async function fetchBeers(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`)
    };
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error)
  }
};

// GET BEERS
const printBeers = async (beersPerPage) => {
  beerList.innerHTML = '';
  pageNumber = 1;
  let beersArray = await fetchBeers(`${baseUrl}?page=${pageNumber}&per_page=${beersPerPage}`);
  beerListInnerHtml(beersArray);
  moreDetailsButton(beersArray);
};

// Function for creating innerHTML for beers in Beers section
const beerListInnerHtml = async (beers) => {
  beers.forEach(beer => {
    beerList.innerHTML += `
      <li class="beer">
        <div class="beer-img-container">
          <img src="${beer.image_url}" alt="${beer.name}">
        </div>
        <div class="beer-name-container">  
          <h2 class="beer-name">${beer.name}</h2>
        </div>
        <div class="beer-description-container">  
          <p class="beer-description">${beer.description.substr(0, 80)}...</p>
        </div>
        <button class="beer-details-btn">More details</button>
        <hr>
      </li>
      `
  });
};

// Function for searching beers with url
const searchedBeerWithUrl = async (url) => {
  let getSingleBeerWithUrl = await fetch(url)
  let beer = await getSingleBeerWithUrl.json();
  console.log(beer[0])
  beerList.innerHTML += `
    <li class="beer">
      <div class="beer-img-container">
        <img src="${beer[0].image_url}" alt="${beer[0].name}">
      </div>
      <div class="beer-name-container">  
        <h2 class="beer-name">${beer[0].name}</h2>
      </div>
      <div class="beer-description-container">  
        <p class="beer-description">${beer[0].description.substr(0, 80)}...</p>
      </div>
      <button class="beer-details-btn">More details</button>
      <hr>
    </li>
    `
};

// Function for showing more details for each beer
const beerDetails = (beerDetails) => {
  backButton.classList.remove('hidden');
  randomBeerSection.innerHTML = `
  <img class="random-beer-img" src=${beerDetails.image_url} alt=${beerDetails.name}>
  <div class="random-beer-details">
    <div class="random-beer-name">
      <h3 class="random-beer-heading">${beerDetails.name} <span class="random-beer-tagline">"${beerDetails.tagline}"</span></h3>
    </div>
    <div class="random-beer-description">${beerDetails.description}</div>
    <div class="random-beer-first-breewed">First breewed ${beerDetails.first_brewed}</div>
    <div class="random-beer-alcohol">Alcohol ${beerDetails.abv}%</div>
    <div class="random-beer-bitterness">Bitterness ${beerDetails.ibu} IBU</div>
    <div class="random-beer-food-pairing">
      <h3 class="food-pairing-heading">Food Pairing</h3>
      <div class="food-pairings">
        <ul class="food-pairings-ul">

        </ul>
      </div>
    </div>
  </div>`;

  let foodPairings = document.querySelector('.food-pairings-ul');
  for (let i = 0; i < beerDetails.food_pairing.length; i++) {
    const foodPairing = document.createElement('li');
    foodPairing.classList.add("food-pairings-li");
    foodPairing.textContent = `${beerDetails.food_pairing[i]}`;
    foodPairings.appendChild(foodPairing);
  }
};

// Function for More details button
const moreDetailsButton = (arr) => {
  let moreDetailsButton = document.querySelectorAll('.beer-details-btn');
  for (let i = 0; i < arr.length; i++) {
    moreDetailsButton[i].addEventListener('click', function (e) {
      e.preventDefault();
      // console.log(arr[i]);
      homeSreenSection.classList.add('hidden');
      beersSection.classList.add('hidden');
      randomBeerSection.classList.remove('hidden');
      backButton.classList.remove('hidden');
      beerDetails(arr[i]);
    })
  }

};

// Function for sorting the beers
const sortBeers = async (option) => {
  let beersArray = await fetchBeers(`${baseUrl}?page=${pageNumber}&per_page=${beersPerPage}`);

  if (option === "name-asc") {
    console.log(sortBeersOption.options.innerHTML) // DA SE SREDI
    beersArray = beersArray.sort((a, b) => a.name.localeCompare(b.name));
    show0OptionSortBy.selected = true;
    console.log(beersArray)
  }
  else if (option === "name-desc") {
    beersArray = beersArray.sort((a, b) => b.name.localeCompare(a.name));
    show0OptionSortBy.selected = true;
    console.log(beersArray)
  }
  else if (option === "alcohol-asc") {
    beersArray = beersArray.sort((a, b) => a.abv - b.abv);
    show0OptionSortBy.selected = true;
    console.log(beersArray)
  }
  else if (option === "alcohol-desc") {
    beersArray = beersArray.sort((a, b) => b.abv - a.abv);
    show0OptionSortBy.selected = true;
    console.log(beersArray)
  }
  else if (option === "bitterness-asc") {
    beersArray = beersArray.sort((a, b) => a.ibu - b.ibu);
    show0OptionSortBy.selected = true;
    console.log(beersArray)
  }
  else if (option === "bitterness-desc") {
    beersArray = beersArray.sort((a, b) => b.ibu - a.ibu);
    show0OptionSortBy.selected = true;
    console.log(beersArray)
  }
  else if (option === "production-date-asc") {
    beersArray = beersArray.sort((a, b) => {
      let dateA = a.first_brewed.split("/");
      let dateB = b.first_brewed.split("/");
      show0OptionSortBy.selected = true;
      return new Date(`${dateA[1]}-${dateA[0]}-01`) - new Date(`${dateB[1]}-${dateB[0]}-01`);
    });
    console.log(beersArray)
  } else if (option === "production-date-desc") {
    beersArray = beersArray.sort((a, b) => {
      let dateA = a.first_brewed.split("/");
      let dateB = b.first_brewed.split("/");
      show0OptionSortBy.selected = true;
      return new Date(`${dateB[1]}-${dateB[0]}-01`) - new Date(`${dateA[1]}-${dateA[0]}-01`);
    });
    console.log(beersArray)
  }

  beerList.innerHTML = '';
  beerListInnerHtml(beersArray);
}

// Function for searching beers
const searchBeers = async (searchedTerm) => {
  beerId = 1;
  let searchedBeer = '';

  for (let i = 1; i <= 325; i++) {
    let searchTerm = await fetch(`https://api.punkapi.com/v2/beers/${i}`);
    let singleBeer = await searchTerm.json();
    let searchedUrl = singleBeer.href = `https://api.punkapi.com/v2/beers/${i}`;
    searchedBeer = singleBeer[0].name;
    if (searchedBeer.toLowerCase().includes(searchedTerm.toLowerCase())) {
      await searchedBeerWithUrl(searchedUrl);
    }
  }
}

// Function for clearing the search page
const clearSearchPage = () => {
  beerList.innerHTML = '';
  homeSreenSection.classList.add('hidden');
  beersSection.classList.remove('hidden');
  randomBeerSection.classList.add('hidden');
  beerList.classList.remove('hidden');
  previousButton.classList.add('hidden');
  nextButton.classList.add('hidden');
  backButton.classList.add('hidden');
}

// ================= EVENT LISTENERS =================

// Beer Bar button / homescreen section
beerBarBtn.addEventListener('click', function (e) {
  e.preventDefault();
  searchInput.value = '';
  location.reload();
});

// Beers button / beers section
beersBtn.addEventListener('click', async function (e) {
  e.preventDefault();
  await printBeers(10);
  homeSreenSection.classList.add('hidden');
  beersSection.classList.remove('hidden');
  randomBeerSection.classList.add('hidden');
  beerList.classList.remove('hidden');
  previousButton.disabled = true;
  previousButton.classList.remove('previous-btn');
  previousButton.classList.add('disabled-previous-btn');
  nextButton.classList.remove('hidden');
  backButton.classList.add('hidden');
  searchInput.value = '';
});

// Random beer button / random beer section
randomBeerBtn.addEventListener('click', async function (e) {
  e.preventDefault();
  backButton.classList.remove('hidden');
  homeSreenSection.classList.add('hidden');
  beersSection.classList.add('hidden');
  randomBeerSection.classList.remove('hidden');
  const randomBeer = await fetchBeers(randomBeerUrl);
  backButton.classList.remove('hidden');
  beerDetails(randomBeer[0]);
  searchInput.value = '';
});

// Show beers per page size
pageSizeOption.addEventListener('change', async function (e) {
  e.preventDefault();
  switch (Number(pageSizeOption.value)) {
    case 5:
      beerList.classList.remove('hidden');
      nextButton.classList.remove('hidden');
      show0OptionPageSize.selected = true;
      await printBeers(5);
      beersPerPage = 5;
      break;
    case 10:
      beerList.classList.remove('hidden');
      nextButton.classList.remove('hidden');
      show0OptionPageSize.selected = true;
      await printBeers(10);
      beersPerPage = 10;
      break;
    case 20:
      beerList.classList.remove('hidden');
      nextButton.classList.remove('hidden');
      show0OptionPageSize.selected = true;
      await printBeers(20);
      beersPerPage = 20;
      break;
  }
});

// Event listener for the sort beers option
sortBeersOption.addEventListener('change', function (e) {
  e.preventDefault();
  const selectedOption = this.value;
  sortBeers(selectedOption)
})

// Event listener for next button
nextButton.addEventListener('click', async function (e) {
  e.preventDefault();
  beerList.innerHTML = '';
  pageNumber += 1;
  const beersArray = await fetchBeers(`${baseUrl}?page=${pageNumber}&per_page=${beersPerPage}`);
  beerListInnerHtml(beersArray);
  moreDetailsButton(beersArray);
  previousButton.disabled = false;
  previousButton.classList.add('previous-btn');
  previousButton.classList.remove('disabled-previous-btn');
  if (beersArray.length < beersPerPage) {
    nextButton.disabled = true;
    nextButton.classList.add('disabled-next-btn');
    nextButton.classList.remove('next-btn');
  }
});

// Event listener for previous button
previousButton.addEventListener('click', async function (e) {
  e.preventDefault();
  beerList.innerHTML = '';
  pageNumber -= 1;
  const beersArray = await fetchBeers(`${baseUrl}?page=${pageNumber}&per_page=${beersPerPage}`);
  beerListInnerHtml(beersArray);
  moreDetailsButton(beersArray);
  nextButton.disabled = false;
  nextButton.classList.add('next-btn');
  nextButton.classList.remove('disabled-next-btn');
  if (pageNumber === 1) {
    previousButton.disabled = true;
    previousButton.classList.remove('previous-btn');
    previousButton.classList.add('disabled-previous-btn');
  }
});

// Event listener for back button
backButton.addEventListener('click', async function (e) {
  e.preventDefault();
  beersSection.classList.remove('hidden');
  randomBeerSection.classList.add('hidden');
  backButton.classList.add('hidden');
});

// Event listener for search button 
searchButton.addEventListener('click', function (e) {
  e.preventDefault();
  let searchedTerm = searchInput.value;
  clearSearchPage();
  if (searchedTerm === '') {
    console.log('You must enter at least one character!');
    return
  } else {
    searchBeers(searchedTerm);
    searchInput.value = '';
  }
});

// Event listener for search input
searchInput.addEventListener('keydown', function (e) {
  let searchedTerm = searchInput.value;
  clearSearchPage()
  if (e.key === 'Enter') {
    e.preventDefault();
    if (searchedTerm === '') {
      console.log('You must enter at least one character!');
      return
    } else {
      searchBeers(searchedTerm);
      searchInput.value = '';
    }
  }
});
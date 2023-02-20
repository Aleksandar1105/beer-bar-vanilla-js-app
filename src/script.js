'use strict';

// nav - buttons
const beerBarBtn = document.querySelector('#beer-bar-btn');
const beersBtn = document.querySelector('#beers-btn');
const randomBeerBtn = document.querySelector('#random-beer-btn');

// showing number of beers - button
const pageSizeOption = document.querySelector('#page-size');
// console.log(pageSizeOption.options[1].value);

// sorting beers - button
const sortBeersOption = document.querySelector('#sort-beers');
// console.log(sortBeersOption.options[1].value);

// sections
const homeSreenSection = document.querySelector('#beer-bar-section');

const beersSection = document.querySelector('#beers-section');
const beerList = document.querySelector('.beers-list');
const paginationButtons = document.querySelector('.paginaton-buttons');

const randomBeerSection = document.querySelector('.random-beer-container');

let pageNumber = 1;
let beersPerPage = 5;

const baseUrl = `https://api.punkapi.com/v2/beers`;
const beersUrl = `https://api.punkapi.com/v2/beers?page=${pageNumber}&per_page=${beersPerPage}`;
const randomBeerUrl = 'https://api.punkapi.com/v2/beers/random';

// homescreen when opening the page
// homeSreenSection.classList.remove('hidden');
beersSection.classList.add('hidden');
randomBeerSection.classList.add('hidden');


// FETCHING DATA
async function fetchBeers(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`)
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error)
  }
};

// https://api.punkapi.com/v2/beers?page=1
// https://api.punkapi.com/v2/beers?page=2&per_page=80


// GET BEERS
const printBeers = async (beersPerPage) => {
  beerList.innerHTML = '';
  // pageSizeOption.options[0].removeAttribute('hidden');
  // pageSizeOption.options[0].innerHTML = 'Page Size';
  // console.log(pageSizeOption.options[0])                  // BACK LATER

  pageNumber = 1;
  const beersArray = await fetchBeers(`${baseUrl}?page=${pageNumber}&per_page=${beersPerPage}`);
  console.log(beersArray);
  // console.log(beerList);
  beerListInnerHtml(beersArray);

  // sort beers
  sortBeersOption.addEventListener('change', async function (e) {
    e.preventDefault();
    switch (sortBeersOption.value) {

      case 'name': console.log('show name');
        beerList.innerHTML = '';
        let nameAscDescArray = [];
        for (const beer of beersArray) {
          nameAscDescArray.push(beer)
        }
        nameAscDescArray.sort((a, b) => a.name.localeCompare(b.name));
        beerListInnerHtml(nameAscDescArray);
        moreDetailsButton(nameAscDescArray);
        console.log(nameAscDescArray);
        break;

      case 'alcohol': console.log('show alcohol');
        beerList.innerHTML = '';
        let alcoholAscArray = [];
        ///////////////////////////// BACK HERE////////////////////
        let alcoholDescArray = [];
        for (const beer of beersArray) {
          alcoholAscArray.push(beer)
        }
        if (alcoholAscArray) {
          alcoholAscArray.sort((a, b) => b.abv - a.abv);
          beerListInnerHtml(alcoholAscArray);
          moreDetailsButton(alcoholAscArray);
          console.log('Alcohol ascending', alcoholAscArray);
        } else {
          alcoholDescArray.sort((b, a) => a.abv - b.abv);
          beerListInnerHtml(alcoholDescArray);
          moreDetailsButton(alcoholDescArray);
          console.log('Alcohol descending', alcoholDescArray);
        }
        ///////////////////////////// BACK HERE////////////////////
        break;

      case 'bitterness': console.log('show bitterness');
        beerList.innerHTML = '';
        let bitternessAscDescArray = [];
        for (const beer of beersArray) {
          bitternessAscDescArray.push(beer)
        }
        bitternessAscDescArray.sort((a, b) => b.ibu - a.ibu);
        beerListInnerHtml(bitternessAscDescArray);
        moreDetailsButton(bitternessAscDescArray);
        console.log(bitternessAscDescArray);
        break;

      case 'production-date': console.log('show production-date');
        beerList.innerHTML = '';
        let productionDateArray = [];
        for (const beer of beersArray) {
          productionDateArray.push(beer)
        }
        productionDateArray.sort((a, b) => b.first_brewed - a.first_brewed);
        beerListInnerHtml(productionDateArray);
        moreDetailsButton(productionDateArray);
        console.log(productionDateArray);
        break;
    }
  })

  moreDetailsButton(beersArray);

}

// Function for creating innerHTML for beers in Beers section
function beerListInnerHtml(arr) {
  arr.forEach(beer => {
    // console.log(beer)
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
    </li>
    `
  });
}

// Function for showing more details for each beer
const beerDetails = async (beerDetails) => {
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
          <li class="food-pairings-li">${beerDetails.food_pairing[0]}</li>
          <li class="food-pairings-li">${beerDetails.food_pairing[1]}</li>
          <li class="food-pairings-li">${beerDetails.food_pairing[2]}</li>
        </ul>
      </div>
    </div>
  </div>
  `
}

// function for More details button
function moreDetailsButton(arr) {
  let moreDetailsButton = document.querySelectorAll('.beer-details-btn');
  for (let i = 0; i < arr.length; i++) {
    moreDetailsButton[i].addEventListener('click', function (e) {
      e.preventDefault();
      console.log(arr[i]);
      homeSreenSection.classList.add('hidden');
      beersSection.classList.add('hidden');
      randomBeerSection.classList.remove('hidden');
      beerDetails(arr[i]);
    })
  }
}

// ================= EVENT LISTENERS =================

// Beer Bar button
beerBarBtn.addEventListener('click', function (e) {
  e.preventDefault();
  homeSreenSection.classList.remove('hidden');
  beersSection.classList.add('hidden');
  randomBeerSection.classList.add('hidden');
})

// Beers button
beersBtn.addEventListener('click', function (e) {
  e.preventDefault();
  //pageSizeOption.options[0].innerHTML = 'Page Size'; // BACK LATER
  // sortBeersOption.options.innerHTML = 'Sort by'; // BACK LATER
  homeSreenSection.classList.add('hidden');
  beersSection.classList.remove('hidden');
  beerList.classList.add('hidden');
  randomBeerSection.classList.add('hidden');
  paginationButtons.classList.add('hidden');
})

// Random beer button
randomBeerBtn.addEventListener('click', async function (e) {
  e.preventDefault();
  homeSreenSection.classList.add('hidden');
  beersSection.classList.add('hidden');
  randomBeerSection.classList.remove('hidden');
  const randomBeer = await fetchBeers(randomBeerUrl);
  console.log(randomBeer);
  beerDetails(randomBeer[0]);
})

// On Beers button page there should be pagination, user should be given a choise to pick how much beers should be shown per page, also the user should have a choise to sort beers

// Show beers per page size
pageSizeOption.addEventListener('change', async function (e) {
  e.preventDefault();
  switch (Number(pageSizeOption.value)) {

    // show 5 beers
    case 5:
      beerList.classList.remove('hidden');
      await printBeers(5);
      paginationButtons.classList.remove('hidden');
      break;

    // show 10 beers
    case 10:
      beerList.classList.remove('hidden');
      paginationButtons.classList.remove('hidden');
      await printBeers(10);
      break;

    // show 20 beers
    case 20:
      beerList.classList.remove('hidden');
      paginationButtons.classList.remove('hidden');
      await printBeers(20);
      break;
  }
})



// Sort beers
// sortBeersOption.addEventListener('change', async function (e) {
//   e.preventDefault();
//   switch (sortBeersOption.value) {
//     case 'name': console.log('show name');
//       // await fetchBeers(url);
//       break;
//     case 'alcohol': console.log('show alcohol');
//       // await fetchBeers(url);
//       break;
//     case 'bitterness': console.log('show bitterness');
//       // await fetchBeers(url);
//       break;
//     case 'production-date': console.log('show production-date');
//       // await fetchBeers(url);
//       break;
//   }
// })
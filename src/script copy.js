'use strict';

const beerBarBtn = document.querySelector('#beer-bar-btn');
const beersBtn = document.querySelector('#beers-btn');
const randomBeerBtn = document.querySelector('#random-beer-btn');
const pageSizeOption = document.querySelector('#page-size');
const sortBeersOption = document.querySelector('#sort-beers');
const homeSreenSection = document.querySelector('#beer-bar-section');
const beersSection = document.querySelector('#beers-section');
const beerList = document.querySelector('.beers-list');
const previousButton = document.querySelector('#previous-btn');
const nextButton = document.querySelector('#next-btn');
const backButton = document.querySelector('#back-btn');
const randomBeerSection = document.querySelector('.random-beer-container');

let pageNumber = 1;
let beersPerPage = 10;

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
    }

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
  console.log(beersArray);
  // console.log(beerList);
  beerListInnerHtml(beersArray);
  moreDetailsButton(beersArray);

  return beersArray;
};

// Function for creating innerHTML for beers in Beers section
function beerListInnerHtml(arr) {
  arr.forEach(beer => {
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
  </div>
  `

  let foodPairings = document.querySelector('.food-pairings-ul');
  for (let i = 0; i < beerDetails.food_pairing.length; i++) {
    const foodPairing = document.createElement('li');
    foodPairing.classList.add("food-pairings-li");
    foodPairing.textContent = `${beerDetails.food_pairing[i]}`;
    foodPairings.appendChild(foodPairing);
  }
};

// Function for More details button
function moreDetailsButton(arr) {
  let moreDetailsButton = document.querySelectorAll('.beer-details-btn');
  for (let i = 0; i < arr.length; i++) {
    moreDetailsButton[i].addEventListener('click', function (e) {
      e.preventDefault();
      console.log(arr[i]);
      homeSreenSection.classList.add('hidden');
      beersSection.classList.add('hidden');
      randomBeerSection.classList.remove('hidden');
      backButton.classList.remove('hidden');
      beerDetails(arr[i]);
    })
  }

};

// Function for sorting the beers
async function sortBeers(option) {
  let beersArray = await fetchBeers(`${baseUrl}?page=${pageNumber}&per_page=${beersPerPage}`);
  if (option === "name-asc") {
    beersArray = beersArray.sort((a, b) => a.name.localeCompare(b.name));
    console.log(beersArray)
  }
  else if (option === "name-desc") {
    beersArray = beersArray.sort((a, b) => b.name.localeCompare(a.name));
    console.log(beersArray)
  }
  else if (option === "alcohol-asc") {
    beersArray = beersArray.sort((a, b) => a.abv - b.abv);
    console.log(beersArray)
  }
  else if (option === "alcohol-desc") {
    beersArray = beersArray.sort((a, b) => b.abv - a.abv);
    console.log(beersArray)
  }
  else if (option === "bitterness-asc") {
    beersArray = beersArray.sort((a, b) => a.ibu - b.ibu);
    console.log(beersArray)
  }
  else if (option === "bitterness-desc") {
    beersArray = beersArray.sort((a, b) => b.ibu - a.ibu);
    console.log(beersArray)
  }
  else if (option === "production-date-asc") {
    beersArray = beersArray.sort((a, b) => {
      let dateA = a.first_brewed.split("/");
      let dateB = b.first_brewed.split("/");
      console.log(dateA)
      console.log(dateB)
      return new Date(`${dateA[1]}-${dateA[0]}-01`) - new Date(`${dateB[1]}-${dateB[0]}-01`);
    });
    console.log(beersArray)
  }
  beersArray = beersArray.sort((a, b) => {
    let dateA = a.first_brewed.split("/");
    let dateB = b.first_brewed.split("/");
    return new Date(`${dateB[1]}-${dateB[0]}-01`) - new Date(`${dateA[1]}-${dateA[0]}-01`);
  });
  console.log(beersArray)

  beerList.innerHTML = '';
  beerListInnerHtml(beersArray);
}

// Event listener for the sort beers option
sortBeersOption.addEventListener('change', function (e) {
  e.preventDefault();
  const selectedOption = this.value;
  sortBeers(selectedOption)
})

// ================= EVENT LISTENERS =================

// Beer Bar button
beerBarBtn.addEventListener('click', function (e) {
  e.preventDefault();
  location.reload();
});

// Beers button
beersBtn.addEventListener('click', async function (e) {
  e.preventDefault();
  pageSizeOption.options[0].innerHTML = 'Page Size'; // BACK LATER
  sortBeersOption.options.innerHTML = 'Sort by'; // BACK LATER
  console.log(pageSizeOption.options[0].innerHTML)

  await printBeers(10);
  homeSreenSection.classList.add('hidden');
  beersSection.classList.remove('hidden');
  randomBeerSection.classList.add('hidden');
  beerList.classList.remove('hidden');
  previousButton.classList.add('hidden');
  nextButton.classList.remove('hidden');
  backButton.classList.add('hidden');

});

// Random beer button
randomBeerBtn.addEventListener('click', async function (e) {
  e.preventDefault();
  backButton.classList.remove('hidden');
  homeSreenSection.classList.add('hidden');
  beersSection.classList.add('hidden');
  randomBeerSection.classList.remove('hidden');
  const randomBeer = await fetchBeers(randomBeerUrl);
  backButton.classList.remove('hidden');
  console.log(randomBeer);
  beerDetails(randomBeer[0]);
});

// Show beers per page size
pageSizeOption.addEventListener('change', async function (e) {
  e.preventDefault();
  switch (Number(pageSizeOption.value)) {

    // show 5 beers
    case 5:
      beerList.classList.remove('hidden');
      nextButton.classList.remove('hidden');
      await printBeers(5);
      beersPerPage = 5;
      break;

    // show 10 beers
    case 10:
      beerList.classList.remove('hidden');
      nextButton.classList.remove('hidden');
      await printBeers(10);
      beersPerPage = 10;
      break;

    // show 20 beers
    case 20:
      beerList.classList.remove('hidden');
      nextButton.classList.remove('hidden');
      await printBeers(20);
      beersPerPage = 20;
      break;
  }
});

// // sort beers
// sortBeersOption.addEventListener('change', async function (e) {
//   e.preventDefault();

//   switch (sortBeersOption.value) {

//     case 'name-asc':
//       beersArray = beersArray.sort((a, b) => a.name.localeCompare(b.name));
//       await printBeers(beersArray);
//       break;

//     case 'name-desc':
//       beersArray = beersArray.sort((b, a) => b.name.localeCompare(a.name));
//       await printBeers(beersArray);
//       break;

//     case 'alcohol-asc':
//       beersArray = beersArray.sort((a, b) => b.abv - a.abv);
//       await printBeers(beersArray);
//       break;

//     case 'alcohol-desc':
//       beersArray = beersArray.sort((b, a) => a.abv - b.abv);
//       await printBeers(beersArray);
//       break;

//     case 'bitterness-asc':
//       beersArray = beersArray.sort((a, b) => b.ibu - a.ibu);
//       await printBeers(beersArray);
//       break;

//     case 'bitterness-desc':
//       beersArray = beersArray.sort((b, a) => a.ibu - b.ibu);
//       await printBeers(beersArray);
//       break;

//     case 'production-date': console.log('show production-date');
//       beersArray = beersArray.sort((a, b) => b.first_brewed - a.first_brewed);
//       await printBeers(beersArray);
//       break;
//   }
// });

// Event listener for next button click
nextButton.addEventListener('click', async function (e) {
  e.preventDefault();
  beerList.innerHTML = '';
  pageNumber += 1;
  const beersArray = await fetchBeers(`${baseUrl}?page=${pageNumber}&per_page=${beersPerPage}`);
  console.log(beersArray)
  beerListInnerHtml(beersArray);
  moreDetailsButton(beersArray);
  previousButton.classList.remove('hidden');
  if (beersArray.length < beersPerPage) {
    nextButton.classList.add('hidden');
  }
});

// Event listener for previous button click
previousButton.addEventListener('click', async function (e) {
  e.preventDefault();
  beerList.innerHTML = '';
  pageNumber -= 1;
  const beersArray = await fetchBeers(`${baseUrl}?page=${pageNumber}&per_page=${beersPerPage}`);
  console.log(beersArray)
  beerListInnerHtml(beersArray);
  moreDetailsButton(beersArray);
  nextButton.classList.remove('hidden');
  if (pageNumber === 1) {
    previousButton.classList.add('hidden');
  }
});

// Event listener for back button click
backButton.addEventListener('click', async function (e) {
  e.preventDefault();
  console.log('back');
  beersSection.classList.remove('hidden');
  randomBeerSection.classList.add('hidden');
  backButton.classList.add('hidden');
});
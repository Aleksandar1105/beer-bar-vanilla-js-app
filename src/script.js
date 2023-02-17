'use strict';

// const beersUrl = 'https://api.punkapi.com/v2/beers?page=13';
let pageNumber = 1;
const beersUrl = `https://api.punkapi.com/v2/beers?page=${pageNumber}`;
const randomBeerUrl = 'https://api.punkapi.com/v2/beers/random';

const beerBarBtn = document.querySelector('#beer-bar-btn');
const beersBtn = document.querySelector('#beers-btn');
const randomBeerBtn = document.querySelector('#random-beer-btn');

const homeSreenSection = document.querySelector('#beer-bar-section');
const beersSection = document.querySelector('#beers-section');
const randomBeerSection = document.querySelector('.random-beer-container');

// homescreen when opening the page
homeSreenSection.classList.remove('hidden');
beersSection.classList.add('hidden');
randomBeerSection.classList.add('hidden');



// FETCHING DATA
async function fetchDataFromApi(url) {
  const response = await fetch(url);
  const result = await response.json();
  return result;
};

const beers = async (url) => {
  const data = await fetchDataFromApi(url);
  console.log(data);
}

beers(beersUrl);





// EVENTS
// Beer Bar button
beerBarBtn.addEventListener('click', function () {
  console.log('clicked Beer Bar button');
  homeSreenSection.classList.remove('hidden');
  beersSection.classList.add('hidden');
  randomBeerSection.classList.add('hidden');


})



// When the user click on Beers navigation link should be taken to the beers page. 
// On this page there should be pagination, user should be given a choise to pick how much beers should be shown per page, also the user should have a choise to sort beers

// Beers button
beersBtn.addEventListener('click', function () {
  console.log('clicked Beers button');
  homeSreenSection.classList.add('hidden');
  beersSection.classList.remove('hidden');
  randomBeerSection.classList.add('hidden');


})

// Random beer button
randomBeerBtn.addEventListener('click', function () {
  console.log('clicked Random beer button');
  homeSreenSection.classList.add('hidden');
  beersSection.classList.add('hidden');
  randomBeerSection.classList.remove('hidden');


})
let currPage = 1;
let allFetchedMovie = [];
let prevActiveGenreId;
const NOWPLAYING_API = `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=`;
const GET_ALL_GENRE_NAME_API =
  "https://api.themoviedb.org/3/genre/movie/list?language=en";
const imgFront = "https://image.tmdb.org/t/p/original";
const GET_ALL_MOVIE_BY_GENRE_NAME_API =
  "https://api.themoviedb.org/3/discover/movie?api_key=bf5879aee7a788c6450b586a6147dfa3&with_genres=";

const genreContainer = document.querySelector(".genre-container");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");
const currentBtn = document.querySelector(".current-btn");
const movieModal = document.querySelector(".movie-detailModal");
const inputMovie = document.getElementById("movie-input");
const searchBtn = document.getElementById("search-btn");
prevBtn.addEventListener("click", () => handlePagination(currPage - 1));

nextBtn.addEventListener("click", () => handlePagination(currPage + 1));

genreContainer.addEventListener("click", handleGenre);

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZjU4NzlhZWU3YTc4OGM2NDUwYjU4NmE2MTQ3ZGZhMyIsInN1YiI6IjYyZjBkZGQ5ODEzY2I2MDA3YjM0MDE2MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.XuV_xMMGS02UjoQIdpzorch-5aepGH2n5fMtcvsv_tM",
  },
};

const movieCardContainer = document.querySelector(".movie-cardContainer");
movieCardContainer.addEventListener("click", handleModal);

//TODO:Displaying Movie Card
function displayNowPlayingCard(movies) {
  movieCardContainer.innerHTML = "";
  movies.forEach((movie) => {
    const { title, vote_average, original_language, backdrop_path, id } = movie;
    const card = document.createElement("div");
    card.className = "movie-card";
    card.id = id;

    const img = document.createElement("img");
    img.src = imgFront + backdrop_path;
    img.className = "movie-img";
    img.loading = "lazy";
    card.appendChild(img);

    const h2 = document.createElement("h2");
    h2.textContent = title;
    card.appendChild(h2);

    const h3 = document.createElement("h3");
    h3.textContent = `Language: `;

    const sp = document.createElement("span");
    sp.textContent = original_language.toUpperCase();
    h3.append(sp);
    card.appendChild(h3);

    const avgVote = document.createElement("span");
    avgVote.textContent = "Vote:" + " " + vote_average;
    card.appendChild(avgVote);

    movieCardContainer.appendChild(card);
  });
}

//TODO:Displaying GENRE

function displayGenre(genres) {
  genres.forEach((genre) => {
    const { id, name } = genre;
    const li = document.createElement("li");
    li.className = "genre-name";
    li.textContent = name;
    li.id = id;
    genreContainer.appendChild(li);
  });
}

//TODO:HAndling Pagination
function handlePagination(num) {
  if (num === 0 || num === 110) return;
  else {
    currPage = num;
    currentBtn.textContent = currPage;
    fetchNowPlaying();
  }
}

//TODO:Fetching Now Playing
async function fetchNowPlaying() {
  dipslayLoader();
  const data = await fetch(NOWPLAYING_API + currPage, options);
  const res = await data.json();
  allFetchedMovie = res.results;
  displayNowPlayingCard(allFetchedMovie);
}

// TODO:Fetching Genre List
async function fetchGenre() {
  const res = await fetch(GET_ALL_GENRE_NAME_API, options);
  const data = await res.json();
  displayGenre(data.genres);
}

//FETCH MOVIE BY GENRE
async function fetchAllMovieByGenre(id = 28) {
  const res = await fetch(GET_ALL_MOVIE_BY_GENRE_NAME_API + id);
  const data = await res.json();
  allFetchedMovie = data.results;
  displayNowPlayingCard(data.results);
}

function handleGenre(e) {
  let id = e.target.id;
  if (prevActiveGenreId) {
    const prevActiveELEMENT = document.getElementById(`${prevActiveGenreId}`);
    prevActiveELEMENT.classList.remove("active");
  }
  prevActiveGenreId = id;
  if (id) {
    e.target.classList.add("active");
    if (currPage != 1) {
      currPage = 1;
      currentBtn.textContent = 1;
    }
    fetchAllMovieByGenre(id);
  }
}

fetchGenre();
fetchNowPlaying();
// fetchAllMovieByGenre();

document.addEventListener("DOMContentLoaded", function () {
  function scrollToTop() {
    // Scroll to the top of the page
    window.scrollTo({
      top: 0,
      behavior: "smooth", // You can use 'auto' for an instant scroll
    });
  }

  nextBtn.addEventListener("click", scrollToTop);
  genreContainer.addEventListener("click", scrollToTop);
  searchBtn.addEventListener("click", scrollToTop);
});

function handleModal(e) {
  const idOfMovie = e.target.parentElement.id;
  console.log(idOfMovie);
  if (idOfMovie) {
    const currentSelectedMovie = allFetchedMovie.filter(
      (movie) => movie.id == idOfMovie
    );
    // console.log(currentSelectedMovie[0]);
    const {
      id,
      adult,
      original_language,
      original_title,
      overview,
      poster_path,
      release_date,
      vote_average,
    } = currentSelectedMovie[0];
    movieModal.showModal();
    const html = `<div id=${id} class="modal-container">
    <img loading="lazy" src=${imgFront + poster_path}>
    <button onClick="handleCloseModal()" class="close-modal">&#10005;</button>
    <div class="modal-body">
  
    <h2>${original_title}</h2>
    <h3>Release Date: <span class="gray">${release_date}</span></h3>
    <h4>Rating: <span class="gray">${vote_average}</span></h4>
    <h3>Language: <span class="gray">${original_language.toUpperCase()} </span></h3>
    <p>${overview}</p>

    <a class="btn" href="./checkout.html">Buy Now</a>
    </div>
  </div>`;
    movieModal.innerHTML = html;
  }
}

function handleCloseModal() {
  movieModal.close();
}

// Display Loading
function dipslayLoader() {
  movieCardContainer.innerHTML = "";
  const html = ` 
  <div class="movie-card">
  <div class="movie-img loading"></div>
  <h2 class="loading"></h2>
  <h3 class="loading"><span></span></h3>
  <span class="loading"></span>
</div>`;
  for (let i = 0; i <= 5; i++) {
    movieCardContainer.innerHTML += html;
  }
}

async function getSearchData() {
  dipslayLoader();
  currPage = 1;
  currentBtn.textContent = "1";
  const Serach_API = `https://api.themoviedb.org/3/search/movie?query=${inputMovie.value}&include_adult=false&language=en-US&page=`;
  inputMovie.value = "";
  const res = await fetch(Serach_API + currPage, options);
  const data = await res.json();
  allFetchedMovie = data.results;
  displayNowPlayingCard(allFetchedMovie);
  console.log(data.results);
}

// getSearchData();

searchBtn.addEventListener("click", getSearchData);

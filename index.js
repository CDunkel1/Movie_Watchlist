const apiKey = "9018b1f4";
const searchInput = document.getElementById("search-bar");
const searchButton = document.getElementById("search-btn");
const resultsContainer = document.getElementById("watchlist");

searchButton.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query === "") return;

  fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(data => {
      if (data.Response === "True") {
        renderMovies(data.Search);
      } else {
        resultsContainer.innerHTML = `<p>No results found for "${query}".</p>`;
      }
    })
    .catch(err => {
      console.error("Error fetching data:", err);
    });
    console.log(data)
});

function renderMovies(movies) {
    resultsContainer.innerHTML = ""; // clear previous results
  
    movies.forEach(movie => {
      fetch(`https://www.omdbapi.com/?apikey=9018b1f4&i=${movie.imdbID}&plot=short`)
        .then(res => res.json())
        .then(details => {
          resultsContainer.innerHTML += `
            <div class="movie">
              <img src="${details.Poster !== "N/A" ? details.Poster : "https://via.placeholder.com/150"}" alt="${details.Title}">
              <div class="movie-info">
                <h3>${details.Title} (${details.Year})</h3>
                <p><strong>Genre:</strong> ${details.Genre}</p>
                <p><strong>Runtime:</strong> ${details.Runtime}</p>
                <p><strong>IMDb Rating:</strong> ⭐ ${details.imdbRating}</p>
                <p>${details.Plot}</p>
              </div>
            </div>
            <u></u>
          `;
        })
        .catch(err => console.error("Error fetching movie details:", err));
    });
  }
  
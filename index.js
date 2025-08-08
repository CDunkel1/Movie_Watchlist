const apiKey = "9018b1f4";
const searchInput = document.getElementById("search-bar");
const searchButton = document.getElementById("search-btn");
const resultsContainer = document.getElementById("watchlist");

// Handle search click
searchButton.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (!query) return;

  fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(data => {
      if (data.Response === "True") {
        renderMovies(data.Search);
      } else {
        resultsContainer.innerHTML = `<p>No results found for "${query}".</p>`;
      }
    })
    .catch(err => console.error("Error:", err));
});

// Render movies with details + save button
function renderMovies(movies) {
  resultsContainer.innerHTML = "";

  movies.forEach(movie => {
    fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}&plot=short`)
      .then(res => res.json())
      .then(details => {
        resultsContainer.innerHTML += `
          <div class="movie">
            <img src="${details.Poster !== "N/A" ? details.Poster : "https://via.placeholder.com/150"}" alt="${details.Title}">
            <div class="movie-info">
              <h3>${details.Title}     ⭐ ${details.imdbRating}</h3>
              <div class="movie-meta">
              <span class="runtime">${details.Runtime}</span>
              <span class="genre">${details.Genre}</span>
              <button class="add-to-watchlist" data-id="${movie.imdbID}"><span class="plus-icon">+</span>Add to Watchlist</button>
            </div>
              <p>${details.Plot}</p> 
            </div>
          </div>
        `;
        
      });
  });
}

// Save to localStorage
document.addEventListener("click", function(e) {
    if (e.target.classList.contains("add-to-watchlist")) {
        const movieId = e.target.dataset.id; // Grab IMDb ID
        saveToWatchlist(movieId);
      
    }
});

function saveToWatchlist(id) {
    let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    
    // Prevent duplicates
    if (!watchlist.includes(id)) {
        watchlist.push(id);
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
        alert("Added to watchlist!");
    } else {
        alert("Already in watchlist");
    }
}






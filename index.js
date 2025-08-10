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
        resultsContainer.innerHTML = `<p class"no-data">Unable to find what you’re looking for. Please try another search.</p>`;
         // Change the search bar placeholder
      searchInput.value = ""; // clear old value
      searchInput.placeholder = `Searching something with no data.`;
    
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
        const fullPlot = details.Plot || "";
        let shortPlot = fullPlot;

        if (fullPlot.length > 135) {
          shortPlot = fullPlot.substring(0, 135) + "...";
        }

        const movieHTML = `
          <div class="movie">
            <img src="${details.Poster !== "N/A" ? details.Poster : "https://via.placeholder.com/150"}" alt="${details.Title}">
            <div class="movie-info">
              <h3>${details.Title}    <span class="rating"> ⭐ ${details.imdbRating}</span></h3>
              <div class="movie-meta">
              <span class="runtime">${details.Runtime}</span>
              <span class="genre">${details.Genre}</span>
              <button class="add-to-watchlist" data-id="${movie.imdbID}"><span class="plus-icon">+</span>Add to Watchlist</button>
            </div>
            <p class="plot">
            ${shortPlot} 
            ${fullPlot.length > 135 ? `<a href="#" class="read-more" data-full="${fullPlot}">Read More</a>` : ""}
          </p>
            </div>
          </div>
        `;

        resultsContainer.innerHTML += movieHTML;

        // Add event listener for Read More (after adding to DOM)
        const readMoreLinks = resultsContainer.querySelectorAll(".read-more");
        readMoreLinks.forEach(link => {
          link.addEventListener("click", (e) => {
            e.preventDefault();
            e.target.parentElement.textContent = e.target.dataset.full;
          });
        });


        
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






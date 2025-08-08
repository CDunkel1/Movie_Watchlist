const watchlistContainer = document.getElementById("watchlistContainer");
const apiKey = "9018b1f4";
async function renderMovies() {
    const ids = JSON.parse(localStorage.getItem("watchlist")) || [];

    watchlistContainer.innerHTML = "";

    if (ids.length === 0) {
        watchlistContainer.innerHTML = "<p>Your watchlist is empty.</p>";
        return;
    }

    for (const id of ids) {
        const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${id}`);
        const movie = await res.json();

        watchlistContainer.innerHTML += `
            <div class="movie">
                <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150'}" alt="${movie.Title}">
                <div class="movie-info">
                    <h3>${movie.Title} ⭐ ${movie.imdbRating}</h3>
                    <div class="movie-meta">
                        <span class="runtime">${movie.Runtime}</span>
                        <span class="genre">${movie.Genre}</span>
                        <button class="remove-from-watchlist" data-id="${movie.imdbID}"><span class="minus-icon"> - </span> Remove From Watchlist</button>
                    </div>
                    <p>${movie.Plot}</p>
                </div>
            </div>
        `;
    }

    document.querySelectorAll(".remove-from-watchlist").forEach(button => {
        button.addEventListener("click", (e) => {
            const movieId = e.target.closest("button").dataset.id;
            removeFromWatchlist(movieId);
        });
    });
}

function removeFromWatchlist(id) {
    let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    watchlist = watchlist.filter(movieId => movieId !== id);
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    renderMovies();
}

document.addEventListener("DOMContentLoaded", renderMovies);


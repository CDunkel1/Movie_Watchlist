const watchlistContainer = document.getElementById("watchlistContainer");
const apiKey = "9018b1f4";

async function renderMovies() {
    const ids = JSON.parse(localStorage.getItem("watchlist")) || [];

    watchlistContainer.innerHTML = "";

    if (ids.length === 0) {
        watchlistContainer.innerHTML = `
            <h2 class="empty">Your watchlist is looking a little empty...</h2>
            <a href="index.html"><button class="watchlist-btn"><span class="plus-icon">+</span>Let's add some movies!</button></a>
        `;
        return;
    }

    for (const id of ids) {
        const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${id}`);
        const movie = await res.json();

        const fullPlot = movie.Plot || "";
        let shortPlot = fullPlot;

        if (fullPlot.length > 135) {
            shortPlot = fullPlot.substring(0, 135) + "...";
        }

        watchlistContainer.innerHTML += `
            <div class="movie">
                <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150'}" alt="${movie.Title}">
                <div class="movie-info">
                    <h3>${movie.Title} <span class="rating">⭐ ${movie.imdbRating}</span></h3>
                    <div class="movie-meta">
                        <span class="runtime">${movie.Runtime}</span>
                        <span class="genre">${movie.Genre}</span>
                        <button class="remove-from-watchlist" data-id="${movie.imdbID}">
                            <span class="minus-icon"> - </span> Remove From Watchlist
                        </button>
                    </div>
                    <p class="plot">
                        ${shortPlot} 
                        ${fullPlot.length > 135 ? `<a href="#" class="read-more" data-full="${fullPlot}">Read More</a>` : ""}
                    </p>
                </div>
            </div>
        `;
    }

    // Attach event listeners for Read More links
    watchlistContainer.querySelectorAll(".read-more").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const parent = e.target.parentElement;
            parent.textContent = e.target.dataset.full;
        });
    });

    // ✅ Attach event listeners for Remove buttons
    watchlistContainer.querySelectorAll(".remove-from-watchlist").forEach(button => {
        button.addEventListener("click", () => {
            const id = button.dataset.id;
            removeFromWatchlist(id);
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

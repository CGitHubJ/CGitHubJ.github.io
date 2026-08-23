// Basic search for post content.
// Bookenjenn.com

const searchResult = document.getElementById("search-result");

function loadListener() {

    const searchBtn = document.getElementById("search-btn");
    if (!searchBtn) return;

    const clearBtn = document.getElementById("clear-btn");
    if (!clearBtn) return;

    const searchBar = document.getElementById("search-bar");
    if (!searchBar) return;

    let debounceTimer;
    const debounce = (callback, time) => {
        window.clearTimeout(debounceTimer);
        debounceTimer = window.setTimeout(callback, time);
    };

    clearBtn.addEventListener("click", () => {
        searchBar.value = "";
        searchBar.focus();
        updateUi();
    });

    searchBtn.addEventListener("click", () => {
        var query = searchBar.value
        debounce(() => searchPosts(query), 500)
    }, false);

    searchBar.addEventListener("keydown", (event) => {
        if (event.key !== 'Enter') return;
        var query = event.target.value;
        debounce(() => searchPosts(query), 500);
    }, false);
}

async function searchPosts(query) {

    if (!query) return;
    updateUi("<p>Searching...</p>");

    searchQuery = query.trim().toLowerCase();
    if (!searchQuery || searchQuery.length < 3) {
        updateUi("<p>Query Less Than 3 Characters</p>");
        return;
    }

    const response = await fetch("./assets/data/search.json");
    if (!response.ok) {
        updateUi("<p>Error: Failed To Search</p>");
        throw new Error(`HTTP error: ${response.status}`);
    }

    const postsData = await response.json();
    if (!postsData) {
        updateUi("<p>No Valid Data To Search, Try Again Later</p>");
        return;
    }
    if (!Array.isArray(postsData)) {
        updateUi("<p>Error: Failed To Search</p>");
        throw new Error("Expected search.json to contain an array");
    }

    let found = "";
    let count = 0;
    for (const post of postsData) {
        if (!post || !post.title) continue;
        if (post.title.toLowerCase().includes(searchQuery)) {
            let link = ""
            if (post.permalink) {
                link = post.permalink
            } else if (post.url) {
                link = post.url
            }
            if (link) {
                let postDate = ""
                if (post.date) {
                    const date = new Date(post.date);
                    if (!Number.isNaN(date.getTime())) {
                        postDate = date.toISOString().split("T")[0];
                    }
                } else {
                    postDate = "unknown"
                }
                count++;
                found += `<a href="` + link + `"><h3>` + postDate + ` | ` + post.title + `</h3><p>` + post.description + `</p></a>`;
            }
        }
    }

    if (found) {
        updateUi("<p>" + count + " Results Found</p>" + found);
    } else {
        updateUi("<p>No Results Found</p>");
    }
}

async function updateUi(data) {
    if (data) {
        searchResult.innerHTML = data;
    } else {
        searchResult.innerHTML = "";
    }
}

loadListener();
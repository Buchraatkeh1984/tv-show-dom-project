//You can edit ALL of the code here
var newEpisodes = [];
var searchInput = document.getElementById("searchInput");
var pickEpisode = document.getElementById("select-episode");
var pickShow = document.getElementById("select-show");
var searchResult = document.getElementById("searchResult");
var returnBut = document.getElementById("returnBut");
var showSearchInput = document.getElementById("showSearchInput");
var showSearchResult = document.getElementById("showSearchResult");
const rootElem = document.getElementById("root");
var show_Id;
var allEpisodes = [];
var allShows = [];

function formatEpisode(season, number) {
    if (season < 10) season = "0" + season;
    if (number < 10) number = "0" + number;
    return "S" + season + "E" + number;
}

function setup() {
    allShows = getAllShows();
    showSearchResult.innerText = "found " + allShows.length + " shows";
    returnBut.style.display = "none";
    makeInputForShows(allShows);
    makePageForShows(allShows);
    pickShow.addEventListener("change", pickAShow);
    showSearchInput.addEventListener("keyup", liveShowSearch);
}

function fetchEpisodes(showId) {
    fetch("https://api.tvmaze.com/shows/" + showId + "/episodes")
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            searchInput.value = "";
            show_Id = showId;
            console.log(data);
            allEpisodes = data;
            rootElem.innerHTML = "";
            pickEpisode.selectedIndex = 0;
            searchInput.style.display = "inline";
            pickEpisode.style.display = "inline";
            searchResult.style.display = "inline";
            showSearchInput.style.display = "none";
            showSearchResult.style.display = "none";
            pickShow.style.display = "none";

            searchResult.innerText =
                "Displaying " + allEpisodes.length + " / " + allEpisodes.length;
            makePageForEpisodes(allEpisodes);
            searchInput.addEventListener("keyup", liveSearch);
            makeInputForEpisodes(allEpisodes);
            pickEpisode.addEventListener("change", pickAnEpisod);
        })
        .catch((error) => {
            console.log(error);
        });
}

function makePageForShows(showList) {
    rootElem.innerHTML = "";
    showSearchInput.style.display = "inline";
    showSearchResult.style.display = "inline";
    pickShow.style.display = "inline";
    //hiding search episodes input
    searchInput.style.display = "none";
    pickEpisode.style.display = "none";
    searchResult.style.display = "none";

    var genre = "";
    for (let i = 0; i < showList.length; i++) {
        //The show card
        var showTitleElm = document.createElement("div");
        showTitleElm.classList.add("title-box");
        rootElem.appendChild(showTitleElm);
        //The Name
        var showName = document.createElement("h1");
        showName.innerHTML = "<a href=# >" + showList[i].name + "</a>";
        showName.classList.add("name-box");
        showTitleElm.appendChild(showName);
        //show_Id = showList[i].id;
        showName.addEventListener("click", function() {
            fetchEpisodes(showList[i].id);
        });
        //another container for the rest of the element
        var showElm = document.createElement("div");
        showElm.classList.add("show-box");
        showTitleElm.appendChild(showElm);
        //The image
        var showImg = document.createElement("img");
        if (showList[i].image != null) {
            showImg.src = showList[i].image.medium;
            showImg.style.margin = "10px";
            showElm.appendChild(showImg);
        }
        //The show Summary
        var showSummary = document.createElement("div");
        showSummary.classList.add("summary-box");
        showSummary.innerHTML = showList[i].summary;
        showElm.appendChild(showSummary);

        //Rate ,Genere,Status,Runtime
        var informationElm = document.createElement("div");
        informationElm.classList.add("information-box");
        showElm.appendChild(informationElm);

        var rateElm = document.createElement("P");
        rateElm.innerHTML = "<strong>Rated:</strong>" + showList[i].rating.average;
        informationElm.appendChild(rateElm);

        var genresElm = document.createElement("p");
        genre = showList[i].genres[0];
        for (let j = 1; j < showList[i].genres.length; j++) {
            genre = genre + " | " + showList[i].genres[j];
        }
        genresElm.innerHTML = "<strong>Genres:</strong>" + genre;
        informationElm.appendChild(genresElm);

        var statusElm = document.createElement("p");
        statusElm.innerHTML = "<strong>Status:</strong>" + showList[i].status;
        informationElm.appendChild(statusElm);

        var runtimeElm = document.createElement("p");
        runtimeElm.innerHTML = "<strong>Runtime:</strong>" + showList[i].runtime;
        informationElm.appendChild(runtimeElm);
    }
}
//shows search
function liveShowSearch() {
    const searchString = showSearchInput.value.toLowerCase();
    const filteredShows = allShows.filter((show) => {
        return (
            show.summary.toLowerCase().includes(searchString) ||
            show.name.toLowerCase().includes(searchString) ||
            show.genres.filter((gener) => gener.toLowerCase().includes(searchString))
            .length > 0
        );
    });
    makeInputForShows(filteredShows);
    makePageForShows(filteredShows);
    return (showSearchResult.innerText =
        "found " + filteredShows.length + "shows");
}

function makeInputForShows(showList) {
    var length = pickShow.options.length;
    for (i = length - 1; i >= 1; i--) {
        //pickShow.options[i] = null;
        pickShow.remove(i);
    }

    showList.map((show) => {
        const showInput = document.createElement("option");
        showInput.innerText = show.name;
        pickShow.appendChild(showInput);
    });
    sortlist(pickShow);
}

function pickAShow() {
    rootElem.innerHTML = "";
    const thePickedShowIndex = pickShow.selectedIndex;
    const thePickedShowName = pickShow.options[thePickedShowIndex].innerText;
    var thePickedShowObj = allShows.find(
        (show) => show.name == thePickedShowName
    );

    show_Id = thePickedShowObj.id;
    fetchEpisodes(show_Id);
    pickEpisode.selectedIndex = 0;
}

function sortlist(selectElem) {
    arrTexts = [];

    for (i = 0; i < selectElem.length; i++) {
        arrTexts[i] = selectElem.options[i].text;
    }

    arrTexts.sort(function(a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    });
    for (i = 0; i < selectElem.length; i++) {
        selectElem.options[i].text = arrTexts[i];
        selectElem.options[i].value = arrTexts[i];
    }
}

//episodes
function makePageForEpisodes(episodeList) {
    rootElem.innerHTML = "";

    // navigation link to go back to the shows list
    returnBut.style.display = "inline";
    returnBut.addEventListener("click", function() {
        rootElem.innerHTML = "";
        returnBut.style.display = "none";
        makePageForShows(allShows);
    });

    for (let i = 0; i < episodeList.length; i++) {
        //The episode card
        var episodeElm = document.createElement("div");
        episodeElm.classList.add("episode-box");
        rootElem.appendChild(episodeElm);
        //The Name
        var episodeName = document.createElement("h3");
        episodeName.classList.add("episode-name-box");
        episodeName.innerText =
            episodeList[i].name +
            "-" +
            formatEpisode(episodeList[i].season, episodeList[i].number);
        episodeElm.appendChild(episodeName);
        // The Image
        var episodeImg = document.createElement("img");
        if (episodeList[i].image != null) {
            episodeImg.src = episodeList[i].image.medium;
            episodeImg.classList.add("episode-img-box");
            episodeElm.appendChild(episodeImg);
        }
        //The Episode Summary
        var episodesummary = document.createElement("div");
        episodesummary.innerHTML = episodeList[i].summary;
        episodesummary.style.padding = "10px";
        episodeElm.appendChild(episodesummary);
    }
}

function liveSearch() {
    newEpisodes = [];
    const searchString = searchInput.value.toLowerCase();
    const filteredEpisodes = allEpisodes.filter((episode) => {
        return (
            episode.summary.toLowerCase().includes(searchString) ||
            episode.name.toLowerCase().includes(searchString)
        );
    });
    makeInputForEpisodes(filteredEpisodes);
    makePageForEpisodes(filteredEpisodes);
    return (searchResult.innerText =
        "Displaying " + filteredEpisodes.length + "/ " + allEpisodes.length);

    // another way to solve the live search

    // for (let i = 0; i < allEpisodes.length; i++) {
    //     if (
    //         allEpisodes[i].summary
    //         .toLowerCase()
    //         .includes(searchInput.value.toLowerCase()) ||
    //         allEpisodes[i].name
    //         .toLowerCase()
    //         .includes(searchInput.value.toLowerCase())
    //     )
    //         newEpisodes.push(allEpisodes[i]);
    // }

    // return (searchResult.innerText =
    //   "Displaying " + newEpisodes.length + "/73 episodes");
}
// select an episode

//shows search

function makeInputForEpisodes(episodeList) {
    var length = pickEpisode.options.length;
    for (i = length - 1; i >= 1; i--) {
        //pickShow.options[i] = null;
        pickEpisode.remove(i);
    }
    episodeList.map((episode) => {
        const episodeInput = document.createElement("option");
        episodeInput.innerText =
            formatEpisode(episode.season, episode.number) + "-" + episode.name;
        pickEpisode.appendChild(episodeInput);
    });
}

function pickAnEpisod() {
    const theEpisode = [];
    rootElem.innerHTML = "";
    const thePickedEpisod = pickEpisode.selectedIndex;
    if (thePickedEpisod > 0) {
        theEpisode.push(allEpisodes[thePickedEpisod - 1]);
        makePageForEpisodes(theEpisode);
        const div = document.createElement("div");
        rootElem.appendChild(div);
        const returnBut = document.createElement("button");
        returnBut.innerText = "Return Back";
        returnBut.style.width = "150px";
        returnBut.style.height = "50px";
        returnBut.style.fontSize = "16px";
        returnBut.style.fontWeight = "bold";
        returnBut.style.backgroundColor = "antiquewhite";
        div.appendChild(returnBut);
        returnBut.addEventListener("click", function() {
            fetchEpisodes(show_Id);
        });
    } else makePageForEpisodes(allEpisodes);
}

// select a show

window.onload = setup;
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
var sortShows = document.getElementById("sort-shows");
var sortShowsLabel = document.getElementById("showSort");
var show_Id;
var allEpisodes = [];
var allShows = [];
var allSeasons = [];

returnBut.addEventListener("click", function() {
    rootElem.innerHTML = "";
    returnBut.style.display = "none";
    makePageForShows(allShows);
});

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
    makePageForShows(allShows, 0);
    pickShow.addEventListener("change", pickAShow);
    showSearchInput.addEventListener("keyup", liveShowSearch);
    sortShows.addEventListener("change", function() {
        makeInputForShows(
            allShows,
            makePageForShows(allShows, sortShows.selectedIndex)
        );
    });
}

function fetchEpisodes(showId, seasonNo) {
    console.log(seasonNo);

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
            if (seasonNo === 0) {
                searchInput.style.display = "inline";
                pickEpisode.style.display = "inline";
                searchResult.style.display = "inline";
                showSearchInput.style.display = "none";
                showSearchResult.style.display = "none";
                pickShow.style.display = "none";
                sortShows.style.display = "none";
                sortShowsLabel.style.display = "none";

                searchResult.innerText =
                    "Displaying " + allEpisodes.length + " / " + allEpisodes.length;
            } else {
                searchInput.style.display = "none";
                pickEpisode.style.display = "none";
                searchResult.style.display = "none";
                showSearchInput.style.display = "none";
                showSearchResult.style.display = "none";
                pickShow.style.display = "none";
                sortShows.style.display = "none";
                sortShowsLabel.style.display = "none";
            }
            makePageForEpisodes(allEpisodes, seasonNo);
            searchInput.addEventListener("keyup", liveSearch);
            makeInputForEpisodes(allEpisodes);
            pickEpisode.addEventListener("change", pickAnEpisod);
        })
        .catch((error) => {
            console.log(error);
        });
}

function fetchSeason(showId) {
    fetch("https://api.tvmaze.com/shows/" + showId + "/seasons")
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            searchInput.value = "";
            show_Id = showId;
            console.log(data);
            allSeasons = data;
            rootElem.innerHTML = "";
            pickEpisode.selectedIndex = 0;
            searchInput.style.display = "none";
            pickEpisode.style.display = "none";
            searchResult.style.display = "none";
            showSearchInput.style.display = "none";
            showSearchResult.style.display = "none";
            pickShow.style.display = "none";
            sortShows.style.display = "none";
            sortShowsLabel.style.display = "none";

            // searchResult.innerText =
            //     "Displaying " + allEpisodes.length + " / " + allEpisodes.length;
            makePageForSeasons(allSeasons, showId);
            // searchInput.addEventListener("keyup", liveSearch);
            // makeInputForEpisodes(allEpisodes);
            // pickEpisode.addEventListener("change", pickAnEpisod);
        })
        .catch((error) => {
            console.log(error);
        });
}

function fetchCasting(showId) {
    fetch("http://api.tvmaze.com/shows/" + showId + "?embed=cast")
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            let showCast = data;
            makePageForCast(showCast);
        });
}

function fetchPersonDetail(personId) {
    var showOfPerson = [];
    fetch("http://api.tvmaze.com/people/" + personId + "/castcredits")
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            showsNumber = data.length;
            data.forEach((show, index) => {
                fetch(show._links.show.href)
                    .then((response1) => {
                        return response1.json();
                    })
                    .then((data1) => {
                        //console.log(data1);
                        showOfPerson.push(data1.name);
                        if (index === showsNumber - 1)
                            alert(
                                "In all these shows this actor has appeared in: " + showOfPerson
                            );

                        //makePageForPersonShows(personShows);
                    });
            });
        });
}

function makePageForCast(showCast) {
    rootElem.innerHTML = "";
    showSearchInput.style.display = "none";
    showSearchResult.style.display = "none";
    pickShow.style.display = "none";
    //hiding search episodes input
    searchInput.style.display = "none";
    pickEpisode.style.display = "none";
    searchResult.style.display = "none";
    sortShows.style.display = "none";
    sortShowsLabel.style.display = "none";

    var genre = "";
    for (let i = 0; i < showCast._embedded.cast.length; i++) {
        //The cast card
        var castTitleElm = document.createElement("div");
        castTitleElm.classList.add("title-box");
        rootElem.appendChild(castTitleElm);
        //The Name
        var castName = document.createElement("h1");
        castName.innerHTML =
            "<a href=# >" + showCast._embedded.cast[i].person.name + "</a>";
        castName.classList.add("name-box");
        castTitleElm.appendChild(castName);
        castName.addEventListener("click", function() {
            fetchPersonDetail(showCast._embedded.cast[i].person.id);
            console.log(shows);

            // var personShowsElm = document.createElement("div");
            // personShowsElm.classList.add("information-box");
            // castElm.appendChild(personShowsElm);
            // var showsName = document.createElement("P");
            // showsName.innerText = "All shows the person has appeared in " + shows;
            // personShowsElm.appendChild(showsName);
        });
        //another container for the rest of the element
        var castElm = document.createElement("div");
        castElm.classList.add("show-box");
        castTitleElm.appendChild(castElm);
        //The image
        var castImg = document.createElement("img");
        if (showCast._embedded.cast[i].person.image != null) {
            castImg.src = showCast._embedded.cast[i].person.image.medium;
            castImg.style.margin = "10px";
            castImg.style.width = "200px";
            castElm.appendChild(castImg);
        }
        //The cast Summary
        var castSummary = document.createElement("div");
        castSummary.classList.add("cast-summary-box");
        //castSummary.innerHTML = showCast._embedded.cast[i].person.summary;
        castElm.appendChild(castSummary);

        var castCountry = document.createElement("P");
        castCountry.innerText =
            "Country: " + showCast._embedded.cast[i].person.country.name;
        castSummary.appendChild(castCountry);

        var castBirthday = document.createElement("P");
        castBirthday.innerText =
            "Birthday: " + showCast._embedded.cast[i].person.birthday;
        castSummary.appendChild(castBirthday);

        var castCharacter = document.createElement("P");
        castCharacter.innerText =
            "Charcter Name:" + showCast._embedded.cast[i].character.name;
        castSummary.appendChild(castCharacter);

        const showsBut = document.createElement("button");
        showsBut.innerText = " Shows of this actor";
        showsBut.style.width = "200px";
        showsBut.style.height = "50px";
        showsBut.style.fontSize = "16px";
        showsBut.style.fontWeight = "bold";
        showsBut.style.backgroundColor = "antiquewhite";
        castSummary.appendChild(showsBut);
        showsBut.addEventListener("click", function() {
            fetchPersonDetail(showCast._embedded.cast[i].person.id);
        });
    }
}

function makePageForShows(showList1, sortedBy) {
    let showList = [];
    rootElem.innerHTML = "";
    showSearchInput.style.display = "inline";
    showSearchResult.style.display = "inline";
    pickShow.style.display = "inline";
    //hiding search episodes input
    searchInput.style.display = "none";
    pickEpisode.style.display = "none";
    searchResult.style.display = "none";
    sortShows.style.display = "inline";
    sortShowsLabel.style.display = "inline";

    var genre = "";
    showList = sortshows(showList1, sortedBy);
    console.log(showList);

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
            fetchEpisodes(showList[i].id, 0);
        });

        var fetchSeasonLink = document.createElement("h4");
        fetchSeasonLink.innerHTML = "<a href=# >" + "Show all season" + "</a>";
        fetchSeasonLink.classList.add("name-box");
        showTitleElm.appendChild(fetchSeasonLink);
        //show_Id = showList[i].id;
        fetchSeasonLink.addEventListener("click", function() {
            fetchSeason(showList[i].id);
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
        //showSummary.innerHTML = showList[i].summary;
        showElm.appendChild(showSummary);

        // Character limit after which "Read More" will be seen
        var char_limit = 200;
        var long_Text = "longText" + i;
        var text_Dots = "textDots" + i;
        var more_button = "show-more-button" + i;

        if (
            showList[i].summary.length < char_limit &&
            showList[i].summary.length > 0
        ) {
            showSummary.innerHTML = showList[i].summary;
        } else {
            var more = true;
            showSummary.innerHTML =
                '<span class="moreItem"><span class="short-text">' +
                showList[i].summary.substr(0, char_limit) +
                '</span><span id=' +
                long_Text +
                '>' +
                showList[i].summary.substr(
                    char_limit,
                    showList[i].summary.length - char_limit
                ) +
                '</span><span  id=' +
                text_Dots +
                '>...</span><button  id=  ' +
                more_button +
                '>See More</button></span>';

            //console.log(showSummary.innerHTML);

            let readMoreBut = document.getElementById(more_button);
            let textDot = document.getElementById(text_Dots);
            let longText = document.getElementById(long_Text);
            longText.style.display = "none";
            readMoreBut.addEventListener("click", function() {
                //console.log(more);

                if (more) {
                    textDot.style.display = "none";
                    longText.style.display = "inline";
                    readMoreBut.innerHTML = "See less";
                    more = false;
                } else {
                    textDot.style.display = "inline";
                    longText.style.display = "none";
                    readMoreBut.innerHTML = "See More";
                    more = true;
                }

                // If text is shown less, then show complete
            });
        }
        //casting link

        var castingLink = document.createElement("h3");
        castingLink.innerHTML = "<a href=# > Casting </a>";
        castingLink.classList.add("name-box");
        showSummary.appendChild(castingLink);
        //show_Id = showList[i].id;
        castingLink.addEventListener("click", function() {
            returnBut.style.display = "inline";
            fetchCasting(showList[i].id);
        });
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
    fetchEpisodes(show_Id, 0);
    pickEpisode.selectedIndex = 0;
}

function sortlist(selectElem) {
    let arrTexts = [];

    for (let i = 0; i < selectElem.length; i++) {
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

function sortshows(arrayOfObjects, factorOfSorting) {
    let arrTexts = [];
    let sortedArrayOfObjects = [];

    if (factorOfSorting !== 1) {
        for (let i = 0; i < arrayOfObjects.length; i++) {
            sortedArrayOfObjects[i] = arrayOfObjects[i];
        }

        return sortedArrayOfObjects.sort(function(a, b) {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            return nameA.localeCompare(nameB);
        });
        // for (let i = 0; i < arrayOfObjects.length; i++) {
        //     sortedArrayOfObjects[i] = arrayOfObjects.find(
        //         (object) => object.name == arrTexts[i]
        //     );
        // }
        //return sortedArrayOfObjects;
    }
    // return arrayOfObjects.sort(function(a, b) {
    //     const nameA = a.name.toLowerCase();
    //     const nameB = b.name.toLowerCase();
    //     return nameA.localeCompare(nameB);

    // });
    //sortedArrayOfObjects = arrayOfObjects;
    //}
    else {
        return arrayOfObjects.sort(function(a, b) {
            const rateA = a.rate;
            const rateB = b.rate;

            let comparison1 = 0;
            if (rateA > rateB) {
                comparison1 = 1;
            } else if (rateA < rateB) {
                comparison1 = -1;
            }
            return comparison1;
        });
        //sortedArrayOfObjects = arrayOfObjects;
    }
    // for (let i = 0; i < arrayOfObjects.length; i++) {
    //     arrTexts[i] = arrayOfObjects[i].rate;
    // }

    // arrayOfObjects.sort(function(a, b) {
    //     return a.rate - b.rate;
    // });
    // console.log(arrTexts);
    // for (let i = 0; i < arrayOfObjects.length; i++) {
    //     sortedArrayOfObjects[i] = arrayOfObjects.find(
    //         (object) => object.rate == arrTexts[i]
    //     );
    //sortedArrayOfObjects += tempAraay;

    //return sortedArrayOfObjects;
}
//episodes
function makePageForEpisodes(episodeList, seasonNo) {
    let seasonEpisodes = [];
    rootElem.innerHTML = "";

    // navigation link to go back to the shows list
    returnBut.style.display = "inline";
    if (seasonNo === 0) {
        seasonEpisodes = episodeList.map((episode) => episode);
    } else
        seasonEpisodes = episodeList.filter(
            (episode) => episode.season === seasonNo
        );

    for (let i = 0; i < seasonEpisodes.length; i++) {
        //The episode card
        var episodeElm = document.createElement("div");
        episodeElm.classList.add("episode-box");
        rootElem.appendChild(episodeElm);
        //The Name
        var episodeName = document.createElement("h3");
        episodeName.classList.add("episode-name-box");
        episodeName.innerText =
            seasonEpisodes[i].name +
            "-" +
            formatEpisode(seasonEpisodes[i].season, seasonEpisodes[i].number);
        episodeElm.appendChild(episodeName);
        // The Image
        var episodeImg = document.createElement("img");
        if (seasonEpisodes[i].image != null) {
            episodeImg.src = seasonEpisodes[i].image.medium;
            episodeImg.classList.add("episode-img-box");
            episodeElm.appendChild(episodeImg);
        }
        //The Episode Summary
        var episodesummary = document.createElement("div");
        episodesummary.innerHTML = seasonEpisodes[i].summary;
        episodesummary.style.padding = "10px";
        episodeElm.appendChild(episodesummary);
    }
}

function makePageForSeasons(seasonList, show_Id) {
    rootElem.innerHTML = "";

    // navigation link to go back to the shows list
    returnBut.style.display = "inline";

    for (let i = 0; i < seasonList.length; i++) {
        //The episode card
        var seasonElm = document.createElement("div");
        seasonElm.classList.add("season-box");
        rootElem.appendChild(seasonElm);
        //The Name
        var seasonName = document.createElement("h3");
        seasonName.classList.add("season-name-box");
        seasonName.innerHTML =
            "<a href=# >" + "Season" + seasonList[i].number + "</a>";
        seasonElm.appendChild(seasonName);
        seasonName.addEventListener("click", function() {
            fetchEpisodes(show_Id, seasonList[i].number);
        });
        // The Image
        var seasonImg = document.createElement("img");
        if (seasonList[i].image != null) {
            seasonImg.src = seasonList[i].image.medium;
            seasonImg.classList.add("episode-img-box");
            seasonElm.appendChild(seasonImg);
        }
        //The Episode Summary
        var seasonSummary = document.createElement("div");
        seasonSummary.innerHTML = seasonList[i].summary;
        seasonSummary.style.padding = "10px";
        seasonElm.appendChild(seasonSummary);
    }
}

function liveSearch() {
    newEpisodes = [];
    const searchString = searchInput.value.toLowerCase();
    const filteredEpisodes = allEpisodes.filter((episode) => {
        if (episode.summary !== null)
            return (
                episode.summary.toLowerCase().includes(searchString) ||
                episode.name.toLowerCase().includes(searchString)
            );
    });
    makeInputForEpisodes(filteredEpisodes);
    makePageForEpisodes(filteredEpisodes, 0);
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
    searchInput.style.display = "none";
    searchResult.style.display = "none";
    const thePickedEpisodIndex = pickEpisode.selectedIndex;
    const thePickedEpisodName = pickEpisode.options[
        thePickedEpisodIndex
    ].text.slice(7);
    //let theEpisodeName = pickEpisode.selectedIndex.value.slice(7);
    console.log(thePickedEpisodName);

    if (thePickedEpisodIndex > 0) {
        theEpisode.push(
            allEpisodes.find((episode) => episode.name === thePickedEpisodName)
        );
        makePageForEpisodes(theEpisode, 0);
        const div = document.createElement("div");
        rootElem.appendChild(div);
        const returnBut1 = document.createElement("button");
        returnBut1.innerText = "Return Back";
        returnBut1.style.width = "150px";
        returnBut1.style.height = "50px";
        returnBut1.style.fontSize = "16px";
        returnBut1.style.fontWeight = "bold";
        returnBut1.style.backgroundColor = "antiquewhite";
        div.appendChild(returnBut1);
        returnBut1.addEventListener("click", function() {
            searchInput.style.display = "inline";
            searchResult.style.display = "inline";
            fetchEpisodes(show_Id, 0);
            //event.preventDefault();
            //history.go(-1)
            // window.history.back();
        });
    } else makePageForEpisodes(allEpisodes, 0);
}

// select a show

window.onload = setup;
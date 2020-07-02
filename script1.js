//You can edit ALL of the code here
var newEpisodes = [];
var searchInput = document.getElementById("searchInput");
var pickEpisode = document.getElementById("select-episode");
var pickShow = document.getElementById("select-show");
const rootElem = document.getElementById("root");
var show_Id = 167;
var allEpisodes = [];
var allShows = [];

function formatEpisode(season, number) {
    if (season < 10) season = "0" + season;
    if (number < 10) number = "0" + number;
    return "S" + season + "E" + number;
}

function setup() {
    show_Id = 167;
    allShows = getAllShows();
    makeInputForShows(allShows);
    pickShow.addEventListener("change", pickAShow);
    fetchEpisodes(show_Id);
}

function fetchEpisodes(showId) {
    fetch("https://api.tvmaze.com/shows/" + showId + "/episodes")
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data);
            allEpisodes = data;
            rootElem.innerHTML = "";
            pickEpisode.selectedIndex = 0;
            makePageForEpisodes(allEpisodes);
            searchInput.addEventListener("keyup", liveSearch);
            makeInputForEpisodes(allEpisodes);
            pickEpisode.addEventListener("change", pickAnEpisod);
        })
        .catch((error) => {
            console.log(error);
        });
}

function makePageForEpisodes(episodeList) {
    for (let i = 0; i < episodeList.length; i++) {
        //The episode card
        var episodeElm = document.createElement("div");
        // episodeElm.style.backgroundColor = "white";
        // episodeElm.style.maxWidth = "280px";
        // episodeElm.style.border = "2px solid white ";
        // episodeElm.style.borderRadius = "10px";
        // episodeElm.style.margin = "10px";
        // episodeElm.style.marginTop = "0px";
        rootElem.appendChild(episodeElm);
        //The Name
        var episodeName = document.createElement("h3");
        episodeName.innerText =
            episodeList[i].name +
            "-" +
            formatEpisode(episodeList[i].season, episodeList[i].number);
        // episodeName.style.border = "2px solid black";
        // episodeName.style.borderRadius = "10px";
        // episodeName.style.padding = "20px";
        // episodeName.style.textAlign = "center";
        // episodeName.style.marginTop = "0px";
        episodeElm.appendChild(episodeName);
        // The Image
        var episodeImg = document.createElement("img");
        if (episodeList[i].image != null) {
            episodeImg.src = episodeList[i].image.medium;
            // episodeImg.style.margin = "auto";
            // episodeImg.style.display = "block";
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
    var searchResult = document.getElementById("searchResult");
    const searchString = searchInput.value.toLowerCase();
    const filteredEpisodes = allEpisodes.filter((episode) => {
        return (
            episode.summary.toLowerCase().includes(searchString) ||
            episode.name.toLowerCase().includes(searchString)
        );
    });
    return (searchResult.innerText =
        "Displaying " + filteredEpisodes.length + "/73 episodes");

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
function makeInputForEpisodes(episodeList) {
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
        div.appendChild(returnBut);
        returnBut.addEventListener("click", function() {
            fetchEpisodes(show_Id);
        });
    } else makePageForEpisodes(allEpisodes);
}

// select a show
function makeInputForShows(showList) {
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
window.onload = setup;
// body {
//     background - color: rgb(224, 221, 221);
// }

// #
// root {
//     display: flex;
//     flex - direction: row;
//     flex - wrap: wrap;
//     padding: 20 px;
// }

// #
// searchInput {
//     margin: 5 px;
//     width: 200 px;
//     height: 38 px;
// }

// #
// showSearchInput {
//     margin: 5 px;
//     width: 200 px;
//     height: 38 px;
// }

// #
// searchResult {
//     margin: 5 px;
//     font - size: "16";
//     color: rgb(7, 7, 87);
// }

// #
// showSearchResult {
//     margin: 5 px;
//     font - size: 20 px;
//     color: rgb(7, 7, 87);
// }

// #
// select - episode {
//     margin: 5 px;
//     box - sizing: border - box;
//     font - size: 16 px;
//     padding: 14 px 20 px 12 px 10 px;
//     border: none;
//     border - bottom: 1 px solid# ddd;
// }

// #
// select - show {
//     margin: 5 px;
//     box - sizing: border - box;
//     font - size: 16 px;
//     padding: 14 px 20 px 12 px 10 px;
//     border: none;
//     border - bottom: 1 px solid# ddd;
// }

// #
// returnBut {
//     margin: 5 px;
//     font - size: "16";
//     height: 38 px;
//     font - weight: bold;
//     font - size: 16 px;
//     background - color: aliceblue;
//     border: 1 px solid rgb(199, 200, 235);
//     border - radius: 5 px;
// }

// #
// select - episode: focus {
//     outline: 3 px solid rgb(236, 232, 232);
// }

// #
// select - episode option {
//     color: antiquewhite;
//     padding: 12 px 16 px;
//     text - decoration: none;
//     display: block;
// }

// #
// select - episode option: hover {
//     background - color: lightgray;
// }

// .title - box {
//     background - color: rgb(250, 250, 252);
//     width: "100%";
//     border - radius: 10 px;
//     margin: 5 px;
//     display: flex;
//     flex - direction: column;
//     /* and so forth */
// }

// .name - box {
//     border - radius: 10 px;
//     padding: 10 px;
//     margin: 5 px;
// }

// .show - box {
//     border - radius: 10 px;
//     margin: 10 px;
//     display: flex;
//     flex - direction: row;
// }

// img {
//     margin: 10 px;
// }

// .summary - box {
//     padding: 10 px;
//     font - size: 18 px;
//     width: 60 % ;
// }

// .information - box {
//     background - color: rgb(255, 255, 252);
//     width: 25 % ;
//     border - radius: 10 px;
//     margin: 5 px;
//     padding: 10 px;
//     font - size: 20 px;
//     display: flex;
//     flex - direction: column;
// }

// .episode - box {
//     /* episodeElm.style.backgroundColor="white";
//     episodeElm.style.maxWidth="280px";
//     episodeElm.style.border="2px solid white ";
//     episodeElm.style.borderRadius="10px";
//     episodeElm.style.margin="10px";
//     episodeElm.style.marginTop="0px"; */
//     background - color: white;
//     max - width: 280 px;
//     border: 2 px solid white;
//     border - radius: 10 px;
//     margin: 10 px;
//     margin - top: 0 px;
// }

// .episode - name - box {
//     /* episodeName.style.border="2px solid black";
//     episodeName.style.borderRadius="10px";
//     episodeName.style.padding="20px";
//     episodeName.style.textAlign="center";
//     episodeName.style.marginTop="0px"; */
//     border: 2 px solid black;
//     border - radius: 10 px;
//     padding: 20 px;
//     text - align: center;
//     margin - top: 0 px;
// }

// .episode - img - box {
//     margin: auto;
//     display: block;
// }

// button {
//     width: 150;
//     height: 38 px;
//     font - size: 16 px;
//     font - weight: bold;
//     background - color: aliceblue;
// }
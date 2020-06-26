//You can edit ALL of the code here
var newEpisodes = [];
var searchInput = document.getElementById("searchInput");
var pickEpisode = document.getElementById("select-episode");
const rootElem = document.getElementById("root");
var allEpisodes = getAllEpisodes();

function formatEpisode(season, number) {
    if (season < 10) season = "0" + season;
    if (number < 10) number = "0" + number;
    return "S" + season + "E" + number;
}

function setup() {
    rootElem.innerHTML = "";
    makePageForEpisodes(allEpisodes);
    searchInput.addEventListener("keyup", liveSearch);
    makeInputForEpisodes(allEpisodes);
    pickEpisode.addEventListener("change", pickAnEpisod);
}

function makePageForEpisodes(episodeList) {
    for (let i = 0; i < episodeList.length; i++) {
        //The episode card
        var episodeElm = document.createElement("div");
        episodeElm.style.backgroundColor = "white";
        episodeElm.style.maxWidth = "280px";
        episodeElm.style.border = "2px solid white ";
        episodeElm.style.borderRadius = "10px";
        episodeElm.style.margin = "10px";
        //episodeElm.style.alignItems = "center";
        episodeElm.style.marginTop = "0px";
        rootElem.appendChild(episodeElm);
        //The Name
        var episodeName = document.createElement("h3");
        episodeName.innerText =
            episodeList[i].name +
            "-" +
            formatEpisode(episodeList[i].season, episodeList[i].number);
        episodeName.style.border = "2px solid black";
        episodeName.style.borderRadius = "10px";
        episodeName.style.padding = "20px";
        episodeName.style.textAlign = "center";
        episodeName.style.marginTop = "0px";
        episodeElm.appendChild(episodeName);
        // The Image
        var episodeImg = document.createElement("img");
        episodeImg.src = episodeList[i].image.medium;
        //episodeImg.style.alignSelf = "center";
        episodeImg.style.margin = "auto";
        episodeImg.style.display = "block";
        //episodeImg.style.width = "50%";
        episodeElm.appendChild(episodeImg);
        //The Episode Summary
        var episodesummary = document.createElement("div");
        episodesummary.innerHTML = episodeList[i].summary;
        episodesummary.style.padding = "10px";
        episodeElm.appendChild(episodesummary);

        //rootElem.textContent = `Got ${episodeList.length} episode(s)`;
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

function makeInputForEpisodes(episodeList) {
    // var dataList = document.getElementById("browsers");
    //pickEpisode.appendChild(dataList);
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
        returnBut.addEventListener("click", setup);
    } else makePageForEpisodes(allEpisodes);
}
window.onload = setup;
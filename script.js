// INITIALISATION OF COMMON ELEMENTS
const rootElem = document.getElementById("root"),
  searchBar = document.getElementById("searchBar"),
  matches = document.getElementById("matches"),
  select = document.getElementById("selectEpisode");
let EPISODES;

// PROXY FUNCTION FOR RETURNING CACHED DATA FROM PROMISE
const getAllEpisodes = () => {
  return EPISODES;
};

// INITIALISATION CALLED BY WINDOW.ONLOAD WITH ADDED CATCHED DATA PROVIDED BY THE FETCH API
function setup() {
  fetch("https://api.tvmaze.com/shows/82/episodes")
    .then((response) => response.json())
    .then((data) => {
      EPISODES = data;
      render(getAllEpisodes());
    })
    .catch((error) => {
      console.log("Data hasn't arrive see error: ", error);
    });
}

function makePageForEpisodes(episodeList) {
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;
}

const episodeContainsTerm = (episode, searchTerm) => {
  const inTitle = episode.name,
    inDescription = episode.summary;
  return searchTerm.test(inTitle) || searchTerm.test(inDescription);
};

const searchCollection = () => {
  let searchTerm;
  if (!searchBar.value) {
    rootElem.replaceChildren();
    render(getAllEpisodes());
    return;
  } else {
    searchTerm = new RegExp(searchBar.value, "i");
    let episodesFound = getAllEpisodes().filter((episode) => {
      return episodeContainsTerm(episode, searchTerm);
    });
    rootElem.replaceChildren();
    render(episodesFound);
    return;
  }
};

const minTwoDigits = (num) => {
  if (num < 10) {
    return "0" + num;
  } else {
    return num;
  }
};

const episodeCode = (item) => {
  const S = minTwoDigits(item.season),
    E = minTwoDigits(item.number);
  return `S${S}E${E}`;
};

const render = (renderedList) => {
  // SELECT EPISODE
  select.replaceChildren();
  renderedList.forEach((episode) => {
    let option = document.createElement("option");
    option.value = episode.id;
    option.innerText = `${episodeCode(episode)} - ${episode.name}`;

    select.append(option);
  });

  // DISPLAY NUMBER OF MATCHES
  let numberOfAllEpisodes = getAllEpisodes().length;
  matches.innerText =
    "Currently showing " +
    renderedList.length +
    " episodes out of the " +
    numberOfAllEpisodes +
    " total.";
  console.log(searchBar.value);

  // ITERATE THROUGH COLLECTED DATA
  renderedList.forEach((item) => {
    // CREATE ELEMENTS
    let div = document.createElement("div"),
      title = document.createElement("h1"),
      img = document.createElement("img"),
      description = document.createElement("p");

    // FILL WITH CONTENT
    title.innerText = `${item.name}\n(${episodeCode(item)})`;
    img.src = item.image.medium;
    description.innerHTML = item.summary;

    // ADD CLASSES
    div.classList.add("epDiv");
    title.classList.add("epTitle");
    img.classList.add("epImg");
    description.classList.add("epDescription");

    // ADD ID
    div.setAttribute("id", item.id);

    // APPEND
    div.append(title, img, description);
    rootElem.append(div);
  });
};

const selectEpisode = () => {
  let episode = select.value;
  console.log(episode);
  window.location.href = `#${episode}`;
};

window.onload = () => {
  setup();
};

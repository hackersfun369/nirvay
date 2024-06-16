document.addEventListener('DOMContentLoaded', function() {
  if (Notification.permission !== 'granted') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        //console.log('Notification permission granted.');
      } else {
        //console.log('Notification permission denied.');
      }
    });
  }

  if ('mediaSession' in navigator) {
    //console.log('Media Session API is supported.');
  } else {
    //console.log('Media Session API is not supported.');
  }
});

function showMediaNotification(details) {

  navigator.mediaSession.metadata = new MediaMetadata({
    title: details.title,
    artist: details.singer,
    album: details.album,
    artwork: [
      { src: details.img, sizes: '96x96', type: 'image/png' },
      { src: details.img, sizes: '128x128', type: 'image/png' },
      { src: details.img, sizes: '192x192', type: 'image/png' },
      { src: details.img, sizes: '256x256', type: 'image/png' },
      { src: details.img, sizes: '384x384', type: 'image/png' },
      { src: details.img, sizes: '512x512', type: 'image/png' },
    ]
  });

  navigator.mediaSession.setActionHandler('play', () => {
    currentAudio.play();
  });
  navigator.mediaSession.setActionHandler('pause', () => {
    currentAudio.pause();
  });
  navigator.mediaSession.setActionHandler('previoustrack', () => {
    playPreviousSongAutomatically();
  });
  navigator.mediaSession.setActionHandler('nexttrack', () => {
    playNextSongAutomatically();
  });
}

function sendNotification(details) {
  if (Notification.permission === 'granted') {
    const notification = new Notification(details.title, {
      body: `Artist: ${details.singer}`,
      icon: details.img
    });

    notification.onclick = () => {
      window.focus();
    };
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // Function to set initial visibility of divs
  function initializeDivVisibility() {
    const quickpicks = document.querySelector('.quickpicks');
    const artistSongs = document.querySelector('.artistsdiv');
    const current = document.querySelector('.current');
    const favorites = document.querySelector('.favorites');
    const search = document.querySelector('.search');

    if (quickpicks) quickpicks.style.display = 'block';
    if (artistSongs) artistSongs.style.display = 'none';
    if (current) current.style.display = 'none';
    if (favorites) favorites.style.display = 'none';
    if (search) search.style.display = 'none';
  }

  // Call the initialization function on page load
  initializeDivVisibility();
});

function performFetch() {
  const url = "https://saavn.dev/api/search/songs?query=english&limit=20";
  fetch(url)
    .then(response => response.json())
    .then(res => {
      const results = res.data.results;
      //console.log(results);
      displayResults(results);
      displayQuickArtists(results);
    })
    .catch(error => console.error(error));
}

performFetch();

function performsearch() {
  const searchterm = document.getElementById('search-input').value;
  const url = `https://saavn.dev/api/search/songs?query=${searchterm}&limit=20`;
  fetch(url)
    .then(response => response.json())
    .then(res => {
      const results = res.data.results;
      //console.log(results);
      displaysearch(results);
    })
    .catch(error => console.error(error));
}

function fetchQuickAlbum() {
  const url = "https://saavn.dev/api/search/albums?query=English&limit=10";
  fetch(url)
    .then(response => response.json())
    .then(res => {
      const results = res.data.results;
      //console.log(results);
      displayQuickAlbum(results);
    })
    .catch(error => console.error(error));
}

fetchQuickAlbum();

const currentDiv = document.querySelector('.current-play');
const currentBack = document.querySelector('.current-play #back');
const currentImg = document.querySelector('.current-img img');
const currentTitle = document.querySelector('.current-titles h3');
const currentSinger = document.querySelector('.current-titles p');
const currentAudio = document.getElementById('current-audio');
const currentId = document.querySelector('.current-titles h2');
const cp = document.querySelector(".currenta");
const lyrics1 = document.getElementById("lyrics1");
const quickpicks = document.getElementById('quickpicks');

function displayResults(results) {
  const container = document.getElementById('quick-results');
  container.innerHTML = '';

  results.forEach(result => {
    const id = result.id;
    const songName = result.name;
    const audioUrl = result.downloadUrl[3].url;
    const imageUrl = result.image[2].url;
    const singerName = result.artists.primary[0].name;

    const songDiv = document.createElement('div');
    songDiv.classList.add('song-item');

    songDiv.innerHTML = `
      <img src="${imageUrl}" alt="${songName} cover art" class="image">
      <i class="fa-solid fa-heart heartbtn"></i>
      <div class='song-name'>
        <h2>${id}</h2>
        <h3>${songName}</h3>
        <p>${singerName}</p>
        <audio src="${audioUrl}" controls class="audio">
          Your browser does not support the audio element.
        </audio>
      </div>
    `;

    songDiv.addEventListener('click', function() {
      // Update current-play elements
      updateCurrentPlaying({
        img: songDiv.querySelector('img').src,
        title: songDiv.querySelector('h3').textContent,
        singer: songDiv.querySelector('p').textContent,
        audio: songDiv.querySelector('audio').src,
        id: songDiv.querySelector('h2').textContent
      });
      fetchLyrics(id);
    });

    container.appendChild(songDiv);

    const heartButton = songDiv.querySelector('.heartbtn');
    heartButton.addEventListener('click', function(event) {
      event.stopPropagation();
      addSongToFavorites(songDiv);
    });

  });
}


function displaysearch(results) {
  const container = document.getElementById('search');
  container.innerHTML = '';

  results.forEach(result => {
    const id = result.id;
    const songName = result.name;
    const audioUrl = result.downloadUrl[3].url;
    const imageUrl = result.image[2].url;
    const singerName = result.artists.primary[0].name;

    const songDiv = document.createElement('div');
    songDiv.classList.add('song-item');

    songDiv.innerHTML = `
      <img src="${imageUrl}" alt="${songName} cover art" class="image">
      <i class="fa-solid fa-heart heartbtn"></i>
      <div class='song-name'>
        <h2>${id}</h2>
        <h3>${songName}</h3>
        <p>${singerName}</p>
        <audio src="${audioUrl}" controls class="audio">
          Your browser does not support the audio element.
        </audio>
      </div>
    `;

    songDiv.addEventListener('click', function() {
    currentDiv.style.display = 'block';
    quickpicks.style.display = 'none';
    favoritesDiv.style.display = 'none';
    searchdiv.style.display = 'none';
      // Update current-play elements
      updateCurrentPlaying({
        img: songDiv.querySelector('img').src,
        title: songDiv.querySelector('h3').textContent,
        singer: songDiv.querySelector('p').textContent,
        audio: songDiv.querySelector('audio').src,
        id: songDiv.querySelector('h2').textContent
      });
      fetchLyrics(id);
    });

    container.appendChild(songDiv);

    const heartButton = songDiv.querySelector('.heartbtn');
    heartButton.addEventListener('click', function(event) {
      event.stopPropagation();
      addSongToFavorites(songDiv);
    });

  });
}


function fetchLyrics(id) {
  const url = `https://saavn.dev/api/songs/${id}/lyrics`;
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch lyrics');
      }
      return response.json();
    })
    .then(res => {
      //console.log(res);
      const lyrics = res.data.lyrics;
      lyrics1.innerHTML = lyrics;
    })
    .catch(error => console.error(error));
}

function displayQuickArtists(results) {
  const artistsContainer = document.getElementById('quick-artists');
  artistsContainer.innerHTML = '';

  results.forEach(result => {
    const singerName = result.artists.primary[0].name;
    let singerImg = '';
    if (result.artists.primary[0].image.length > 1) {
      singerImg = result.artists.primary[0].image[1].url;
    } else {
      singerImg = 'user.png'; // Replace with a default image URL
    }

    const artistDiv = document.createElement('div');
    artistDiv.classList.add('artist-item');

    artistDiv.innerHTML = `
      <img src="${singerImg}" alt="${singerName} cover art">
      <div class='song-name'>
        <p>${singerName}</p>
      </div>
    `;
    artistsContainer.appendChild(artistDiv);
  });
}

const currentPlay = document.querySelector('.current-play');
currentPlay.addEventListener('click', function() {
  var audio = currentPlay.querySelector('audio');
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
});

let progress = document.getElementById("progress");
let song = document.getElementById("current-audio");
let id = document.getElementById("id");
let back = document.getElementById("back");

song.onloadedmetadata = function() {
  progress.max = song.duration;
  progress.value = song.currentTime;
}

if (song.play()) {
  setInterval(() => {
    progress.value = song.currentTime;
  }, 500);
}

progress.onchange = function() {
  song.play();
  song.currentTime = progress.value;
}

function toggleLyrics() {
  if (lyrics1.style.display === 'none' || lyrics1.style.display === '') {
    lyrics1.style.display = 'block';
  } else {
    lyrics1.style.display = 'none';
  }
}
function toggleAlbum() {
  currentDiv.style.display = 'none';
  quickpicks.style.display = 'none';
  favoritesDiv.style.display = 'none';
  searchdiv.style.display = 'none';
  searchInput.style.display="none";
  artistDiv.style.display = 'none';
  albumDiv.style.display="block";
  artistinput.style.display="none";
}
function toggleArtists() {
  currentDiv.style.display = 'none';
  quickpicks.style.display = 'none';
  favoritesDiv.style.display = 'none';
  searchdiv.style.display = 'none';
  searchInput.style.display="none";
  artistDiv.style.display = 'block';
  albumDiv.style.display="none";
  artistinput.style.display="block";
}
function toggleCurrent() {
    currentDiv.style.display = 'block';
    quickpicks.style.display = 'none';
    favoritesDiv.style.display = 'none';
    searchdiv.style.display = 'none';
    searchInput.style.display="none";
    artistDiv.style.display = 'none';
    albumDiv.style.display="none";
    artistinput.style.display="none";
}

const favoritesDiv = document.getElementById('favourites');
const artistDiv = document.getElementById('artistsdiv');
const albumDiv = document.getElementById('albumdiv');
const artistinput = document.getElementById('artistinput');
const artistimg = document.getElementById('artistimg');
function toggleFavourite() {
    favoritesDiv.style.display = 'block';
    currentDiv.style.display = 'none';
    quickpicks.style.display = 'none';
    searchdiv.style.display = 'none';
    searchInput.style.display="none";
    artistDiv.style.display = 'none';
    albumDiv.style.display="none";
    artistinput.style.display="none";
}
const searchdiv = document.getElementById('search');
const searchInput= document.getElementById('search-input');
function toggleSearch() {
  searchInput.style.display="block";
    searchdiv.style.display = 'block';
    currentDiv.style.display = 'none';
    quickpicks.style.display = 'none';
    favoritesDiv.style.display = 'none';
    artistDiv.style.display = 'none';
    albumDiv.style.display="none";
    artistinput.style.display="none";
}

function toggleQuicks() {
    searchdiv.style.display = 'none';
    currentDiv.style.display = 'none';
    quickpicks.style.display = 'block';
    favoritesDiv.style.display = 'none';
    searchInput.style.display="none";
    artistDiv.style.display = 'none';
    albumDiv.style.display="none";
    artistinput.style.display="none";
}


function displayQuickAlbum(results) {
  const albumsContainer = document.getElementById('quick-album');
  albumsContainer.innerHTML = '';

  results.forEach(result => {
    const albumName = result.name;
    const albumImg = result.image[1].url;
    const aurl = result.url;

    const albumDiv = document.createElement('div');
    albumDiv.classList.add('album-item');

    albumDiv.innerHTML = `
      <img src="${albumImg}" alt="${albumName} cover art">
      <div class='song-name'>
        <a href='${aurl}'>${albumName}</a>
      </div>
    `;
    albumsContainer.appendChild(albumDiv);
  });
}

function updateCurrentPlaying(details) {
  // Pause all audios except the current one
  const allAudios = document.querySelectorAll('.audio');
  allAudios.forEach(audio => {
    if (audio !== currentAudio) {
      audio.pause();
    }
  });

  currentPlay.style.backgroundImage = `url(${details.img})`;
  currentPlay.style.backgroundSize = 'contain';
  currentPlay.style.backgroundPosition = 'top';
  currentTitle.textContent = details.title;
  currentSinger.textContent = details.singer;
  currentAudio.src = details.audio;
  currentId.textContent = details.id;
  currentDiv.style.display = "block";
  fetchLyrics(details.id);
  currentAudio.play();

  // Update progress bar and song metadata
  currentAudio.onloadedmetadata = function() {
    progress.max = currentAudio.duration;
    progress.value = currentAudio.currentTime;
  };

  // Progress bar update
  if (currentAudio.play()) {
    setInterval(() => {
      progress.value = currentAudio.currentTime;
    }, 500);
  }

  progress.onchange = function() {
    currentAudio.play();
    currentAudio.currentTime = progress.value;
  };

  // Add event listener for ended event to play next song automatically
  currentAudio.addEventListener('ended', () => {
   if (currentAudio.readyState >= currentAudio.HAVE_FUTURE_DATA) {
    currentAudio.play();
    playNextSongAutomatically();
  } else {
    currentAudio.addEventListener('canplaythrough', function() {
      currentAudio.play();
    });
  }
  });
  showMediaNotification(details);
}

function playNextSongAutomatically() {
  const songItems = document.querySelectorAll('.song-item');
  for (let i = 0; i < songItems.length; i++) {
    const songDiv = songItems[i];
    if (songDiv.querySelector('h2').textContent === currentId.textContent) {
      const nextResultItem = songDiv.nextElementSibling;
      if (nextResultItem) {
        const nextAudio = nextResultItem.querySelector('.audio');
        nextAudio.play();
        nextResultItem.querySelector('h2').style.color = 'orange';
        songDiv.querySelector('h2').style.color = 'white';
        updateCurrentPlaying({
          img: nextResultItem.querySelector('.image').src,
          title: nextResultItem.querySelector('h3').textContent,
          singer: nextResultItem.querySelector('p').textContent,
          audio: nextAudio.src,
          id: nextResultItem.querySelector('h2').textContent
        });
      }
      break;
    }
  }
}

function playPreviousSongAutomatically() {
  const songItems = document.querySelectorAll('.song-item');
  for (let i = 0; i < songItems.length; i++) {
    const songDiv = songItems[i];
    if (songDiv.querySelector('h2').textContent === currentId.textContent) {
      const previousResultItem = songDiv.previousElementSibling;
      if (previousResultItem) {
        const previousAudio = previousResultItem.querySelector('.audio');
        previousAudio.play();
        previousResultItem.querySelector('h2').style.color = 'orange';
        songDiv.querySelector('h2').style.color = 'white';
        updateCurrentPlaying({
          img: previousResultItem.querySelector('.image').src,
          title: previousResultItem.querySelector('h3').textContent,
          singer: previousResultItem.querySelector('p').textContent,
          audio: previousAudio.src,
          id: previousResultItem.querySelector('h2').textContent
        });
      }
      break;
    }
  }
}

function addSongToFavorites(songItem) {
  const songId = songItem.querySelector('h2').textContent;

  // Check if the song is already in the favorites
  if (!isSongInFavorites(songId)) {
    const favoriteItem = songItem.cloneNode(true);
    const heartButton = favoriteItem.querySelector('.heartbtn');

    // Add event listener to remove the song from favorites when heart button is clicked
    heartButton.addEventListener('click', function(event) {
      event.stopPropagation();
      favoriteItem.remove();
      saveFavoritesToLocalStorage();
    });

    favoritesDiv.appendChild(favoriteItem);
    saveFavoritesToLocalStorage();
  }
}

function isSongInFavorites(songId) {
  return Array.from(favoritesDiv.querySelectorAll('.song-item')).some(item => item.querySelector('h2').textContent === songId);
}

// Function to save favorites to localStorage
function saveFavoritesToLocalStorage() {
  const favoriteItems = [];
  favoritesDiv.querySelectorAll('.song-item').forEach(item => {
    favoriteItems.push({
      id: item.querySelector('h2').textContent,
      songName: item.querySelector('h3').textContent,
      singerName: item.querySelector('p').textContent,
      audioUrl: item.querySelector('audio').src,
      imageUrl: item.querySelector('img').src
    });
  });
  localStorage.setItem('favorites', JSON.stringify(favoriteItems));
}

// Function to load favorites from localStorage
function loadFavoritesFromLocalStorage() {
  const favoriteItems = JSON.parse(localStorage.getItem('favorites')) || [];
  favoriteItems.forEach(item => {
    const favDiv = document.createElement('div');
    favDiv.classList.add('song-item');

    favDiv.innerHTML = `
      <img src="${item.imageUrl}" alt="${item.songName} cover art" class="image">
      <i class="fa-solid fa-heart heartbtn"></i>
      <div class='song-name'>
        <h2>${item.id}</h2>
        <h3>${item.songName}</h3>
        <p>${item.singerName}</p>
        <audio src="${item.audioUrl}" controls class="audio">
          Your browser does not support the audio element.
        </audio>
      </div>
    `;

    const heartButton = favDiv.querySelector('.heartbtn');
    heartButton.addEventListener('click', function(event) {
      event.stopPropagation();
      favDiv.remove();
      saveFavoritesToLocalStorage();
    });

    favDiv.addEventListener('click', function() {
      currentDiv.style.display = 'block';
      quickpicks.style.display = 'none';
      favoritesDiv.style.display = 'none';
      searchdiv.style.display = 'none';
      // Update current-play elements
      updateCurrentPlaying({
        img: favDiv.querySelector('img').src,
        title: favDiv.querySelector('h3').textContent,
        singer: favDiv.querySelector('p').textContent,
        audio: favDiv.querySelector('audio').src,
        id: favDiv.querySelector('h2').textContent
      });
      fetchLyrics(id);
    });

    favoritesDiv.appendChild(favDiv);
  });
}

// Call loadFavoritesFromLocalStorage on page load
document.addEventListener('DOMContentLoaded', () => {
  loadFavoritesFromLocalStorage();

  const heartButtons = document.querySelectorAll('.heartbtn');

  heartButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const songItem = button.parentElement;
      addSongToFavorites(songItem);
    });
  });
});

document.getElementById('search-input').addEventListener('keydown', async (event) => {
  if (event.key === 'Enter') {
      await performsearch();
  }
});
document.getElementById('artist-search').addEventListener('keydown', async (event) => {
  if (event.key === 'Enter') {
      await performFetch2();
  }
});
document.addEventListener("DOMContentLoaded", function() {
  const links = document.querySelectorAll("aside a");

  links.forEach(link => {
      link.addEventListener("click", function() {
          links.forEach(l => l.classList.remove("active"));
          this.classList.add("active");
      });
  });
});

function performFetch2() {
  const searchartist = document.getElementById('artist-search').value;
  const url = `https://saavn.dev/api/search/artists?query=${searchartist}`;
  fetch(url)
      .then(response => response.json())
      .then(res => {
          console.log(res);
          const id = res.data.results[0].id;
          const img = res.data.results[0].image[2].url;
          document.getElementById('artistimg').src = img;
          document.getElementById('artistname').innerHTML = searchartist;
          performFetch1(id);
      })
      .catch(error => console.error(error));
}
function performFetch1(id) {
  const url = `https://saavn.dev/api/artists/${id}/songs`;
  fetch(url)
    .then(response => response.json())
    .then(res => {
      console.log(res);
      const results = res.data.songs;
      displayArtistSongs(results);
    })
    .catch(error => console.error(error));
}

function displayArtistSongs(songs) {
  const container = document.querySelector('.artist-songs');
  container.innerHTML = '';

  songs.forEach(song => {
    const songDiv = document.createElement('div');
    songDiv.classList.add('song-item');

    songDiv.innerHTML = `
      <img src="${song.image[2].url}" alt="${song.name} cover art" class="image">
      <audio src="${song.downloadUrl[3].url}" controls class="audio">
        Your browser does not support the audio element.
      </audio>
      <h3>${song.name}</h3>
    `;

    songDiv.addEventListener('click', function() {
      currentDiv.style.display = 'block';
      quickpicks.style.display = 'none';
      favoritesDiv.style.display = 'none';
      searchdiv.style.display = 'none';

      updateCurrentPlaying({
        img: song.image[2].url,
        title: song.name,
        singer: song.primary_artists,
        audio: song.downloadUrl[3].url,
        id: song.id
      });
    });

    container.appendChild(songDiv);
  });
}
let songList = [];
let currentSongIndex = -1;
let isPlaying = false;
let playlists = JSON.parse(localStorage.getItem("soundwave-playlists") || "[]");

const audioPlayer = document.getElementById("audio-player");
const playBtn = document.getElementById("play-btn");
const playerElement = document.getElementById("player");

// File upload handling
document.getElementById("open-file-dialog").addEventListener("click", () => {
  document.getElementById("file-input").click();
});

document
  .getElementById("file-input")
  .addEventListener("change", handleFileUpload);

function handleFileUpload(event) {
  const files = Array.from(event.target.files);

  files.forEach((file) => {
    if (file.type.startsWith("audio/")) {
      const song = {
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
        artist: "Local Music",
        url: URL.createObjectURL(file),
        duration: "0:00", // We'll update this after loading
      };
      songList.push(song);
      addSongToUploadedList(song);
    }
  });

  updateRecentlyPlayed();
  document.getElementById("upload-tab").click();
}

function addSongToUploadedList(song) {
  const list = document.getElementById("uploaded-songs-list");
  const songElement = document.createElement("div");
  songElement.className =
    "flex items-center p-3 bg-gray-700 rounded hover:bg-gray-600 transition cursor-pointer";
  songElement.innerHTML = `
                <img src="https://placehold.co/50x50/6366f1/white" alt="Album cover for uploaded song, showing abstract musical patterns in purple tone" class="w-12 h-12 rounded mr-4">
                <div class="flex-1">
                    <p class="font-semibold">${song.title}</p>
                    <p class="text-gray-400">${song.artist}</p>
                </div>
                <button class="play-song-btn mr-3">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M8 5v10l8-5-8-5z"/></svg>
                </button>
                <button class="remove-song-btn text-gray-400 hover:text-red-400">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.618l-.544-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                </button>
            `;
  list.appendChild(songElement);

  // Play button listener
  songElement.querySelector(".play-song-btn").addEventListener("click", () => {
    playSong(songList.indexOf(song));
  });

  // Remove button listener
  songElement
    .querySelector(".remove-song-btn")
    .addEventListener("click", (e) => {
      e.stopPropagation();
      songList.splice(songList.indexOf(song), 1);
      songElement.remove();
      updateRecentlyPlayed();
    });
}

// Play a song
function playSong(index) {
  if (index < 0 || index >= songList.length) return;

  currentSongIndex = index;
  const song = songList[index];

  audioPlayer.src = song.url;
  audioPlayer.load();

  document.getElementById("current-song-title").textContent = song.title;
  document.getElementById("current-song-artist").textContent = song.artist;

  audioPlayer.play();
  isPlaying = true;
  updatePlayButton();
  playerElement.classList.remove("hidden");
}

// Play/Pause toggle
playBtn.addEventListener("click", () => {
  if (isPlaying) {
    audioPlayer.pause();
    isPlaying = false;
  } else {
    audioPlayer.play();
    isPlaying = true;
  }
  updatePlayButton();
});

function updatePlayButton() {
  playBtn.innerHTML = isPlaying
    ? '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><rect width="4" height="16" x="6" y="2"/><rect width="4" height="16" x="14" y="2"/></svg>'
    : '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M8 5v10l8-5-8-5z"/></svg>';
}

// Previous and Next buttons
document.getElementById("prev-btn").addEventListener("click", () => {
  if (currentSongIndex > 0) {
    playSong(currentSongIndex - 1);
  }
});

document.getElementById("next-btn").addEventListener("click", () => {
  if (currentSongIndex < songList.length - 1) {
    playSong(currentSongIndex + 1);
  }
});

// Progress bar and volume
audioPlayer.addEventListener("timeupdate", () => {
  const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100 || 0;
  document.getElementById("progress-bar").value = progress;
  document.getElementById("current-time").textContent = formatTime(
    audioPlayer.currentTime
  );
});

audioPlayer.addEventListener("loadedmetadata", () => {
  document.getElementById("duration").textContent = formatTime(
    audioPlayer.duration
  );
});

document.getElementById("progress-bar").addEventListener("input", (e) => {
  const seekTime = (e.target.value / 100) * audioPlayer.duration;
  audioPlayer.currentTime = seekTime;
});

document.getElementById("volume-slider").addEventListener("input", (e) => {
  audioPlayer.volume = e.target.value / 100;
});

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? "0" + sec : sec}`;
}

// Tab switching
document.querySelectorAll("[data-tab]").forEach((item) => {
  item.addEventListener("click", function () {
    const tabName = this.getAttribute("data-tab");
    document
      .querySelectorAll(".content-tab")
      .forEach((tab) => tab.classList.add("hidden"));
    document.getElementById(`${tabName}-content`).classList.remove("hidden");
    document.querySelectorAll("[data-tab]").forEach((tab) => {
      tab.classList.remove("text-white");
      tab.classList.add("text-gray-400");
    });
    this.classList.add("text-white");
    this.classList.remove("text-gray-400");
  });
});

// Update recently played list
function updateRecentlyPlayed() {
  const list = document.getElementById("recently-played-list");
  list.innerHTML = "";
  if (songList.length === 0) {
    list.innerHTML =
      '<p class="text-gray-400">No recent songs. Add some music files!</p>';
    return;
  }
  songList.forEach((song, index) => {
    const item = document.createElement("div");
    item.className =
      "flex items-center p-3 bg-gray-700 rounded hover:bg-gray-600 transition cursor-pointer";
    item.innerHTML = `
                    <img src="https://placehold.co/50x50/6366f1/white" alt="Album cover for song in recently played list, abstract musical design in purple tones" class="w-12 h-12 rounded mr-4">
                    <div class="flex-1">
                        <p class="font-semibold">${song.title}</p>
                        <p class="text-gray-400">${song.artist}</p>
                    </div>
                    <button class="play-song-btn">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M8 5v10l8-5-8-5z"/></svg>
                    </button>
                `;
    item
      .querySelector(".play-song-btn")
      .addEventListener("click", () => playSong(index));
    list.appendChild(item);
  });
}

// Auto-play next song when current ends
audioPlayer.addEventListener("ended", () => {
  if (currentSongIndex < songList.length - 1) {
    playSong(currentSongIndex + 1);
  } else {
    isPlaying = false;
    updatePlayButton();
  }
});

// Initialize
document.getElementById("home-tab").click();

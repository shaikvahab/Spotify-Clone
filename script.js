console.log("let's write some java script");
const currentSong = document.getElementById("currentSong");
let songs;


// const songPath = `songs/${songName}.mp3`;

// async function getSongs() {

//     let a = await fetch("http://127.0.0.1:3000/songs/");
//     let respons = a.text();
//     let div = document.createElement("div");
//     div.innerHTML = respons;
//     let as = div.getElementsByTagName("a");
//     let songs = [];
//     for (let index = 0; index < as.length; index++) {
//         const element = as[index];

//         if (element.href.endsWith(".mp3")) {
//             songs.push(element.href)
//         }
//         return songs
//     }
// }

// async function main() {
//     let songs = await getSongs();
//     console.log(songs);

// }
// main();


function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs() {
    try {
        let response = await fetch("http://127.0.0.1:3000/songs/");

        // Check if the response is okay
        if (!response.ok) {
            console.error("Failed to fetch songs:", response.status);
            return [];
        }

        let a = await response.text();
        console.log("Response Text:", a); // Debug: Log the HTML content

        let div = document.createElement("div");
        div.innerHTML = a;
        let as = div.getElementsByTagName("a");
        let songs = [];

        for (let index = 0; index < as.length; index++) {
            const element = as[index];
            console.log("Found link:", element.href); // Debug: Log each link

            if (element.href.endsWith(".mp3")) {
                songs.push(decodeURIComponent(element.href.split("/songs/")[1]));
            }
        }

        return songs;
    } catch (error) {
        console.error("Error fetching songs:", error);
        return [];
    }
}


// function for playing music
const playmusic = (track, pause = false) => {
    console.log("Playing track:", track); // Debug
    currentSong.src = "/songs/" + track;
    if (!pause) {

        currentSong.play();
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00/00:00";
};






async function main() {

    // Fetch songs
    let songs = await getSongs();
    console.log("Songs found:", songs);
    playmusic(songs[0], true)

    // Display the song list
    let songUL = document.querySelector(".songList ul");
    songUL.innerHTML = ""; // Clear existing list
    for (const song of songs) {
        const liHTML = `<li> 
                <img class="invert" src="music.svg" alt="">
                <div class="info">
                    <div>${song.replaceAll("%20", " ")}</div>
                    <div>Artist</div>
                </div>
                <div class="playnow">
                    <span>Play Now</span>
                    <img class="invert" src="playnow.svg" alt="">
                </div>
            </li>`;
        songUL.innerHTML += liHTML;
    }

    // Attach event listeners to each songlist.
    Array.from(songUL.getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            const songName = e.querySelector(".info").firstElementChild.innerHTML.trim();
            playmusic(songName);
        });
    });

    // Attach an event listener to play, next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "play.svg"
        }
    })


    // Attach an event listener to show  current song duration.

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    // add an event listener to hamburger

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    // add an event listener to hamburger

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-300%";
    });

    // add an event listener to previous


    previous.addEventListener("click", () => {
        currentSong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playmusic(songs[index - 1])
        }
    })


    // add an event listener to next


    next.addEventListener("click", () => {
        currentSong.pause()
        console.log("Next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playmusic(songs[index + 1])
        }
    })

    // Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100")
        currentSong.volume = parseInt(e.target.value) / 100
        if (currentSong.volume >0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
        }
    })


}


main();

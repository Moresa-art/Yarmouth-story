const scrollElements = document.querySelectorAll('.js-scroll');
scrollElements.forEach((el) => {
    if (elementInView(el, .2)) {
        displayScrollElement(el)
    }
})
window.addEventListener('scroll', throttle(handleScrollAnimation, 100))
const title = document.getElementById("title")
window.addEventListener('load', function () {
    title.classList.add('fade-in')
})
// display functions
// checks whether element is in viewable area
function elementInView(el, amountInView = 1) {
    const elementTop = el.getBoundingClientRect().top;
    const elementHeight = el.getBoundingClientRect().height;
    return (
        elementTop + elementHeight * amountInView <= document.documentElement.clientHeight && elementTop + elementHeight * amountInView > 0
    )
}
// checks whether element is above or below viewable area
function elementOutOfView(el) {
    const elementTop = el.getBoundingClientRect().top;
    const elementBottom = el.getBoundingClientRect().bottom;
    return (
        elementTop >= document.documentElement.clientHeight || elementBottom < 0
    )
}
// show element
function displayScrollElement(el) {
    el.classList.add("scrolled");
}
// hide element
function hideScrollElement(el) {
    el.classList.remove("scrolled")
}
function handleScrollAnimation() {
    scrollElements.forEach((el) => {
        if (elementInView(el, .2)) {
            displayScrollElement(el)
        } else if (elementOutOfView(el)) {
            hideScrollElement(el)
        }
    }
    )
}
//UTILITY
// throttle - fn = function to call, wait = interval in ms
function throttle(fn, wait) {
    let inThrottle, lastFn, lastTime;
    return function () {
        const context = this,
            args = arguments;
        if (!inThrottle) {
            fn.apply(context, args);
            lastTime = Date.now();
            inThrottle = true;
        } else {
            clearTimeout(lastFn);
            lastFn = setTimeout(function () {
                if (Date.now() - lastTime >= wait) {
                    fn.apply(context, args);
                    lastTime = Date.now();
                }
            }, Math.max(wait - (Date.now() - lastTime), 0));
        }
    };
};


console.log("js Scroll")
const currenTime = document.getElementById("current-time");
const totalTime = document.getElementById("total-time");
const playPauseButton = document.getElementById("play-pause-button");
const seekBar = document.getElementById("seek-bar");
const volumeBar = document.getElementById("volume-bar");
const audio = new Audio("audio/seagulls.webm");
const volumeButton = document.getElementById("volume-buttom");
let isSeeking = false


playPauseButton.onclick = function () {
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
}
//AUDIO LISTENERS
//event triggered once audio loaded
audio.oncanplaythrough = function () {
    seekBar.disabled = false;
}
//event triggered when audio plays
audio.onplay = function () {
    playPauseButton.src = "img/pause.svg"
}
//event triggered when audio paused
audio.onpause = function () {
    playPauseButton.src = "img/play.svg"
}
//event triggered by meta data load
audio.onloadedmetadata = function () {
    totalTime.innerHTML = formatTime(audio.duration);
    currenTime.innerHTML = formatTime(0);
    seekBar.max = Math.floor(audio.duration);
}
// event triggered when playback time updates
audio.ontimeupdate = function () {
    currenTime.innerHTML = formatTime(audio.currentTime)
    if (!isSeeking) {
        seekBar.value = Math.floor(audio.currentTime)
    }

}
//event triggered when audio ends
audio.onended = function () {
    currenTime.innerHTML = formatTime(0);
    seekBar.value = 0;
    playPauseButton.src = "img/play.svg";
}
//SEEK BAR LISTENERS
//event triggered on intercation with seek bar
seekBar.oninput = function () {
    isSeeking = true;
}
//event triggered when  seek bar changed manually
seekBar.onchange = function () {
    audio.currentTime = seekBar.value;
    isSeeking = false
}
volumeBar.onchange = function () {

    audio.volume = volumeBar.value / 100;
}



//UTILITY FUNCTIONS
// takes total seconds (number) and returns a formatted string 
function formatTime(secs) {
    let hours = Math.floor(secs / 3600);
    let minutes = Math.floor((secs - (hours * 3600)) / 60);
    let seconds = Math.floor((secs - (hours * 3600)) - minutes * 60);
    if (hours < 10) {
        hours = "0" + hours;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    if (hours > 0) {
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        return hours + ":" + minutes + ":" + seconds;
    } else {
        return minutes + ":" + seconds;
    }
}

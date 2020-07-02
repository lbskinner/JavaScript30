// get our elements
const player = document.querySelector(".player");
const video = player.querySelector(".viewer");
// the progress bar
const progress = player.querySelector(".progress");
// the progress color
const progressBar = player.querySelector(".progress__filled");

const toggle = player.querySelector(".toggle");
const skipButtons = player.querySelectorAll("[data-skip]");
const ranges = player.querySelectorAll(".player__slider");

const view = player.querySelector(".screenSize");

// build out functions
function togglePlay() {
  // pause is a property for video
  const method = video.paused ? "play" : "pause";
  video[method]();
  // below code works the same as above code
  //   if (video.paused) {
  //     video.play();
  //   } else {
  //     video.pause();
  //   }
}

function updateButtons() {
  console.log("update the button");
  const icon = this.paused ? "►" : "❚ ❚";
  toggle.textContent = icon;
}

function skip() {
  console.log("Skipping", this.dataset.skip);
  video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
  console.log(this.name, this.value);
  video[this.name] = this.value;
}

function handleProgress() {
  // currentTime and duration are properties of video
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

function scrub(event) {
  console.log(event);
  // event.offsetX gives where the user clicked on the progress
  // progress.offsetWidth gives the entire width of the bar
  // scrub time calculates the play time based on the click of progress bar
  const scrubTime = (event.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
}

function toggleScreenView() {
  console.log("Screen Size Button Clicked");
  player.classList.toggle("fullScreen");
  const iconButton = player.classList.contains("fullScreen") ? "⇲" : "⇱";
  view.textContent = iconButton;
}
// hook up the event listeners
// play and stop video when click on the video
video.addEventListener("click", togglePlay);
// when video is playing or paused, update the play button
video.addEventListener("play", updateButtons);
video.addEventListener("pause", updateButtons);
// listen for time change on the video
video.addEventListener("timeupdate", handleProgress);

// play and stop video when click on the play button
toggle.addEventListener("click", togglePlay);

skipButtons.forEach((button) => button.addEventListener("click", skip));
ranges.forEach((range) => range.addEventListener("change", handleRangeUpdate));

let mousedown = false;
progress.addEventListener("click", scrub);
progress.addEventListener("mousemove", (event) => mousedown && scrub(event));
progress.addEventListener("mousedown", () => (mousedown = true));
progress.addEventListener("mouseup", () => (mousedown = false));

view.addEventListener("click", toggleScreenView);

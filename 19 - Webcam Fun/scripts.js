const video = document.querySelector(".player");
const canvas = document.querySelector(".photo");
const ctx = canvas.getContext("2d");
const strip = document.querySelector(".strip");
const snap = document.querySelector(".snap");

function getVideo() {
  // returns a promise
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((localMediaStream) => {
      console.log(localMediaStream);
      // creatObjectURL resulted an error:
      // Uncaught (in promise) TypeError: Failed to execute 'createObjectURL' on 'URL':
      // No function was found that matched the signature provided.
      //   video.src = window.URL.createObjectURL(localMediaStream);
      video.srcObject = localMediaStream;
      video.play();
    })
    .catch((error) => {
      console.log("Get Video Error:", error);
    });
}

function paintToCanavas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  console.log(width, height);
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    // take the pixels out
    let pixels = ctx.getImageData(0, 0, width, height);
    // add effects to them
    // pixels = redEffect(pixels);
    // pixels = rgbSplit(pixels);
    // add transparency
    // ctx.globalAlpha = 0.1;
    pixels = greenScreen(pixels);
    // put the pixels with effects back
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function takePhoto() {
  // play the take picture sound
  snap.currentTime = 0;
  snap.play();

  // take the data out of the canvas
  // data is the text representation of the picture
  const data = canvas.toDataURL("image/jpeg");
  // created a link element
  const link = document.createElement("a");
  // set the link href to data variable
  link.href = data;
  // set name of image to beautiful
  link.setAttribute("download", "beautiful");
  link.innerHTML = `<img src="${data}" alt="beautiful"/>`;
  // link text displayed
  //   link.textContent = "Download Image";
  strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 100; // red
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // green
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // blue
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // red
    pixels.data[i + 100] = pixels.data[i + 1]; // green
    pixels.data[i - 150] = pixels.data[i + 2]; // blue
  }
  return pixels;
}

function greenScreen(pixels) {
  // establish levels object to hold min and max green
  const levels = {};

  // get all sliders on DOM
  document.querySelectorAll(".rgb input").forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (
      red >= levels.rmin &&
      green >= levels.gmin &&
      blue >= levels.bmin &&
      red <= levels.rmax &&
      green <= levels.gmax &&
      blue <= levels.bmax
    ) {
      // take it out! - make it totally transparent
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

getVideo();

video.addEventListener("canplay", paintToCanavas);

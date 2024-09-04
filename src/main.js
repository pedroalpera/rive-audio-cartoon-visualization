// This is the High level JS runtime for Rive
// https://rive.app/community/doc/web-js/docvlgbnS1mp

Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return ((this - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};


let musicBoolean_Input;

const riveInstance = new rive.Rive({
  src: "rive-audio-cartoon-visualization.riv",
  canvas: document.getElementById("canvas"),
  autoplay: true,
  artboard: "Artboard",
  stateMachines: "State Machine 1",

  onLoad: () => {
    riveInstance.resizeDrawingSurfaceToCanvas();
    // Inputs number set in the Rive File
    const inputs = riveInstance.stateMachineInputs("State Machine 1");

   musicBoolean_Input = inputs.find((i) => i.name === "MusicBoolean");

    init();
  },
});

// Mr.doob FPS Stats
// javascript:(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='https://mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()

let speaker1;
let speaker2;
let subspeaker1;
let subspeaker2;
let superradio;

let joystick1;

// Set up Audio

let audio;
let audioContext, audioData, sourceNode, analyserNode;
let manager;
let minDb, maxDb;

const createAudio = () => {
  audio = document.createElement("audio");

  audio.src = "Track1.mp3";

  audioContext = new AudioContext();

  sourceNode = audioContext.createMediaElementSource(audio);
  sourceNode.connect(audioContext.destination);

  analyserNode = audioContext.createAnalyser();
  analyserNode.fftSize = 512;
  analyserNode.smoothingTimeConstant = 0.9;
  sourceNode.connect(analyserNode);

  minDb = analyserNode.minDecibels;
  maxDb = analyserNode.maxDecibels;

  audioData = new Float32Array(analyserNode.frequencyBinCount);
};

window.addEventListener("mouseup", () => {
  if (!audioContext) createAudio();
  if (audio.paused) {
    musicBoolean_Input.value = true;
    audio.play();
  } else {
    musicBoolean_Input.value = false;
    audio.pause();

    // Reset Circles Scale

    speaker1.scaleX = 1;
    speaker1.scaleY = 1;
    subspeaker1.scaleX = 1;
    subspeaker1.scaleY = 1;

    speaker2.scaleX = 1;
    speaker2.scaleY = 1;
    subspeaker2.scaleX = 1;
    subspeaker2.scaleY = 1;


    superradio.scaleX = 1;
    superradio.scaleY = 1;
  }
});

function init() {
  // Set circles
  speaker1 = riveInstance.artboard.node("speaker1");
  subspeaker1 = riveInstance.artboard.node("subspeaker1");

  speaker2 = riveInstance.artboard.node("speaker2");
  subspeaker2 = riveInstance.artboard.node("subspeaker2");
  superradio = riveInstance.artboard.node("superradio");

  handleJOY1 = riveInstance.artboard.node("HandleJOY1");

  // Start the first frame request
  window.requestAnimationFrame(gameLoop);
}

let lastTime = 0;

function gameLoop(time) {
  if (!lastTime) {
    lastTime = time;
  }
  const elapsedTimeMs = time - lastTime;
  const elapsedTimeSec = elapsedTimeMs / 1000;
  lastTime = time;

  // Set Audio 
  if (audio != undefined) {
    if (audio.paused) {
    } else {
      analyserNode.getFloatFrequencyData(audioData);

      let num0 = audioData[37];
      let num0_1 = audioData[20];
      let num0_2 = audioData[24];
      let num1 = audioData[30];
      let num2 = audioData[36];

      console.log(num2);
      

      let scaleValue0 = num0.map(-140, -30, 0.6, 1.4);
      let scaleValue0_1 = num0_1.map(-140, -30, 0, 2);
      let scaleValue0_2 = num0_2.map(-140, -30, 0, 2);
      let scaleValue1 = num1.map(-140, -30, 0.6, 1.4);
     

      let yPosition1 = num2.map(-140, -30, 0, -100);

      speaker1.scaleX = scaleValue0;
      speaker1.scaleY = scaleValue0;

      subspeaker1.scaleX = scaleValue0_1;
      subspeaker1.scaleY = scaleValue0_1;

      speaker2.scaleX = scaleValue1;
      speaker2.scaleY = scaleValue1;

      subspeaker2.scaleX = scaleValue0_2;
      subspeaker2.scaleY = scaleValue0_2;

      handleJOY1.y = yPosition1;
   
    }
  }

  window.requestAnimationFrame(gameLoop);
}

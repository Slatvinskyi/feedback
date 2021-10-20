const ctx = new(window.AudioContext || window.webkitAudioContext)();

  class Delay {
    constructor( ctx, time, feedback = 0.3) { 
      this.ctx = ctx;
      this.input = this.ctx.createGain();
      this.output = this.ctx.createGain();
      this.delay = ctx.createDelay();
      this.delay.delayTime.value = time;

      this.feedback = ctx.createGain();
      this.feedback.gain.value = feedback;
      this.filter = ctx.createBiquadFilter();
      this.filter.type = "lowpass"; //highpass
      this.filter.frequency.value = 2000;

      this.input.connect(this.filter);
      this.filter.connect(this.delay);
      this.delay.connect(this.feedback);
      this.feedback.connect(this.filter);
     this.delay.connect(this.output);

     }
 
    updateFeedback(level) {
      this.feedback.gain.linearRampToValueAtTime(
        level,
        this.ctx.currentTime + 0.01
      );
    }
  }
  const delay = new Delay(ctx, 0.375);
  

  (function () {
    'use strict';
  
    const song = './audio/ukulele.mp3';
      
 
    const playButton = document.querySelector('#play');
      
    let songBuffer;
  
    window.fetch(song)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => ctx.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        playButton.disabled = false;
        songBuffer = audioBuffer;
      });
      
      playButton.onclick = () => play(songBuffer);
  
    function play(audioBuffer) {
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      
      source.start();

      // everything together
 
    
  source.connect(delay.input);
  delay.output.connect(ctx.destination);

  const feedback = document.getElementById("feedback");
  feedback.addEventListener("input", (e) => {
    delay.updateFeedback(e.target.value);
  });
 }
  }());
 
  
  
  

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
      this.filter.frequency.value = 3000;

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
  
  // get audio element 
  const audioPlayer = document.getElementById("audio");
  audioPlayer.addEventListener("play", () => { if (ctx.state !== "running") {
      ctx.resume();
    }
  });
  
 
  const sourceNode = ctx.createMediaElementSource(audioPlayer);
  
  // everything together
  sourceNode.connect(delay.input);
  delay.output.connect(ctx.destination);

  const feedback = document.getElementById("feedback");
  feedback.addEventListener("input", (e) => {
    delay.updateFeedback(e.target.value);
  });

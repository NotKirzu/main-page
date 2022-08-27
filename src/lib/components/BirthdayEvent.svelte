<script>
  import { onMount } from "svelte";

  export let createConfetti;

  onMount(() => {
    const confetti = createConfetti(document.getElementById("birthday-canvas"), {
      resize: true
    });

    setTimeout(() => {
      const end = Date.now() + 2000;
  
      (function frame() {
        confetti({
          particleCount: 5,
          angle: 40,
          spread: 90,
          origin: { x: 0 }
        });
  
        confetti({
          particleCount: 5,
          angle: 140,
          spread: 90,
          origin: { x: 1 }
        });
  
        confetti({
          particleCount: 5,
          angle: 270,
          spread: 90,
          origin: { y: 0 }
        });
  
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }, 2000);
  });
</script>

<canvas id="birthday-canvas" style="position: fixed; width: 100%; height: 100%; top: 0; left: 0; bottom: 0; right: 0;"></canvas>
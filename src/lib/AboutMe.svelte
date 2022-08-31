<script>
  import Lanyard from "./components/Lanyard.svelte";

  export let differenceInYears;
  export let animations;
  export let bootstrap;
  export let darkMode;
  export let feather;

  const imList = [
    'software developer',
    'student',
    'freelancer',
    'spanish translator',
    'QA Tester'
  ].map((x) => x + '.');
  const birthdayDate = new Date(1136026800000);
  const codingDate = new Date(1572584400000);
  const currentDate = new Date();

  const years = differenceInYears(currentDate, codingDate);
  const age = differenceInYears(currentDate, birthdayDate);

  let imCurrent = 0;

  setInterval(() => {
    imCurrent = imCurrent >= imList.length - 1 ? 0 : imCurrent + 1
  }, 4000);

  function typewriter(node, { delay = 0, speed = 2 }) {
    const text = node.textContent;
    const duration = text.length / (speed * 0.01);

    return {
      duration, delay,
      tick: (t) => {
        const i = Math.trunc(text.length * t);
        node.textContent = text.slice(0, i);
      }
    };
  }

  $: {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    [...tooltipTriggerList].forEach((tooltipTriggerEl) => {
      const tooltip = bootstrap.Tooltip.getInstance(tooltipTriggerEl);
      if (tooltip) tooltip.dispose();
      new bootstrap.Tooltip(tooltipTriggerEl, { animation: !!animations })
    });
  }
</script>

<div id="aboutme" class="container-xl my-5 user-select-none">
  <div class="row justify-content-evenly">
    <div class="col-md-5 animate__animated {animations ? "animate__fadeIn" : ""}">
      <div class="fs-2">
        Hey, I'm Kirzu! <span id="{animations ? "wave" : ""}">👋</span>
      </div>
      <div class="fs-4 my-3">
        I'm a
        {#key imCurrent}
          {#if animations}
            <span in:typewriter="{{ delay: 2000 }}" out:typewriter>{imList[imCurrent]}</span>
          {:else}
            <span>{imList[imCurrent]}</span>
          {/if}
        {/key}
      </div>
      <div class="fs-5 my-3" style="z-index: 1000; line-height: 1.7;">
        My name is Ricardo, but I'm also known as Rick or Kirzu.
        <br>
        I'm <span
          class="date {darkMode ? "text-white" : "text-dark"}"
          data-bs-toggle="tooltip"
          data-bs-title="Born date: 12/31/2005"
        >{age} years old</span>, I'm from <span class="country">Panama</span>
        and I've been coding for about <span
          class="date {darkMode ? "text-white" : "text-dark"}"
          data-bs-toggle="tooltip"
          data-bs-title="Start date: 11/2019"
        >{years} years</span>.
      </div>
    </div>
    <div class="col-auto animate__animated animate__delay-1s {animations ? "animate__fadeIn" : ""}">
      <Lanyard {...({ feather, darkMode })} />
    </div>
  </div>
</div>

<style>
  @keyframes wave {
    0% {
      transform: rotate(0deg);
    }
    10% {
      transform: rotate(14deg);
    }
    20% {
      transform: rotate(-8deg);
    }
    30% {
      transform: rotate(14deg);
    }
    40% {
      transform: rotate(-4deg);
    }
    50% {
      transform: rotate(10deg);
    }
    60% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }

  .date {
    background-color: rgba(53, 174, 255, 0.49);
    color: rgb(34, 35, 37);
    font-weight: bold;
    border-radius: 5px;
    padding: 2px;
  }

  .country {
    background: linear-gradient(to right, #ff0037, rgb(188, 188, 188), #1f2eff);
    background-clip: border-box;
    font-weight: bold;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  #wave:hover {
    display: inline-block;
		animation: wave 2.25s ease-in-out infinite;
		transform-origin: 70% 70%;
  }
</style> 

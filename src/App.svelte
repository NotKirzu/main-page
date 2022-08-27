<script>
  import BirthdayEvent from "./lib/components/BirthdayEvent.svelte";
  import BackToTop from "./lib/BackToTop.svelte";
  import AboutMe from "./lib/AboutMe.svelte";
  import Navbar from "./lib/Navbar.svelte";
  
  export let differenceInYears;
  export let createConfetti;
  export let bootstrap;
  export let feather;

  const birthdayDate = new Date(1136026800000);
  const currentDate = new Date();

  let values;
  let sounds;
  let darkMode;
  let animations;

  const isBirthday = currentDate.getDate() === birthdayDate.getDate() && currentDate.getMonth() === birthdayDate.getMonth();
  const clickSound = () => {
    if (sounds) {
      // @ts-ignore
      const sound = new Howl({
        src: ["/click.oga"],
        volume: 0.10
      });
      sound.play();
    }
  }

  document.addEventListener("mousedown", clickSound);
  document.addEventListener("mouseup", clickSound);

  $: {
    sounds = values && (values['sounds'] ?? true);
    darkMode = values && (values['darkMode'] ?? true);
    animations = values && (values['animations'] ?? true);
    document.body.style.backgroundColor = darkMode ? "#2b2f33" : "#EEEEEE";
  }
</script>

<main>
  <div class="{darkMode ? "text-white" : "text-dark"}">
    {#if isBirthday && animations}
      <BirthdayEvent {createConfetti} />
    {/if}
    <Navbar bind:values {feather} />
    <AboutMe {...({ bootstrap, feather, differenceInYears, darkMode, animations })} />
    <BackToTop {...({ animations, feather, darkMode })} />
  </div>
</main>
<script>
  import { onMount } from "svelte";

  export let animations;
  export let darkMode;
  export let feather;

  onMount(() => {
    const btn = document.getElementById("backToTop");

    window.addEventListener("scroll", () => {
      btn.style.display = window.scrollY > 200 ? "block" : "none";
    });
  });

  function goToTop() {
    window.scroll({
      top: 0,
      // @ts-ignore
      behavior: animations ? "smooth" : "instant"
    });
  }
</script>

<button on:click={goToTop} class="{darkMode ? "text-bg-dark dark" : "text-bg-light light"}" id="backToTop" title="Go to top">
  {@html feather.icons["arrow-up"].toSvg({
    width: 20, height: 20, "stroke-width": 2    
  })}
</button> 

<style>
  #backToTop {
    display: none;
    position: fixed;
    bottom: 35px;
    right: 50px;
    z-index: 99;
    border: none;
    outline: none;
    cursor: pointer;
    padding: 13px;
    border-radius: 10px;
    font-size: 18px;
  }

  #backToTop.dark:hover {
    background-color: #191c1f !important;
  }

  #backToTop.light:hover {
    background-color: rgb(230, 230, 230) !important;
  }
</style>
<script>
  import { onMount } from "svelte";

  export let feather;
  export let values = {
    animations: true,
    darkMode: true,
    sounds: true
  };

  let opacity = 0;
  let currentSection = "";

  function toggleValue (key) {
    if (key == "darkMode") return true;
    values[key] = !values[key];
    localStorage.setItem("ui-" + key, values[key]);
    return values[key];
  }

  function scrollTo (id) {
    const element = document.getElementById(id);
    if (element) {
      // @ts-ignore
      element.scrollIntoView({ block: "end", behavior: values["animations"] ? "smooth" : "instant" });
    }
  }

  window.addEventListener("scroll", () => {
    opacity = Math.min(0.8, (window.scrollY / 200) * 0.8);

    const sections = ["aboutme", "projects", "contact"];
    currentSection = sections.find((section) => {
      const element = document.getElementById(section);
      if (element) {
        const rect = element.getBoundingClientRect();
        return rect.top <= 123 && rect.bottom >= 123;
      }
    });
  });

  onMount(() => {
    const getFromLocal = (key) => {
      const item = localStorage.getItem(key);
      return item ? item == "true" : null;
    }

    values = {
      animations: getFromLocal("ui-animations") ?? true,
      darkMode: true, // getFromLocal("ui-darkMode") ?? (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ?? true,
      sounds: getFromLocal("ui-sounds") ?? true
    };

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
      if (!getFromLocal("ui-darkMode")) {
        values["darkMode"] = event.matches;
      }
    });
  });
</script>

<nav class="navbar sticky-top navbar-expand-lg" style="background-color: rgba(2, 2, 2, {opacity});">
  <div class="container-lg my-3" style='max-width: 90%;'>
    <div class="d-flex collapse navbar-collapse">
      <div class="me-auto mb-2 mb-lg-0">
        <div class="btn-group">
          <div class="{values["darkMode"] ? "text-light" : "text-black"}" type="button" data-bs-toggle="dropdown" data-bs-auto-close="true">
            {@html feather.icons["menu"].toSvg({
              width: 18, height: 18, "stroke-width": 1
            })}
          </div>
          <ul class="{values["darkMode"] ? "bg-dark" : "bg-light"} py-3 dropdown-menu {values["animations"] ? "animateLeft" : ""}">
            <li><span on:click={() => scrollTo("aboutme")} on:keypress={null} class="dropdown-item {currentSection == "aboutme" ? "active" : ""} {values["animations"] ? "animated" : ""} {values["darkMode"] ? "text-light dark" : "text-black light"} py-2">
              {@html feather.icons["user"].toSvg({
                width: 18, height: 18, "stroke-width": 1
              })}
              About me
            </span></li>
            <li><span on:click={() => scrollTo("projects")} on:keypress={null} class="dropdown-item {currentSection == "projects" ? "active" : ""} {values["animations"] ? "animated" : ""} {values["darkMode"] ? "text-light dark" : "text-black light"} py-2">
              {@html feather.icons["code"].toSvg({
                width: 18, height: 18, "stroke-width": 1
              })}
              Projects
            </span></li>
            <li><span on:click={() => scrollTo("contact")} on:keypress={null} class="dropdown-item {currentSection == "contact" ? "active" : ""} {values["animations"] ? "animated" : ""} {values["darkMode"] ? "text-light dark" : "text-black light"} py-2">
              {@html feather.icons["mail"].toSvg({
                width: 18, height: 18, "stroke-width": 1
              })}
              Contact
            </span></li>
            <li><hr class="dropdown-divider"></li>
            <li><a href="https://paypal.me/KirzuDev" rel="noreferrer" target="_blank" class="dropdown-item {values["animations"] ? "animated" : ""} {values["darkMode"] ? "text-light dark" : "text-black light"} py-2">
              {@html feather.icons["credit-card"].toSvg({
                width: 18, height: 18, "stroke-width": 1
              })}
              Paypal
              <span class="position-absolute end-0 me-3 external-icon">
                {@html feather.icons["external-link"].toSvg({
                  width: 18, height: 18, "stroke-width": 1
                })}
              </span>
            </a></li>
            <li><a href="https://github.com/NotKirzu" rel="noreferrer" target="_blank" class="dropdown-item {values["animations"] ? "animated" : ""} {values["darkMode"] ? "text-light dark" : "text-black light"} py-2">
              {@html feather.icons["github"].toSvg({
                width: 18, height: 18, "stroke-width": 1
              })}
              GitHub
              <span class="position-absolute end-0 me-3 external-icon">
                {@html feather.icons["external-link"].toSvg({
                  width: 18, height: 18, "stroke-width": 1
                })}
              </span>
            </a></li>
          </ul>
        </div>
      </div>
      <div class="d-flex">
        <div class="btn-group">
          <div class="{values["darkMode"] ? "text-light" : "text-black"}" type="button" data-bs-toggle="dropdown" data-bs-auto-close="outside">
            {@html feather.icons["settings"].toSvg({
              width: 18, height: 18, "stroke-width": 1
            })}
          </div>
          <ul class="{values["darkMode"] ? "bg-dark" : "bg-light"} py-3 dropdown-menu dropdown-menu-end {values["animations"] ? "animateRight" : ""}">
            <!-- <li><div
                class="dropdown-item {values["animations"] ? "animated" : ""} {values["darkMode"] ? "text-light dark" : "text-black light"} py-2"
                on:click={() => toggleValue("darkMode")}
                on:keypress={null}
              >
              {@html feather.icons["moon"].toSvg({
                width: 20, height: 20, "stroke-width": 1.5
              })}
              Theme: {values["darkMode"] ? "Dark" : "Light"}
            </div></li> -->
            <li><div
                class="dropdown-item {values["animations"] ? "animated" : ""} {values["darkMode"] ? "text-light dark" : "text-black light"} py-2"
                on:click={() => toggleValue("sounds")}
                on:keypress={null}
              >
              {@html feather.icons["volume-2"].toSvg({
                width: 20, height: 20, "stroke-width": 1.5
              })}
              Sounds: {values["sounds"] ? "Enabled" : "Disabled"}
            </div></li>
            <li><div
                class="dropdown-item {values["animations"] ? "animated" : ""} {values["darkMode"] ? "text-light dark" : "text-black light"} py-2"
                on:click={() => toggleValue("animations")}
                on:keypress={null}
              >
              {@html feather.icons["image"].toSvg({
                width: 20, height: 20, "stroke-width": 1.5
              })}
              Animations: {values["animations"] ? "Enabled" : "Disabled"}
            </div></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</nav>

<style>
  @keyframes fadeRight {
    0% {
      transform: translate(3rem, -3rem) scale(.2, .2);
      opacity: 0;
    }

    100% {
      transform: translate(0, 0) scale(1, 1);
      opacity: 1;
    }
  }
  
  @keyframes fadeLeft {
    0% {
      transform: translate(-3rem, -6rem) scale(.2, .2);
      opacity: 0;
    }

    100% {
      transform: translate(0, 0) scale(1, 1);
      opacity: 1;
    }
  }

  .dropdown-item {
    cursor: pointer;
  }

  .dropdown-item.animated {
    transition: background-color 0.2s ease-out;
  }

  .dark.dropdown-item:hover, :global(.dark.active) {
    background-color: #343a40 !important;
  }

  .light.dropdown-item:hover, :global(.light.active) {
    background-color: #d3d3d3 !important;
  }

  .dropdown-item:focus, .dropdown-item:active {
    background-color: transparent !important;
  }

  .animateRight {
    animation-duration: .6s;
    animation-fill-mode: both;
    animation-name: fadeRight;
  }

  .animateLeft {
    animation-duration: .6s;
    animation-fill-mode: both;
    animation-name: fadeLeft;
  }

  .external-icon {
    transform: translateY(-.17rem);
  }
</style>
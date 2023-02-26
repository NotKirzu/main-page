<script>
  import { onMount } from "svelte";

  export let animations;
  export let darkMode;
  export let feather;

  function getData (selector) {
    const data = document.querySelector(selector).value;
    return data;
  }

  async function validateData() {
    const name = getData('.validate-input input[name="name"]');
    const email = getData('.validate-input input[name="email"]');
    const subject = getData('.validate-input input[name="subject"]');
    const message = getData('.validate-input textarea[name="message"] ');

    let check = true;

    if (name.trim() === "") {
      showValidate("name");
      check = false;
    }

    if (!email.trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/)) {
      showValidate("email");
      check = false;
    }

    if (subject.trim() === "") {
      showValidate("subject");
      check = false;
    }

    if (message.trim() === "") {
      showValidate("message", "textarea");
      check = false;
    }

    if (!check) return;

    const button = document.querySelector(".contact-form-btn");
    button.setAttribute("disabled", "true");
    button.innerHTML = "Sending... " + feather.icons["loader"].toSvg({ class: "sent-icon icon-loader", height: 20, width: 20 });
    button.classList.add("button-loading");

    const request = await fetch('https://mailer.krzu.me', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        subject,
        message
      })
    });

    button.classList.remove("button-loading");
    if (request.status == 204) {
      if (!button.classList.contains("button-done")) {
        button.classList.add("button-done");
        button.innerHTML = "Done! " + feather.icons["check-circle"].toSvg({ class: "sent-icon", height: 20, width: 20 });
        
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } else {
      if (!button.classList.contains("button-fail")) {
        button.classList.add("button-fail");
        button.innerHTML = "Something happened! <br> Try again later. <br>" + feather.icons["alert-circle"].toSvg({ class: "sent-icon", height: 20, width: 20 });
      }
    }
  }

  function showValidate (selector, type = "input") {
    const input = document.querySelector(`.validate-input ${type}[name="${selector}"]`);
    const thisAlert = input.parentElement;

    thisAlert.classList.add('alert-validate');
  }

  function hideValidate (selector, type = "input") {
    const input = document.querySelector(`.validate-input ${type}[name="${selector}"]`);
    const thisAlert = input.parentElement;

    thisAlert.classList.remove('alert-validate');
  }

  // @ts-ignore
  const tilt = VanillaTilt;
  
  onMount(() => {
    if (animations) {
      tilt.init(document.querySelector(".js-tilt"), {
        gyroscope: false
      });
    }

    [...document.querySelectorAll(".validate-form .input")].forEach((el) => {
      el.addEventListener("focus", () => {
        hideValidate(el.getAttribute("name"), el.localName);
      });
    });
  });

  $: {
    const el = document.querySelector(".js-tilt");
    if (el) {
      // @ts-expect-error
      if (el.vanillaTilt && !animations) {
        // @ts-expect-error
        el.vanillaTilt.destroy();
        // @ts-expect-error
      } else if (!el.vanillaTilt && animations) {
        tilt.init(el, {
          gyroscope: false
        });
      }
    }
  }
</script>

<div id="contact" style="--animate-delay: 1.5s" class="container-md animate__animated {animations ? "animate__fadeIn" : ""}">
  <div class="contact">
    <div class="container-contact {darkMode ? "dark" : "light"}">
      <div class="contact-pic js-tilt" data-tilt>
        <img src="/contact-{darkMode ? "dark" : "light"}.png" alt="contact">
      </div>

      <form class="contact-form validate-form">
        <span class="contact-form-title {darkMode ? "dark" : "light"}">
          Contact
        </span>
  
        <div class="wrap-input validate-input" data-validate = "Name is required">
          <input class="input {darkMode ? "dark" : "light"}" type="text" name="name" placeholder="Name">
          {#if animations}
            <span class="shadow-input"></span>
          {/if}
          <span class="symbol-input">
            {@html feather.icons["user"].toSvg()}
          </span>
        </div>
  
        <div class="wrap-input validate-input" data-validate = "Valid email is required">
          <input class="input {darkMode ? "dark" : "light"}" type="text" name="email" placeholder="Email">
          {#if animations}
            <span class="shadow-input"></span>
          {/if}
          <span class="symbol-input">
            {@html feather.icons["mail"].toSvg()}
          </span>
        </div>
  
        <div class="wrap-input validate-input" data-validate = "Subject is required">
          <input class="input {darkMode ? "dark" : "light"}" type="text" name="subject" placeholder="Subject">
          {#if animations}
            <span class="shadow-input"></span>
          {/if}
          <span class="symbol-input">
            {@html feather.icons["paperclip"].toSvg()}
          </span>
        </div>
  
        <div class="wrap-input validate-input" data-validate = "Message is required">
          <textarea class="input {darkMode ? "dark" : "light"}" name="message" placeholder="Message"></textarea>
          {#if animations}
            <span class="shadow-input"></span>
          {/if}
          <span class="symbol-input">
            {@html feather.icons["file-text"].toSvg()}
          </span>
        </div>
  
        <div class="container-contact-form-btn">
          <button on:click|preventDefault={validateData} class="contact-form-btn {animations ? "hover" : ""} {darkMode ? "dark" : "light"}">
            <span>
              Send message
              <span class="send-icon">
                {@html feather.icons["send"].toSvg({ height: 20, width: 20 })}
              </span>
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</div>

<style>
  button {
    outline: none !important;
    border: none;
    background: transparent;
  }

  button:hover {
    cursor: pointer;
  }

  input {
    outline: none;
    border: none;
  }

  textarea {
    outline: none;
    border: none;
  }

  textarea:focus, input:focus {
    border-color: transparent !important;
  }

  input::-webkit-input-placeholder { color: #999999; }
  input:-moz-placeholder { color: #999999; }
  input::-moz-placeholder { color: #999999; }
  input:-ms-input-placeholder { color: #999999; }

  textarea::-webkit-input-placeholder { color: #999999; }
  textarea:-moz-placeholder { color: #999999; }
  textarea::-moz-placeholder { color: #999999; }
  textarea:-ms-input-placeholder { color: #999999; }

  .contact {
    width: 100%;
    min-height: 100%;
    padding: 15px;

    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: -ms-flexbox;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }

  .dark.container-contact {
    background-color: #212529;
  }

  .light.container-contact {
    background-color: #f8f9fa;
  }

  .container-contact {
    width: 1163px;
    border-radius: 10px;
    overflow: hidden;

    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: -ms-flexbox;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;

    padding: 90px 130px 88px 148px;
  }

  .contact-pic {
    width: 296px;
  }

  .contact-pic img {
    max-width: 100%;
  }

  .contact-form {
    width: 390px;
  }

  .dark.contact-form-title {
    color: #fff;
  }

  .light.contact-form-title {
    color: #333;
  }

  .contact-form-title {
    display: block;
    font-size: 24px;
    line-height: 1.2;
    text-align: center;
    padding-bottom: 44px;
    pointer-events: none;
    user-select: none;
  }

  input.input {
    height: 50px;
    border-radius: 25px;
    padding: 0 30px 0 50px;
  }
  
  input.input + .shadow-input {
    border-radius: 25px;
  }

  textarea.input {
    min-height: 150px;
    border-radius: 25px;
    padding: 12px 30px;
  }
  
  textarea.input + .shadow-input {
    border-radius: 25px;
  }

  .wrap-input {
    position: relative;
    width: 100%;
    z-index: 1;
    margin-bottom: 20px;
  }

  .light.input {
    background: #e6e6e6;
    color: #666;
  }

  .dark.input {
    background: #666;
    color: #e6e6e6;
  }

  .input {
    display: block;
    width: 100%;
    font-size: 15px;
    line-height: 1.5;
  }

  .shadow-input {
    content: '';
    display: block;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    box-shadow: 0px 0px 0px 0px;
    color: rgba(70, 165, 184, 0.5);
  }

  .input:focus + .shadow-input {
    -webkit-animation: anim-shadow 0.5s ease-in-out forwards;
    animation: anim-shadow 0.5s ease-in-out forwards;
  }

  @-webkit-keyframes anim-shadow {
    to {
      box-shadow: 0px 0px 80px 30px;
      opacity: 0;
    }
  }

  @keyframes anim-shadow {
    to {
      box-shadow: 0px 0px 80px 30px;
      opacity: 0;
    }
  }

  .container-contact-form-btn {
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: -ms-flexbox;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .contact-form-btn {
    min-width: 193px;
    height: 50px;
    border-radius: 25px;
    background: #3ee7db;
    font-size: 15px;
    line-height: 1.5;
    color: #333;
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: -ms-flexbox;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 25px;

    -webkit-transition: all 0.4s;
    -o-transition: all 0.4s;
    -moz-transition: all 0.4s;
    transition: all 0.4s;
  }

  .light.hover:hover {
    background: #e6e6e6;
    color: #666;
  }

  .dark.hover:hover {
    background: #666;
    color: #fff;
  }

  @media (max-width: 1200px) {
    .contact-pic {
      width: 33.5%;
    }

    .contact-form {
      width: 44%;
    }
  }

  @media (max-width: 992px) {
    .container-contact {
      padding: 90px 80px 88px 90px;
    }

    .contact-pic {
      width: 35%;
    }

    .contact-form {
      width: 55%;
    }
  }

  @media (max-width: 768px) {
    .container-contact {
      padding: 90px 80px 88px 80px;
    }

    .contact-pic {
      display: none;
    }

    .contact-form {
      width: 100%;
    }
  }

  @media (max-width: 576px) {
    .container-contact {
      padding: 90px 15px 88px 15px;
    }
  }

  .validate-input {
    position: relative;
  }

  :global(.alert-validate::before) {
    content: attr(data-validate);
    position: absolute;
    max-width: 70%;
    background-color: rgba(255, 116, 116, 0.547);
    border: 1px solid #7c1b1b;
    border-radius: 13px;
    padding: 4px 10px 4px 10px;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
    right: 8px;
    pointer-events: none;

    color: #fff;
    font-size: 13px;
    line-height: 1.4;
    text-align: left;
  }

  .symbol-input {
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: -ms-flexbox;
    display: flex;
    align-items: center;
    position: absolute;
    border-radius: 25px;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding-left: 20px;
    pointer-events: none;
    color: #aaa;
    font-size: 15px;
    -webkit-transition: all .4s;
    -o-transition: all .4s;
    -moz-transition: all .4s;
    transition: all .4s
  }
  
  .input:focus+.shadow-input+.symbol-input {
    color: rgb(70, 165, 184);
    padding-left: 12px
  }

  :global(.button-done) {
    background-color: rgb(70, 184, 106) !important;
    transform: rotate(0deg);
    border-radius: 50%;
    min-width: 5px !important;
    cursor: default !important;
  }

  :global(.button-fail) {
    background-color: rgb(184, 70, 70) !important;
    transform: rotate(0deg);
    border-radius: 50%;
    min-width: 5px !important;
    cursor: default !important;
  }

  :global(.sent-icon) {
    margin-left: 10px;
  }

  :global(.light.button-done, .light.button-done:hover, .light.button-fail, .light.button-fail:hover) {
    border: 2px solid #000 !important;
    color: #000 !important;
  }

  :global(.dark.button-done, .dark.button-done:hover, .dark.button-fail, .dark.button-fail:hover) {
    border: 2px solid #fff !important;
    color: #fff !important;
  }

  :global(.button-loading) {
    background-color: rgb(146, 70, 184) !important;
    color: #fff !important;
    transform: rotate(360deg);
    min-width: 5px !important;
    cursor: wait !important;
  }

  :global(.icon-loader) {
    animation: loader 2s linear infinite;
  }

  @keyframes loader {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>

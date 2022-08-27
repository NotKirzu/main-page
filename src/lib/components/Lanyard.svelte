<script>
  import { onMount, onDestroy } from "svelte";

  export let darkMode;
  export let feather;

  let songTimestamps;
  let heartbeat;
  let userData;
  let ws;

  onMount(() => {
    if (!('WebSocket' in window || 'MozWebSocket' in window)) {
      console.error("WebSockets are not supported by this browser.");
      return;
    }

    (function connect() {
      ws = new WebSocket("wss://api.lanyard.rest/socket");
  
      ws.onclose = connect;

      ws.onerror = console.log;
  
      ws.onmessage = (packet) => {
        const data = JSON.parse(packet.data);

        switch (data.op) {
          case 0:
            userData = data.d;
            break;
          case 1:
            heartbeat = setInterval(() => {
              if (ws.readyState == ws.OPEN) {
                ws.send(JSON.stringify({ op: 3 }));
              }
            }, data.d?.heartbeat_interval);

            if (ws.readyState == ws.OPEN) {
              ws.send(JSON.stringify({ op: 2, d: {
                subscribe_to_ids: [import.meta.env.VITE_DISCORD_ID]
              } }));
            }
            break;
        }
      }
    })();
  });
  
  onDestroy(() => {
    clearInterval(heartbeat);
    ws.onclose = null;
    ws.close();
  });

  function msToTime (ms) {
    ms = parseInt(ms);
    const pad = (n) => ('00' + n).slice(-2);
    const hours = pad(ms / 3.6e6 | 0);
    return (hours != '00' ? hours + ':' : '') + pad((ms % 3.6e6) / 6e4 | 0) + ':' + pad((ms % 6e4) / 1000 | 0);
  }

  $: {
    if (userData && userData[import.meta.env.VITE_DISCORD_ID]) {
      userData = userData[import.meta.env.VITE_DISCORD_ID];
    }

    if (userData?.spotify) {
      if (!songTimestamps) {
        songTimestamps = {};
      } else if (songTimestamps['interval']) {
        clearInterval(songTimestamps['interval']);
      }

      // bruh
      const spotify = userData.spotify;
      
      songTimestamps['name'] = spotify.song;
      songTimestamps['interval'] = setInterval(() => {
        const progress = Date.now() - spotify.timestamps.start;
        const untilEnd = spotify.timestamps.end - Date.now();
        const duration = progress + untilEnd;
        
        if (untilEnd > duration) {
          clearInterval(songTimestamps['interval']);
          return;
        }

        songTimestamps['progress'] = progress;
        songTimestamps['duration'] = duration;
        songTimestamps['percentage'] = (progress / duration) * 100;
      }, 1000);
    }
  }
</script>

<div class="card text-bg-{darkMode ? "dark" : "light"}" style="min-width: 20rem; max-width: 25rem;">
  {#if !userData}
    <div class="row card-body">
      <div class="col-auto placeholder-glow">
        <div class="avatar placeholder"></div>
      </div>
      <div class="col-6">
        <h5 class="placeholder-glow">
          <span class="placeholder rounded col-6"></span>
        </h5>
        <h5 class="placeholder-glow">
          <span class="placeholder rounded col-3"></span>
        </h5>
      </div>
    </div>
  {:else}
    <div class="row card-body mt-2">
      <div class="col-auto">
        <div
          class="avatar status-{userData.discord_status}"
          style="background-image: url(https://cdn.discordapp.com/avatars/{userData.discord_user.id}/{userData.discord_user.avatar}.{userData.discord_user.avatar.startsWith("a_") ? "gif" : "png"}?size=1024); background-repeat: round;"
        ></div>
      </div>
      <div class="col-6">
        <h5 style="font-weight: bold;">
          {userData.discord_user.username}<span class="ms-1" style="font-size: 17px; color: #B9BBB3 !important;">#{userData.discord_user.discriminator}</span>
        </h5>
        <div>
          <span
            class="user-select-none" style="cursor: pointer;"
            on:click={() => {
              window.open("https://support.discord.com/hc/es/articles/360007553672-HypeSquad-House-Breakdown", "_blank");
            }}
          >
            <img src="/hypesquad-bravery.svg" alt="hypesquad-badge">
          </span>
        </div>
      </div>
    </div>
    {#if (userData.spotify && userData.listening_to_spotify)}
      <hr class="mx-2">
      <div id="spotify-container">
        <div class="row card-body">
          <div class="col-auto">
            <div
              class="icon"
              style="background-image: url({userData.spotify.album_art_url}); background-repeat: round; cursor: pointer;"
              on:click={() => {
                window.open(`https://open.spotify.com/track/${userData.spotify.track_id}`, "_blank");
              }}
            ></div>
          </div>
          <div id="spotify-content" class="col-6" style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
            <span class="fw-bold">{userData.spotify.song}</span>
            <br>
            <span class="fw-light" style="white-space: initial;">
              By {userData.spotify.artist.replace(/;/g, ",")}
            </span>
            <br>
            <span class="fw-light">
              On {userData.spotify.album}
            </span>
          </div>
          <div class="col-auto ms-auto my-auto">
            {@html feather.icons['music'].toSvg({
              width: 25, height: 25, 'stroke-width': 1.5
            })}
          </div>
          <div class="progress mt-4 mx-3" style="--bs-progress-bg: {darkMode ? "#747577" : "#d3d3d3"}; max-width: 90%; height: 5px;">
            <div class="progress-bar bg-{darkMode ? "light" : "secondary"}" role="progressbar" aria-label="Progress bar" style="transform: translateX(-0.8rem) scaleX(1.15); max-width: 100%; width: {songTimestamps ? songTimestamps['percentage'] ?? '0' : '0'}%;"></div>
          </div>
          <div class="d-flex">
            <span class="fw-light">
              {songTimestamps ? msToTime(songTimestamps['progress']) ?? '' : ''}
            </span>
            <span class="fw-light ms-auto">
              {songTimestamps ? msToTime(songTimestamps['duration']) ?? '' : ''}
            </span>
          </div>
        </div>
      </div>
    {/if}
  {/if}
</div>

<style>
  #spotify-container {
    transform: translateY(-.5rem);
  }
  #spotify-content {
    transform: translateY(-.1rem);
  }

  .avatar {
    padding: 30px;
    max-height: 30px;
    max-width: 30px;
    border-radius: 50%;
    background-color: #18191C;
  }
  
  .icon {
    padding: 35px;
    max-height: 35px;
    max-width: 35px;
    border-radius: 3px;
    background-color: #18191C;
  }

  .status-online {
    border-style: solid;
    border-width: 3px;
    border-color: #43B581;
  }
  .status-idle {
    border-style: solid;
    border-width: 3px;
    border-color: #FAA61A;
  }
  .status-dnd {
    border-style: solid;
    border-width: 3px;
    border-color: #F04747;
  }
  .status-offline {
    border-style: solid;
    border-width: 3px;
    border-color: #747F8D;
  }
</style>
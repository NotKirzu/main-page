<script>
  import { onMount, onDestroy } from "svelte";

  export let animations;
  export let bootstrap;
  export let darkMode;
  export let feather;

  const data = [
    {
      id: "hypesquad-badge",
      icon: "https://cdn.discordapp.com/badge-icons/8a88d63823d8a71cd5e390baa45efa02.png",
      name: "HypeSquad Bravery",
      url: "https://support.discord.com/hc/en-us/articles/360007553672-HypeSquad-House-Breakdown",
    },
    {
      id: "activedev-badge",
      icon: "https://cdn.discordapp.com/badge-icons/6bdc42827a38498929a4920da12695d9.png",
      name: "Active Developer",
      url: "https://support-dev.discord.com/hc/en-us/articles/10113997751447",
    },
    {
      id: "oldtag-badge",
      icon: "https://cdn.discordapp.com/badge-icons/6de6d34650760ba5551a79732e98ed60.png",
      name: "Originally known as Krz,#0203",
    },
  ];

  let heartbeat;
  let userData;
  let ws;

  onMount(() => {
    if (!("WebSocket" in window || "MozWebSocket" in window)) {
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
              ws.send(
                JSON.stringify({
                  op: 2,
                  d: {
                    subscribe_to_ids: [import.meta.env.VITE_DISCORD_ID],
                  },
                })
              );
            }
            break;
        }
      };
    })();
  });

  onDestroy(() => {
    clearInterval(heartbeat);
    ws.onclose = null;
    ws.close();
  });

  // Code from https://github.com/discordjs/discord.js/blob/75d91b52b3ff1ea5ec82b94d1c9c127d9eac3e55/packages/discord.js/src/structures/Presence.js#L354
  function getAsset(appId, assetId) {
    if (!assetId) return null;
    if (assetId.includes(":")) {
      const [platform, id] = assetId.split(":");
      switch (platform) {
        case "mp":
          return `https://media.discordapp.net/${id}`;
        case "spotify":
          return `https://i.scdn.co/image/${id}`;
        case "youtube":
          return `https://i.ytimg.com/vi/${id}/hqdefault_live.jpg`;
        case "twitch":
          return `https://static-cdn.jtvnw.net/previews-ttv/live_user_${id}.png`;
        default:
          return null;
      }
    }

    return `https://cdn.discordapp.com/app-assets/${appId}/${assetId}.png?size=1024`;
  }

  $: {
    if (userData && userData[import.meta.env.VITE_DISCORD_ID]) {
      userData = userData[import.meta.env.VITE_DISCORD_ID];
    }

    setTimeout(() => {
      const tooltipTriggerList = document.querySelectorAll(
        ".lanyard-span[data-bs-toggle='tooltip']"
      );
      [...tooltipTriggerList].forEach((tooltipTriggerEl) => {
        const tooltip = bootstrap.Tooltip.getInstance(tooltipTriggerEl);
        let wasShowing;

        if (tooltip) {
          wasShowing = tooltip._isShown();
          tooltip.dispose();
        }

        const newTooltip = new bootstrap.Tooltip(tooltipTriggerEl, {
          animation: !!animations,
        });
        if (wasShowing) {
          newTooltip.show();
        }
      });
    }, 50);
  }
</script>

<div
  class="card text-{darkMode ? 'light' : 'dark'}"
  style="border: 1px solid #171719; background-color: #111214; width: 21rem;"
>
  {#if !userData}
    <div class="row card-body">
      <div class="col-auto placeholder-glow">
        <div class="avatar placeholder" />
      </div>
      <div class="col-6">
        <h5 class="placeholder-glow">
          <span class="placeholder rounded col-12" />
        </h5>
        <h5 class="placeholder-glow">
          <span class="placeholder rounded col-6" />
        </h5>
      </div>
    </div>
  {:else}
    <div class="row card-body mt-2">
      <div class="col-auto">
        <div
          class="avatar status-{userData.discord_status}"
          style="background-image: url(https://cdn.discordapp.com/avatars/{userData
            .discord_user.id}/{userData.discord_user
            .avatar}.{userData.discord_user.avatar.startsWith('a_')
            ? 'gif'
            : 'png'}?size=1024); background-repeat: round;"
        />
      </div>
      <div
        class="col-6"
        style="width: 70%; margin-top: .8vh; display: inline-flex; justify-content: space-between;"
      >
        <h5 style="font-weight: bold;">
          {userData.discord_user.display_name}
          <br />
          <span style="font-size: 17px; color: #B9BBB3 !important;"
            >@{userData.discord_user.username}</span
          >
        </h5>
        <div
          style="padding-bottom: 25px; height: 24px; border-radius: 7px; background-color: #020202; border: 1px solid #212529;"
        >
          {#each data as badge}
            <span
              class="lanyard-span user-select-none"
              style="margin: 3px; display: inline-flex; width: 20px; height: 20px; cursor: pointer;"
              data-bs-toggle="tooltip"
              data-bs-title={badge.name}
              on:click={() => {
                if (badge.url) {
                  window.open(badge.url, "_blank");
                }
              }}
              on:keypress={null}
            >
              <img
                style="user-select: none;"
                width="20"
                height="20"
                src={badge.icon}
                alt={badge.id}
              />
            </span>
          {/each}
        </div>
      </div>
    </div>
    {#if userData.activities.filter((x) => x.type !== 4).length}
      {#each userData.activities.filter((x) => x.type !== 4) as activity, i}
        {#if i == 0}
          <hr class="mx-2" />
        {/if}
        <div id="activity-container">
          <div class="row card-body">
            <div class="col-auto" style="width: 26%;">
              <div style="position: relative; width: 74px; height: 74px;">
                <span
                  class="lanyard-span"
                  data-bs-toggle={activity.assets.large_text ? "tooltip" : ""}
                  data-bs-title={activity.assets.large_text}
                  style="position: absolute; width: 74px; height: 74px;"
                >
                  <img
                    alt="large"
                    width="74"
                    height="74"
                    style="border-radius: 5px; position: absolute;"
                    src={getAsset(
                      activity.application_id,
                      activity.assets.large_image
                    )}
                  />
                </span>
                {#if activity.assets.small_image}
                  <div
                    style="position: absolute; top: 70%; left: 70%; background-color: #111214; border-radius: 50%;"
                  >
                    <span
                      class="lanyard-span"
                      data-bs-toggle={activity.assets.small_text ? "tooltip" : ""}
                      data-bs-title={activity.assets.small_text}
                      style="width: 25px; height: 25px; display: inline-block;"
                    >
                      <img
                        alt="small"
                        width="25"
                        height="25"
                        style="border-radius: 50%; position: absolute; border: 2px solid #111214; background-color: #111214;"
                        src={getAsset(
                          activity.application_id,
                          activity.assets.small_image
                        )}
                      />
                    </span>
                  </div>
                {/if}
              </div>
            </div>
            <div
              id="activity-content"
              style="width: {['Spotify', 'Visual Studio Code'].includes(
                activity.name
              )
                ? '58.9'
                : '70'}%; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;"
            >
              {#if activity.name === "Spotify"}
                <span title="{activity.details}" class="fw-bold">{activity.details}</span>
                <br />
                <span title="{activity.state}" style="white-space: normal;" class="fw-light">
                  by {activity.state.replace(";", ",") ?? ""}
                </span>
                <br />
                <span title="{activity.assets.large_text}" class="fw-light">
                  on {activity.assets.large_text ?? ""}
                </span>
              {:else}
                <span title="{activity.name}" class="fw-bold">{activity.name}</span>
                <br />
                <span title="{activity.details}" class="fw-light">
                  {activity.details ?? ""}
                </span>
                <br />
                <span title="{activity.state}" class="fw-light">
                  {activity.state ?? ""}
                </span>
              {/if}
            </div>
            {#if ["Spotify", "Visual Studio Code"].includes(activity.name)}
              <div class="col-auto ms-auto my-auto">
                {#if activity.name === "Spotify"}
                  <img width="25" height="25" alt="spotify" src="/spotify.svg" />
                {:else}
                  {@html feather.icons["code"].toSvg({
                    width: 25,
                    height: 25,
                    "stroke-width": 1.5,
                  })}
                {/if}
              </div>
            {/if}
          </div>
        </div>
      {/each}
    {/if}
  {/if}
</div>

<style>
  #activity-container {
    transform: translateY(-0.5rem);
  }
  #activity-content {
    transform: translateY(-0.1rem);
  }

  .avatar {
    padding: 30px;
    max-height: 30px;
    max-width: 30px;
    border-radius: 50%;
    background-color: #18191c;
  }

  .icon {
    padding: 35px;
    max-height: 35px;
    max-width: 35px;
    border-radius: 3px;
    background-color: #18191c;
  }

  .status-online {
    border-style: solid;
    border-width: 3px;
    border-color: #43b581;
  }
  .status-idle {
    border-style: solid;
    border-width: 3px;
    border-color: #faa61a;
  }
  .status-dnd {
    border-style: solid;
    border-width: 3px;
    border-color: #f04747;
  }
  .status-offline {
    border-style: solid;
    border-width: 3px;
    border-color: #747f8d;
  }
</style>

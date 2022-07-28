export const STRINGS = {
  LaunchRocketLabel: "Launch Rocket",
  LaunchRocketTooltip: "Ignites the fuel",
  IgnitionErrorTooltip: "Ignition error",
  LaunchingLabel: "Launching",
  CancelLaunchTooltip: "Cancel launch",
};

// Increase or decrease this value to see different results.
// Any delay above 2 would cause the requests to timeout.
// Delay of 1 will intermitently fail/succeed depending on response time.
const delay = 1;

export const LAUNCH_ROCKET_URL = `https://httpbin.org/delay/${delay}`;

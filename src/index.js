const core = require("@actions/core");
const axios = require("axios");

async function controlStatusCakeMonitor(monitorId, pause, apiToken) {
  try {
    const url = `https://api.statuscake.com/v1/uptime/${monitorId}`;
    const data = { paused: pause }; // `pause` is a boolean
    const headers = {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    };
    core.info(
      `Updating monitor ${monitorId} to ${pause ? "pause" : "restart"}`,
    );
    core.debug(`URL: ${url}`);
    core.debug(`pause: ${pause}`);
    core.debug(`data: ${JSON.stringify(data)}`);

    const response = await axios.put(url, data, { headers });

    core.info(`Monitor ${monitorId} updated successfully: ${response.data}`);
  } catch (error) {
    core.error(`Error updating monitor ${monitorId}: ${error}`);
    throw error;
  }
}

async function run() {
  try {
    const monitorIds = core.getInput("statuscake_monitor_ids").split(",");
    const action = core.getInput("action");
    const apiToken = core.getInput("statuscake_api_token");

    const pause = action === "pause"; // Convert the action to a boolean

    for (const monitorId of monitorIds) {
      await controlStatusCakeMonitor(monitorId, pause, apiToken);
    }
  } catch (error) {
    core.setFailed(`Action failed with error: ${error}`);
  }
}

run();

exports.controlStatusCakeMonitor = controlStatusCakeMonitor;

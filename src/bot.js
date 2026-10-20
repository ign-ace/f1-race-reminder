import "dotenv/config";

import { getNextRaceWeekend } from "./services/scheduleService.js";
import { formatRaceWeekend } from "./utils/formatter.js";
import { getUpdates, sendMessage } from "./services/telegramService.js";

const POLL_TIMEOUT_SECONDS = 30;
const RETRY_DELAY_MS = 5000;

let offset = 0;

function isStartCommand(text) {
  return /^\/start(@\w+)?(\s|$)/i.test(text);
}

async function skipPendingUpdates() {
  const data = await getUpdates(-1, 0);

  const updates = data.result || [];

  if (updates.length > 0) {
    offset = updates[updates.length - 1].update_id + 1;
  }
}

async function replyWithNextRace(chatId) {
  const race = await getNextRaceWeekend();

  if (!race) {
    await sendMessage(chatId, "No upcoming race found for this season.");

    return;
  }

  await sendMessage(chatId, formatRaceWeekend(race));
}

async function handleUpdate(update) {
  const message = update.message;

  if (!message?.text) {
    return;
  }

  const chatId = message.chat.id;

  if (!isStartCommand(message.text.trim())) {
    await sendMessage(chatId, "Send /start to get the next F1 race weekend.");

    return;
  }

  try {
    await sendMessage(chatId, "Fetching the next race weekend...");

    await replyWithNextRace(chatId);
  } catch (error) {
    console.error("Failed to handle update:", error);

    await sendMessage(
      chatId,
      "Could not fetch F1 data right now. Please try again.",
    ).catch(() => {});
  }
}

async function main() {
  await skipPendingUpdates();

  console.log("F1 Telegram bot listening for /start...");

  while (true) {
    try {
      const data = await getUpdates(offset, POLL_TIMEOUT_SECONDS);

      for (const update of data.result || []) {
        offset = update.update_id + 1;

        await handleUpdate(update);
      }
    } catch (error) {
      console.error(`Polling failed: ${error.message}`);

      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }
}

main().catch((error) => {
  console.error("Bot failed to start:");
  console.error(error);

  process.exit(1);
});

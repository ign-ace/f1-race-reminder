import "dotenv/config";

import { DateTime } from "luxon";

import { getNextRaceWeekend } from "./services/scheduleService.js";

import { formatRaceWeekend } from "./utils/formatter.js";

import { sendTelegramMessage } from "./services/telegramService.js";

async function main() {
  const dryRun = process.argv.includes("--dry-run");

  const now = DateTime.now().setZone("Asia/Kolkata");

  console.log(`Current IST time: ${now.toFormat("dd LLL yyyy HH:mm:ss")}`);

  const race = await getNextRaceWeekend();

  if (!race) {
    console.log("No upcoming race found.");

    return;
  }

  console.log(`\nNext race: ${race.raceName}`);

  const message = formatRaceWeekend(race);

  console.log("\n" + message);

  if (dryRun) {
    console.log("\n🧪 Dry run — Telegram NOT sent.");

    return;
  }

  await sendTelegramMessage(message);

  console.log("\n✅ Telegram notification sent!");
}

main().catch((error) => {
  console.error("\n❌ Application failed:");

  console.error(error);

  process.exit(1);
});

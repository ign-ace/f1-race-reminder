import { DateTime } from "luxon";

export const IST_ZONE = "Asia/Kolkata";

export function utcToIST(date, time = "00:00:00") {
  return DateTime.fromISO(`${date}T${time}`, {
    zone: "UTC",
  }).setZone(IST_ZONE);
}

export function formatIST(date, time) {
  return utcToIST(date, time).toFormat("dd LLL yyyy, hh:mm a");
}

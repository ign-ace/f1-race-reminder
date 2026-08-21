import { DateTime } from "luxon";
import { getSeasonSchedule } from "../api/jolpica.js";

const IST_ZONE = "Asia/Kolkata";

function convertToIST(timestamp) {
  if (!timestamp) {
    return null;
  }

  return DateTime.fromISO(timestamp, {
    zone: "UTC",
  }).setZone(IST_ZONE);
}

export async function getNextRaceWeekend() {
  const now = DateTime.now().setZone(IST_ZONE);

  console.log(`Looking for races in ${now.year}...`);

  const data = await getSeasonSchedule(now.year);

  const events = data?.data?.events || [];

  console.log(`Races received from API: ${events.length}`);

  for (const event of events) {
    const schedule = event.schedule || [];

    // Find the actual race session
    const raceSession = schedule.find((session) => session.code === "R");

    if (!raceSession) {
      continue;
    }

    const raceTimeIST = convertToIST(raceSession.timestamp);

    console.log(
      `${event.round.name} -> ${raceTimeIST.toFormat("dd LLL yyyy HH:mm")} IST`,
    );

    // Is this race still in the future?
    if (raceTimeIST > now) {
      return {
        raceName: event.round.name,

        circuitName: event.circuit.name,

        country: event.circuit.country,

        locality: event.circuit.locality,

        sessions: {
          FirstPractice: getSession(schedule, "FP1"),

          SecondPractice: getSession(schedule, "FP2"),

          ThirdPractice: getSession(schedule, "FP3"),

          SprintQualifying: getSession(schedule, "SQ"),

          Sprint: getSession(schedule, "SR"),

          Qualifying: getSession(schedule, "Q"),

          Race: getSession(schedule, "R"),
        },
      };
    }
  }

  return null;
}

function getSession(schedule, code) {
  const session = schedule.find((item) => item.code === code);

  if (!session) {
    return null;
  }

  return {
    code: session.code,

    name: session.title,

    ist: convertToIST(session.timestamp),
  };
}

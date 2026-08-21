function addSession(lines, icon, name, session) {
  if (!session) {
    return;
  }

  const date = session.ist.toFormat("dd LLL");
  const time = session.ist.toFormat("h:mm a");

  lines.push(`${icon} ${name}`);

  lines.push(`   ${date} • ${time} IST`);
}

export function formatRaceWeekend(race) {
  const lines = [];

  lines.push("🏎️ F1 RACE WEEKEND");
  lines.push("");

  lines.push(`🏁 ${race.raceName}`);

  lines.push(`📍 ${race.circuitName}, ${race.country}`);

  lines.push("");

  const sessions = race.sessions;

  // -------------------------
  // FRIDAY
  // -------------------------

  const fridaySessions = [
    ["🟢", "Practice 1", sessions.FirstPractice],

    ["🟢", "Practice 2", sessions.SecondPractice],

    ["🟡", "Sprint Qualifying", sessions.SprintQualifying],
  ].filter(([, , session]) => session);

  if (fridaySessions.length > 0) {
    lines.push("📅 FRIDAY");
    lines.push("");

    for (const [icon, name, session] of fridaySessions) {
      addSession(lines, icon, name, session);

      lines.push("");
    }
  }

  // -------------------------
  // SATURDAY
  // -------------------------

  const saturdaySessions = [
    ["🟢", "Practice 3", sessions.ThirdPractice],

    ["🔴", "Sprint", sessions.Sprint],

    ["🟡", "Qualifying", sessions.Qualifying],
  ].filter(([, , session]) => session);

  if (saturdaySessions.length > 0) {
    lines.push("📅 SATURDAY");
    lines.push("");

    for (const [icon, name, session] of saturdaySessions) {
      addSession(lines, icon, name, session);

      lines.push("");
    }
  }

  // -------------------------
  // SUNDAY
  // -------------------------

  if (sessions.Race) {
    lines.push("📅 SUNDAY");
    lines.push("");

    addSession(lines, "🏁", "Race", sessions.Race);

    lines.push("");
  }

  lines.push("🏁 Enjoy the race weekend!");

  return lines.join("\n");
}

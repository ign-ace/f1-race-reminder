const BASE_URL = "https://api.jolpi.ca";

export async function getSeasonSchedule(year) {
  const url = `${BASE_URL}/f1/alpha/schedules/${year}/`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "F1RaceReminder/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Jolpica API failed: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

const FALLBACK_CONCERTS = [
  {
    date: "OCT. 20, 2025",
    location: "Dallas, TX",
    venue: "DOS EQUIS PAVILION",
    tickets:
      "https://www.bandsintown.com/e/107006009?affil_code=js_www.twentyonepilots.com&app_id=js_www.twentyonepilots.com&came_from=700&utm_campaign=event&utm_medium=web&utm_source=widget",
  },
  {
    date: "OCT. 23, 2025",
    location: "Chula Vista, CA",
    venue: "NORTH ISLAND CREDIT UNION AMPHITHEATRE",
    tickets:
      "https://www.bandsintown.com/e/107006014?affil_code=js_www.twentyonepilots.com&app_id=js_www.twentyonepilots.com&came_from=700&utm_campaign=event&utm_medium=web&utm_source=widget",
  },
  {
    date: "OCT. 25, 2025",
    location: "Los Angeles, CA",
    venue: "BMO STADIUM",
    tickets:
      "https://www.bandsintown.com/e/107006019?affil_code=js_www.twentyonepilots.com&app_id=js_www.twentyonepilots.com&came_from=700&utm_campaign=event&utm_medium=web&utm_source=widget",
  },
  {
    date: "OCT. 26, 2025",
    location: "Los Angeles, CA",
    venue: "BMO STADIUM",
    tickets:
      "https://www.bandsintown.com/e/107040086?affil_code=js_www.twentyonepilots.com&app_id=js_www.twentyonepilots.com&came_from=700&utm_campaign=event&utm_medium=web&utm_source=widget",
  },
  {
    date: "FEB. 21, 2026",
    location: "Tempe, AZ",
    venue: "INNINGS FESTIVAL 2026",
    tickets:
      "https://www.bandsintown.com/e/107348719?affil_code=js_www.twentyonepilots.com&app_id=js_www.twentyonepilots.com&came_from=700&utm_campaign=event&utm_medium=web&utm_source=widget",
  },
  {
    date: "JUN. 19 - 21, 2026",
    location: "Neuhausen Ob Eck, Germany",
    venue: "SOUTHSIDE FESTIVAL",
    tickets:
      "https://www.bandsintown.com/e/107328233?affil_code=js_www.twentyonepilots.com&app_id=js_www.twentyonepilots.com&came_from=700&utm_campaign=event&utm_medium=web&utm_source=widget",
  },
  {
    date: "JUN. 19 - 21, 2026",
    location: "Scheeßel, Germany",
    venue: "HURRICANE FESTIVAL",
    tickets:
      "https://www.bandsintown.com/e/107328209?affil_code=js_www.twentyonepilots.com&app_id=js_www.twentyonepilots.com&came_from=700&utm_campaign=event&utm_medium=web&utm_source=widget",
  },
  {
    date: "JUN. 28, 2026",
    location: "Lido Di Camaiore, Italy",
    venue: "LA PRIMA ESTATE 2026",
    tickets:
      "https://www.bandsintown.com/e/107446498?affil_code=js_www.twentyonepilots.com&app_id=js_www.twentyonepilots.com&came_from=700&utm_campaign=event&utm_medium=web&utm_source=widget",
  },
  {
    date: "JUL. 4, 2026",
    location: "Werchter, Belgium",
    venue: "ROCK WERCHTER 2026",
    tickets:
      "https://www.bandsintown.com/e/107476430?affil_code=js_www.twentyonepilots.com&app_id=js_www.twentyonepilots.com&came_from=700&utm_campaign=event&utm_medium=web&utm_source=widget",
  },
  {
    date: "JUL. 5, 2026",
    location: "Arras, France",
    venue: "MAIN SQUARE FESTIVAL 2026",
    tickets:
      "https://www.bandsintown.com/e/107435811?affil_code=js_www.twentyonepilots.com&app_id=js_www.twentyonepilots.com&came_from=700&utm_campaign=event&utm_medium=web&utm_source=widget",
  },
  {
    date: "JUL. 15 - 18, 2026",
    location: "Ostrava, Czechia",
    venue: "COLOURS OF OSTRAVA 2026",
    tickets:
      "https://www.bandsintown.com/e/107426051?affil_code=js_www.twentyonepilots.com&app_id=js_www.twentyonepilots.com&came_from=700&utm_campaign=event&utm_medium=web&utm_source=widget",
  },
  {
    date: "JUL. 16 - 19, 2026",
    location: "Bontida, Romania",
    venue: "ELECTRIC CASTLE FESTIVAL 2026",
    tickets:
      "https://www.bandsintown.com/e/107476450?affil_code=js_www.twentyonepilots.com&app_id=js_www.twentyonepilots.com&came_from=700&utm_campaign=event&utm_medium=web&utm_source=widget",
  },
  {
    date: "AUG. 20 - 22, 2026",
    location: "St. Pölten, Austria",
    venue: "FREQUENCY FESTIVAL 2026",
    tickets:
      "https://www.bandsintown.com/e/107461337?affil_code=js_www.twentyonepilots.com&app_id=js_www.twentyonepilots.com&came_from=700&utm_campaign=event&utm_medium=web&utm_source=widget",
  },
];

export default async function handler(req, res) {
  // CORS Configuration
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Cache-Control header: Cache at Edge CDN for 24 hours (86400 seconds)
  // Serve stale version for up to 1 hour (3600 seconds) while revalidating in background
  res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=3600");

  try {
    const url =
      "https://rest.bandsintown.com/artists/Twenty%20One%20Pilots/events?app_id=js_www.twentyonepilots.com";
    const apiRes = await fetch(url);
    if (!apiRes.ok) {
      throw new Error(`Bandsintown API returned HTTP Status ${apiRes.status}`);
    }
    const events = await apiRes.json();

    const formattedEvents = events.map((event) => {
      // Deterministic timezone-proof date parsing: "2026-05-25T17:00:00" -> "MAY 25, 2026"
      const datePart = event.datetime.split("T")[0];
      const [year, month, day] = datePart.split("-").map(Number);
      const months = [
        "JAN.",
        "FEB.",
        "MAR.",
        "APR.",
        "MAY",
        "JUN.",
        "JUL.",
        "AUG.",
        "SEP.",
        "OCT.",
        "NOV.",
        "DEC.",
      ];
      const monthStr = months[month - 1];
      const formattedDate = `${monthStr} ${day}, ${year}`;

      // Ticket Link selection
      const ticketUrl =
        event.offers && event.offers.length > 0
          ? event.offers[0].url
          : event.url;

      // Location description
      let location = event.venue.city;
      if (event.venue.region) {
        location += `, ${event.venue.region}`;
      } else if (event.venue.country) {
        location += `, ${event.venue.country}`;
      }

      return {
        date: formattedDate,
        location: location,
        venue: event.venue.name.toUpperCase(),
        tickets: ticketUrl,
      };
    });

    res.status(200).json(formattedEvents);
  } catch (error) {
    console.error("API Fetch Error, falling back to static tour dates:", error);
    res.status(200).json(FALLBACK_CONCERTS);
  }
}

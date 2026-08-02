export default async function handler(req, res) {
  // CORS Configuration
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

    if (!Array.isArray(events)) {
      throw new Error("Bandsintown API did not return an array of events");
    }

    const formattedEvents = events.map((event) => {
      // Safe date parsing: "2026-05-25T17:00:00" -> "MAY 25, 2026"
      let formattedDate = "TBA";
      if (event && event.datetime && typeof event.datetime === "string") {
        const datePart = event.datetime.split("T")[0];
        const parts = datePart.split("-");
        if (parts.length === 3) {
          const [year, month, day] = parts.map(Number);
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
          if (monthStr && !isNaN(day) && !isNaN(year)) {
            formattedDate = `${monthStr} ${day}, ${year}`;
          }
        }
      }

      // Ticket Link selection
      const ticketUrl =
        event && event.offers && event.offers.length > 0
          ? event.offers[0].url
          : (event && event.url) || "";

      // Location description
      let location = "TBA";
      if (event && event.venue) {
        location = event.venue.city || "";
        if (event.venue.region) {
          location += `, ${event.venue.region}`;
        } else if (event.venue.country) {
          location += `, ${event.venue.country}`;
        }
      }

      // Venue name
      const venue =
        event && event.venue && event.venue.name
          ? event.venue.name.toUpperCase()
          : "VENUE TBA";

      return {
        date: formattedDate,
        location: location,
        venue: venue,
        tickets: ticketUrl,
      };
    });

    res.status(200).json(formattedEvents);
  } catch (error) {
    console.error("API Fetch Error:", error);
    res.status(500).json({
      success: false,
      error: "Error al obtener las fechas de la gira.",
      details: error.message,
    });
  }
}

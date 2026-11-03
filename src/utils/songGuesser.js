const BEST_RUN_KEY = "top-fan:song-guesser:best:v1";

export function normalizeSongTitle(title) {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .replace(/\[[^\]]*\]/g, " ")
    .replace(/&/g, " and ")
    .replace(/['‘’ʼ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildSongIndex(albums) {
  const indexedAlbums = albums.map((album) => ({
    ...album,
    rows: album.tracks.map((track) => ({
      key: `${album.id}-${track.id}`,
      albumId: album.id,
      albumName: album.name,
      trackId: track.id,
      title: track.title,
      duration: track.duration,
      normalizedTitle: normalizeSongTitle(track.title),
    })),
  }));

  const rows = indexedAlbums.flatMap((album) => album.rows);
  const titleIndex = new Map();

  rows.forEach((row) => {
    const matches = titleIndex.get(row.normalizedTitle) || [];
    matches.push(row.key);
    titleIndex.set(row.normalizedTitle, matches);
  });

  return {
    albums: indexedAlbums,
    rows,
    titleIndex,
    total: rows.length,
  };
}

export function formatElapsed(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function loadBestRun() {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(BEST_RUN_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (
      !parsed ||
      typeof parsed.percentage !== "number" ||
      typeof parsed.timeMs !== "number"
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function saveBestRun(run) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(BEST_RUN_KEY, JSON.stringify(run));
  } catch {
    // Storage can be unavailable in private browsing or when quota is exceeded.
  }
}

export function isBetterRun(current, previous) {
  if (!previous) return true;
  if (current.percentage !== previous.percentage) {
    return current.percentage > previous.percentage;
  }
  return current.timeMs < previous.timeMs;
}

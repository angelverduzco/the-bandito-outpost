import { ALBUMS } from "../data/albums";
import { EXTENDED_PLAYS } from "../data/eps";
import { SINGLES } from "../data/singles";
import { LIVE_ALBUMS } from "../data/liveAlbums";

export const RELEASE_GROUPS = [
  { id: "albums", label: "Studio Albums", releases: ALBUMS },
  { id: "eps", label: "EPs", releases: EXTENDED_PLAYS },
  { id: "singles", label: "Singles", releases: SINGLES },
  { id: "live", label: "Live Albums", releases: LIVE_ALBUMS },
];

export const BRACKET_SIZES = [
  { id: 32, label: "32 songs", hint: "Quick run" },
  { id: 64, label: "64 songs", hint: "Longer run" },
  { id: "full", label: "Full bracket", hint: "Everything selected" },
];

export function createReleaseKeys(groupIds) {
  const keys = new Set();

  RELEASE_GROUPS.filter((group) => groupIds.includes(group.id)).forEach(
    (group) => {
      group.releases.forEach((release) => {
        keys.add(`${group.id}:${release.id}`);
      });
    },
  );

  return keys;
}

export function buildSongPool(selectedKeys) {
  const selected =
    selectedKeys instanceof Set ? selectedKeys : new Set(selectedKeys);
  const pool = [];

  RELEASE_GROUPS.forEach((group) => {
    group.releases.forEach((release) => {
      if (!selected.has(`${group.id}:${release.id}`)) return;

      release.tracks.forEach((track) => {
        pool.push({
          key: `${group.id}:${release.id}:${track.id}`,
          title: track.title,
          albumName: release.name,
          albumCover: release.cover,
        });
      });
    });
  });

  return pool;
}

function shuffle(list) {
  const result = [...list];

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

export function nextPowerOfTwo(count) {
  let power = 2;

  while (power < count) power *= 2;

  return power;
}

export function createTournament(songs, sizeId) {
  const target =
    sizeId === "full" ? nextPowerOfTwo(songs.length) : Number(sizeId);
  const shuffled = shuffle(songs).slice(0, target);
  const songCount = shuffled.length;
  const pairCount = target / 2;
  const byeCount = target - songCount;
  const queue = [...shuffled];
  const byePairs = new Set();

  if (byeCount > 0) {
    const leftByes = Math.floor(byeCount / 2);
    const rightByes = byeCount - leftByes;
    const halfPairs = pairCount / 2;

    const spreadByes = (startOffset, count) => {
      for (let k = 0; k < count; k += 1) {
        byePairs.add(startOffset + Math.floor((k * halfPairs) / count));
      }
    };

    spreadByes(0, leftByes);
    spreadByes(halfPairs, rightByes);
  }

  const slots = [];

  for (let pair = 0; pair < pairCount; pair += 1) {
    if (byePairs.has(pair)) {
      if (pair % 2 === 0) {
        slots.push(queue.pop(), null);
      } else {
        slots.push(null, queue.pop());
      }
    } else {
      slots.push(queue.pop(), queue.pop());
    }
  }

  const rounds = [];
  let entries = slots;
  let roundIndex = 0;

  while (entries.length >= 2) {
    const matches = [];

    for (let i = 0; i < entries.length; i += 2) {
      const a = entries[i];
      const b = entries[i + 1];
      const match = {
        id: `r${roundIndex}m${i / 2}`,
        roundIndex,
        index: i / 2,
        a,
        b,
        winner: null,
        nextMatchId: null,
        nextSlot: null,
      };

      if (roundIndex === 0) {
        if (a && !b) match.winner = a;
        if (!a && b) match.winner = b;
      }

      matches.push(match);
    }

    rounds.push(matches);
    entries = matches.map((match) => match.winner);
    roundIndex += 1;
  }

  rounds.slice(0, -1).forEach((matches, roundIndex) => {
    matches.forEach((match, index) => {
      match.nextMatchId = rounds[roundIndex + 1][Math.floor(index / 2)].id;
      match.nextSlot = index % 2 === 0 ? "a" : "b";
    });
  });

  return {
    target,
    songCount,
    votesNeeded: songCount - 1,
    rounds,
  };
}

export function castVote(tournament, matchId, winnerKey) {
  const nextRounds = tournament.rounds.map((round) =>
    round.map((match) => ({ ...match })),
  );
  const matchById = new Map();

  nextRounds.forEach((round) => {
    round.forEach((match) => matchById.set(match.id, match));
  });

  const match = matchById.get(matchId);

  if (!match || match.winner) return tournament;

  let winner = null;

  if (match.a && match.a.key === winnerKey) winner = match.a;
  if (match.b && match.b.key === winnerKey) winner = match.b;

  if (!winner) return tournament;

  match.winner = winner;

  if (match.nextMatchId) {
    const nextMatch = matchById.get(match.nextMatchId);
    if (nextMatch) nextMatch[match.nextSlot] = winner;
  }

  return { ...tournament, rounds: nextRounds };
}

export function getNextMatch(tournament) {
  for (const round of tournament.rounds) {
    for (const match of round) {
      if (match.a && match.b && !match.winner) return match;
    }
  }

  return null;
}

export function getChampion(tournament) {
  const finalRound = tournament.rounds[tournament.rounds.length - 1];
  return finalRound?.[0]?.winner ?? null;
}

export function countVotesCast(tournament) {
  let total = 0;

  tournament.rounds.forEach((round) => {
    round.forEach((match) => {
      if (match.a && match.b && match.winner) total += 1;
    });
  });

  return total;
}

export function getRoundLabel(roundIndex, target) {
  const players = target / 2 ** roundIndex;

  if (players === 2) return "Final";
  if (players === 4) return "Semifinal";
  if (players === 8) return "Quarterfinal";
  return `Round of ${players}`;
}

export function getSideRounds(tournament) {
  const bracketRounds = tournament.rounds.slice(
    0,
    tournament.rounds.length - 1,
  );
  const left = [];
  const right = [];

  bracketRounds.forEach((matches, roundIndex) => {
    const half = matches.length / 2;
    const label = getRoundLabel(roundIndex, tournament.target);

    left.push({
      roundIndex,
      label,
      matches: matches.slice(0, half),
    });
    right.push({
      roundIndex,
      label,
      matches: matches.slice(half),
    });
  });

  return { left, right: right.reverse() };
}

export function getFullRounds(tournament) {
  return tournament.rounds
    .slice(0, tournament.rounds.length - 1)
    .map((matches, roundIndex) => ({
      roundIndex,
      label: getRoundLabel(roundIndex, tournament.target),
      matches,
    }));
}

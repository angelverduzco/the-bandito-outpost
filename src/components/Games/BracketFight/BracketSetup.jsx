import { useEffect, useMemo, useState } from "react";
import { getAssetUrl } from "../../../utils/assets";
import {
  BRACKET_SIZES,
  RELEASE_GROUPS,
  buildSongPool,
  createReleaseKeys,
  nextPowerOfTwo,
} from "../../../utils/bracketFight";

export function BracketSetup({ onStart }) {
  const [selected, setSelected] = useState(() => createReleaseKeys(["albums"]));
  const [size, setSize] = useState(32);
  const pool = useMemo(() => buildSongPool(selected), [selected]);

  useEffect(() => {
    if (size !== "full" && pool.length < size) setSize("full");
  }, [size, pool.length]);

  const toggleRelease = (key) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const toggleGroup = (group) => {
    const keys = group.releases.map((release) => `${group.id}:${release.id}`);
    const allSelected = keys.every((key) => selected.has(key));

    setSelected((current) => {
      const next = new Set(current);
      keys.forEach((key) => {
        if (allSelected) {
          next.delete(key);
        } else {
          next.add(key);
        }
      });
      return next;
    });
  };

  return (
    <section className="bracket-setup" aria-label="Bracket Fight setup">
      <header className="bracket-setup-header">
        <h2>Build your bracket</h2>
        <p>
          Choose which releases enter the tournament and pick a bracket size,
          then vote song against song until one champion remains. Songs that
          appear on several releases compete once per release.
        </p>
      </header>

      <div
        className="bracket-setup-presets"
        role="group"
        aria-label="Quick presets"
      >
        <button
          type="button"
          className="bracket-chip"
          onClick={() => setSelected(createReleaseKeys(["albums"]))}
        >
          All studio albums
        </button>
        <button
          type="button"
          className="bracket-chip"
          onClick={() =>
            setSelected(createReleaseKeys(["albums", "eps", "singles", "live"]))
          }
        >
          Whole discography
        </button>
        <button
          type="button"
          className="bracket-chip"
          onClick={() => setSelected(new Set())}
        >
          Clear
        </button>
      </div>

      <div className="bracket-groups">
        {RELEASE_GROUPS.map((group) => {
          const groupSelected = group.releases.filter((release) =>
            selected.has(`${group.id}:${release.id}`),
          ).length;

          return (
            <div
              className="bracket-group"
              role="group"
              aria-label={group.label}
              key={group.id}
            >
              <div className="bracket-group-head">
                <input
                  ref={(node) => {
                    if (node) {
                      node.indeterminate =
                        groupSelected > 0 &&
                        groupSelected < group.releases.length;
                    }
                  }}
                  className="bracket-checkbox"
                  type="checkbox"
                  checked={groupSelected === group.releases.length}
                  onChange={() => toggleGroup(group)}
                  aria-label={`Toggle all ${group.label}`}
                />
                <div className="bracket-group-titles">
                  <span className="bracket-group-name">{group.label}</span>
                  <span className="bracket-group-count">
                    {groupSelected}/{group.releases.length} releases
                  </span>
                </div>
              </div>
              <div className="bracket-releases">
                {group.releases.map((release) => {
                  const key = `${group.id}:${release.id}`;
                  const checked = selected.has(key);

                  return (
                    <label
                      className={`bracket-release${checked ? " is-selected" : ""}`}
                      key={key}
                    >
                      <input
                        className="bracket-checkbox"
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleRelease(key)}
                      />
                      <img
                        className="bracket-release-cover"
                        src={getAssetUrl(release.cover)}
                        alt=""
                        loading="lazy"
                      />
                      <span className="bracket-release-info">
                        <span className="bracket-release-name">
                          {release.name}
                        </span>
                        <span className="bracket-release-meta">
                          {release.release} · {release.tracks.length} tracks
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bracket-setup-panel">
        <div className="bracket-setup-summary">
          <p className="bracket-setup-count">
            {pool.length} song{pool.length === 1 ? "" : "s"} selected
          </p>
          <p className="bracket-setup-hint">
            Larger bracket sizes unlock as you add more songs.
          </p>
        </div>

        <div
          className="bracket-size-options"
          role="group"
          aria-label="Bracket size"
        >
          {BRACKET_SIZES.map((option) => {
            const unavailable = option.id !== "full" && pool.length < option.id;
            const isSelected = size === option.id;

            return (
              <button
                key={option.id}
                type="button"
                className={`bracket-size-option${isSelected ? " is-selected" : ""}`}
                disabled={unavailable}
                onClick={() => setSize(option.id)}
              >
                <span className="bracket-size-name">{option.label}</span>
                <span className="bracket-size-hint">
                  {typeof option.id === "number"
                    ? `${Math.log2(option.id) + 1} rounds`
                    : `${Math.max(pool.length, 2)} songs · ${nextPowerOfTwo(Math.max(pool.length, 2))} slots`}
                </span>
              </button>
            );
          })}
        </div>

        <div className="bracket-setup-start-row">
          <button
            type="button"
            className="bracket-button bracket-button--primary"
            disabled={pool.length < 2}
            onClick={() => {
              onStart({ selectedReleases: Array.from(selected), size });
            }}
          >
            Start tournament
          </button>
          {pool.length < 2 ? (
            <p className="bracket-setup-warning">
              Select at least two songs to start.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

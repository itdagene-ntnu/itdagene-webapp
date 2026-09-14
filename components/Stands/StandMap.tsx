import React, { useEffect, useMemo, useState } from 'react';
import {
  COLLABORATOR_TIER_LABELS,
  StandMapDay,
  StandMapStand,
} from './standsData';

const normaliseSearch = (value: string): string =>
  value.trim().toLocaleLowerCase('nb');

const matchesSearch = (stand: StandMapStand, search: string): boolean => {
  const query = normaliseSearch(search);
  return (
    !query ||
    stand.companyName.toLocaleLowerCase('nb').includes(query) ||
    String(stand.number) === query
  );
};

const CollaboratorBadge = ({
  stand,
}: {
  stand: StandMapStand;
}): JSX.Element | null =>
  stand.collaboratorTier ? (
    <span
      className="stand-collaborator-badge"
      data-collaborator-tier={stand.collaboratorTier}
    >
      {COLLABORATOR_TIER_LABELS[stand.collaboratorTier]}
    </span>
  ) : null;

const StandSummary = ({
  location,
  stand,
  onClear,
}: {
  location: string;
  stand: StandMapStand;
  onClear: () => void;
}): JSX.Element => (
  <aside aria-live="polite" className="stand-selection">
    <div>
      <p className="site-eyebrow">Øverste søkeresultat</p>
      <h2>
        {stand.companyName}
        <CollaboratorBadge stand={stand} />
      </h2>
      <p>
        Stand {stand.number} i {location}.
      </p>
    </div>
    <button className="stand-selection__clear" onClick={onClear} type="button">
      Nullstill søket
    </button>
  </aside>
);

export const StandMap = ({ day }: { day: StandMapDay }): JSX.Element => {
  const [search, setSearch] = useState('');
  const [hoveredCompany, setHoveredCompany] = useState<string>();
  const [focusedCompany, setFocusedCompany] = useState<string>();
  // Touch devices have no hover, so a tap stands in for it. It never leaves the
  // component: the stand map is a lookup surface, not a selection the visitor
  // has to undo or carry around in the URL.
  const [tappedCompany, setTappedCompany] = useState<string>();
  const filteredStands = useMemo(
    () => day.stands.filter((stand) => matchesSearch(stand, search)),
    [day.stands, search]
  );
  const searchPreviewStand = normaliseSearch(search)
    ? filteredStands[0]
    : undefined;
  const activeCompany =
    searchPreviewStand?.companySlug ||
    hoveredCompany ||
    focusedCompany ||
    tappedCompany;
  const isActive = (stand: StandMapStand): boolean =>
    stand.companySlug === activeCompany;
  const interactionProps = (
    stand: StandMapStand
  ): {
    'aria-pressed': boolean;
    'data-active': boolean;
    'data-collaborator-tier'?: string;
    'data-stand-company': string;
    onBlur: () => void;
    onClick: () => void;
    onFocus: () => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  } => ({
    'aria-pressed': stand.companySlug === tappedCompany,
    'data-active': isActive(stand),
    'data-collaborator-tier': stand.collaboratorTier,
    'data-stand-company': stand.companySlug,
    onBlur: (): void =>
      setFocusedCompany((current) =>
        current === stand.companySlug ? undefined : current
      ),
    onClick: (): void =>
      setTappedCompany((current) => {
        if (current === stand.companySlug) {
          setFocusedCompany(undefined);
          setHoveredCompany(undefined);
          return undefined;
        }
        return stand.companySlug;
      }),
    onFocus: (): void => setFocusedCompany(stand.companySlug),
    onMouseEnter: (): void => setHoveredCompany(stand.companySlug),
    onMouseLeave: (): void =>
      setHoveredCompany((current) =>
        current === stand.companySlug ? undefined : current
      ),
  });

  useEffect(() => {
    setSearch('');
    setHoveredCompany(undefined);
    setFocusedCompany(undefined);
    setTappedCompany(undefined);
  }, [day.id]);

  return (
    <div className="stand-explorer">
      <div className="stand-explorer__toolbar">
        <label htmlFor="stand-search">
          Søk etter bedrift eller standnummer
        </label>
        <input
          autoComplete="off"
          id="stand-search"
          onChange={(event): void => setSearch(event.target.value)}
          onKeyDown={(event): void => {
            if (event.key === 'Escape') {
              setSearch('');
            } else if (event.key === 'Enter') {
              (event.target as HTMLElement).blur();
            }
          }}
          placeholder="For eksempel Computas eller 27"
          type="search"
          value={search}
        />
        <p aria-live="polite">
          {filteredStands.length} av {day.stands.length} stands
        </p>
      </div>

      {searchPreviewStand && (
        <StandSummary
          location={day.location}
          onClear={(): void => setSearch('')}
          stand={searchPreviewStand}
        />
      )}

      <div className="stand-explorer__layout">
        <div>
          <div
            className="stand-map"
            onClick={(event): void => {
              if (
                event.target === event.currentTarget ||
                (event.target as HTMLElement).tagName === 'IMG'
              ) {
                setTappedCompany(undefined);
                setFocusedCompany(undefined);
                setHoveredCompany(undefined);
              }
            }}
          >
            <img
              alt={`Plantegning med standplasseringer for ${day.label.toLowerCase()}`}
              height={1131}
              src={day.mapImage}
              width={1600}
            />
            <div
              aria-label={`Standkart for ${day.label}`}
              className="stand-map__markers"
            >
              {day.stands.map((stand) => (
                <button
                  aria-label={`Stand ${stand.number}, ${stand.companyName}${
                    stand.collaboratorTier
                      ? `, ${COLLABORATOR_TIER_LABELS[stand.collaboratorTier]}`
                      : ''
                  }`}
                  className="stand-map__marker"
                  data-label-side={stand.position.x > 50 ? 'left' : 'right'}
                  key={stand.number}
                  {...interactionProps(stand)}
                  style={{
                    left: `${stand.position.x}%`,
                    top: `${stand.position.y}%`,
                  }}
                  type="button"
                >
                  <span className="stand-map__marker-number">
                    {stand.number}
                  </span>
                  {isActive(stand) && (
                    <span
                      aria-hidden="true"
                      className="stand-map__marker-label"
                    >
                      {stand.companyName}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
          <a
            className="stand-map__download"
            href={day.downloadImage}
            rel="noreferrer"
            target="_blank"
          >
            Åpne kartet i full størrelse
          </a>
        </div>

        <div className="stand-directory">
          <ol>
            {filteredStands.map((stand) => (
              <li key={stand.number}>
                <button {...interactionProps(stand)} type="button">
                  <span>{stand.number}</span>
                  <strong>{stand.companyName}</strong>
                  <CollaboratorBadge stand={stand} />
                </button>
              </li>
            ))}
          </ol>
          {filteredStands.length === 0 && (
            <div className="stand-directory__empty" role="status">
              <h2>Ingen treff</h2>
              <p>Prøv et annet bedriftsnavn eller standnummer.</p>
              <button onClick={(): void => setSearch('')} type="button">
                Nullstill søket
              </button>
            </div>
          )}
        </div>
      </div>

      <details className="stand-table">
        <summary>Vis som tilgjengelig tabell</summary>
        <table>
          <thead>
            <tr>
              <th scope="col">Stand</th>
              <th scope="col">Bedrift</th>
              <th scope="col">Dag</th>
            </tr>
          </thead>
          <tbody>
            {day.stands.map((stand) => (
              <tr
                data-active={isActive(stand)}
                data-collaborator-tier={stand.collaboratorTier}
                key={stand.number}
              >
                <td>{stand.number}</td>
                <td>
                  <button
                    className="stand-table__company"
                    {...interactionProps(stand)}
                    type="button"
                  >
                    {stand.companyName}
                  </button>
                  <CollaboratorBadge stand={stand} />
                </td>
                <td>{day.label}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
};

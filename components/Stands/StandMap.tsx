import React, { useEffect, useMemo, useState } from 'react';
import { StandMapDay, StandMapStand } from './standsData';

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

const StandSummary = ({
  clearLabel = 'Fjern valg',
  eyebrow = 'Valgt stand',
  location,
  stand,
  onClear,
}: {
  clearLabel?: string;
  eyebrow?: string;
  location: string;
  stand: StandMapStand;
  onClear: () => void;
}): JSX.Element => (
  <aside aria-live="polite" className="stand-selection">
    <div>
      <p className="site-eyebrow">{eyebrow}</p>
      <h2>{stand.companyName}</h2>
      <p>
        Stand {stand.number} i {location}.
      </p>
    </div>
    <button className="stand-selection__clear" onClick={onClear} type="button">
      {clearLabel}
    </button>
  </aside>
);

export const StandMap = ({
  day,
  selectedCompany,
  onSelect,
}: {
  day: StandMapDay;
  selectedCompany?: string;
  onSelect: (companySlug?: string) => void;
}): JSX.Element => {
  const [search, setSearch] = useState('');
  const [hoveredCompany, setHoveredCompany] = useState<string>();
  const [focusedCompany, setFocusedCompany] = useState<string>();
  const filteredStands = useMemo(
    () => day.stands.filter((stand) => matchesSearch(stand, search)),
    [day.stands, search]
  );
  const selectedStand = day.stands.find(
    (stand) => stand.companySlug === selectedCompany
  );
  const searchPreviewStand = normaliseSearch(search)
    ? filteredStands[0]
    : undefined;
  const displayedStand = searchPreviewStand || selectedStand;
  const activeCompany =
    searchPreviewStand?.companySlug ||
    hoveredCompany ||
    focusedCompany ||
    selectedCompany;
  const activeStand = day.stands.find(
    (stand) => stand.companySlug === activeCompany
  );
  const isActive = (stand: StandMapStand): boolean =>
    stand.companySlug === activeStand?.companySlug;
  const interactionProps = (
    stand: StandMapStand
  ): {
    onBlur: () => void;
    onFocus: () => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  } => ({
    onBlur: (): void =>
      setFocusedCompany((current) =>
        current === stand.companySlug ? undefined : current
      ),
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
            if (event.key !== 'Enter' || !searchPreviewStand) return;
            event.preventDefault();
            onSelect(searchPreviewStand.companySlug);
          }}
          placeholder="For eksempel Computas eller 27"
          type="search"
          value={search}
        />
        <p aria-live="polite">
          {filteredStands.length} av {day.stands.length} stands
        </p>
      </div>

      {displayedStand && (
        <StandSummary
          clearLabel={searchPreviewStand ? 'Nullstill søket' : undefined}
          eyebrow={searchPreviewStand ? 'Øverste søkeresultat' : undefined}
          location={day.location}
          onClear={(): void => {
            if (searchPreviewStand) setSearch('');
            else onSelect();
          }}
          stand={displayedStand}
        />
      )}

      <div className="stand-explorer__layout">
        <div>
          <div className="stand-map">
            <img
              alt={`Plantegning med standplasseringer for ${day.label.toLowerCase()}`}
              src={day.mapImage}
            />
            <div
              aria-label={`Standkart for ${day.label}`}
              className="stand-map__markers"
            >
              {day.stands.map((stand) => (
                <button
                  aria-label={`Stand ${stand.number}, ${stand.companyName}`}
                  className="stand-map__marker"
                  data-active={isActive(stand)}
                  data-label-side={stand.position.x > 64 ? 'left' : 'right'}
                  data-selected={stand.companySlug === selectedCompany}
                  data-stand-company={stand.companySlug}
                  key={stand.number}
                  onClick={(): void => onSelect(stand.companySlug)}
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
                <button
                  aria-current={
                    stand.companySlug === selectedCompany ? 'true' : undefined
                  }
                  data-active={isActive(stand)}
                  data-selected={stand.companySlug === selectedCompany}
                  data-stand-company={stand.companySlug}
                  onClick={(): void => onSelect(stand.companySlug)}
                  {...interactionProps(stand)}
                  type="button"
                >
                  <span>{stand.number}</span>
                  <strong>{stand.companyName}</strong>
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
                data-selected={stand.companySlug === selectedCompany}
                key={stand.number}
              >
                <td>{stand.number}</td>
                <td>
                  <button
                    aria-current={
                      stand.companySlug === selectedCompany ? 'true' : undefined
                    }
                    className="stand-table__company"
                    data-active={isActive(stand)}
                    data-selected={stand.companySlug === selectedCompany}
                    data-stand-company={stand.companySlug}
                    onClick={(): void => onSelect(stand.companySlug)}
                    {...interactionProps(stand)}
                    type="button"
                  >
                    {stand.companyName}
                  </button>
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

import React, { useMemo, useState } from 'react';
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
  stand,
  onClear,
}: {
  stand: StandMapStand;
  onClear: () => void;
}): JSX.Element => (
  <aside aria-live="polite" className="stand-selection">
    <div>
      <p className="site-eyebrow">Valgt stand</p>
      <h2>{stand.companyName}</h2>
      <p>Stand {stand.number} i Realfagbygget U1.</p>
    </div>
    <button className="stand-selection__clear" onClick={onClear} type="button">
      Fjern valg
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
  const filteredStands = useMemo(
    () => day.stands.filter((stand) => matchesSearch(stand, search)),
    [day.stands, search]
  );
  const selectedStand = day.stands.find(
    (stand) => stand.companySlug === selectedCompany
  );

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
          placeholder="For eksempel Computas eller 27"
          type="search"
          value={search}
        />
        <p aria-live="polite">
          {filteredStands.length} av {day.stands.length} stands
        </p>
      </div>

      {selectedStand && (
        <StandSummary onClear={(): void => onSelect()} stand={selectedStand} />
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
                  data-selected={stand.companySlug === selectedCompany}
                  key={stand.number}
                  onClick={(): void => onSelect(stand.companySlug)}
                  style={{
                    left: `${stand.position.x}%`,
                    top: `${stand.position.y}%`,
                  }}
                  type="button"
                >
                  {stand.number}
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
                  data-selected={stand.companySlug === selectedCompany}
                  onClick={(): void => onSelect(stand.companySlug)}
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
              <tr key={stand.number}>
                <td>{stand.number}</td>
                <td>{stand.companyName}</td>
                <td>{day.label}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
};

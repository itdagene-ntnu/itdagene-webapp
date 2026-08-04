import React from 'react';
import { ActionLink, SiteSection } from '../DesignSystem';
import { CompanyLogo, CompanyLogoData } from '../DesignSystem/CompanyLogo';

export type DirectoryCompany = CompanyLogoData & {
  readonly id: string;
};

const norwegianSortKey = (value: string): string =>
  value
    .trim()
    .toLocaleLowerCase('nb-NO')
    .replace(/æ/g, '{a')
    .replace(/ø/g, '{b')
    .replace(/å/g, '{c')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export const sortDirectoryCompanies = (
  companies: ReadonlyArray<DirectoryCompany>
): DirectoryCompany[] =>
  [...companies].sort((left, right) => {
    const leftKey = norwegianSortKey(left.name);
    const rightKey = norwegianSortKey(right.name);

    if (leftKey < rightKey) return -1;
    if (leftKey > rightKey) return 1;
    return left.id < right.id ? -1 : left.id > right.id ? 1 : 0;
  });

const weekdays = [
  'Søndag',
  'Mandag',
  'Tirsdag',
  'Onsdag',
  'Torsdag',
  'Fredag',
  'Lørdag',
];

const months = [
  'januar',
  'februar',
  'mars',
  'april',
  'mai',
  'juni',
  'juli',
  'august',
  'september',
  'oktober',
  'november',
  'desember',
];

export const formatCompanyDay = (isoDate: string, fallback: string): string => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) return fallback;

  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, monthIndex, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== monthIndex ||
    date.getUTCDate() !== day
  ) {
    return fallback;
  }

  return `${weekdays[date.getUTCDay()]} ${day}. ${months[monthIndex]}`;
};

const CompanyDay = ({
  companies,
  date,
  fallbackLabel,
  id,
  mobileActive,
}: {
  companies: ReadonlyArray<DirectoryCompany> | null;
  date: string;
  fallbackLabel: string;
  id: string;
  mobileActive: boolean;
}): JSX.Element => {
  const headingId = `company-day-${id}`;
  const sortedCompanies =
    companies === null ? null : sortDirectoryCompanies(companies);
  const count = sortedCompanies?.length || 0;

  return (
    <section
      aria-labelledby={headingId}
      className="current-company-directory__day"
      data-company-day={id}
      data-mobile-active={mobileActive}
      data-company-state={
        companies === null ? 'unpublished' : count === 0 ? 'empty' : 'published'
      }
    >
      <header className="current-company-directory__day-heading">
        <h3 id={headingId}>{formatCompanyDay(date, fallbackLabel)}</h3>
        {sortedCompanies && count > 0 && (
          <p>
            {count} {count === 1 ? 'bedrift' : 'bedrifter'}
          </p>
        )}
      </header>

      {companies === null ? (
        <p className="current-company-directory__state">Publiseres senere</p>
      ) : count === 0 ? (
        <p className="current-company-directory__state">
          Ingen bedrifter er publisert for denne dagen ennå.
        </p>
      ) : (
        <ul className="current-company-directory__grid">
          {sortedCompanies?.map((company) => (
            <li data-company-id={company.id} key={company.id}>
              <CompanyLogo
                className="current-company-directory__logo"
                company={company}
                fallbackClassName="current-company-directory__name"
                height={120}
                imageClassName="current-company-directory__image"
                width={320}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export const CurrentCompanyDirectory = ({
  edition,
  endDate,
  firstDay,
  lastDay,
  mobileActiveDay = 'first',
  startDate,
}: {
  edition: number;
  endDate: string;
  firstDay: ReadonlyArray<DirectoryCompany> | null;
  lastDay: ReadonlyArray<DirectoryCompany> | null;
  mobileActiveDay?: 'first' | 'last';
  startDate: string;
}): JSX.Element | null => {
  if (firstDay === null && lastDay === null) return null;

  return (
    <SiteSection className="current-company-directory">
      <div className="current-company-directory__heading">
        <h2>Bedrifter på itDAGENE {edition}</h2>
        <ActionLink href="/stands" variant="text">
          Finn bedrift og stand
        </ActionLink>
      </div>

      <div className="current-company-directory__days">
        <CompanyDay
          companies={firstDay}
          date={startDate}
          fallbackLabel="Første messedag"
          id="first"
          mobileActive={mobileActiveDay === 'first'}
        />
        <CompanyDay
          companies={lastDay}
          date={endDate}
          fallbackLabel="Andre messedag"
          id="last"
          mobileActive={mobileActiveDay === 'last'}
        />
      </div>
    </SiteSection>
  );
};

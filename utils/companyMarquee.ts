import { historicalCompanyArchive } from '../config/companyArchive';

export type CompanyMarqueeItem = {
  id: string;
  name: string;
  logo?: string | null;
};

type CompanyMarqueeInput = {
  id?: string | null;
  name?: string | null;
  logo?: string | null;
};

const COMPANY_SUFFIXES = new Set([
  'ab',
  'as',
  'asa',
  'hf',
  'inc',
  'ltd',
  'llc',
  'oy',
  'plc',
]);

export const normalizeCompanyIdentity = (name: string): string => {
  const words = name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('nb-NO')
    .replace(/[^a-z0-9æøå]+/g, ' ')
    .trim()
    .split(/\s+/);

  while (
    words.length > 1 &&
    COMPANY_SUFFIXES.has(words[words.length - 1] || '')
  ) {
    words.pop();
  }

  return words.join(' ');
};

const uniqueCompanies = (
  companies: ReadonlyArray<CompanyMarqueeInput>
): CompanyMarqueeItem[] => {
  const unique = new Map<string, CompanyMarqueeItem>();

  companies.forEach((company) => {
    const name = company.name?.trim();
    if (!name) return;

    const key = normalizeCompanyIdentity(name);
    const existing = unique.get(key);
    const next = {
      id: company.id || `company-${key.replace(/[^a-z0-9]+/g, '-')}`,
      logo: company.logo || null,
      name,
    };

    if (!existing || (!existing.logo && next.logo)) {
      unique.set(key, next);
    }
  });

  return Array.from(unique.values());
};

export const resolveHistoricalCompanyMarquee = ({
  excludedCompanyNames = [],
}: {
  excludedCompanyNames?: ReadonlyArray<string | null | undefined>;
}): {
  items: CompanyMarqueeItem[];
  edition: number;
  label: string;
  historical: boolean;
} => {
  const excludedNames = new Set(
    excludedCompanyNames
      .map((name) => (name ? normalizeCompanyIdentity(name) : ''))
      .filter((name): name is string => Boolean(name))
  );
  const withoutPartnerTiers = (
    companies: ReadonlyArray<CompanyMarqueeItem>
  ): CompanyMarqueeItem[] =>
    companies.filter(
      (company) => !excludedNames.has(normalizeCompanyIdentity(company.name))
    );

  const historicalItems = withoutPartnerTiers(
    uniqueCompanies(
      historicalCompanyArchive.companies.map((company) => ({
        ...company,
        id: `archive-${company.name}`,
      }))
    )
  );

  return {
    items: historicalItems,
    edition: historicalCompanyArchive.edition,
    label: 'Tidligere bedrifter',
    historical: true,
  };
};

export const splitCompanyMarqueeLanes = (
  items: ReadonlyArray<CompanyMarqueeItem>
): CompanyMarqueeItem[][] => {
  const firstLane = items.filter((_, index) => index % 2 === 0);
  const secondLane = items.filter((_, index) => index % 2 === 1);

  if (secondLane.length === 0) {
    return [firstLane, [...firstLane].reverse()];
  }

  return [firstLane, secondLane];
};

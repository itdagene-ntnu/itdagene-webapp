import { standMapManifest } from '../components/Stands/standsData';

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

const uniqueCompanies = (
  companies: ReadonlyArray<CompanyMarqueeInput>
): CompanyMarqueeItem[] => {
  const unique = new Map<string, CompanyMarqueeItem>();

  companies.forEach((company) => {
    const name = company.name?.trim();
    if (!name) return;

    const key = name.toLocaleLowerCase();
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

export const resolveCompanyMarquee = ({
  currentCompanies,
  currentEdition,
  excludedCompanyNames = [],
}: {
  currentCompanies: ReadonlyArray<CompanyMarqueeInput> | null;
  currentEdition: number;
  excludedCompanyNames?: ReadonlyArray<string | null | undefined>;
}): {
  items: CompanyMarqueeItem[];
  label: string;
  historical: boolean;
} | null => {
  if (currentCompanies === null) {
    return null;
  }

  const excludedNames = new Set(
    excludedCompanyNames
      .map((name) => name?.trim().toLocaleLowerCase())
      .filter((name): name is string => Boolean(name))
  );
  const withoutPartnerTiers = (
    companies: ReadonlyArray<CompanyMarqueeItem>
  ): CompanyMarqueeItem[] =>
    companies.filter(
      (company) => !excludedNames.has(company.name.toLocaleLowerCase())
    );
  const currentItems = withoutPartnerTiers(uniqueCompanies(currentCompanies));

  if (currentItems.length > 0) {
    return {
      items: currentItems,
      label: `Bedrifter på itDAGENE ${currentEdition}`,
      historical: false,
    };
  }

  const historicalItems = withoutPartnerTiers(
    uniqueCompanies(
      standMapManifest.days.flatMap((day) =>
        day.stands.map((stand) => ({
          id: `archive-${stand.companySlug}`,
          logo: null,
          name: stand.companyName,
        }))
      )
    )
  );

  return {
    items: historicalItems,
    label: `Bedrifter fra itDAGENE ${standMapManifest.edition}`,
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

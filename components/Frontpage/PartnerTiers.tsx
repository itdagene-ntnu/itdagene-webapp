import React from 'react';
import { SiteContainer, SiteSection } from '../DesignSystem';

export type HomepagePartner = {
  readonly id: string;
  readonly name: string;
  readonly logo?: string | null;
  readonly url?: string | null;
  readonly description?: string | null;
};

const firstUsefulParagraph = (value?: string | null): string | undefined => {
  const paragraph = value
    ?.split(/\n\s*\n/)[0]
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_#>`]/g, '')
    .trim();
  return paragraph || undefined;
};

const PartnerLogo = ({
  partner,
  primary = false,
}: {
  partner: HomepagePartner;
  primary?: boolean;
}): JSX.Element => {
  const content = partner.logo ? (
    <img
      alt={`${partner.name} logo`}
      height={primary ? 220 : 120}
      loading={primary ? 'eager' : 'lazy'}
      src={partner.logo}
      width={primary ? 680 : 320}
    />
  ) : (
    <span>{partner.name}</span>
  );

  return partner.url ? (
    <a href={partner.url} rel="noreferrer" target="_blank">
      {content}
    </a>
  ) : (
    <div>{content}</div>
  );
};

export const PrimaryPartnerTier = ({
  partner,
}: {
  partner?: HomepagePartner | null;
}): JSX.Element | null => {
  if (!partner) return null;
  const description = firstUsefulParagraph(partner.description);

  return (
    <section
      aria-labelledby="primary-partner-heading"
      className="primary-partner-tier"
      data-partner-tier="primary"
    >
      <SiteContainer>
        <div className="primary-partner-tier__layout">
          <div className="primary-partner-tier__intro">
            <p>Hovedsamarbeidspartner</p>
            <h2 id="primary-partner-heading">I samarbeid med {partner.name}</h2>
            {description && <p>{description}</p>}
          </div>
          <div className="primary-partner-tier__logo">
            <PartnerLogo partner={partner} primary />
          </div>
        </div>
      </SiteContainer>
    </section>
  );
};

export const AssociatePartnerTier = ({
  partners,
}: {
  partners: ReadonlyArray<HomepagePartner>;
}): JSX.Element | null => {
  if (partners.length === 0) return null;

  return (
    <SiteSection className="associate-partner-tier" tone="warm">
      <div className="associate-partner-tier__heading">
        <h2>Samarbeidspartnere</h2>
        <p>Bedrifter med en egen samarbeidsavtale med itDAGENE.</p>
      </div>
      <ul data-partner-tier="associate">
        {partners.map((partner) => (
          <li key={partner.id}>
            <PartnerLogo partner={partner} />
          </li>
        ))}
      </ul>
    </SiteSection>
  );
};

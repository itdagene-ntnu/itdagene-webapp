import React from 'react';
import ReactMarkdown from 'react-markdown';
import { SiteContainer } from '../DesignSystem';
import { CompanyLogo } from '../DesignSystem/CompanyLogo';
import { SmoothDisclosure } from '../DesignSystem/SmoothDisclosure';

export type HomepagePartner = {
  readonly id: string;
  readonly name: string;
  readonly logo?: string | null;
  readonly url?: string | null;
  readonly description?: string | null;
};

export type HomepageMainPartner = HomepagePartner & {
  readonly intro?: string | null;
  readonly video?: string | null;
  readonly poster?: string | null;
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
}): JSX.Element => (
  <CompanyLogo
    className="partner-showcase__logo"
    company={partner}
    fallbackClassName="partner-showcase__logo-name"
    height={primary ? 220 : 120}
    imageClassName="partner-showcase__logo-image"
    loading={primary ? 'eager' : 'lazy'}
    width={primary ? 680 : 320}
  />
);

const PrimaryPartnerTier = ({
  partner,
}: {
  partner: HomepageMainPartner;
}): JSX.Element => {
  const fallbackDescription = firstUsefulParagraph(partner.description);
  const introduction = partner.intro?.trim();

  return (
    <div className="partner-showcase__primary" data-partner-tier="primary">
      <div className="partner-showcase__primary-layout">
        <div className="partner-showcase__primary-copy">
          <p className="partner-showcase__label">Hovedsamarbeidspartner</p>
          <h2>I samarbeid med {partner.name}</h2>
          {introduction ? (
            <div className="partner-showcase__introduction">
              <ReactMarkdown source={introduction} />
            </div>
          ) : (
            fallbackDescription && <p>{fallbackDescription}</p>
          )}
        </div>
        <div className="partner-showcase__primary-logo">
          <PartnerLogo partner={partner} primary />
        </div>
      </div>
      {partner.video && (
        <div className="partner-showcase__video">
          <video
            aria-label={`Videopresentasjon fra ${partner.name}`}
            controls
            playsInline
            poster={partner.poster || partner.logo || undefined}
            preload="metadata"
            src={partner.video}
          />
        </div>
      )}
    </div>
  );
};

const PartnerDescriptionDisclosure = ({
  partner,
}: {
  partner: HomepagePartner;
}): JSX.Element | null => {
  const description = partner.description?.trim();
  if (!description) return null;
  const contentId = `partner-description-${partner.id.replace(
    /[^a-zA-Z0-9_-]/g,
    '-'
  )}`;

  return (
    <SmoothDisclosure
      className="partner-showcase__associate-disclosure"
      contentClassName="partner-showcase__associate-copy"
      contentId={contentId}
      summary={
        <>
          Les mer
          <span className="visually-hidden"> om {partner.name}</span>
        </>
      }
    >
      <ReactMarkdown source={description} />
    </SmoothDisclosure>
  );
};

const AssociatePartnerTier = ({
  partners,
}: {
  partners: ReadonlyArray<HomepagePartner>;
}): JSX.Element => (
  <div className="partner-showcase__associates" data-partner-tier="associate">
    <div className="partner-showcase__associate-heading">
      <h2 className="partner-showcase__label">Samarbeidspartnere</h2>
    </div>
    <ul>
      {partners.map((partner) => (
        <li key={partner.id}>
          <article className="partner-showcase__associate">
            <div className="partner-showcase__associate-logo">
              <PartnerLogo partner={partner} />
            </div>
            <PartnerDescriptionDisclosure partner={partner} />
          </article>
        </li>
      ))}
    </ul>
  </div>
);

export const PartnerShowcase = ({
  mainPartner,
  partners,
}: {
  mainPartner?: HomepageMainPartner | null;
  partners: ReadonlyArray<HomepagePartner>;
}): JSX.Element | null => {
  if (!mainPartner && partners.length === 0) return null;

  return (
    <section
      aria-label="Samarbeidspartnere"
      className={`partner-showcase${
        mainPartner ? '' : ' partner-showcase--associates-only'
      }`}
      data-partner-showcase="true"
    >
      <SiteContainer>
        {mainPartner && <PrimaryPartnerTier partner={mainPartner} />}
        {partners.length > 0 && <AssociatePartnerTier partners={partners} />}
      </SiteContainer>
    </section>
  );
};

import Image from 'next/image';
import React from 'react';
import { homepageMedia } from '../../config/homepage';
import { ActionLink, SiteSection } from '../DesignSystem';

export const EmployerInvitation = ({
  edition,
}: {
  edition: number;
}): JSX.Element => (
  <SiteSection className="employer-invitation" id="for-bedrifter" tone="brand">
    <div className="employer-invitation__layout">
      <div className="employer-invitation__copy">
        <p className="employer-invitation__label">
          For bedrifter, itDAGENE {edition}
        </p>
        <h2>Vil bedriften deres delta på itDAGENE {edition}?</h2>
        <p>
          Vis frem fagmiljøet deres, bli kjent med studentene og fortell om
          aktuelle jobb- og sommerjobbmuligheter.
        </p>
        <div className="employer-invitation__actions">
          <ActionLink href="/faq">Les om deltakelse</ActionLink>
          <ActionLink href="mailto:styret@itdagene.no" variant="secondary">
            Kontakt bedriftsteamet
          </ActionLink>
        </div>
        <p className="employer-invitation__note">
          Interessepåmelding er ikke bindende.
        </p>
      </div>
      <figure className="employer-invitation__figure">
        <div className="employer-invitation__media">
          <Image
            alt={homepageMedia.employer.alt}
            fill
            sizes="(max-width: 800px) 100vw, 48vw"
            src={homepageMedia.employer.src}
            style={{ objectPosition: homepageMedia.employer.focalPoint }}
          />
        </div>
        <figcaption>{homepageMedia.employer.label}</figcaption>
      </figure>
    </div>
  </SiteSection>
);

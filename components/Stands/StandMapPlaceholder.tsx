import React from 'react';
import { ContentStatePanel } from '../DesignSystem';

export const StandMapPlaceholder = ({
  edition,
  compact = false,
  linkToStatus = false,
}: {
  edition: number;
  compact?: boolean;
  linkToStatus?: boolean;
}): JSX.Element => (
  <ContentStatePanel
    action={
      linkToStatus
        ? { href: '/stands', label: 'Se status for standkartet' }
        : undefined
    }
    compact={compact}
    description="Kartet legges ut så snart årets standplasseringer er bekreftet."
    state="unpublished"
    title={`Standkartet for ${edition} er ikke publisert ennå.`}
  />
);

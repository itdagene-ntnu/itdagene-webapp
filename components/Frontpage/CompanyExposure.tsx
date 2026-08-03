import React from 'react';
import { EventMarquee } from '../DesignSystem';
import { CompanyMarqueeItem } from '../../utils/companyMarquee';
import {
  CurrentCompanyDirectory,
  DirectoryCompany,
} from './CurrentCompanyDirectory';

export type CompanyExposureMode = 'current' | 'historical';

export const resolveCompanyExposureMode = ({
  firstDay,
  lastDay,
}: {
  firstDay: ReadonlyArray<DirectoryCompany> | null;
  lastDay: ReadonlyArray<DirectoryCompany> | null;
}): CompanyExposureMode =>
  firstDay === null && lastDay === null ? 'historical' : 'current';

export const CompanyExposure = ({
  edition,
  endDate,
  firstDay,
  historicalEdition,
  historicalItems,
  historicalLabel,
  lastDay,
  startDate,
}: {
  edition: number;
  endDate: string;
  firstDay: ReadonlyArray<DirectoryCompany> | null;
  historicalEdition: number;
  historicalItems: CompanyMarqueeItem[];
  historicalLabel: string;
  lastDay: ReadonlyArray<DirectoryCompany> | null;
  startDate: string;
}): JSX.Element => {
  const mode = resolveCompanyExposureMode({ firstDay, lastDay });

  return (
    <div
      className={`company-exposure company-exposure--${mode}`}
      data-company-exposure={mode}
    >
      {mode === 'historical' ? (
        <EventMarquee
          context={`itDAGENE ${historicalEdition}`}
          items={historicalItems}
          label={historicalLabel}
        />
      ) : (
        <CurrentCompanyDirectory
          edition={edition}
          endDate={endDate}
          firstDay={firstDay}
          lastDay={lastDay}
          startDate={startDate}
        />
      )}
    </div>
  );
};

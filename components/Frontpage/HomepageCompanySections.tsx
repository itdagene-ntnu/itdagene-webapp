import React, { useEffect, useRef, useState } from 'react';
import { SegmentedControl, SiteContainer } from '../DesignSystem';
import { CompanyMarqueeItem } from '../../utils/companyMarquee';
import { CompanyExposure, resolveCompanyExposureMode } from './CompanyExposure';
import { DirectoryCompany, formatCompanyDay } from './CurrentCompanyDirectory';
import {
  HomepageMainPartner,
  HomepagePartner,
  PartnerShowcase,
} from './PartnerTiers';

type MobileCompanySection = 'partners' | 'first' | 'last';

export const HomepageCompanySections = ({
  edition,
  endDate,
  firstDay,
  historicalEdition,
  historicalItems,
  historicalLabel,
  lastDay,
  mainPartner,
  partners,
  startDate,
}: {
  edition: number;
  endDate: string;
  firstDay: ReadonlyArray<DirectoryCompany> | null;
  historicalEdition: number;
  historicalItems: CompanyMarqueeItem[];
  historicalLabel: string;
  lastDay: ReadonlyArray<DirectoryCompany> | null;
  mainPartner?: HomepageMainPartner | null;
  partners: ReadonlyArray<HomepagePartner>;
  startDate: string;
}): JSX.Element => {
  const hasPartners = Boolean(mainPartner) || partners.length > 0;
  const mode = resolveCompanyExposureMode({ firstDay, lastDay });
  const initialSection: MobileCompanySection = hasPartners
    ? 'partners'
    : firstDay === null && lastDay !== null
    ? 'last'
    : 'first';
  const [selectedSection, setSelectedSection] =
    useState<MobileCompanySection>(initialSection);
  const previousFirstDay = useRef(firstDay);
  const previousLastDay = useRef(lastDay);
  const fallbackDay: MobileCompanySection =
    firstDay === null && lastDay !== null ? 'last' : 'first';
  const removedSelectedDay: MobileCompanySection | undefined =
    selectedSection === 'first' &&
    previousFirstDay.current !== null &&
    firstDay === null &&
    lastDay !== null
      ? 'last'
      : selectedSection === 'last' &&
        previousLastDay.current !== null &&
        lastDay === null &&
        firstDay !== null
      ? 'first'
      : undefined;
  const activeSection = removedSelectedDay
    ? removedSelectedDay
    : selectedSection === 'partners' && !hasPartners
    ? fallbackDay
    : selectedSection;

  useEffect(() => {
    previousFirstDay.current = firstDay;
    previousLastDay.current = lastDay;
    if (activeSection !== selectedSection) {
      setSelectedSection(activeSection);
    }
  }, [activeSection, firstDay, lastDay, selectedSection]);
  const showMobileSelector = mode === 'current';
  const options = [
    ...(hasPartners
      ? [
          {
            value: 'partners',
            label: 'Samarbeidspartnere',
            controls: 'homepage-company-partners',
          },
        ]
      : []),
    {
      value: 'first',
      label: formatCompanyDay(startDate, 'Første dag').split(' ')[0],
      controls: 'homepage-company-directory',
    },
    {
      value: 'last',
      label: formatCompanyDay(endDate, 'Andre dag').split(' ')[0],
      controls: 'homepage-company-directory',
    },
  ];

  return (
    <div
      className="homepage-company-sections"
      data-company-mobile-section={activeSection}
    >
      {showMobileSelector && (
        <div className="homepage-company-sections__switcher">
          <SiteContainer>
            <SegmentedControl
              activeValue={activeSection}
              label="Velg bedriftsoversikt"
              onChange={(value): void =>
                setSelectedSection(value as MobileCompanySection)
              }
              options={options}
            />
          </SiteContainer>
        </div>
      )}

      {hasPartners && (
        <div
          data-company-mobile-panel="partners"
          data-mobile-active={activeSection === 'partners'}
          id="homepage-company-partners"
        >
          <PartnerShowcase mainPartner={mainPartner} partners={partners} />
        </div>
      )}

      <div
        data-company-mobile-panel="directory"
        data-mobile-active={
          mode === 'historical' || activeSection !== 'partners'
        }
        id="homepage-company-directory"
      >
        <CompanyExposure
          edition={edition}
          endDate={endDate}
          firstDay={firstDay}
          historicalItems={historicalItems}
          historicalEdition={historicalEdition}
          historicalLabel={historicalLabel}
          lastDay={lastDay}
          mobileActiveDay={activeSection === 'last' ? 'last' : 'first'}
          startDate={startDate}
        />
      </div>
    </div>
  );
};

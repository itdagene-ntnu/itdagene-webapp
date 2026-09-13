import {
  StandMapManifest,
  StandMapStand,
  toCollaboratorTier,
} from '../components/Stands/standsData';

export type PublishedStandMap = {
  readonly edition: number;
  readonly revision: number;
  readonly maps: ReadonlyArray<{
    readonly backgroundImage: string;
    readonly date: string;
    readonly label: string;
    readonly location: string;
    readonly placements: ReadonlyArray<{
      readonly collaboratorTier?: string | null;
      readonly companyName: string;
      readonly companySlug: string;
      readonly standNumber: string;
      readonly xPercent: number;
      readonly yPercent: number;
    }>;
  }>;
};

const standNumberCollator = new Intl.Collator('nb', {
  numeric: true,
  sensitivity: 'base',
});

const toStand = (
  placement: PublishedStandMap['maps'][number]['placements'][number]
): StandMapStand => {
  const collaboratorTier = toCollaboratorTier(placement.collaboratorTier);
  return {
    number: placement.standNumber,
    companyName: placement.companyName,
    companySlug: placement.companySlug,
    // Kept off the object entirely for a regular company so the manifest stays
    // comparable with the maps published before partner tiers existed.
    ...(collaboratorTier ? { collaboratorTier } : {}),
    position: {
      x: placement.xPercent,
      y: placement.yPercent,
    },
  };
};

export const toStandMapManifest = (
  release?: PublishedStandMap | null
): StandMapManifest | null => {
  if (!release || release.maps.length === 0) return null;

  const days = [...release.maps]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((standMap) => ({
      id: standMap.date,
      label: standMap.label || standMap.date,
      location: standMap.location,
      mapImage: standMap.backgroundImage,
      downloadImage: standMap.backgroundImage,
      stands: [...standMap.placements]
        .sort((a, b) =>
          standNumberCollator.compare(a.standNumber, b.standNumber)
        )
        .map(toStand),
    }));

  return {
    edition: release.edition,
    location: days[0].location,
    days,
  };
};

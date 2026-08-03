export type StandMapDayId = string;

export type StandMapStand = {
  number: number | string;
  companyName: string;
  companySlug: string;
  position: {
    x: number;
    y: number;
  };
};

export type StandMapDay = {
  id: StandMapDayId;
  label: string;
  location: string;
  mapImage: string;
  downloadImage: string;
  stands: StandMapStand[];
};

export type StandMapManifest = {
  edition: number;
  location: string;
  days: StandMapDay[];
};

export const validateStandMapManifest = (
  manifest: StandMapManifest
): string[] =>
  manifest.days.flatMap((day) => {
    const standNumbers = new Set<string>();
    return day.stands.flatMap((stand) => {
      const errors: string[] = [];
      const standNumber = String(stand.number);
      if (standNumbers.has(standNumber)) {
        errors.push(`${day.id}: stand ${stand.number} er duplisert`);
      }
      standNumbers.add(standNumber);
      if (
        stand.position.x < 0 ||
        stand.position.x > 100 ||
        stand.position.y < 0 ||
        stand.position.y > 100
      ) {
        errors.push(
          `${day.id}: stand ${stand.number} er plassert utenfor kartet`
        );
      }
      return errors;
    });
  });

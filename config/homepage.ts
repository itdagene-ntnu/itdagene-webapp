export type HomepageMediaItem = {
  src: string;
  alt: string;
  label: string;
  focalPoint?: string;
};

export const homepageMedia: {
  hero: HomepageMediaItem;
  employer: HomepageMediaItem;
  documentary: HomepageMediaItem[];
} = {
  hero: {
    src: 'https://itdagene.no/uploads/gallery/IMG_1877.JPG',
    alt: 'Studenter besøker bedriftsstands i Realfagbygget',
    label: 'Studenter i standområdet under itDAGENE 2025',
    focalPoint: '58% center',
  },
  employer: {
    src: 'https://itdagene.no/uploads/gallery/IMG_5296.JPG',
    alt: 'Studenter og bedriftsrepresentanter møtes mellom stands',
    label: 'Møter mellom stands under itDAGENE 2025',
    focalPoint: '60% center',
  },
  documentary: [
    {
      src: 'https://itdagene.no/uploads/gallery/DSC00947.JPG',
      alt: 'Studenter samles under et ballongslipp i Realfagbygget',
      label: 'Ballongslipp i Realfagbygget',
      focalPoint: '50% 55%',
    },
    {
      src: 'https://itdagene.no/uploads/gallery/IMG_5305.JPG',
      alt: 'En bedrift presenterer sommerjobbmuligheter i et auditorium',
      label: 'Sommerjobbmaraton',
      focalPoint: '58% center',
    },
    {
      src: 'https://itdagene.no/uploads/gallery/IMG_1933.JPG',
      alt: 'Studenter snakker med representanter ved en stand',
      label: 'Samtaler i standområdet',
      focalPoint: '56% 48%',
    },
    {
      src: 'https://itdagene.no/uploads/gallery/IMG_1992.JPG',
      alt: 'Studenter og bedrifter samlet under afterwork',
      label: 'Afterwork',
      focalPoint: '50% 58%',
    },
  ],
};

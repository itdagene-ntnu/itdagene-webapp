export interface Company {
  id: string;
  name: string;
  url: string;
  logo: string;
  description: string;
}

interface StandEvent {
  id: string;
  title: string;
  date: Date;
  timeStart: string;
  timeEnd: string;
  description: string;
  // type: EventType;
  // location: string;
  company: Company;
  // usesTickets: boolean;
  // maxParticipants: number;
}

interface DigitalStand {
  livestreamUrl: string;
  qaUrl: string;
  chatUrl: string;
  active: boolean;
  company: Company;
  description: string;
  id: string;
  // events: StandEvent[];
}

const stands: DigitalStand[] = [
  {
    livestreamUrl: 'asdf',
    qaUrl: 'asdf',
    chatUrl: 'asdf',
    active: true,
    company: {
      id: 'Q29tcGFueToxMDM3',
      name: 'Bouvet Norge AS',
      url: 'http://www.bouvet.no/',
      logo:
        'https://itdagene.no/uploads/company_logos/f7hnfiavgzssocceemtb.png',
      description:
        'Bouvet er et Skandinavisk konsulentselskap som leverer utviklings- og rådgivningstjenester innen informasjons-teknologi. Våre styrker er bred kompetanse, lang erfaring og evner til kreativ problemløsning.\r\nBouvet skaper muligheter og effektiviserer forretningsprosesser i tett samarbeid med kunden ved hjelp av nye idéer og ny teknologi. Bouvet har vel 700 ansatte og virksomhet ved 8 kontorer i Norge og 3 i Sverige. Bouvet er notert på Oslo Børs.',
    },
    description: 'Vi er Bouvet på itDAGENE 2020',
    id: '1234512345',
  },
  {
    livestreamUrl: 'asdf',
    qaUrl: 'asdf',
    chatUrl: 'asdf',
    active: true,
    company: {
      id: 'Q29tcGFueToxMDM3',
      url: 'http://www.bouvet.no/',
      name: 'Capgemini',
      logo:
        'https://itdagene.no/uploads/company_logos/Capgemini_Logo_2COL_CMYK_002.JPG',
      description:
        'Bouvet er et Skandinavisk konsulentselskap som leverer utviklings- og rådgivningstjenester innen informasjons-teknologi. Våre styrker er bred kompetanse, lang erfaring og evner til kreativ problemløsning.\r\nBouvet skaper muligheter og effektiviserer forretningsprosesser i tett samarbeid med kunden ved hjelp av nye idéer og ny teknologi. Bouvet har vel 700 ansatte og virksomhet ved 8 kontorer i Norge og 3 i Sverige. Bouvet er notert på Oslo Børs.',
    },
    description: 'Vi er Bouvet på itDAGENE 2020',
    id: '1234512345',
  },
  {
    livestreamUrl: 'asdf',
    qaUrl: 'asdf',
    chatUrl: 'asdf',
    active: true,
    company: {
      id: 'Q29tcGFueToxMDM3',
      url: 'http://www.bouvet.no/',
      name: 'Equinor',
      logo:
        'https://itdagene.no/uploads/company_logos/Equinor_HORIZ_logo_RGB_RED.png',
      description:
        'Bouvet er et Skandinavisk konsulentselskap som leverer utviklings- og rådgivningstjenester innen informasjons-teknologi. Våre styrker er bred kompetanse, lang erfaring og evner til kreativ problemløsning.\r\nBouvet skaper muligheter og effektiviserer forretningsprosesser i tett samarbeid med kunden ved hjelp av nye idéer og ny teknologi. Bouvet har vel 700 ansatte og virksomhet ved 8 kontorer i Norge og 3 i Sverige. Bouvet er notert på Oslo Børs.',
    },
    description: 'Vi er Bouvet på itDAGENE 2020',
    id: '1234512345',
  },
  {
    livestreamUrl: 'asdf',
    qaUrl: 'asdf',
    chatUrl: 'asdf',
    active: false,
    company: {
      id: 'Q29tcGFueToxMDM3',
      name: 'Bouvet Norge AS',
      url: 'http://www.bouvet.no/',
      logo:
        'https://itdagene.no/uploads/company_logos/f7hnfiavgzssocceemtb.png',
      description:
        'Bouvet er et Skandinavisk konsulentselskap som leverer utviklings- og rådgivningstjenester innen informasjons-teknologi. Våre styrker er bred kompetanse, lang erfaring og evner til kreativ problemløsning.\r\nBouvet skaper muligheter og effektiviserer forretningsprosesser i tett samarbeid med kunden ved hjelp av nye idéer og ny teknologi. Bouvet har vel 700 ansatte og virksomhet ved 8 kontorer i Norge og 3 i Sverige. Bouvet er notert på Oslo Børs.',
    },
    description: 'Vi er Bouvet på itDAGENE 2020',
    id: '1234512345',
  },
  {
    livestreamUrl: 'asdf',
    qaUrl: 'asdf',
    chatUrl: 'asdf',
    active: false,
    company: {
      id: 'Q29tcGFueToxMDM3',
      url: 'http://www.bouvet.no/',
      name: 'Capgemini',
      logo:
        'https://itdagene.no/uploads/company_logos/Capgemini_Logo_2COL_CMYK_002.JPG',
      description:
        'Bouvet er et Skandinavisk konsulentselskap som leverer utviklings- og rådgivningstjenester innen informasjons-teknologi. Våre styrker er bred kompetanse, lang erfaring og evner til kreativ problemløsning.\r\nBouvet skaper muligheter og effektiviserer forretningsprosesser i tett samarbeid med kunden ved hjelp av nye idéer og ny teknologi. Bouvet har vel 700 ansatte og virksomhet ved 8 kontorer i Norge og 3 i Sverige. Bouvet er notert på Oslo Børs.',
    },
    description: 'Vi er Bouvet på itDAGENE 2020',
    id: '1234512345',
  },
  {
    livestreamUrl: 'asdf',
    qaUrl: 'asdf',
    chatUrl: 'asdf',
    active: false,
    company: {
      id: 'Q29tcGFueToxMDM3',
      url: 'http://www.bouvet.no/',
      name: 'Equinor',
      logo:
        'https://itdagene.no/uploads/company_logos/Equinor_HORIZ_logo_RGB_RED.png',
      description:
        'Bouvet er et Skandinavisk konsulentselskap som leverer utviklings- og rådgivningstjenester innen informasjons-teknologi. Våre styrker er bred kompetanse, lang erfaring og evner til kreativ problemløsning.\r\nBouvet skaper muligheter og effektiviserer forretningsprosesser i tett samarbeid med kunden ved hjelp av nye idéer og ny teknologi. Bouvet har vel 700 ansatte og virksomhet ved 8 kontorer i Norge og 3 i Sverige. Bouvet er notert på Oslo Børs.',
    },
    description: 'Vi er Bouvet på itDAGENE 2020',
    id: '1234512345',
  },
  {
    livestreamUrl: 'asdf',
    qaUrl: 'asdf',
    chatUrl: 'asdf',
    active: true,
    company: {
      id: 'Q29tcGFueToxMDM3',
      name: 'Bouvet Norge AS',
      url: 'http://www.bouvet.no/',
      logo:
        'https://itdagene.no/uploads/company_logos/f7hnfiavgzssocceemtb.png',
      description:
        'Bouvet er et Skandinavisk konsulentselskap som leverer utviklings- og rådgivningstjenester innen informasjons-teknologi. Våre styrker er bred kompetanse, lang erfaring og evner til kreativ problemløsning.\r\nBouvet skaper muligheter og effektiviserer forretningsprosesser i tett samarbeid med kunden ved hjelp av nye idéer og ny teknologi. Bouvet har vel 700 ansatte og virksomhet ved 8 kontorer i Norge og 3 i Sverige. Bouvet er notert på Oslo Børs.',
    },
    description: 'Vi er Bouvet på itDAGENE 2020',
    id: '1234512345',
  },
  {
    livestreamUrl: 'asdf',
    qaUrl: 'asdf',
    chatUrl: 'asdf',
    active: true,
    company: {
      id: 'Q29tcGFueToxMDM3',
      url: 'http://www.bouvet.no/',
      name: 'Capgemini',
      logo:
        'https://itdagene.no/uploads/company_logos/Capgemini_Logo_2COL_CMYK_002.JPG',
      description:
        'Bouvet er et Skandinavisk konsulentselskap som leverer utviklings- og rådgivningstjenester innen informasjons-teknologi. Våre styrker er bred kompetanse, lang erfaring og evner til kreativ problemløsning.\r\nBouvet skaper muligheter og effektiviserer forretningsprosesser i tett samarbeid med kunden ved hjelp av nye idéer og ny teknologi. Bouvet har vel 700 ansatte og virksomhet ved 8 kontorer i Norge og 3 i Sverige. Bouvet er notert på Oslo Børs.',
    },
    description: 'Vi er Bouvet på itDAGENE 2020',
    id: '1234512345',
  },
  {
    livestreamUrl: 'asdf',
    qaUrl: 'asdf',
    chatUrl: 'asdf',
    active: false,
    company: {
      id: 'Q29tcGFueToxMDM3',
      url: 'http://www.bouvet.no/',
      name: 'Equinor',
      logo:
        'https://itdagene.no/uploads/company_logos/Equinor_HORIZ_logo_RGB_RED.png',
      description:
        'Bouvet er et Skandinavisk konsulentselskap som leverer utviklings- og rådgivningstjenester innen informasjons-teknologi. Våre styrker er bred kompetanse, lang erfaring og evner til kreativ problemløsning.\r\nBouvet skaper muligheter og effektiviserer forretningsprosesser i tett samarbeid med kunden ved hjelp av nye idéer og ny teknologi. Bouvet har vel 700 ansatte og virksomhet ved 8 kontorer i Norge og 3 i Sverige. Bouvet er notert på Oslo Børs.',
    },
    description: 'Vi er Bouvet på itDAGENE 2020',
    id: '1234512345',
  },
];

export default stands;

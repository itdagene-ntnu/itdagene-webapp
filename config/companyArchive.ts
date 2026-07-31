export type ArchivedCompany = {
  name: string;
  logo: string;
};

export type CompanyArchive = {
  edition: number;
  source: string;
  companies: ArchivedCompany[];
};

export const historicalCompanyArchive: CompanyArchive = {
  edition: 2025,
  source: 'https://web.archive.org/web/20250907052909id_/https://itdagene.no/',
  companies: [
    {
      name: 'Bouvet Norge AS',
      logo: 'https://itdagene.no/uploads/cache/81/5c/815c04abbce3b0e1978b9df37ff24bd3.png',
    },
    {
      name: 'Equinor',
      logo: 'https://itdagene.no/uploads/cache/c4/0c/c40c19773de9e8da2e7d960dc211e638.png',
    },
    {
      name: 'Netcompany',
      logo: 'https://itdagene.no/uploads/cache/48/ea/48eaef72c57470c242ffd490e766ea84.png',
    },
    {
      name: 'Computas AS',
      logo: 'https://itdagene.no/uploads/cache/d5/ef/d5ef6c9eb156f7c9f0efc19017dcd508.png',
    },
    {
      name: 'Bekk',
      logo: 'https://itdagene.no/uploads/cache/b7/ac/b7ac6c2c789dc7290927015409aad944.png',
    },
    {
      name: 'Gintel AS',
      logo: 'https://itdagene.no/uploads/cache/87/69/8769cf85eb1a1c78682a72aabdb65841.png',
    },
    {
      name: 'Teledyne FLIR',
      logo: 'https://itdagene.no/uploads/cache/f9/72/f9720cef254910ecee618cc9ece20541.png',
    },
    {
      name: 'Thales Norway AS',
      logo: 'https://itdagene.no/uploads/cache/a2/00/a20028ca0f231e53ced69a60ec385a08.png',
    },
    {
      name: 'Domstoladministrasjonen',
      logo: 'https://itdagene.no/uploads/cache/1a/4b/1a4b629bc17673e16d374931f2521bb6.png',
    },
    {
      name: 'Data Nova AS',
      logo: 'https://itdagene.no/uploads/cache/90/11/90119ee7626958b7ea32797675cf217d.png',
    },
    {
      name: 'Applica Consulting',
      logo: 'https://itdagene.no/uploads/cache/30/40/30404e0e68bf9d6d398cc63d2f93bcaf.png',
    },
    {
      name: 'Knowit Objectnet',
      logo: 'https://itdagene.no/uploads/cache/60/a6/60a620e5a3ce0143ace244c2a93ecb91.png',
    },
    {
      name: 'Geomatikk AS',
      logo: 'https://itdagene.no/uploads/cache/50/0f/500f7b3760d81d5bd1aa9eb9c4f96f63.png',
    },
    {
      name: 'Brønnøysundregistrene',
      logo: 'https://itdagene.no/uploads/cache/c0/27/c02715207cf2e08395012d91edb9f29b.png',
    },
    {
      name: 'Norconsult Digital',
      logo: 'https://itdagene.no/uploads/cache/1a/bd/1abdca8d63a06cb657ad1f6a059a07a2.png',
    },
    {
      name: 'Sykehuspartner',
      logo: 'https://itdagene.no/uploads/cache/cc/5e/cc5e80d36484b76290b3f5c0ebd042f1.png',
    },
    {
      name: 'Skatteetaten',
      logo: 'https://itdagene.no/uploads/cache/20/78/2078bf996a9615dbf03ca5db5a9eb7fd.png',
    },
    {
      name: 'Nova Consulting Group',
      logo: 'https://itdagene.no/uploads/cache/ea/b5/eab568b6d306f4e2ebb400537d05ac64.png',
    },
    {
      name: 'Airthings',
      logo: 'https://itdagene.no/uploads/cache/99/5c/995c1da1526b020518851a33ee3cce6d.png',
    },
    {
      name: 'Fremtind Forsikring',
      logo: 'https://itdagene.no/uploads/cache/33/0b/330b598061a60df15bae65cd52a05ebb.png',
    },
    {
      name: 'Norkart',
      logo: 'https://itdagene.no/uploads/cache/45/6d/456dd5bf9167b6baff34b222e7fae871.png',
    },
    {
      name: 'Statens vegvesen',
      logo: 'https://itdagene.no/uploads/cache/90/98/909836cc84781359c006df7b91e3246a.png',
    },
    {
      name: 'Itera Norge AS',
      logo: 'https://itdagene.no/uploads/cache/eb/b1/ebb1cfa9f4bcc17a12cdbf198a6e6890.png',
    },
    {
      name: 'Elliptic Laboratories ASA',
      logo: 'https://itdagene.no/uploads/cache/44/d9/44d95666e9edbe57997bca605e73926e.png',
    },
    {
      name: 'NAV IT',
      logo: 'https://itdagene.no/uploads/cache/5c/b0/5cb084d370bd9a4e1589339f638d944b.png',
    },
    {
      name: 'Gjensidige',
      logo: 'https://itdagene.no/uploads/cache/cd/48/cd486ecba4d547ef8fba22cb2e596725.png',
    },
    {
      name: 'Pexip',
      logo: 'https://itdagene.no/uploads/cache/e4/bf/e4bf19d18349395f5265e0a91dc46f05.png',
    },
    {
      name: 'Netlight Consulting',
      logo: 'https://itdagene.no/uploads/cache/f1/e1/f1e1a86f7b2588de3dd7cbd2f80cbc90.png',
    },
    {
      name: 'BCG Platinion',
      logo: 'https://itdagene.no/uploads/cache/f7/4d/f74d26c909a5a3bf85810e900cda4aa0.png',
    },
    {
      name: 'Capgemini',
      logo: 'https://itdagene.no/uploads/cache/d3/40/d3407d03321b2149df9bcf12aee132d4.png',
    },
    {
      name: 'Accenture',
      logo: 'https://itdagene.no/uploads/cache/3a/f1/3af1f8171a18b1ac2cb15caed47cd3eb.png',
    },
    {
      name: 'BearingPoint',
      logo: 'https://itdagene.no/uploads/cache/04/19/0419a043923c009cb228be54b0cfca93.png',
    },
    {
      name: 'Kantega AS',
      logo: 'https://itdagene.no/uploads/cache/34/08/340851002ce8628c8a4b447339c62c6a.png',
    },
    {
      name: 'Hemit HF',
      logo: 'https://itdagene.no/uploads/cache/79/19/7919ef5829e4ba0aef987856ad281196.png',
    },
    {
      name: 'Vespa',
      logo: 'https://itdagene.no/uploads/cache/78/8a/788ac49bf3d075cdc0ebf1b587270d5b.png',
    },
    {
      name: 'Å Energi',
      logo: 'https://itdagene.no/uploads/cache/b4/55/b45519c6e6d7d6bfb55a6dbc42fceb24.png',
    },
    {
      name: 'NorgesGruppen',
      logo: 'https://itdagene.no/uploads/cache/1a/17/1a17922c789c97fb6b08555ee6a92914.png',
    },
    {
      name: 'SpareBank 1 Utvikling',
      logo: 'https://itdagene.no/uploads/cache/d3/de/d3de986dd70cdbe474bbf0390c20a67d.png',
    },
    {
      name: 'Forte',
      logo: 'https://itdagene.no/uploads/cache/f4/63/f4633f460dfb623837d1d5a6d79df9da.png',
    },
    {
      name: 'Appfarm AS',
      logo: 'https://itdagene.no/uploads/cache/b1/f5/b1f53d6859e61ad76def6f6805e2a646.png',
    },
    {
      name: 'Norsk Helsenett SF',
      logo: 'https://itdagene.no/uploads/cache/c2/d5/c2d596900aa913fc4befc5d75011291b.png',
    },
    {
      name: 'Mnemonic AS',
      logo: 'https://itdagene.no/uploads/cache/64/fe/64fec62a7acac27d05ab423e976bdeaf.png',
    },
    {
      name: 'Forsvarets Forskningsinstitutt',
      logo: 'https://itdagene.no/uploads/cache/31/76/3176679a1afcfb18695bae15f71f8467.png',
    },
    {
      name: 'Sticos AS',
      logo: 'https://itdagene.no/uploads/cache/97/8c/978c296d9dc2e9e3647548bf91737933.png',
    },
    {
      name: 'DNV',
      logo: 'https://itdagene.no/uploads/cache/73/2e/732efc3f4cc96ddbb3e8204ac94dd536.png',
    },
    {
      name: 'EY',
      logo: 'https://itdagene.no/uploads/cache/94/90/9490091d47bd5e02e108a122b52d4ace.png',
    },
    {
      name: 'Holte Consulting',
      logo: 'https://itdagene.no/uploads/cache/a6/38/a6384e167f14b6328d27423e4403bb85.png',
    },
    {
      name: 'Sopra Steria',
      logo: 'https://itdagene.no/uploads/cache/79/8a/798a08215da60d57abbdd7f18d548977.png',
    },
    {
      name: 'twoday',
      logo: 'https://itdagene.no/uploads/cache/ba/d5/bad5a4c3d61804e9b86d1edc187ac7db.png',
    },
    {
      name: 'Intility',
      logo: 'https://itdagene.no/uploads/cache/b7/cd/b7cd788bd61fffd1ad9c7737d27c4412.png',
    },
    {
      name: 'Frend Digital',
      logo: 'https://itdagene.no/uploads/cache/61/6a/616aff924e0a5d4ffb46b804f73b0429.png',
    },
    {
      name: 'Clave',
      logo: 'https://itdagene.no/uploads/cache/59/3b/593b18f99251488b41a21c4e77ff7c1e.png',
    },
    {
      name: 'Genus AS',
      logo: 'https://itdagene.no/uploads/cache/8f/49/8f49f7a43270a548f4b45b84d98ab023.png',
    },
    {
      name: 'Autodesk',
      logo: 'https://itdagene.no/uploads/cache/bb/aa/bbaaaa399a95ff4d9c39ad03dbd371ba.png',
    },
    {
      name: 'UDI',
      logo: 'https://itdagene.no/uploads/cache/88/39/883999286a617d53665dc559a3691273.png',
    },
    {
      name: 'Nasjonal sikkerhetsmyndighet',
      logo: 'https://itdagene.no/uploads/cache/75/76/7576fd20424987a76d652f34c75e6102.png',
    },
    {
      name: 'Kongsberg Gruppen',
      logo: 'https://itdagene.no/uploads/cache/db/45/db4506e1dc6df7c0221e0b11a947d435.png',
    },
    {
      name: 'ARM Norway AS',
      logo: 'https://itdagene.no/uploads/cache/bc/e3/bce3a8f66e2c0c2b3ff15b50974ca628.png',
    },
    {
      name: '24SevenOffice AS',
      logo: 'https://itdagene.no/uploads/cache/c6/dc/c6dce8935cee5711ebbcba8d966ad751.png',
    },
    {
      name: 'Systek',
      logo: 'https://itdagene.no/uploads/cache/5f/9f/5f9f52cc75ce022a5f1eeb8754db14db.png',
    },
    {
      name: 'Jotron',
      logo: 'https://itdagene.no/uploads/cache/e5/6f/e56f5868d02745538777b15b6eb6cebe.png',
    },
    {
      name: 'KPMG',
      logo: 'https://itdagene.no/uploads/cache/90/7b/907b2de5a1626141f187bb713133b62b.png',
    },
    {
      name: 'Tietoevry',
      logo: 'https://itdagene.no/uploads/cache/ce/4b/ce4b14fd7c0446b96d57a7bdd41833ae.png',
    },
    {
      name: 'SpareBank 1',
      logo: 'https://itdagene.no/uploads/cache/11/5d/115d4eb02c87bb8658f5f41004b70599.png',
    },
    {
      name: 'TV 2',
      logo: 'https://itdagene.no/uploads/cache/ab/49/ab49bcdaf7209923f11383255e995676.png',
    },
    {
      name: 'Norsk Tipping',
      logo: 'https://itdagene.no/uploads/cache/1f/32/1f32c54fd66f3c1bec6b0d59ef3c8552.png',
    },
    {
      name: 'PwC',
      logo: 'https://itdagene.no/uploads/cache/18/96/1896cff38ecde4208e75ddee09aa35b7.png',
    },
    {
      name: 'Visma AS',
      logo: 'https://itdagene.no/uploads/cache/bb/5a/bb5a5d667ed1ca2a7195e41c6007304a.png',
    },
    {
      name: 'DNB',
      logo: 'https://itdagene.no/uploads/cache/2d/c8/2dc81b3b3da57effe1945f8dc94e27e1.png',
    },
    {
      name: 'Optio Incentives',
      logo: 'https://itdagene.no/uploads/cache/77/6d/776d763fcc14b0d996737c117d56b6b6.png',
    },
  ],
};

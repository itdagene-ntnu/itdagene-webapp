const baseUrl =
  process.env.BASE_URL || `http://localhost:${process.env.TEST_PORT || 3000}`;

describe('Page rendering', () => {
  test('Frontpage page rendering', async () => {
    const response = await page.goto(baseUrl);
    expect(response.status()).toBe(200);
    expect(
      await page.evaluate(() =>
        document.body.textContent.includes(
          'Noe gikk galt da siden skulle lastes.'
        )
      )
    ).toBe(false);
  }, 16000);

  test('Frontpage respects company publication and uses two marquee lanes', async () => {
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto(baseUrl);

    const region = await page.$('[data-testid="event-marquee"]');
    if (!region) {
      expect(
        await page.evaluate(() =>
          document.body.textContent.includes('Bedrifter fra itDAGENE')
        )
      ).toBe(false);
      return;
    }

    const marquee = await page.evaluate(() => {
      const region = document.querySelector('[data-testid="event-marquee"]');
      const lanes = [...region.querySelectorAll('[data-direction]')].filter(
        (element) => element.matches('[data-testid="company-marquee-lane"]')
      );
      const tracks = [...region.querySelectorAll('.event-marquee__track')];
      const primaryGroups = [
        ...region.querySelectorAll('[data-marquee-copy="primary"]'),
      ];
      const duplicateGroups = [
        ...region.querySelectorAll('[data-marquee-copy="duplicate"]'),
      ];
      const labelRect = region
        .querySelector('[data-marquee-label]')
        .getBoundingClientRect();
      const firstLaneRect = lanes[0].getBoundingClientRect();
      const primaryItems = primaryGroups.flatMap((group) => [
        ...group.querySelectorAll('li'),
      ]);

      return {
        count: document.querySelectorAll('[data-testid="event-marquee"]')
          .length,
        label: region.getAttribute('aria-label'),
        labelAboveLanes: labelRect.bottom <= firstLaneRect.top + 1,
        laneCount: lanes.length,
        directions: lanes.map((lane) => lane.dataset.direction),
        primaryText: primaryGroups.map((group) => group.textContent).join(' '),
        duplicateHidden: duplicateGroups.map((group) =>
          group.getAttribute('aria-hidden')
        ),
        initialAnimationStates: tracks.map(
          (track) => getComputedStyle(track).animationPlayState
        ),
        initialPlaybackRates: tracks.map(
          (track) => track.getAnimations()[0]?.playbackRate
        ),
        controlCount: region.querySelectorAll('button').length,
        semanticItems: primaryItems.length,
        logoSources: primaryItems
          .map((item) => item.querySelector('img')?.getAttribute('src'))
          .filter(Boolean),
        fallbackNames: primaryItems.filter((item) =>
          item.querySelector('.event-marquee__name')
        ).length,
      };
    });

    expect(marquee.count).toBe(1);
    expect(marquee.label).toContain('Bedrifter');
    expect(marquee.labelAboveLanes).toBe(true);
    expect(marquee.laneCount).toBe(2);
    expect(marquee.directions).toEqual(['left', 'right']);
    expect(marquee.primaryText).not.toContain('Program');
    expect(marquee.primaryText.length).toBeGreaterThan(30);
    expect(marquee.duplicateHidden).toEqual(['true', 'true']);
    expect(marquee.initialAnimationStates).toEqual(['running', 'running']);
    expect(marquee.initialPlaybackRates).toEqual([1, 1]);
    expect(marquee.controlCount).toBe(0);
    expect(marquee.semanticItems).toBeGreaterThan(1);
    expect(marquee.logoSources.every(Boolean)).toBe(true);
    expect(marquee.logoSources.length + marquee.fallbackNames).toBe(
      marquee.semanticItems
    );

    await page.hover('[data-testid="event-marquee"]');
    expect(
      await page.$eval('[data-testid="event-marquee"]', (region) => ({
        animationStates: [
          ...region.querySelectorAll('.event-marquee__track'),
        ].map((track) => getComputedStyle(track).animationPlayState),
        playbackRates: [
          ...region.querySelectorAll('.event-marquee__track'),
        ].map((track) => track.getAnimations()[0]?.playbackRate),
        speed: region.dataset.speed,
      }))
    ).toEqual({
      animationStates: ['running', 'running'],
      playbackRates: [0.35, 0.35],
      speed: 'slow',
    });
  }, 16000);

  test('Company marquee lanes are static and contained on mobile', async () => {
    await page.setViewport({ width: 390, height: 844 });
    await page.goto(baseUrl);

    const region = await page.$('[data-testid="event-marquee"]');
    if (!region) return;

    expect(
      await page.$eval('[data-testid="event-marquee"]', (marquee) => {
        const lanes = [
          ...marquee.querySelectorAll('[data-testid="company-marquee-lane"]'),
        ];
        return {
          animationNames: [
            ...marquee.querySelectorAll('.event-marquee__track'),
          ].map((track) => getComputedStyle(track).animationName),
          contained: lanes.every((lane) => {
            const rect = lane.getBoundingClientRect();
            return rect.left >= 0 && rect.right <= window.innerWidth;
          }),
          documentOverflow:
            document.documentElement.scrollWidth >
            document.documentElement.clientWidth,
          laneCount: lanes.length,
          overflowModes: lanes.map((lane) => getComputedStyle(lane).overflowX),
        };
      })
    ).toEqual({
      animationNames: ['none', 'none'],
      contained: true,
      documentOverflow: false,
      laneCount: 2,
      overflowModes: ['auto', 'auto'],
    });
  }, 16000);

  test('Countdown tiles form the official header identity on scroll', async () => {
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(baseUrl, { waitUntil: 'networkidle0' });
    await page.waitForFunction(
      () =>
        document.querySelector('.event-hero-story')?.dataset.heroMode ===
        'cinematic'
    );

    const initial = await page.evaluate(() => {
      const headerLogo = document.querySelector('[data-hero-logo-target]');
      const rect = headerLogo.getBoundingClientRect();
      return {
        headerRect: {
          height: rect.height,
          left: rect.left,
          top: rect.top,
          width: rect.width,
        },
        tileColors: [...document.querySelectorAll('[data-countdown-tile]')].map(
          (tile) => getComputedStyle(tile).backgroundColor
        ),
        tileCount: document.querySelectorAll('[data-countdown-tile]').length,
        obsoleteWordmark: Boolean(
          document.querySelector('.event-hero__intro-title')
        ),
        navigationTextShadow: getComputedStyle(
          document.querySelector('.site-navigation li a')
        ).textShadow,
        headerActionHidden: document
          .querySelector('.site-navigation__employer')
          .getAttribute('aria-hidden'),
        heroActionOpacity: Number(
          getComputedStyle(
            document.querySelector('.event-hero__arrival-action')
          ).opacity
        ),
        heroAction: {
          href: document
            .querySelector('.event-hero__arrival-action .site-action')
            .getAttribute('href'),
          label: document.querySelector(
            '.event-hero__arrival-action .site-action'
          ).textContent,
        },
      };
    });

    expect(initial.tileCount).toBe(4);
    expect(new Set(initial.tileColors).size).toBe(4);
    expect(initial.obsoleteWordmark).toBe(false);
    expect(initial.navigationTextShadow).toBe('none');
    expect(initial.headerActionHidden).toBe('true');
    expect(initial.heroActionOpacity).toBeGreaterThan(0.95);

    await page.evaluate(() => {
      const story = document.querySelector('.event-hero-story');
      window.scrollTo(
        0,
        story.offsetTop + (story.offsetHeight - window.innerHeight) * 0.47
      );
    });
    await page.waitForFunction(
      () =>
        Number(
          getComputedStyle(document.querySelector('[data-hero-logo]')).opacity
        ) > 0.95
    );

    const mergeAlignment = await page.evaluate(() => {
      const anchorRect = document
        .querySelector('.event-hero__logo-anchor')
        .getBoundingClientRect();
      const anchorCenter = {
        x: anchorRect.left + anchorRect.width / 2,
        y: anchorRect.top + anchorRect.height / 2,
      };
      const tileRects = [
        ...document.querySelectorAll('[data-countdown-tile]'),
      ].map((tile) => tile.getBoundingClientRect());
      const travellingLogoRect = document
        .querySelector('[data-hero-logo]')
        .getBoundingClientRect();
      const travellingLogoSquare = {
        height: travellingLogoRect.height,
        left: travellingLogoRect.left,
        top: travellingLogoRect.top,
        width: travellingLogoRect.height,
      };

      return {
        maxCenterOffset: Math.max(
          ...tileRects.map((rect) =>
            Math.hypot(
              rect.left + rect.width / 2 - anchorCenter.x,
              rect.top + rect.height / 2 - anchorCenter.y
            )
          )
        ),
        maxSizeOffset: Math.max(
          ...tileRects.flatMap((rect) => [
            Math.abs(rect.width - anchorRect.width),
            Math.abs(rect.height - anchorRect.height),
          ])
        ),
        logoSquareCenterOffset: Math.hypot(
          travellingLogoSquare.left +
            travellingLogoSquare.width / 2 -
            anchorCenter.x,
          travellingLogoSquare.top +
            travellingLogoSquare.height / 2 -
            anchorCenter.y
        ),
        logoSquareSizeOffset: Math.max(
          Math.abs(travellingLogoSquare.width - anchorRect.width),
          Math.abs(travellingLogoSquare.height - anchorRect.height)
        ),
        logoSquarePosition: {
          left: travellingLogoSquare.left,
          top: travellingLogoSquare.top,
        },
      };
    });

    expect(mergeAlignment.maxCenterOffset).toBeLessThanOrEqual(1);
    expect(mergeAlignment.maxSizeOffset).toBeLessThanOrEqual(1);
    expect(mergeAlignment.logoSquareCenterOffset).toBeLessThanOrEqual(1);
    expect(mergeAlignment.logoSquareSizeOffset).toBeLessThanOrEqual(1);

    await page.evaluate(() => {
      const story = document.querySelector('.event-hero-story');
      window.scrollTo(
        0,
        story.offsetTop + (story.offsetHeight - window.innerHeight) * 0.82
      );
    });
    await page.waitForFunction(
      ({ startLeft, startTop }) => {
        const rect = document
          .querySelector('[data-hero-logo]')
          .getBoundingClientRect();
        return rect.left < startLeft - 100 && rect.top < startTop - 100;
      },
      {},
      {
        startLeft: mergeAlignment.logoSquarePosition.left,
        startTop: mergeAlignment.logoSquarePosition.top,
      }
    );

    const travellingPosition = await page.$eval(
      '[data-hero-logo]',
      (travellingLogo) => {
        const rect = travellingLogo.getBoundingClientRect();
        return {
          left: rect.left,
          top: rect.top,
        };
      }
    );
    expect(travellingPosition.left).toBeLessThan(
      mergeAlignment.logoSquarePosition.left
    );
    expect(travellingPosition.top).toBeLessThan(
      mergeAlignment.logoSquarePosition.top
    );

    await page.evaluate(() => {
      const story = document.querySelector('.event-hero-story');
      window.scrollTo(0, story.offsetHeight - window.innerHeight);
    });
    await page.waitForFunction(
      () =>
        Number(
          getComputedStyle(document.querySelector('[data-hero-logo-target]'))
            .opacity
        ) > 0.95 &&
        Number(
          getComputedStyle(
            document.querySelector('[data-testid="hero-purpose"]')
          ).opacity
        ) > 0.95 &&
        Number(
          getComputedStyle(document.querySelector('[data-hero-logo]')).opacity
        ) < 0.1
    );

    const resolved = await page.evaluate(() => {
      const headerLogo = document.querySelector('[data-hero-logo-target]');
      const travellingLogo = document.querySelector('[data-hero-logo]');
      const rect = headerLogo.getBoundingClientRect();
      const travellingRect = travellingLogo.getBoundingClientRect();
      return {
        headerRect: {
          height: rect.height,
          left: rect.left,
          top: rect.top,
          width: rect.width,
        },
        purpose: document.querySelector('[data-testid="hero-purpose"]')
          .textContent,
        travellingOpacity: Number(
          getComputedStyle(document.querySelector('[data-hero-logo]')).opacity
        ),
        travellingRect: {
          height: travellingRect.height,
          left: travellingRect.left,
          top: travellingRect.top,
          width: travellingRect.width,
        },
        headerActionHidden: document
          .querySelector('.site-navigation__employer')
          .getAttribute('aria-hidden'),
        heroActionOpacity: Number(
          getComputedStyle(
            document.querySelector('.event-hero__arrival-action')
          ).opacity
        ),
        headerAction: {
          href: document
            .querySelector('.site-navigation__employer')
            .getAttribute('href'),
          label: document.querySelector('.site-navigation__employer')
            .textContent,
        },
      };
    });

    expect(resolved.headerRect).toEqual(initial.headerRect);
    expect(resolved.headerRect.left).toBeLessThan(360);
    expect(resolved.headerRect.top).toBeLessThan(48);
    expect(resolved.travellingRect.left).toBeCloseTo(
      resolved.headerRect.left,
      0
    );
    expect(resolved.travellingRect.top).toBeCloseTo(resolved.headerRect.top, 0);
    expect(resolved.travellingRect.width).toBeCloseTo(
      resolved.headerRect.width,
      0
    );
    expect(resolved.travellingRect.height).toBeCloseTo(
      resolved.headerRect.height,
      0
    );
    expect(resolved.purpose).toBe('Møt arbeidslivet på Gløshaugen.');
    expect(resolved.travellingOpacity).toBeLessThan(0.1);
    expect(resolved.headerActionHidden).toBe('false');
    expect(resolved.heroActionOpacity).toBeLessThan(0.1);
    expect(resolved.headerAction).toEqual(initial.heroAction);

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForFunction(
      () =>
        Number(
          getComputedStyle(document.querySelector('[data-countdown-tile]'))
            .opacity
        ) > 0.95 &&
        Number(
          getComputedStyle(document.querySelector('[data-hero-logo-target]'))
            .opacity
        ) < 0.1
    );
    expect(
      await page.$eval('.site-navigation__employer', (action) =>
        action.getAttribute('aria-hidden')
      )
    ).toBe('true');
  }, 20000);

  test('Background video plays without a visible control', async () => {
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto(baseUrl, { waitUntil: 'networkidle0' });
    await page.waitForFunction(
      () =>
        document.querySelector('.event-hero-story')?.dataset.videoState ===
        'playing'
    );
    expect(await page.$('.event-hero__video-control')).toBeNull();
    expect(
      await page.$eval('.event-hero video', (video) => ({
        muted: video.muted,
        paused: video.paused,
      }))
    ).toEqual({
      muted: true,
      paused: false,
    });
  }, 20000);

  test('Event marquee becomes static with reduced motion', async () => {
    await page.emulateMediaFeatures([
      { name: 'prefers-reduced-motion', value: 'reduce' },
    ]);
    await page.goto(baseUrl);

    const region = await page.$('[data-testid="event-marquee"]');
    if (!region) {
      expect(
        await page.evaluate(() =>
          document.body.textContent.includes('Bedrifter fra itDAGENE')
        )
      ).toBe(false);
      await page.emulateMediaFeatures([
        { name: 'prefers-reduced-motion', value: 'no-preference' },
      ]);
      return;
    }

    const marquee = await page.evaluate(() => {
      const region = document.querySelector('[data-testid="event-marquee"]');
      const tracks = [...region.querySelectorAll('.event-marquee__track')];
      const duplicates = [
        ...region.querySelectorAll('[data-marquee-copy="duplicate"]'),
      ];

      return {
        animationNames: tracks.map(
          (track) => getComputedStyle(track).animationName
        ),
        duplicateDisplays: duplicates.map(
          (duplicate) => getComputedStyle(duplicate).display
        ),
        primaryText: [
          ...region.querySelectorAll('[data-marquee-copy="primary"]'),
        ]
          .map((group) => group.textContent)
          .join(' '),
      };
    });

    expect(marquee.animationNames).toEqual(['none', 'none']);
    expect(marquee.duplicateDisplays).toEqual(['none', 'none']);
    expect(marquee.primaryText).not.toContain('Program');

    await page.emulateMediaFeatures([
      { name: 'prefers-reduced-motion', value: 'no-preference' },
    ]);
  }, 16000);

  test('Reduced motion keeps a complete static hero without loading video', async () => {
    await page.setViewport({ width: 1280, height: 900 });
    await page.emulateMediaFeatures([
      { name: 'prefers-reduced-motion', value: 'reduce' },
    ]);
    await page.goto(baseUrl);

    const hero = await page.evaluate(() => ({
      mode: document.querySelector('.event-hero-story').dataset.heroMode,
      videoSource: document
        .querySelector('.event-hero video')
        .getAttribute('src'),
      heading: document.querySelector('.event-hero h1').textContent,
      countdown: Boolean(
        document.querySelector('[data-testid="event-countdown"]')
      ),
      headerLogoOpacity: getComputedStyle(
        document.querySelector('[data-hero-logo-target]')
      ).opacity,
      interestAction: document.querySelector(
        '.event-hero__arrival-action .site-action'
      ).textContent,
      staticPurposeDisplay: getComputedStyle(
        document.querySelector('.event-hero__static-purpose')
      ).display,
    }));

    expect(hero).toEqual({
      mode: 'static',
      videoSource: null,
      heading: 'Møt arbeidslivet på Gløshaugen',
      countdown: true,
      headerLogoOpacity: '1',
      interestAction: 'Meld interesse',
      staticPurposeDisplay: 'block',
    });

    await page.emulateMediaFeatures([
      { name: 'prefers-reduced-motion', value: 'no-preference' },
    ]);
  }, 16000);

  test('The server-rendered hero has one complete state without JavaScript', async () => {
    await page.setViewport({ width: 1280, height: 900 });
    await page.setJavaScriptEnabled(false);

    try {
      const response = await page.goto(baseUrl);
      expect(response.status()).toBe(200);

      expect(
        await page.evaluate(() => ({
          assembledLogoDisplay: getComputedStyle(
            document.querySelector('[data-hero-logo]')
          ).display,
          compactDisplay: getComputedStyle(
            document.querySelector('.event-hero__compact')
          ).display,
          countdownTileCount: document.querySelectorAll('[data-countdown-tile]')
            .length,
          staticPurposeDisplay: getComputedStyle(
            document.querySelector('.event-hero__static-purpose')
          ).display,
        }))
      ).toEqual({
        assembledLogoDisplay: 'none',
        compactDisplay: 'none',
        countdownTileCount: 4,
        staticPurposeDisplay: 'block',
      });
    } finally {
      await page.setJavaScriptEnabled(true);
    }
  }, 16000);

  test('About us page rendering', async () => {
    const response = await page.goto(baseUrl + '/om-itdagene');
    expect(response.status()).toBe(200);
  }, 16000);

  test('Program page rendering', async () => {
    const response = await page.goto(baseUrl + '/program');
    expect(response.status()).toBe(200);
  }, 16000);

  test('Joblistings page rendering', async () => {
    const response = await page.goto(baseUrl + '/jobb');
    expect(response.status()).toBe(200);
  }, 16000);

  test.each(['/faq', '/galleri', '/stands'])(
    '%s page rendering',
    async (path) => {
      const response = await page.goto(baseUrl + path);
      expect(response.status()).toBe(200);
    },
    16000
  );

  test('Legacy about URL redirects to the canonical route', async () => {
    const response = await page.goto(baseUrl + '/info/om-itdagene', {
      waitUntil: 'domcontentloaded',
    });
    expect(response.status()).toBe(200);
    expect(page.url()).toBe(baseUrl + '/om-itdagene');
  }, 16000);

  test('Unknown routes use the shared not-found page', async () => {
    const response = await page.goto(baseUrl + '/finnes-ikke', {
      waitUntil: 'domcontentloaded',
    });
    expect(response.status()).toBe(404);
    expect(await page.$eval('h1', (heading) => heading.textContent)).toBe(
      'Vi finner ikke siden.'
    );
  }, 16000);

  test.each([
    ['/info/codex-missing-page', 'Vi finner ikke siden.'],
    ['/jobb/codex-missing-job', 'Fant ikke jobbannonsen'],
    ['/stands/codex-missing-stand', 'Fant ikke standen'],
  ])(
    '%s returns the shared dynamic-detail 404',
    async (path, expectedHeading) => {
      const response = await page.goto(baseUrl + path, {
        waitUntil: 'domcontentloaded',
      });

      expect(response.status()).toBe(404);
      expect(await page.$eval('h1', (heading) => heading.textContent)).toBe(
        expectedHeading
      );
    },
    16000
  );

  test('Joblistings w/orderBy rendering', async () => {
    const orders = {
      deadline: 'DEADLINE',
      created: 'CREATED',
      company_name: 'COMPANY_NAME',
      type: 'TYPE',
    };

    const deadline = await page.goto(
      `${baseUrl}/jobb?orderBy=${orders.deadline}`
    );
    const created = await page.goto(
      `${baseUrl}/jobb?orderBy=${orders.created}`
    );
    const company_name = await page.goto(
      `${baseUrl}/jobb?orderBy=${orders.company_name}`
    );
    const type = await page.goto(`${baseUrl}/jobb?orderBy=${orders.type}`);
    expect(deadline.status()).toBe(200);
    expect(created.status()).toBe(200);
    expect(company_name.status()).toBe(200);
    expect(type.status()).toBe(200);
  }, 16000);

  test('Joblistings w/type rendering', async () => {
    const types = {
      empty: '',
      fulltime: 'pp',
      summerintership: 'si',
    };

    const empty = await page.goto(`${baseUrl}/jobb?type=${types.empty}`);
    const fulltime = await page.goto(`${baseUrl}/jobb?type=${types.fulltime}`);
    const summerintership = await page.goto(
      `${baseUrl}/jobb?type=${types.summerintership}`
    );
    expect(empty.status()).toBe(200);
    expect(fulltime.status()).toBe(200);
    expect(summerintership.status()).toBe(200);
  }, 16000);

  test('Joblistings combined query rendering', async () => {
    const response = await page.goto(
      baseUrl + '/jobb?orderBy=DEADLINE&type=pp&fromYear=1&toYear=4'
    );
    expect(response.status()).toBe(200);
  }, 16000);

  test('Mobile navigation exposes its state and links', async () => {
    await page.setViewport({ width: 390, height: 844 });
    await page.goto(baseUrl);
    await page.click('.menu-toggle');

    const navigationState = await page.evaluate(() => ({
      expanded: document
        .querySelector('.menu-toggle')
        .getAttribute('aria-expanded'),
      navigationVisible:
        getComputedStyle(document.querySelector('.site-navigation')).display !==
        'none',
      linkCount: document.querySelectorAll('.site-navigation a').length,
      horizontalOverflow:
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
      heroHeading: document.querySelector('.event-hero h1')?.textContent,
      heroActionCount: document.querySelectorAll(
        '.event-hero__arrival-action .site-action'
      ).length,
      countdownTileCount: document.querySelectorAll('[data-countdown-tile]')
        .length,
    }));

    expect(navigationState).toEqual({
      expanded: 'true',
      navigationVisible: true,
      linkCount: 7,
      horizontalOverflow: false,
      heroHeading: 'Møt arbeidslivet på Gløshaugen',
      heroActionCount: 1,
      countdownTileCount: 4,
    });
  }, 16000);

  test('Mobile navigation restores focus when closed with Escape', async () => {
    await page.setViewport({ width: 390, height: 844 });
    await page.goto(baseUrl);
    await page.click('.menu-toggle');
    await page.focus('.site-navigation a');
    await page.keyboard.press('Escape');

    const navigationState = await page.evaluate(() => ({
      expanded: document
        .querySelector('.menu-toggle')
        .getAttribute('aria-expanded'),
      focusedClass: document.activeElement.className,
      focusedLabel: document.activeElement.getAttribute('aria-label'),
    }));

    expect(navigationState).toEqual({
      expanded: 'false',
      focusedClass: 'menu-toggle',
      focusedLabel: 'Åpne meny',
    });
  }, 16000);

  test('Navigation moves focus to the new main content', async () => {
    await page.setViewport({ width: 390, height: 844 });
    await page.goto(baseUrl);
    await page.click('.menu-toggle');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.click('.site-navigation a[href="/program"]'),
    ]);
    await page.waitForFunction(() => document.activeElement?.tagName === 'H1');

    expect(await page.evaluate(() => document.activeElement.tagName)).toBe(
      'H1'
    );
    expect(
      await page.evaluate(
        () => getComputedStyle(document.activeElement).outlineStyle
      )
    ).not.toBe('none');
  }, 16000);

  test('Homepage and utility pages do not overflow supported widths', async () => {
    for (const width of [320, 390, 1024, 1280, 1440]) {
      await page.setViewport({ width, height: width < 600 ? 844 : 900 });
      await page.goto(baseUrl);
      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth >
            document.documentElement.clientWidth
        )
      ).toBe(false);
    }

    await page.setViewport({ width: 320, height: 844 });
    await page.goto(baseUrl + '/program');
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth
      )
    ).toBe(false);
  }, 30000);

  test.each([
    ['/program', 'rgb(245, 130, 30)'],
    ['/stands', 'rgb(124, 209, 238)'],
    ['/jobb', 'rgb(48, 146, 191)'],
    ['/galleri', 'rgb(14, 59, 102)'],
  ])(
    '%s exposes its legacy route accent',
    async (path, expectedColor) => {
      await page.goto(baseUrl + path);
      expect(
        await page.$eval(
          '.page-header',
          (header) => getComputedStyle(header).borderTopColor
        )
      ).toBe(expectedColor);
    },
    16000
  );

  test('Stand selection is restored by browser history', async () => {
    await page.setViewport({ width: 390, height: 844 });
    await page.goto(baseUrl + '/stands');
    await page.type('#stand-search', 'Computas');
    await page.waitForFunction(() =>
      [...document.querySelectorAll('.stand-directory button')].some((button) =>
        button.textContent.includes('Computas')
      )
    );
    await page.evaluate(() => {
      const button = [
        ...document.querySelectorAll('.stand-directory button'),
      ].find((candidate) => candidate.textContent.includes('Computas'));
      button.click();
    });
    await page.waitForFunction(
      () =>
        new URL(window.location.href).searchParams.get('company') === 'computas'
    );

    await page.evaluate(() => window.history.back());
    await page.waitForFunction(
      () =>
        !new URL(window.location.href).searchParams.has('company') &&
        document.querySelector('.stand-selection') === null
    );

    await page.evaluate(() => window.history.forward());
    await page.waitForFunction(
      () =>
        new URL(window.location.href).searchParams.get('company') ===
          'computas' &&
        document.querySelector('.stand-selection h2')?.textContent ===
          'Computas'
    );
    expect(
      await page.$eval('.stand-selection h2', (element) => element.textContent)
    ).toBe('Computas');
  }, 16000);

  test('Gallery dialog closes with Escape and restores focus', async () => {
    await page.goto(baseUrl + '/galleri', {
      waitUntil: 'domcontentloaded',
    });
    await page.waitForSelector('.gallery-grid button');
    const triggerLabel = await page.$eval('.gallery-grid button', (element) =>
      element.getAttribute('aria-label')
    );
    await page.click('.gallery-grid button');
    await page.waitForSelector('[role="dialog"]');

    expect(
      await page.evaluate(() =>
        Boolean(document.activeElement.closest('[role="dialog"]'))
      )
    ).toBe(true);

    await page.keyboard.press('Escape');
    await page.waitForFunction(
      () => document.querySelector('[role="dialog"]') === null
    );
    expect(
      await page.evaluate(() =>
        document.activeElement.getAttribute('aria-label')
      )
    ).toBe(triggerLabel);
  }, 16000);

  test('Published data is not paired with an unpublished homepage state', async () => {
    await page.goto(baseUrl);
    const programPresentation = await page.evaluate(() => ({
      previewItems: document.querySelectorAll('.program-preview li').length,
      planningLabel: document.querySelector(
        '.current-event-preview__heading > p:first-child'
      )?.textContent,
      primaryHeroHref: document
        .querySelector('.event-hero__actions .site-action')
        ?.getAttribute('href'),
      mainLandmarks: document.querySelectorAll('main').length,
    }));

    expect(programPresentation.mainLandmarks).toBe(1);
    if (programPresentation.previewItems > 0) {
      expect(programPresentation.planningLabel).toBe('Program');
      expect(programPresentation.primaryHeroHref).toBe('/program');
    } else {
      expect(programPresentation.planningLabel).toBe('Programmet planlegges');
      expect(programPresentation.primaryHeroHref).not.toBe('/program');
    }
  }, 16000);
});

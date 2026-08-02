const baseUrl =
  process.env.BASE_URL || `http://localhost:${process.env.TEST_PORT || 3000}`;
const hydrationFailurePattern =
  /hydration failed|text content does not match|did not match|server html|ENOENT.*\.next\/server\/pages/i;

// React can replace a server-rendered link between Puppeteer's selector lookup
// and pointer movement. A real pointer remains over the replacement element,
// so retry only that transient detached-node case.
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const hoverConnectedElement = async (selector) => {
  let detachedError;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    await page.waitForFunction(
      (candidate) => {
        const element = document.querySelector(candidate);
        return Boolean(element?.isConnected && element.getClientRects().length);
      },
      {},
      selector
    );
    await page.$eval(selector, (element) =>
      element.scrollIntoView({ block: 'center', inline: 'center' })
    );

    try {
      await page.hover(selector);
      return;
    } catch (error) {
      if (!error.message.includes('detached from document')) throw error;
      detachedError = error;
    }
  }

  throw detachedError;
};

describe('Page rendering', () => {
  beforeEach(async () => {
    // Keep viewport, scroll restoration and media preferences from leaking
    // between scenarios that deliberately cross responsive motion modes.
    await page.goto('about:blank');
    await page.setViewport({ width: 1280, height: 900 });
    await page.emulateMediaFeatures([
      { name: 'prefers-reduced-motion', value: 'no-preference' },
    ]);
  });

  test('Frontpage page rendering', async () => {
    const hydrationFailures = [];
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const captureConsoleFailure = (message) => {
      if (hydrationFailurePattern.test(message.text())) {
        hydrationFailures.push(message.text());
      }
    };
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const capturePageFailure = (error) => {
      if (hydrationFailurePattern.test(error.message)) {
        hydrationFailures.push(error.message);
      }
    };

    page.on('console', captureConsoleFailure);
    page.on('pageerror', capturePageFailure);

    try {
      const response = await page.goto(baseUrl);
      expect(response.status()).toBe(200);
      await page.waitForSelector('.event-hero-story[data-hero-mode]');
      expect(
        await page.evaluate(() =>
          document.body.textContent.includes(
            'Noe gikk galt da siden skulle lastes.'
          )
        )
      ).toBe(false);
      expect(
        await page.evaluate(() =>
          document.body.textContent.includes(
            'itDAGENE er et årlig møtested mellom IT-studenter og næringslivet'
          )
        )
      ).toBe(true);
      expect(hydrationFailures).toEqual([]);
    } finally {
      page.removeListener('console', captureConsoleFailure);
      page.removeListener('pageerror', capturePageFailure);
    }
  }, 16000);

  test('Frontpage hydrates with the server event phase when browser time differs', async () => {
    const shiftedPage = await browser.newPage();
    const hydrationFailures = [];
    await shiftedPage.setViewport({ width: 1440, height: 900 });
    await shiftedPage.emulateTimezone('Europe/Oslo');
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const captureConsoleFailure = (message) => {
      if (hydrationFailurePattern.test(message.text())) {
        hydrationFailures.push(message.text());
      }
    };
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const capturePageFailure = (error) => {
      if (hydrationFailurePattern.test(error.message)) {
        hydrationFailures.push(error.message);
      }
    };

    await shiftedPage.evaluateOnNewDocument(() => {
      const NativeDate = Date;
      const browserTimestamp = new NativeDate(
        '1900-01-01T12:00:00+01:00'
      ).getTime();

      class BrowserDate extends NativeDate {
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        constructor(...args) {
          if (args.length === 0) {
            super(browserTimestamp);
          } else {
            super(...args);
          }
        }

        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        static now() {
          return browserTimestamp;
        }
      }

      BrowserDate.parse = NativeDate.parse;
      BrowserDate.UTC = NativeDate.UTC;
      window.Date = BrowserDate;
    });
    shiftedPage.on('console', captureConsoleFailure);
    shiftedPage.on('pageerror', capturePageFailure);

    try {
      const response = await shiftedPage.goto(
        `${baseUrl}/?phaseHydrationProbe=1`
      );
      expect(response.status()).toBe(200);
      await shiftedPage.waitForSelector(
        '.event-hero-story[data-hero-transition="ready"]'
      );
      expect(hydrationFailures).toEqual([]);
      expect(
        await shiftedPage.$eval('.event-hero-story', (story) =>
          story.className.includes('event-hero-story--planning')
        )
      ).toBe(false);
    } finally {
      shiftedPage.removeListener('console', captureConsoleFailure);
      shiftedPage.removeListener('pageerror', capturePageFailure);
      await shiftedPage.close();
    }
  }, 20000);

  test('Frontpage renders exactly one current or historical company exposure', async () => {
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto(baseUrl);

    const region = await page.$('[data-testid="event-marquee"]');
    const directory = await page.$('.current-company-directory');
    const mode = await page.$eval(
      '[data-company-exposure]',
      (exposure) => exposure.dataset.companyExposure
    );

    expect(Number(Boolean(region)) + Number(Boolean(directory))).toBe(1);

    if (mode === 'current') {
      expect(directory).not.toBeNull();
      expect(region).toBeNull();
      expect(
        await page.evaluate(() =>
          document.body.textContent.includes('Tidligere bedrifter')
        )
      ).toBe(false);
      return;
    }

    expect(mode).toBe('historical');
    expect(region).not.toBeNull();
    expect(directory).toBeNull();

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
        backgroundColor: getComputedStyle(region).backgroundColor,
        labelBackgroundColor: getComputedStyle(
          region.querySelector('.event-marquee__meta')
        ).backgroundColor,
        labelColor: getComputedStyle(
          region.querySelector('.event-marquee__label')
        ).color,
        label: region.getAttribute('aria-label'),
        context: region.querySelector('.event-marquee__context')?.textContent,
        labelAboveLanes: labelRect.bottom <= firstLaneRect.top + 1,
        laneCount: lanes.length,
        directions: lanes.map((lane) => lane.dataset.direction),
        primaryNames: primaryItems.map(
          (item) =>
            item.querySelector('img')?.getAttribute('alt') ||
            item.querySelector('.event-marquee__name')?.textContent ||
            ''
        ),
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
        logoItemBackgrounds: primaryItems
          .filter((item) =>
            item.classList.contains('event-marquee__item--logo')
          )
          .map((item) => getComputedStyle(item).backgroundColor),
      };
    });

    expect(marquee.count).toBe(1);
    expect(marquee.backgroundColor).toBe('rgb(243, 247, 249)');
    expect(marquee.labelBackgroundColor).toBe('rgb(243, 247, 249)');
    expect(marquee.labelColor).toBe('rgb(18, 57, 98)');
    expect(marquee.label).toContain('Tidligere bedrifter');
    expect(marquee.context).toBe('itDAGENE 2025');
    expect(marquee.labelAboveLanes).toBe(true);
    expect(marquee.laneCount).toBe(2);
    expect(marquee.directions).toEqual(['left', 'right']);
    expect(marquee.primaryNames.join(' ')).not.toContain('Program');
    expect(marquee.primaryNames.join(' ').length).toBeGreaterThan(30);
    expect(marquee.duplicateHidden).toEqual(['true', 'true']);
    expect(marquee.initialAnimationStates).toEqual(['running', 'running']);
    expect(marquee.initialPlaybackRates).toEqual([1, 1]);
    expect(marquee.controlCount).toBe(0);
    expect(marquee.semanticItems).toBeGreaterThan(1);
    expect(marquee.logoSources.length).toBeGreaterThan(1);
    expect(marquee.logoSources.every(Boolean)).toBe(true);
    expect(marquee.logoSources.length + marquee.fallbackNames).toBe(
      marquee.semanticItems
    );
    expect(
      marquee.logoItemBackgrounds.every(
        (background) => background === 'rgb(255, 255, 255)'
      )
    ).toBe(true);

    await hoverConnectedElement('[data-testid="event-marquee"]');
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

    await page.focus('[data-testid="event-marquee"]');
    expect(
      await page.$eval(
        '[data-testid="event-marquee"]',
        (marquee) => getComputedStyle(marquee).outlineColor
      )
    ).toBe('rgb(7, 120, 188)');
  }, 16000);

  test('Company exposure follows partner, exposure, planning and invitation hierarchy', async () => {
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(baseUrl);

    const exposure = await page.evaluate(() => {
      const partner = document.querySelector('.partner-showcase');
      const companyExposure = document.querySelector('[data-company-exposure]');
      const directory = document.querySelector('.current-company-directory');
      const planner = document.querySelector('.visit-planner');
      const marquee = document.querySelector('[data-testid="event-marquee"]');
      const invitation = document.querySelector('.employer-invitation');
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      const comesBefore = (first, second) =>
        Boolean(
          first &&
            second &&
            first.compareDocumentPosition(second) &
              Node.DOCUMENT_POSITION_FOLLOWING
        );
      const companyItems = directory
        ? [...directory.querySelectorAll('[data-company-id]')]
        : [];

      return {
        companyCount: companyItems.length,
        currentDirectoryPublished: Boolean(directory),
        dayCount: directory?.querySelectorAll('[data-company-day]').length || 0,
        exposureBeforePlanner: comesBefore(companyExposure, planner),
        externalLinksValid: companyItems
          .flatMap((item) => [...item.querySelectorAll('a')])
          .every(
            (link) =>
              link.target === '_blank' && link.relList.contains('noreferrer')
          ),
        hasHiddenCompanyControls: Boolean(
          directory?.querySelector('details, [role="tab"]')
        ),
        historicalMarqueePublished: Boolean(marquee),
        marqueeAfterPlanner: marquee ? comesBefore(planner, marquee) : false,
        marqueeBeforeInvitation: comesBefore(marquee, invitation),
        mode: companyExposure?.dataset.companyExposure,
        partnerPublished: Boolean(partner),
        partnerBeforeExposure: comesBefore(partner, companyExposure),
        plannerBeforeInvitation: comesBefore(planner, invitation),
        standsHref: directory
          ?.querySelector('.current-company-directory__heading a')
          ?.getAttribute('href'),
        visibleCompanies: companyItems.every((item) => {
          const style = getComputedStyle(item);
          return style.display !== 'none' && style.visibility !== 'hidden';
        }),
      };
    });

    if (exposure.partnerPublished) {
      expect(exposure.partnerBeforeExposure).toBe(true);
    }
    expect(exposure.exposureBeforePlanner).toBe(true);
    expect(exposure.plannerBeforeInvitation).toBe(true);
    expect(exposure.marqueeAfterPlanner).toBe(false);
    expect(
      Number(exposure.currentDirectoryPublished) +
        Number(exposure.historicalMarqueePublished)
    ).toBe(1);

    if (exposure.currentDirectoryPublished) {
      expect(exposure.mode).toBe('current');
      expect(exposure.historicalMarqueePublished).toBe(false);
      expect(exposure.dayCount).toBe(2);
      expect(exposure.companyCount).toBeGreaterThan(0);
      expect(exposure.visibleCompanies).toBe(true);
      expect(exposure.hasHiddenCompanyControls).toBe(false);
      expect(exposure.externalLinksValid).toBe(true);
      expect(exposure.standsHref).toBe('/stands');
    } else {
      expect(exposure.mode).toBe('historical');
      expect(exposure.marqueeBeforeInvitation).toBe(true);
    }
  }, 16000);

  test('Company exposure is contained on mobile', async () => {
    await page.setViewport({ width: 390, height: 844 });
    await page.goto(baseUrl);

    const region = await page.$('[data-testid="event-marquee"]');

    if (!region) {
      expect(await page.$('.current-company-directory')).not.toBeNull();
      expect(
        await page.evaluate(() => ({
          documentOverflow:
            document.documentElement.scrollWidth >
            document.documentElement.clientWidth,
          gridColumns: getComputedStyle(
            document.querySelector('.current-company-directory__grid')
          ).gridTemplateColumns.split(' ').length,
        }))
      ).toEqual({
        documentOverflow: false,
        gridColumns: 2,
      });
      return;
    }

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

  test('Visit planner hover covers each card with its route tint', async () => {
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(baseUrl);
    await page.waitForFunction(
      () =>
        document.querySelector('.event-hero-story')?.dataset.heroTransition ===
        'ready'
    );

    const cardResults = [];

    for (let cardIndex = 1; cardIndex <= 4; cardIndex += 1) {
      const selector = `.visit-planner li:nth-child(${cardIndex}) a`;
      await hoverConnectedElement(selector);
      await new Promise((resolve) => setTimeout(resolve, 220));
      cardResults.push(
        await page.$eval(selector, (link) => {
          const item = link.closest('li');
          const itemRect = item.getBoundingClientRect();
          const linkRect = link.getBoundingClientRect();

          return {
            backgroundColor: getComputedStyle(link).backgroundColor,
            bottomGap: Math.abs(itemRect.bottom - linkRect.bottom),
            heightGap: Math.abs(itemRect.height - linkRect.height),
          };
        })
      );
    }

    expect(
      cardResults.every(
        ({ bottomGap, heightGap }) => bottomGap <= 1 && heightGap <= 1
      )
    ).toBe(true);
    expect(
      new Set(cardResults.map(({ backgroundColor }) => backgroundColor)).size
    ).toBe(4);
  }, 16000);

  test('Countdown tiles form the official header identity on scroll', async () => {
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(
      () =>
        document.querySelector('.event-hero-story')?.dataset.heroTransition ===
        'ready'
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
        plannerColors: [
          ...document.querySelectorAll('.visit-planner__marker'),
        ].map((marker) => getComputedStyle(marker).backgroundColor),
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
    expect(initial.tileColors).toEqual(initial.plannerColors);
    expect(initial.obsoleteWordmark).toBe(false);
    expect(initial.navigationTextShadow).toBe('none');
    expect(initial.headerActionHidden).toBe('true');
    expect(initial.heroActionOpacity).toBeGreaterThan(0.95);

    await page.evaluate(() => {
      const story = document.querySelector('.event-hero-story');
      window.scrollTo(
        0,
        story.offsetTop + (story.offsetHeight - window.innerHeight) * 0.42
      );
    });
    await new Promise((resolve) => setTimeout(resolve, 900));
    const transitionOverlap = await page.evaluate(() => {
      const anchorRect = document
        .querySelector('.event-hero__logo-anchor')
        .getBoundingClientRect();
      const anchorCenter = {
        x: anchorRect.left + anchorRect.width / 2,
        y: anchorRect.top + anchorRect.height / 2,
      };
      const visibleTiles = [
        ...document.querySelectorAll('[data-countdown-tile]'),
      ].filter((tile) => Number(getComputedStyle(tile).opacity) > 0.1);
      const maxVisibleTileCenterOffset = Math.max(
        0,
        ...visibleTiles.map((tile) => {
          const rect = tile.getBoundingClientRect();
          return Math.hypot(
            rect.left + rect.width / 2 - anchorCenter.x,
            rect.top + rect.height / 2 - anchorCenter.y
          );
        })
      );

      return {
        logoOpacity: Number(
          getComputedStyle(document.querySelector('[data-hero-logo]')).opacity
        ),
        maxVisibleTileCenterOffset,
      };
    });
    expect(
      transitionOverlap.logoOpacity > 0.1 &&
        transitionOverlap.maxVisibleTileCenterOffset > 1
    ).toBe(false);

    await page.evaluate(() => {
      const story = document.querySelector('.event-hero-story');
      window.scrollTo(
        0,
        story.offsetTop + (story.offsetHeight - window.innerHeight) * 0.47
      );
    });
    await page.waitForFunction(() => {
      const travellingLogo = document.querySelector('[data-hero-logo]');
      const image = travellingLogo.querySelector('img');
      const style = getComputedStyle(travellingLogo);

      return (
        image.complete &&
        image.naturalWidth > 0 &&
        Number(style.opacity) > 0.95 &&
        style.visibility === 'visible'
      );
    });
    const mergedLogo = await page.$eval(
      '[data-hero-logo]',
      (travellingLogo) => ({
        imageComplete: travellingLogo.querySelector('img').complete,
        imageNaturalWidth: travellingLogo.querySelector('img').naturalWidth,
        imageFilter: getComputedStyle(travellingLogo.querySelector('img'))
          .filter,
        opacity: Number(getComputedStyle(travellingLogo).opacity),
        sameOrigin:
          new URL(travellingLogo.querySelector('img').src).origin ===
          window.location.origin,
        visibility: getComputedStyle(travellingLogo).visibility,
      })
    );
    expect(mergedLogo).toEqual({
      imageComplete: true,
      imageFilter: expect.stringContaining('drop-shadow'),
      imageNaturalWidth: expect.any(Number),
      opacity: 1,
      sameOrigin: true,
      visibility: 'visible',
    });
    expect(mergedLogo.imageNaturalWidth).toBeGreaterThan(0);
    expect(mergedLogo.imageFilter.match(/drop-shadow/g) || []).toHaveLength(4);
    const hairlineOffsets = [
      ...mergedLogo.imageFilter.matchAll(/(-?\d*\.?\d+)px/g),
    ]
      .map((match) => Math.abs(Number(match[1])))
      .filter((offset) => offset > 0);
    expect(hairlineOffsets).toHaveLength(4);
    expect(hairlineOffsets.every((offset) => offset <= 0.5)).toBe(true);
    expect(mergedLogo.imageFilter.match(/0px\)/g) || []).toHaveLength(4);
    await page.waitForFunction(() => {
      const anchorRect = document
        .querySelector('.event-hero__logo-anchor')
        .getBoundingClientRect();
      const anchorCenter = {
        x: anchorRect.left + anchorRect.width / 2,
        y: anchorRect.top + anchorRect.height / 2,
      };

      return [...document.querySelectorAll('[data-countdown-tile]')].every(
        (tile) => {
          const tileRect = tile.getBoundingClientRect();
          return (
            Math.hypot(
              tileRect.left + tileRect.width / 2 - anchorCenter.x,
              tileRect.top + tileRect.height / 2 - anchorCenter.y
            ) <= 1
          );
        }
      );
    });

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
    await page.waitForFunction(() => {
      const headerLogo = document.querySelector('[data-hero-logo-target]');
      const travellingLogo = document.querySelector('[data-hero-logo]');
      const headerRect = headerLogo.getBoundingClientRect();
      const travellingRect = travellingLogo.getBoundingClientRect();
      const geometryResolved =
        Math.abs(headerRect.left - travellingRect.left) <= 1 &&
        Math.abs(headerRect.top - travellingRect.top) <= 1 &&
        Math.abs(headerRect.width - travellingRect.width) <= 1 &&
        Math.abs(headerRect.height - travellingRect.height) <= 1;

      return (
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
        ) < 0.1 &&
        geometryResolved
      );
    });

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
    expect(resolved.purpose).toBe('IT-studenter møter næringslivet.');
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
  }, 30000);

  test('Hero keeps a complete identity while cinematic motion prepares', async () => {
    await page.setViewport({ width: 1440, height: 900 });
    await page.setRequestInterception(true);

    const heldLogoRequests = [];
    let resolveLogoRequest;
    const logoRequestHeld = new Promise((resolve) => {
      resolveLogoRequest = resolve;
    });
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const holdLogoRequest = (request) => {
      if (request.url().includes('/static/itdagene-svart.png')) {
        heldLogoRequests.push(request);
        resolveLogoRequest();
        return;
      }

      request.continue();
    };

    page.on('request', holdLogoRequest);

    try {
      await Promise.all([
        page.goto(baseUrl, { waitUntil: 'domcontentloaded' }),
        logoRequestHeld,
      ]);
      await page.waitForSelector('.event-hero-story[data-hero-mode]');
      await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.7));
      await new Promise((resolve) => setTimeout(resolve, 100));

      const preparing = await page.evaluate(() => {
        const story = document.querySelector('.event-hero-story');
        const headerLogo = document.querySelector('[data-hero-logo-target]');
        const countdownTiles = [
          ...document.querySelectorAll('[data-countdown-tile]'),
        ];

        return {
          countdownVisible: countdownTiles.every(
            (tile) =>
              Number(getComputedStyle(tile).opacity) > 0.95 &&
              getComputedStyle(tile).visibility === 'visible'
          ),
          headerLogoOpacity: Number(getComputedStyle(headerLogo).opacity),
          mode: story.dataset.heroMode,
          transition: story.dataset.heroTransition || null,
        };
      });

      expect(preparing).toEqual({
        countdownVisible: true,
        headerLogoOpacity: 1,
        mode: 'preparing',
        transition: null,
      });

      await Promise.all(heldLogoRequests.map((request) => request.continue()));
      await page.waitForFunction(
        () =>
          document.querySelector('.event-hero-story')?.dataset
            .heroTransition === 'ready'
      );
    } finally {
      await Promise.all(
        heldLogoRequests.map((request) =>
          request.continue().catch(() => undefined)
        )
      );
      page.removeListener('request', holdLogoRequest);
      await page.setRequestInterception(false);
    }
  }, 20000);

  test('Hero identity geometry stays aligned after a viewport resize', async () => {
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(
      () =>
        document.querySelector('.event-hero-story')?.dataset.heroTransition ===
        'ready'
    );

    await page.setViewport({ width: 1024, height: 768 });
    await new Promise((resolve) => setTimeout(resolve, 700));
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

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const readMergeGeometry = async () =>
      page.evaluate(() => {
        const anchor = document
          .querySelector('.event-hero__logo-anchor')
          .getBoundingClientRect();
        const logo = document
          .querySelector('[data-hero-logo]')
          .getBoundingClientRect();
        const anchorCenter = {
          x: anchor.left + anchor.width / 2,
          y: anchor.top + anchor.height / 2,
        };
        const logoSquareCenter = {
          x: logo.left + logo.height / 2,
          y: logo.top + logo.height / 2,
        };
        const tileOffsets = [
          ...document.querySelectorAll('[data-countdown-tile]'),
        ].map((tile) => {
          const tileRect = tile.getBoundingClientRect();
          return {
            center: Math.hypot(
              tileRect.left + tileRect.width / 2 - anchorCenter.x,
              tileRect.top + tileRect.height / 2 - anchorCenter.y
            ),
            size: Math.max(
              Math.abs(tileRect.width - anchor.width),
              Math.abs(tileRect.height - anchor.height)
            ),
          };
        });

        return {
          centerOffset: Math.hypot(
            logoSquareCenter.x - anchorCenter.x,
            logoSquareCenter.y - anchorCenter.y
          ),
          sizeOffset: Math.max(
            Math.abs(logo.height - anchor.width),
            Math.abs(logo.height - anchor.height)
          ),
          tileCenterOffset: Math.max(
            ...tileOffsets.map(({ center }) => center)
          ),
          tileSizeOffset: Math.max(...tileOffsets.map(({ size }) => size)),
        };
      });
    const mergeGeometry = await readMergeGeometry();

    expect(mergeGeometry.centerOffset).toBeLessThanOrEqual(1);
    expect(mergeGeometry.sizeOffset).toBeLessThanOrEqual(1);
    expect(mergeGeometry.tileCenterOffset).toBeLessThanOrEqual(1);
    expect(mergeGeometry.tileSizeOffset).toBeLessThanOrEqual(1);

    await page.setViewport({ width: 1440, height: 900 });
    await new Promise((resolve) => setTimeout(resolve, 700));
    await page.evaluate(() => {
      const story = document.querySelector('.event-hero-story');
      window.scrollTo(
        0,
        story.offsetTop + (story.offsetHeight - window.innerHeight) * 0.47
      );
    });
    await page.waitForFunction(() => {
      const anchor = document
        .querySelector('.event-hero__logo-anchor')
        ?.getBoundingClientRect();
      const logo = document
        .querySelector('[data-hero-logo]')
        ?.getBoundingClientRect();
      if (!anchor || !logo) return false;

      const anchorCenter = {
        x: anchor.left + anchor.width / 2,
        y: anchor.top + anchor.height / 2,
      };
      const logoSquareCenter = {
        x: logo.left + logo.height / 2,
        y: logo.top + logo.height / 2,
      };

      return (
        Math.hypot(
          logoSquareCenter.x - anchorCenter.x,
          logoSquareCenter.y - anchorCenter.y
        ) <= 1 &&
        [...document.querySelectorAll('[data-countdown-tile]')].every(
          (tile) => {
            const tileRect = tile.getBoundingClientRect();
            return (
              Math.hypot(
                tileRect.left + tileRect.width / 2 - anchorCenter.x,
                tileRect.top + tileRect.height / 2 - anchorCenter.y
              ) <= 1
            );
          }
        )
      );
    });
    const resizedMergeGeometry = await readMergeGeometry();

    expect(resizedMergeGeometry.centerOffset).toBeLessThanOrEqual(1);
    expect(resizedMergeGeometry.sizeOffset).toBeLessThanOrEqual(1);
    expect(resizedMergeGeometry.tileCenterOffset).toBeLessThanOrEqual(1);
    expect(resizedMergeGeometry.tileSizeOffset).toBeLessThanOrEqual(1);
  }, 30000);

  test('Hero keeps its identity when crossing the responsive motion boundary', async () => {
    await page.setViewport({ width: 799, height: 900 });
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.event-hero-story[data-hero-mode="static"]');
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = 'auto';
    });

    expect(
      await page.$eval('[data-hero-logo-target]', (logo) => ({
        opacity: Number(getComputedStyle(logo).opacity),
        visibility: getComputedStyle(logo).visibility,
      }))
    ).toEqual({
      opacity: 1,
      visibility: 'visible',
    });

    await page.evaluate(() => {
      const story = document.querySelector('.event-hero-story');
      window.scrollTo(0, story.offsetTop + story.offsetHeight * 0.8);
    });
    await page.setViewport({ width: 801, height: 900 });
    await page.waitForFunction(
      () =>
        document.querySelector('.event-hero-story')?.dataset.heroTransition ===
        'ready'
    );
    await page.evaluate(() => {
      const story = document.querySelector('.event-hero-story');
      window.scrollTo(
        0,
        story.offsetTop + (story.offsetHeight - window.innerHeight) * 0.69
      );
    });
    await page.waitForFunction(
      () => {
        const story = document.querySelector('.event-hero-story');
        if (!story) return false;
        const scrollRange = Math.max(
          1,
          story.offsetHeight - window.innerHeight
        );
        return (window.scrollY - story.offsetTop) / scrollRange > 0.46;
      },
      { timeout: 8000 }
    );
    await new Promise((resolve) => setTimeout(resolve, 900));

    const cinematicIdentity = await page.evaluate(() => {
      const story = document.querySelector('.event-hero-story');
      const travellingLogo = document.querySelector('[data-hero-logo]');
      const headerLogo = document.querySelector('[data-hero-logo-target]');
      const scrollRange = Math.max(1, story.offsetHeight - window.innerHeight);

      return {
        headerOpacity: Number(getComputedStyle(headerLogo).opacity),
        mode: story.dataset.heroMode,
        progress: Math.max(
          0,
          Math.min(1, (window.scrollY - story.offsetTop) / scrollRange)
        ),
        travellingOpacity: Number(getComputedStyle(travellingLogo).opacity),
      };
    });

    expect(cinematicIdentity.mode).toBe('cinematic');
    expect(cinematicIdentity.progress).toBeGreaterThan(0.46);
    expect(
      Math.max(
        cinematicIdentity.headerOpacity,
        cinematicIdentity.travellingOpacity
      )
    ).toBeGreaterThan(0.95);

    await page.setViewport({ width: 799, height: 900 });
    await page.waitForSelector('.event-hero-story[data-hero-mode="static"]');
    await page.waitForFunction(
      () =>
        Number(
          getComputedStyle(document.querySelector('[data-hero-logo-target]'))
            .opacity
        ) > 0.95
    );
  }, 20000);

  test('Background video uses the original film at its natural speed', async () => {
    await page.setViewport({ width: 1280, height: 900 });
    await page.setRequestInterception(true);
    // Keep this behavior test independent of CDN timing. Native loop playback
    // belongs to the browser; the application owns the source and rate guard.
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const blockVideoRequest = (request) => {
      if (request.url().includes('/itdagene.mp4')) {
        request.abort();
      } else {
        request.continue();
      }
    };
    page.on('request', blockVideoRequest);

    try {
      await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(
        () =>
          document.querySelector('.event-hero-story')?.dataset
            .heroTransition === 'ready'
      );
      await page.$eval('.event-hero video', (video) => {
        video.dispatchEvent(new Event('playing'));
      });
      expect(await page.$('.event-hero__video-control')).toBeNull();
      expect(
        await page.$eval('.event-hero video', (video) => ({
          beginsAtStart: video.currentTime < 10,
          defaultPlaybackRate: video.defaultPlaybackRate,
          loop: video.loop,
          muted: video.muted,
          playbackRate: video.playbackRate,
          source: video.src,
        }))
      ).toEqual({
        beginsAtStart: true,
        defaultPlaybackRate: 1,
        loop: true,
        muted: true,
        playbackRate: 1,
        source: 'https://cdn.itdagene.no/itdagene.mp4',
      });

      await page.$eval('.event-hero video', (video) => {
        video.playbackRate = 1.75;
      });
      await page.waitForFunction(
        () => document.querySelector('.event-hero video')?.playbackRate === 1
      );
    } finally {
      page.removeListener('request', blockVideoRequest);
      await page.setRequestInterception(false);
    }
  }, 20000);

  test('Event marquee becomes static with reduced motion', async () => {
    await page.emulateMediaFeatures([
      { name: 'prefers-reduced-motion', value: 'reduce' },
    ]);
    await page.goto(baseUrl);

    const region = await page.$('[data-testid="event-marquee"]');
    if (!region) {
      expect(await page.$('.current-company-directory')).not.toBeNull();
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
    await page.waitForSelector('.event-hero-story[data-hero-mode="static"]');

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
      heading: 'IT-studenter møter næringslivet.',
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

  test('FAQ disclosures animate through the shared expansion motion', async () => {
    await page.setViewport({ width: 1280, height: 900 });
    const response = await page.goto(baseUrl + '/faq', {
      // The disclosure owns local state. Wait for Relay's initial refresh so
      // the test does not click an instance that is about to be replaced.
      waitUntil: 'networkidle0',
    });
    expect(response.status()).toBe(200);
    await page.waitForSelector('.faq-item .smooth-disclosure__trigger');

    const initialHeight = await page.$eval(
      '.faq-item [data-disclosure-motion]',
      (motion) => motion.getBoundingClientRect().height
    );
    expect(initialHeight).toBe(0);

    await page.click('.faq-item .smooth-disclosure__trigger');
    await new Promise((resolve) => setTimeout(resolve, 80));

    const expanding = await page.$eval('.faq-item', (item) => {
      const motion = item.querySelector('[data-disclosure-motion]');
      const trigger = item.querySelector('.smooth-disclosure__trigger');
      return {
        activeAnimations: motion.getAnimations().length,
        expanded: trigger.getAttribute('aria-expanded'),
        height: motion.getBoundingClientRect().height,
      };
    });

    expect(expanding.expanded).toBe('true');
    expect(expanding.activeAnimations).toBeGreaterThan(0);
    expect(expanding.height).toBeGreaterThan(0);

    await new Promise((resolve) => setTimeout(resolve, 500));
    const settledHeight = await page.$eval(
      '.faq-item [data-disclosure-motion]',
      (motion) => motion.getBoundingClientRect().height
    );
    expect(settledHeight).toBeGreaterThan(expanding.height);
  }, 16000);

  test('Board portraits preserve the original circular framing', async () => {
    await page.setViewport({ width: 1680, height: 1000 });
    const response = await page.goto(baseUrl + '/om-itdagene', {
      waitUntil: 'domcontentloaded',
    });
    expect(response.status()).toBe(200);
    await page.waitForSelector('.board-member__portrait img');

    const portrait = await page.$eval('.board-member__portrait', (frame) => {
      const image = frame.querySelector('img');
      const frameRect = frame.getBoundingClientRect();
      const frameStyle = getComputedStyle(frame);
      const imageStyle = getComputedStyle(image);

      return {
        borderRadius: frameStyle.borderRadius,
        height: frameRect.height,
        imageHeight: image.naturalHeight,
        imageWidth: image.naturalWidth,
        objectPosition: imageStyle.objectPosition,
        transform: imageStyle.transform,
        width: frameRect.width,
      };
    });

    expect(portrait.width).toBeGreaterThanOrEqual(194);
    expect(Math.abs(portrait.width - portrait.height)).toBeLessThanOrEqual(1);
    expect(portrait.borderRadius).toBe('50%');
    expect(portrait.imageWidth).toBe(portrait.imageHeight);
    expect(portrait.objectPosition).toBe('50% 50%');
    expect(portrait.transform).toBe('none');
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
      heroHeading: 'IT-studenter møter næringslivet.',
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

  test('Pointer navigation moves focus without showing a keyboard ring', async () => {
    await page.setViewport({ width: 390, height: 844 });
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await page.click('.menu-toggle');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      page.click('.site-navigation a[href="/program"]'),
    ]);
    await page.waitForFunction(() => document.activeElement?.tagName === 'H1');

    const destinationFocus = await page.evaluate(() => ({
      focusVisible: document.activeElement.matches(':focus-visible'),
      outlineStyle: getComputedStyle(document.activeElement).outlineStyle,
      tagName: document.activeElement.tagName,
    }));

    expect(destinationFocus).toEqual({
      focusVisible: false,
      outlineStyle: 'none',
      tagName: 'H1',
    });
  }, 30000);

  test('Keyboard navigation moves focus and keeps its visible ring', async () => {
    await page.setViewport({ width: 390, height: 844 });
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await page.click('.menu-toggle');
    await page.focus('.site-navigation a[href="/program"]');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      page.keyboard.press('Enter'),
    ]);
    await page.waitForFunction(() => document.activeElement?.tagName === 'H1');

    const destinationFocus = await page.evaluate(() => ({
      focusVisible: document.activeElement.matches(':focus-visible'),
      outlineStyle: getComputedStyle(document.activeElement).outlineStyle,
      tagName: document.activeElement.tagName,
    }));

    expect(destinationFocus).toEqual({
      focusVisible: true,
      outlineStyle: 'solid',
      tagName: 'H1',
    });
  }, 30000);

  test('Homepage photography keeps its source framing on small screens', async () => {
    await page.setViewport({ width: 390, height: 844 });
    await page.goto(baseUrl);
    await page.$eval('.documentary-band', (section) =>
      section.scrollIntoView({ block: 'center' })
    );
    await page.waitForFunction(() => {
      const images = [
        ...document.querySelectorAll('.documentary-band__item img'),
        document.querySelector('.employer-invitation__media img'),
      ];
      return images.every((image) => image?.complete && image.naturalWidth > 0);
    });

    const framing = await page.evaluate(() => {
      const documentaryItems = [
        ...document.querySelectorAll('.documentary-band__item'),
      ];
      const ratios = documentaryItems.map((item) => {
        const bounds = item.getBoundingClientRect();
        return bounds.width / bounds.height;
      });
      const leftEdges = documentaryItems.map(
        (item) => item.getBoundingClientRect().left
      );
      const employerMedia = document
        .querySelector('.employer-invitation__media')
        .getBoundingClientRect();
      const employerImage = document.querySelector(
        '.employer-invitation__media img'
      );

      return {
        documentaryRatios: ratios,
        documentaryLeftEdges: leftEdges,
        employerRatio: employerMedia.width / employerMedia.height,
        employerFocalPoint: getComputedStyle(employerImage).objectPosition,
        focalPoints: documentaryItems.map(
          (item) => getComputedStyle(item.querySelector('img')).objectPosition
        ),
      };
    });

    expect(
      framing.documentaryRatios.every((ratio) => ratio > 1.48 && ratio < 1.52)
    ).toBe(true);
    expect(new Set(framing.documentaryLeftEdges).size).toBe(1);
    expect(framing.employerRatio).toBeGreaterThan(1.48);
    expect(framing.employerRatio).toBeLessThan(1.52);
    expect(framing.focalPoints).toEqual([
      '50% 55%',
      '58% 50%',
      '56% 48%',
      '50% 58%',
    ]);
    expect(framing.employerFocalPoint).toBe('60% 50%');
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
      await page.goto(baseUrl + path, { waitUntil: 'domcontentloaded' });
      const resolvedAccent = await page.waitForFunction(
        (color) => {
          const header = document.querySelector('.page-header');
          if (!header) return false;
          const renderedColor = getComputedStyle(header).borderTopColor;
          return renderedColor === color ? renderedColor : false;
        },
        {},
        expectedColor
      );
      expect(await resolvedAccent.jsonValue()).toBe(expectedColor);
    },
    16000
  );

  test('Stand selection is restored by browser history', async () => {
    await page.setViewport({ width: 390, height: 844 });
    await page.goto(baseUrl + '/stands');
    const company = await page.$eval('.stand-directory button', (button) => ({
      name: button.querySelector('strong')?.textContent,
      slug: button.dataset.standCompany,
    }));

    await page.type('#stand-search', company.name);
    await page.waitForFunction(
      (slug) =>
        document.querySelector(
          `.stand-directory button[data-stand-company="${slug}"]`
        ),
      {},
      company.slug
    );
    await page.$eval(
      `.stand-directory button[data-stand-company="${company.slug}"]`,
      (button) => button.click()
    );
    await page.waitForFunction(
      (slug) =>
        new URL(window.location.href).searchParams.get('company') === slug,
      {},
      company.slug
    );

    await page.evaluate(() => window.history.back());
    await page.waitForFunction(
      () =>
        !new URL(window.location.href).searchParams.has('company') &&
        document.querySelector('.stand-selection') === null
    );

    await page.evaluate(() => window.history.forward());
    await page.waitForFunction(
      ({ name, slug }) =>
        new URL(window.location.href).searchParams.get('company') === slug &&
        document.querySelector('.stand-selection h2')?.textContent === name,
      {},
      company
    );
    expect(
      await page.$eval('.stand-selection h2', (element) => element.textContent)
    ).toBe(company.name);
    const selectionLocation = await page.evaluate(() => ({
      location: document
        .querySelector('.metadata-list__item:first-child dd')
        ?.textContent.trim(),
      summary: document
        .querySelector('.stand-selection p:not(.site-eyebrow)')
        ?.textContent.trim(),
    }));
    expect(selectionLocation.summary).toContain(selectionLocation.location);
  }, 16000);

  test('Stand map, directory and table share one active company', async () => {
    await page.setViewport({ width: 1440, height: 1000 });
    await page.goto(baseUrl + '/stands');

    const company = await page.$eval('.stand-directory button', (button) => ({
      name: button.querySelector('strong')?.textContent,
      slug: button.dataset.standCompany,
    }));
    const markerSelector = `.stand-map__marker[data-stand-company="${company.slug}"]`;
    const directorySelector = `.stand-directory button[data-stand-company="${company.slug}"]`;
    const tableSelector = `.stand-table__company[data-stand-company="${company.slug}"]`;

    expect(
      await page.$eval(markerSelector, (marker) => ({
        hitTargetWidth: marker.getBoundingClientRect().width,
        visualMarkerWidth: marker
          .querySelector('.stand-map__marker-number')
          .getBoundingClientRect().width,
      }))
    ).toEqual({
      hitTargetWidth: 24,
      visualMarkerWidth: expect.any(Number),
    });
    expect(
      await page.$eval(
        `${markerSelector} .stand-map__marker-number`,
        (marker) => marker.getBoundingClientRect().width
      )
    ).toBeLessThanOrEqual(16);

    await page.hover(directorySelector);
    await page.waitForFunction(
      (selector) => document.querySelector(selector)?.dataset.active === 'true',
      {},
      markerSelector
    );
    expect(
      await page.$eval(markerSelector, (marker) => ({
        active: marker.dataset.active,
        company: marker.querySelector('.stand-map__marker-label')?.textContent,
        labelVisible:
          getComputedStyle(marker.querySelector('.stand-map__marker-label'))
            .visibility !== 'hidden',
      }))
    ).toEqual({
      active: 'true',
      company: company.name,
      labelVisible: true,
    });
    expect(
      await page.$eval(
        `${markerSelector} .stand-map__marker-number`,
        (marker) => marker.getBoundingClientRect().width
      )
    ).toBeLessThanOrEqual(17);

    await hoverConnectedElement(markerSelector);
    await page.waitForFunction(
      (selector) => document.querySelector(selector)?.dataset.active === 'true',
      {},
      directorySelector
    );
    expect(
      await page.$eval(directorySelector, (button) => button.dataset.active)
    ).toBe('true');

    await page.click('.stand-table summary');
    await hoverConnectedElement(tableSelector);
    await page.waitForFunction(
      (selector) => document.querySelector(selector)?.dataset.active === 'true',
      {},
      markerSelector
    );
    expect(
      await page.$eval(markerSelector, (marker) => marker.dataset.active)
    ).toBe('true');

    await page.$eval(tableSelector, (button) => button.click());
    await page.waitForFunction(
      ({ name, slug }) =>
        new URL(window.location.href).searchParams.get('company') === slug &&
        document.querySelector('.stand-selection h2')?.textContent === name,
      {},
      company
    );
    expect(
      await page.evaluate(
        (selectors) =>
          selectors.every(
            (selector) =>
              document.querySelector(selector)?.dataset.selected === 'true'
          ),
        [markerSelector, directorySelector, tableSelector]
      )
    ).toBe(true);
  }, 30000);

  test('Stand search previews its top result without changing the URL', async () => {
    await page.setViewport({ width: 1440, height: 1000 });
    await page.goto(baseUrl + '/stands');

    const company = await page.$eval('.stand-directory button', (button) => ({
      name: button.querySelector('strong')?.textContent,
      number: button.querySelector('span')?.textContent,
      slug: button.dataset.standCompany,
    }));

    await page.type('#stand-search', company.number);
    await page.waitForFunction(
      (slug) =>
        document.querySelectorAll('.stand-directory li').length === 1 &&
        document.querySelector(
          `.stand-directory button[data-stand-company="${slug}"]`
        )?.dataset.active === 'true',
      {},
      company.slug
    );

    expect(
      await page.evaluate(
        (slug) => ({
          company: new URL(window.location.href).searchParams.get('company'),
          label: document.querySelector(
            `.stand-map__marker[data-stand-company="${slug}"] .stand-map__marker-label`
          )?.textContent,
          selected: document.querySelector(
            `.stand-directory button[data-stand-company="${slug}"]`
          )?.dataset.selected,
          summary: document.querySelector('.stand-selection'),
        }),
        company.slug
      )
    ).toEqual({
      company: null,
      label: company.name,
      selected: 'false',
      summary: null,
    });

    const topCompany = await page.$eval(
      '.stand-directory li:first-child button',
      (button) => button.dataset.standCompany
    );
    expect(
      await page.$eval(
        `.stand-map__marker[data-stand-company="${topCompany}"]`,
        (marker) => marker.dataset.active
      )
    ).toBe('true');
    expect(new URL(page.url()).searchParams.get('company')).toBeNull();

    await page.focus('#stand-search');
    await page.keyboard.press('Enter');
    await page.waitForFunction(
      (company) =>
        new URL(window.location.href).searchParams.get('company') === company,
      {},
      topCompany
    );
  }, 16000);

  test('Gallery dialog closes with Escape and restores focus', async () => {
    await page.goto(baseUrl + '/galleri', {
      waitUntil: 'domcontentloaded',
    });
    await page.waitForSelector('.gallery-grid button', { visible: true });
    await page.$eval('.gallery-grid button', (element) =>
      element.scrollIntoView({ block: 'center', inline: 'center' })
    );
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
  }, 30000);

  test('Published data is not paired with an unpublished homepage state', async () => {
    await page.goto(baseUrl);
    const programPresentation = await page.evaluate(() => ({
      previewItems: document.querySelectorAll('.program-preview li').length,
      heading: document.querySelector('.current-event-preview__heading h2')
        ?.textContent,
      primaryHeroHref: document
        .querySelector('.event-hero__actions .site-action')
        ?.getAttribute('href'),
      mainLandmarks: document.querySelectorAll('main').length,
    }));

    expect(programPresentation.mainLandmarks).toBe(1);
    if (programPresentation.previewItems > 0) {
      expect(programPresentation.heading).toMatch(
        /Dette skjer under itDAGENE|Nå og neste/
      );
      expect(programPresentation.primaryHeroHref).toBe('/program');
    } else {
      expect(programPresentation.heading).toBe(
        'Programmet publiseres fortløpende'
      );
      expect(programPresentation.primaryHeroHref).not.toBe('/program');
    }
  }, 16000);

  test('Homepage omits helper copy that repeats the visible content', async () => {
    await page.goto(baseUrl);
    const homepageCopy = await page.evaluate(() => ({
      body: document.body.textContent,
      heroPhase: document.querySelector('.event-hero__phase')?.textContent,
    }));

    expect(homepageCopy.body).not.toContain(
      'Gå rett til informasjonen du trenger før og under messedagene.'
    );
    expect(homepageCopy.body).not.toContain(
      'Bilder fra stands, arrangementer og bankett.'
    );
    expect(homepageCopy.body).not.toContain(
      'Bedrifter med en egen samarbeidsavtale med itDAGENE.'
    );
    expect(homepageCopy.body).not.toContain(
      'Et utvalg av arrangementene som er klare for årets messe.'
    );
    expect(homepageCopy.body).not.toContain('Ny utgave kommer');
    expect(homepageCopy.body).not.toContain('Aktive annonser samles her');
    expect(homepageCopy.body).not.toContain('For studenter og bedrifter');
    expect(homepageCopy.heroPhase).not.toBe('Neste utgave');
  }, 16000);
});

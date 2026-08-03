import 'dayjs/locale/nb';
import Image from 'next/image';
import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { WelcomeScreen_currentMetaData } from '../../__generated__/WelcomeScreen_currentMetaData.graphql';
import { itdageneWordmark } from '../../config/brand';
import { ContentState, editionConfig, EventPhase } from '../../config/edition';
import { homepageMedia } from '../../config/homepage';
import { phaseLabel } from '../../utils/eventLifecycle';
import { eventLocalTime } from '../../utils/eventTime';
import {
  resolveEmployerAction,
  resolveHeroActions,
} from '../../utils/homepageActions';
import Countdown from '../Countdown';
import { ActionLink } from '../DesignSystem';
import { useHeroLogoTransition } from './useHeroLogoTransition';

const HERO_TITLE = 'IT-studenter møter næringslivet.';
const HERO_DESCRIPTION =
  'To dager med stands, faglige arrangementer og møter mellom studenter og bedrifter.';

type Props = {
  currentMetaData: WelcomeScreen_currentMetaData;
  eventStartTime?: string;
  phase: EventPhase;
  programState: ContentState;
  standState: ContentState;
  venue: string;
};

const WelcomeScreen = ({
  currentMetaData,
  eventStartTime,
  phase,
  programState,
  standState,
  venue,
}: Props): JSX.Element => {
  const storyRef = React.useRef<HTMLElement>(null);
  const sceneRef = React.useRef<HTMLDivElement>(null);
  const mediaRef = React.useRef<HTMLElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const arrivalRef = React.useRef<HTMLDivElement>(null);
  const compactRef = React.useRef<HTMLDivElement>(null);
  const cueRef = React.useRef<HTMLParagraphElement>(null);
  const logoAnchorRef = React.useRef<HTMLDivElement>(null);
  const assembledLogoRef = React.useRef<HTMLDivElement>(null);
  const interestActionRef = React.useRef<HTMLDivElement>(null);
  const transitionRefs = React.useMemo(
    () => ({
      arrival: arrivalRef,
      assembledLogo: assembledLogoRef,
      compact: compactRef,
      interestAction: interestActionRef,
      logoAnchor: logoAnchorRef,
      media: mediaRef,
      scene: sceneRef,
      scrollCue: cueRef,
      story: storyRef,
      video: videoRef,
    }),
    []
  );
  useHeroLogoTransition(transitionRefs, currentMetaData?.interestForm);

  if (!currentMetaData) {
    return <div className="event-hero event-hero--loading" />;
  }

  const startDate = eventLocalTime(currentMetaData.startDate);
  const endDate = eventLocalTime(currentMetaData.endDate);
  const edition = currentMetaData.year || editionConfig.edition;
  const studentActions = resolveHeroActions({
    phase,
    programState,
    standState,
  });
  const employerAction = resolveEmployerAction(currentMetaData.interestForm);
  const dateLabel = `${startDate.format('D')}.–${endDate.format('D')}. ${endDate
    .locale('nb')
    .format('MMMM')} ${edition}`;

  return (
    <section
      className={`event-hero-story event-hero-story--${phase}`}
      ref={storyRef}
    >
      <div className={`event-hero event-hero--${phase}`} ref={sceneRef}>
        <figure className="event-hero__media" ref={mediaRef}>
          <Image
            alt=""
            fill
            priority
            sizes="100vw"
            src={homepageMedia.hero.src}
            style={{ objectPosition: homepageMedia.hero.focalPoint }}
          />
          <video
            aria-hidden="true"
            loop
            muted
            playsInline
            poster={homepageMedia.hero.src}
            preload="none"
            ref={videoRef}
          />
          <div aria-hidden="true" className="event-hero__media-shade" />
          <figcaption>{homepageMedia.hero.label}</figcaption>
        </figure>

        <div className="event-hero__arrival" ref={arrivalRef}>
          <h1 className="visually-hidden">{HERO_TITLE}</h1>
          <div className="event-hero__arrival-copy" data-arrival-copy>
            <time dateTime={currentMetaData.startDate}>{dateLabel}</time>
            <span>{venue}</span>
          </div>
          <Countdown
            currentMetaData={currentMetaData}
            eventStartTime={eventStartTime}
            phase={phase}
          />
          <div className="event-hero__static-purpose">
            <p>{HERO_TITLE}</p>
            <span>{HERO_DESCRIPTION}</span>
          </div>
          <div
            className="event-hero__arrival-action"
            data-arrival-copy
            data-hero-interest-action
            ref={interestActionRef}
          >
            <ActionLink
              external={Boolean(currentMetaData.interestForm)}
              href={employerAction.href}
              variant="accent"
            >
              {employerAction.label}
            </ActionLink>
          </div>
          <p className="event-hero__scroll-cue" ref={cueRef}>
            Scroll for å utforske
            <span aria-hidden="true">↓</span>
          </p>
        </div>

        <div
          aria-hidden="true"
          className="event-hero__logo-anchor"
          ref={logoAnchorRef}
        />
        <div
          aria-hidden="true"
          className="event-hero__assembled-logo"
          data-hero-logo
          ref={assembledLogoRef}
        >
          <img
            alt=""
            height={itdageneWordmark.height}
            src={itdageneWordmark.src}
            width={itdageneWordmark.width}
          />
        </div>

        <div className="event-hero__compact" ref={compactRef}>
          <div className="event-hero__content">
            {phase !== 'upcoming' && (
              <p className="event-hero__phase">{phaseLabel[phase]}</p>
            )}
            <div className="event-hero__coordinates">
              <time dateTime={currentMetaData.startDate}>{dateLabel}</time>
              <span>{venue}</span>
            </div>
            <p
              aria-hidden="true"
              className="event-hero__resolved-title"
              data-testid="hero-purpose"
            >
              {HERO_TITLE}
            </p>
            <p className="event-hero__description">{HERO_DESCRIPTION}</p>
            <div className="event-hero__actions">
              <ActionLink href={studentActions.primary.href}>
                {studentActions.primary.label}
              </ActionLink>
              {studentActions.secondary && (
                <ActionLink
                  href={studentActions.secondary.href}
                  variant="secondary"
                >
                  {studentActions.secondary.label}
                </ActionLink>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default createFragmentContainer(WelcomeScreen, {
  currentMetaData: graphql`
    fragment WelcomeScreen_currentMetaData on MetaData {
      year
      startDate
      endDate
      interestForm
      ...Countdown_currentMetaData
    }
  `,
});

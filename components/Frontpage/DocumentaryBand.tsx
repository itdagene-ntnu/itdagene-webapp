import Image from 'next/image';
import React from 'react';
import { HomepageMediaItem } from '../../config/homepage';
import { SiteContainer } from '../DesignSystem';

export const DocumentaryBand = ({
  items,
  title,
}: {
  items: HomepageMediaItem[];
  title: string;
}): JSX.Element => (
  <section className="documentary-band" aria-labelledby="documentary-heading">
    <SiteContainer className="documentary-band__heading">
      <h2 id="documentary-heading">{title}</h2>
      <p>Dokumentariske glimt fra itDAGENE på Gløshaugen.</p>
    </SiteContainer>
    <div className="documentary-band__grid">
      {items.map((item, index) => (
        <figure
          className={`documentary-band__item documentary-band__item--${
            index + 1
          }`}
          key={item.src}
        >
          <Image
            alt={item.alt}
            fill
            sizes={
              index === 0
                ? '(max-width: 800px) 100vw, 48vw'
                : '(max-width: 800px) 50vw, 30vw'
            }
            src={item.src}
          />
          {item.label && <figcaption>{item.label}</figcaption>}
        </figure>
      ))}
    </div>
  </section>
);

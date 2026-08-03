import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import Link from 'next/link';
import { PageView_page } from '../../__generated__/PageView_page.graphql';
import ReactMarkdown from 'react-markdown';
import { Player } from 'video-react';
import { PageHeader } from '../DesignSystem';

type Props = {
  page: PageView_page;
  hideContent?: boolean;
  hideTitle?: boolean;
  blueBackground?: boolean;
};

const MarkdownLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}): JSX.Element =>
  href.startsWith('/') ? (
    <Link href={href}>{children}</Link>
  ) : (
    <a href={href} rel="noreferrer" target="_blank">
      {children}
    </a>
  );

const renderers = { link: MarkdownLink };

const PageView = ({
  page,
  hideContent = false,
  hideTitle = false,
  blueBackground = false,
}: Props): JSX.Element => (
  <article
    className={blueBackground ? 'cms-page cms-page--highlight' : 'cms-page'}
  >
    {!hideTitle && <PageHeader title={page.title} />}
    {!hideContent && (
      <div className="cms-page__body">
        <ReactMarkdown renderers={renderers} source={page.content} />
      </div>
    )}
    {page.videoFile && (
      <div className="cms-page__video">
        <Player
          fluid
          playsInline
          src={`https://itdagene.no/uploads/${page.videoFile}`}
        />
      </div>
    )}
  </article>
);

export default createFragmentContainer(PageView, {
  page: graphql`
    fragment PageView_page on Page {
      id
      content
      slug
      title
      dateSaved
      dateCreated
      videoFile
    }
  `,
});

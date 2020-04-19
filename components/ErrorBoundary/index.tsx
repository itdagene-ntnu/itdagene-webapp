import * as React from 'react';
import * as Sentry from '@sentry/browser';

type Props = {
  openReportDialog?: boolean;
  children: any;
  hidden?: boolean;

  /* Reset error when this prop changes */
  resetOnChange?: any;
};

type State = {
  error: Error | null | undefined;
  resetOnChange: any;
  eventId?: string | null | undefined;
};

class ErrorBoundary extends React.Component<Props, State> {
  state: State = {
    error: null,
    resetOnChange: this.props.resetOnChange,
    eventId: null,
  };

  openDialog = (): void => {
    this.state.eventId &&
      Sentry.showReportDialog({ eventId: this.state.eventId });
  };

  static getDerivedStateFromProps(
    nextProps: Props,
    prevState: State
  ): State | null {
    const { resetOnChange } = prevState;
    if (nextProps.resetOnChange !== resetOnChange) {
      return {
        ...prevState,
        resetOnChange,
        error: null,
      };
    }
    return null;
  }

  componentDidCatch(error: Error, errorInfo: Record<string, any>): void {
    this.setState({ error });
    Sentry.withScope((scope) => {
      Sentry.setExtras(errorInfo);
      const eventId = Sentry.captureException(error);
      this.setState({ eventId }, () => {
        this.props.openReportDialog && this.openDialog();
      });
    });
  }

  render(): JSX.Element | null {
    const { openReportDialog, hidden = false, children, ...rest } = this.props;

    if (!this.state.error) {
      return React.Children.map(children, (child) =>
        React.cloneElement(child, { ...rest })
      );
    }
    if (hidden) {
      return null;
    }

    return (
      <div>
        <div
          onClick={(): void | boolean => !openReportDialog && this.openDialog()}
        >
          <div>
            <h3>En feil har oppstått</h3>
            <p>
              Webansvarling har fått beskjed om feilen.{' '}
              {!openReportDialog && this.state.eventId && (
                <span>
                  Klikk <b>her</b> for å sende en rapport.
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;

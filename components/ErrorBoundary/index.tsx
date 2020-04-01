
import * as React from "react";
import Raven from "raven-js";

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
};

class ErrorBoundary extends React.Component<Props, State> {

  state = {
    error: null,
    resetOnChange: this.props.resetOnChange
  };

  openDialog = () => {
    Raven.lastEventId() && Raven.showReportDialog({});
  };

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    const {
      resetOnChange
    } = prevState;
    if (nextProps.resetOnChange !== resetOnChange) {
      return {
        ...prevState,
        resetOnChange,
        error: null
      };
    }
    return null;
  }

  componentDidCatch(error: Error, errorInfo: Object) {
    this.setState({ error });
    Raven.captureException(error, { extra: errorInfo });
    if (this.props.openReportDialog) {
      this.openDialog();
    }
  }

  render() {
    const {
      openReportDialog,
      hidden = false,
      children,
      ...rest
    } = this.props;

    if (!this.state.error) {
      return React.Children.map(children, child => React.cloneElement(child, { ...rest }));
    }
    if (hidden) {
      return null;
    }

    return <div>
        <div onClick={() => !openReportDialog && this.openDialog()}>
          <div>
            <h3>En feil har oppstått</h3>
            <p>
              Webansvarling har fått beskjed om feilen.{' '}
              {!openReportDialog && Raven.lastEventId() && <span>
                  Klikk <b>her</b> for å sende en rapport.
                </span>}
            </p>
          </div>
        </div>
      </div>;
  }
}

export default ErrorBoundary;
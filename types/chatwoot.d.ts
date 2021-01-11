type SDKRunArgs = {
  websiteToken: string;
  baseUrl: string;
};
export interface ChatwootSDK {
  run: (SDKRunArgs) => void;
}

type Position = 'left' | 'right';
type BubbleType = 'expanded_bubble' | 'standard';

export interface Chatwoot {
  baseUrl: string;
  hasLoaded: boolean;
  isInitialized: boolean;
  hideMessageBubble: boolean;
  isOpen: boolean;
  position: Position;
  websiteToken: string;
  locale: string;
  type: BubbleType;
  launcherTitle: string;
  showPopoutButton: boolean;

  toggle: () => void;
  hide: () => void;
  show: () => void;
  reload: () => void;
}

export interface ChatwootSettings {
  type: BubbleType;
  launcherTitle: string;
  showPopoutButton: boolean;
}

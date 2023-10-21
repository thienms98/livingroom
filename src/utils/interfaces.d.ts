export interface Profile {
  username: string;
  createdAt?: Date;
  displayName?: string;
  metadata?: string;
}

type DrawerProps = {
  visible: boolean;
  children?: React.ReactNode;
  className?: string;
  onClose?: () => void;
};

type ContextType = {
  chosenRoom: string | null;
  choosingRoom: (room: string) => void;
  profile: Profile;
  setProfile: (profile: Profile) => void;
};

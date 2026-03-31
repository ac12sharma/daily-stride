export type LeaderboardItem = {
  id: string;
  name: string;
  steps: number;
  avatar: string;
  isCurrentUser?: boolean;
};

export type Reward = {
  id: string;
  title: string;
  description: string;
  progress: number;
  unlocked: boolean;
};

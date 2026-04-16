export type StepData = {
  id: string;
  date: Date;
  steps: number;
};

export type LeaderboardItem = {
  id: string;
  name: string;
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

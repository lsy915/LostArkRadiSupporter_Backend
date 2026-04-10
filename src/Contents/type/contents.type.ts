export interface RewardItem {
  Name: string;
  Icon: string;
  Grade: string;
  StartTimes: string[] | null;
}

export interface RewardGroup {
  ItemLevel: number;
  Items: RewardItem[];
}

export interface CalendarContent {
  CategoryName: string;
  ContentsName: string;
  ContentsIcon: string;
  MinItemLevel: number;
  StartTimes: string[];
  Location: string;
  RewardItems: RewardGroup[];
}

export interface GoldIslandResult {
  ContentsName: string;
  StartTimes: string[];
  Continent: string;
}

import { CrowdOption, WaveHeightOption, WaveQualityOption } from "@/types";

export const WAVE_HEIGHT_OPTIONS: WaveHeightOption[] = [
  {
    id: "wh1",
    label: "Ankle Biters",
    metric: "< 0.3m",
    imageUri: require("@/assets/images/conditions/wave-height-wh1.jpg"),
  },
  {
    id: "wh2",
    label: "Below Knee",
    metric: "0.3 – 0.5m",
    imageUri: require("@/assets/images/conditions/wave-height-wh2.jpg"),
  },
  {
    id: "wh3",
    label: "Knee to Waist",
    metric: "0.5 – 0.9m",
    imageUri: require("@/assets/images/conditions/wave-height-wh3.jpg"),
  },
  {
    id: "wh4",
    label: "Waist to Shoulder",
    metric: "0.9 – 1.2m",
    imageUri: require("@/assets/images/conditions/wave-height-wh4.jpg"),
  },
  {
    id: "wh5",
    label: "Head High",
    metric: "~1.5m",
    imageUri: require("@/assets/images/conditions/wave-height-wh5.jpg"),
  },
  {
    id: "wh6",
    label: "Overhead (1.5x)",
    metric: "1.5 – 2m",
    imageUri: require("@/assets/images/conditions/wave-height-wh6.jpg"),
  },
  {
    id: "wh7",
    label: "Double Overhead",
    metric: "2 – 3m",
    imageUri: require("@/assets/images/conditions/wave-height-wh7.jpg"),
  },
  {
    id: "wh8",
    label: "Triple / Huge!",
    metric: "3m+",
    imageUri: require("@/assets/images/conditions/wave-height-wh8.jpg"),
  },
];

export const WAVE_QUALITY_OPTIONS: WaveQualityOption[] = [
  {
    id: "wq1",
    label: "Blown Out",
    description: "Total mess — strong wind, no shape",
    imageUri: require("@/assets/images/conditions/wave-quality-wq1.png"),
  },
  {
    id: "wq2",
    label: "Choppy",
    description: "Disorganized, short-period, windy",
    imageUri: require("@/assets/images/conditions/wave-quality-wq2.png"),
  },
  {
    id: "wq3",
    label: "Bumpy",
    description: "Rideable but uneven",
    imageUri: require("@/assets/images/conditions/wave-quality-wq3.png"),
  },
  {
    id: "wq4",
    label: "Fair",
    description: "Decent shape, a bit soft or inconsistent",
    imageUri: require("@/assets/images/conditions/wave-quality-wq4.png"),
  },
  {
    id: "wq5",
    label: "Clean",
    description: "Well-formed, consistent lines",
    imageUri: require("@/assets/images/conditions/wave-quality-wq5.png"),
  },
  {
    id: "wq6",
    label: "Glassy",
    description: "Dream conditions, silky smooth surface",
    imageUri: require("@/assets/images/conditions/wave-quality-wq6.png"),
  },
];

export const CROWD_OPTIONS: CrowdOption[] = [
  {
    id: "c1",
    label: "Empty",
    iconName: "Smile", // Retaining iconName in case it's useful for other UI later
    imageUri: require("@/assets/images/conditions/crowd-level-c1.png"),
  },
  {
    id: "c2",
    label: "A few surfers",
    iconName: "User",
    imageUri: require("@/assets/images/conditions/crowd-level-c2.png"),
  },
  {
    id: "c3",
    label: "Manageable",
    iconName: "Users",
    imageUri: require("@/assets/images/conditions/crowd-level-c3.png"),
  },
  {
    id: "c4",
    label: "Busy",
    iconName: "Users",
    imageUri: require("@/assets/images/conditions/crowd-level-c4.png"),
  },
  {
    id: "c5",
    label: "Hectic",
    iconName: "Frown",
    imageUri: require("@/assets/images/conditions/crowd-level-c5.png"),
  },
];

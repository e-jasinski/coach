export interface Profile {
  id?: string; // Usually added by backend/db
  userId?: string; // Usually added by backend/db
  profilePicUrl?: string | null;
  homeCourse?: string | null;
  handicap?: number | null; // Use null for "not set"
  playingFrequency?: string | null;
  yearsPlaying?: number | null;
  goals?: string | null;

  // Full Swing
  driverMisses?: string[]; // Array for checkboxes/multi-select
  driverMissDescription?: string | null;
  driverStrengthRating?: number | null; // 1-5 rating
  ironMisses?: string[];
  ironMissDescription?: string | null;
  ironStrengthRating?: number | null; // 1-5 rating
  swingFocus?: string | null;

  // Short Game
  shortGameMisses?: string[];
  shortGameDescription?: string | null;
  chippingRating?: number | null; // 1-5 rating
  pitchingRating?: number | null; // 1-5 rating
  bunkerRating?: number | null; // 1-5 rating

  // Putting
  puttingMisses?: string[];
  puttingDescription?: string | null;
  shortPuttRating?: number | null; // 1-5 rating
  mediumPuttRating?: number | null; // 1-5 rating
  lagPuttRating?: number | null; // 1-5 rating
  greenReadingRating?: number | null; // 1-5 rating

  // Mental Game
  mentalStrengths?: string[];
  mentalWeaknesses?: string[];
  mentalGameNotes?: string | null;
  preShotRoutine?: string | null;
  favoriteThoughts?: string | null;

  // Equipment
  driverInfo?: string | null;
  ironInfo?: string | null;
  wedgeInfo?: string | null;
  putterInfo?: string | null;

  // Timestamps (optional, if included from backend)
  createdAt?: string;
  updatedAt?: string;
}

// Define options for multi-select/checkboxes
export const driverMissOptions = ['Slice', 'Hook', 'Push', 'Pull', 'Thin', 'Fat', 'Sky'];
export const ironMissOptions = ['Slice', 'Hook', 'Push', 'Pull', 'Thin', 'Fat'];
export const shortGameMissOptions = ['Thin', 'Fat', 'Poor Distance', 'Wrong Club'];
export const puttingMissOptions = ['Poor Speed', 'Pushed', 'Pulled', '3-Putts'];
export const mentalOptions = ['Focus', 'Pressure Handling', 'Recovery', 'Course Mgmt', 'Confidence', 'Tempo']; // Example options 
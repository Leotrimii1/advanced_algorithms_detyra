// ==============================
// TYPES
// ==============================

export interface PriorityBlock {
  start: number;
  end: number;
  allowed_channels: number[];
}

export interface TimePreference {
  start: number;
  end: number;
  preferred_genre: string;
  bonus: number;
}

export interface Program {
  program_id: string;
  start: number;
  end: number;
  genre: string;
  score: number;
}

export interface Channel {
  channel_id: number;
  channel_name: string;
  programs: Program[];
}

export interface Config {
  opening_time: number;
  closing_time: number;
  min_duration: number;
  max_duration: number;
  min_score: number;
  max_score: number;
  max_consecutive_genre: number;
  channels_count: number;
  switch_penalty: number;
  termination_penalty: number;
  priority_blocks?: PriorityBlock[];
  time_preferences?: TimePreference[];
  channels?: Channel[];
}

export function generateSchedule(config: Config): Config {
  const {
    opening_time,
    closing_time,
    min_duration,
    max_duration,
    min_score,
    max_score,
    channels_count,
    priority_blocks: userPriorityBlocks,
    time_preferences: userTimePreferences,
  } = config;

  const GENRES = [
    "news",
    "sports",
    "music",
    "movies",
    "kids",
    "documentary",
  ];

  const rand = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const pickGenre = () => GENRES[rand(0, GENRES.length - 1)];

  // Use user-provided priority blocks or generate them
  const priority_blocks: PriorityBlock[] = userPriorityBlocks && userPriorityBlocks.length > 0
    ? userPriorityBlocks.map((block: any) => ({
        start: block.start,
        end: block.end,
        allowed_channels: block.allowed_channels,
      }))
    : Array.from({
        length: rand(1, 3),
      }).map(() => {
        const start = rand(opening_time, closing_time - min_duration);
        const end = rand(start + min_duration, closing_time);

        return {
          start,
          end,
          allowed_channels: Array.from({ length: rand(1, 4) }).map(() =>
            rand(0, channels_count - 1)
          ),
        };
      });

  // Use user-provided time preferences or generate them
  const time_preferences: TimePreference[] = userTimePreferences && userTimePreferences.length > 0
    ? userTimePreferences.map((pref: any) => ({
        start: pref.start,
        end: pref.end,
        preferred_genre: pref.preferred_genre,
        bonus: pref.bonus,
      }))
    : Array.from({
        length: rand(1, 3),
      }).map(() => {
        const start = rand(opening_time, closing_time - min_duration);
        const end = rand(start + min_duration, closing_time);

        return {
          start,
          end,
          preferred_genre: pickGenre(),
          bonus: rand(10, 50),
        };
      });

  // Generate channels with programs
  const channels: Channel[] = Array.from({
    length: channels_count,
  }).map((_, channelId) => {
    let programs: Program[] = [];
    let currentStart = opening_time;
    let consecutiveGenreCount = 0;
    let lastGenre = "";

    while (currentStart < closing_time) {
      // Calculate available time
      const remainingTime = closing_time - currentStart;
      if (remainingTime < min_duration) break;

      // Generate duration within min/max constraints
      const maxPossibleDuration = Math.min(max_duration, remainingTime);
      const duration = rand(min_duration, maxPossibleDuration);
      const end = currentStart + duration;

      // Pick genre (avoid too many consecutive same genres)
      let genre = pickGenre();
      if (genre === lastGenre && consecutiveGenreCount >= config.max_consecutive_genre) {
        // Force different genre
        const otherGenres = GENRES.filter(g => g !== lastGenre);
        genre = otherGenres[rand(0, otherGenres.length - 1)];
        consecutiveGenreCount = 0;
      } else if (genre === lastGenre) {
        consecutiveGenreCount++;
      } else {
        consecutiveGenreCount = 1;
        lastGenre = genre;
      }

      // Generate score within min/max constraints
      const score = rand(min_score, max_score);

      programs.push({
        program_id: `channel_${channelId}_program_${programs.length + 1}`,
        start: currentStart,
        end,
        genre,
        score,
      });

      currentStart = end;
    }

    return {
      channel_id: channelId,
      channel_name: `Channel_${channelId}`,
      programs,
    };
  });

  return {
    ...config,
    priority_blocks,
    time_preferences,
    channels,
  };
}

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
    channels_count,
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

  const priority_blocks: PriorityBlock[] = Array.from({
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

  const time_preferences: TimePreference[] = Array.from({
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

  const channels: Channel[] = Array.from({
    length: channels_count,
  }).map((_, channelId) => {
    let programs: Program[] = [];
    let currentStart = opening_time;

    while (currentStart < closing_time) {
      const duration = rand(min_duration, min_duration + 60);
      const end = Math.min(currentStart + duration, closing_time);

      programs.push({
        program_id: `${channelId}_${programs.length + 1}`,
        start: currentStart,
        end,
        genre: pickGenre(),
        score: rand(10, 100),
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

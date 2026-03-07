export const Colors = {
  primary: '#1DB954',      // Verde principal
  primaryDark: '#158a3e',
  yellow: '#F5A623',
  red: '#E74C3C',
  green: '#27AE60',

  background: '#F8F9FA',
  surface: '#FFFFFF',
  border: '#E9ECEF',

  text: '#1A1A2E',
  textSecondary: '#6C757D',
  textLight: '#ADB5BD',

  scoreGreen: '#27AE60',
  scoreYellow: '#F39C12',
  scoreRed: '#E74C3C',

  white: '#FFFFFF',
  black: '#000000',
} as const;

export type ScoreLabel = 'green' | 'yellow' | 'red';

export const ScoreColors: Record<ScoreLabel, string> = {
  green: Colors.scoreGreen,
  yellow: Colors.scoreYellow,
  red: Colors.scoreRed,
};

export const ScoreEmoji: Record<ScoreLabel, string> = {
  green: 'Saludable',
  yellow: 'Moderado',
  red: 'Poco saludable',
};

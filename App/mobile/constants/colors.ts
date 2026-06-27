export const Colors = {
  primary: '#4A6B3D',      // Verde oliva/bosque (marca)
  primaryDark: '#374F2D',
  primaryLight: '#E7EDE1',

  info: '#0B6FA8',         // Acento informativo (premium/comunidad) — separado de marca y salud
  infoBg: '#E5F1F8',
  infoBorder: '#BBDCEE',
  infoText: '#074F78',

  yellow: '#C97A0A',
  red: '#C7423D',
  green: '#1E8E5A',

  background: '#F6F8F9',
  surface: '#FFFFFF',
  border: '#D7DEE3',

  text: '#16212B',
  textSecondary: '#51626F',
  textLight: '#8B98A3',

  scoreGreen: '#1E8E5A',
  scoreGreenBg: '#E3F5EB',
  scoreGreenBorder: '#BEE6CD',
  scoreGreenText: '#155724',

  scoreYellow: '#C97A0A',
  scoreYellowBg: '#FDF1DD',
  scoreYellowBorder: '#F6DDAA',
  scoreYellowText: '#856404',

  scoreRed: '#C7423D',
  scoreRedBg: '#FBE7E6',
  scoreRedBorder: '#F0BFBD',
  scoreRedText: '#721C24',

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

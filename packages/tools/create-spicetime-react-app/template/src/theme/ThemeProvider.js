import React from 'react';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';

const theme = {
  colors: {
    primary: '#0070f3',
    background: '#f4f4f4',
    text: '#333',
  },
  spacing: (factor) => `${factor * 8}px`,
};

export const ThemeProvider = ({ children }) => (
  <EmotionThemeProvider theme={theme}>{children}</EmotionThemeProvider>
);
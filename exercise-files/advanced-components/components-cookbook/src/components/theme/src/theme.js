import React from 'react';

//Creating a React context to hold the theme
export const themeContext = React.createContext(themes.dark);

export const themes = {
  light: {
    foreground: '#222222',
    background: '#e9e9e9'
  },
  dark: {
    foreground: '#fff',
    background: '#222222'
  }
};

export const ThemeContext = React.createContext(themes.dark);

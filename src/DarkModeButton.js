import { IconButton } from '@material-ui/core';
import { BrightnessHigh, BrightnessMedium } from '@material-ui/icons';
import React, { useCallback } from 'react';
import { useDarkMode } from './theme';

export default function DarkModeButton() {
  const { darkMode, setDarkMode } = useDarkMode();
  const toggleDarkMode = useCallback(() => setDarkMode(!darkMode), [darkMode, setDarkMode]);

  return (
    <IconButton color="inherit" onClick={toggleDarkMode}>
      {darkMode ? <BrightnessHigh /> : <BrightnessMedium />}
    </IconButton>
  );
}

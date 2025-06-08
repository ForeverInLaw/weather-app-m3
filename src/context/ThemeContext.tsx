'use client';

import React, { createContext, useState, useMemo, useContext, useEffect, useRef } from 'react';
import { ThemeProvider as MuiThemeProvider, Theme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getAppTheme } from '@/styles/theme'; // Ensure this path is correct

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleThemeMode: () => void; // Event is no longer needed for full-screen fade
}

export const AppThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useAppTheme = () => {
  const context = useContext(AppThemeContext);
  if (context === undefined) {
    throw new Error('useAppTheme must be used within an AppThemeProvider');
  }
  return context;
};

interface AppThemeProviderProps {
  children: React.ReactNode;
}

export const AppThemeProvider: React.FC<AppThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('light');
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Effect to load saved theme mode from localStorage or detect system preference
  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode') as ThemeMode | null;
    if (savedMode) {
      setMode(savedMode);
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setMode(prefersDark ? 'dark' : 'light');
    }
  }, []);

  const toggleThemeMode = () => {
    if (isAnimating || !overlayRef.current) return;

    setIsAnimating(true);
    const overlay = overlayRef.current;
    const currentTheme = getAppTheme(mode); 
    const newMode = mode === 'light' ? 'dark' : 'light';
    const newTheme = getAppTheme(newMode); 

    overlay.style.backgroundColor = currentTheme.palette.background.default;
    overlay.style.opacity = '0'; 
    overlay.style.pointerEvents = 'auto'; 
    overlay.style.clipPath = ''; // Ensure no clip-path from previous animation

    const fadeInAnimation = overlay.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 250, 
      easing: 'ease-in',
      fill: 'forwards', 
    });

    fadeInAnimation.onfinish = () => {
      setMode(newMode);
      localStorage.setItem('themeMode', newMode);

      requestAnimationFrame(() => {
        if (overlayRef.current) {
            overlayRef.current.style.backgroundColor = newTheme.palette.background.default;
            
            const fadeOutAnimation = overlayRef.current.animate([{ opacity: 1 }, { opacity: 0 }], {
                duration: 350, 
                easing: 'ease-out',
                fill: 'forwards', 
            });

            fadeOutAnimation.onfinish = () => {
                if(overlayRef.current) {
                    overlayRef.current.style.pointerEvents = 'none';
                    // Opacity is 0 due to fill: 'forwards'. Reset background for next time if needed.
                    // overlayRef.current.style.backgroundColor = 'transparent'; 
                }
                setIsAnimating(false);
            };
        } else {
             setIsAnimating(false); 
        }
      });
    };
  };
  
  const activeTheme = useMemo(() => getAppTheme(mode), [mode]);

  return (
    <AppThemeContext.Provider value={{ mode, toggleThemeMode }}>
      <MuiThemeProvider theme={activeTheme}>
        <CssBaseline />
        {children}
        <div
          ref={overlayRef}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999,
            pointerEvents: 'none', 
            opacity: 0, 
            backgroundColor: 'transparent', 
          }}
        />
      </MuiThemeProvider>
    </AppThemeContext.Provider>
  );
};

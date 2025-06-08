'use client';

import * as React from 'react';
// ThemeProvider and CssBaseline will now be handled by AppThemeProvider
// import { ThemeProvider } from '@mui/material/styles'; 
// import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'; 
// import theme from '@/styles/theme'; // No longer needed here, AppThemeProvider handles theme selection
import { AppThemeProvider } from '@/context/ThemeContext'; // Import our new provider

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ key: 'mui' }}>
      <AppThemeProvider> {/* AppThemeProvider now wraps MuiThemeProvider and CssBaseline */}
        {children}
      </AppThemeProvider>
    </AppRouterCacheProvider>
  );
}

"use client";
import { baselightTheme } from "@/utils/theme/DefaultColors";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "./global.css";
import { DashboardContextProvider } from './context/DashboardContext';
import { AuthProvider } from './context/AuthContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/favicon.ico" />
        <title>Spike Next.js + Ts + Mui</title>
      </head>
      <body>
        <ThemeProvider theme={baselightTheme}>
          <CssBaseline />
          <AuthProvider>
            <DashboardContextProvider>
              {children}
            </DashboardContextProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

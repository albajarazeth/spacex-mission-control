import type { Metadata } from "next";
import { Instrument_Sans, Inter_Tight } from "next/font/google";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "SpaceX Mission Control Dashboard",
  description: "SpaceX Launch Analytics Dashboard",
  icons: {
    icon: "/white-logo.png",
    shortcut: "/white-logo.png",
    apple: "/white-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !(function() {
                try {
                  var theme = localStorage.getItem('dashboard-theme') || 'light';
                  var html = document.documentElement;
                  if (theme === 'dark') {
                    html.classList.add('dark');
                    html.setAttribute('data-theme', 'dark');
                  } else {
                    html.classList.remove('dark');
                    html.setAttribute('data-theme', 'light');
                  }
                  html.classList.add('theme-ready');
                } catch (e) {
                  document.documentElement.classList.add('theme-ready');
                }
              })();
            `,
          }}
        />
        <link rel="icon" href="/white-logo.png" type="image/png" />
        <link rel="shortcut icon" href="/white-logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/white-logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&family=Instrument+Sans:ital,wght@0,400..700;1,400..700&family=Inter+Tight:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${instrumentSans.variable} ${interTight.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

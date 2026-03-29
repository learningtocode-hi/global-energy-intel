import type { Metadata } from 'next';
import './globals.css';
// Removing local node_modules import because Next.js Turbopack often drops it:
// import 'mapbox-gl/dist/mapbox-gl.css';

export const metadata: Metadata = {
  title: 'Global Energy Intelligence',
  description: 'Geospatial Operating Picture',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://api.mapbox.com/mapbox-gl-js/v3.1.2/mapbox-gl.css" rel="stylesheet" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <div className="scanlines"></div>
        {children}
      </body>
    </html>
  );
}

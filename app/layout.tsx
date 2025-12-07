import React from 'react';
import './globals.css';

export const metadata = {
  title: 'Titanium Fit AI',
  description: 'Seu assistente pessoal de musculação',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                darkMode: 'class',
                theme: {
                  extend: {
                    colors: {
                      primary: '#3b82f6',
                      secondary: '#64748b',
                      dark: '#0f172a',
                      darker: '#020617',
                      card: '#1e293b',
                    }
                  }
                }
              }
            `,
          }}
        />
      </head>
      <body className="bg-[#020617] text-slate-100 antialiased h-screen overflow-hidden">
        {children}
      </body>
    </html>
  );
}
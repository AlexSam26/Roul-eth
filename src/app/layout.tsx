import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ROUL\'ETH - Crypto Roulette Game',
  description: 'Play the ultimate crypto roulette game on the blockchain. Bet with ETH and win big!',
  keywords: 'crypto, roulette, gambling, ethereum, web3, blockchain',
  authors: [{ name: 'ROUL\'ETH Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ff0000',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Supprimer l'attribut cz-shortcut-listen ajouté par les extensions
              if (typeof window !== 'undefined') {
                const observer = new MutationObserver((mutations) => {
                  mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'cz-shortcut-listen') {
                      const body = document.querySelector('body');
                      if (body && body.hasAttribute('cz-shortcut-listen')) {
                        body.removeAttribute('cz-shortcut-listen');
                      }
                    }
                  });
                });
                
                observer.observe(document.body, {
                  attributes: true,
                  attributeFilter: ['cz-shortcut-listen']
                });
              }
            `,
          }}
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

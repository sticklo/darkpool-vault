
import type { Metadata } from "next";
import { Inter, Source_Code_Pro } from "next/font/google";
import { RootProvider } from "./rootProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
});

const frameMetadata = {
  "fc:frame": "vNext",
  "fc:frame:image": "https://darkpool-vault.netlify.app/og-image.png",
  "fc:frame:button:1": "Open DarkPool",
  "fc:frame:button:1:action": "link",
  "fc:frame:button:1:target": "https://darkpool-vault.netlify.app",
};

export const metadata: Metadata = {
  title: "DarkPool Vault - Social DCA on Base",
  description: "Transparent, social, pooled DCA investing on Base via Farcaster",
  openGraph: {
    title: "DarkPool Vault",
    description: "Social DCA investing on Base",
    images: ["https://darkpool-vault.netlify.app/og-image.png"],
  },
  other: frameMetadata,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${sourceCodePro.variable}`}>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}

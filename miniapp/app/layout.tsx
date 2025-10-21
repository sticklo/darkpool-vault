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

const miniappMetadata = {
  "fc:miniapp": JSON.stringify({
    version: "1",
    imageUrl: "https://darkpool-vault.netlify.app/og-image.png",
    button: {
      title: "Open DarkPool",
      action: {
        type: "launch_miniapp",
        url: "https://darkpool-vault.netlify.app",
        name: "DarkPool Vault",
        splashImageUrl: "https://darkpool-vault.netlify.app/og-image.png",
        splashBackgroundColor: "#0f172a",
      },
    },
  }),
  // Add additional miniapp meta tags
  "fc:miniapp:version": "1",
  "fc:miniapp:image": "https://darkpool-vault.netlify.app/og-image.png",
  "fc:miniapp:button": "Open DarkPool",
};

// Removed frame metadata to avoid conflicts with miniapp

export const metadata: Metadata = {
  title: "DarkPool Vault - Social DCA on Base",
  description:
    "Transparent, social, pooled DCA investing on Base via Farcaster",
  openGraph: {
    title: "DarkPool Vault",
    description: "Social DCA investing on Base",
    images: ["https://darkpool-vault.netlify.app/og-image.png"],
  },
  other: {
    ...miniappMetadata,
  },
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

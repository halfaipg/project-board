import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Project Board - Modern Task Management",
  description: "A collaborative project board for teams to manage tasks, track progress, and streamline communication with clients and stakeholders.",
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
  openGraph: {
    title: "Project Board - Modern Task Management",
    description: "A real-time collaborative project board with task management, team assignments, and client sharing capabilities.",
    images: [
      {
        url: "/project-board-ss-small.png",
        width: 1200,
        height: 630,
        alt: "Project Board Screenshot"
      }
    ],
    url: "https://project-board.generalconcepts.ai",
    siteName: "Project Board",
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Project Board - Modern Task Management",
    description: "A real-time collaborative project board with task management, team assignments, and client sharing capabilities.",
    images: ["/project-board-ss-small.png"]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

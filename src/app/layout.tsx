import type { Metadata } from "next";
import "./globals.scss";
import ThemeRegistry from "@/lib/ThemeRegistry";
import ReactQueryProvider from "@/lib/ReactQueryProvider";

export const metadata: Metadata = { title: "Campaign Dashboard", description: "Campaign dashboard" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}

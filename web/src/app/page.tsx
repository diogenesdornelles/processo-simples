import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Processo Fácil - Home",
  description: "Sistema de gestão de processos judiciais",
  keywords: ["processo", "gestão"],
  authors: [{ name: "Processo Fácil Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function IndexPage() {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable}`}>Index Page</div>
  );
}

import { Raleway, Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "700"],
});

export const metadata = {
  title: {
    default: "Terranova — Propiedades en Naturaleza",
    template: "%s | Terranova",
  },
  description:
    "Terranova es tu inmobiliaria especializada en propiedades de venta y alquiler en los destinos turísticos naturales más exclusivos de España. Mallorca, Costa Brava, Asturias, Sierra Nevada y más.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${raleway.variable} ${roboto.variable}`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

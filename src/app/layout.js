import { Raleway } from "next/font/google";
import "./globals.css";
import { Fade } from "react-awesome-reveal";
import { Toaster } from "@/components/ui/sonner";
import { LoadingProvider } from "@/context/LoadingContext";
const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Sistema de Continuidades",
  description: "Agencia Nacional de Aduanas de México",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${raleway.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LoadingProvider>
          <Toaster />
          <Fade triggerOnce>
            {children}
          </Fade>
        </LoadingProvider>
      </body>
    </html>
  );
}

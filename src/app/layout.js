import "./globals.css";
import { Toaster } from "sonner";
import { Web3Provider } from "../provider/Web3Provider";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Web3Provider>
          <Toaster richColors />
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}

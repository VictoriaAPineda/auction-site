import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import SesssionContext from "./context/SessionContext";
import "./globals.scss";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
     <head>
      <title>Auction Site</title>
     </head>
      <body>
        <SesssionContext>
          <Navbar/>
          {children}
          <Footer/>
        </SesssionContext>
      </body>
    </html>
  );
}

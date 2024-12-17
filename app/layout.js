import "./globals.css";
import Header from "@/components/header";


export const metadata = {
  title: "Post Website",
  description: "Welcome to Twitter-like Post Website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>

        <Header />
      <main>
        {children}
      </main>
      </body>
    </html>
  );
}

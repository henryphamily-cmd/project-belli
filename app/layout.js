import "./globals.css";

export const metadata = {
  title: "Bellibox | Restaurant Diary",
  description: "Beli-inspired restaurant tracking with Letterboxd-style diary and feed"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

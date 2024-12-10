import { config } from "../accountKitConfig";
import { cookieToInitialState } from "@account-kit/core";
import { Providers } from "./providers";
 
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // This will allow us to persist state across page boundaries (read more here: https://accountkit.alchemy.com/react/ssr#persisting-the-account-state)
  const initialState = cookieToInitialState(
    config,
    document.cookie
  );
 
  return (
    <html lang="en">
      <body >
        <Providers initialState={initialState}>{children}</Providers>
      </body>
    </html>
  );
}
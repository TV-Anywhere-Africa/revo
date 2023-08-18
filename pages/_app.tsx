import "~/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { QueryClient } from "react-query";
import Meta from "~/components/Meta";

export const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Meta />
      <ThemeProvider attribute="class">
        <Toaster />
        {/* <QueryClientProvider client={queryClient}> */}
        <Component {...pageProps} />
        {/* <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider> */}
      </ThemeProvider>
    </>
  );
}

import { type AppType } from "next/app";
import { Geist } from "next/font/google";

import { api } from "~/utils/api";

import "@mantine/core/styles.css";

import { createTheme, MantineProvider } from "@mantine/core";

const geist = Geist({
  subsets: ["latin"],
});

const theme = createTheme({
  /** Put your mantine theme override here */
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className={geist.className}>
      <MantineProvider theme={theme}>
        <Component {...pageProps} />
      </MantineProvider>
    </div>
  );
};

export default api.withTRPC(MyApp);

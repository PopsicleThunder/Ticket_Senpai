import { ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";
import { Notifications } from "@mantine/notifications";
import { AppHeader } from "./components/AppHeader";
// import "@/styles/globals.css";
import { AnonAadhaarProvider } from "anon-aadhaar-react";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base, zora } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

// import { AppHeader } from "@/components/app-header";

export default function App({ Component, pageProps }) {
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });

  function toggleColorScheme(value) {
    return setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  }

  useHotkeys([["mod+J", () => toggleColorScheme()]]);

  const app_id = process.env.NEXT_PUBLIC_APP_ID || "";

  const { chains, publicClient } = configureChains(
    [mainnet, polygon, optimism, arbitrum, base, zora],
    [alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()]
  );
  const { connectors } = getDefaultWallets({
    appName: "My RainbowKit App",
    projectId: "YOUR_PROJECT_ID",
    chains,
  });
  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
  });

  return (
    <div>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
          <AnonAadhaarProvider _appId={app_id}>
            <ColorSchemeProvider
              colorScheme={colorScheme}
              toggleColorScheme={toggleColorScheme}
            >
              <MantineProvider
                theme={{ colorScheme }}
                withGlobalStyles
                withNormalizeCSS
              >
                <Notifications />
                <AppHeader
                  links={[
                    { link: "/", label: "Home" },
                    { link: "event", label: "Events" },
                    // { link: "/edit", label: "Edit" },
                    { link: "/host", label: "Host an Event?" },
                  ]}
                />
                <Component {...pageProps} />
              </MantineProvider>
            </ColorSchemeProvider>
          </AnonAadhaarProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </div>
  );
}

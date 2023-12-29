import "./styles/globals.css";
import "./styles/lib/markdown.css";
import "./styles/lib/highlight.css";

import Locale from "./locales";
import { type Metadata } from "next";
import { Toaster } from "@/app/components/ui/toaster";
import { ThemeProvider } from "@/app/components/layout/theme-provider";
import Dashboard from "@/app/components/aiu/Dashboard";
import { Header } from "./components/aiu/Header";
import { WagmiConfig } from "wagmi";
import { wagmiConfig } from "./web3/wagmiConfig";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { appChains } from "./web3/wagmiConnectors";
import { BlockieAvatar } from "./components/aiu/scaffold-eth";

export const metadata: Metadata = {
    title: Locale.Welcome.Title,
    description: Locale.Welcome.SubTitle,
    viewport: {
        width: "device-width",
        initialScale: 1,
        maximumScale: 1,
    },
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
    appleWebApp: {
        title: Locale.Welcome.Title,
        statusBarStyle: "default",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <WagmiConfig config={wagmiConfig}>

                <head>
                    <Header />
                    <link rel="manifest" href="/site.webmanifest"></link>
                    <script src="/serviceWorkerRegister.js" defer></script>
                </head>
                <body>


                    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                        <Dashboard>
                            {children}
                            <Toaster />
                        </Dashboard>
                    </ThemeProvider>

                </body>

            </WagmiConfig>


        </html>
    );
}


/*"use client"
import type { AppProps } from "next/app";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import NextNProgress from "nextjs-progressbar";
import { ToastBar, Toaster, toast } from "react-hot-toast";
import { useDarkMode } from "usehooks-ts";
import { WagmiConfig } from "wagmi";
import { Footer } from "~~/components/Footer";
import { Header } from "~~/components/Header";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import "~~/globals.css";
import { useNativeCurrencyPrice } from "~~/hooks/scaffold-eth";
import { useGlobalState, useQuipuxStore, useAppStore } from "~~/services/store/store";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";
import { appChains } from "~~/services/web3/wagmiConnectors";
import { useProvider, useSigner } from "~~/utils/wagmi-utils";
import { useAccount, useBlockNumber } from "wagmi";
import { EAS, Offchain, SchemaEncoder, SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
import { useDeployedContractInfo, useScaffoldContract } from "~~/hooks/scaffold-eth";

import React, { useContext, useEffect, useState } from "react";

import { QueryClient, QueryClientProvider } from "react-query";

import { ErrorBoundary } from "~~/components/chatComponents/layout/error";

import {
    HashRouter as Router,
} from "react-router-dom";



const ScaffoldEthApp = ({ Component, pageProps }: AppProps) => {
    const price = useNativeCurrencyPrice();
    const quipux = useQuipuxStore();
    const setNativeCurrencyPrice = useGlobalState(state => state.setNativeCurrencyPrice);
    const setDeployedContract = useAppStore(state => state.setContractInstance);
    const { data: deployedContract } = useDeployedContractInfo("WarpDrive");
    const { data } = useScaffoldContract({
        contractName: "WarpDrive"
    });


    const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e";
    const eas = new EAS(EASContractAddress);

    const fetchDb = async () => {

        // Initialize the sdk with the address of the EAS Schema contract address
        quipux.setEas(eas);

        try {
            const response = await fetch("http://0.0.0.0:3000/aiu/database"); // assume the same host
            ;
            const json = await response.json();
            console.log(json, "Player data from DB");
            quipux.setDatabase(json)

        } catch (e: any) {
            console.log(e.message);


        }
    };


    useEffect(() => {
        fetchDb();
    }, []);

    useEffect(() => {
        if (data) {
            setDeployedContract(data);
            console.log("Deployed contract set to", data);
        }
    }, [data])

    useEffect(() => {
        if (price > 0) {
            setNativeCurrencyPrice(price);
        }
    }, [setNativeCurrencyPrice, price]);

    return (
        <>
            <div className="fixed flex-col min-h-screen">
                <main className="relative flex flex-col flex-1">
                    <Header />

                    <Component {...pageProps} />

                </main>
                <Footer />
            </div>
        </>
    );
};

const ScaffoldEthAppWithProviders = (props: AppProps) => {
    // This variable is required for initial client side rendering of correct theme for RainbowKit

    const [isDarkTheme, setIsDarkTheme] = useState(true);
    const { isDarkMode } = useDarkMode();
    useEffect(() => {
        setIsDarkTheme(isDarkMode);
    }, [isDarkMode]);
    const queryClient = new QueryClient();


    return (

        <Router>
            <WagmiConfig config={wagmiConfig}>
                <NextNProgress />
                <RainbowKitProvider
                    chains={appChains.chains}
                    avatar={BlockieAvatar}
                    theme={isDarkTheme ? darkTheme() : lightTheme()}
                >
                    <ErrorBoundary>
                        <QueryClientProvider client={queryClient}>
                            <SidebarContextProvider>
                                <ScaffoldEthApp {...props} />
                            </SidebarContextProvider>
                        </QueryClientProvider>
                    </ErrorBoundary>

                </RainbowKitProvider>
            </WagmiConfig>

        </Router>
    );
};

export default ScaffoldEthAppWithProviders;*/

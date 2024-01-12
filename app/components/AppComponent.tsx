"use client"
import React, { useCallback, useContext, useEffect, useState } from "react"
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { Toaster } from "react-hot-toast";
import { WagmiConfig, erc721ABI, useAccount, useContractEvent, usePublicClient } from "wagmi";
import { BlockieAvatar } from "./scaffold-eth";
import { wagmiConfig } from "@/app/web3/wagmiConfig";
import { appChains } from "@/app/web3/wagmiConnectors";
import AudioController from "./aiu/AudioController";
import { Sounds } from "../types/appTypes";
import { QueryClient, QueryClientProvider } from "react-query";
import { useMobileScreen } from "../utils/mobile";
import dynamic from "next/dynamic";
import { Path } from "../constant";
import { ErrorBoundary } from "./layout/error";
import {
    Route,
    HashRouter as Router,
    Routes,
    useNavigate,
} from "react-router-dom";
import { Bot, useBotStore } from "../store/bot";
import { SideBar } from "./layout/sidebar";
import { LoadingPage } from "@/app/components/ui/loading";
import TargetDataDisplay from "./aiu/panels/TargetDataDisplay";
import { useQuipuxStore, useAppStore, useSoundController } from "@/app/store/store";
import { EAS } from "@ethereum-attestation-service/eas-sdk";

import { parseAbiItem } from 'viem'
import { Header } from "./Header";
import { useDeployedContractInfo, useScaffoldEventHistory } from "../hooks/aiu/scaffold-eth";

export const SettingsPage = dynamic(
    async () => (await import("./settings")).Settings,
    {
        loading: () => <LoadingPage />,
    },
);

const ChatPage = dynamic(async () => (await import("./chat/chat")).Chat, {
    loading: () => <LoadingPage />,
});

const useHasHydrated = () => {
    const [hasHydrated, setHasHydrated] = useState<boolean>(false);

    useEffect(() => {
        setHasHydrated(true);
    }, []);

    return hasHydrated;
};

const loadAsyncGoogleFont = () => {
    const linkEl = document.createElement("link");
    const googleFontUrl = "https://fonts.googleapis.com";
    linkEl.rel = "stylesheet";
    linkEl.href =
        googleFontUrl + "/css2?family=Noto+Sans:wght@300;400;700;900&display=swap";
    document.head.appendChild(linkEl);
};

// if a bot is passed this HOC ensures that the bot is added to the store
// and that the user can directly have a chat session with it
export function withBot(Component: React.FunctionComponent, bot?: Bot) {
    return function WithBotComponent() {
        const [botInitialized, setBotInitialized] = useState(false);
        const navigate = useNavigate();
        const botStore = useBotStore();
        if (bot && !botInitialized) {
            if (!bot.share?.id) {
                throw new Error("bot must have a shared id");
            }
            // ensure that bot for the same share id is not created a 2nd time
            let sharedBot = botStore.getByShareId(bot.share?.id);
            if (!sharedBot) {
                sharedBot = botStore.create(bot, { readOnly: true });
            }
            // let the user directly chat with the bot
            botStore.selectBot(sharedBot.id);
            setTimeout(() => {
                // redirect to chat - use history API to clear URL
                history.pushState({}, "", "/");
                navigate(Path.Chat);
            }, 1);
            setBotInitialized(true);
            return <LoadingPage />;
        }

        return <Component />;
    };
}

const SidebarContext = React.createContext<{
    showSidebar: boolean;
    setShowSidebar: (show: boolean) => void;
} | null>(null);

function SidebarContextProvider(props: { children: React.ReactNode }) {
    const [showSidebar, setShowSidebar] = useState(true);
    return (
        <SidebarContext.Provider value={{ showSidebar, setShowSidebar }}>
            {props.children}
        </SidebarContext.Provider>
    );
}

export const useSidebarContext = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error(
            "useSidebarContext must be used within an SidebarContextProvider",
        );
    }
    return context;
};

export function Screen() {
    const isMobileScreen = useMobileScreen();
    const { showSidebar } = useSidebarContext();

    const showSidebarOnMobile = showSidebar || !isMobileScreen;

    useEffect(() => {
        loadAsyncGoogleFont();
    }, []);

    const displayTypes = ["chat", "sidebar"];
    switch (displayTypes[0]) {
        case "chat":
            // Custom interface for image data


            return (
                <>
                    <div className="flex flex-row pb-12 hex-prompt color-white">
                        <Routes>
                            <Route path={Path.Chat} element={<ChatPage />} />
                            <Route path={Path.Settings} element={<SettingsPage />} />
                        </Routes>
                    </div>
                </>
            );

        case "sidebar":
            return (
                <>

                    <div className="flex flex-row pb-12">

                        {showSidebarOnMobile && <SideBar />}
                        <TargetDataDisplay />

                    </div>
                </>
            );
        default:
            return (
                <>

                </>
            );
    }


}

export const BotScreen = withBot(Screen);



export const AppComponent = ({ children }: { children: React.ReactNode }) => {

    const quipux = useQuipuxStore();
    const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e";
    const eas = new EAS(EASContractAddress);

    const usdcContractAddress = '0xd74c4701cc887ab8b6b5302ce4868c4fbc23de75'
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

    if (!useHasHydrated()) {
        return <LoadingPage />;
    }

    const queryClient = new QueryClient();

    return (
        <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider
                chains={appChains.chains}
                avatar={BlockieAvatar}
                theme={darkTheme()}
            >

                <ErrorBoundary>
                    <Router>
                        <QueryClientProvider client={queryClient}>
                            <SidebarContextProvider>

                                <div className="flex flex-col min-h-screen">

                                    <main className="relative flex flex-col flex-1">{children}</main>

                                </div>
                            </SidebarContextProvider>
                        </QueryClientProvider>
                    </Router>
                </ErrorBoundary>

                <Toaster />
            </RainbowKitProvider>
        </WagmiConfig>
    );
};

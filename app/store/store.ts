import { create } from "zustand";
import scaffoldConfig from "@/app/scaffold.config";
import type {
    AIUBroadcast,
    Encounter,
    Universe,
    Planet,
    Quest,
    Item,
    Sounds,
    PlayerState,
    MidjourneyConfig,
    NftData,
    PilotState,
    Quipux,
} from "@/app/types/appTypes";
import { TChainAttributes as ChainWithAttributes } from "@/app/utils/scaffold-eth";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";


export type ImageStoreState = {
    imageUrl: string;
    setImageUrl: (imageUrl: string) => void;
    backgroundImageUrl: string;
    setBackgroundImageUrl: (backgroundImageUrl: string) => void;
    displayImageUrl: string;
    setDisplayImageUrl: (displayImageUrl: string) => void;
    srcUrl: string;
    setSrcUrl: (srcUrl: string) => void;
    targetUrl: string;
    setTargetUrl: (targetUrl: string) => void;

    resetImages: () => void;
};

export type SoundController = {
    sounds: Sounds;
    setSounds: (sounds: Sounds) => void;

};

export const useSoundController = create<SoundController>(set => ({
    sounds: {} as Sounds,
    setSounds: (sounds: Sounds) => set({ sounds }),

}));


export const useImageStore = create<ImageStoreState>(set => ({
    imageUrl: "/aiu.png",
    setImageUrl: (imageUrl: string) => set({ imageUrl }),
    targetUrl: "/aiu.png",
    setTargetUrl: (targetUrl: string) => set({ targetUrl }),
    backgroundImageUrl: "assets/background.png",
    setBackgroundImageUrl: (backgroundImageUrl: string) => set({ backgroundImageUrl }),
    displayImageUrl: "./aiu.png",
    setDisplayImageUrl: (displayImageUrl: string) => set({ displayImageUrl }),
    srcUrl: "./aiu.png",
    setSrcUrl: (srcUrl: string) => set({ srcUrl }),
    resetImages: () => set({ imageUrl: "", backgroundImageUrl: "", displayImageUrl: "", srcUrl: "" }),
}));



export type QuipuxStore = {
    story: string[];
    setStory: (story: string[]) => void;
    eas: any;
    setEas: (eas: any) => void;
    credentials: any;
    setCredentials: (credentials: any) => void;
    location: Location;
    setLocation: (location: Location) => void;
    routeLog: Location[];
    setRouteLog: (routeLog: Location) => void;
    quipuxId: string;
    pilotData: PilotState;
    setPilotData: (pilotData: PilotState) => void;
    planetData: Planet[];
    setPlanetData: (planetsData: Planet[]) => void;
    quipux: Quipux
    setQuipux: (quipux: Quipux) => void;
    database: Universe;
    setDatabase: (newDatabase: Universe) => void;
    metaScanData: PlayerState;
    setMetaScanData: (metaScanData: PlayerState) => void;
    aiuBroadcast: AIUBroadcast;
    setAiuBroadcast: (aiuBroadcast: AIUBroadcast) => void;
};

export const useQuipuxStore = create<QuipuxStore>(set => ({
    story: [] as string[],
    setStory: (story: string[]) => set(() => ({ story: story })),
    aiuBroadcast: {} as AIUBroadcast,
    setAiuBroadcast: (aiuBroadcast: AIUBroadcast) => set(() => ({ aiuBroadcast: aiuBroadcast })),
    metaScanData: {} as PlayerState,
    setMetaScanData: (metaScanData: PlayerState) => set(() => ({ metaScanData: metaScanData })),
    credentials: { account: {} as any, provider: {} as any, signer: {} as any },
    setCredentials: (credentials: any) => set({ credentials }),
    eas: {},
    setEas: (eas: any) => set({ eas }),
    location: {} as Location,
    setLocation: (location: Location) => set(() => ({ location: location })),
    routeLog: [] as Location[],
    setRouteLog: (newLocation: Location) => set(state => ({ routeLog: { ...state.routeLog, newLocation } })),
    database: {} as Universe,
    setDatabase: (newDatabase: Universe) => set(() => ({ database: newDatabase })),
    quipuxId: "",
    pilotData: {} as PilotState,
    setPilotData: (pilotData: PilotState) => set(() => ({ pilotData: pilotData })),
    planetData: {} as Planet[],
    setPlanetData: (planetData: Planet[]) => set(() => ({ planetData: planetData })),
    quipux: {} as Quipux,
    setQuipux: (quipux: Quipux) => set(() => ({ quipux: quipux })),
}));


export type Encoder = {
    pilotUID: string;
    shipUID: string;
    planetUID: string;
    locationUID: string;
    aiuUID: string;
    missionUID: string;
    quipuxUID: string;
    pilotEncoder: SchemaEncoder;
    shipEncoder: SchemaEncoder;
    planetEncoder: SchemaEncoder;
    locationEncoder: SchemaEncoder;
    aiuEncoder: SchemaEncoder;
    quipuxEncoder: SchemaEncoder;
    missionEncoder: SchemaEncoder;
}

export const useEncoder = create<Encoder>(set => ({
    pilotUID: "0x664c7ee9294fa8c9e742fc96b7d03491d810d38289765e1c1a1b0694ab0a551d",
    shipUID: "0x664c7ee9294fa8c9e742fc96b7d03491d810d38289765e1c1a1b0694ab0a551d",
    planetUID: "0x664c7ee9294fa8c9e742fc96b7d03491d810d38289765e1c1a1b0694ab0a551d",
    locationUID: "0x664c7ee9294fa8c9e742fc96b7d03491d810d38289765e1c1a1b0694ab0a551d",
    aiuUID: "0x664c7ee9294fa8c9e742fc96b7d03491d810d38289765e1c1a1b0694ab0a551d",
    missionUID: "0x664c7ee9294fa8c9e742fc96b7d03491d810d38289765e1c1a1b0694ab0a551d",
    quipuxUID: "0x664c7ee9294fa8c9e742fc96b7d03491d810d38289765e1c1a1b0694ab0a551d",
    pilotEncoder: new SchemaEncoder("string reportId,uint64[] locationCoordinates,uint16 captainId,string description,uint64 bounty"),
    shipEncoder: new SchemaEncoder("string reportId,uint64[] locationCoordinates,uint16 captainId,string description,uint64 bounty"),
    planetEncoder: new SchemaEncoder("string reportId,uint64[] locationCoordinates,uint16 captainId,string description,uint64 bounty"),
    locationEncoder: new SchemaEncoder("string reportId,uint64[] locationCoordinates,uint16 captainId,string description,uint64 bounty"),
    aiuEncoder: new SchemaEncoder("string reportId,uint64[] locationCoordinates,uint16 captainId,string description,uint64 bounty"),
    missionEncoder: new SchemaEncoder("string reportId,uint64[] locationCoordinates,uint16 captainId,string description,uint64 bounty"),
    quipuxEncoder: new SchemaEncoder("string reportId,uint64[] locationCoordinates,uint16 captainId,string description,uint64 bounty"),
}));



export type AppState = {
    tokenURI: string;
    setTokenURI: (tokenURI: string) => void;
    account: any;
    setAccount: (account: any) => void;
    signer: any;
    setSigner: (signer: any) => void;
    provider: any;
    setProvider: (provider: any) => void;
    client: any;
    setClient: (client: any) => void;
    transferEvents: any;
    setTransferEvents: (transferEvent: any) => void;
    loading: boolean;
    setloading: (loading: boolean) => void;
    loadingProgress: number;
    setloadingProgress: (loadingProgress: number) => void;
    error: any;
    setError: (error: any) => void;
    waitingForWebhook: boolean;
    setWaitingForWebhook: (waitingForWebhook: boolean) => void;

    travelStatus: "NoTarget" | "AcquiringTarget" | "TargetAcquired" | undefined;
    setTravelStatus: (travelStatus: "NoTarget" | "AcquiringTarget" | "TargetAcquired" | undefined) => void;
    prevTravelStatus: string;
    setPrevTravelStatus: (prevTravelStatus: string) => void;

    warping: boolean;
    setWarping: (warping: boolean) => void;
    scanning: boolean;
    setScanning: (scanning: boolean) => void;
    blockNumber: string;
    setBlockNumber: (blockNumber: string) => void;
    contractInstance: any;
    setContractInstance: (contractInstance: any) => void;
};


export const useAppStore = create<AppState>(set => ({
    contractInstance: {},
    setContractInstance: (contractInstance: any) => set({ contractInstance }),
    tokenURI: "",
    setTokenURI: (tokenURI: string) => set({ tokenURI }),
    blockNumber: "",
    setBlockNumber: (blockNumber: string) => set({ blockNumber }),
    account: {},
    setAccount: (account: any) => set({ account }),
    signer: {},
    setSigner: (signer: any) => set({ signer }),
    provider: {},
    setProvider: (provider: any) => set({ provider }),
    client: {},
    setClient: (client: any) => set({ client }),
    transferEvents: {},
    setTransferEvents: (transferEvents: any) => set({ transferEvents }),
    loading: false,
    setloading: (loading: boolean) => set({ loading }),
    loadingProgress: 0,
    setloadingProgress: (loadingProgress: number) => set({ loadingProgress }),

    error: "",
    setError: (error: any) => set({ error }),
    waitingForWebhook: false,
    setWaitingForWebhook: (waitingForWebhook: boolean) => set({ waitingForWebhook }),

    backgroundImageUrl: "",
    travelStatus: "NoTarget",
    setTravelStatus: (travelStatus: "NoTarget" | "AcquiringTarget" | "TargetAcquired" | undefined) =>
        set({ travelStatus }),
    prevTravelStatus: "AcquiringTarget",
    setPrevTravelStatus: (prevTravelStatus: string) => set({ prevTravelStatus }),

    warping: false,
    setWarping: (warping: boolean) => set({ warping }),
    scanning: false,
    setScanning: (scanning: boolean) => set({ scanning }),
}));





export type GlobalState = {
    targetText: string;
    setTargetText: (targetText: string) => void;
    description: string[];
    setDescription: (description: string[]) => void;
    selectedDescriptionIndex: number;
    setSelectedDescriptionIndex: (selectedDescriptionIndex: number) => void;
    selectedTokenId: string;
    setSelectedTokenId: (selectedTokenId: string) => void;
    buttonMessageId: string;
    setButtonMessageId: (buttonMessageId: string) => void;
    selectedDescription: string;
    setSelectedDescription: (selectedDescription: string) => void;
    modifiedPrompt: "ALLIANCE OF THE INFINITE UNIVERSE" | string;
    setModifiedPrompt: (modifiedPrompt: "ALLIANCE OF THE INFINITE UNIVERSE" | string) => void;
    originatingMessageId: string;
    setOriginatingMessageId: (originatingMessageId: string) => void;
    intakeForm: any;
    setIntakeForm: (intakeForm: any) => void;
    chatData: Partial<string[]>;
    setChatData: (chatState: Partial<string[]>) => void;
    tokenIds: string[];
    setTokenIds: (tokenIds: string[]) => void;
    nativeCurrencyPrice: number;
    setNativeCurrencyPrice: (newNativeCurrencyPriceState: number) => void;
    targetNetwork: ChainWithAttributes;
    setTargetNetwork: (newTargetNetwork: ChainWithAttributes) => void;
    ethPrice: number;
    setEthPrice: (newEthPriceState: number) => void;
    nftData: NftData;
    setNftData: (newNftData: NftData) => void;
    midjourneyConfig: MidjourneyConfig;
    setMidjourneyConfig: (newMidjourneyConfig: Partial<MidjourneyConfig>) => void;
    setEngaged: (engaged: boolean) => void;
    engaged: boolean;
    myPilots: any;
    setMyPilots: (myPilots: any) => void;
    myData: any;
    setMyData: (myData: any) => void;
};
export const useGlobalState = create<GlobalState>(set => ({
    myData: {},
    setMyData: (myData: any) => set({ myData }),
    targetText: "",
    setTargetText: (targetText: string) => set({ targetText }),
    myPilots: {},
    setMyPilots: (myPilots: any) => set({ myPilots: myPilots }),
    originatingMessageId: "",
    setOriginatingMessageId: (originatingMessageId: string) => set({ originatingMessageId }),
    selectedDescription: "",
    setSelectedDescription: (selectedDescription: string) => set({ selectedDescription }),
    modifiedPrompt: "ALLIANCE OF THE INFINITE UNIVERSE",
    setModifiedPrompt: (modifiedPrompt: "ALLIANCE OF THE INFINITE UNIVERSE" | string) => set({ modifiedPrompt }),
    description: [],
    setDescription: (description: string[]) => set({ description }),
    selectedDescriptionIndex: 0,
    setSelectedDescriptionIndex: (selectedDescriptionIndex: number) => set({ selectedDescriptionIndex }),
    selectedTokenId: "",
    setSelectedTokenId: (selectedTokenId: string) => set({ selectedTokenId }),
    buttonMessageId: "",
    setButtonMessageId: (buttonMessageId: string) => set({ buttonMessageId }),
    chatData: [],
    setChatData: (chatData: Partial<string[]>) => set(state => ({ chatData: { ...state.chatData, ...chatData } })),
    engaged: false,
    setEngaged: (engaged: boolean) => set({ engaged }),
    tokenIds: [],
    setTokenIds: (tokenIds: string[]): void => set(() => ({ tokenIds })),
    nativeCurrencyPrice: 0,
    setNativeCurrencyPrice: (newValue: number): void => set(() => ({ nativeCurrencyPrice: newValue })),
    targetNetwork: scaffoldConfig.targetNetwork,
    setTargetNetwork: (newTargetNetwork: ChainWithAttributes) => set(() => ({ targetNetwork: newTargetNetwork })),
    nftData: {} as NftData,
    setNftData: (nftData: NftData) => set(() => ({ nftData: nftData })),
    midjourneyConfig: {} as MidjourneyConfig,
    setMidjourneyConfig: (midjourneyConfig: Partial<MidjourneyConfig>) =>
        set(state => ({ midjourneyConfig: { ...state.midjourneyConfig, ...midjourneyConfig } })),
    ethPrice: 0,
    setEthPrice: (newValue: number): void => set(() => ({ ethPrice: newValue })),
    traveorm: {} as any,
    setIntakeForm: (intakeForm: any) => set(() => ({ intakeForm: intakeForm })),
}));

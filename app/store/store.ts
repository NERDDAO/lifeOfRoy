import create from "zustand";
import scaffoldConfig from "@/app/scaffold.config";
import type {
    AIUBroadcast,
    EncounterData,
    ApiResponses,
    ChatData,
    EncounterResultData,
    QuestData,
    Manifest,
    Item,
    HeroCodex,
    MidjourneyConfig,
    NftData,
    PilotState,
    PlanetData,
    Quipux,
    Response,
    ShipState,
    AIUDatabase,
    Location,
} from "@/app/types/appTypes";
import { ChainWithAttributes } from "@/app/utils/scaffold-eth";
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
    eas: any;
    setEas: (eas: any) => void;
    credentials: any;
    setCredentials: (credentials: any) => void;
    location: Location;
    setLocation: (location: Location) => void;
    routeLog: Location[];
    setRouteLog: (routeLog: Location) => void;
    shipData: ShipState;
    setShipData: (shipData: ShipState) => void;
    quipuxId: string;
    pilotData: PilotState;
    setPilotData: (pilotData: PilotState) => void;
    questData: QuestData;
    setQuestData: (questData: QuestData) => void;
    planetData: PlanetData;
    setPlanetData: (planetsData: PlanetData) => void;
    encounterResults: EncounterResultData[];
    quipux: Quipux
    setQuipux: (quipux: Quipux) => void;
    database: any;
    setDatabase: (newDatabase: AIUDatabase) => void;
    encounterData: EncounterData;
    setEncounterData: (encounterData: EncounterData) => void;
    manifest: Manifest;
    setManifest: (manifest: Manifest) => void;
    metaScanData: HeroCodex;
    setMetaScanData: (metaScanData: HeroCodex) => void;
    aiuBroadcast: AIUBroadcast;
    setAiuBroadcast: (aiuBroadcast: AIUBroadcast) => void;
};

export const useQuipuxStore = create<QuipuxStore>(set => ({
    aiuBroadcast: {} as AIUBroadcast,
    setAiuBroadcast: (aiuBroadcast: AIUBroadcast) => set(() => ({ aiuBroadcast: aiuBroadcast })),
    manifest: {} as Manifest,
    metaScanData: {} as HeroCodex,
    setMetaScanData: (metaScanData: HeroCodex) => set(() => ({ metaScanData: metaScanData })),
    setManifest: (manifest: Manifest) => set(() => ({ manifest: manifest })),
    credentials: { account: {} as any, provider: {} as any, signer: {} as any },
    setCredentials: (credentials: any) => set({ credentials }),
    eas: {},
    setEas: (eas: any) => set({ eas }),
    encounterData: {} as EncounterData,
    setEncounterData: (encounterData: EncounterData) => set(() => ({ encounterData: encounterData })),
    location: {} as Location,
    setLocation: (location: Location) => set(() => ({ location: location })),
    routeLog: [] as Location[],
    setRouteLog: (newLocation: Location) => set(state => ({ routeLog: { ...state.routeLog, newLocation } })),
    shipData: {} as ShipState,
    setShipData: (shipData: ShipState) => set(() => ({ shipData: shipData })),
    database: {} as AIUDatabase,
    setDatabase: (newDatabase: any) => set(() => ({ database: newDatabase })),
    quipuxId: "",
    pilotData: {} as PilotState,
    setPilotData: (pilotData: PilotState) => set(() => ({ pilotData: pilotData })),
    questData: {} as QuestData,
    setQuestData: (questData: QuestData) =>
        set(() => ({ questData: questData })),
    planetData: {} as PlanetData,
    setPlanetData: (planetData: PlanetData) => set(() => ({ planetData: planetData })),
    encounterResults: [] as EncounterResultData[],
    setEncounterResults: (encounterResults: EncounterResultData[]) => set(() => ({ encounterResults: encounterResults })),
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
    chatData: Partial<ChatData>;
    setChatData: (chatState: Partial<ChatData>) => void;
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
    travels: Partial<ApiResponses>[];
    setTravels: (newTravel: any) => void;
    apiResponses: ApiResponses;
    setApiResponses: (response: Partial<ApiResponses>) => void;
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
    chatData: { naviMessages: [] } as Partial<ChatData>,
    setChatData: (chatData: Partial<ChatData>) => set(state => ({ chatData: { ...state.chatData, ...chatData } })),
    engaged: false,
    setEngaged: (engaged: boolean) => set({ engaged }),
    tokenIds: [],
    setTokenIds: (tokenIds: string[]): void => set(() => ({ tokenIds })),
    nativeCurrencyPrice: 0,
    setNativeCurrencyPrice: (newValue: number): void => set(() => ({ nativeCurrencyPrice: newValue })),
    targetNetwork: scaffoldConfig.targetNetworks[0],
    setTargetNetwork: (newTargetNetwork: ChainWithAttributes) => set(() => ({ targetNetwork: newTargetNetwork })),
    nftData: {} as NftData,
    setNftData: (nftData: NftData) => set(() => ({ nftData: nftData })),
    midjourneyConfig: {} as MidjourneyConfig,
    setMidjourneyConfig: (midjourneyConfig: Partial<MidjourneyConfig>) =>
        set(state => ({ midjourneyConfig: { ...state.midjourneyConfig, ...midjourneyConfig } })),
    ethPrice: 0,
    setEthPrice: (newValue: number): void => set(() => ({ ethPrice: newValue })),
    travels: [],
    setTravels: (newTravel: Partial<ApiResponses>) => set(state => ({ travels: [...state.travels, newTravel] })),
    apiResponses: {} as ApiResponses,
    setApiResponses: (response: Partial<ApiResponses>) =>
        set(state => ({ apiResponses: { ...state.apiResponses, ...response } })),
    intakeForm: {} as any,
    setIntakeForm: (intakeForm: any) => set(() => ({ intakeForm: intakeForm })),
}));

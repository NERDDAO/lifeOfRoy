import { ChainWithAttributes } from "~~/utils/scaffold-eth";

export type MidjourneyConfig = {
    nijiFlag: boolean;
    vFlag: boolean;
    selectedDescription: string;
    url: string;
};

export type IntakeForm = {
    account: string;
    nickname: string;
    occupation: string;
    guild: string;
};

export type Response = {
    accountId: string;
    createdAt: string;
    originatingMessageId: string;
    ref: string;
    buttons: ["U1", "U2", "U3", "U4", "🔄", "V1", "V2", "V3", "V4"];
    imageUrl: string;
    imageUrls: string[];
};

export type ToggleOptions = {
    interPlanetaryStatusReport?: Partial<Record<keyof QuestData, boolean>>;
    nftData?: Partial<Record<keyof NftData, boolean>>;
    metaScanData?: Partial<Record<keyof HeroCodex, boolean>>;
    planetData?: Partial<Record<keyof PlanetData, boolean>>;
    chatData?: Partial<Record<keyof ChatData, boolean>>;
    imageData?: boolean; // Assuming imageData is a simple boolean toggle
    midJourneyConfig?: Partial<Record<keyof MidjourneyConfig, boolean>>;
};

export type Sounds = {
    spaceshipHum?: AudioBuffer | null;
    spaceshipOn?: AudioBuffer | null;
    holographicDisplay?: AudioBuffer | null;
    warpSpeed?: AudioBuffer | null;
};

export type ApiResponses = {
    questData: QuestData;
    nftData: NftData;
    metaScanData: HeroCodex;
    planetData: PlanetData;
    chatData: Partial<ChatData>;
    imageData: Response;
    midjourneyConfig: MidjourneyConfig;
    shipState: ShipState;
    pilotData: PilotState;
};

export type AIUDatabase = {
    planetData: PlanetData[];
    locationData: Location[];
    pilotData: PilotState[];
    missions: QuestData[];
    ships: ShipState[];
    items: Item[];
    encounterResults: EncounterResultData[];
    quipux: Quipux[];
    story: AIUBroadcast[];
};

export type NftData = {
    nftId: string;
    capName: string;
    Level: string;
    Power1: string;
    Power2: string;
    Power3: string;
    Power4: string;
    Alignment1: string;
    Alignment2: string;
    Side: string;
};

export type Location = {
    quadrantId: string;
    coordinates: [
        x: number,
        y: number,
        z: number,
    ];
    locationName: string;
    locationFunFact: string;
    nearestLocationId: string;
    navigationNotes: string;
    imageUrl: string;
}

export type Item = {
    itemId: string;
    weight: number;
    rarity: string;
    aiUseAnalysis: string;
    creditValue: number;
}

export type Ability = {
    name: string;
    range: number;
    description: string;
    caveats: string;
}

export type Stats = {
    maxHealth: number;
    speed: number;
    attack: number;
    defense: number;
    maxRange: number
    abilities: Ability[]
    status: { health: number; resources: number; status: string[]; };
};


export type AIUBroadcast = {
    quipuxIds: [{ questId: string, quipuxId: string[] }]
    rewards: [{ pilotId: string, credits: number; itemIds: string[] }]
    storyText: string;
    imageUrl: string;
}

export type Quipux = {
    quipuxId: string;
    manifestId: string;
    questId: string;
    rewardIds: string[];
    credits: number;
    encounterIds: string[];
    prevQuipuxId: string;
}

export type Manifest = {
    manifestId: string;
    pilotState: PilotState,
    shipData: ShipState,
    planetScan: PlanetData;
    currentLocation: Location;
    descriptiveText: string;
    imageUrl: string;
}

export type QuestData = {
    issuedBy: string,
    questId: string,
    status: string;
    beaconLocation: Location;
    descriptiveText: string,
    objectives: string[],
    creditBounty: number,
    difficulty: number,
    imageUrl: string,
}

export type HeroCodex = {
    heroId: string;
    shipId: string;
    questId: string;
    questBrief: string;
    stats: Stats;
    nftData: NftData;
    abilities: string[];
    inventory: Item[];
    powerLevel: number;
    funFact: string;
    locationBeacon0: Location;
    blockNumber: string;
    imageUrl: string;
};

export type PilotState = {
    pilotId: string,
    pilotName: string,
    pilotDescription: string,
    imageUrl: string,
    alignment: string,
    guildId: string,
    guildName: string,
    credits: number,
    currentThought: string,
    stats: Stats,
    inventory: Item[],
    locationShip0: Location;
}
export type ShipState = {
    pilotId: string;
    shipId: string;
    shipName: string;
    owner: string;
    locationBeacon0: Location;
    stats: Stats;
    cargo: { fuel: number; supplies: number; cargo: Item[] };
    currentStatus: string;
    funFact: string,
    imageUrl: string,
};

export type PlanetData = {
    planetId: string;
    discoveredBy: string;
    locationBeacon0: Location;
    Scan: {
        enviromental_analysis: string;
        historical_facts: string[];
        known_entities: string[];
        NavigationNotes: string;
        DescriptiveText: string;
        controlledBy: boolean | null;
    };
};

export type EncounterResultData = {
    encounterId: string;
    prevEncounterId: string;
    encounterData: EncounterData;
    stateChangeLog: string[];
    NarrativeText: string;
    imageUrl: string;
};

export type EncounterData = {
    questId: string;
    encounterId: string;
    description: String;
    locationCoordinates: Location;
    metadata: {
        entities: [{ entityId: string; status: Stats }];
        pointsOfInterest: String[];
        type: String;
        rules: object;
        commentsForEngine: String;
    };
}



export type ChatData = {
    userMessages: string[];
    naviMessages: string[];
    captainMessages: string[];
    chatId: string;
    userSelection: string;
};

export type ProgressResponseType = {
    progress: number | "incomplete";
    response: {
        createdAt?: string;
        buttons?: string[];
        imageUrl?: string;
        buttonMessageId?: string;
        originatingMessageId?: string;
        content?: string;
        ref?: string;
        responseAt?: string;
        description?: string;
    };
};

export type StoreState = {
    interplanetaryStatusReports: string[];
    scanningResults: string[][];
    imagesStored: string[];
};

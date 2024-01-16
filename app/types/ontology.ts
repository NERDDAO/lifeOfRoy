
export type Universe = {
    planets: Planet[];
    players: PlayerState[];
    quests: Quest[];
    encounters: Encounter[];
    broadcasts: AIUBroadcast[];
    // Any additional global states or configurations
};

export type PlayerState = {
    accountId: string;
    nickname: string;
    guild: Guild;
    pilotState: PilotState;
    shipState: ShipState;
    inventory: Inventory;
};

export type Planet = {
    planetId: string;
    discoveredBy: string;
    location: Location;
    scanData: ScanData;
    controlledBy: string | null; // Could be a faction or player ID
};

export type Item = {
    itemId: string;
    weight: number;
    rarity: string;
    aiUseAnalysis: string;
    creditValue: number;
};

export type Quest = {
    questId: string;
    issuerId: string;
    status: QuestStatus; // Enum: ['Active', 'Completed', 'Failed', etc.]
    beaconLocation: Location;
    objectives: string[];
    difficulty: number;
    creditBounty: number;
};

export type Encounter = {
    encounterId: string;
    description: string;
    participants: Participant[];
    outcome: EncounterOutcome;
    narrativeText: string;
};

export type AIUBroadcast = {
    broadcastId: string;
    message: string;
    timestamp: number; // Unix timestamp
};

export type Participant = {
    participantId: string;
    role: string; // Could be 'player', 'npc', 'environment', etc.
};

export type EncounterOutcome = {
    winnerId: string;
    stateChanges: StateChange[];
    rewards: Reward[];
};

export type Guild = {
    guildId: string;
    name: string;
    members: string[]; // Array of accountIds
};

export type Location = {
    x: number;
    y: number;
    z: number;
    name: string;
};

export type ScanData = {
    environmentalAnalysis: string;
    historicalFacts: string[];
    knownEntities: string[];
};

export type Inventory = {
    items: Item[];
};

export type ShipState = {
    shipId: string;
    pilotId: string; // If needed, could link back to a PlayerState
    shipName: string;
    stats: ShipStats;
    cargo: Cargo;
};

export type ShipStats = {
    health: number;
    speed: number;
    attack: number;
    defense: number;
};

export type Cargo = {
    items: Item[]; // Could include more details like Quantity, Condition, etc.
    fuel: number;
    supplies: number;
};

export type StateChange = {
    affectedEntityId: string;
    newState: any;
};

export type Reward = {
    recipientId: string;
    items: Item[];
    credits: number;
};

export type PilotState = {
    pilotId: string;
    name: string;
    description: string;
    stats: Stats;
    currentLocation: Location;
};

export type Stats = {
    health: number;
    energy: number;
    experience: number;
    level: number;
};

// Define enums for specific, constrained values such as quest status
export enum QuestStatus {
    Active = "Active",
    Completed = "Completed",
    Failed = "Failed",
}

// Similarly, other enums can be defined as necessary for consistency


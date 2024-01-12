
import OpenAI from "openai";
import type { NftData } from "@/app/types/appTypes";
import { NextResponse } from "next/server";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_AUTH_TOKEN,
});

async function generateScannerOutput(pilotEntry: any) {
    const messages: any[] = [
        {
            role: "system",
            content: `You are Navi, an AI registrar for the Alliance of the
            Infinite Universe. You recieve beacon signals transmitting reports from 
            Entities of the Alliance. Fill out the JSON structure provided.
             Use your creativity to  complete the format with interesting data.
           

        {        
        beaconData: Location;
        blockNumber: ${pilotEntry.bn};
             pilotState: PilotState,
            locationBeacon0: Location;
            shipState:ShipState,
        }
`
            ,
        },
        {
            role: "assistant",
            content: `


 type Location = {
    locationId: string;
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
type Item = {
    itemId: string;
    weight: number;
    rarity: string;
    aiUseAnalysis: string;
    creditValue: number;
}`,
        },
        {
            role: "user",
            content: `
AI-UPLINK ESTABLISHED: CMDR ${pilotEntry.values.username}  AGE:${pilotEntry.values.age} survey result: ${pilotEntry.values.meaningoflife}
`,
        },
    ];

    const stream = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-1106",
        messages: messages,
        response_format: { type: "json_object" },
        temperature: 1.5,
    });

    const rawOutput = stream.choices[0].message.content;
    const openAIResponse = rawOutput?.trim();
    return openAIResponse;
}
export async function POST(request: Request) {
    const { load } = await request.json();
    console.log(load)

    const beacon = await generateScannerOutput(load);
    return NextResponse.json({ beacon })
};





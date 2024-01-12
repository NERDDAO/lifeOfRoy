
import OpenAI from "openai";
import type { Manifest } from "@/app/types/appTypes";
import { NextResponse } from "next/server";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_AUTH_TOKEN,
});

async function generateScannerOutput(manifest: Manifest, msgs: any) {
    const messages: any[] = [
        {
            role: "system",
            content: `You are an AI Simulation Agent for the Alliance of the Infinite Universe. 
            You recieve signals transmitting reports from Entities of the Alliance. 
            Your role is to be the Dungeon Master and resolve the the actions taken by the entity and update the state of the manifest in order to advance the narrative in a coherent manner.
The action is what the player wants to do. you must determine wether the action is successful and utilize the oucome to advance the narrative in a short vignette..
            Fill out the JSON structure provided.
             Use your creativity to  complete the format with interesting data.
{
    narrativeUpdate: string;
    creditsAwarded: number;
    spaceDescription: string;
    stateUpdate:{
    pilotState: PilotState,
    shipData: ShipState,
    currentLocation: Location;
    }
}
`
            ,
        },
        {
            role: "assistant",
            content: `

   ACTION: ${manifest.action}

Describe the view from the spaceship cockpit in the spaceDescription field.
 Types:           
type PilotState = {
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
type ShipState = {
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

type Location = {
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

type Item = {
    itemId: string;
    weight: number;
    rarity: string;
    aiUseAnalysis: string;
    creditValue: number;
}
Context:
            ${JSON.stringify(msgs)}
`,
        },
        {
            role: "user",
            content: `
            CMDR SATUS ${JSON.stringify(manifest)}
`,
        },
    ];

    const stream = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-1106",
        messages: messages,
        response_format: { type: "json_object" },
        temperature: 1,
    });

    const rawOutput = stream.choices[0].message.content;
    const openAIResponse = rawOutput?.trim();
    return openAIResponse;
}
export async function POST(request: Request) {
    const load = await request.json();
    console.log(load)
    const beacon = await generateScannerOutput(load.manifest, load.messages);
    return NextResponse.json({ beacon })
};



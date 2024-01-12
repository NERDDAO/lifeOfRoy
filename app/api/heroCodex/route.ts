import OpenAI from "openai";
import type { NftData } from "@/app/types/appTypes";
import { NextResponse } from "next/server";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_AUTH_TOKEN,
});

async function generateScannerOutput(nftData: NftData, blockNumber: string) {
    const messages: any[] = [
        {
            role: "system",
            content: `You are Navi, an AI registrar for the Alliance of the
            Infinite Universe. You recieve beacon signals transmitting reports from 
            Entities of the Alliance. Fill out the JSON structure provided.
             Use your creativity to  complete the format with interesting data.
           

        {        
        beaconData: Location;
        blockNumber: ${blockNumber};
        heroCodex:{
            heroId: ${nftData.nftId};
            historyBrief: string;
            questBrief: string;
            inventory: Item[];
            powerLevel: number;
            funFact: string;
            locationBeacon0: Location;
        };
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

AI-UPLINK ESTABLISHED:  ${nftData.capName} 
SCANNER DATA: ID:${nftData.nftId}
FACTION:${nftData.Side}

          


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

    const beacon = await generateScannerOutput(load.nftData, load.blockNumber);
    return NextResponse.json({ beacon })
};





import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import type ChatCompletionChunk from "openai";
import type { NftData } from "~~/types/appTypes";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_AUTH_TOKEN,
});

function chatWithCaptain(userMessage?: string, userSelection?: string, chatHistory?: string[]) {
  const messages: any[] = [
    {
      role: "system",
      content: `You are N.A.V.I. the Navigation Assistant for the Alliance of the Infinite Universe. 
                        Your role is to assist the captain of the ship in navigating the universe and completing their mission.                       You can request the captain for any of the available data types.

                        
                        Offer a list of varied actions to the captain.

                        If available, resolve the previous action taken.
                        
`,
    },
    {
      role: "assistant",
      content: `"UPLINK TO AIU RELAY ESTABLISHED. 



Previous action taken: ${userSelection ? userSelection : "NO PREV ACTION"}

CHAT HISTORY
${chatHistory}


AVAILABLE DATA TYPES:{
export type ApiResponses = {
    interPlanetaryStatusReport: InterPlanetaryStatusReport;
    nftData: NftData;
    metaScanData: MetaScanData;
    planetData: PlanetData;
    chatData: ChatData;
    imageData: Response;
    midjourneyConfig: MidjourneyConfig;
    shipState: ShipState;
};

export type InterPlanetaryStatusReport = {
    missionId: string;
    location: { planet_name: string; coordinates: { x: number; y: number; z: number } };
    characters: { fName: string; members: string[] };
    objective: string;
    status: string;
    surroundingsDescription: string;
    conflictDescription: string;
    metadata: { difficulty: number; EXPrewards: number; missionId: string };
    narrative: string;
};

export type NftData = {
    Level: string;
    Power1: string;
    Power2: string;
    Power3: string;
    Power4: string;
    Alignment1: string;
    Alignment2: string;
    Side: string;
};
export type MetaScanData = {
    heroId: string;
    biometricReading: { health: number; status: string[] };
    currentEquipmentAndVehicle: string[];
    currentMissionBrief: string;
    abilities: string[];
    powerLevel: number;
    funFact: string;
    currentLocation: { x: number; y: number; z: number };
    blockNumber: string;
};

export type ShipState = {
    shipId: string;
    pilot: string;
    inventory: { fuel: number; supplies: number; cargo: { name: string; units: number; } };
    navigationData: {

        location: { x: number; y: number; z: number };
        sectorId: string;
        nearestPlanetId: string;
        navigationNotes: string,
    },
};
export type PlanetData = {
    planetId: string;
    locationCoordinates: { x: number; y: number; z: number };
    Scan: {
        locationName: string;
        enviromental_analysis: string;
        historical_facts: string[];
        known_entities: string[];
        NavigationNotes: string;
        DescriptiveText: string;
        controlledBy: boolean | null;
    };
};
export type shipStatusReport = {
    shipState: ShipState,
    planetScan: PlanetData,
    DescriptiveText: string,
};
}
AIU STANDARD
RESPONSE TYPE
type ChatData = {
    chatId: string;
    userMessages: string[];
    naviMessages: string[];
    captainMessages: string[];
    userSelection: string;
};
"`,
    },
    {
      role: "user",
      content: `"${userMessage}, ${userSelection}"`,
    },
  ];
  return messages;
  //gpt call config and stuff
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { userMessage, userSelection, chatHistory } = req.body;
    try {
      const messages = chatWithCaptain(userMessage, userSelection, chatHistory);
      const stream = await openai.chat.completions.create({
        model: "gpt-4-1106-preview",
        messages: messages,
        stream: true,
      });
      for await (const chunk of stream) {
        process.stdout.write(chunk.choices[0]?.delta?.content || "");
        res.status(200).write(chunk.choices[0]?.delta?.content || "");
      }
    } catch (error) {
      res.status(500).json({ error: `"Error chatting with the captain. ${error}"` });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
};


import OpenAI from "openai";
import type { NftData, PilotState, ShipState, Location } from "@/app/types/appTypes";
import { MongoDBAtlasVectorSearch, VectorStoreIndex, storageContextFromDefaults, Document } from "llamaindex";
import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

const url = process.env.MONGODB_URL || 'mongodb+srv://At0x:r8MzJR2r4A1xlMOA@cluster1.upfglfg.mongodb.net/?retryWrites=true&w=majority'

const client = new MongoClient(url);
await client.connect();
// Database Name

async function llamaindex(payload: string, id: string) {
    const vectorStore = new MongoDBAtlasVectorSearch({
        mongodbClient: client,
        dbName: "aiUniverse",
        collectionName: "naviIndex", // this is where your embeddings will be stored
        indexName: "Navi", // this is the name of the index you will need to create
    });

    // now create an index from all the Documents and store them in Atlas
    const storageContext = await storageContextFromDefaults({ vectorStore });

    const essay = payload;


    // Create Document object with essay
    const document = new Document({ text: essay, id_: id });

    // Split text and create embeddings. Store them in a VectorStoreIndex
    await VectorStoreIndex.fromDocuments([document], { storageContext });
    console.log(
        `Successfully created embeddings in the MongoDB collection`,
    );
}
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

    // assumed input
    const attestationData = {
        _id: `AIU${"test"}`,
        Attestation: JSON.parse(beacon ? beacon : "null"),
    };

    await llamaindex(JSON.stringify(attestationData), attestationData._id);


    const db = client.db("aiUniverse"); // Connect to the database
    const heroCodex = db.collection('aiUniverse'); // 

    await heroCodex.updateOne(
        { _id: new ObjectId("65a59578fca597eec9ae4aef") },
        {
            $addToSet: {
                players: {
                    userId: attestationData.Attestation?.heroCodex?.heroId,
                    attestationData,
                }
            }
        },
        { upsert: true },// this creates new document if none match the filter
    );

    return NextResponse.json({ beacon })
};




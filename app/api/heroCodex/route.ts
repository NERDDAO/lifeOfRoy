
import OpenAI from "openai";
import type { NftData, PilotState, ShipState, Location } from "@/app/types/appTypes";
import { MongoDBAtlasVectorSearch, VectorStoreIndex, storageContextFromDefaults, Document } from "llamaindex";
import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

const url = process.env.MONGODB_URL || 'mongodb+srv://At0x:r8MzJR2r4A1xlMOA@cluster1.upfglfg.mongodb.net/?retryWrites=true&w=majority'
const openai = new OpenAI({
    apiKey: process.env.OPENAI_AUTH_TOKEN,
});
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
} async function generateScannerOutput(nftData: NftData, blockNumber: string) {
    const messages: any[] = [
        {
            role: "system",
            content: `You are Navi, an AI registrar for the Alliance of the
            Infinite Universe. You recieve beacon signals transmitting reports regarding 
            Entities of the Alliance. Complete the JSON structure provided.
             Use your creativity to fill out the format with interesting data.
           

        aiuMessage: {
        planet: Planet,
        quest: Quest,
        broadcast: AIUBroadcast,
        };
`
            ,
        },
        {
            role: "assistant",
            content: `

### Primary Game Entities


1. **Planet**:
   - Identifier and discovery information
   - Location details
   - Environmental and historical scan data
   - Control status (e.g., Is the planet controlled by a faction)

5. **Quest**:
   - Quest-related details and historical recounts
   - Associated locations, objectives, and difficulty levels
   - Current status and completed activity logs


### Dynamic Interactions

1. **Quest Assignments and Progress**:
   - Players are assigned quests that direct gameplay, with objectives and progression managed dynamically.
   - API data on quest status and updates are reflected across relevant entities in the universe.
   - Create Narrative update for AIUBroadcast based on the data generated.

type AIUBroadcast = {
    broadcastId: string;
    message: string;
    timestamp: ${blockNumber}; // Unix timestamp
};

type Planet = {
    planetId: string;
    discoveredBy: string;
    location: Location;
    scanData: ScanData;
    controlledBy: string | null; // Could be a faction or player ID
};

export type ScanData = {
    environmentalAnalysis: string;
    historicalFacts: string[];
    knownEntities: string[];
};

type Quest = {
    questId: string;
    issuerId: AIU${nftData.nftId};
    status: QuestStatus; // Enum: ['Active', 'Completed', 'Failed', etc.]
    beaconLocation: Location;
    objectives: string[];
    difficulty: number;
    creditBounty: number;
};

type Location = {
    x: number;
    y: number;
    z: number;
    name: string;
};

 enum QuestStatus {
    Active = "Active",
    Completed = "Completed",
    Failed = "Failed",
}
`,
        },
        {
            role: "user",
            content: `

AI-U NOTICE REGARDING:  ${nftData.capName} 
REPORT ID:${nftData.nftId}

ARCHIVEDATA: ${JSON.stringify(nftData)}
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
    const playerData = JSON.parse(beacon ? beacon : "null");
    const db = client.db("aiUniverse"); // Connect to the database
    const heroCodex = db.collection('aiUniverse'); // 

    // assumed input
    const attestationData = {
        _id: `AIU${"test"}`,
        Attestation: playerData,
    };

    await llamaindex(JSON.stringify(attestationData), attestationData._id);

    await heroCodex.updateOne(

        { _id: new ObjectId("65a59578fca597eec9ae4aef") },
        {
            $addToSet: {
                planets: playerData.aiuMessage.planet,
                quests: playerData.aiuMessage.quest,
                broadcasts: playerData.aiuMessage.broadcast,
            }
        },
        { upsert: true },// this creates new document if none match the filter
    );

    return NextResponse.json(beacon)
};





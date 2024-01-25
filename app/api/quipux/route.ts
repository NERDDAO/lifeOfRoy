import OpenAI from "openai";
import type { NftData, PilotState, ShipState, Location, PlayerState } from "@/app/types/appTypes";
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

async function generateScannerOutput(manifest: PlayerState, msgs: any) {
    const messages: any[] = [
        {
            role: "system",
            content: `You are an AI Simulation Agent for the Alliance of the Infinite Universe. 
            You recieve signals transmitting reports from Entities of the Alliance. 
            Your role is to be the Dungeon Master and resolve the the actions taken by the entity and update the state of the manifest in order to advance the narrative in a coherent manner.
The action is what the player wants to do. you must determine wether the action is successful and utilize the oucome to advance the narrative in a short vignette..
            Fill out the JSON structure provided.
             Use your creativity to  complete the format with interesting data.
 Encounter = {
    encounterId: string;
    description: string;
    participants: Participant[];
    outcome: EncounterOutcome;
    narrativeText: string;
};
`
            ,
        },
        {
            role: "assistant",
            content: `

   ACTION: ${manifest}

Describe the view from the spaceship cockpit in the spaceDescription field.
 Types:    

type Participant = {
    participantId: string;
    role: string; // Could be 'player', 'npc', 'environment', etc.
};

type EncounterOutcome = {
    winnerId: string;
    stateChanges: Quipux[];
    rewards: Reward[];
};

type Location = {
    x: number;
    y: number;
    z: number;
    name: string;
};

type ScanData = {
    environmentalAnalysis: string;
    historicalFacts: string[];
    knownEntities: string[];
};
type Quipux = {
    affectedEntityId: string;
    newState: any;
};

type Reward = {
    recipientId: string;
    items: Item[];
    credits: number;
};

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

    await llamaindex(JSON.stringify(beacon), load.manifest.uid);
    const attestationData = {
        _id: `QPX${load.manifest.uid}`,
        outcome: JSON.parse(beacon ? beacon : "null"),
    };
    const { encounterId, description, participants, outcome, narrativeText } = attestationData.outcome;
    const db = client.db("aiUniverse"); // Connect to the database
    const heroCodex = db.collection('aiUniverse'); // 

    await heroCodex.updateOne(
        { _id: new ObjectId("65a59578fca597eec9ae4aef") },
        {
            $addToSet: {
                encounters: {
                    qpxId: load.manifest.uid,
                    encounterId,
                    participants,
                    description,
                    outcome,
                    narrativeText,
                }
            }
        },
        { upsert: true },// this creates new document if none match the filter
    );
    return NextResponse.json({ beacon })
};



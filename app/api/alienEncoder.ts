// /pages/api/generateAlienLanguage.ts
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import type { ShipStatusReport } from "~~/types/appTypes";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_AUTH_TOKEN,
});

async function generateAlienLanguage(metadata: any) {
    const { nftData, shipData, pilotData, metaScanData, ipsr, planetData } = metadata;

    const messages: any[] = [
        {
            role: "system",
            content: `"You are N.A.V.I the AI of this AI-Universe ship. Your sensors detect a signal. Analize the provided data and utilize the instructions to provide your response."

Craft a JSON object for an encounter in the AI-Universe.. . Define an object named'encounter'. 

1. The encounter object must have the following keys:

{
    description: String;

    rules: Object;
    locationCoordinates: { x: Number; y: Number; z: Number };

    comments: String;
    metadata: {
        entities: String[];
        pointsOfInterest: String[];
        type: String;
        creditBounty: Number;
    };

The JSON object should be well-formatted, ensuring clear readability and reflecting the adventurous spirit of 'AIUniverse'. Include comments as an extra field if necessary to explain parts of the structure."



"`,
        },
        {
            role: "assistant",
            content: `"Metadata:
sHIP dATA: ${JSON.stringify(shipData)}A
META SCAN DATA: ${JSON.stringify(metaScanData)}A
IPSr: ${JSON.stringify(ipsr)}A
PILOT DATA: ${JSON.stringify(pilotData)}A
PLANEt DATA: ${JSON.stringify(planetData)}A
    NFT Data: ${JSON.stringify(nftData)}
        `},
        {
            role: "user",
            content: `"Incoming Transmissiong from AIU Operator.
   
                CREDENTIALS VALIDATED 

               
                encounter generation."`,
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

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
        const metadata = req.body;
        console.log(metadata);
        try {
            const newShipStatus = await generateAlienLanguage(metadata);

            res.status(200).json({ newShipStatus });
        } catch (error) {
            res.status(500).json({ error: "Error generating alien language." });
        }
    } else {
        res.status(405).json({ error: "Method not allowed." });
    }
};

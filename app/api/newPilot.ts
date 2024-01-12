import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import type { NftData } from "~~/types/appTypes";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_AUTH_TOKEN,
});

async function generateScannerOutput(metadata: any) {
    const messages: any[] = [
        {
            role: "system",
            content: `You are Navi, an AI registrar for the Alliance of the Infinite Universe. 
                        Inscribe the data for the new pilot recruits information into the database
                        Issue standard equipment and regulation ship class.`
            ,
        },
        {
            role: "assistant",
            content: `
            Create a scanner output JSON object with the following structure:
        {
            pilotData: {
                pilotKey: string,
                pilotName:string,
                pilotDescription: string,
                alignment: string,
                guildId: string,
                guildName:string,
                credits: number,
                currentThought: string,
                biometricReading: { health: number; status: string[] },
            },
            shipData:{
                shipId: string;
                shipName: string;
                owner: string;
                cargo: { fuel: number; supplies: number; cargo: { name: string; units: number } };
                stats: { health: number; speed: number; attack: number; defense: number; maxRange: number };
                currentStatus: string;
                funFact: string,
             },
             locationData: {
                quadrantId: string;
                coordinates: [
                    x: number,
                    y: number,
                    z: number,
                ];
                locationName: string;
                locationFunFact: string;
                nearestPlanetId: string;
                navigationNotes: string;
            },
        }`,
        },
        {
            role: "user",
            content: `
SUBMITTING PILOT DATA TO ALLIANCE DATABASE.
REQUESTING ATTESTATION FROM AIU-CENTRAL.

          


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
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const metadata = req.body;
        console.log(metadata, req.body);
        try {
            const report = await generateScannerOutput(metadata);

            res.status(200).json({ report });
        } catch (error) {
            res.status(500).json({ error: "Error generating scanner output." });
        }
    } else {
        res.status(405).json({ error: "Method not allowed." });
    }
};

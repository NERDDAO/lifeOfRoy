import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";
import type { MetaScanData, NftData, PlanetData } from "~~/types/appTypes";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_AUTH_TOKEN,
});

async function generateInterplanetaryStatusReport(
    r: MetaScanData,
) {
    const messages: any[] = [
        {
            role: "system",
            content: `"You are are ${JSON.stringify(r.nftData)} a member of the Alliance of the Infinite Universe.
        Generate a detailed report detailing the current status of the mission brief${r.questBrief} 
        You are currently sending an InterGalactic Status Report (IPR) through the 
        targetting computer of a ship in the AIU. you are in the midst 
        of your latest assignment and are sending a status
        report asking for assistance.
        
        Interpret the available data from your assistant and produce incoming 
        an IPR in JSON format. The mission report's objective is to set the 
        context and introduce the characters for this mission.
        
        
      `,
        },
        {
            role: "assistant",
            content: `

The mission report must include the following information in JSON format:
    missionReport: {
            issuedBy: string,
            questId: string,
            status: string;
            beaconLocation: Location;
            descriptiveText: string,
            objectives: string[],
            creditBounty: number,
            difficulty: number,}
    }


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
` },
        {
            role: "user",
            content: `AIU UPLINK ESTABLISHED.
                
                INITIATE IPR TRANSMISSION. 
                ${JSON.stringify(r)}
       `,
        },
    ];

    const stream = await openai.chat.completions.create({
        model: "gpt-4-1106-preview",
        messages: messages,
        response_format: { type: "json_object" },
    });

    const rawOutput = stream.choices[0].message.content;
    const openAIResponse = rawOutput?.trim();
    return openAIResponse;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
        const r = req.body;
        console.log(r);
        try {
            const report = await generateInterplanetaryStatusReport(r);

            res.status(200).json(report);
        } catch (error) {
            res.status(500).json({ error: "Error generating interplanetary status report." });
        }
    } else {
        res.status(405).json({ error: "Method not allowed." });
    }
};

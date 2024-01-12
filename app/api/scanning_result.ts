import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import type { NftData } from "~~/types/appTypes";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_AUTH_TOKEN,
});

async function generateScannerOutput(metadata: NftData) {
  const messages: any[] = [
    {
      role: "system",
      content: `You are an AI capable of generating scanner output for the following member 
            of the Alliance of the Infinite Universe:
            ${metadata.Level}${" "}${metadata.Power1} 
            ${" "}${metadata.Power2}${" "}${metadata.Power3}. 
            Generate scanner output JSON object based on the metadata available for the character in the following format:
            { 
            biometricReading: { health: number, status: string[] };
            currentEquipmentAndVehicle: string[];
            currentMissionBrief: string;
            abilities: string[];
            powerLevel: number;
            funFact: string;
            currentLocation: { x: number, y: number, z: number };
            }"`,
    },
    {
      role: "assistant",
      content: `Metadata: 
                Level: ${JSON.stringify(metadata.Level)}
                    Powers: 
                1)${JSON.stringify(metadata.Power1)}
                2)${JSON.stringify(metadata.Power2)}
                3)${JSON.stringify(metadata.Power3)}
                4)${JSON.stringify(metadata.Power4)}
                    Alignment
                ${JSON.stringify(metadata.Alignment1)}
                ${JSON.stringify(metadata.Alignment2)}
                    Class:
                ${JSON.stringify(metadata.Side)},`,
    },
    {
      role: "user",
      content: `SCANNING INFORMATION RECIEVED. 
            GENERATING SCANNER OUTPUT FOR ${metadata.Level}${" "}${metadata.Power1}${" "}${metadata.Power2}${" "}${
        metadata.Power3
      } of the AIU. `,
    },
  ];

  const stream = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    messages: messages,
    response_format: { type: "json_object" },
  });

  const rawOutput = stream.choices[0].message.content;

  return {
    rawOutput,
  };
}
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { metadata } = req.body;
    console.log(metadata);
    try {
      const scannerOutput = await generateScannerOutput(metadata);

      res.status(200).json({ scannerOutput });
    } catch (error) {
      res.status(500).json({ error: "Error generating scanner output." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
};

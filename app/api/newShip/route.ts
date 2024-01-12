
import OpenAI from "openai";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_AUTH_TOKEN,
});

async function main(prompt: string) {
    const image = await openai.images.generate(

        { model: "dall-e-3", prompt });

    return image.data[0].url;
}
export async function POST(req: Request) {
    if (req.method === "POST") {
        const shipData = await req.json();
        console.log(req.body);
        try {
            const image = await main(JSON.stringify(shipData));
            return NextResponse.json({ image });
        } catch (error) {
            return NextResponse.json({ error: "Error generating scanner output." });
        }
    } else {
        return NextResponse.json({ error: "Method not allowed." });
    }
};

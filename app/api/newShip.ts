import OpenAI from "openai";
import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from 'mongodb'
import axios from "axios";

const url = process.env.MONGODB_URI || 'mongodb://0.0.0.0:27017'
const client = new MongoClient(url);
// Database Name
const dbName = 'mementoMori';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_AUTH_TOKEN,
});

async function main(prompt: string) {
    const image = await openai.images.generate(

        { model: "dall-e-3", prompt });

    return image.data[0].url;
}
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const shipData = req.body;
        console.log(req.body);
        try {
            const image = await main(JSON.stringify(shipData));
            res.status(200).json({ image });
        } catch (error) {
            res.status(500).json({ error: "Error generating scanner output." });
        }
    } else {
        res.status(405).json({ error: "Method not allowed." });
    }
};

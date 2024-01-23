
import { useSoundController, useQuipuxStore, useImageStore, useEncoder, useGlobalState, useAppStore } from "@/app/store/store";
import axios from "axios";
import { toast } from "react-hot-toast";
// index.tsx
import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import GraphemeSplitter from "grapheme-splitter";


const url = process.env.MONGODB_URI || 'mongodb://0.0.0.0:27017'
// Database Name
const dbName = 'mementoMori';
const quipux = useQuipuxStore.getState();



import type {
    ApiResponses,
    ChatData,
    HeroCodex,
    Manifest,
    NftData,
    PilotState,
    PlanetData,
    ProgressResponseType,
    QuestData,
    Quipux,
    Response,
    ShipState,
    Sounds,
} from "@/app/types/appTypes";
import { EAS } from "@ethereum-attestation-service/eas-sdk";
import { nanoid } from "nanoid";
import { Bot } from "@/app/store/bot";
import { createEmptySession } from "@/app/store";


// BUSINESS END
const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e";
const eas = new EAS(EASContractAddress);

export const useHeroCodex = async (nftData: NftData, blockNumber: string) => {
    let r, ship, load
    load = { nftData, blockNumber }
    console.log("load", load);

    const response = await fetch("/api/heroCodex",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ load }),
        });
    r = await response.json();

    console.log("rawResponse", r);
    const parsed = JSON.parse(r)
    ship = await attestShip(r);
    parsed.imageUrl = ship.image;
    postCodex(parsed);

    return { parsed, ship }

}



const TEMPLATE = (PERSONA: string) =>
    `I want you to act as a ${PERSONA}. I will provide you with the context needed to solve my problem. Use intelligent, simple, and understandable language. Create a narrative experience. Present posibilities, not outcomes. Use the context available to understand the outcome of the previous action and present a new scenario for the pilot. You can relay messages between the player and other personas you create. Your main objective is to create an inmersive coherent experience for the player. `
export const createPlayerBot = (): Bot => ({
    id: nanoid(),
    avatar: "1f916",
    name: `CMDR ${quipux.pilotData.name} NAVI`,
    context: [
        {
            role: "system",
            content: TEMPLATE(`"You are pilot ${JSON.stringify(quipux.pilotData)} of an AI-Universe"`),
        },
        {
            role: "assistant",
            content: `
Never say you dont have data, just improvise coherently avoid using the words fictional and role-play.
`
        }
    ],
    modelConfig: {
        model: "gpt-4-1106-preview",
        temperature: 0.1,
        maxTokens: 4096,
        sendMemory: true,
    },
    readOnly: true,
    datasource: "navi",
    hideContext: true,

    createdAt: Date.now(),
    botHello: "Hello CMDR, glad to see you again!",
    session: createEmptySession(),
});




export const fetchDb = async (quipux: any) => {

    // Initialize the sdk with the address of the EAS Schema contract address
    quipux.setEas(eas);

    try {
        const response = await fetch("http://0.0.0.0:3000/aiu/database"); // assume the same host
        ;
        const json = await response.json();
        console.log(json, "Player data from DB");
        quipux.setDatabase(json)

    } catch (e: any) {
        console.log(e.message);


    }

};


export const postCodex = async (heroCodex: HeroCodex) => {

    // Initialize the sdk with the address of the EAS Schema contract address

    try {
        const response = await fetch("http://0.0.0.0:3000/aiu/heroCodex",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(heroCodex),

            }

        ); // assume the same host
        ;
        console.log("Player data from DB");
        return response

    } catch (e: any) {
        console.log(e.message);


    }

};


export const postPilotShip = async (pilotState: PilotState, shipState: ShipState, beaconData: Location, address: string) => {

    const load = { pilotState, shipState, beaconData, address }
    console.log("load", load);

    try {
        const response = await fetch("http://0.0.0.0:3000/aiu/pilotShip",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ load }),

            }

        ); // assume the same host
        ;
        console.log("Player data from DB", response);

    } catch (e: any) {
        console.log(e.message);


    }

};


export const useFetchScanningReport = async (nftQuery: NftData) => {
    const response = await axios.post("/api/scanning_result", {
        metadata: nftQuery,
    });
    console.log("scannerOutput", JSON.parse(response.data.scannerOutput.rawOutput));
    const r = JSON.parse(response.data.scannerOutput.rawOutput);
    toast.success(
        `
                        AGENT LOCATION: ${JSON.stringify(r.currentLocation)}\n
                        Current Mission Brief: ${JSON.stringify(r.currentMissionBrief)}\n
                        RESULT SENT TO BACKEND"`,
    );
    console.log(r, "missionData");
    return r;
};

export const fetchInterplanetaryStatusReport = async () => {
    const response = await axios.post("/api/generate_report", {
    });

    const t = JSON.parse(response.data.report);


    toast.success(`AI-U IPS Report Recieved\n
                            MissionId: ${response.data.report.missionId}
                            objective:${t.objective}
                            Mission Data: ${JSON.stringify(t.metadata)}`);
    return t;
};


export const attestCodex = async (image: string, codexData: any, capname: string) => {
    const payload = { image, codexData, capname }

    const response = await fetch("http://0.0.0.0:3000/aiu/codex", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
    });

    const rawResponse = await response.json();

    console.log("ShipRaw", rawResponse);
    return rawResponse;


}

export const attestShip = async (shipData: any) => {

    const response = await fetch("/api/newShip", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(shipData),
    });

    const rawResponse = await response.json();

    console.log("ShipRaw", rawResponse);

    return rawResponse;
}
































































































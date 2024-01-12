
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
    const parsed = JSON.parse(r.beacon)
    console.log("rawResponse", r.beacon, parsed);
    ship = await attestShip(r.beacon);
    parsed.imageUrl = ship.image;
    postCodex(parsed);

    return { parsed, ship }

}

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
































































































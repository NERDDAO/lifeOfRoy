

import { useQuipuxStore, useImageStore, useEncoder, useGlobalState, useAppStore } from "~~/services/store/store";
import axios from "axios";
import { toast } from "react-hot-toast";
import type { NftData, QuestData, HeroCodex, PilotState, ShipState, PlanetData, Location, Item, Stats } from "~~/types/appTypes";


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




export const fetchUserBalance = async (address: string, contract: any) => {
    if (!address || !contract) return BigInt(0);
    try {
        return await contract.balanceOf(address);
    } catch (error) {
        console.error("Error fetching user balance:", error);
        return BigInt(0);
    }
};


export const useFetchNFT = async (tokenId: string, uri: string) => {
    const response = await fetch(uri);
    const metadata = await response.json();
    console.log(uri, metadata);

    console.log("Metadata received in the parent component:", metadata);
    // Extract the attributes from the metadata
    const attributes = metadata?.attributes.reduce((acc: any, attr: any) => {
        acc[attr.trait_type] = attr.value;
        return acc;
    }, {});
    const ipfsGateway = "https://ipfs.ai-universe.io"; // Choose a gateway
    const imageUrl = metadata?.image.replace("ipfs://", `${ipfsGateway}/ipfs/`);
    console.log("attributes", metadata);
    if (!attributes) return;
    const nftQuery = {
        nftId: tokenId,
        Level: attributes?.Level,
        Power1: attributes["Power 1"],
        Power2: attributes["Power 2"],
        Power3: attributes["Power 3"],
        Power4: attributes["Power 4"],
        Alignment1: attributes["Alignment 1"],
        Alignment2: attributes["Alignment 2"],
        Side: attributes.Side,
    };

    toast.success(`
                INCOMING TRANSMISSION\n
            Established connection with:\n
            ${nftQuery.Level} ${nftQuery.Power1} ${nftQuery.Power2}\n
            Agent #${tokenId} of the A.I.U.
           `);
    return { nftQuery, imageUrl };
};

// BUSINESS END
// generate text--> attest +  generateImage -> send to backend


export const getHeroCodex = async (nftQuery: any, capname: string) => {
    let r, pons
    console.log(nftQuery);

    try {
        const response = await fetch("/api/heroCodex", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nftQuery.nftQuery),
        });

        r = await response.json();
        console.log("rawResponse", nftQuery, r);
        const parsed = JSON.parse(r)
        const codexData = { nftQuery, parsed }
        const ship = await attestShip(r)

        pons = { parsed, codexData, ship };
        console.log("pons", pons);
        return pons;

    } catch (error) {
        console.error("Error sending message:", error);
    }
    finally {

        const codex = await attestCodex(pons?.ship, pons?.codexData, capname);
        console.log("beacon", pons);

        return { r, pons, codex };
    }
};

export const getIsgr = async (r: any) => {
    // Save only if player id does not exist
    const c = await fetch("http://0.0.0.0:3000/aiu/generate_report",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: r,
        })
    toast.success("Captain Attested")
    const cap = await c.json()
    console.log(cap)
    return cap
}



// Signer must be an ethers-like signer.
//
const getBeaconPic = async (r: any, nftQuery: any, capname: string) => {

    const response = await fetch("/api/heroCodex", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: r,
    });

    const rawResponse = await response.json();

    const parsedResponse = JSON.parse(r)

    const codexData = { nftQuery, parsedResponse }
    const ship = await attestShip(rawResponse)
    const codex = await attestCodex(ship, codexData, capname);

    console.log("shipData", rawResponse, parsedResponse, codex)
    return { rawResponse, codex };
}

export const navi = async () => {
    const response = await fetch("http://0.0.0.0:3000/aiu/navi", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
    })
    const parsed = await response.json()
    return parsed
}



export const attestCodex = async (image: string, codexData: any, capname: string) => {
    const { nftQuery, r } = codexData
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


    console.log("shipData", rawResponse, shipData)
    return rawResponse;
}
































































































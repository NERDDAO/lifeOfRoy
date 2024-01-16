"use client"

import SpaceshipInterface from "./components/aiu/panels/SpaceshipInterface";
import AcquiringTarget from "./components/aiu/panels/AcquiringTarget";
import PromptPanel from "./components/aiu/panels/PromptPanel";
import DescriptionPanel from "./components/aiu/panels/DescriptionPanel";
import { MarqueePanel } from "./components/aiu/panels/MarqueePannel";
import ReadAIU from "./components/aiu/ReadAIU";
import { useCallback, useEffect, useState } from "react";
import AudioController from "./components/aiu/AudioController";
import { useSoundController, useAppStore, useGlobalState, useImageStore, useQuipuxStore } from "./store/store";
import { useBlockNumber, useAccount, usePublicClient, useContractRead } from "wagmi";
import { useContractEvent, erc721ABI } from 'wagmi'
import toast from "react-hot-toast";
import { useHeroCodex } from "@/app/hooks/aiu/useAIU"
import { Universe } from "./types/appTypes";
import { EAS, SchemaEncoder, Offchain } from "@ethereum-attestation-service/eas-sdk";
import { useProvider, useSigner } from "./utils/wagmi-utils";
import { useBotStore } from "./store/bot";



//session storage
export default function App() {
    const app = useAppStore((state) => state);
    const state = useGlobalState((state) => state);
    const image = useImageStore((state) => state);
    const quipux = useQuipuxStore((state) => state);
    const botStore = useBotStore();
    const bot = botStore.currentBot();
    const session = botStore.currentSession();
    const messages = session.messages.slice(session.messages.length - 10);
    const action = state.modifiedPrompt


    const provider = useProvider();
    const account = useAccount();
    const signer = useSigner();

    const AIU = '0xd74c4701cc887ab8b6b5302ce4868c4fbc23de75'
    const publicClient = usePublicClient()

    const fetchIds = async () => {
        const userNFTs = await publicClient.getContractEvents({
            address: AIU,
            abi: erc721ABI,
            args: { to: account.address },
            eventName: 'Transfer',
            fromBlock: 15795907n,
        })
        app.setTransferEvents(userNFTs);

        fetchTokenIds(userNFTs);

        console.log("LOGS", userNFTs);
    }

    const { data: blockNumber } = useBlockNumber()

    const uri = useContractRead({
        abi: erc721ABI,
        address: AIU,
        functionName: 'tokenURI',
        args: [BigInt(state.selectedTokenId)],
    })
    const balance = useContractRead({
        abi: erc721ABI,
        address: AIU,
        functionName: 'balanceOf',
        args: [account.address ? account.address : "0x00000000"],
    })

    useEffect(() => {
        quipux.setCredentials({ provider, signer, account });
        console.log("credentials", quipux.credentials);
    }, [account.address]);

    const [soundsLoaded, setSoundsLoaded] = useState<boolean>(false);

    const setSounds = useSoundController((state) => state.setSounds);
    const sounds = useSoundController((state) => state.sounds);
    const loadSounds = async () => {

        const audioController = new AudioController();
        const spaceshipOn = await audioController?.loadSound("/audio/spaceship-on.wav");
        const spaceshipHum = await audioController?.loadSound("/audio/spaceship-hum.wav");
        const holographicDisplay = await audioController?.loadSound("/audio/holographic-display.wav");
        const warpSpeed = await audioController?.loadSound("/audio/warp-speed.wav");
        setSounds({
            spaceshipOn,
            spaceshipHum,
            holographicDisplay,
            warpSpeed,
            audioController
        });

        setSoundsLoaded(true);

        console.log("sounds loaded", sounds)
    };

    useEffect(() => {
        loadSounds();
    }, [])


    const useGetPilot = () => {
        if (!account.address) return console.log("no account address");
        const pilots = quipux.database?.players
        const myPilot = pilots?.filter((pilot: { accountId: string; }) => pilot.accountId === account.address)
        if (!myPilot) return toast.error("no myPilot");
        quipux.setMetaScanData(myPilot[myPilot.length - 1]);
        quipux.setPilotData(myPilot[myPilot.length - 1]?.pilotState);
        console.log("myPilot", myPilot, quipux.metaScanData)
    }



    useEffect(() => {
        if (balance.data && balance.data > 0) {
            useGetPilot();
            fetchIds();
        }
        console.log("balance", balance.data)

    }, [account.address, balance.data, quipux.database])


    useEffect(() => {
        if (uri.data) {
            app.setTokenURI(uri.data);
            app.setBlockNumber(String(blockNumber));
            useFetchNFT(uri.data)
            console.log("URI", uri, balance.data, blockNumber)
        }
    }, [uri.data])


    const manifest = {
        uid: "",
        action: state.modifiedPrompt,
        heroId: state.selectedTokenId,
        address: account.address || "0x0000000",
        nonce: 0,
        blockNumber: String(blockNumber) || "0",
        pilotState: quipux.pilotData,
        shipData: quipux.metaScanData.shipState,
        currentLocation: quipux.location,
        prevManifestId: "",
    }



    const attestQuipux = async () => {

        if (!provider || !signer) return console.log("no signer");

        const easContractAddress = "0xA1207F3BBa224E2c9c3c6D5aF63D0eb1582Ce587";
        const schemaUID = "0x98df939d0cb64a56461fb1a4cc42baa6d7218aec9d670eb19db52a1046205ad9";
        const eas = new EAS(easContractAddress);
        // Signer must be an ethers-like signer.
        eas.connect(provider);

        const offchain = await eas.getOffchain();
        // Signer must be an ethers-like signer.
        // Initialize SchemaEncoder with the schema string
        const address = account.address && account.address || "0x0000000";
        const utf8EncodeText = new TextEncoder();

        const schemaEncoder = new SchemaEncoder("uint16 heroId,string pilotAddress,uint32 nonce");
        const encodedData = schemaEncoder.encodeData([
            { name: "heroId", value: state.selectedTokenId, type: "uint16" },
            { name: "pilotAddress", value: address, type: "string" },
            { name: "nonce", value: "0", type: "uint32" }
        ]);
        const offchainAttestation = await offchain.signOffchainAttestation(
            {
                version: 1,
                recipient: address,
                expirationTime: BigInt(0),
                time: app.blockNumber ? BigInt(app.blockNumber) : BigInt(0),
                revocable: true,
                refUID: "0x0000000000000000000000000000000000000000000000000000000000000000",
                // Be aware that if your schema is not revocable, this MUST be false
                schema: schemaUID,
                data: encodedData,
            },
            signer,
        )

        const updatedData = JSON.stringify(
            offchainAttestation,
            (key, value) => (typeof value === "bigint" ? value.toString() : value), // return everything else unchanged
        );

        const uid = offchainAttestation.uid;
        console.log("New attestation UID:", uid, updatedData);
        return uid;
    }


    useEffect(() => {
        if (app.travelStatus === "AcquiringTarget") {
            console.log("TargetAcquired", app.travelStatus);
            app.setScanning(true);
            try {
                submitPrompt();
                app.setTravelStatus("TargetAcquired");
            } catch (e) {
                app.setTravelStatus("NoTarget");
            }
        }
    }, [app.travelStatus])

    const handleSendMessage = async () => {
        try {
            const response = await fetch("/api/quipux", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ manifest, messages }),
            });
            const rawResponse = await response.json();

            console.log("rawResponse", rawResponse);

            const r = JSON.parse(rawResponse.beacon)
            console.log(r);
            return r

        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const postQuipux = async (r: any, uid: string) => {

        try {
            const newManifest = {
                uid: uid,
                action: manifest.action,
                heroId: manifest.heroId,
                address: account.address || manifest.address,
                nonce: manifest.nonce++,
                blockNumber: app.blockNumber,
                pilotState: r.pilotState,
                shipData: r.shipData,
                currentLocation: r.currentLocation,
                prevManifestId: manifest.prevManifestId,
            };
            const response = await fetch("http://0.0.0.0:3000/aiu/quipuxUpdate",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ newManifest }),

                }

            ); // assume the same host
            ;
            console.log("Player data from DB", response);
        } catch {
            console.log("no response")
        }

    }




    const submitPrompt = async () => {



        if (app.waitingForWebhook) {
            console.log("Already waiting for webhook, please wait for response.");
            return;
        }
        app.setWaitingForWebhook(true);
        app.setWarping(true);

        try {
            const uid = await attestQuipux()
            const r = await handleSendMessage()
            quipux.setPilotData(r.stateUpdate.pilotState);
            quipux.setMetaScanData(r.stateUpdate.shipData);
            quipux.setLocation(r.stateUpdate.currentLocation);
            quipux.routeLog.push(r.stateUpdate.currentLocation);
            quipux.story.push(r.narrativeUpdate);
            await postQuipux(r, uid || "")
            let prompt = `"A view from a spaceship that just left hyperspace into:" + "${r.spaceDescription}"`
            console.log("uid", uid, r)

            const rs = await fetch("/api/newShip", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(prompt)
            })
            const s = await rs.json()
            console.log("response", r, s);
            image.setBackgroundImageUrl(s.image)
            // Set the appropriate state based on the type

        } catch (e: any) {
            console.log(e);
            app.setError(e.message);
            app.setWarping(false);
            app.setTravelStatus("NoTarget");
            app.setScanning(false);

            app.setWaitingForWebhook(false);

            app.setloadingProgress(0);
        }

        app.setloadingProgress(0);
        app.setWarping(false);
        app.setTravelStatus("NoTarget");
        app.setScanning(false);

        app.setWaitingForWebhook(false);
    };


    const useFetchNFT = async (data: string) => {
        const hCodex = quipux.database?.quests
        const sCodex = hCodex?.filter((codex: { issuerId: string; }) => codex?.issuerId ? codex.issuerId === `AIU${state.selectedTokenId}` : "")
        if (!data) return console.log("no uri data");
        const response = await fetch(data);
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
        image.setDisplayImageUrl(imageUrl);
        image.setImageUrl(imageUrl);
        console.log("attributes", metadata);
        if (!attributes) return;
        let nftQuery = {
            nftId: state.selectedTokenId,
            Level: attributes?.Level,
            Power1: attributes["Power 1"],
            Power2: attributes["Power 2"],
            Power3: attributes["Power 3"],
            Power4: attributes["Power 4"],
            Alignment1: attributes["Alignment 1"],
            Alignment2: attributes["Alignment 2"],
            Side: attributes.Side,
            capName: "",
        };
        nftQuery.capName = `${nftQuery.Level} ${nftQuery.Power1} ${nftQuery.Power2} ${nftQuery.Power3} ${nftQuery.Power4}`;
        nftQuery.capName = nftQuery.capName.replace(/undefined/g, "");
        state.setNftData(nftQuery);

        let codex
        console.log(sCodex, "sCodex")
        if (sCodex && sCodex[0]) {
            codex = sCodex[0]
            console.log("codexFound!", codex);
        }
        else {

            codex = await useHeroCodex(nftQuery, String(blockNumber));
            image.setDisplayImageUrl(codex.ship.image)
            console.log("GenerateCodex", codex);
        }

        toast.success(`
                INCOMING TRANSMISSION\n
            Established connection with:\n
            ${nftQuery.Level} ${nftQuery.Power1} ${nftQuery.Power2}\n
            Agent #${state.selectedTokenId} of the A.I.U.
           `);

    };
    const fetchTokenIds = (userNFTs: any[]) => {

        if (!account.address || !userNFTs) {
            console.log("No address or deployed contract");
            return;
        }
        try {
            const ownedTokenIds = userNFTs.map((event: { args: { tokenId: { toString: () => any; }; }; }) => event.args.tokenId.toString());
            state.setTokenIds(ownedTokenIds)
            console.log("tokenIds", ownedTokenIds, userNFTs.length, "userBalance");
        } catch (error) {
            console.error("Error in fetchTokenIds:", error);
        }
    };




    return (
        <>
            <SpaceshipInterface />
            <AcquiringTarget />

            <MarqueePanel />
            <ReadAIU />
            <DescriptionPanel />
            <PromptPanel />
        </>
    );
}

/*
 To call the `Home` function when you import it, you need to pass the appropriate props that match the `AppProps` type. The `AppProps` type typically includes properties that are passed to a page component in a Next.js application. Assuming `AppProps` is a type that includes properties for the page's initial props and any other custom properties you might have defined, you would call the `Home` function like this:

```javascript
import { Home } from 'path-to-home-component';

// Define your pageProps based on what your pages expect
const pageProps = {
  // ... your page specific props
};

// Call the Home function with the required props
const homeElement = <Home Component={YourPageComponent} pageProps={pageProps} />;
```

Replace `YourPageComponent` with the actual component you want to render, and `pageProps` with the props that component expects. If you're using TypeScript and have defined a specific type for `AppProps`, make sure that the object you pass matches that type.
 * */

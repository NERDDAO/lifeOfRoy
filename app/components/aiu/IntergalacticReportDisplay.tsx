

import React, { useState, useEffect } from "react";
import { useGlobalState, useAppStore, useQuipuxStore, useImageStore } from "@/app/store/store";
import { EncounterResultData, PilotState, ShipState } from '@/app/types/appTypes';
import { MongoClient } from 'mongodb'
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { useAccount, useBlockNumber } from "wagmi";
import { useProvider, useSigner } from "@/app/utils/wagmi-utils";
import axios from "axios";
import toast from "react-hot-toast";



const InterGalaReportDisplay = (props: { playHolographicDisplay: () => void }) => {

    // Database Name
    const imageStore = useImageStore(state => state);
    const store = useGlobalState(state => state);
    const app = useAppStore(state => state);
    const quipux = useQuipuxStore(state => state);
    const myPilots = store.myPilots;
    //const myShip = quipux.database?.ships[0];
    const myShip = null


    const { data: blockNumber, isError, isLoading } = useBlockNumber();

    // Initialize the sdk with the address of the EAS Schema contract address

    // Gets a default provider (in production use something else like infura/alchemy)
    //eas.connect(provider);

    // Initialize the sdk with the Provider

    // ... [your state and function definitions] ...
    const { playHolographicDisplay } = props;
    const selectedTokenId = 2;
    const parsedMetadata = null;
    const account = useAppStore(state => state.account);

    const address = account?.address;
    const signer = useSigner();
    //const pilotData = { account, nickname, occupation, guild };
    //

    const [answer, setAnswer] = useState("");
    const [nickname, setNickname] = useState("");
    const [occupation, setOccupation] = useState("");
    const [guild, setGuild] = useState("");
    const intakeForm = { account: account?.address, nickname, occupation, guild, answer };

    const [pilotIndex, setPilotIndex] = useState(0);

    const currentPilot = myPilots && myPilots[pilotIndex]
    const handleSendMessage = async () => {
        playHolographicDisplay();
        //setLoading(true);
        try {
            const response = await fetch("/api/newPilot", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(intakeForm),
            });
            const rawResponse = await response.json();


            const r = JSON.parse(rawResponse.report);

            console.log("rawResponse", rawResponse, r);
            quipux.setPilotData(r.pilotData)
            quipux.setShipData(r.shipData)
            quipux.setLocation(r.locationData);
            quipux.routeLog.push(r.locationData);
            let attest, shipPic

            try {
                shipPic = await requestShip(r.shipData)

                attest = await attestPilot(r.pilotData)
                return attest;


            } catch {
                console.log("Error attesting pilot or ship")

            } finally {
                if (attest && shipPic.image) {
                    let s: ShipState = r.shipData
                    let i: string = shipPic.image
                    let k: Location = r.locationData
                    let ship = { state: s, image: i, location: k }
                    registerPilot(r.pilotData, attest, ship)
                    imageStore.setDisplayImageUrl(shipPic.image)
                    imageStore.setImageUrl(shipPic.image)
                    console.log("shipData", attest, shipPic)
                    toast.success("Pilot Attested");
                }
                else {
                    toast.error("Error attesting pilot or ship")
                }
            }

            console.log("rawResponse", rawResponse, intakeForm, r);

        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    async function registerPilot(
        pilotData: PilotState,
        pilotAttestation: { updatedData: string, uid: string },
        shipData: { state: ShipState, image: string }) {
        // Save only if player id does not exist
        console.log("pilotData", pilotData, pilotAttestation, shipData);

        try {
            await axios.post("http://0.0.0.0:3000/aiu/attest",
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: { pilotData, pilotAttestation, shipData, address }
                })
            toast.success("Pilot Attested")
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }

    const provider = useProvider();
    const easContractAddress = "0xA1207F3BBa224E2c9c3c6D5aF63D0eb1582Ce587";
    const schemaUID = "0xb151d180b92e94a9c52dec14b1e93b975edaf696ea0927223d103845cfd2ca1b";
    const eas = new EAS(easContractAddress);
    // Signer must be an ethers-like signer.




    const attestPilot = async (pilot: PilotState) => {


        if (!provider || !signer) return;
        eas.connect(provider);
        const offchain = await eas.getOffchain();

        //

        // Initialize SchemaEncoder with the schema string
        const pilotSchemaUID = "0xb151d180b92e94a9c52dec14b1e93b975edaf696ea0927223d103845cfd2ca1b";
        const pilotSchemaEncoder = new SchemaEncoder("string pilotName,string pilotDescription,address alignment,uint64 credits,uint64[] location");
        const pilotEncodedData = pilotSchemaEncoder.encodeData([
            { name: "pilotName", value: "", type: "string" },
            { name: "pilotDescription", value: "", type: "string" },
            { name: "alignment", value: "0x0000000000000000000000000000000000000000", type: "address" },
            { name: "credits", value: BigInt(0), type: "uint64" },
            {
                name: "location", value: [BigInt(0),
                BigInt(0), BigInt(0)], type: "uint64[]"
            },
        ]);



        const offchainAttestation = await offchain.signOffchainAttestation(
            {
                version: 1,
                recipient: address ? address : "0x0000000000000000",
                expirationTime: BigInt(0),
                time: blockNumber ? blockNumber : BigInt(0),
                revocable: true,
                refUID: "0x0000000000000000000000000000000000000000000000000000000000000000",
                // Be aware that if your schema is not revocable, this MUST be false
                schema: pilotSchemaUID,
                data: pilotEncodedData,
            },
            signer,
        )





        const updatedData = JSON.stringify(
            offchainAttestation,
            (key, value) => (typeof value === "bigint" ? value.toString() : value), // return everything else unchanged
        );

        const uid = offchainAttestation.uid;


        return { updatedData, uid }
    }

    const attestShip = async (pilot: ShipState) => {


        if (!provider || !signer) return;
        eas.connect(provider);
        const offchain = await eas.getOffchain();

        //

        // Initialize SchemaEncoder with the schema string
        const pilotSchemaUID = "0xb151d180b92e94a9c52dec14b1e93b975edaf696ea0927223d103845cfd2ca1b";
        const pilotSchemaEncoder = new SchemaEncoder("string pilotName,string pilotDescription,address alignment,uint64 credits,uint64[] location");
        const pilotEncodedData = pilotSchemaEncoder.encodeData([
            { name: "pilotName", value: "", type: "string" },
            { name: "pilotDescription", value: "", type: "string" },
            { name: "alignment", value: "0x0000000000000000000000000000000000000000", type: "address" },
            { name: "credits", value: BigInt(0), type: "uint64" },
            {
                name: "location", value: [BigInt(0),
                BigInt(0), BigInt(0)], type: "uint64[]"
            },
        ]);



        const offchainAttestation = await offchain.signOffchainAttestation(
            {
                version: 1,
                recipient: address ? address : "0x0000000000000000",
                expirationTime: BigInt(0),
                time: blockNumber ? blockNumber : BigInt(0),
                revocable: true,
                refUID: "0x0000000000000000000000000000000000000000000000000000000000000000",
                // Be aware that if your schema is not revocable, this MUST be false
                schema: pilotSchemaUID,
                data: pilotEncodedData,
            },
            signer,
        )





        const updatedData = JSON.stringify(
            offchainAttestation,
            (key, value) => (typeof value === "bigint" ? value.toString() : value), // return everything else unchanged
        );

        const uid = offchainAttestation.uid;


        // registerShip(pilot, updatedData, uid)
    }


    const requestShip = async (shipData: ShipState) => {


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

    const generateShip = async (pilotData: ShipState) => {
        const response = await fetch("/api/newShip", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(pilotData),
        });

        const rawResponse = await response.json();
        console.log("ShipRaw", rawResponse);

        const r = JSON.parse(rawResponse.pilotData);

        quipux.setShipData(r.shipData)
        try {
            requestShip(r.shipData)
            attestShip(r.shipData)
        }
        catch {
            console.log("Error setting ship data")

        }
    }

    const playerSelector = () => {
        if (pilotIndex < myPilots.length - 1) {
            setPilotIndex(pilotIndex + 1)
            console.log("pilotIndex", pilotIndex)
        }
        else {
            setPilotIndex(0)
        }

        console.log(store, myPilots)
    }
    const dataClass = ["playerData", "shipData", "SwitchBoard"];

    const renderCustomInterface = () => {
        switch ("inputData") {
            case "inputData":
                // Custom interface for image data ff
                return (
                    <>
                        <ul>

                            <span className="text-white text-sm font-bold text-center">CMDR</span>

                            <h2 className="text-2xl">{currentPilot?.pilotData.pilotName}#{currentPilot?.pilotData.pilotKey}</h2>

                            <h3 className="text-white font-bold text-md">{currentPilot?.pilotData.guildName}</h3>
                            <strong>CREDITS: {currentPilot?.pilotData.credits}</strong>


                            <li><strong>Description:</strong> {currentPilot?.pilotData.pilotDescription}</li>

                            <li>Alignment: {currentPilot?.pilotData.alignment}</li>


                            {currentPilot?.pilotData.biometricReading && (
                                <ul>

                                    <strong>Biometric Reading:</strong><br />
                                    <strong>Health :<span className="text-white">{currentPilot?.pilotData.biometricReading.health}%</span></strong>
                                    {Object.entries(currentPilot?.pilotData.biometricReading.status).map(([key, value], index) => (
                                        <li key={index} className="text-bold">
                                            {key}: <span className="text-white">{JSON.stringify(value)}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}


                        </ul>



                    </>
                );
            case "logData":
                // Custom interface for interplanetary status report
                return <IntergalacticReportDisplay playHolographicDisplay={playHolographicDisplay} />;
            case "SwitchBoard":
                // Custom interface for meta scan data
                return (

                    <ul className="relative p-1">


                        <li className="text-white">SHIP DATA:</li>

                        <strong className="text-white text-md"> ID:{myShip && myShip.shipData.shipName}<br /></strong>

                        STATS{myShip.shipData.stats && Object.entries(myShip.shipData?.stats).map(([key, value], index) => (
                            <li key={key} className="text-bold">{key}:<span className="text-white">{JSON.stringify(value)}</span>
                            </li>
                        ))}

                        NAV:{quipux.location && Object.entries(quipux.location).map(([key, value], index) => (
                            <ul key={index}>
                                <li key={key} className="text-bold">{key}:<span className="text-white">{JSON.stringify(value)}</span>
                                </li>
                            </ul >
                        ))}


                    </ul>
                );
            case "newData":
                // Custom interface for ship state
                return (
                    <>
                        <ul className="space-y-2 p-1"

                        >
                            <span className="relative  text-yellow-600 pointer-events-auto cursor-pointer"> AIU-001
                                <br /> <span className="text-lg font-bold text-left">
                                    CMDR:
                                    <span className="text-2xl text-white"> {account?.displayName}</span>{" "}
                                </span>{" "}
                            </span><br />

                            <form className="relative text-white text-sm font-bold text-center"
                                onSubmit={e => {
                                    e.preventDefault();
                                    playHolographicDisplay()
                                }}
                            >

                                <label>
                                    Nickname
                                    <input className="hex-prompt ml-3 m-1"
                                        defaultValue={account?.displayName}
                                        value={nickname}
                                        onChange={e => {
                                            playHolographicDisplay();
                                            setNickname(e.target.value);
                                        }}
                                    />
                                </label>
                                <br />
                                <label>
                                    Ocupation
                                    <input className="hex-prompt ml-1 m-1"
                                        value={occupation}
                                        onChange={e => {
                                            playHolographicDisplay();
                                            setOccupation(e.target.value)
                                        }}
                                    />
                                </label>
                                <br />
                                <label>
                                    Guild
                                    <input className="hex-prompt ml-12 m-1"
                                        value={guild}
                                        onChange={e => {
                                            playHolographicDisplay();
                                            setGuild(e.target.value)
                                        }}

                                    />
                                </label><br />
                                <span className="text-white">What is the meaning of life?</span><br />
                                <label>
                                    Answer
                                    <input className="hex-prompt ml-10 m-1"


                                        onChange={e => {
                                            playHolographicDisplay();
                                            setAnswer(e.target.value)
                                        }}
                                    />
                                </label><br />
                                <button
                                    className="spaceship-display-screen hex-prompt mt-5 p-2"


                                    onClick={(e) => { handleSendMessage() }}
                                >submit
                                </button>

                            </form >
                        </ul>
                    </>);
            default:
                // Default interface if no specific one is found
                return <SwitchBoard />;
        }
    };


    const CustomInterface = () => {
        return renderCustomInterface();
    };



    return (
        <>
            <span
                onClick={() => {
                    playerSelector();
                    console.log(pilotIndex)
                }


                }
                className="absolute text-2xl font-black top-24 cursor-pointer">||-----AI-U-----|| </span>
            <img
                className="absolute p-9 -left-0.5 ml-1.5 -mt-1.5 opacity-5 pointer-events-none -translate-y-6 -z-2"
                src="/aiu.png"
            />
            <div className="relative top-[10%] overflow-auto w-full h-[90%]">

                <div className="overflow-auto relative flex flex-row text-sm text-left spaceship-display-screen p-2 pl-2 ml-2 mt-1 space-y-1"

                    style={{ width: "46%", height: "56%" }}>
                    <CustomInterface />
                </div>

                <img className="absolute top-[5%] right-6 h-[48%] w-[45%] p-2 hex-prompt" src={imageStore.displayImageUrl} />
                <div className="text-sm flex flex-wrap spaceship-display-screen absolute top-[59%] -left-1 p-4 overflow-auto"

                    style={{ width: "100%", height: "25%" }}>
                    CARGO:
                    {myShip?.shipData.cargo && Object.entries(myShip.shipData.cargo).map((cargo: any, index: number) => (
                        <li key={cargo} className="text-bold">{JSON.stringify(cargo)}:<span className="text-white"></span></li>))}

                    <li>STATUS: {myShip?.shipData.currentStatus}</li>

                    <div className="text-white">LOCATION:
                        <ul>

                            {quipux.location && (

                                <ul>
                                    {
                                        Object.entries(quipux.location).map(([key, value], index) => (
                                            <li key={index} className="text-bold">
                                                {key}: <span className="text-white">{JSON.stringify(value)}</span>
                                            </li>
                                        ))
                                    }
                                </ul>
                            )}
                        </ul>

                    </div>

                    <li>FunFact:{myShip?.shipData.funFact}</li>
                </div>

                <br />


            </div>
        </>
    );
};

export default InterGalaReportDisplay;




































































































































































































































































































































































































































































































































































































































































































































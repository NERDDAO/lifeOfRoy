

import React, { useState, useEffect } from "react";
import { useGlobalState, useAppStore, useQuipuxStore, useImageStore } from "@/app/store/store";
import { EncounterResultData, PilotState, ShipState } from '@/app/types/appTypes';
import { MongoClient } from 'mongodb'
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { useAccount, useBlockNumber } from "wagmi";
import { useProvider, useSigner } from "@/app/utils/wagmi-utils";
import axios from "axios";
import toast from "react-hot-toast";
import { postPilotShip } from "@/app/hooks/aiu/useAIU"



const InterGalaReportDisplay = (props: { playHolographicDisplay: () => void }) => {

    // Database Name
    const imageStore = useImageStore(state => state);
    const store = useGlobalState(state => state);
    const app = useAppStore(state => state);
    const quipux = useQuipuxStore(state => state);
    const myPilots = store.myPilots;
    //const myShip = quipux.database?.ships[0];
    const myShip = quipux.shipData;
    const provider = useProvider();
    const easContractAddress = "0xA1207F3BBa224E2c9c3c6D5aF63D0eb1582Ce587";
    const schemaUID = "0xb151d180b92e94a9c52dec14b1e93b975edaf696ea0927223d103845cfd2ca1b";
    const eas = new EAS(easContractAddress);

    const bn = app.blockNumber;

    const { playHolographicDisplay } = props;
    const selectedTokenId = 2;
    const parsedMetadata = null;
    const account = useAccount();

    const address = account?.address;
    const signer = useSigner();
    //const pilotData = { account, nickname, occupation, guild };
    //
    const [pilotIndex, setPilotIndex] = useState(0);

    const currentPilot = myPilots && myPilots[pilotIndex]

    const handleSendMessage = async (data: any) => {
        playHolographicDisplay();
        console.log("data", data);
        let address = data.load.address;
        //setLoading(true);
        try {
            const response = await fetch("/api/newPilot", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data),
            });
            const rparse = await response.json();
            const r = await JSON.parse(rparse.beacon);



            console.log("rawResponse", r);
            let attest, shipPic

            try {
                shipPic = await requestShip(r.shipState)
                imageStore.setImageUrl(shipPic.image)
                quipux.setLocation(r.beaconData);
                quipux.setPilotData(r.pilotState);
                quipux.setShipData(r.shipState);
                await postPilotShip(r.pilotState, r.shipState, r.beaconData, address);
                //attest = await attestPilot(r.pilotData)
                //return attest;


            } catch {
                console.log("Error attesting pilot or ship")

            } finally {/*
                if (attest && shipPic.image) {
                    let s: ShipState = r.shipData
                    let i: string = shipPic.image
                    let k: Location = r.beaconData
                    let ship = { state: s, image: i, location: k }
                    registerPilot(r.pilotData, attest, ship)
                    console.log("shipData", attest, shipPic)
                    toast.success("Pilot Attested");
                }
                else {
                    toast.error("Error attesting pilot or ship")
                }
           */ }

            console.log("rawResponse", r, quipux);

        } catch (error) {
            console.error("Error sending message:", error);
        }
    };





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

    const dataClass = ["playerData", "shipData", "SwitchBoard", "newData", "inputData"];

    function MyForm() {
        const handleSubmit = async (event: any) => {
            event.preventDefault();

            const data = new FormData(event.currentTarget);
            const values = Object.fromEntries(data.entries());
            playHolographicDisplay();
            if (!Number(values.age)) {
                alert('Your age must be a number');
                return;
            }

            let load = { values, bn, address }
            const message = await handleSendMessage({ load });

            console.log('submitting', load, values, message);
        };

        return (
            <form onSubmit={handleSubmit}>
                <p>Enter your name:</p>
                <input type="text" name="username" />

                <p>Enter your age:</p>
                <input type="text" name="age" />

                <p>What is the meaning of life?:</p>
                <input type="text" name="meaningoflife" />

                <br /><br />
                <input className="cursor-pointer hex-prompt" type="submit" />
            </form>
        );
    }
    const renderCustomInterface = () => {
        switch (dataClass[3]) {
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
            case "SwitchBoard":
                // Custom interface for meta scan data
                return (

                    <ul className="relative p-1">


                        <li className="text-white">SHIP DATA:</li>

                        <strong className="text-white text-md"> ID:{myShip && myShip.shipName}<br /></strong>

                        STATS{myShip.stats && Object.entries(myShip?.stats).map(([key, value], index) => (
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
                        <ul className="space-y-2 space-x-2 p-6"

                        >
                            <MyForm />
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

                <div className="relative flex flex-col text-sm text-left spaceship-display-screen pl-2 ml-2 mt-1 space-y-1"

                    style={{ width: "46%", height: "56%" }}>
                    <CustomInterface />
                </div>

                <img className="absolute top-[5%] right-6 h-[48%] w-[45%] p-2 hex-prompt" src={imageStore.imageUrl} />
                <div className="text-sm flex flex-wrap spaceship-display-screen absolute top-[59%] -left-1 p-4 overflow-auto"

                    style={{ width: "100%", height: "25%" }}>
                    CARGO:
                    {myShip?.cargo && Object.entries(myShip.cargo).map((cargo: any, index: number) => (
                        <li key={cargo} className="text-bold">{JSON.stringify(cargo)}:<span className="text-white"></span></li>))}

                    <li>STATUS: {myShip?.currentStatus}</li>

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

                    <li>FunFact:{myShip?.funFact}</li>
                </div>

                <br />


            </div>
        </>
    );
};

export default InterGalaReportDisplay;




































































































































































































































































































































































































































































































































































































































































































































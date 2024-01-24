

import React, { useState, useEffect } from "react";
import { useGlobalState, useAppStore, useQuipuxStore, useImageStore } from "@/app/store/store";
import { EncounterResultData, PilotState, ShipState } from '@/app/types/appTypes';
import { MongoClient } from 'mongodb'
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { useAccount, useBlockNumber } from "wagmi";
import { useProvider, useSigner } from "@/app/utils/wagmi-utils";
import axios from "axios";
import toast from "react-hot-toast";
import { postPilotShip, useNewPilot } from "@/app/hooks/aiu/useAIU"
import { Switchboard } from "@/app/components/aiu/panels/Switchboard"



const InterGalaReportDisplay = (props: { playHolographicDisplay: () => void }) => {

    // Database Name
    const imageStore = useImageStore(state => state);
    const store = useGlobalState(state => state);
    const app = useAppStore(state => state);
    const quipux = useQuipuxStore(state => state);
    const myPilots = store.myPilots;
    //const myShip = quipux.database?.ships[0];
    const provider = useProvider();
    const easContractAddress = "0xA1207F3BBa224E2c9c3c6D5aF63D0eb1582Ce587";
    const schemaUID = "0xb151d180b92e94a9c52dec14b1e93b975edaf696ea0927223d103845cfd2ca1b";
    const eas = new EAS(easContractAddress);

    const bn = app.blockNumber;

    const { playHolographicDisplay } = props;
    const account = useAccount();

    const address = account?.address;
    const [pilotIndex, setPilotIndex] = useState(0);

    const currentPilot = myPilots && myPilots[pilotIndex]

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
            const message = await useNewPilot({ load });

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
                        <ul className="space-y-2 space-x-2 p-6 pb-48">
                            <MyForm />
                        </ul>
                    </>);
            default:
                // Default interface if no specific one is found
                return <Switchboard />;
        }
    };


    const CustomInterface = () => {
        return renderCustomInterface();
    };



    return (
        <>
            <div className="relative flex flex-row text-sm text-left spaceship-display-screen mt-1"

                onClick={(e) => { e.stopPropagation() }}
            >
                <CustomInterface />
                <img className="h-[48%] w-[45%] -ml-4 hex-prompt mb-48" src={imageStore.imageUrl} />

            </div>

        </>
    );
};

export default InterGalaReportDisplay;




































































































































































































































































































































































































































































































































































































































































































































import LogViewer from "./panels/LogViewer";

import { useSoundController, useAppStore, useGlobalState, useImageStore, useQuipuxStore } from "@/app/store/store";

import React, { useState, useEffect } from "react";
import { useProvider, useSigner } from "@/app/utils/wagmi-utils";
import TargetDataDisplay from "./panels/TargetDataDisplay";
import { Settings } from "../settings";
import BotList from "../bot/bot-list";



const MetadataDisplay = (props: {
}) => {
    const sounds = useSoundController(state => state.sounds);
    const audioController = sounds.audioController;

    function playSpaceshipOn() {
        if (sounds.spaceshipOn) {
            audioController?.playSound(sounds.spaceshipOn, true, 0.02);
        }
    }

    function playHolographicDisplay() {
        if (sounds.holographicDisplay) {
            audioController?.playSound(sounds.holographicDisplay, false, 1);
        }
    }

    function playWarpSpeed() {
        if (sounds.warpSpeed) {
            audioController?.playSound(sounds.warpSpeed, false, 1.1);
        }
    }

    // Database Name
    const state = useGlobalState(state => state);
    const quipux = useQuipuxStore(state => state);
    const dummyData = [{ mmsg: "dummy" }]
    const myShips = dummyData;
    const myLocations = dummyData;
    const selectedTokenId = 2;
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



    // ... [your state and function definitions] ...
    const currentPilot = useQuipuxStore(state => state.pilotData);
    const currentLocation = useQuipuxStore(state => state.location);
    const currentShip = useQuipuxStore(state => state.shipData);



    const [count, setCount] = useState(-1);
    const scannerOptions = ["logData", "imageData", "SwitchBoard"];
    const index = () => {
        playHolographicDisplay();
        if (count < scannerOptions.length - 1) {
            setCount(count + 1);
        } else {
            setCount(-1);
        }
    };
    const [indexCount, setIndexCount] = useState(0);

    const handleDataIndexChange = (change: number) => {
        let newIndex = indexCount + change;
        if (newIndex >= displayTypes.length) {
            newIndex = 0; // Wrap around to the beginning
        } else if (newIndex < 0) {
            newIndex = displayTypes.length - 1; // Wrap around to the end
        }
        setIndexCount(newIndex);
        playHolographicDisplay();
    };


    const displayTypes = ["inputData", "logData", "SwitchBoard", "options", "botList"];


    const renderCustomInterface = () => {
        switch (displayTypes[indexCount]) {
            case "inputData":
                // Custom interface for image data
                return (
                    <>
                        <ul
                            className="cursor-pointer w-[100%] h-[50%]"
                        >
                            <span className="text-white text-sm font-bold text-center -mr-10">CMDR</span>

                            <h2 className="text-xl -mt-4 pr-10"><strong className="text-3xl">{currentPilot?.pilotName}</strong><br />#{currentPilot?.pilotId}</h2>

                            <h3 className="text-white font-bold text-lg pr-20">{currentPilot?.guildName}</h3>

                            <li className="text-xs pr-20">" {currentPilot?.currentThought} "</li>
                            {currentPilot?.inventory && Object.entries(currentPilot.inventory).map(([key, value], index) => (
                                <ul key={index} className="pr-24 text-md">
                                    <li key={key}>{key}:<span className="text-white text-right">{JSON.stringify(value)}</span>
                                    </li>
                                </ul >
                            ))}

                        </ul>



                    </>
                );
            case "logData":
                // Custom interface for interplanetary status report
                return <>
                    <ul
                        className=" w-[100%] h-[50%] -space-y-1"
                    >
                        <span className="relative text-sm font-bold text-left text-white left-10 bottom-2 top-0">SHIP</span>

                        <h2 className="absolute  text-sm pr-0  w-60 ml-1 top-[26%] left-1/4"><strong className="-mr-2 text-3xl">{currentShip?.shipName}</strong></h2>

                        <h3 className="relative text-white font-bold text-lg pr-6 pt-4">@{currentLocation?.locationName}</h3>

                        <h3 className="relative pr-2"> {currentShip?.funFact}</h3>
                        <div className="overflow-auto absolute spaceship-display-screen text-center top-[56%] -bt-2 pl-3 flex flex-wrap max-w-[80%] max-h-[50%] text-sm -ml-10 pt-0">MANIFEST
                            <ul className="relative flex flex-wrap text-left top-2 -left-[0%] space-y-3 p-3 justify-left">


                                {currentShip && Object.entries(currentShip.cargo).map(([key, value], index) => (
                                    <ul key={index} className="">
                                        <li key={key} className="text-bold">{key}:<span className="text-white">{JSON.stringify(value)}</span>
                                        </li>
                                    </ul >
                                ))}<br />
                                {currentShip && Object.entries(currentShip.stats).map(([key, value], index) => (

                                    <ul key={index} className="">
                                        <li key={key}>{key}:<span className="text-white text-right">{JSON.stringify(value)}</span>
                                        </li>
                                    </ul >
                                ))}

                            </ul>



                        </div>

                    </ul>




                </>;
            case "SwitchBoard":
                // Custom interface for meta scan data
                return (
                    <>

                        <ul
                            className="text-right absolute top-1/4 right-0 p-1 w-[100%]"
                        >
                            <span className="relative bottom-1 text-white text-sm font-bold text-center">LOCATION</span>

                            <h2 className="text-2xl -mt-2 pr-2 pl-6"><strong>{currentLocation?.locationName}</strong><br />@{currentLocation?.quadrantId}</h2>
                            <li className="text-lg pr-2 pl-16"> <span className="text-white text-sm font-bold text-center">NAVNOTES:</span>{currentLocation?.locationFunFact}</li>


                            <li className="text-sm pr-pl-12"><span className="text-white text-sm font-bold text-center">Nearest Port</span> {currentLocation?.nearestLocationId}</li>

                            <li className="text-sm pr-2 pl-12">{currentLocation?.navigationNotes}</li>



                        </ul>

                    </>
                );
            case "options":
                // Default interface if no specific one is found
                return <>
                    <Settings />
                </>;
            case "botList":
                // Default interface if no specific one is found
                return <>
                    <BotList />
                </>;
        }
    };


    const CustomInterface = () => {
        return renderCustomInterface();
    };



    return (
        <div className="absolute spaceship-display-screen left-5 top-1/4 h-full w-full p-3 text-center screen-border">

            <ul className="p-20 relative right-0 mr-10 pr-12 max-w-[100%] max-h-[22%] z-[10000000] spaceship-display-screen">
                <li className="text-yellow-600 font-black text-5xl p-1">AI-U</li>
                <ul className="relative flex flex-wrap left-36 text-white">
                    {currentLocation?.quadrantId}@
                    {currentLocation?.locationName}

                    <li className="relative left-5">
                        {currentLocation?.coordinates && Object.entries(currentLocation?.coordinates).map(([key, value], index) => (<span key={index}>{" "}{value ? value.toString() : ""}{" "}</span>))}



                    </li>

                </ul>
            </ul>

            <div className="relative flex flex-row screen-border p-3 text-sm">


                <div className="relative rounded-tl-full top-[12%] pl-24 pr-12 spaceship-display-screen max-w-[51.9%] h-[50%] max-h-[50%] left-0.5 text-sm flex flex-wrap text-right">


                    <div className="absolute left-[72%] bottom-[75%] text-xs h-12 max-h-[5%] max-w-[28%] pr-2  spaceship-display-screen">
                        <button className="hover:text-white" onClick={() => handleDataIndexChange(1)}>
                            Previous
                        </button>{" "}

                        || <button
                            className="hover:text-white"
                            onClick={() => handleDataIndexChange(-1)}>Next</button>
                    </div>
                    <CustomInterface />

                </div>
                <div className="relative rounded-tr-full top-[14.2%] left-0 spaceship-display-screen max-w-[51.9%] h-[50%] max-h-[40%] right-0.5 text-sm flex flex-wrap text-left">

                    <LogViewer scannerOptions={[]} scannerOutput={{
                        beaconData: {
                            quadrantId: "",
                            coordinates: [0, 0, 0],
                            locationName: "",
                            locationFunFact: "",
                            nearestLocationId: "",
                            navigationNotes: "",
                            imageUrl: ""
                        },
                        blockNumber: "",
                        imageUrl: "",
                        heroCodex: {
                            heroId: "",
                            historyBrief: "",
                            questBrief: "",
                            inventory: [],
                            powerLevel: 0,
                            funFact: "",
                            locationBeacon0: {
                                quadrantId: "",
                                coordinates: [0, 0, 0],
                                locationName: "",
                                locationFunFact: "",
                                nearestLocationId: "",
                                navigationNotes: "",
                                imageUrl: ""
                            }
                        }
                    }} />
                    <div className="absolute right-[72%] bottom-[75%] text-xs h-12 max-h-[5%] max-w-[28%] pr-2  spaceship-display-screen">
                    </div>


                </div>
            </div>

            <div className="absolute left-0 w-[100%] top-2/3 flex flex-row" >
                <div className="relative p-0 spaceship-display-screen max-w-[25%] left-20 pr-0">
                    Current Target
                    <ul className="relative w-56">
                        <li className="absolute left-8 mr-2 text-white font-bold text-md w-[50%]"> {state.nftData.capName}</li>
                    </ul>
                </div>
                <div className="relative left-96 -ml-4 max-w-[30%] w-12 top-4 text-md spaceship-display-screen">
                    <span className="absolute text-xs -top-5">STATUS</span>

                    {currentPilot?.stats && (
                        <ul>

                            <li className="pl-16">FUEL: <span className="text-white">100%</span></li>

                            <li className="pl-16">SHLD: <span className="text-white">100%</span></li>

                            <strong className="pl-24">HP :<span className="text-white">{currentPilot.stats.maxHealth}%</span></strong><br />


                        </ul>
                    )}
                </div>

            </div>



        </div >
    );
};

export default MetadataDisplay;
function playHolographicDisplay() {
    throw new Error("Function not implemented.");
}


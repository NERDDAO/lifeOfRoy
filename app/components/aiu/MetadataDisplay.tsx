import LogViewer from "./panels/LogViewer";

import { useAppStore, useGlobalState, useImageStore, useQuipuxStore } from "@/app/store/store";

import React, { useState, useEffect } from "react";
import { useProvider, useSigner } from "@/app/utils/wagmi-utils";

import { Home } from "@/app/components/home";


const MetadataDisplay = (props: {
    scannerOutput: any;
    scannerOptions: string[];
    playHolographicDisplay: () => void;
    imageState: { imageUrl: string };
    engaged: boolean;
    setEngaged: (engaged: boolean) => void;
}) => {

    // Database Name
    const imageStore = useImageStore(state => state);
    const store = useGlobalState(state => state);
    const app = useAppStore(state => state);
    const quipux = useQuipuxStore(state => state);
    const myPilots = store.myPilots;
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

    const currentPilot = dummyData;
    const currentShip = myShips[pilotIndex];
    const currentLocation = myLocations[0]


    // ... [your state and function definitions] ...
    const { scannerOutput, scannerOptions, playHolographicDisplay, imageState, engaged, setEngaged } = props;
    const parsedMetadata = useGlobalState(state => state.nftData);
    const planetData = useQuipuxStore(state => state.planetData);
    const shipState = useQuipuxStore(state => state.shipData);



    const [count, setCount] = useState(-1);
    const index = () => {
        playHolographicDisplay();
        if (count < scannerOptions.length - 1) {
            setCount(count + 1);
        } else {
            setCount(-1);
        }
    };
    const heroName = JSON.stringify(
        `${parsedMetadata.Level} ${parsedMetadata.Power1} ${parsedMetadata.Power2} ${parsedMetadata.Power3}`,
    );

    const trimmedName = heroName.replace(/undefined/g, "");

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


    const displayTypes = ["inputData", "logData", "SwitchBoard"];


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

                            <h2 className="text-xl -mt-4 pr-10"><strong className="text-3xl">{currentPilot?.pilotData.pilotName}</strong><br />#{currentPilot?.pilotData.pilotKey}</h2>

                            <h3 className="text-white font-bold text-lg pr-20">{currentPilot?.pilotData.guildName}</h3>

                            <li className="text-xs pr-20">" {currentPilot?.pilotData.currentThought} "</li>
                            <span className="pr-24">BIOMETRIC READING:</span>
                            {currentPilot?.pilotData && Object.entries(currentPilot?.pilotData?.biometricReading).map(([key, value], index) => (
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

                        <h2 className="absolute  text-sm pr-0  w-60 ml-1 top-[26%] left-1/4"><strong className="-mr-2 text-3xl">{currentShip?.shipData?.state?.shipName}</strong></h2>

                        <h3 className="relative text-white font-bold text-lg pr-16 pt-4">@{currentLocation?.locationData?.locationName}</h3>

                        <h3 className="relative pr-16"> {currentShip.shipData.state.currentStatus}</h3>
                        <div className="absolute spaceship-display-screen text-center top-[49%] -bt-2 pl-3 flex flex-row max-w-[60%] max-h-[33%] text-sm -ml-10 pt-0">
                            <span className="absolute spaceship-display-screen max-h-[15%] pt-0.5 text-xs text-center top-0 right-0.5">MANIFEST</span>
                            <ul className="relative flex flex-wrap text-left top-2 -left-[0%]">

                                {currentShip?.shipData?.state && Object.entries(currentShip?.shipData?.state.stats).map(([key, value], index) => (
                                    <ul key={index} className="">
                                        <li key={key}>{key}:<span className="text-white text-right">{JSON.stringify(value)}</span>
                                        </li>
                                    </ul >
                                ))}

                            </ul>

                            <ul className="relative flex flex-wrap right-6 text-right -top-1">
                                Cargo:{currentShip?.shipData?.state && Object.entries(currentShip?.shipData?.state.cargo.cargo).map(([key, value], index) => (
                                    <ul key={index} className="flex flex-col">
                                        <li key={key} className="text-bold">{key}:<span className="text-white">{JSON.stringify(value)}</span>
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
                            className="text-right absolute top-1/4 right-0 p-1 w-[87%]"
                        >
                            <span className="relative bottom-1 text-white text-sm font-bold text-center">LOCATION</span>

                            <h2 className="text-2xl -mt-6 pr-24"><strong>{currentLocation?.locationData.locationName}</strong><br />@{currentLocation?.locationData.quadrantId}</h2>
                            <li className="text-lg pr-32"> <span className="text-white text-sm font-bold text-center">NAVNOTES:</span>{currentLocation?.locationData.locationFunFact}</li>


                            <li className="text-sm pr-32"><span className="text-white text-sm font-bold text-center">Nearest Port</span> {currentLocation?.locationData.nearestPlanetId}</li>

                            <li className="text-sm pr-32">{currentLocation?.locationData.navigationNotes}</li>



                        </ul>

                    </>
                );
            default:
                // Default interface if no specific one is found
                return <>

                    <Home />
                </>;
        }
    };


    const CustomInterface = () => {
        return renderCustomInterface();
    };



    return (
        <div className="absolute spaceship-display-screen left-5 top-1/4 h-full w-full p-3 text-center screen-border">
            {/*
            <ul className="p-20 relative right-0 mr-10 pr-12 max-w-[100%] max-h-[22%] z-[10000000] spaceship-display-screen">
                <li className="text-yellow-600 font-black text-5xl p-1">AI-U</li>
                <ul className="relative flex flex-wrap left-1/4 text-white">
                    {currentLocation?.locationData?.quadrantId}@
                    {currentLocation?.locationData?.locationName}

                    <li className="relative left-5">
                        {currentLocation.locationData && Object.entries(currentLocation.locationData.coordinates).map(([key, value], index) => (<span key={index}>{key}: {" "}{value ? value.toString() : ""}{" "}</span>))}



                    </li>

                </ul>
            </ul>

            <div className="relative flex flex-row screen-border p-3 text-sm">


                <div className="relative rounded-tl-full top-[12%] pl-24 pr-12 spaceship-display-screen max-w-[51.9%] h-[50%] max-h-[50%] left-0.5 text-sm flex flex-wrap text-right">

                    <CustomInterface />

                    <div className="absolute left-[72%] bottom-[75%] text-xs h-12 max-h-[5%] max-w-[28%] pr-2  spaceship-display-screen">
                        <button className="hover:text-white" onClick={() => handleDataIndexChange(1)}>
                            Previous
                        </button>{" "}

                        || <button
                            className="hover:text-white"
                            onClick={() => handleDataIndexChange(-1)}>Next</button>
                    </div>


                </div>
                <div className="relative rounded-tr-full top-[14.2%] left-7 pr-32 pl-12 spaceship-display-screen max-w-[51.9%] h-[50%] max-h-[40%] right-0.5 text-sm flex flex-wrap text-left">

                    <TargetDataDisplay />
                    <div className="absolute right-[72%] bottom-[75%] text-xs h-12 max-h-[5%] max-w-[28%] pr-2  spaceship-display-screen">

                    </div>


                </div>
            </div>

            <div className="absolute left-0 w-[100%] top-2/3 flex flex-row" >
                <div className="relative p-0 spaceship-display-screen max-w-[25%] left-20 pr-0">
                    Current Target
                    <ul className="relative w-56">
                        <li className="absolute left-8 mr-2 text-white font-bold text-md w-[50%]"> {trimmedName}</li>
                    </ul>
                </div>
                <div className="relative left-96 -ml-4 max-w-[30%] w-12 top-4 text-md spaceship-display-screen">
                    <span className="absolute text-xs -top-5">STATUS</span>

                    {currentPilot?.pilotData.biometricReading && (
                        <ul>

                            <li className="pl-16">FUEL: <span className="text-white">100%</span></li>

                            <li className="pl-16">SHLD: <span className="text-white">100%</span></li>

                            <strong className="pl-24">HP :<span className="text-white">{currentPilot?.pilotData.biometricReading.health}%</span></strong><br />


                        </ul>
                    )}
                </div>

            </div>

*/}

        </div >
    );
};

export default MetadataDisplay;

import LogViewer from "./panels/LogViewer";

import { useSoundController, useAppStore, useGlobalState, useImageStore, useQuipuxStore } from "@/app/store/store";
import { SideBar } from "@/app/components/layout/sidebar";
import React, { useState, useEffect } from "react";
import { useProvider, useSigner } from "@/app/utils/wagmi-utils";
import TargetDataDisplay from "./panels/TargetDataDisplay";
import { Settings } from "../settings";
import BotList from "../bot/bot-list";
import { BotScreen } from "../AppComponent";



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

    return (
        <div className="absolute spaceship-display-screen left-5 top-1/4 h-full w-full p-3 text-center screen-border">

            <ul className="p-20 relative right-0 mr-10 pr-12 max-w-[100%] max-h-[18%] z-[10000000] spaceship-display-screen">
                <li className="text-yellow-600 font-black text-5xl p-1">AI-U</li>
                <ul className="relative flex flex-wrap left-36 text-white">
                    {currentLocation?.quadrantId}@
                    {currentLocation?.locationName}

                    <li className="relative left-5">
                        {currentLocation?.coordinates && Object.entries(currentLocation?.coordinates).map(([key, value], index) => (<span key={index}>{" "}{value ? value.toString() : ""}{" "}</span>))}



                    </li>

                </ul>
            </ul>

            <div className="h-1/2 w-[100%] relative flex flex-row screen-border mt-44 pl-12 text-md">



                <BotScreen />



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


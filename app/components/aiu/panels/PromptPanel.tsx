import React, { useState } from "react";
import Switchboard from "./Switchboard";
import type { ApiResponses } from "@/app/types/appTypes";
import { useAppStore, useGlobalState, useImageStore, useQuipuxStore, useSoundController } from "@/app/store/store";



export const PromptPanel: React.FC = () => {
    const attributes = [
        "srcUrl",
        "Level",
        "Power1",
        "Power2",
        "Power3",
        "Power4",
        "Alignment1",
        "Alignment2",
        "selectedDescription",
        "Side",
        "interplanetaryStatusReport",
        "currentEquipmentAndVehicle",
        "currentMissionBrief",
        "abilities",
        "powerLevel",
        "funFact",
        "alienMessage",
    ];
    const [isFocused, setIsFocused] = useState(false);
    const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
    const imageStore = useImageStore();

    const sounds = useSoundController(state => state.sounds);
    const state = useGlobalState(state => state);
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

    const handleClick = () => {
        setIsFocused(!isFocused);
        playHolographicDisplay();
    };

    const handleToggle = (attribute: string, isEnabled: boolean) => {
        if (!isEnabled) {
            setSelectedAttributes(prevState => [...prevState, attribute]);
        } else {
            setSelectedAttributes(prevState => prevState.filter(attr => attr !== attribute));
        }
    };

    return (
        <div className={`prompt-panel${isFocused ? "" : "-closed"}`} onClick={handleClick}>
            <div className={`spaceship-display-screen${isFocused ? "-off" : ""}`}>
                <div className="spaceship-display-screen animated-floating">
                    <div className="display-border">
                        <h1 className="description-text">
                            <p className="font-bold text-2xl">

                                VIEWFINDER<br />
                                {state.nftData.capName}

                            </p>
                        </h1>

                        {isFocused && (
                            <div
                                style={{
                                    transform: "translate(1%)",
                                    opacity: 1,
                                }}
                                className="spaceship-display-screen"
                            >
                                {imageStore.backgroundImageUrl ? (
                                    <img src={imageStore.displayImageUrl} className="screen-border image-display " alt="/aiu.png" />
                                ) : (
                                    <img src={imageStore.imageUrl} className="image-display screen-border" alt="/aiu.png" />
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <br />
            </div>

            <>
                <>
                    <div
                        className="spaceship-display-screen overflow-auto prompt-display-div"
                        style={{
                            overflowX: "hidden",
                            opacity: 1.5,
                        }}
                    >
                        <Switchboard />
                    </div>
                </>
            </>
        </div>
    );
};

export default PromptPanel;

//helper hex function

function stringToHex(str: string): string {
    let hex = "";
    for (let i = 0; i < str.length; i++) {
        hex += str.charCodeAt(i).toString(16);
    }
    return hex;
}



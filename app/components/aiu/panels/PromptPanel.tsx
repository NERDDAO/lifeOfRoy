import React, { useState } from "react";
import Switchboard from "./Switchboard";
import type { ApiResponses } from "@/app/types/appTypes";
import { useAppStore, useGlobalState, useImageStore, useQuipuxStore } from "@/app/store/store";

interface PromptPanelProps {
    playHolographicDisplay: () => void;
    scanning: boolean;
    handleEngaged: (engaged: boolean) => void;
    travelStatus: string | undefined;
    warping: boolean;
    engaged: boolean;
    setModifiedPrompt: (modifiedPrompt: string) => void;
    description: string;
    buttonMessageId: string | "";
    imageUrl: string;
    srcUrl: string;
    loading: boolean;
    metadata: ApiResponses;
    onSubmitPrompt: (type: "character" | "background") => Promise<void>;
    onSubmit: (type: "character" | "background") => Promise<void>;
    handleButtonClick: (button: string, type: "character" | "background") => void;
    //Type '(type: "character" | "background", srcURL: string | undefined, level: string, power1: string, power2: string, power3: string, power4: string, alignment1: string, alignment2: string, selectedDescription: string, nijiFlag: boolean, vFlag: boolean, side: string) => string' is not assignable to type '() => void'.
}

export const PromptPanel: React.FC<PromptPanelProps> = ({
    description,
    playHolographicDisplay,
    handleEngaged,
    travelStatus,
    warping,
    scanning,
    engaged,
    setModifiedPrompt,
    imageUrl,
    srcUrl,
    metadata,
}) => {
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
    function handleModifiedPrompt(modifiedPrompt: string) {
        //Do something with the modifiedPrompt, e.g., update the state or perform other actions
        setModifiedPrompt(modifiedPrompt);
        console.log(modifiedPrompt);
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
                                {metadata.nftData.Level} {metadata.nftData.Power1} {metadata.nftData.Power2} {metadata.nftData.Power3}
                                {metadata.nftData.Power4}{" "}
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

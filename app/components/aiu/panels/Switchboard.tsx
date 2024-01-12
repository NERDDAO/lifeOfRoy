import React, { useEffect, useState } from "react";
import { useSoundController, useImageStore, useGlobalState, useAppStore } from "@/app/store/store";
import type { ApiResponses, ToggleOptions } from "@/app/types/appTypes";
import { generatePrompt, stringToHex } from "@/app/utils/nerdUtils";

export const Switchboard: React.FC = ({ }) => {
    const scanning = false;
    const state = useGlobalState(state => state);
    const app = useAppStore(state => state);
    const imageState = useImageStore(state => state);

    // set string state to be either "character" or "background enforcing type
    const [type, setType] = useState<"character" | "background">("character");
    const [nijiFlag, setNijiFlag] = useState<boolean>(false);
    const [vFlag, setVFlag] = useState<boolean>(false);
    const [displayPrompt, setDisplayPrompt] = useState("");
    const [toggleOptions, setToggleOptions] = useState<ToggleOptions>({});
    useEffect(() => {
        generateModifiedPrompt();
    }, [toggleOptions]);
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

    const setModifiedPrompt = state.setModifiedPrompt;
    const modifiedPrompt = state.modifiedPrompt;

    const switchBoardButtons = ["Niji", "V5", "Background", "DESC", "URL", "CLEAR"];

    const renderCheckbox = (label: string, state: boolean, setState: React.Dispatch<React.SetStateAction<boolean>>) => (
        <label>
            {label}
            <input
                type="checkbox"
                checked={state}
                onChange={e => {
                    e.stopPropagation();
                    setState(e.target.checked);
                }}
            />
        </label>
    );
    const generateModifiedPrompt = () => {
        const promptType = scanning ? "background" : "character";

        // Use the toggleOptions to filter the promptData
        //const newPrompt = response.replace(/undefined/g, "");
        // Generate the prompt using the filtered data
        // Update the modifiedPrompt state
        //setModifiedPrompt(newPrompt);
    };

    return (
        <>
            -ENCODE SIGNAL-
            <div
                onClick={e => {
                    e.stopPropagation();
                }}
                className="spaceship-display-screen"
            >
                <>
                    <p className="description-text" style={{ color: "white" }}>
                        {" "}
                        ||||||||||||AI-UNIVERSE SIGNAL ENCODER||||||||||||||
                    </p>
                    <div className="hex-prompt">
                        <div
                            style={{
                                padding: "20px",
                                color: "white",
                            }}
                        >
                            <input
                                style={{
                                    top: "10%",
                                    height: "10%",
                                    left: "-0%",
                                    position: "absolute",
                                }}
                                type="text"
                                className="prompt-input spaceship-display-screen overflow-hidden"
                                value={state.modifiedPrompt}
                                onChange={e => {
                                    e.stopPropagation();
                                    playHolographicDisplay();
                                    setModifiedPrompt(e.target.value);
                                }}
                            />

                            <div className="hex-data">
                                {stringToHex(modifiedPrompt)}
                                {stringToHex(modifiedPrompt)}
                                {stringToHex(modifiedPrompt)}
                                {stringToHex(modifiedPrompt)}
                                {stringToHex(modifiedPrompt)}
                                {stringToHex(modifiedPrompt)}
                                {stringToHex(modifiedPrompt)}
                                {stringToHex(modifiedPrompt)}
                            </div>

                            {modifiedPrompt}
                        </div>
                        <br />
                        <div
                            style={{
                                display: "flexbox",
                                flexDirection: "column",
                                justifyContent: "space-between",
                            }}
                        ></div>

                        <br />
                        <div
                            className="spaceship-display-screen switchboard-attribute-container"
                            style={{
                                position: "relative",
                            }}
                        >
                            |||||||||||-------|DETECTED SIGNATURE DATA|----|||||||||||||
                            <div className="switchboard-real">
                                <button
                                    className="description-text spaceship-display-screen"
                                    style={{ border: "1px solid", margin: "10px", alignContent: "right" }}
                                    onClick={e => {
                                        {
                                            app.setTravelStatus("AcquiringTarget");
                                            playHolographicDisplay();
                                            //onModifiedPrompt(displayPrompt || "");
                                        }
                                        e.stopPropagation();
                                    }}
                                >
                                    Submit
                                </button>
                                <div
                                    className="toggles-container"
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        border: "1px solid",
                                        margin: "10px",
                                        alignContent: "right",

                                        padding: "10px",
                                        width: "38%",
                                        backgroundColor: "black",
                                        top: "0%",
                                        position: "relative",
                                    }}
                                >
                                    {renderCheckbox("nijiFlag", nijiFlag, setNijiFlag)}
                                    {renderCheckbox("vFlag", vFlag, setVFlag)}
                                </div>{" "}
                            </div>
                        </div>
                    </div>
                </>
            </div>
        </>
    );
    // Helper function to convert a string to a hex string
};
export default Switchboard;

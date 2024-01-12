import React, { useEffect, useState } from "react";
import ChatWithCaptain from "./ChatWithCaptain";
import { useGlobalState, useImageStore, useSoundController } from "@/app/store/store";
import type { PlanetData, ToggleOptions } from "@/app/types/appTypes";
import { generatePrompt, stringToHex } from "@/app/utils/nerdUtils";
import { BotScreen } from "@/app/components/AppComponent"

export const DescriptionPanel: React.FC = () => {
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
    const [focused, setFocused] = useState(false);

    const [toggle, setToggle] = useState<boolean>(false);

    const imageState = useImageStore(state => state);
    const handleClick = () => {
        playHolographicDisplay();
        setFocused(!focused);
    };

    const handleScanClick = () => {
        playHolographicDisplay();

        setToggle(!toggle);
        handleDescribeClick();
    };

    const handleButtonClick = () => {
        playHolographicDisplay();
        handleScanning(true);
        handleSubmit("background");
        setToggle(!toggle);
    };

    const nftData = useGlobalState(state => state.nftData);
    const chatData = useGlobalState(state => state.chatData);
    const heroName = JSON.stringify(
        `${nftData.Level} ${nftData.Power1} ${nftData.Power2} ${nftData.Power3} ${nftData.Power3}`,
    ).replace(/undefined/g, "");

    const [modifiedPrompt, setModifiedPrompt] = useState("ALLIANCEOFTHEINFINITEUNIVERSE");

    // set string state to be either "character" or "background enforcing type
    const [type, setType] = useState<"character" | "background">("character");
    const [nijiFlag, setNijiFlag] = useState<boolean>(false);
    const [vFlag, setVFlag] = useState<boolean>(false);
    const [displayPrompt, setDisplayPrompt] = useState("");
    const [toggleOptions, setToggleOptions] = useState<ToggleOptions>({});

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

    const [count, setCount] = useState(0);
    const [chatLog, setChatLog] = useState<string[]>([]);
    const [userMessage, setUserMessage] = useState<string>("");

    const handleUserMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserMessage(event.target.value);
    };

    const handleSendMessage = async () => {
        playHolographicDisplay();
        try {
            const response = await fetch("/api/chatWithCaptain", {
                method: "POST",
                headers: {
                    "Content-Type": "text/event-stream",
                },
                body: JSON.stringify({ userMessage, userSelection: chatData.userSelection, chatHistory: chatLog }),
            });

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            let captainResponse = "";
            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const partialResponse = decoder.decode(value, { stream: true });
                    captainResponse += partialResponse;
                    setChatLog([captainResponse]);
                    // Scroll to the bottom of the chat log container
                }
                chatData.naviMessages?.push(captainResponse);
                setUserMessage(userMessage);
                // Update global state here if necessary
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };
    useEffect(() => {
        const chatContainer = document.getElementById(".chat-log-container");
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }, [chatLog]); // Dependency array includes chatLog, so this runs when chatLog changes

    // Helper function to convert a string to a hex string

    return (
        <>
            <div
                className={`${focused ? "focused-right spaceship-display-screen" : "unfocused-right scale-100 spaceship-display-screen"
                    }  spaceship-panel screen-border`}
                style={{
                    transition: "all 0.5s ease-in-out",
                    padding: "0.4rem",
                    height: "40%",
                    width: "23%",
                    left: "70%",
                    top: "40%",
                }}
                onClick={handleClick}
            >

                <p className="text-3xl text-white font-bold p-5">N.A.V.I. COMMS</p>
                <div
                    onClick={e => {
                        e.stopPropagation();
                    }}
                    className="relative spaceship-display-screen overflow-scroll"
                    style={{
                        left: "-1%",
                        color: "white",
                    }}
                >
                    <>




                        <BotScreen />


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
                    </>
                </div>
            </div>
        </>
    );
};

export default DescriptionPanel;
function playHolographicDisplay() {
    throw new Error("Function not implemented.");
}

function handleDescribeClick() {
    throw new Error("Function not implemented.");
}

function handleScanning(arg0: boolean) {
    throw new Error("Function not implemented.");
}

function handleSubmit(arg0: string) {
    throw new Error("Function not implemented.");
}


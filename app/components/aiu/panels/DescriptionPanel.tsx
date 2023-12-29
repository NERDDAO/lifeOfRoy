import React, { useEffect, useState } from "react";
import ChatWithCaptain from "./ChatWithCaptain";
import { useGlobalState, useImageStore } from "@/app/store/store";
import type { PlanetData, ToggleOptions } from "@/app/types/appTypes";
import { generatePrompt, stringToHex } from "@/app/utils/nerdUtils";
import { Home } from "@/app/components/home";
interface DescriptionPanelProps {
    alienMessage: PlanetData;
    playHolographicDisplay: () => void;

    scanning: boolean;
    handleScanning: (scanning: boolean) => void;
    travelStatus: string | undefined;
    description: string[];

    onDescriptionIndexChange: (index: number) => void;
    selectedTokenId: string | null;
    handleDescribeClick: () => void;
    handleSubmit: (type: "character" | "background") => Promise<void>;
}

export const DescriptionPanel: React.FC<DescriptionPanelProps> = ({
    alienMessage,
    playHolographicDisplay,
    handleSubmit,
    scanning,
    handleScanning,
    travelStatus,
    description,
    handleDescribeClick,
    selectedTokenId,
}) => {
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

    const planetData = useGlobalState(state => state.planetData);
    const metaScan = useGlobalState(state => state.metaScanData);
    const state = useGlobalState(state => state);
    const nftData = useGlobalState(state => state.nftData);
    const chatData = useGlobalState(state => state.chatData);
    const setChatData = useGlobalState(state => state.setChatData);
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
            -ENCODE SIGNAL-
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
                <div
                    className="absolute screen-border p-5 pt-0 "
                    style={{
                        height: "100%",
                        width: "100%",
                        top: "0%",
                        left: "0%",

                        flexDirection: "row",
                        backdropFilter: "blur(3px)",

                        position: "absolute",
                    }}
                >
                    <ul>
                        <li className="text-3xl text-white font-bold p-5">N.A.V.I. COMMS</li>
                    </ul>
                    <div
                        onClick={e => {
                            e.stopPropagation();
                        }}
                        className="absolute spaceship-display-screen overflow-scroll"
                        style={{
                            left: "-1%",
                        }}
                    >
                        <>

                            <p className="description-text" style={{ color: "white" }}>
                                {" "}
                                ||||||||||||AI-UNIVERSE SIGNAL ENCODER||||||||||||||
                            </p>

                            <Home />




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
            </div >
        </>
    );
};

export default DescriptionPanel;

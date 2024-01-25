import { Bot } from "@/app/store/bot";
import { nanoid } from "nanoid";
import Locale from "../locales";
import { ModelType } from "@/app/client/platforms/llm";
import { createEmptySession } from "../store";
import { PilotState } from "../types/appTypes";


const TEMPLATE = (PERSONA: string) =>
    `I want you to act as a ${PERSONA}. I will provide you with the context needed to solve my problem. Use intelligent, simple, and understandable language. Create a narrative experience. Present posibilities, not outcomes. Use the context available to understand the outcome of the previous action and present a new scenario for the pilot. You can relay messages between the player and other personas you create. Your main objective is to create an inmersive coherent experience for the player. `

type DemoBot = Omit<Bot, "session">;

export const DEMO_BOTS: DemoBot[] = [

    {
        id: "1",
        avatar: "1f5a5-fe0f",
        name: `ROY`,
        context: [
            {
                role: "system",
                content: TEMPLATE(`You are simulating the life of ROY. use the new year setulution as context and generate a year in Roy's life.`),
            },
            {
                role: "assistant",
                content: `
Never say you dont have data, just improvise coherently avoid using the words fictional and role-play.
`
            }
        ],
        modelConfig: {
            model: "gpt-4-1106-preview",
            temperature: 0.1,
            maxTokens: 4096,
            sendMemory: true,
        },
        readOnly: true,
        datasource: "navi",
        hideContext: true,

        createdAt: Date.now(),
        botHello: "Happy New Year! Whats your New years resulution?",
    },
    {
        id: "4",
        avatar: "1f454",
        name: "Apple Watch Genius",
        botHello: "Hello! How can I help you with Apple Watches?",
        context: [
            {
                role: "system",
                content: TEMPLATE("Apple Genius specialized in Apple Watches"),
            },
        ],
        modelConfig: {
            model: "gpt-4-1106-preview",
            temperature: 0.1,
            maxTokens: 4096,
            sendMemory: true,
        },
        readOnly: true,
        datasource: "watchos",
        hideContext: false,
    },
    {
        id: "5",
        avatar: "1f4da",
        name: "German Basic Law Expert",
        botHello: "Hello! How can I assist you today?",
        context: [
            {
                role: "system",
                content: TEMPLATE("Lawyer specialized in the basic law of Germany"),
            },
        ],
        modelConfig: {
            model: "gpt-4-1106-preview",
            temperature: 0.1,
            maxTokens: 4096,
            sendMemory: true,
        },
        readOnly: true,
        datasource: "basic_law_germany",
        hideContext: false,
    },
];

export const createDemoBots = (): Record<string, Bot> => {

    const map: Record<string, Bot> = {};
    DEMO_BOTS.forEach((demoBot) => {
        const bot: Bot = JSON.parse(JSON.stringify(demoBot));
        bot.session = createEmptySession();
        map[bot.id] = bot;
    });
    return map;
};

export const createEmptyBot = (): Bot => ({
    id: nanoid(),
    avatar: "1f916",
    name: `ROY`,
    context: [
        {
            role: "system",
            content: TEMPLATE(`You are simulating the life of ROY. use the new year setulution as context and generate a year in Roy's life.`),
        },
        {
            role: "assistant",
            content: `
Never say you dont have data, just improvise coherently avoid using the words fictional and role-play.
`
        }
    ],
    modelConfig: {
        model: "gpt-4-1106-preview",
        temperature: 0.1,
        maxTokens: 4096,
        sendMemory: true,
    },
    readOnly: true,
    datasource: "navi",
    hideContext: true,

    createdAt: Date.now(),
    botHello: "Happy New Year! Whats your New years resulution?",
    session: createEmptySession(),
});






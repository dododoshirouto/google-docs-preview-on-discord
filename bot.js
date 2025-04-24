
import { Client, GatewayIntentBits } from "discord.js";
import axios from "axios";

import dotenv from "dotenv";
dotenv.config();

// ** require arrow "Message Content Intent" in Discord Developer Portal
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const GAS_ENDPOINT = process.env.GAS_ENDPOINT;

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) {
        return;
    }

    const urls = getGoogleDocsURLs(message.content);
    for (const url of urls) {
        const response = await previewGoogleDocs(url.url, url.type);
        try {
            // await message.reply(response.description);
            await sendReplay(message, response.url, response.title, response.description, response.type);
        } catch (error) {
            console.error(error);
            console.error(response);
            console.error(url);
            await message.reply("読み取れないファイルだったのだ…");
        }
    }
});

client.login(DISCORD_TOKEN);

/**
 * DiscordにOGP風の埋め込みメッセージを送信する関数
 * @param {Message} message - Discord.jsのメッセージオブジェクト
 * @param {string} url - ファイルのURL
 * @param {string} title - ファイル名（または識別用タイトル）
 * @param {string} description - プレビュー本文（500文字以内推奨）
 */
async function sendReplay(message, url, title, description, type) {
    try {
        await message.reply({
            embeds: [
                {
                    title: title || "（タイトルなし）",
                    description: description || "（本文なし）",
                    url: url,
                    color: google_docs_url_patterns.find(p => p.type == type)?.color ?? "#e9eef6",
                    footer: {
                        text: type || "（タイプなし）",
                    }
                }
            ]
        });
    } catch (error) {
        console.error("送信エラー:", error);
        await message.reply("埋め込みの送信に失敗したのだ…");
    }
}


/**
 * GASに送信してGoogleドキュメントの概要を取得する
 * @param {string} url 
 * @param {string} type 
 * @returns {string}
 */
async function previewGoogleDocs(url, type) {
    const response = await axios.post(GAS_ENDPOINT, {
        url,
        type
    });
    return response.data;
}

/**
 * Googleドライブ系のURLを抽出する
 * @param {string} text 
 * @returns {{type:string, url:string}[]}
 */
function getGoogleDocsURLs(text) {
    const results = [];

    for (const { type, regex } of google_docs_url_patterns) {
        const matches = text.matchAll(regex);
        for (const match of matches) {
            results.push({ type, url: match[0] });
        }
    }

    return results;
}
const google_docs_url_patterns = [
    { type: "document", regex: /https:\/\/docs\.google\.com\/document\/d\/[a-zA-Z0-9_-]+(?:\/[^\s]*)?/g, color: 0x4285f4 },
    { type: "spreadsheet", regex: /https:\/\/docs\.google\.com\/spreadsheets\/d\/[a-zA-Z0-9_-]+(?:\/[^\s]*)?/g, color: 0x34a853 },
    { type: "presentation", regex: /https:\/\/docs\.google\.com\/presentation\/d\/[a-zA-Z0-9_-]+(?:\/[^\s]*)?/g, color: 0xfbbc04 },
    { type: "form", regex: /https:\/\/docs\.google\.com\/forms\/d\/[a-zA-Z0-9_-]+(?:\/[^\s]*)?/g, color: 0x7248b9 },
    { type: "drive_file", regex: /https:\/\/drive\.google\.com\/file\/d\/[a-zA-Z0-9_-]+(?:\/[^\s]*)?/g, color: 0xe9eef6 },
    { type: "drive_folder", regex: /https:\/\/drive\.google\.com\/drive\/(?:u\/\d+\/)?folders\/[a-zA-Z0-9_-]+/g },
    { type: "folder_legacy", regex: /https:\/\/drive\.google\.com\/folders\/[a-zA-Z0-9_-]+/g },
    { type: "drive_open_id", regex: /https:\/\/drive\.google\.com\/open\?id=[a-zA-Z0-9_-]+/g }
];

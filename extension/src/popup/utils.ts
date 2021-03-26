import {Message} from "../common/Message";
import {supportedPages} from "../util/supportedPages";

export function openTab(url: string) {
    chrome.tabs.create({url: url});
}

export async function isCurrentPageSupported(): Promise<boolean> {
    let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    if (tab.id) {
        return supportedPages.find((page) => tab.url!!.match(page.regex)) !== undefined;
    } else {
        return false;
    }
}

export async function sendMessageToCurrentTab(message: Message) {
    let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    if (tab.id) {
        chrome.tabs.sendMessage(tab.id, message);
    }
}

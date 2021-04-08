import {Message} from "../common/Message";
import {supportedPages, TestPage} from "../util/supportedPages";

export function openTab(url: string) {
    chrome.tabs.create({url: url});
}

export async function getCurrentPageInfo(): Promise<TestPage|undefined> {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    if (tab.id) {
        return supportedPages.find((page) => tab.url!!.match(page.regex));
    } else {
        return undefined;
    }
}

export async function sendMessageToCurrentTab(message: Message) {
    let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    if (tab.id) {
        chrome.tabs.sendMessage(tab.id, message);
    }
}

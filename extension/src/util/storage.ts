export function clearData() {
    chrome.storage.local.clear();
}

export const addOnChangedListener = chrome.storage.onChanged.addListener.bind(chrome.storage.onChanged);
export const removeOnChangedListener = chrome.storage.onChanged.removeListener.bind(chrome.storage.onChanged);

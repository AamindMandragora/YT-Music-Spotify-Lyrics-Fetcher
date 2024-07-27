let client_id;
let client_secret;
let client_access_token;

import("./api_secrets.js").then((module) => {
    client_id = module.client_id;
    client_secret = module.client_secret;
    client_access_token = module.client_access_token;
})

function prevClick(selector) {
    if (selector == 'yt') {
        document.getElementsByClassName("previous-button")[0].click();
    } else if (selector == 'spotify') {
        document.getElementsByClassName("fn72ari9aEmKo4JcwteT")[0].click();
        onWindowLoad();
    }
}

function prevSong() {
    chrome.tabs.query({}).then(function (tabs) {
        var activeTab = tabs[0];
        for (var tab in tabs) {
            if (tabs[tab].url.includes("youtube") || tabs[tab].url.includes("spotify")) {
                activeTab = tabs[tab];
            }
        }
        var activeTabId = activeTab.id;
        if ((activeTab.url).includes("youtube")) {
            document.body.style.setProperty("--accent", "#f00");
            return chrome.scripting.executeScript({
                target: { tabId: activeTabId },
                injectImmediately: true,
                func: prevClick,
                args: ['yt']
            });
        } else if ((activeTab.url).includes("spotify")) {
            document.body.style.setProperty("--accent", "#1DB954");
            return chrome.scripting.executeScript({
                target: { tabId: activeTabId },
                injectImmediately: true,
                func: prevClick,
                args: ['spotify']
            });
        }
    })
}

document.getElementById("prevSong").addEventListener("click", prevSong)

function pauseClick(selector) {
    if (selector == 'yt') {
        document.getElementById("play-pause-button").click();
    } else if (selector == 'spotify') {
        document.getElementsByClassName("vnCew8qzJq3cVGlYFXRI")[0].click();
        onWindowLoad();
    }
}

function pauseSong() {
    chrome.tabs.query({}).then(function (tabs) {
        var activeTab = tabs[0];
        for (var tab in tabs) {
            if (tabs[tab].url.includes("youtube") || tabs[tab].url.includes("spotify")) {
                activeTab = tabs[tab];
            }
        }
        var activeTabId = activeTab.id;
        if ((activeTab.url).includes("youtube")) {
            document.body.style.setProperty("--accent", "#f00");
            return chrome.scripting.executeScript({
                target: { tabId: activeTabId },
                injectImmediately: true,
                func: pauseClick,
                args: ['yt']
            });
        } else if ((activeTab.url).includes("spotify")) {
            document.body.style.setProperty("--accent", "#1DB954");
            return chrome.scripting.executeScript({
                target: { tabId: activeTabId },
                injectImmediately: true,
                func: pauseClick,
                args: ['spotify']
            });
        }
    })
}

document.getElementById("pause").addEventListener("click", pauseSong)

function nextClick(selector) {
    if (selector == 'yt') {
        document.getElementsByClassName("next-button")[0].click();
    } else if (selector == 'spotify') {
        document.getElementsByClassName("mnipjT4SLDMgwiDCEnRC")[0].click();
        onWindowLoad();
    }
}

function nextSong() {
    chrome.tabs.query({}).then(function (tabs) {
        var activeTab = tabs[0];
        for (var tab in tabs) {
            if (tabs[tab].url.includes("youtube") || tabs[tab].url.includes("spotify")) {
                activeTab = tabs[tab];
            }
        }
        var activeTabId = activeTab.id;
        if ((activeTab.url).includes("youtube")) {
            document.body.style.setProperty("--accent", "#f00");
            return chrome.scripting.executeScript({
                target: { tabId: activeTabId },
                injectImmediately: true,
                func: nextClick,
                args: ['yt']
            });
        } else if ((activeTab.url).includes("spotify")) {
            document.body.style.setProperty("--accent", "#1DB954");
            return chrome.scripting.executeScript({
                target: { tabId: activeTabId },
                injectImmediately: true,
                func: nextClick,
                args: ['spotify']
            });
        }
    })
}

document.getElementById("nextSong").addEventListener("click", nextSong)

function DOMtoString(selector) {
    if (selector == 'yt') { 
        title = document.getElementsByClassName("title style-scope ytmusic-player-bar")[0].innerText;
        subtitle = document.getElementsByClassName("subtitle style-scope ytmusic-player-bar")[0].innerText;
        subtitle = subtitle.split("\n")
        subtitle = subtitle.filter((element, index) => {return index % 2 == 0;})
        subtitle = subtitle.join(" - ")
    } else if (selector == "spotify") {
        title = document.getElementsByClassName("encore-text encore-text-body-small K9Nj3oI7bTNFh5AGp5GA")[0].innerText;
        subtitle = document.getElementsByClassName("encore-text encore-text-marginal encore-internal-color-text-subdued w_TTPh4y9H1YD6UrTMHa")[0].innerText;
        subtitle = subtitle.split("\n")
        subtitle = subtitle.join("")
    }
    return [title, subtitle];
}

function onWindowLoad() {
    var title = document.getElementById('title');
    var subtitle = document.getElementById('subtitle');
    document.getElementById("content").innerText = "Finding lyrics..."

    chrome.tabs.query({}).then(function (tabs) {
        var activeTab = tabs[0];
        for (var tab in tabs) {
            if (tabs[tab].url.includes("youtube") || tabs[tab].url.includes("spotify")) {
                activeTab = tabs[tab];
            }
        }
        var activeTabId = activeTab.id;
        if ((activeTab.url).includes("youtube")) {
            document.body.style.setProperty("--accent", "#f00");
            return chrome.scripting.executeScript({
                target: { tabId: activeTabId },
                injectImmediately: true,
                func: DOMtoString,
                args: ['yt']
            });
        } else if ((activeTab.url).includes("spotify")) {
            document.body.style.setProperty("--accent", "#1DB954");
            return chrome.scripting.executeScript({
                target: { tabId: activeTabId },
                injectImmediately: true,
                func: DOMtoString,
                args: ['spotify']
            });
        }

    }).then(function(results) {
        title.innerText = (results[0].result[0]) + " Lyrics";
        subtitle.innerText = (results[0].result[1]);
        var artist = subtitle.innerText;
        if (artist.includes(" - ")) {
            artist = artist.split(" - ")[0];
        } if (artist.includes(", ")) {
            artist = artist.split(", ")[0];
        } else if (artist.includes(" | ")) {
            artist = artist.split(" | ")[0];
        }
        const searchurl = `http://api.genius.com/search?q=${results[0].result[0]}&access_token=${client_access_token}`;
        fetch(searchurl).then(r => r.text()).then(result => {
            result = JSON.parse(result);
            var index = -1;
            for (var i in result["response"]["hits"]) {
                if (result["response"]["hits"][i]["result"]["primary_artist_names"].includes(artist)) {
                    index = i;
                    break;
                }
            }
            let songurl = "https://genius.com/";
            if (index != -1) {
                songurl = `${result["response"]["hits"][index]["result"]["url"]}`;
            } else {
                for (var x in artist.split(" ")) {
                    songurl += artist.split(" ")[x] + "-";
                }
                for (var x in results[0].result[0].split("-")) {
                    songurl += results[0].result[0].split("-")[x] + "-"
                }
                songurl += "lyrics";
            }
            fetch(songurl).then(r => r.text()).then(result => {
                const parser = new DOMParser();
                const parsed = parser.parseFromString(result, 'text/html');
                let lyrics = parsed.getElementsByClassName("Lyrics__Container-sc-1ynbvzw-1")[0];
                ['br'].forEach(tag => {
                    lyrics.querySelectorAll(tag).forEach(ele => {
                        ele.replaceWith("\n")
                    })
                })
                document.getElementById("content").innerText = lyrics.innerText
            }).catch(function(error) {
                document.getElementById("content").innerText = "Sorry, we couldn't get the lyrics for this song."
            })
        })
    }).catch(function(error) {
        title.innerText = "This site isn't supported.";
        subtitle.innerText = "This extension can only read Spotify and Youtube Music"
    });
}

window.onload = onWindowLoad;
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.url) {
        onWindowLoad();
    }
})

document.getElementById("getLyrics").addEventListener('click', onWindowLoad)
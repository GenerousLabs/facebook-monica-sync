import { getFriends } from "../facebook/friends";
import {
  getState,
  setFacebookFriendsToScrape,
  setFacebookFriendsUrl,
} from "../state";
import { getSanitisedFriendsListUrl } from "../urls";
import { getByIdOrThrow } from "../utils";

const startFriendCapture = async () => {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  if (tabs.length !== 1) {
    throw new Error("FATAL: Failed to find exactly 1 current tab #Ch6ToS");
  }
  const { url } = tabs[0];

  if (typeof url !== "string") {
    globalThis.alert(
      "Please try that again with your Facebook friends list in the current tab. #PMDtW8"
    );
    return;
  }

  const facebookFriendsUrl = getSanitisedFriendsListUrl(url);

  if (
    !globalThis.confirm(
      `Is this your Facebook friends list?\n\n${facebookFriendsUrl}`
    )
  ) {
    globalThis.alert(
      `Please click this button when your Facebook friends list is the current tab.`
    );
    return;
  }

  await setFacebookFriendsUrl({ facebookFriendsUrl });

  if (
    !globalThis.confirm(
      "Do you want to start scraping your friends list now? #mveUpB"
    )
  ) {
    return;
  }

  await browser.tabs.reload();
};

const startFriendScraping = async () => {
  const friends = await getFriends();
  await setFacebookFriendsToScrape(friends);
};

const bindButtons = (doc: Document) => {
  try {
    getByIdOrThrow(doc, "scrapeFriendsList").onclick = startFriendCapture;
  } catch (error) {}
  try {
    getByIdOrThrow(doc, "scrapeFriendData").onclick = startFriendScraping;
  } catch (error) {}
};

const insertStats = async (doc: Document) => {
  try {
    const friends = await getFriends();
    getByIdOrThrow(doc, "friendCount").innerText = friends.length.toString();
  } catch (error) {}
  try {
    const { facebookFriendsToScrape } = await getState();
    getByIdOrThrow(doc, "friendsStillToScrape").innerText = (
      facebookFriendsToScrape || []
    ).length.toString();
  } catch (error) {}
};

const showScrapingStatus = async (doc: Document) => {
  const { facebookFriendsToScrape } = await getState();
  if (
    typeof facebookFriendsToScrape === "undefined" ||
    facebookFriendsToScrape.length === 0
  ) {
    getByIdOrThrow(doc, "noScrapeRunning").style.display = "block";
    getByIdOrThrow(doc, "scrapeIsRunning").style.display = "none";
  } else {
    getByIdOrThrow(doc, "noScrapeRunning").style.display = "none";
    getByIdOrThrow(doc, "scrapeIsRunning").style.display = "block";
  }
};

const popupStart = async (doc: Document) => {
  bindButtons(doc);
  insertStats(doc);
  showScrapingStatus(doc);
};

globalThis.setTimeout(() => {
  popupStart(globalThis.document);
}, 300);

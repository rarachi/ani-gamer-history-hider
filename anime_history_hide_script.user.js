// ==UserScript==
// @name         動畫瘋隱藏觀看紀錄
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在每個卡片右上角新增隱藏按鈕，點擊後即可隱藏該卡片，並將該卡片的標題存入 localStorage，當重新整理頁面時，隱藏的卡片將不會再出現。在標題下方新增還原1筆紀錄按鈕，點擊後即可還原最後一筆隱藏的卡片。
// @author       rarachi
// @match        https://ani.gamer.com.tw/viewList.php*
// @updateURL    https://raw.githubusercontent.com/rarachi/ani-gamer-history-hider/main/anime_history_hide_script.user.js
// @downloadURL  https://raw.githubusercontent.com/rarachi/ani-gamer-history-hider/main/anime_history_hide_script.user.js
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const prefix = "hidden_";
  //隱藏紀錄
  const addCloseButton = (card) => {
    const closeButton = document.createElement("button");
    closeButton.textContent = "x";
    closeButton.style.position = "absolute";
    closeButton.style.right = "0";
    closeButton.style.top = "0";
    closeButton.style.backgroundColor = "transparent";
    closeButton.style.color = "white";
    closeButton.style.border = "none";
    closeButton.style.boxShadow = "none";
    closeButton.onclick = () => {
      card.parentElement.style.display = "none";
      const animeTitle = card.querySelector(".history-anime-title").textContent;
      const hiddenCards = JSON.parse(
        localStorage.getItem("hiddenCards") || "[]"
      );
      hiddenCards.push(animeTitle);
      localStorage.setItem("hiddenCards", JSON.stringify(hiddenCards));
    };
    card.style.position = "relative";
    card.appendChild(closeButton);
  };

  const animeCards = document.querySelectorAll(".anime-card");
  const animeTitlesInPage = Array.from(animeCards).map(
    (card) => card.querySelector(".history-anime-title").textContent
  );

  // 清除過期紀錄
  let hiddenCards = JSON.parse(localStorage.getItem("hiddenCards") || "[]");
  hiddenCards = hiddenCards.filter((animeTitle) =>
    animeTitlesInPage.includes(animeTitle)
  );
  localStorage.setItem("hiddenCards", JSON.stringify(hiddenCards));

  animeCards.forEach((card) => {
    const animeTitle = card.querySelector(".history-anime-title").textContent;
    addCloseButton(card);
    if (hiddenCards.includes(animeTitle)) {
      card.parentElement.style.display = "none";
    }
  });

  //回復紀錄
  const titleBlock = document.querySelector(".theme-title-block");
  const restoreButtonsContainer = document.createElement("div");

  const restoreAllButton = document.createElement("button");
  restoreAllButton.textContent = "回復全部觀看紀錄";
  restoreAllButton.style.backgroundColor = "transparent";
  restoreAllButton.style.color = "white";
  restoreAllButton.addEventListener("click", () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(prefix)) {
        localStorage.removeItem(key);
      }
    });
    localStorage.removeItem("hiddenCards");
    location.reload();
  });
  //暫停使用這個按鈕
  //restoreButtonsContainer.appendChild(restoreAllButton); 

  const restoreLastButton = document.createElement("button");
  restoreLastButton.textContent = "還原1筆紀錄";
  restoreLastButton.style.backgroundColor = "transparent";
  restoreLastButton.style.color = "white";
  restoreLastButton.style.border = "1px solid white";
  restoreLastButton.style.borderRadius = "5px";
  restoreLastButton.style.boxShadow = "none";
  restoreLastButton.style.padding = "10px";
  restoreLastButton.addEventListener("click", () => {
    const hiddenCards = JSON.parse(localStorage.getItem("hiddenCards") || "[]");
    if (hiddenCards.length > 0) {
      localStorage.removeItem(prefix + hiddenCards.pop());
      localStorage.setItem("hiddenCards", JSON.stringify(hiddenCards));
      location.reload();
    }
  });
  restoreButtonsContainer.appendChild(restoreLastButton);

  titleBlock.appendChild(restoreButtonsContainer);
})();

// ==UserScript==
// @name         動畫瘋隱藏觀看紀錄
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在每個卡片右上角新增隱藏按鈕，點擊後即可隱藏該卡片，並將該卡片的標題存入 localStorage，當重新整理頁面時，隱藏的卡片將不會再出現。在標題下方新增切換隱藏項目按鈕，點擊後即可切換顯示隱藏的卡片。
// @author       rarachi
// @match        https://ani.gamer.com.tw/viewList.php*
// @updateURL    https://raw.githubusercontent.com/rarachi/ani-gamer-history-hider/main/anime_history_hide_script.user.js
// @downloadURL  https://raw.githubusercontent.com/rarachi/ani-gamer-history-hider/main/anime_history_hide_script.user.js
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  let showHidden = JSON.parse(localStorage.getItem("aniShowHidden") || "false");

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
      let hiddenCards = JSON.parse(localStorage.getItem("hiddenCards") || "[]");

      if (hiddenCards.includes(animeTitle)) {
        // 如果動畫已經在隱藏列表中，則從列表中移除
        const index = hiddenCards.indexOf(animeTitle);
        hiddenCards.splice(index, 1);
      } else {
        // 否則，將動畫添加到隱藏列表中
        hiddenCards.push(animeTitle);
      }
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
      card.parentElement.style.display = showHidden ? "block" : "none";
    } else {
      card.parentElement.style.display = showHidden ? "none" : "block";
    }
  });

  // 切換隱藏項目
  const titleBlock = document.querySelector(".theme-title-block");
  const toggleHiddenButton = document.createElement("button");
  toggleHiddenButton.style.backgroundColor = "transparent";
  toggleHiddenButton.style.color = "white";
  toggleHiddenButton.style.border = "1px solid white";
  toggleHiddenButton.style.borderRadius = "5px";
  toggleHiddenButton.style.boxShadow = "none";
  toggleHiddenButton.style.padding = "10px";
  toggleHiddenButton.addEventListener("click", () => {
    const currentShowHidden = JSON.parse(
      localStorage.getItem("aniShowHidden") || "false"
    );
    localStorage.setItem("aniShowHidden", JSON.stringify(!currentShowHidden));
    location.reload();
  });
  titleBlock.appendChild(toggleHiddenButton);

  // 在頁面加載時設置按鈕的初始文字
  const initialShowHidden = JSON.parse(
    localStorage.getItem("aniShowHidden") || "false"
  );
  toggleHiddenButton.textContent = initialShowHidden ? "返回" : "切換隱藏項目";
})();

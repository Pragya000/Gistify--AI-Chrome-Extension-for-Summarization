function getArticleText() {
  const article = document.querySelector("article");
  if (article) return article.innerText;

  // fallback
  const paragraphs = Array.from(document.querySelectorAll("p"));
  return paragraphs.map((p) => p.innerText).join("\n");
}

// Q&A Feature: Extract main page text
function extractPageContext() {
  // Try to get main article/content text
  let text = '';
  const article = document.querySelector('article');
  if (article) {
    text = article.innerText;
  } else {
    // Fallback: get largest <div> by text length
    let maxDiv = null;
    let maxLen = 0;
    document.querySelectorAll('div').forEach(div => {
      const len = div.innerText.length;
      if (len > maxLen) {
        maxLen = len;
        maxDiv = div;
      }
    });
    text = maxDiv ? maxDiv.innerText : document.body.innerText;
  }
  return text.trim();
}

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.type === "GET_ARTICLE_TEXT") {
    const text = getArticleText();
    sendResponse({ text });
  }
  if (req.action === 'getPageContext') {
    const context = extractPageContext();
    sendResponse({context});
  }
});
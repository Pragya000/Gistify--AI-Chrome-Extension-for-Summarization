// Text-to-Speech Feature with Voice/Language Options
// Text-to-Speech Feature
window.addEventListener('DOMContentLoaded', function() {
  const ttsBtn = document.getElementById('tts-btn');
  const resultDiv = document.getElementById('result');

  if (ttsBtn) {
    ttsBtn.onclick = function() {
      const summaryText = resultDiv.innerText.trim();
      if (!summaryText) {
        ttsBtn.innerText = 'No summary to read';
        setTimeout(() => { ttsBtn.innerText = 'Read Aloud'; }, 1500);
        return;
      }
      window.speechSynthesis.cancel();
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(summaryText);
        utterance.rate = 1;
        window.speechSynthesis.speak(utterance);
      }, 350);
    };
  }
});
document.getElementById("summarize").addEventListener("click", async () => {
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = '<div class="loading"><div class="loader"></div></div>';

  const summaryType = document.getElementById("summary-type").value;

  // Get API key from storage
  chrome.storage.sync.get(["geminiApiKey"], async (result) => {
    if (!result.geminiApiKey) {
      resultDiv.innerHTML =
        "API key not found. Please set your API key in the extension options.";
      return;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      chrome.tabs.sendMessage(
        tab.id,
        { type: "GET_ARTICLE_TEXT" },
        async (res) => {
          if (!res || !res.text) {
            resultDiv.innerText =
              "Could not extract article text from this page.";
            return;
          }

          try {
            const summary = await getGeminiSummary(
              res.text,
              summaryType,
              result.geminiApiKey
            );
            resultDiv.innerText = summary;
          } catch (error) {
            resultDiv.innerText = `Error: ${
              error.message || "Failed to generate summary."
            }`;
          }
        }
      );
    });
  });
});

document.getElementById("copy-btn").addEventListener("click", () => {
  const summaryText = document.getElementById("result").innerText;

  if (summaryText && summaryText.trim() !== "") {
    navigator.clipboard
      .writeText(summaryText)
      .then(() => {
        const copyBtn = document.getElementById("copy-btn");
        const originalText = copyBtn.innerText;

        copyBtn.innerText = "Copied!";
        setTimeout(() => {
          copyBtn.innerText = originalText;
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  }
});
// Q&A Feature
document.addEventListener('DOMContentLoaded', function() {
  const askBtn = document.getElementById('ask-btn');
  const questionInput = document.getElementById('question-input');
  const answerDiv = document.getElementById('answer');

  // Text-to-Speech Feature
  const ttsBtn = document.getElementById('tts-btn');
  const resultDiv = document.getElementById('result');

  if (ttsBtn) {
    ttsBtn.addEventListener('click', function() {
      const summaryText = resultDiv.innerText.trim();
      if (!summaryText) {
        ttsBtn.innerText = 'No summary to read';
        setTimeout(() => { ttsBtn.innerText = 'Read Aloud'; }, 1500);
        return;
      }
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(summaryText);
      utterance.lang = 'en-US';
      utterance.rate = 1;
      window.speechSynthesis.speak(utterance);
    });
  }

  // ELI5 Feature
  const eli5Btn = document.getElementById('eli5-btn');
  const eli5Input = document.getElementById('eli5-input');
  const eli5Output = document.getElementById('eli5-output');

  if (eli5Btn) {
    eli5Btn.addEventListener('click', async function() {
      const text = eli5Input.value.trim();
      if (!text) {
        eli5Output.textContent = 'Please enter or paste some text.';
        return;
      }
      eli5Output.textContent = 'Explaining simply...';

      // Get API key from storage
      chrome.storage.sync.get(["geminiApiKey"], async (result) => {
        if (!result.geminiApiKey) {
          eli5Output.textContent = "API key not found. Please set your API key in the extension options.";
          return;
        }

        // Build ELI5 prompt
        const prompt = `Explain the following text in the simplest way possible, as if to a 5-year-old. Avoid jargon and use simple language.\n\n${text}`;

        try {
          const apiKey = result.geminiApiKey;
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [{ text: prompt }],
                  },
                ],
                generationConfig: {
                  temperature: 0.2,
                },
              }),
            }
          );

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error?.message || "API request failed");
          }

          const data = await res.json();
          const simpleExplanation =
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No explanation available.";
          eli5Output.textContent = simpleExplanation;
        } catch (error) {
          eli5Output.textContent = `Error: ${error.message || "Failed to get explanation."}`;
        }
      });
    });
  }

  if (askBtn) {
    askBtn.addEventListener('click', async function() {
      const question = questionInput.value.trim();
      if (!question) {
        answerDiv.textContent = 'Please enter a question.';
        return;
      }
      answerDiv.textContent = 'Thinking...';

      // Get API key from storage
      chrome.storage.sync.get(["geminiApiKey"], async (result) => {
        if (!result.geminiApiKey) {
          answerDiv.textContent = "API key not found. Please set your API key in the extension options.";
          return;
        }

        // Get page context from content.js
        chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
          chrome.tabs.sendMessage(
            tab.id,
            { action: "getPageContext" },
            async (res) => {
              const pageContext = res && res.context ? res.context : '';
              if (!pageContext) {
                answerDiv.textContent = 'Could not extract page context.';
                return;
              }

              // Build prompt for Gemini
              const prompt = `Using the following page context, answer this question as helpfully as possible.\n\nPage context:\n${pageContext}\n\nQuestion: ${question}`;

              try {
                const apiKey = result.geminiApiKey;
                const res = await fetch(
                  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      contents: [
                        {
                          parts: [{ text: prompt }],
                        },
                      ],
                      generationConfig: {
                        temperature: 0.2,
                      },
                    }),
                  }
                );

                if (!res.ok) {
                  const errorData = await res.json();
                  throw new Error(errorData.error?.message || "API request failed");
                }

                const data = await res.json();
                const aiAnswer =
                  data?.candidates?.[0]?.content?.parts?.[0]?.text ||
                  "No answer available.";
                answerDiv.textContent = aiAnswer;
              } catch (error) {
                answerDiv.textContent = `Error: ${error.message || "Failed to get answer."}`;
              }
            }
          );
        });
      });
    });
  }
});

async function getGeminiSummary(text, summaryType, apiKey) {
  // Truncate very long texts to avoid API limits (typically around 30K tokens)
  const maxLength = 20000;
  const truncatedText =
    text.length > maxLength ? text.substring(0, maxLength) + "..." : text;

  let prompt;
  switch (summaryType) {
    case "brief":
      prompt = `Provide a brief summary of the following article in 2-3 sentences:\n\n${truncatedText}`;
      break;
    case "detailed":
      prompt = `Provide a detailed summary of the following article, covering all main points and key details:\n\n${truncatedText}`;
      break;
    case "bullets":
      prompt = `Summarize the following article in 5-7 key points. Format each point as a line starting with "- " (dash followed by a space). Do not use asterisks or other bullet symbols, only use the dash. Keep each point concise and focused on a single key insight from the article:\n\n${truncatedText}`;
      break;
    default:
      prompt = `Summarize the following article:\n\n${truncatedText}`;
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.2,
          },
        }),
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error?.message || "API request failed");
    }

    const data = await res.json();
    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No summary available."
    );
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate summary. Please try again later.");
  }
}
# Gistify – AI Summary for Articles

Gistify is a Chrome extension that uses **Google Gemini AI** to generate concise, high-quality summaries of any webpage. With a single click, you can transform long articles, blogs, or reports into quick and digestible summaries. Beyond summarization, Gistify also provides Q\&A and simplified explanations for complex text.

---

## 🚀 Features

*  Summarize any webpage instantly
*  Choose summary type (Brief, Detailed, etc.)
*  One-click **Copy** to clipboard
*  **Read Aloud** summaries using Text-to-Speech
*  **Ask a Question** – get AI-powered answers from the article
*  **Explain Like I’m 5 (ELI5)** – simplify complex or technical content
*  Secure API key storage in extension settings
*  Clean and responsive popup UI
*  Works across **all websites**

---

## 📦 Installation

1. Clone or download this repository:

   ```bash
   git clone https://github.com/yourusername/Gistify.git
   ```

   Or download the `.zip` and extract it.

2. Open **Google Chrome** and go to:

   ```
   chrome://extensions/
   ```

3. Enable **Developer mode** (toggle in the top-right).

4. Click **Load unpacked** and select the extracted `Gistify-main` folder.

5. The extension will now appear in your toolbar.

---

## 🔑 API Key Setup

1. Click the **Extension icon → Options**.
2. Enter your **Gemini API key** (get it from [Google AI Studio](https://aistudio.google.com/)).
3. Save your settings.
4. You’re ready to summarize any article!

---

## 🛠️ Project Structure

```
Gistify-main/
│── background.js      # Background service worker
│── content.js         # Extracts page content
│── manifest.json      # Extension configuration (Manifest v3)
│── popup.html         # Popup UI (Summary, Q&A, ELI5)
│── popup.js           # Handles summarization, Q&A, ELI5, and TTS
│── options.html       # API key settings page
│── options.js         # Logic for saving/loading API key
│── icon.png           # Extension icon
│── .gitattributes
```

---

## 📖 Usage

### 🔹 Summarize

1. Open any webpage (article, blog, or report).
2. Click the **Gistify icon** in the Chrome toolbar.
3. Select a summary type (Brief or Detailed) and click **Summarize**.
4. Copy or Read Aloud the generated summary.

### 🔹 Ask a Question

* Type a question in the **Ask a Question** section.
* Click **Ask** → Gistify will answer using the page context.

### 🔹 Explain Like I’m 5 (ELI5)

* Paste technical or complex text into the input box.
* Click **Explain** → Get a simplified explanation.

---

## ⚙️ Permissions

This extension requires:

* `activeTab` → access the current page
* `scripting` → inject scripts into pages
* `storage` → save API key & preferences
* `<all_urls>` → allow summarization across sites

---

## 🌟 Future Enhancements

* Save and export summaries (Markdown/PDF)
* Summarize selected text only
* Multi-language support
* History of past summaries
* Integration with Notion / Google Docs

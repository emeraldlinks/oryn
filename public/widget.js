(function () {
  var script = document.currentScript;
  if (!script) return;

  var config = {
    workspaceId: script.getAttribute("data-workspace-id"),
    primaryColor: script.getAttribute("data-primary-color") || "#6366f1",
    welcomeMessage: script.getAttribute("data-welcome-message") || "",
  };
  if (!config.workspaceId) return;

  var baseUrl = window.location.origin;

  function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  var visitorId = localStorage.getItem("chat_visitor_id");
  if (!visitorId) {
    visitorId = uuidv4();
    localStorage.setItem("chat_visitor_id", visitorId);
  }

  var state = {
    messages: [],
    isOpen: false,
    pollTimer: null,
    sentWelcome: false,
  };

  function hs(prop, val) {
    var s = document.createElement("style");
    s.textContent = "#oryn-chat-widget " + prop + "{" + val + "}";
    document.head.appendChild(s);
  }

  hs("--chat-primary", config.primaryColor);

  var html =
    '<div id="oryn-chat-widget">' +
    '<style>' +
    "*{box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}" +
    ".oryn-chat-bubble{position:fixed;bottom:20px;right:20px;width:60px;height:60px;border-radius:50%;background:var(--chat-primary);color:#fff;border:none;cursor:pointer;box-shadow:0 4px 20px rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:center;z-index:999998;transition:transform 0.2s,box-shadow 0.2s}" +
    ".oryn-chat-bubble:hover{transform:scale(1.08);box-shadow:0 6px 28px rgba(0,0,0,0.25)}" +
    ".oryn-chat-bubble svg{width:28px;height:28px}" +
    ".oryn-chat-overlay{position:fixed;bottom:90px;right:20px;width:380px;max-width:calc(100vw - 40px);height:560px;max-height:calc(100vh - 120px);background:#fff;border-radius:16px;box-shadow:0 8px 40px rgba(0,0,0,0.18);display:none;flex-direction:column;z-index:999999;overflow:hidden;animation:orynSlideUp 0.25s ease-out}" +
    ".oryn-chat-overlay.open{display:flex}" +
    "@keyframes orynSlideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}" +
    ".oryn-chat-header{display:flex;align-items:center;justify-content:space-between;padding:16px 18px;background:var(--chat-primary);color:#fff;border-radius:16px 16px 0 0}" +
    ".oryn-chat-header h3{margin:0;font-size:16px;font-weight:600}" +
    ".oryn-chat-close{background:none;border:none;color:#fff;cursor:pointer;padding:4px;border-radius:6px;display:flex;align-items:center;justify-content:center;transition:background 0.15s}" +
    ".oryn-chat-close:hover{background:rgba(255,255,255,0.2)}" +
    ".oryn-chat-close svg{width:20px;height:20px}" +
    ".oryn-chat-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:8px;background:#f8f9fb}" +
    ".oryn-chat-msg{max-width:82%;padding:10px 14px;border-radius:16px;font-size:14px;line-height:1.45;word-wrap:break-word;animation:orynFadeIn 0.2s ease-out}" +
    "@keyframes orynFadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}" +
    ".oryn-chat-msg.visitor{background:var(--chat-primary);color:#fff;align-self:flex-end;border-bottom-right-radius:4px}" +
    ".oryn-chat-msg.agent{background:#e9ecef;color:#1a1a2e;align-self:flex-start;border-bottom-left-radius:4px}" +
    ".oryn-chat-msg .time{font-size:10px;opacity:0.65;margin-top:4px;display:block}" +
    ".oryn-chat-input-wrap{display:flex;align-items:center;gap:8px;padding:12px 16px;border-top:1px solid #e9ecef;background:#fff}" +
    ".oryn-chat-input-wrap input{flex:1;border:1px solid #e0e0e0;border-radius:24px;padding:10px 16px;font-size:14px;outline:none;transition:border-color 0.15s}" +
    ".oryn-chat-input-wrap input:focus{border-color:var(--chat-primary)}" +
    ".oryn-chat-send{width:40px;height:40px;border-radius:50%;background:var(--chat-primary);color:#fff;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background 0.15s,transform 0.15s}" +
    ".oryn-chat-send:hover{background:var(--chat-primary);filter:brightness(1.1);transform:scale(1.05)}" +
    ".oryn-chat-send svg{width:18px;height:18px}" +
    ".oryn-chat-send:disabled{opacity:0.5;cursor:default}" +
    "@media(max-width:480px){.oryn-chat-overlay{bottom:0;right:0;width:100%;max-width:100%;height:100%;max-height:100%;border-radius:0}}" +
    ".oryn-chat-typing{padding:10px 14px;background:#e9ecef;border-radius:16px;border-bottom-left-radius:4px;align-self:flex-start;display:flex;gap:4px}" +
    ".oryn-chat-typing span{width:7px;height:7px;border-radius:50%;background:#999;animation:orynTyping 1.2s infinite}" +
    ".oryn-chat-typing span:nth-child(2){animation-delay:0.2s}" +
    ".oryn-chat-typing span:nth-child(3){animation-delay:0.4s}" +
    "@keyframes orynTyping{0%,60%,100%{opacity:0.3;transform:translateY(0)}30%{opacity:1;transform:translateY(-4px)}}" +
    "</style>" +
    '<button class="oryn-chat-bubble" id="oryn-chat-bubble-btn" aria-label="Open chat">' +
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' +
    "</button>" +
    '<div class="oryn-chat-overlay" id="oryn-chat-overlay">' +
    '<div class="oryn-chat-header">' +
    '<h3>Chat with us</h3>' +
    '<button class="oryn-chat-close" id="oryn-chat-close-btn" aria-label="Close chat">' +
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
    "</button>" +
    "</div>" +
    '<div class="oryn-chat-messages" id="oryn-chat-messages"></div>' +
    '<div class="oryn-chat-input-wrap">' +
    '<input type="text" id="oryn-chat-input" placeholder="Type a message..." autocomplete="off" />' +
    '<button class="oryn-chat-send" id="oryn-chat-send-btn" aria-label="Send message">' +
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>' +
    "</button>" +
    "</div>" +
    "</div>" +
    "</div>";

  document.body.insertAdjacentHTML("beforeend", html);

  var bubble = document.getElementById("oryn-chat-bubble-btn");
  var overlay = document.getElementById("oryn-chat-overlay");
  var closeBtn = document.getElementById("oryn-chat-close-btn");
  var messagesEl = document.getElementById("oryn-chat-messages");
  var inputEl = document.getElementById("oryn-chat-input");
  var sendBtn = document.getElementById("oryn-chat-send-btn");

  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function appendMessage(msg, sender) {
    var div = document.createElement("div");
    div.className = "oryn-chat-msg " + sender;
    div.textContent = msg;
    var time = document.createElement("span");
    time.className = "time";
    time.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    div.appendChild(time);
    messagesEl.appendChild(div);
    scrollToBottom();
  }

  function showTyping() {
    var el = document.createElement("div");
    el.className = "oryn-chat-typing";
    el.id = "oryn-typing-indicator";
    el.innerHTML = "<span></span><span></span><span></span>";
    messagesEl.appendChild(el);
    scrollToBottom();
  }

  function hideTyping() {
    var el = document.getElementById("oryn-typing-indicator");
    if (el) el.remove();
  }

  function addMessages(msgs) {
    msgs.forEach(function (m) {
      var key = m.id || m.body + (m.createdAt || "");
      if (document.querySelector('[data-msg-id="' + key + '"]')) return;
      var div = document.createElement("div");
      div.className = "oryn-chat-msg " + (m.sender === "agent" ? "agent" : "visitor");
      div.setAttribute("data-msg-id", key);
      div.textContent = m.body;
      var time = document.createElement("span");
      time.className = "time";
      time.textContent = m.createdAt
        ? new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      div.appendChild(time);
      messagesEl.appendChild(div);
    });
    scrollToBottom();
  }

  function pollMessages() {
    fetch(baseUrl + "/api/chat/widget?workspaceId=" + config.workspaceId + "&visitorId=" + visitorId)
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (msgs) {
        if (Array.isArray(msgs) && msgs.length) {
          addMessages(msgs);
          state.messages = msgs;
        }
      })
      .catch(function () {});
  }

  function sendMessage(body) {
    if (!body.trim()) return;
    inputEl.disabled = true;
    sendBtn.disabled = true;

    appendMessage(body, "visitor");

    fetch(baseUrl + "/api/chat/widget", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workspaceId: config.workspaceId,
        visitorId: visitorId,
        visitorName: "Visitor",
        body: body,
        sender: "visitor",
      }),
    })
      .then(function () {
        inputEl.value = "";
        showTyping();
        setTimeout(function () {
          hideTyping();
          pollMessages();
        }, 1000);
      })
      .catch(function () {})
      .finally(function () {
        inputEl.disabled = false;
        sendBtn.disabled = false;
        inputEl.focus();
      });
  }

  function openChat() {
    state.isOpen = true;
    overlay.classList.add("open");
    bubble.style.display = "none";
    inputEl.focus();
    pollMessages();
    state.pollTimer = setInterval(pollMessages, 3000);

    if (!state.sentWelcome && config.welcomeMessage) {
      state.sentWelcome = true;
      setTimeout(function () {
        appendMessage(config.welcomeMessage, "agent");
      }, 500);
    }
  }

  function closeChat() {
    state.isOpen = false;
    overlay.classList.remove("open");
    bubble.style.display = "flex";
    if (state.pollTimer) {
      clearInterval(state.pollTimer);
      state.pollTimer = null;
    }
  }

  bubble.addEventListener("click", openChat);
  closeBtn.addEventListener("click", closeChat);

  sendBtn.addEventListener("click", function () {
    sendMessage(inputEl.value);
  });

  inputEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputEl.value);
    }
  });
})();

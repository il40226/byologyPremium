// SPA behavior: intro -> reveal left panel -> pages navigation
// Chat toggle: open/close via left-panel toggle and X close button
// Demo chat: no API keys in client-side code. Use server proxy if you enable real API.

document.addEventListener('DOMContentLoaded', () => {
  const line1 = document.getElementById('line1');
  const line2 = document.getElementById('line2');
  const leftPanel = document.getElementById('left-panel');
  const pagesContainer = document.getElementById('pages');
  const pages = Array.from(document.querySelectorAll('.page'));
  const panelItems = Array.from(document.querySelectorAll('.panel-item'));
  const chatWidget = document.getElementById('chat-widget');
  const toggleAiBtn = document.getElementById('toggle-ai');
  const toggleAiLabel = document.getElementById('toggle-ai-label');
  const chatClose = document.getElementById('chat-close');
  const openAiBtn = document.getElementById('open-ai-btn');

  // initial states
  leftPanel.classList.add('hidden');
  pagesContainer.classList.add('hidden-panel');
  chatWidget.classList.add('hidden');

  // Intro sequence (same pattern as before)
  const startDelay = 400;
  const line1Visible = 1400;
  const lineFadeMs = 700;

  setTimeout(() => {
    setTimeout(() => {
      line1.classList.add('fade-out');
      setTimeout(() => {
        line1.classList.add('hidden');
        line1.classList.remove('fade-out');
        line2.classList.remove('hidden');
        line2.classList.add('fade-in');

        setTimeout(() => {
          line2.classList.add('fade-out');
          setTimeout(() => {
            const center = document.getElementById('center');
            center.classList.add('fade-out');
            setTimeout(() => {
              // hide intro and show pages + left panel
              center.style.display = 'none';
              pagesContainer.classList.remove('hidden-panel');
              showLeftPanel();
              // default to Apps page
              showPage('apps');
            }, 350);
          }, lineFadeMs);
        }, 900);

      }, lineFadeMs);
    }, line1Visible);
  }, startDelay);

  function showLeftPanel(){
    leftPanel.classList.remove('hidden');
    leftPanel.classList.add('visible');

    panelItems.forEach((item, idx) => {
      setTimeout(() => item.classList.add('show'), idx * 120 + 80);
    });
  }

  // Navigation
  panelItems.forEach(item => {
    item.addEventListener('click', () => {
      const type = item.dataset.type;
      // set active highlight
      panelItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      // show correct page
      showPage(type);
    });
  });

  function showPage(name){
    pages.forEach(p => {
      if (p.dataset.page === name) {
        p.classList.add('page-active');
        p.setAttribute('aria-hidden','false');
      } else {
        p.classList.remove('page-active');
        p.setAttribute('aria-hidden','true');
      }
    });
  }

  // Chat toggle logic
  function openChat(){
    chatWidget.classList.remove('hidden');
    toggleAiBtn.setAttribute('aria-pressed','true');
    toggleAiLabel.textContent = 'Close AI';
  }

  function closeChat(){
    chatWidget.classList.add('hidden');
    toggleAiBtn.setAttribute('aria-pressed','false');
    toggleAiLabel.textContent = 'Open AI';
  }

  toggleAiBtn.addEventListener('click', () => {
    if (chatWidget.classList.contains('hidden')) openChat();
    else closeChat();
  });

  // Close button in widget
  chatClose.addEventListener('click', closeChat);

  // "Open AI" button inside AI page
  if (openAiBtn) openAiBtn.addEventListener('click', openChat);

  // Demo chat form behavior (keeps everything client-side)
  const form = document.getElementById('chat-form');
  const body = document.getElementById('chat-body');
  const input = document.getElementById('prompt');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      appendUser(text);
      input.value = '';
      appendBot('Thinking...');
      await delay(700);
      if (/api|key|openai|secret/i.test(text)) {
        replaceLastBot('Do not put API keys in client code. Use a server proxy with environment variables for keys.');
      } else {
        replaceLastBot(`Demo reply: I heard "${text}".`);
      }
    });
  }

  function appendUser(t){
    const el = document.createElement('div');
    el.className = 'user-msg';
    el.textContent = t;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
  }

  function appendBot(t){
    const el = document.createElement('div');
    el.className = 'bot-msg';
    el.textContent = t;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
  }

  function replaceLastBot(t){
    const msgs = body.querySelectorAll('.bot-msg');
    if (msgs.length) msgs[msgs.length-1].textContent = t;
    body.scrollTop = body.scrollHeight;
  }

  function delay(ms){ return new Promise(r=>setTimeout(r,ms)); }
});

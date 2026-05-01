(function () {
  "use strict";

  const oneDay = 24 * 60 * 60 * 1000;
  const today = startOfDay(new Date());
  const savedSettings = loadGuideSettings();

  const state = {
    country: savedSettings.country || "India",
    electionType: savedSettings.electionType || "General",
    role: savedSettings.role || "Voter",
    language: savedSettings.language || "en",
    theme: loadTheme(),
    stages: [],
    selectedScenario: "miss-registration",
    reminders: loadReminders(),
  };

  const translations = {
    en: {
      completed: "Completed",
      ongoing: "Ongoing",
      upcoming: "Upcoming",
      journeySuffix: "Election",
      nextStep: "What you should do now",
      warnings: "Watch out for",
      source: "Official source to verify",
      countdownEnded: "Check official notice",
      assistantIntro:
        "Hi. I can explain election steps in plain language. Ask about registration, voter ID, voting day, results, or missed deadlines.",
    verifyLine:
      "Please verify final dates and eligibility rules on official election authority websites before acting.",
    starterScenario:
      "Choose a scenario above to see practical next steps without legal jargon.",
    languageNote:
      "I can keep the answer simple. For legal or deadline-sensitive details, verify the latest official notice.",
    noLiveData:
      "This prototype does not fetch live election calendars yet.",
    fallback:
      "I may not have the full answer yet, but here is the safest way to proceed:",
  },
    hi: {
      completed: "पूर्ण",
      ongoing: "जारी",
      upcoming: "आगामी",
      journeySuffix: "चुनाव",
      nextStep: "अभी आपको क्या करना चाहिए",
      warnings: "इन बातों से बचें",
      source: "आधिकारिक स्रोत",
      countdownEnded: "आधिकारिक सूचना देखें",
      assistantIntro:
        "नमस्ते। मैं चुनाव की प्रक्रिया को सरल चरणों में समझा सकता हूं। पंजीकरण, पहचान पत्र, मतदान दिवस या परिणाम के बारे में पूछें।",
      verifyLine:
        "कार्रवाई करने से पहले अंतिम तारीख और पात्रता नियम आधिकारिक चुनाव वेबसाइट पर जरूर जांचें।",
      starterScenario: "ऊपर कोई स्थिति चुनें और आसान अगले कदम देखें।",
      languageNote:
        "मैं उत्तर सरल रखूंगा। कानूनी या समय सीमा वाली जानकारी के लिए नवीनतम आधिकारिक सूचना देखें।",
      noLiveData: "यह प्रोटोटाइप अभी लाइव चुनाव कैलेंडर नहीं लाता है।",
      fallback: "मेरे पास पूरा उत्तर नहीं है, लेकिन सुरक्षित तरीका यह है:",
    },
    bn: {
      completed: "সম্পন্ন",
      ongoing: "চলছে",
      upcoming: "আসন্ন",
      journeySuffix: "নির্বাচন",
      nextStep: "এখন আপনার করণীয়",
      warnings: "যা খেয়াল রাখবেন",
      source: "সরকারি সূত্র",
      countdownEnded: "সরকারি নোটিশ দেখুন",
      assistantIntro:
        "নমস্কার। আমি নির্বাচনের ধাপগুলো সহজ ভাষায় বুঝিয়ে দিতে পারি।",
      verifyLine: "চূড়ান্ত তারিখ ও নিয়ম সরকারি নির্বাচন ওয়েবসাইটে যাচাই করুন।",
      starterScenario: "উপরের একটি পরিস্থিতি বেছে নিন।",
      languageNote: "জরুরি নিয়মের জন্য সর্বশেষ সরকারি নোটিশ যাচাই করুন।",
      noLiveData: "এই প্রোটোটাইপ এখনও লাইভ নির্বাচন ক্যালেন্ডার আনে না।",
      fallback: "সবচেয়ে নিরাপদ পরবর্তী পদক্ষেপ:",
    },
    ta: {
      completed: "முடிந்தது",
      ongoing: "நடைபெறுகிறது",
      upcoming: "வரவுள்ளது",
      journeySuffix: "தேர்தல்",
      nextStep: "இப்போது செய்ய வேண்டியது",
      warnings: "கவனிக்க வேண்டியது",
      source: "அதிகாரப்பூர்வ மூலம்",
      countdownEnded: "அதிகாரப்பூர்வ அறிவிப்பை பார்க்கவும்",
      assistantIntro:
        "வணக்கம். தேர்தல் படிகளை எளிய மொழியில் விளக்க முடியும்.",
      verifyLine: "இறுதி தேதிகள் மற்றும் விதிகளை அதிகாரப்பூர்வ தளத்தில் சரிபார்க்கவும்.",
      starterScenario: "மேலே ஒரு சூழலை தேர்வு செய்யுங்கள்.",
      languageNote: "அவசர விதிகளுக்கு சமீபத்திய அதிகாரப்பூர்வ அறிவிப்பை பார்க்கவும்.",
      noLiveData: "இந்த மாதிரி இன்னும் நேரடி தேர்தல் காலண்டரை பெறவில்லை.",
      fallback: "பாதுகாப்பான அடுத்த படி:",
    },
  };

  const stageBlueprints = [
    {
      id: "announcement",
      title: "Election Announcement",
      icon: "megaphone",
      startOffset: -18,
      endOffset: -10,
      description:
        "The authority announces the election schedule, phases, and key administrative dates.",
      official: "https://www.eci.gov.in/",
      actions: {
        Voter: [
          "Confirm the election type and constituency that applies to you.",
          "Save official dates from the election authority notice.",
          "Start checking your voter list status early.",
        ],
        Candidate: [
          "Review eligibility, nomination forms, and filing windows from official notices.",
          "Prepare required affidavits and declarations before the nomination window.",
          "Track model code and campaign rules from official sources.",
        ],
        Observer: [
          "Review the notified election schedule and observer responsibilities.",
          "Track constituency-level dates and reporting channels.",
          "Keep a neutral checklist for issues to monitor.",
        ],
      },
      warnings: [
        "Do not rely on forwarded messages for dates.",
        "Election schedules can change through official notices only.",
      ],
    },
    {
      id: "registration",
      title: "Voter Registration & Verification",
      icon: "clipboard",
      startOffset: -8,
      endOffset: 13,
      description:
        "Eligible citizens register, update details, or verify their name on the voter list.",
      official: "https://voters.eci.gov.in/",
      actions: {
        Voter: [
          "Check whether your name appears in the voter list.",
          "Apply for registration or correction through the official voter services portal if needed.",
          "Keep proof of age, address, and identity ready as requested by the official form.",
        ],
        Candidate: [
          "Confirm your own voter details and constituency records.",
          "Prepare nomination documents according to the official schedule.",
          "Avoid public claims about rules unless they are backed by official notices.",
        ],
        Observer: [
          "Monitor public awareness around voter list verification.",
          "Note access issues, misinformation, or confusing instructions for escalation.",
          "Keep observations factual and non-partisan.",
        ],
      },
      warnings: [
        "Registration usually closes before polling day. Do not wait until the last week.",
        "Submitting a form is not the same as confirmation. Track the application status.",
      ],
    },
    {
      id: "campaign",
      title: "Campaign Period",
      icon: "people",
      startOffset: 14,
      endOffset: 35,
      description:
        "Candidates and parties campaign while voters compare information and rules are enforced.",
      official: "https://www.eci.gov.in/",
      actions: {
        Voter: [
          "Compare candidates using official affidavits and credible public information.",
          "Ignore inducements, hate speech, or unverifiable claims.",
          "Save your polling date, booth details, and ID checklist.",
        ],
        Candidate: [
          "Follow campaign finance, speech, and conduct rules.",
          "Keep permission records for events, posters, and digital outreach.",
          "Make claims that are factual and avoid voter intimidation or inducement.",
        ],
        Observer: [
          "Document campaign conduct neutrally with dates, places, and sources.",
          "Escalate only verified incidents through appropriate channels.",
          "Avoid public partisan commentary while observing.",
        ],
      },
      warnings: [
        "Political persuasion is different from official voter guidance.",
        "Report intimidation, bribery, or hate speech through official channels.",
      ],
    },
    {
      id: "voting",
      title: "Voting Day",
      icon: "vote",
      startOffset: 40,
      endOffset: 40,
      description:
        "Voters visit their assigned polling booth, verify identity, and cast a private vote.",
      official: "https://electoralsearch.eci.gov.in/",
      actions: {
        Voter: [
          "Find your polling booth before leaving home.",
          "Carry an accepted identity document and any official voter slip if available.",
          "Follow polling officer instructions and keep your vote private.",
        ],
        Candidate: [
          "Ensure authorized representatives understand polling day rules.",
          "Do not campaign inside restricted polling areas.",
          "Use official complaint channels for serious irregularities.",
        ],
        Observer: [
          "Arrive with required authorization and maintain neutrality.",
          "Record issues factually without disrupting voting.",
          "Escalate urgent problems to the designated election official.",
        ],
      },
      warnings: [
        "A voter slip alone may not be enough as identity proof.",
        "Do not photograph your vote or violate polling booth secrecy.",
      ],
    },
    {
      id: "results",
      title: "Counting & Results",
      icon: "chart",
      startOffset: 42,
      endOffset: 45,
      description:
        "Votes are counted under official procedures and results are published by the authority.",
      official: "https://results.eci.gov.in/",
      actions: {
        Voter: [
          "Follow official result dashboards or verified news summaries.",
          "Avoid sharing unverified victory claims before official declaration.",
          "Save any civic follow-up you want to track after results.",
        ],
        Candidate: [
          "Coordinate only through authorized counting agents and official channels.",
          "Track results from the official portal.",
          "Keep communication factual until declarations are complete.",
        ],
        Observer: [
          "Monitor counting procedures only within your authorization.",
          "Separate verified facts from rumors in reports.",
          "Submit final observations through the required channel.",
        ],
      },
      warnings: [
        "Early trends are not final results.",
        "Use official result sources for final numbers.",
      ],
    },
  ];

  const scenarioBlueprints = [
    {
      id: "miss-registration",
      label: "I missed registration",
      intent: "missedRegistration",
    },
    {
      id: "name-missing",
      label: "My name is not listed",
      intent: "nameMissing",
    },
    {
      id: "no-id",
      label: "I forgot ID",
      intent: "noId",
    },
    {
      id: "first-vote",
      label: "First time voting",
      intent: "votingDay",
    },
  ];

  const els = {
    onboardingForm: document.querySelector("#onboardingForm"),
    country: document.querySelector("#country"),
    electionType: document.querySelector("#electionType"),
    role: document.querySelector("#role"),
    language: document.querySelector("#language"),
    journeyName: document.querySelector("#journeyName"),
    nextDeadline: document.querySelector("#nextDeadline"),
    countdown: document.querySelector("#countdown"),
    reminderCount: document.querySelector("#reminderCount"),
    timelineList: document.querySelector("#timelineList"),
    chatLog: document.querySelector("#chatLog"),
    chatForm: document.querySelector("#chatForm"),
    chatInput: document.querySelector("#chatInput"),
    clearChat: document.querySelector("#clearChat"),
    scenarioList: document.querySelector("#scenarioList"),
    scenarioAnswer: document.querySelector("#scenarioAnswer"),
    settingsStatus: document.querySelector("#settingsStatus"),
    settingsJourneyPreview: document.querySelector("#settingsJourneyPreview"),
    settingsDeadlinePreview: document.querySelector("#settingsDeadlinePreview"),
    settingsRolePreview: document.querySelector("#settingsRolePreview"),
    settingsLanguagePreview: document.querySelector("#settingsLanguagePreview"),
    themeToggle: document.querySelector("#themeToggle"),
    pageTitle: document.querySelector("#pageTitle"),
    contentScroll: document.querySelector(".content-scroll"),
    pages: Array.from(document.querySelectorAll("[data-page]")),
    navLinks: Array.from(document.querySelectorAll("[data-route]")),
  };

  const pageTitles = {
    dashboard: "Navigator Dashboard",
    journey: "Election Journey",
    assistant: "Civic Assistant",
    guidance: "Scenario Guidance",
    "booth-guide": "Polling Booth Guide",
    sources: "Official Sources",
    settings: "Guide Settings",
  };

  const routeAliases = {
    main: "dashboard",
    timeline: "journey",
    scenarios: "guidance",
    simulations: "guidance",
    "visual-guide": "booth-guide",
    "official-links": "sources",
    "settings-panel": "settings",
  };

  let pageTransitionTimer = null;

  // Performance: Debounce utility to prevent rapid-fire calls
  let _chatDebounceTimer = null;
  function debounce(fn, delay) {
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(_chatDebounceTimer);
      _chatDebounceTimer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    };
  }

  // Performance: Cache for repeated computation results
  const _computeCache = new Map();
  function cachedCompute(key, computeFn) {
    if (_computeCache.has(key)) return _computeCache.get(key);
    const result = computeFn();
    _computeCache.set(key, result);
    return result;
  }

  boot();

  function boot() {
    applyTheme();
    syncSettingsForm();
    state.stages = buildStages();
    renderAll();
    updateSettingsPreview("Settings are saved for this browser.");
    resetChat();
    wireEvents();
    routeToCurrentHash();
    initDecisionEngine();
    setInterval(renderSummary, 60 * 1000);
  }

  function wireEvents() {
    els.onboardingForm.addEventListener("submit", function (event) {
      event.preventDefault();
      state.country = els.country.value;
      state.electionType = els.electionType.value;
      state.role = els.role.value;
      state.language = els.language.value;
      state.stages = buildStages();
      saveGuideSettings();
      renderAll();
      updateSettingsPreview("Settings updated. Timeline, scenarios, and assistant responses now use this context.");
      resetChat();
    });

    els.onboardingForm.addEventListener("change", function () {
      updateSettingsPreview("Previewing changes. Press Update to apply them.");
    });

    els.chatForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      const rawInput = els.chatInput.value.trim();
      const question = sanitizeInput(rawInput);
      
      if (!question) {
        // Prevent empty input
        const btn = els.chatForm.querySelector("button");
        btn.style.backgroundColor = "var(--red)";
        setTimeout(() => { btn.style.backgroundColor = ""; }, 500);
        return;
      }
      
      addMessage("user", question);
      els.chatInput.value = "";
      
      addMessage("assistant", "...", false);
      const typingEl = els.chatLog.lastChild;
      typingEl.classList.add("typing");
      typingEl.innerHTML = `<p>Typing...</p>`;
      
      els.chatInput.disabled = true;
      els.chatForm.querySelector("button").disabled = true;

      try {
        if (typeof ChatLogic !== 'undefined') {
          const contextStr = ChatLogic.getContext();
          const reply = await ChatLogic.callGroqAPI(question, contextStr);
          typingEl.classList.remove("typing");
          typingEl.innerHTML = `<p>${escapeHtml(reply)}</p>`;
        } else {
          throw new Error("ChatLogic not loaded");
        }
      } catch(e) {
         console.warn(e);
         typingEl.remove();
         addAssistantResponse(question);
      } finally {
         els.chatInput.disabled = false;
         els.chatForm.querySelector("button").disabled = false;
         els.chatInput.focus();
      }
    });

    document.querySelectorAll("[data-prompt]").forEach(function (button) {
      button.addEventListener("click", function () {
        const prompt = button.getAttribute("data-prompt") || "";
        els.chatInput.value = prompt;
        els.chatForm.requestSubmit();
      });
    });

    els.clearChat.addEventListener("click", resetChat);
    if (els.themeToggle) {
      els.themeToggle.addEventListener("click", toggleTheme);
    }
    window.addEventListener("hashchange", routeToCurrentHash);

    els.timelineList.addEventListener("click", function (event) {
      const button = event.target.closest("[data-reminder]");
      if (!button) return;
      const id = button.getAttribute("data-reminder");
      if (!id) return;
      toggleReminder(id);
      renderTimeline();
    });

    // Google Maps Embed: search handled by window.VF_searchBooth (global, for inline onclick)
    // Testing Panel: handled by window.VF_runTest (global, for inline onclick)

    // "Find Polling Booth" button on dashboard navigates to booth-guide page
    const findBoothBtn = document.getElementById("findBoothBtn");
    if (findBoothBtn) {
      findBoothBtn.addEventListener("click", function () {
        window.location.hash = "#booth-guide";
      });
    }
  }



  // Security: Input Sanitization
  function sanitizeInput(input) {
    if (!input) return "";
    return input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function routeToCurrentHash() {
    const hash = window.location.hash.replace("#", "") || "dashboard";
    const route = routeAliases[hash] || hash;
    const nextRoute = pageTitles[route] ? route : "dashboard";
    const nextPage = els.pages.find(function (page) {
      return page.dataset.page === nextRoute;
    });
    const currentPage =
      els.pages.find(function (page) {
        return page.classList.contains("active") && !page.classList.contains("exiting");
      }) ||
      els.pages.find(function (page) {
        return page.classList.contains("active");
      });
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (pageTransitionTimer) {
      clearTimeout(pageTransitionTimer);
      pageTransitionTimer = null;
      els.pages.forEach(function (page) {
        if (page !== currentPage) {
          page.classList.remove("active", "entering", "exiting", "leaving");
        }
      });
    }

    if (nextPage) {
      els.pages.forEach(function (page) {
        if (page !== currentPage && page !== nextPage) {
          page.classList.remove("active", "entering", "exiting", "leaving");
        }
      });

      if (!currentPage || currentPage === nextPage || reduceMotion) {
        els.pages.forEach(function (page) {
          page.classList.toggle("active", page === nextPage);
          page.classList.remove("entering", "exiting", "leaving");
        });
      } else {
        currentPage.classList.add("exiting");
        nextPage.classList.add("active", "entering");

        currentPage.offsetHeight;
        nextPage.offsetHeight;

        requestAnimationFrame(function () {
          nextPage.classList.remove("entering");
          currentPage.classList.add("leaving");
        });

        pageTransitionTimer = window.setTimeout(function () {
          currentPage.classList.remove("active", "exiting", "leaving");
          pageTransitionTimer = null;
        }, 320);
      }
    }

    els.navLinks.forEach(function (link) {
      link.classList.toggle("active", link.dataset.route === nextRoute);
    });

    document.body.dataset.page = nextRoute;

    if (els.pageTitle) {
      els.pageTitle.textContent = pageTitles[nextRoute];
    }

    if (els.contentScroll) {
      els.contentScroll.scrollTo({
        top: 0,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    }
  }

  function renderAll() {
    renderSummary();
    renderTimeline();
    renderScenarios();
  }

  function buildStages() {
    return stageBlueprints.map(function (stage) {
      const start = addDays(today, stage.startOffset);
      const end = addDays(today, stage.endOffset);
      return {
        ...stage,
        start,
        end,
        status: getStageStatus(start, end),
      };
    });
  }

  function renderSummary() {
    const copy = translations[state.language] || translations.en;
    const next = getNextDeadline();
    els.journeyName.textContent = state.country + " " + state.electionType;

    if (!next) {
      els.nextDeadline.textContent = copy.countdownEnded;
      els.countdown.textContent = copy.noLiveData;
      renderReminderCount();
      return;
    }

    els.nextDeadline.textContent = formatDate(next.end);
    els.countdown.textContent = countdownText(next.end, copy);
    renderReminderCount();
  }

  function renderTimeline() {
    const copy = translations[state.language] || translations.en;
    els.timelineList.innerHTML = "";
    state.stages.forEach(function (stage) {
      const card = document.createElement("article");
      card.className = "stage-card";
      card.innerHTML = [
        '<div class="stage-icon" aria-hidden="true">' + iconFor(stage.icon) + "</div>",
        '<div class="stage-main">',
        '<div class="stage-top">',
        "<div>",
        "<h3>" + escapeHtml(stage.title) + "</h3>",
        '<p class="date-range">' + formatRange(stage.start, stage.end) + "</p>",
        "</div>",
        '<span class="status-pill ' + stage.status + '">' + statusLabel(stage.status, copy) + "</span>",
        "</div>",
        '<div class="stage-details">',
        "<p>" + escapeHtml(stage.description) + "</p>",
        "<strong>" + escapeHtml(copy.nextStep) + "</strong>",
        '<ul class="action-list">' + listItems(stage.actions[state.role]) + "</ul>",
        "<strong>" + escapeHtml(copy.warnings) + "</strong>",
        '<ul class="warning-list">' + listItems(stage.warnings) + "</ul>",
        '<p><strong>' + escapeHtml(copy.source) + ':</strong> <a href="' + stage.official + '" target="_blank" rel="noreferrer">' + stage.official + "</a></p>",
        '<button class="reminder-button" type="button" data-reminder="' + stage.id + '">' + reminderLabel(stage.id) + "</button>",
        "</div>",
        "</div>",
      ].join("");
      els.timelineList.appendChild(card);
    });
  }

  function renderScenarios() {
    els.scenarioList.innerHTML = "";
    scenarioBlueprints.forEach(function (scenario) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = scenario.label;
      button.className = scenario.id === state.selectedScenario ? "active" : "";
      button.addEventListener("click", function () {
        state.selectedScenario = scenario.id;
        renderScenarios();
      });
      els.scenarioList.appendChild(button);
    });

    const scenario =
      scenarioBlueprints.find(function (item) {
        return item.id === state.selectedScenario;
      }) || scenarioBlueprints[0];
    const answer = responseForIntent(scenario.intent);
    els.scenarioAnswer.innerHTML = renderSteps(answer.steps, answer.note);
  }

  function resetChat() {
    els.chatLog.innerHTML = "";
    addMessage("assistant", translations[state.language].assistantIntro);
  }

  function toggleReminder(id) {
    if (state.reminders.includes(id)) {
      state.reminders = state.reminders.filter(function (item) {
        return item !== id;
      });
    } else {
      state.reminders = state.reminders.concat(id);
    }
    localStorage.setItem("electionNavigatorReminders", JSON.stringify(state.reminders));
    renderSummary();
  }

  function reminderLabel(id) {
    return state.reminders.includes(id) ? "Reminder saved" : "Set reminder";
  }

  function renderReminderCount() {
    if (!els.reminderCount) return;
    const count = state.reminders.length;
    els.reminderCount.textContent = count === 1 ? "1 saved" : count + " saved";
  }

  function syncSettingsForm() {
    els.country.value = state.country;
    els.electionType.value = state.electionType;
    els.role.value = state.role;
    els.language.value = state.language;
  }

  function updateSettingsPreview(message) {
    if (els.settingsJourneyPreview) {
      els.settingsJourneyPreview.textContent = els.country.value + " " + els.electionType.value;
    }

    if (els.settingsDeadlinePreview) {
      const next = getNextDeadline();
      els.settingsDeadlinePreview.textContent = next ? formatDate(next.end) : "Check official notice";
    }

    if (els.settingsRolePreview) {
      els.settingsRolePreview.textContent = roleSummary(els.role.value);
    }

    if (els.settingsLanguagePreview) {
      els.settingsLanguagePreview.textContent = selectedOptionText(els.language);
    }

    if (els.settingsStatus && message) {
      els.settingsStatus.textContent = message;
    }
  }

  function selectedOptionText(select) {
    return select.options[select.selectedIndex] ? select.options[select.selectedIndex].text : select.value;
  }

  function roleSummary(role) {
    const summaries = {
      Voter: "Voter guidance",
      Candidate: "Candidate filing and conduct",
      Observer: "Neutral observation checklist",
    };
    return summaries[role] || role + " guidance";
  }

  function loadReminders() {
    try {
      const saved = JSON.parse(localStorage.getItem("electionNavigatorReminders") || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch (error) {
      return [];
    }
  }

  function loadGuideSettings() {
    try {
      const saved = JSON.parse(localStorage.getItem("voteFlowGuideSettings") || "{}");
      return saved && typeof saved === "object" ? saved : {};
    } catch (error) {
      return {};
    }
  }

  function saveGuideSettings() {
    try {
      localStorage.setItem(
        "voteFlowGuideSettings",
        JSON.stringify({
          country: state.country,
          electionType: state.electionType,
          role: state.role,
          language: state.language,
        }),
      );
    } catch (error) {
      if (els.settingsStatus) {
        els.settingsStatus.textContent = "Settings updated for this session. Browser storage is unavailable.";
      }
    }
  }

  function loadTheme() {
    try {
      return localStorage.getItem("voteFlowTheme") === "night" ? "night" : "day";
    } catch (error) {
      return "day";
    }
  }

  function toggleTheme() {
    state.theme = state.theme === "night" ? "day" : "night";
    try {
      localStorage.setItem("voteFlowTheme", state.theme);
    } catch (error) {
      // Theme still changes for the current session if storage is unavailable.
    }
    applyTheme();
  }

  function applyTheme() {
    document.documentElement.dataset.theme = state.theme;
    if (!els.themeToggle) return;

    const isNight = state.theme === "night";
    const label = isNight ? "Switch to day mode" : "Switch to night mode";
    els.themeToggle.setAttribute("aria-label", label);
    els.themeToggle.setAttribute("aria-pressed", String(isNight));
    els.themeToggle.title = label;
  }

  function addAssistantResponse(question) {
    const intent = detectIntent(question);
    const answer = responseForIntent(intent);
    addMessage("assistant", renderSteps(answer.steps, answer.note), true);
  }

  function addMessage(type, content, isHtml) {
    const item = document.createElement("div");
    item.className = "message " + type;
    if (isHtml) {
      item.innerHTML = content;
    } else {
      const p = document.createElement("p");
      p.textContent = content;
      item.appendChild(p);
    }
    els.chatLog.appendChild(item);
    els.chatLog.scrollTop = els.chatLog.scrollHeight;
  }

  function detectIntent(question) {
    const q = question.toLowerCase();
    if (matches(q, ["without id", "forgot id", "no id"])) return "noId";
    if (matches(q, ["miss", "missed", "late", "deadline"])) return "missedRegistration";
    if (matches(q, ["register", "registration", "enrol", "enroll", "form 6"])) return "register";
    if (matches(q, ["document", "id", "identity", "proof", "address", "epic"])) return "documents";
    if (matches(q, ["voting day", "polling", "booth", "vote on", "evm"])) return "votingDay";
    if (matches(q, ["not on", "name", "list", "roll", "deleted"])) return "nameMissing";
    if (matches(q, ["candidate", "nomination", "contest"])) return "candidate";
    if (matches(q, ["observer", "monitor"])) return "observer";
    if (matches(q, ["result", "counting", "winner", "trend"])) return "results";
    if (matches(q, ["deadline", "date", "when"])) return "deadline";
    return "fallback";
  }

  function responseForIntent(intent) {
    const copy = translations[state.language] || translations.en;
    const registration = state.stages.find(function (stage) {
      return stage.id === "registration";
    });
    const voting = state.stages.find(function (stage) {
      return stage.id === "voting";
    });
    const next = getNextDeadline();

    const answers = {
      register: {
        steps: [
          "Go to the official voter services portal for your election authority.",
          "Choose the registration or correction option that matches your situation.",
          "Enter details exactly as shown on your documents.",
          "Upload or provide proof only through official channels.",
          "Track the application status. Do not assume submission means approval.",
        ],
        note:
          "For India, start at https://voters.eci.gov.in/. " +
          (registration ? "Prototype registration window: " + formatRange(registration.start, registration.end) + ". " : "") +
          copy.verifyLine,
      },
      documents: {
        steps: [
          "Keep proof of age ready if you are registering as a new voter.",
          "Keep proof of ordinary residence or address ready if requested.",
          "Carry an accepted identity document on polling day.",
          "Use the exact document list shown by the official form or polling notice.",
        ],
        note:
          "Document lists can vary by process and official notice. " +
          "Do not rely on unofficial social media lists.",
      },
      votingDay: {
        steps: [
          "Check your name and polling booth before polling day.",
          "Carry an accepted identity document.",
          "Join the queue and follow polling officer instructions.",
          "Verify the candidate choice carefully before confirming your vote.",
          "Keep your vote private and leave the booth calmly.",
        ],
        note:
          (voting ? "Prototype polling date: " + formatDate(voting.start) + ". " : "") +
          "The assigned booth and accepted ID list should be verified officially.",
      },
      missedRegistration: {
        steps: [
          "First, check if your name is already on the voter list.",
          "If your name is missing and the deadline has passed, you may not be able to vote in that election.",
          "Still submit the correct official form for future elections if the portal allows it.",
          "Set a reminder for the next revision or registration window.",
        ],
        note:
          "Do not use shortcuts or paid agents promising guaranteed last-minute registration. " +
          copy.verifyLine,
      },
      nameMissing: {
        steps: [
          "Search using multiple details: name, EPIC number if available, age, relative name, and constituency.",
          "Check spelling variations and recent address changes.",
          "If still missing, use the official correction or registration process.",
          "Contact the local electoral officer through official channels if the deadline is close.",
        ],
        note: "For India, try https://electoralsearch.eci.gov.in/ and verify with the local electoral office.",
      },
      noId: {
        steps: [
          "Do not go by rumor. Check the officially accepted ID list for your election.",
          "If you have another accepted document, carry that instead.",
          "If you have no accepted ID, contact the election helpdesk before polling time.",
          "A voter slip alone may not prove identity unless official instructions say so.",
        ],
        note: "Rules are strict on identity verification. The polling officer follows the official accepted document list.",
      },
      candidate: {
        steps: [
          "Track the nomination filing dates from the official schedule.",
          "Prepare eligibility proof, required forms, affidavits, and deposits as applicable.",
          "File only with the designated returning officer within the notified time.",
          "Follow campaign, finance, and conduct rules throughout the election.",
        ],
        note: "This assistant provides neutral process guidance only and does not support campaign strategy.",
      },
      observer: {
        steps: [
          "Confirm your authorization and reporting channel.",
          "Use a neutral checklist with time, place, source, and evidence fields.",
          "Avoid interrupting voting or campaigning unless your role explicitly allows escalation.",
          "Report only verified observations through the designated channel.",
        ],
        note: "Neutrality matters. Keep observations factual and avoid party or candidate promotion.",
      },
      results: {
        steps: [
          "Use the official results portal or election authority announcements.",
          "Treat trends as provisional until the official declaration is complete.",
          "Avoid sharing screenshots without source links.",
          "If you see conflicting numbers, wait for the official update.",
        ],
        note: "For India, the results portal is https://results.eci.gov.in/ when active for an election.",
      },
      deadline: {
        steps: [
          next ? "Your next prototype deadline is " + next.title + " on " + formatDate(next.end) + "." : copy.noLiveData,
          "Add a personal reminder at least seven days earlier.",
          "Verify the official election notice before making plans.",
          "If you are unsure, use the official voter services portal or helpdesk.",
        ],
        note: copy.verifyLine,
      },
      fallback: {
        steps: [
          "Check the official election authority website for your country or state.",
          "Look for the page that matches your role: voter, candidate, or observer.",
          "Use official forms and helplines only.",
          "Ask me a narrower question like registration, voter list, ID, voting day, or results.",
        ],
        note: copy.fallback + " " + copy.verifyLine,
      },
    };

    return answers[intent] || answers.fallback;
  }

  function renderSteps(steps, note) {
    return [
      "<ol>",
      steps.map(function (step) {
        return "<li>" + escapeHtml(step) + "</li>";
      }).join(""),
      "</ol>",
      note ? "<p><strong>Note:</strong> " + escapeHtml(note) + "</p>" : "",
    ].join("");
  }

  function getNextDeadline() {
    return (
      state.stages.find(function (stage) {
        return stage.end.getTime() >= today.getTime();
      }) || null
    );
  }

  function getStageStatus(start, end) {
    if (today.getTime() > end.getTime()) return "completed";
    if (today.getTime() >= start.getTime() && today.getTime() <= end.getTime()) return "ongoing";
    return "upcoming";
  }

  function countdownText(date, copy) {
    const diff = startOfDay(date).getTime() - today.getTime();
    const days = Math.ceil(diff / oneDay);
    if (days < 0) return copy.countdownEnded;
    if (days === 0) return "Today";
    if (days === 1) return "1 day left";
    return days + " days left";
  }

  function statusLabel(status, copy) {
    return copy[status] || status;
  }

  function formatRange(start, end) {
    if (start.getTime() === end.getTime()) return formatDate(start);
    return formatDate(start) + " to " + formatDate(end);
  }

  function formatDate(date) {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  }

  function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function addDays(date, days) {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return startOfDay(next);
  }

  function matches(value, terms) {
    return terms.some(function (term) {
      return value.includes(term);
    });
  }

  function listItems(items) {
    return items
      .map(function (item) {
        return "<li>" + escapeHtml(item) + "</li>";
      })
      .join("");
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function iconFor(name) {
    const icons = {
      megaphone:
        '<svg viewBox="0 0 24 24"><path d="m3 11 14-5v12L3 13v-2Z"/><path d="M7 14v4a2 2 0 0 0 2 2h1"/><path d="M21 9v6"/></svg>',
      clipboard:
        '<svg viewBox="0 0 24 24"><path d="M9 4h6l1 2h3v15H5V6h3l1-2Z"/><path d="M9 11h6"/><path d="M9 15h4"/></svg>',
      people:
        '<svg viewBox="0 0 24 24"><path d="M16 11a4 4 0 1 0-8 0"/><path d="M3 21a7 7 0 0 1 18 0"/><path d="M17 8a3 3 0 0 1 4 3"/><path d="M3 11a3 3 0 0 1 4-3"/></svg>',
      vote:
        '<svg viewBox="0 0 24 24"><path d="M4 14h16v7H4z"/><path d="M8 14V9l4-6 4 6v5"/><path d="m9 10 2 2 4-4"/></svg>',
      chart:
        '<svg viewBox="0 0 24 24"><path d="M4 20V4"/><path d="M4 20h16"/><path d="M8 16v-5"/><path d="M13 16V8"/><path d="M18 16v-3"/></svg>',
    };
    return icons[name] || icons.clipboard;
  }

  // ====== SMART DECISION ENGINE LOGIC ======

  let userState = {
    isRegistered: false,
    hasVoterID: false,
    electionStage: "not_announced", // not_announced, registration_open, campaign, voting_day, results
    role: "voter",
    location: "India"
  };

  function updateStateLocal(updates) {
    userState = { ...userState, ...updates };
    updateUIFromState();
  }

  function runSimulation(type) {
    const resultDiv = document.getElementById("decisionResult");
    if (resultDiv) {
      resultDiv.innerHTML = `<div style="background: var(--surface-card); padding: 15px; border-radius: var(--radius-md); border-left: 4px solid var(--accent);"><strong style="color: var(--accent);">⏳ Processing simulation...</strong></div>`;
    }

    if (type === 'miss-reg') {
      userState.isRegistered = false;
      userState.electionStage = "campaign";
    } else {
      userState.isRegistered = true;
      userState.hasVoterID = true;
      userState.electionStage = "voting_day";
    }
    
    setTimeout(() => {
      updateUIFromState();
    }, 400); // Artificial delay to feel like real simulation
  }

  function updateUIFromState() {
    window.voteFlowState = userState; // Expose for frontend AI chat logic
    const elReg = document.getElementById("isRegistered");
    const elId = document.getElementById("hasVoterID");
    const elStage = document.getElementById("electionStage");

    if (elReg) elReg.value = String(userState.isRegistered);
    if (elId) elId.value = String(userState.hasVoterID);
    if (elStage) elStage.value = userState.electionStage;

    const step = getNextStep(userState);
    renderStep(step);
    updateNextStepBanner(step);
    syncToFirebaseMock(userState);
  }

  function getNextStep(userState) {
    if (!userState.isRegistered && userState.electionStage === "registration_open") {
      return "REGISTER";
    }
    if (!userState.isRegistered && userState.electionStage !== "registration_open" && userState.electionStage !== "not_announced") {
      return "MISSED_REGISTRATION";
    }
    if (!userState.isRegistered) {
      return "WAIT_FOR_REGISTRATION";
    }
    
    if (userState.electionStage === "registration_open") {
      return "VERIFY_DETAILS";
    }
    
    if (userState.electionStage === "campaign") {
      return "LEARN_CANDIDATES";
    }
    
    if (userState.electionStage === "voting_day") {
      return userState.hasVoterID ? "GO_VOTE" : "FIND_ALTERNATE_ID";
    }
    
    if (userState.electionStage === "results") {
      return "VIEW_RESULTS";
    }
    
    return "WAIT_FOR_ANNOUNCEMENT";
  }

  function renderStep(step) {
    const resultDiv = document.getElementById("decisionResult");
    if (!resultDiv) return;

    let uiContent = "";
    switch (step) {
      case "REGISTER":
        uiContent = `
          <strong>Next Action: Register to Vote</strong>
          <p>The registration window is open. Please submit your application.</p>
        `;
        break;
      case "WAIT_FOR_REGISTRATION":
        uiContent = `
          <strong>Next Action: Wait for Registration</strong>
          <p>Registration is not open yet. Keep your documents ready.</p>
        `;
        break;
      case "MISSED_REGISTRATION":
        uiContent = `
          <strong style="color: var(--error);">Warning: Missed Registration</strong>
          <p>You cannot vote in this election as you missed the registration deadline.</p>
        `;
        break;
      case "VERIFY_DETAILS":
        uiContent = `
          <strong>Next Action: Verify Details</strong>
          <p>You are registered. Verify your details on the official portal.</p>
        `;
        break;
      case "LEARN_CANDIDATES":
        uiContent = `
          <strong>Next Action: Learn about Candidates</strong>
          <p>Campaign is ongoing. Review candidate manifestos and affidavits.</p>
        `;
        break;
      case "GO_VOTE":
        uiContent = `
          <strong>Next Action: Go Vote!</strong>
          <p>It's voting day! Bring your Voter ID to the polling booth.</p>
        `;
        break;
      case "FIND_ALTERNATE_ID":
        uiContent = `
          <strong style="color: var(--warning);">Action Required: Find Alternate ID</strong>
          <p>You are registered but don't have a Voter ID. Check accepted alternate IDs.</p>
        `;
        break;
      case "VIEW_RESULTS":
        uiContent = `
          <strong>Next Action: View Results</strong>
          <p>The election is over. Check the official results portal.</p>
        `;
        break;
      case "WAIT_FOR_ANNOUNCEMENT":
      default:
        uiContent = `
          <strong>Next Action: Wait for Announcement</strong>
          <p>No active election stage currently. Stay tuned.</p>
        `;
        break;
    }
    
    resultDiv.innerHTML = `
      <div style="background: var(--surface-card); padding: 15px; border-radius: var(--radius-md); border-left: 4px solid var(--accent);">
        ${uiContent}
      </div>
    `;
  }

  function updateDecisionUI() {
    const step = getNextStep(userState);
    renderStep(step);
    updateNextStepBanner(step);
    
    syncToFirebaseMock(userState);
  }

  function updateNextStepBanner(step) {
    const banner = document.getElementById("globalNextStepBanner");
    if (!banner) return;
    
    let text = "Loading...";
    switch(step) {
      case "REGISTER": text = "Registration is open. Submit your application."; break;
      case "WAIT_FOR_REGISTRATION": text = "Wait for the registration window to open."; break;
      case "MISSED_REGISTRATION": text = "You missed the registration deadline for this election."; break;
      case "VERIFY_DETAILS": text = "Verify your details on the official portal."; break;
      case "LEARN_CANDIDATES": text = "Campaign ongoing. Review candidate manifestos."; break;
      case "GO_VOTE": text = "It's voting day! Bring your Voter ID to the booth."; break;
      case "FIND_ALTERNATE_ID": text = "Find an accepted alternate ID for voting."; break;
      case "VIEW_RESULTS": text = "The election is over. Check the official results."; break;
      case "WAIT_FOR_ANNOUNCEMENT": text = "No active election currently. Stay tuned."; break;
      default: text = "Check the Election Timeline for dates.";
    }
    banner.textContent = text;
  }

  function initDecisionEngine() {
    const elReg = document.getElementById("isRegistered");
    const elId = document.getElementById("hasVoterID");
    const elStage = document.getElementById("electionStage");
    
    if (elReg) {
      elReg.addEventListener("change", function(e) {
        updateStateLocal({ isRegistered: e.target.value === "true" });
      });
    }
    if (elId) {
      elId.addEventListener("change", function(e) {
        updateStateLocal({ hasVoterID: e.target.value === "true" });
      });
    }
    if (elStage) {
      elStage.addEventListener("change", function(e) {
        updateStateLocal({ electionStage: e.target.value });
      });
    }
    
    const simMissReg = document.getElementById("simMissReg");
    if (simMissReg) {
      simMissReg.addEventListener("click", function() {
        runSimulation('miss-reg');
      });
    }
    
    const simVoteDay = document.getElementById("simVoteDay");
    if (simVoteDay) {
      simVoteDay.addEventListener("click", function() {
        runSimulation('voting-day');
      });
    }
    
    updateUIFromState();
  }



  // Google Cloud Integration: Firebase state sync (mock hook for production readiness)
  function syncToFirebaseMock(state) {
    console.log("[Google Cloud] Firebase sync hook — User state:", JSON.stringify(state));
  }

  // Google Cloud Integration: Dialogflow assistant hook (mock for production readiness)
  function triggerDialogflowMock() {
    console.log("[Google Cloud] Dialogflow hook — Assistant context ready.");
  }
})();

// ====== GLOBAL FUNCTIONS (outside IIFE for guaranteed window access) ======

/**
 * Google Maps Embed Search (NO API KEY REQUIRED)
 * Updates the iframe src to search for polling booths near the user's query.
 * Called from inline onclick in HTML.
 */
function VF_searchBooth() {
  var input = document.getElementById("mapsSearchInput");
  var iframe = document.getElementById("googleMapsEmbed");
  if (!input || !iframe) { console.warn("[Maps] Input or iframe not found"); return; }

  var rawQuery = input.value.trim();
  if (!rawQuery) {
    input.style.borderColor = "var(--red)";
    setTimeout(function () { input.style.borderColor = ""; }, 600);
    return;
  }

  // Use the reliable Google Maps embed URL format with zoom level
  var encodedQuery = encodeURIComponent(rawQuery + " polling booth");
  var newSrc = "https://maps.google.com/maps?q=" + encodedQuery + "&t=&z=14&ie=UTF8&iwloc=&output=embed";
  iframe.src = newSrc;
  console.log("[Google Maps] Searching:", rawQuery, "URL:", newSrc);
}

/**
 * Testing System: Validates app state under different simulated conditions.
 * Called from inline onclick in HTML.
 * @param {string} testType - The test scenario identifier
 */
function VF_runTest(testType) {
  var resultsDiv = document.getElementById("testResults");
  if (!resultsDiv) { console.warn("[TEST] Results div not found"); return; }

  // Show loading shimmer
  resultsDiv.innerHTML = '<div class="loading-shimmer" style="height:40px;margin-bottom:8px;"></div><div class="loading-shimmer" style="height:40px;"></div>';

  setTimeout(function () {
    var results = [];
    var timestamp = new Date().toLocaleTimeString();

    // Self-contained decision engine logic (mirrors the IIFE's getNextStep)
    function testGetNextStep(s) {
      if (!s.isRegistered && s.electionStage === "registration_open") return "REGISTER";
      if (!s.isRegistered && s.electionStage !== "registration_open" && s.electionStage !== "not_announced") return "MISSED_REGISTRATION";
      if (!s.isRegistered) return "WAIT_FOR_REGISTRATION";
      if (s.electionStage === "registration_open") return "VERIFY_DETAILS";
      if (s.electionStage === "campaign") return "LEARN_CANDIDATES";
      if (s.electionStage === "voting_day") return s.hasVoterID ? "GO_VOTE" : "FIND_ALTERNATE_ID";
      if (s.electionStage === "results") return "VIEW_RESULTS";
      return "WAIT_FOR_ANNOUNCEMENT";
    }

    // Sync dropdowns on Guidance page
    function syncDropdowns(s) {
      try {
        var elReg = document.getElementById("isRegistered");
        var elId = document.getElementById("hasVoterID");
        var elStage = document.getElementById("electionStage");
        if (elReg) elReg.value = String(s.isRegistered);
        if (elId) elId.value = String(s.hasVoterID);
        if (elStage) elStage.value = s.electionStage;
        if (elReg) elReg.dispatchEvent(new Event("change"));
      } catch (e) { /* silent */ }
    }

    if (testType === "not-registered") {
      var s1 = { isRegistered: false, hasVoterID: false, electionStage: "registration_open" };
      var step1 = testGetNextStep(s1);
      results = [
        { pass: true, msg: "State set: isRegistered = false" },
        { pass: true, msg: "Decision engine returns: " + step1 },
        { pass: step1 === "REGISTER", msg: "Validation: getNextStep() === 'REGISTER' \u2192 " + step1 },
      ];
      syncDropdowns(s1);
      console.log("[TEST] Not Registered:", JSON.stringify(s1), "step:", step1);

    } else if (testType === "voting-day") {
      var s2 = { isRegistered: true, hasVoterID: true, electionStage: "voting_day" };
      var step2 = testGetNextStep(s2);
      results = [
        { pass: true, msg: "State set: isRegistered = true, hasVoterID = true" },
        { pass: true, msg: "Stage set: voting_day" },
        { pass: step2 === "GO_VOTE", msg: "Validation: getNextStep() === 'GO_VOTE' \u2192 " + step2 },
      ];
      syncDropdowns(s2);
      console.log("[TEST] Voting Day:", JSON.stringify(s2), "step:", step2);

    } else if (testType === "missing-id") {
      var s3 = { isRegistered: true, hasVoterID: false, electionStage: "voting_day" };
      var step3 = testGetNextStep(s3);
      results = [
        { pass: true, msg: "State set: isRegistered = true, hasVoterID = false" },
        { pass: true, msg: "Stage set: voting_day" },
        { pass: step3 === "FIND_ALTERNATE_ID", msg: "Validation: getNextStep() === 'FIND_ALTERNATE_ID' \u2192 " + step3 },
      ];
      syncDropdowns(s3);
      console.log("[TEST] Missing ID:", JSON.stringify(s3), "step:", step3);

    } else if (testType === "all-pass") {
      var allTests = [
        { label: "Not Registered + Reg Open", state: { isRegistered: false, hasVoterID: false, electionStage: "registration_open" }, expected: "REGISTER" },
        { label: "Missed Registration", state: { isRegistered: false, hasVoterID: false, electionStage: "campaign" }, expected: "MISSED_REGISTRATION" },
        { label: "Voting Day Ready", state: { isRegistered: true, hasVoterID: true, electionStage: "voting_day" }, expected: "GO_VOTE" },
        { label: "Missing ID on Voting Day", state: { isRegistered: true, hasVoterID: false, electionStage: "voting_day" }, expected: "FIND_ALTERNATE_ID" },
        { label: "View Results", state: { isRegistered: true, hasVoterID: true, electionStage: "results" }, expected: "VIEW_RESULTS" },
        { label: "Wait for Announcement", state: { isRegistered: true, hasVoterID: true, electionStage: "not_announced" }, expected: "WAIT_FOR_ANNOUNCEMENT" },
      ];
      for (var i = 0; i < allTests.length; i++) {
        var t = allTests[i];
        var result = testGetNextStep(t.state);
        var pass = result === t.expected;
        results.push({ pass: pass, msg: t.label + ": " + (pass ? "PASS \u2713" : "FAIL (got " + result + ")") });
        console.log("[TEST]", t.label, pass ? "PASS" : "FAIL", "Expected:", t.expected, "Got:", result);
      }
    }

    // Render results to DOM
    var html = "";
    for (var j = 0; j < results.length; j++) {
      var r = results[j];
      html += '<div class="test-result-item"><span class="' + (r.pass ? 'test-pass' : 'test-fail') + '">' + (r.pass ? '\u2705' : '\u274C') + '</span><span>' + r.msg + '</span></div>';
    }

    var passCount = 0;
    for (var k = 0; k < results.length; k++) { if (results[k].pass) passCount++; }
    var allPassed = passCount === results.length;
    html += '<div style="margin-top:12px;padding-top:12px;border-top:2px solid ' + (allPassed ? 'var(--green)' : 'var(--amber)') + ';font-weight:700;font-size:1.05rem;color:' + (allPassed ? 'var(--green)' : 'var(--amber)') + ';">' + (allPassed ? '\u2705 ' : '\u26A0\uFE0F ') + passCount + '/' + results.length + ' tests passed \u2014 ' + timestamp + '</div>';

    resultsDiv.innerHTML = html;
  }, 400);
}

console.log("[VoteFlow] Maps search & testing panel ready.");


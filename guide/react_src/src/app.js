(function () {
  const h = React.createElement;
  const navItems = window.GUIDE_NAV_ITEMS || [];
  const chapters = window.GUIDE_CHAPTERS || {};

  function Header({ activeTab, onTabChange }) {
    return h(
      "header",
      { className: "sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm" },
      h(
        "div",
        { className: "flex items-center gap-3" },
        h("div", { className: "w-8 h-8 bg-[#191f28] rounded-lg flex items-center justify-center text-white font-bold text-lg" }, "A"),
        h("h1", { className: "text-xl font-bold text-[#191f28] tracking-tight" }, "AXI DMA Architecture Guide")
      ),
      h(
        "nav",
        { className: "hidden lg:flex gap-1 bg-[#f2f4f6] p-1 rounded-xl overflow-x-auto" },
        navItems.map((item) =>
          h(
            "button",
            {
              key: item.id,
              id: `nav-${item.id}`,
              type: "button",
              onClick: () => onTabChange(item.id),
              className:
                activeTab === item.id
                  ? "tab-btn px-4 py-2 rounded-lg text-[13px] font-semibold transition-all bg-white text-[#191f28] shadow-sm"
                  : "tab-btn px-4 py-2 rounded-lg text-[13px] font-semibold transition-all text-[#8b95a1] hover:text-[#4e5968] hover:bg-gray-200/50",
            },
            item.desktopLabel
          )
        )
      )
    );
  }

  function MobileNav({ activeTab, onTabChange }) {
    return h(
      "div",
      { className: "lg:hidden bg-white border-b border-gray-200 px-2 py-2 flex overflow-x-auto hide-scrollbar gap-2" },
      navItems.map((item) =>
        h(
          "button",
          {
            key: item.id,
            id: `mob-${item.id}`,
            type: "button",
            onClick: () => onTabChange(item.id),
            className:
              activeTab === item.id
                ? "mob-btn shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#191f28] text-white border border-[#191f28]"
                : "mob-btn shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 bg-gray-50 border border-gray-200",
          },
          item.mobileLabel
        )
      )
    );
  }

  function Chapter({ activeTab }) {
    const chapter = chapters[activeTab] || chapters.intro;
    return h("section", {
      id: `${chapter.id}-section`,
      className: "tab-content active space-y-10",
      dangerouslySetInnerHTML: { __html: chapter.html },
    });
  }

  function Footer() {
    return h(
      "footer",
      { className: "mt-auto border-t border-gray-200 bg-[#f9fafb] py-8" },
      h(
        "div",
        { className: "max-w-5xl mx-auto px-4 text-center text-[#8b95a1] text-xs" },
        h("p", null, "AXI DMA Architecture Guidebook"),
        h("p", { className: "mt-1" }, "Self-contained React guide for AXI DMA architecture study.")
      )
    );
  }

  function App() {
    const [activeTab, setActiveTab] = React.useState("intro");

    const changeTab = React.useCallback((tabId) => {
      if (!chapters[tabId]) return;
      setActiveTab(tabId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    React.useEffect(() => {
      window.switchTab = changeTab;
    }, [changeTab]);

    React.useEffect(() => {
      const actionById = {
        "btn-axi-read": () => window.runAxiReadBurst && window.runAxiReadBurst(),
        "btn-axi-write": () => window.runAxiWriteBurst && window.runAxiWriteBurst(),
        "btn-stream": () => window.runStreamAnimation && window.runStreamAnimation(),
        "runSgBtn": () => window.runSGAnimation && window.runSGAnimation(),
        "btn-tea": () => window.runTeaAnimation && window.runTeaAnimation(),
      };

      function handleDelegatedClick(event) {
        const button = event.target.closest("button");
        if (!button) return;
        const action = actionById[button.id];
        if (!action) return;
        event.preventDefault();
        action();
      }

      document.addEventListener("click", handleDelegatedClick);
      return () => document.removeEventListener("click", handleDelegatedClick);
    }, []);

    React.useEffect(() => {
      window.requestAnimationFrame(() => {
        if (window.lucide) window.lucide.createIcons();
      });
    }, [activeTab]);

    return h(
      React.Fragment,
      null,
      h(Header, { activeTab, onTabChange: changeTab }),
      h(MobileNav, { activeTab, onTabChange: changeTab }),
      h("main", { className: "max-w-5xl w-full mx-auto px-4 py-8 lg:py-10 flex-1" }, h(Chapter, { activeTab })),
      h(Footer)
    );
  }

  ReactDOM.createRoot(document.getElementById("root")).render(h(App));
})();

"use strict";
/* =========================================
   Portfolio script (TypeScript)
   Compiled to script.js with `npm run build`.
   ========================================= */
(function () {
    const CONTACT_EMAIL = "mridulasamia4@gmail.com";
    const THEME_KEY = "theme";
    /* ---------- 1. Dark & light theme ---------- */
    function initTheme() {
        const root = document.documentElement;
        const button = document.getElementById("themeToggle");
        const icon = document.getElementById("themeIcon");
        const themeColor = document.querySelector('meta[name="theme-color"]');
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
        function getSavedTheme() {
            try {
                const saved = localStorage.getItem(THEME_KEY);
                return saved === "dark" || saved === "light" ? saved : null;
            }
            catch {
                return null;
            }
        }
        function saveTheme(theme) {
            try {
                localStorage.setItem(THEME_KEY, theme);
            }
            catch {
                // The theme still works if storage is unavailable.
            }
        }
        function applyTheme(theme) {
            const isDark = theme === "dark";
            const label = isDark ? "Switch to light mode" : "Switch to dark mode";
            root.dataset.theme = theme;
            if (icon)
                icon.textContent = isDark ? "☀" : "☾";
            if (button) {
                button.setAttribute("aria-pressed", String(isDark));
                button.setAttribute("aria-label", label);
                button.setAttribute("title", label);
            }
            if (themeColor)
                themeColor.content = isDark ? "#0b1120" : "#ffffff";
        }
        applyTheme(getSavedTheme() ?? (systemTheme.matches ? "dark" : "light"));
        button?.addEventListener("click", () => {
            const next = root.dataset.theme === "dark" ? "light" : "dark";
            applyTheme(next);
            saveTheme(next);
        });
        // Follow system changes unless a preference was saved.
        systemTheme.addEventListener("change", (event) => {
            if (!getSavedTheme())
                applyTheme(event.matches ? "dark" : "light");
        });
    }
    /* ---------- 2. Footer year ---------- */
    function initYear() {
        const year = document.getElementById("year");
        if (year)
            year.textContent = String(new Date().getFullYear());
    }
    /* ---------- 3. Mobile navigation ---------- */
    function initMobileMenu() {
        const button = document.getElementById("menuToggle");
        const icon = document.getElementById("menuIcon");
        const nav = document.getElementById("navLinks");
        if (!button || !nav)
            return;
        function setOpen(isOpen) {
            nav.classList.toggle("open", isOpen);
            button.setAttribute("aria-expanded", String(isOpen));
            button.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
            if (icon)
                icon.textContent = isOpen ? "×" : "☰";
        }
        setOpen(false);
        button.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
        nav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => setOpen(false));
        });
        document.addEventListener("click", (event) => {
            const target = event.target;
            if (!nav.contains(target) && !button.contains(target))
                setOpen(false);
        });
        document.addEventListener("keydown", (event) => {
            if (event.key !== "Escape")
                return;
            const wasOpen = nav.classList.contains("open");
            setOpen(false);
            if (wasOpen && window.innerWidth <= 760)
                button.focus();
        });
        window.matchMedia("(max-width: 760px)").addEventListener("change", (event) => {
            if (!event.matches)
                setOpen(false);
        });
    }
    /* ---------- Resume dropdown ---------- */
    function initResumeDropdown() {
        const toggle = document.getElementById("resumeToggle");
        const menu = document.getElementById("resumeMenu");
        if (!toggle || !menu)
            return;
        function close() {
            menu.hidden = true;
            toggle.setAttribute("aria-expanded", "false");
        }
        toggle.addEventListener("click", (e) => {
            e.stopPropagation();
            const isOpen = !menu.hidden;
            menu.hidden = isOpen;
            toggle.setAttribute("aria-expanded", String(!isOpen));
        });
        document.addEventListener("click", close);
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape")
                close();
        });
    }
    /* ---------- 4. Active navigation link ---------- */
    function initActiveLink() {
        const nav = document.getElementById("navLinks");
        if (!nav || !("IntersectionObserver" in window))
            return;
        const links = Array.from(nav.querySelectorAll('a[href^="#"]:not(.button)'));
        const sections = links
            .map((link) => {
            const target = link.getAttribute("href");
            if (!target || target === "#")
                return null;
            try {
                return document.querySelector(target);
            }
            catch {
                return null;
            }
        })
            .filter((section) => section !== null);
        if (sections.length === 0)
            return;
        function setActive(sectionId) {
            links.forEach((link) => {
                const isActive = link.getAttribute("href") === "#" + sectionId;
                link.classList.toggle("active", isActive);
                if (isActive)
                    link.setAttribute("aria-current", "location");
                else
                    link.removeAttribute("aria-current");
            });
        }
        const observer = new IntersectionObserver((entries) => {
            const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
            if (visible.length > 0)
                setActive(visible[0].target.id);
        }, { rootMargin: "-25% 0px -60% 0px", threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] });
        sections.forEach((section) => observer.observe(section));
    }
    /* ---------- 5. Project filters ---------- */
    function initProjectFilters() {
        const buttons = Array.from(document.querySelectorAll(".filter-button"));
        const cards = Array.from(document.querySelectorAll(".project-card"));
        const emptyMessage = document.getElementById("emptyMessage");
        if (buttons.length === 0)
            return;
        function filterProjects(chosen) {
            let visible = 0;
            buttons.forEach((button) => {
                const isSelected = button.dataset.filter === chosen;
                button.classList.toggle("active", isSelected);
                button.setAttribute("aria-pressed", String(isSelected));
            });
            cards.forEach((card) => {
                const categories = (card.dataset.category ?? "").trim().split(/\s+/).filter(Boolean);
                const show = chosen === "all" || categories.includes(chosen);
                card.hidden = !show;
                if (show)
                    visible++;
            });
            if (emptyMessage)
                emptyMessage.hidden = visible > 0;
        }
        buttons.forEach((button) => {
            button.addEventListener("click", () => filterProjects(button.dataset.filter ?? "all"));
        });
        const initial = buttons.find((button) => button.classList.contains("active"));
        filterProjects(initial?.dataset.filter ?? "all");
    }
    /* ---------- 6. Contact form (opens an email draft) ---------- */
    function initContactForm() {
        const form = document.getElementById("contactForm");
        const note = document.getElementById("formNote");
        if (!form)
            return;
        function say(text) {
            if (note)
                note.textContent = text;
        }
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            if (!form.reportValidity()) {
                say("Please complete the required fields with valid information.");
                return;
            }
            const data = new FormData(form);
            const field = (key) => String(data.get(key) ?? "").trim();
            const name = field("name");
            const email = field("email");
            const subject = field("subject");
            const message = field("message");
            if (!name || !email || !subject || !message) {
                say("Please complete all fields.");
                return;
            }
            const body = ["Name: " + name, "Email: " + email, "", "Message:", message].join("\n");
            const link = "mailto:" + CONTACT_EMAIL +
                "?subject=" + encodeURIComponent(subject) +
                "&body=" + encodeURIComponent(body);
            say("Opening your email application. Your message has not been sent yet.");
            window.location.href = link;
        });
    }
    /* ---------- 7. Copy email address ---------- */
    function initCopyEmail() {
        const button = document.getElementById("copyEmail");
        const note = document.getElementById("copyEmailNote");
        if (!button)
            return;
        function say(text) {
            if (note)
                note.textContent = text;
        }
        button.addEventListener("click", () => {
            const address = button.dataset.email ?? CONTACT_EMAIL;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(address).then(() => say("Email address copied."), () => say("Copy failed. Please copy it manually: " + address));
            }
            else {
                say("Copy is not supported here. Please copy it manually: " + address);
            }
        });
    }
    /* ---------- 8. About: Brief / Detailed toggle ---------- */
    function initAboutToggle() {
        const buttons = Array.from(document.querySelectorAll(".about-btn"));
        const panels = Array.from(document.querySelectorAll(".about-content"));
        buttons.forEach((button) => {
            button.addEventListener("click", () => {
                const target = button.dataset.target;
                panels.forEach((panel) => panel.classList.toggle("active", panel.id === target));
                buttons.forEach((other) => other.classList.toggle("active", other === button));
            });
        });
    }
    /* ---------- 9. Scroll reveal ---------- */
    function initReveal() {
        const items = document.querySelectorAll(".reveal");
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (items.length === 0 || reduceMotion || !("IntersectionObserver" in window))
            return;
        document.documentElement.classList.add("js-reveal");
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        items.forEach((item) => observer.observe(item));
    }
    initTheme();
    initYear();
    initMobileMenu();
    initResumeDropdown();
    initActiveLink();
    initProjectFilters();
    initContactForm();
    initCopyEmail();
    initAboutToggle();
    initReveal();
})();

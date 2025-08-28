 function setCookie(name, value, days) {
        const d = new Date();
        d.setTime(d.getTime() + (days*24*60*60*1000));
        document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
    }

    function getCookie(name) {
        const cname = name + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for (let c of ca) {
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(cname) == 0) return c.substring(cname.length, c.length);
        }
        return "";
    }

    // ------------------- localStorage -------------------
    function saveToLocal(feedback) {
        let storedFeedback = JSON.parse(localStorage.getItem("feedbacks")) || [];
        storedFeedback.push(feedback);
        localStorage.setItem("feedbacks", JSON.stringify(storedFeedback));
    }

    function loadFromLocal() {
        const storedFeedback = JSON.parse(localStorage.getItem("feedbacks"));
        if (storedFeedback && storedFeedback.length > 0) {
            const last = storedFeedback[storedFeedback.length - 1];
            document.getElementById("name").value = last.name || "";
            document.getElementById("email").value = last.email || "";
        }
    }

    // ------------------- sessionStorage -------------------
    function saveDraft() {
        sessionStorage.setItem("draftFeedback", document.getElementById("message").value);
    }

    function loadDraft() {
        const draft = sessionStorage.getItem("draftFeedback");
        if (draft) {
            document.getElementById("message").value = draft;
        }
    }

    // ------------------- Main Form Logic -------------------
    document.getElementById("feedbackForm").addEventListener("submit", function(e) {
        e.preventDefault();

        const feedback = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            type: document.getElementById("feedbackType").value,
            message: document.getElementById("message").value,
            subscribe: document.getElementById("subscribe").checked
        };

        // Save feedback
        saveToLocal(feedback);                  // localStorage
        setCookie("feedbackSubmitted", "1", 7); // cookie for 7 days
        sessionStorage.removeItem("draftFeedback"); // clear draft after submit

        this.reset();
    });

    // Auto-save draft while typing
    document.getElementById("message").addEventListener("input", saveDraft);

    // On page load → restore last data
    window.onload = function() {
        loadFromLocal(); // Prefill name + email from last feedback
        loadDraft();     // Restore unsent draft
        if (getCookie("feedbackSubmitted")) {
            console.log("User already submitted feedback recently.");
        }
    }
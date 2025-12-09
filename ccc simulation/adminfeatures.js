let generalQueue = JSON.parse(localStorage.getItem("generalQueue")) || [];
let seniorQueue = JSON.parse(localStorage.getItem("seniorQueue")) || [];
let officialQueue = JSON.parse(localStorage.getItem("officialQueue")) || [];
let servedCount = parseInt(localStorage.getItem("servedCount")) || 0;

let totalGeneral = parseInt(localStorage.getItem("totalGeneral")) || 0;
let totalSenior = parseInt(localStorage.getItem("totalSenior")) || 0;
let totalOfficial = parseInt(localStorage.getItem("totalOfficial")) || 0;
let globalToken = parseInt(localStorage.getItem("globalToken")) || 1;

function saveAdminData() {
    localStorage.setItem("generalQueue", JSON.stringify(generalQueue));
    localStorage.setItem("seniorQueue", JSON.stringify(seniorQueue));
    localStorage.setItem("officialQueue", JSON.stringify(officialQueue));
    localStorage.setItem("servedCount", servedCount);
    localStorage.setItem("totalGeneral", totalGeneral);
    localStorage.setItem("totalSenior", totalSenior);
    localStorage.setItem("totalOfficial", totalOfficial);
    localStorage.setItem("globalToken", globalToken);
}

function updateQueueCounters() {
    document.getElementById("officialCount").innerText = officialQueue.length;
    document.getElementById("seniorCount").innerText = seniorQueue.length;
    document.getElementById("generalCount").innerText = generalQueue.length;

    if (generalQueue.length > 0 && generalQueue[0].priority) {
        document.getElementById("generalCount").style.color = "red";
    } else {
        document.getElementById("generalCount").style.color = "white";
    }
}

function checkGeneralPriority() {
    // Reset all priorities
    generalQueue.forEach(t => t.priority = false);

    if (generalQueue.length > 0) {
        const firstGeneral = generalQueue[0];
        let peopleAhead = officialQueue.length + seniorQueue.length;

        if (peopleAhead > 5) {
            firstGeneral.priority = true;
        }
    }

    const generalList = document.getElementById("generalList");
    generalList.innerHTML = generalQueue.length === 0
        ? "<li>No General tokens</li>"
        : generalQueue.map(t => {
            const cls = t.served
                ? "served"
                : (t.priority ? "general priority" : "general");
            return `<li class="${cls}">${t.token} - ${t.name} (${t.purpose})</li>`;
        }).join("");
}

function showQueuesAdmin() {
    document.getElementById("servedCount").innerText = servedCount;

    const officialList = document.getElementById("officialList");
    const seniorList = document.getElementById("seniorList");

    officialList.innerHTML = officialQueue.length === 0
        ? "<li>No Official tokens</li>"
        : officialQueue.map(t => {
            const cls = t.served ? "served" : "official";
            return `<li class="${cls}">${t.token} - ${t.name} (${t.purpose})</li>`;
        }).join("");

    seniorList.innerHTML = seniorQueue.length === 0
        ? "<li>No Senior tokens</li>"
        : seniorQueue.map(t => {
            const cls = t.served ? "served" : "senior";
            return `<li class="${cls}">${t.token} - ${t.name} (${t.purpose})</li>`;
        }).join("");

    checkGeneralPriority();
    updateQueueCounters();
}

function serveNextToken() {
    // Serve first general priority
    let highPriorityGeneral = generalQueue.find(t => t.priority);
    if (highPriorityGeneral) {
        generalQueue = generalQueue.filter(t => t.token !== highPriorityGeneral.token);
        highPriorityGeneral.served = true;
        servedCount++;

        alert(`Serving General (priority) Token ${highPriorityGeneral.token} - ${highPriorityGeneral.name}`);

        saveAdminData();
        showQueuesAdmin();
        return;
    }

    // Serve officials (max 3 in a row based on your logic)
    if (officialQueue.length > 0) {
        let officialToServe = officialQueue.shift();
        officialToServe.served = true;
        servedCount++;

        alert(`Serving Official Token ${officialToServe.token} - ${officialToServe.name}`);

        if (officialQueue.length % 3 === 0 && seniorQueue.length > 0) {
            let seniorToServe = seniorQueue.shift();
            seniorToServe.served = true;
            servedCount++;

            alert(`Serving Senior Citizen Token ${seniorToServe.token} - ${seniorToServe.name}`);
        }

        saveAdminData();
        showQueuesAdmin();
        return;
    }

    // Serve seniors
    if (seniorQueue.length > 0) {
        let seniorToServe = seniorQueue.shift();
        seniorToServe.served = true;
        servedCount++;

        alert(`Serving Senior Citizen Token ${seniorToServe.token} - ${seniorToServe.name}`);

        saveAdminData();
        showQueuesAdmin();
        return;
    }

    // Serve normal general
    if (generalQueue.length > 0) {
        let generalToServe = generalQueue.shift();
        generalToServe.served = true;
        servedCount++;

        alert(`Serving General Token ${generalToServe.token} - ${generalToServe.name}`);

        saveAdminData();
        showQueuesAdmin();
        return;
    }

    alert("No tokens in queue!");
}

function resetTokens() {
    if (!confirm("Reset all queues?")) return;

    generalQueue = [];
    seniorQueue = [];
    officialQueue = [];
    servedCount = 0;
    globalToken = 1;
    totalGeneral = 0;
    totalSenior = 0;
    totalOfficial = 0;

    saveAdminData();
    showQueuesAdmin();
}

function showVisitorCount() {
    alert(`Official: ${totalOfficial}\nSenior Citizen: ${totalSenior}\nGeneral: ${totalGeneral}`);
}

document.addEventListener("DOMContentLoaded", () => {
    showQueuesAdmin();
});

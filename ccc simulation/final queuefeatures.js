let generalQueue = JSON.parse(localStorage.getItem("generalQueue")) || [];
let seniorQueue = JSON.parse(localStorage.getItem("seniorQueue")) || [];
let officialQueue = JSON.parse(localStorage.getItem("officialQueue")) || [];
let servedCount = parseInt(localStorage.getItem("servedCount")) || 0;
let globalToken = parseInt(localStorage.getItem("globalToken")) || 1;

let totalGeneral = parseInt(localStorage.getItem("totalGeneral")) || 0;
let totalSenior = parseInt(localStorage.getItem("totalSenior")) || 0;
let totalOfficial = parseInt(localStorage.getItem("totalOfficial")) || 0;

function saveData() {
    localStorage.setItem("generalQueue", JSON.stringify(generalQueue));
    localStorage.setItem("seniorQueue", JSON.stringify(seniorQueue));
    localStorage.setItem("officialQueue", JSON.stringify(officialQueue));
    localStorage.setItem("servedCount", servedCount);
    localStorage.setItem("globalToken", globalToken);
    localStorage.setItem("totalGeneral", totalGeneral);
    localStorage.setItem("totalSenior", totalSenior);
    localStorage.setItem("totalOfficial", totalOfficial);
}

function updateQueueCounters() {
    const officialCountEl = document.getElementById("officialCount");
    const seniorCountEl = document.getElementById("seniorCount");
    const generalCountEl = document.getElementById("generalCount");

    if (officialCountEl) officialCountEl.innerText = officialQueue.length;
    if (seniorCountEl) seniorCountEl.innerText = seniorQueue.length;
    if (generalCountEl) {
        generalCountEl.innerText = generalQueue.length;

        if (generalQueue.length > 0 && generalQueue[0].priority) {
            generalCountEl.style.color = "red";
        } else {
            generalCountEl.style.color = "white";
        }
    }
}

function checkGeneralPriority() {
    // reset all priorities
    generalQueue.forEach(t => t.priority = false);

    // set priority for first general if many people ahead
    if (generalQueue.length > 0) {
        const peopleAhead = officialQueue.length + seniorQueue.length;
        if (peopleAhead > 5) {
            generalQueue[0].priority = true;
        }
    }

    const generalList = document.getElementById("generalList");
    if (!generalList) return;

    if (generalQueue.length === 0) {
        generalList.innerHTML = "<li>No General tokens</li>";
    } else {
        generalList.innerHTML = generalQueue
            .map(t => {
                let cls = "general";
                if (t.served) cls = "served";
                else if (t.priority) cls = "general priority";

                return `<li class="${cls}">${t.token} - ${t.name} (${t.purpose})</li>`;
            })
            .join("");
    }
}

function showQueues() {
    const officialList = document.getElementById("officialList");
    const seniorList = document.getElementById("seniorList");

    if (officialList) {
        if (officialQueue.length === 0) {
            officialList.innerHTML = "<li>No Official tokens</li>";
        } else {
            officialList.innerHTML = officialQueue
                .map(t => {
                    const cls = t.served ? "served" : "official";
                    return `<li class="${cls}">${t.token} - ${t.name} (${t.purpose})</li>`;
                })
                .join("");
        }
    }

    if (seniorList) {
        if (seniorQueue.length === 0) {
            seniorList.innerHTML = "<li>No Senior tokens</li>";
        } else {
            seniorList.innerHTML = seniorQueue
                .map(t => {
                    const cls = t.served ? "served" : "senior";
                    return `<li class="${cls}">${t.token} - ${t.name} (${t.purpose})</li>`;
                })
                .join("");
        }
    }

    checkGeneralPriority();
    updateQueueCounters();
}

function showUserDetails(user) {
    const userDiv = document.getElementById("userDetails");
    if (!userDiv) return;

    let position = 0;
    let peopleAhead = 0;

    if (user.type === "official") {
        position = officialQueue.findIndex(x => x.token === user.token) + 1;
        peopleAhead = position > 0 ? position - 1 : 0;
    } else if (user.type === "senior") {
        position = seniorQueue.findIndex(x => x.token === user.token) + 1;
        peopleAhead = officialQueue.length + (position > 0 ? position - 1 : 0);
    } else {
        position = generalQueue.findIndex(x => x.token === user.token) + 1;
        peopleAhead = officialQueue.length + seniorQueue.length + (position > 0 ? position - 1 : 0);
    }

    userDiv.innerHTML = `
        <p><b>Name:</b> ${user.name}</p>
        <p><b>Token:</b> ${user.token}</p>
        <p><b>Type:</b> ${user.type.toUpperCase()}</p>
        <p><b>Purpose:</b> ${user.purpose}</p>
        <p><b>Position in Queue:</b> ${position || "Not found"}</p>
        <p><b>People ahead:</b> ${peopleAhead}</p>
        <p><b>People served:</b> ${servedCount}</p>
    `;
}

function generateToken() {
    const nameInput = document.getElementById("name");
    const typeInput = document.getElementById("type");
    const purposeInput = document.getElementById("purpose");

    if (!nameInput || !typeInput || !purposeInput) {
        alert("Form elements not found in HTML!");
        return;
    }

    const name = nameInput.value.trim();
    const type = typeInput.value;
    const purpose = purposeInput.value;

    if (!name) {
        alert("Enter your name!");
        return;
    }

    const tokenData = {
        token: globalToken++,
        name,
        type,
        purpose,
        served: false,
        time: new Date().toISOString(),
        priority: false
    };

    switch (type) {
        case "official":
            officialQueue.push(tokenData);
            totalOfficial++;
            break;
        case "senior":
            seniorQueue.push(tokenData);
            totalSenior++;
            break;
        default:
            generalQueue.push(tokenData);
            totalGeneral++;
            break;
    }

    saveData();
    showQueues();
    showUserDetails(tokenData);
}

document.addEventListener("DOMContentLoaded", () => {
    showQueues();
});

// expose for onclick if needed
window.generateToken = generateToken;

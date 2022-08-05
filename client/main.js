
const resultsDiv = document.getElementById("results");


// step 1
// in powershell, cd to "/bug-safari-two/project (replace project with the client-side folder)
// then npx http-server -p 3000 -c-1
// step 2
// go to http://localhost:3000/document.html, make sure can view the html
// step 3
// run intelliJ app
// add code to this JS file, can be in JSON format or async/await format
// step 4
// click buttons
// step 5
// when done with npx http-server, Ctrl + c in terminal to shutdown
// then shutdown the app in intelliJ


async function getAll() {

const init = {
        //mode: 'no-cors',
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    };

    const response = await fetch("http://localhost:8080/api/agent", init);
    if (response.status !== 200) {
        console.log(`Bad status: ${response.status}`);
        return Promise.reject("response is not 200 OK");
    }
    const json = await response.json();

    // Add data to the DOM.
    let html = "";
    for (const a of json) {
        html += `<div id="agent${a.agentId}">
        <strong>${a.agentId}</strong>
        ${a.firstName}
        ${a.middleName}
        ${a.lastName}
        ${a.dob}
        ${a.heightInInches}
        <button onclick="put()">Edit</button>
        <button onclick="delete()">Delete</button>
        </div>`
    }
    document.getElementById("results").innerHTML = html;
}


async function put() {
//const agentToUpdate = document.getElementById("")
//const agentId = document.getElementById(`agent${}`)

    const solarpanel = {
        "id": solarpanelId,
        "section": "The Ridge",
        "row": 2,
        "column": 6,
        "year_installed": 2017,
        "material": "CD_TE",
        "is_tracking": true,
    };

    const init = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(solarpanel)
    };

    fetch("http://localhost:8080/api/solarpanel/4", init)
        .then(response => {
            if (response.status === 404) {
                console.log("solarpanel not found.");
            } else if (response.status === 204) {
                console.log("solarpanel updated!");
            } else {
                console.log(`Sighting id ${solarpanel.id} update failed with status ${response.status}.`);
            }
        })
        }

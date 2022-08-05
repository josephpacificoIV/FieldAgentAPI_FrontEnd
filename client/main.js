
const resultsDiv = document.getElementById("results");
const addAgentForm = document.getElementById("addAgent");
const viewAgentForm = document.getElementById("viewAgent");
const messagesDiv = document.getElementById("messages");

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



viewAgentForm.addEventListener("submit", evt => {
    evt.preventDefault();
    getAll();
    })


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
        err(`Bad status: ${response.status}`);
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

addAgentForm.addEventListener("submit", evt => {
    evt.preventDefault();

    const errorMessages = [];

    const firstName = document.getElementById("firstName").value.trim();
    if (firstName.length === 0) {
        errorMessages.push("First name is required.");
        return;
    }


    const lastName = document.getElementById("lastName").value.trim();
            if (lastName.length === 0) {
                errorMessages.push("Last name is required.");
                return;
            }

    const dob = Date.parse(document.getElementById("dob").value);
    if (dob === null) {
        errorMessages.push("Date of Birth is required.");
        return;
    }

    const heightInInches = document.getElementById("heightInInches").value;
    if (heightInInches >= 36 || heightInInches <= 96) {
        errorMessages.push("height must be between 36 and 96 inches");
        return;
    }

    if (errorMessages.length === 0){
       post();
    } else {
        renderErrorMessages(errorMessages);
    }

    /*capsules[capsule - 1] = guest;
    document.getElementById(`capsuleLabel${capsule}`).className = "badge badge-pill badge-danger";
    document.getElementById(`guest${capsule}`).innerText = guest;
    success(`Agent: ${guest} booked in capsule #${capsule}.`);
    document.getElementById("guest").value = "";*/
})

const renderErrorMessages = errorMessages => {
    let html = "<p> The following errors were found: </p><ul>"
    // take array of json object, map it to html element

    const errorMessageItems = errorMessages.map(errorMessage => `<li>${errorMessage}</li>` )
    // map takes array as input, maps to a new array
    // transforming the element using whatever you supply it,
    // in this case, strings to list tags

    html += errorMessageItems.join('\n');// add new tags on new lines
    html += '</ul>';

    messagesDiv.innerHTML = html;
    // innerHtml is everything btw <div>start tag, and end  </div>  tag
    // remove CSS style
    messagesDiv.classList.remove('alert-info');
    messagesDiv.classList.remove('alert-success');
    messagesDiv.classList.add('alert-danger');

}

const renderSuccessMessage = message => {

    messagesDiv.innerHTML = `<p>${message}></p>`;
    // innerHtml is everything btw <div>start tag, and end  </div>  tag
    // remove CSS style
    messagesDiv.classList.remove('alert-info');
    messagesDiv.classList.remove('alert-danger');
    messagesDiv.classList.add('alert-success');

}



async function post() {


    // 1. An object to send with the request.
    const new_agent = {
        "firstName": document.getElementById("firstName").value,
        "middleName": document.getElementById("middleName").value,
        "lastName": document.getElementById("lastName").value,
        "dob": document.getElementById("dob").value,
        "heightInInches": document.getElementById("heightInInches").value
    };

    const init = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(new_agent) // 2.
    };

    fetch("http://localhost:8080/api/agent", init)
        .then(response => {
            if (response.status !== 201) {
                renderSuccessMessage("Agent is not valid.");
                return Promise.reject("response is not 200 OK");
            }
            return response.json();
        }).then(json => renderSuccessMessage("New agent created:", json));

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

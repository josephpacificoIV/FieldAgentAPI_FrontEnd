
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


    /*for (const a of json) {
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
    }*/

    // Add data to the DOM.
    let html = "";
    for (const a of json) {
    html += `<tr>
            <td>${a.agentId}</td>
            <td>${a.firstName}</td>
            <td>${a.middleName}</td>
            <td>${a.lastName}</td>
            <td>${a.dob}</td>
            <td>${a.heightInInches}</td>
            <td><button onclick="put()">Edit</button></td>
            <td><button onclick="delete()">Delete</button></td>
            </tr>`

    }

    // set the table body to the new html code
    document.getElementById("Customdata").innerHTML = html;

    //https://stackoverflow.com/questions/39958133/how-to-add-data-in-tbody-using-javascript-only
}



addAgentForm.addEventListener("submit", evt => {
    evt.preventDefault();

    const errorMessages = [];

    const firstName = document.getElementById("firstName").value.trim();
    if (firstName.length === 0) {
        errorMessages.push("First name is required.");
    }


    const lastName = document.getElementById("lastName").value.trim();
    if (lastName.length === 0) {
        errorMessages.push("Last name is required.");
    }

    const dob = new Date(document.getElementById("dob").value);
    const curDate = new Date();

    if (isNaN(dob)) {
        errorMessages.push("Date of Birth is required.");
    } else if ( dob > (curDate.setFullYear(curDate.getFullYear() - 12)) ){
        errorMessages.push("Agent must be at least 12 years old.");
    }

    const heightInInches = parseInt(document.getElementById("heightInInches").value);
    if (!(heightInInches >= 36 && heightInInches <= 96)) {
        errorMessages.push("height must be between 36 and 96 inches");
    }

    // check for duplicate agent

    const agentTable = document.getElementById("agentTable");

    for (const tr of agentTable.querySelectorAll("tbody tr")){

        //Extract first and second cell from this row
        //const td0 = tr.querySelector("td:nth-child(1)"); // this is agentId
        const td1 = tr.querySelector("td:nth-child(2)");
        const td2 = tr.querySelector("td:nth-child(3)");
        const td3 = tr.querySelector("td:nth-child(4)");
        const td4 = tr.querySelector("td:nth-child(5)");
        const td5 = tr.querySelector("td:nth-child(6)");

        //If this row has missing cells, skip it
        if(!td1 || !td2 || !td3 || !td4 || !td5) {
              continue;
            }
        if ((td1.innerHTML == firstName)
        && (td2.innerHTML == middleName)
        && (td3.innerHTML == lastName)
        && (td4.innerHTML == dob)
        && (td5.innerHTML == heightInInches)) {

              errorMessages.push(`Match found for ${firstName} and ${lastName}. Insert rejected`);
              return;
            }
          }
          // https://stackoverflow.com/questions/54413159/javascript-catch-and-prevent-duplicate-row-entry-in-html-table
            /*var row = table.insertRow(9);

            var cell1 = row.insertCell(0); // agentId
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            var cell5 = row.insertCell(4);
            var cell6 = row.insertCell(5);

            cell1.innerHTML = id;
            cell2.innerHTML = name;*/


    /*if (a.firstName === firstName
    && a.middleName === middleName
     && a.lastName === lastName
     && a.dob === dob
     && a.heightInInches === heightInInches){
     errorMessages.push("Duplicate agent is not allowed.")
     }*/





    if (errorMessages.length === 0){
       post();
    } else {
        renderErrorMessages(errorMessages);
    }


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
        }).then(json => renderSuccessMessage("<New agent created", json));

}


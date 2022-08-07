
let agents = [];
let editAgentId = 0; // use a global variable to bridge the two functions

function setCurrentView(view) {
    const formContainerElement = document.getElementById('formContainer');
    const listContainerElement = document.getElementById('listContainer');

    switch (view) {
        case 'List' :
            // use style method 
            formContainerElement.style.display = 'none';
            listContainerElement.style.display = 'block';
            break;
        case 'Form' :
            formContainerElement.style.display = 'block';
            listContainerElement.style.display = 'none';
            break;
    }
}

function displayList(){
    setCurrentView('List');
    getAgents()
    .then(data => {
        agents = data; // every time we fetch agent data, we store it globally
        renderList(data);
    });

}

function getAgents (){ // ASYNCHRONOUS method
    return fetch('http://localhost:8080/api/agent') // fetch returns a promise
    .then(response => {
        //console.log(response)); // returns a promise
        return response.json(); // ASYNCHRONOUS returns a promise, this json() method is asynchronous, therefore we need another .then
        // parse the body, treaitng in json format, tell the response to return the objects
    })
}


function handleSubmit(event) {
    event.preventDefault(); // this stops the browser from submitting the form

    const formElement = event.target; //target property is the elemetn event was raised from 
    const formData = new FormData(formElement); //formData is like a map, with all fields

    const agent = {
        firstName: formData.get('firstName'),
        middleName: formData.get('middleName'), // pass in 'name' attribute
        lastName: formData.get('lastName'),
        dob: formData.get('dob'), // ? parseDate(formData.get('dob')) : null ,
        heightInInches: formData.get('heightInInches') ? parseInt(formData.get('heightInInches')) : 0
    };

    // const firstName = document.getElementById('firstName').value;
    // const middleName = document.getElementById('middleName').value;
    // const lastName = document.getElementById('lastName').value;
    // const dob = document.getElementById('dob').value;
    // const heightInInches = document.getElementById('heightInInches').value;

    // const agent = {
    //     firstName,
    //     middleName,
    //     lastName,
    //     dob: dob ? parseDate(dob) : null,
    //     heightInInches: heightInInches ? parseInt(heightInInches) : 0
    // }


    // console.log(agent); // look at object before you send to server.


    if (editAgentId > 0) {
        doPut(agent);
    } else {
        doPost(agent);
    }
    
    
}

function doPost(agent) {

    // objects are collections of key value pairs
    const init = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(agent)

    };

    
    // pass in url, and init
    // fetch is ASYNc, need .then() in response to that request completing
    fetch('http://localhost:8080/api/agent', init)
        .then(response => {
            // we need to determine the status code first
            // want to respond to the correct situation
            // user can give bad data
            // look at controller, what does post mapping return
            if (response.status === 201 || 
                response.status === 500 ||
                response.status === 400 || 
                response.status === 404){
                return response.json();
            } else { // something returned from server we were not expecting
                return Promise.reject(`Unexpected Status Code: ${response.status}`); // pass the error message we want to pass down
            }
        }) 
        .then(data => { //recpient of response.json() when completes
            if (data.agentId) { // does this data have an id
    
                // happy path
                displayList(); // then update the list
                //console.log(data); // check if the post is working up until now
                resetState(); 

                
            } else {
    
                // unhappy path
                renderErrors(data);
                // console.log(data);
            }
        }) 
        .catch(error => console.log(error)); // promise is in rejected state, need to catch it
}

function doPut(agent) {
    agent.agentId = editAgentId;

    // objects are collections of key value pairs
    const init = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(agent)
    };

    fetch(`http://localhost:8080/api/agent/${editAgentId}`, init)
    // go check the controller for http status codes
    // can ignore the 409
    .then(response => {
        if(response.status === 204) {
            return null; // successful update does not return anything, response body
        } else if (response.status === 400 ||
            response.status === 500 ||
            response.status === 400){
            return response.json();
        } else {
            return Promise.reject(`Unexpected Status Code: ${response.status}`);
        }
    })
    .then(data => {
        if (data === null) {
            // happy path
            displayList();
            resetState();

        } else {
            // unhappy path
            renderErrors(data);
        }
    })
    .catch(console.log);

}


function handleAddAgent() {
    setCurrentView('Form');
}

function handleEditAgent(agentId){
    // console.log('Editing Agent Id: ' + agentId) // Step 1: confirm the clicking is working
    
    // we need to find the agent object the user wants to edit
    const agent = agents.find(agent => agent.agentId === agentId) // arrays have find method, pass in predicate, if found a match will return
    console.log(agent); // check to see if you see this agent in console.
    

    // populate the form with the object values after edit button click
    
    document.getElementById('firstName').value = agent.firstName;
    document.getElementById('middleName').value = agent.middleName;
    document.getElementById('lastName').value = agent.lastName;
    document.getElementById('dob').value = agent.dob;
    document.getElementById('heightInInches').value = agent.heightInInches;

    document.getElementById('formHeading').innerText = 'Update Solar Panel';
    // change text on button when you edit an agent
    document.getElementById('formSubmitButton').innerText = 'Update Agent';

    // update the handleSubmit function to send a PUT request to the API
    editAgentId = agentId;
    setCurrentView('Form');
}

function handleDeleteAgent(agentId){
    const agent = agents.find(agent => agent.agentId === agentId) // arrays have find method, pass in predicate, if found a match will return
    
    // alert('')// displays message to user in browser
    // confirm('') // returns a boolean, whether or not user confirms this action

    if (confirm(`Delete the Agent?`)){
        // console.log('Deleting Agent Id: ' + agentId) check that it works
        
        // DELETE {{url}}/6 HTTP/1.1
        const init = {
            method: 'DELETE'
        };

        // pass argument of handleDeleteAgent() here 
        fetch(`http://localhost:8080/api/agent/${agentId}`, init)
            .then(response => { //.then to handle the response
                // check the controller for http status errors
                
                // happy path
                if (response.status === 204){
                    displayList();
                    resetState();
                } else {
                    return Promise.reject(`Unexpected Status Code: ${response.status}`);
                }

            })
            .catch(console.log);
    }
}


function renderErrors(errors) {
    // console.log(errors); check if error are showing

    const errorsHTML = errors.map(error => `<li>${error}</li>`); //enumerates every error element in array
    // console.log(errorsHTML); check if error html format is correct

    const errorsHTMLString = `
        <p>The following errors were found:</p>
        <ul>
            ${errorsHTML.join('')}
        </ul>
    `;
    // pass in empty string to make the join work properly.

    document.getElementById('errors').innerHTML = errorsHTMLString;



}

function resetState() {
    document.getElementById('form').reset();
    document.getElementById('formHeading').innerText = 'Add Agent';
    document.getElementById('formSubmitButton').innerText = 'Add Agent';
    document.getElementById('errors').innerHTML = '';
    editAgentId = 0;
    setCurrentView('List');
}


function renderList(agents){
    // console.log(fieldAgents); // STOP, check that it outputs to fieldAgents to console

    const agentsHTML = agents.map(agent => {
        return `<tr>
        <td>${agent.agentId}</td>
        <td>${agent.firstName}</td>
        <td>${agent.middleName}</td>
        <td>${agent.lastName}</td>
        <td>${agent.dob}</td>
        <td>${agent.heightInInches}</td>
        <td>
            <button onclick="handleEditAgent(${agent.agentId})">Edit</button>
            <button onclick="handleDeleteAgent(${agent.agentId})">Delete</button>
        </td>
        </tr>`
    });

    // to fix injection risks...
    // 1) we can use a templating library ... handlebars
    // 2) we could use React

    const tableBodyElement = document.getElementById('tableRows');
    tableBodyElement.innerHTML = agentsHTML.join(''); // join method on array, joins all elements into 1 concatenated string

}

displayList();

// async await is synctactic sugar, allows to write syntax differntly, otherwise the same, still works with promises etc.

// Live Server is running at http://localhost:5500... this is hosting our website
// 127.0.0.1 is localhost, reserved for this local machine

// API running at http://localhost:8080... this is our API
// we are trying to send a request from a different server from the host
// browsers are restricted to not allow requests from different host IP
// if this WASNT the case, then hackers can use Bank of America API from their website and capture your data.
// its about protecting end users. 

// need to go into Controller and add a new host manually, add a new localhost @CrossOrigin 
// @CrossOrigin(origins = {"http://localhost:3000", ....})
// @CrossOrigin with NO specific origins written in, any website can call this API.
// access to fetch from origin localhost has been blocked by cors, means there is no origin ^^^. 
// put the port number of the client, in the URL NOT THE API 
// fluent API
// when calling fetch, only a network failure will result in exception

// comment from here 
// this bridges the gap>>>> between client and data
// fetch('http://localhost:8080/api/agent') // fetch returns a promise
// .then(response => {
//     //console.log(response)); // returns a promise
//     return response.json(); // returns a promise, this json() method is asynchronous, therefore we need another .then
//     // parse the body, treaitng in json format, tell the response to return the objects
// })
// .then(data => {
//     console.log(data); // returns an array of objects written to the console
//     //console.log(JSON.stringify(data)); // this creates the JSON representation of the array, in a string
//     // JSON.parse() // parses a JSON formatted string into JS objects.

//     const tableBodyElement = document.getElementById('tableRows');

//     const fieldAgentsHTML = data.map(agent => {
//         return `<tr>
//         <td>${agent.agentId}</td>
//         <td>${agent.firstName}</td>
//         <td>${agent.middleName}</td>
//         <td>${agent.lastName}</td>
//         <td>${agent.dob}</td>
//         <td>${agent.heightInInches}</td>
//         <td>
//             <button>Edit</button>
//             <button>Delete</button>
//         </td>
//         </tr>`
//     });

    
//     tableBodyElement.innerHTML = fieldAgentsHTML.join(''); // join method on array, joins all elements into 1 concatenated string


// });
// // .then(json => {
// //     console.log(json); THE RESULT IS NOT JSON
// // });

// comment to here 










function init(){
    getAgents()
    .then(data => renderList(data));

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


    console.log(agent); // look at object before you send to server.

    // TODO POST the data to the API

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
    fetch('"http://localhost:8080/api/agent"', init)
        .then(response => {
            // determine the status code first
            // want to respond to the correct situation
            // user can give bad data
            // look at controller, what does post mapping return
            if (response.status === 201 || 
                response.status === 400 || 
                response.status === 500 ||
                response.status === 404 ||
                response.status === 405){
                return response.json();
            } else { // something returned from server we were not expecting
                return Promise.reject(`Unexpected Status Code: ${response.status}`); // pass the error message we want to pass down
            }
        }) 
        .then(data => { //recpient of response.json() when completes
            if (data.agentId) { // does this data have an id
                // happy path
                console.log(data); // check if the post is working up until now
            } else {
                // unhappy path
                // TODO render error messages
                console.log(data);
            }
        }) 
        .catch(error => console.log(error)); // promise is in rejected state, need to catch it

}


function handleEditAgent(agentId){
    console.log('Editing Agent Id: ' + agentId) // Step 1: confirm the clicking is working
}

function handleDeleteAgent(agentId){
    console.log('Deleting Agent Id: ' + agentId)

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

    const tableBodyElement = document.getElementById('tableRows');
    tableBodyElement.innerHTML = agentsHTML.join(''); // join method on array, joins all elements into 1 concatenated string

}

init();

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










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








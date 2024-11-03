fetch("http://localhost:3000/handleSum", {
    method:"POST",
    headers:{
        "Content-Type":"application/json"
    },
    body:JSON.stringify({counter: 100})
}).then(res => res.json()).then((data) =>{
    console.log(data);
})
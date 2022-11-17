function test(){
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("t").innerHTML = this.responseText;
        }
    };

    // Open connection to server
    xmlhttp.open("GET", "/users", true);
    xmlhttp.send();
}

let carSize = 1;

function new_input(){
    let input = document.createElement("input");
    let new_line = document.createElement("br");
    input.id = "car"+carSize;
    input.name = "car"+carSize;
    input.placeholder = "Car "+(carSize+1);
    document.getElementById("cars").appendChild(input);
    document.getElementById("cars").appendChild(new_line);
    carSize++;
}

function insert_child(){
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("result").innerHTML = "Child inserted!";
            document.getElementById("result").style.color = "green";
        }
    };

    let name = document.getElementById("child_name").value;
    let child_class = document.getElementById("class").value;
    let cars = [];
    for (let i = 0; i < carSize; i++) {
        let car = document.getElementById("car"+i).value;
        cars = [...cars,car];
    }

    carSize = 1;
    
    // Open connection to server
    xmlhttp.open("POST", "/insert-child", true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send(JSON.stringify({name, class: child_class, cars}));
}

function count_class(){
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // console.log(this.responseText);
            let response = JSON.parse(this.responseText);
            document.getElementById("cA").innerHTML = `Left: ${response.leftA}<br>Stay: ${response.stayA}`;
            document.getElementById("cB").innerHTML = `Left: ${response.leftB}<br>Stay: ${response.stayB}`;
        }
    };
    
    // Open connection to server
    xmlhttp.open("GET", "/count-class", true);
    xmlhttp.send(null);
}

function mark_left() {
    let child = event.target.parentNode.id;
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            count_class();
            document.getElementById(child).remove();
            document.getElementById("result").innerText = "The child successfully left :)";
            document.getElementById("result").style.color = "green";
        }
    };
    
    // Open connection to server
    xmlhttp.open("POST", "/mark-left", true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send(JSON.stringify({child}));
}

function search(){
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(this.responseText);
            if (response.hasLeft) {
                document.getElementById("result").innerText = "The child has already left!";
                document.getElementById("result").style.color = "red";
                return;
            }
            let newDiv = document.createElement("div");
            let new_line = document.createElement("br");
            let newChild = document.createElement("span");
            newChild.innerText = response.name;
            let newButton = document.createElement("button");
            newButton.innerText = "MARK AS LEFT";
            newButton.className = "mark";
            newDiv.id = response.ID;
            newButton.setAttribute( "onClick", "javascript: mark_left();" );;
            newDiv.appendChild(newChild);
            newDiv.appendChild(newButton);
            document.getElementById('part'+response.class).appendChild(new_line);
            document.getElementById('part'+response.class).appendChild(newDiv);
        }
        else if (this.status == 400) {
            document.getElementById("result").innerText = "NOT FOUND!";
            document.getElementById("result").style.color = "red";
        }
    };
    
    // Open connection to server
    xmlhttp.open("GET", "/search-child?car="+document.getElementById("car_regis").value, true);
    xmlhttp.send(null);
}
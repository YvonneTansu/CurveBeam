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
    input.id = "car"+carSize;
    input.name = "car"+carSize;
    input.className = "appearance-none w-1/5 mt-1 mb-2 block bg-white text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500";
    input.placeholder = "Car "+(carSize+1);
    document.getElementById("cars").appendChild(input);
    carSize++;
}

function insert_child(){
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("result").innerHTML = `<strong class="font-bold">Child inserted!  </strong>`;
            document.getElementById("result").className = "bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative visible";
            document.getElementById("child_name").value = "";
            document.getElementById("first_class").checked = false;
            document.getElementById("second_class").checked = false;
            document.getElementById("car0").value = "";
            for (let i = 1; i < carSize; i++) {
                let car = document.getElementById("car"+i);
                car.remove();
            }
            carSize = 1;
        }
        else {
            console.log(this.response);
            document.getElementById("result").innerHTML = `<strong class="font-bold">${this.response}  </strong>
            <span class="block sm:inline">Try Again</span>`;
            document.getElementById("result").className = "relative bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded";
        }
    };

    let name = document.getElementById("child_name").value;
    let child_class = document.getElementById("first_class").checked ? "A" : (document.getElementById("second_class").checked ? "B" : "");
    if (!child_class) {
        document.getElementById("result").innerHTML = `<strong class="font-bold">Class not selected!  </strong>
        <span class="block sm:inline">Try Again</span>`;
        document.getElementById("result").className = "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative ";
        
        return;
    }
    console.log(child_class);
    let cars = [];
    for (let i = 0; i < carSize; i++) {
        let car = document.getElementById("car"+i).value;
        cars = [...cars,car];
    }
    
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
            document.getElementById("cA").innerHTML = `<span>Left : ${response.leftA}</span><span class="float-right text-right">Stay : ${response.stayA}</span>`;
            document.getElementById("cA").className ="font-mono";
            document.getElementById("cB").innerHTML = `<span>Left : ${response.leftB}</span><span class="float-right text-right">Stay : ${response.stayB}</span>`;
            document.getElementById("cB").className ="font-mono";
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
            document.getElementById("result").innerHTML = `<strong class="font-bold">The child successfully left :)  </strong>`;
            document.getElementById("result").className = "bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative visible";
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
                document.getElementById("result").innerHTML = `<strong class="font-bold">The child has already left!  </strong>`;
                document.getElementById("result").className = "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative ";
                return;
            }
            else if (document.getElementById(response.ID)) {
                document.getElementById("result").innerHTML = `<strong class="font-bold">The child is in the queue already!  </strong>`;
                document.getElementById("result").className = "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative ";
                return;
            }
            let newDiv = document.createElement("div");
            newDiv.className = "block h-11 relative pl-2 pr-2";
            let newChild = document.createElement("span");
            newChild.className = "font-semibold top-1/4 absolute"
            newChild.innerText = response.name;
            let newButton = document.createElement("button");
            newButton.innerText = "MARK AS LEFT";
            newButton.className = "float-right mt-1 mb-1 appearance-none w-1/3 bg-white text-gray-700 border border-gray-200 rounded py-2 px-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500";
            newDiv.id = response.ID;
            newButton.setAttribute( "onClick", "javascript: mark_left();" );;
            newDiv.appendChild(newChild);
            newDiv.appendChild(newButton);
            document.getElementById('part'+response.class).appendChild(newDiv);
        }
        else if (this.status == 400) {
            document.getElementById("result").innerHTML = `<strong class="font-bold">NOT FOUND!  </strong>
            <span class="block sm:inline">Try Again</span>`;
            document.getElementById("result").className = "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative ";
        }
    };
    
    // Open connection to server
    xmlhttp.open("GET", "/search-child?car="+document.getElementById("car_regis").value, true);
    xmlhttp.send(null);
}
const floorInput = document.getElementById("floorInput").value;
let floorNumber = parseInt(floorInput);
//console.log(floorInput,floorNumber)
const LiftInput = document.getElementById("liftFloor").value;
let LiftNumber = parseInt(LiftInput);
//console.log(LiftInput,LiftNumber)
const liftContainer = document.createElement("div");
const submitButton = document.getElementById("submitButton");
const container = document.getElementById("container");

let floorVal = "";
let liftVal = "";
var prevFloor = 0;

let targetFloors = []; // for storing the click value of buttons

//on Submit button and check for validation
submitButton.addEventListener("click", () => {
  // if (!LiftNumber || !floorNumber) {
  //   alert("Please Enter number to generate Floors and Lifts");
  // }
  if (LiftNumber == 0 || floorNumber == 0) {
    alert("Value can't be zero");
  } else if (LiftNumber < 0 || floorNumber < 0) {
    alert("No negative values are allowed");
  } else {
    container.innerHTML = " ";
    liftContainer.innerHTML = "";
    for (let i = floorNumber; i > 0; i--) {
      // make floors
      createFloors(i, LiftNumber);
    }

    //empty input box
    LiftNumber = "";
    floorNumber = "";
  }
});

let x = 0;

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("up-down")) {
    if (e.target.dataset.floor === x) {
      return;
    } else {
      LiftStatus(e.target.dataset.floor);
    }

    x = e.target.dataset.floor;
  }
});

function LiftStatus(clickedFloor) {
  const lifts = document.querySelectorAll(".lift-div"); // selecting all .liftdiv element

  let position;

  for (let i = 0; i < lifts.length; i++) {
    if (lifts[i].classList.contains("busy")) {
      let onFloorVal = parseInt(lifts[i].getAttribute("onfloor")); // sari busy lift ko onfloor kiya
      if (onFloorVal === clickedFloor) {
        return;
      }
    } else {
      for (let i = 0; i < lifts.length; i++) {
        let onFloorVal = parseInt(lifts[i].getAttribute("onfloor"));

        if (onFloorVal === clickedFloor) {
          MoveLift(clickedFloor, i);
          return;
        }
      }

      position = i;
      MoveLift(clickedFloor, position);
      break;
    }
  }

  if (position === undefined) {
    targetFloors.push(clickedFloor);
  }
}
// for this function i use claude ai for pieces
function MoveLift(clickedFloor, pos) {
  const elevators = document.getElementsByClassName("lift-div");

  const elevator = elevators[pos];

  let currentFloor = elevator.getAttribute("onfloor");
  let duration = Math.abs(parseInt(clickedFloor) - parseInt(currentFloor)) * 2; // for this praticular statement i checked approved code from RDS discord

  elevator.setAttribute("onfloor", clickedFloor);

  elevator.style.transition = `transform ${duration}s linear`;
  elevator.style.transform = `translateY(-${
    100 * parseInt(clickedFloor) - 100
  }px)`;
  elevator.classList.add("busy");

  setTimeout(() => {
    elevator.children[0].style.transform = "translateX(-100%)";
    elevator.children[1].style.transform = "translateX(100%)";
  }, duration * 1000 + 1000);

  setTimeout(() => {
    elevator.children[0].style.transform = "none";
    elevator.children[1].style.transform = "none";
  }, duration * 1000 + 4000);

  setTimeout(() => {
    elevator.classList.remove("busy");

    if (targetFloors.length) {
      MoveLift(targetFloors.shift(), pos);
    }
  }, duration * 1000 + 7000);
}
// create floor and lifts
// tip: draw make 4 floors using html static divs and do css than you have just use js for forLoop, creatediv, give classname.
function createFloors(createFloors, createLifts) {
  const floorDiv = document.createElement("div");

  floorDiv.setAttribute("class", "floordiv");

  const floorContainer = document.createElement("div");
  floorContainer.setAttribute("class", "floor");

  floorContainer.dataset.floor = createFloors;

  const buttonContainer = document.createElement("div");

  buttonContainer.setAttribute("class", "btn-div");

  const UpButton = document.createElement("button");
  const DownButton = document.createElement("button");

  UpButton.setAttribute("class", "up-down");
  DownButton.setAttribute("class", "up-down");

  UpButton.setAttribute("id", createFloors);
  DownButton.setAttribute("id", createFloors);

  UpButton.innerText = "UP";
  DownButton.innerText = "Down";

  UpButton.dataset.floor = createFloors;
  DownButton.dataset.floor = createFloors;

  buttonContainer.append(UpButton);
  buttonContainer.append(DownButton);

  let floorNumber = document.createElement("p");

  floorNumber.setAttribute("class", "floorName");

  floorNumber.innerText = `Floor ${createFloors}`;

  buttonContainer.append(floorNumber);

  floorContainer.append(buttonContainer);

  floorDiv.append(floorContainer);

  container.append(floorDiv);

  //generate Lifts

  for (let j = 0; j < createLifts; j++) {
    //Check all lifts should be on 1st
    if (createFloors === 1) {
      let Lifts = document.createElement("div");
      Lifts.setAttribute("class", "lift-div");

      Lifts.setAttribute("onfloor", 1);

      Lifts.dataset.currentLocation = prevFloor;
      console.log(prevFloor);

      leftDoor = document.createElement("div");
      RightDoor = document.createElement("div");

      leftDoor.setAttribute("class", "left-door");
      RightDoor.setAttribute("class", "right-door");

      Lifts.appendChild(leftDoor);
      Lifts.appendChild(RightDoor);

      liftContainer.appendChild(Lifts);
      liftContainer.setAttribute("class", "lift");

      floorContainer.append(liftContainer);

      floorDiv.append(floorContainer);
    }
  }
}

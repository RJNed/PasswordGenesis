const timeMap= new Map([
  [4, "Instantly"],
  [5, "~4 Hours*"],
  [6, "~2 Weeks*"],
  [7, "~2 Years*"],
  [8, "~164 Years*"],
  [9, "~11 Thousand Years*"],
  [10, "~803 Thousand Years*"],
  [11, "~96 Million Years*"],
  [12, "~3 Billion Years*"],
  [13, "~275 Billion Years*"],
  [14, "~19 Trillion Years*"],
  [15, "~1 Quadrillion Years*"],
  [16, "~94 Quadrillion Years*"],
  [17, "~6 Quintillion Years*"],
  [18, "~463 Quintillion Years*"]
]);

const sliderValue = document.getElementById("passRange");
const output = document.getElementById("userpasslen");

const slider = document.querySelector(".slider");

// Initialize displayed value and CSS custom properties for gradient fill
const updateSliderVars = (element) => {
  element.style.setProperty('--min', element.min);
  element.style.setProperty('--max', element.max);
  element.style.setProperty('--value', element.value);
};


function showError(message){
  document.querySelector(".passdisplay").textContent = message;
  document.querySelector(".passdisplay").style.color = "red";
}

function clearError(){
  document.querySelector(".passdisplay").textContent = "";
  document.querySelector(".passdisplay").style.color = "white";
}

//I'm really happy about this function
//Creates random index based off char length
function randomize(charString){
  const randomValue = new Uint32Array(1);
  randomNum = crypto.getRandomValues(randomValue);
  const scaled = randomNum / (2**32) * charString.length;
  const randomIndex = Math.floor(scaled);
  
  return randomIndex;
}

//Fischer-Yates shuffle for final pasword
function shuffle(array) {
  let remaining = array.length, temp, random;

  while (remaining) {
    // review the --
    random = Math.floor(Math.random() * remaining--);

    temp = array[remaining];
    array[remaining] = array[random];
    array[random] = temp;
  }

  return array;
}

function password(){
  const requiredSpace = 4; //reason is because at least one lowercase, uppercase, number, and special character is required
  const inputValue = Number(slider.value);

  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers   = '0123456789';
  const specials  = '!@#$%^*+=-_.';
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^*+=-_.';


  //Added validation because common issue I saw with other password generators is that if you edited the slider max it would crash the tab or UI.
  if(inputValue<requiredSpace){
    showError("Password must be at least 4 characters long");
    return;
  }
  else if(inputValue>128){
    showError("I'm not sure why you would want a password that long, but if you really want one, you can try again with a shorter password (Max 128 characters)");
    return;
  }
  else{
    clearError();
  }

  //Need to learn when to use let 
  //I know its mutable and const is inmutable
  let buildingarray = [];

  //is this clear enough? should it be a for loop?
  let lower = randomize(lowercase);
  buildingarray.push(lowercase[lower]);

  let upper = randomize(uppercase);
  buildingarray.push(uppercase[upper]);

  let num = randomize(numbers);
  buildingarray.push(numbers[num]);

  let spec = randomize(specials);
  buildingarray.push(specials[spec]);

  const changeColor = document.getElementById("box");
  const changeStrength = document.querySelector(".strength");
  if(inputValue<=6){
    changeStrength.innerText="CRITICALLY WEAK!";
    changeColor.style.backgroundColor="Red";
  }
  else if(inputValue>=7 && inputValue<=9){
    changeStrength.innerText="Potentially Vulnerable";
    changeColor.style.backgroundColor="orange";
  }
  else if(inputValue>=10 && inputValue<=12){
    changeStrength.innerText="Good";
    changeColor.style.backgroundColor="yellow";
  }
  else if(inputValue>=13 && inputValue<=18){
    changeStrength.innerText="Great";
    changeColor.style.backgroundColor="green";
  }
  else{
    changeStrength.innerText="Impressive";
    changeColor.style.backgroundColor="purple";
  }

  if(timeMap.has(inputValue)){
    document.querySelector(".timeToCrack").innerText=timeMap.get(inputValue);
  }
  else if(inputValue<4){
    document.querySelector(".timeToCrack").innerText="Instant"
  }
  else{
    document.querySelector(".timeToCrack").innerText="Off The Charts!"
  }

  //Do I need to initate i here or should I rename it and place it else where?
  let i = 0
  const loopValue = inputValue - requiredSpace;
  //is while okay here? or should it be a for loop?
  while( i<loopValue){
  let char = randomize(chars);
  i++;
  
  buildingarray.push(chars[char]);
  }

  let passwordarray = shuffle(buildingarray);

  document.querySelector(".passdisplay").textContent = passwordarray.join('');
}

// Initialization and event listeners
output.innerHTML = sliderValue.value;
updateSliderVars(sliderValue);

sliderValue.addEventListener('input', (event) => {
  output.innerHTML = event.target.value;
  updateSliderVars(event.target);
});

//revist event listeners
document.querySelector(".userinput").addEventListener("submit", function(event){
  event.preventDefault();
  password();
})
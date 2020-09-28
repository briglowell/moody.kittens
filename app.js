/**
 * Stores the list of kittens
 * @type {Kitten[]}
 */
let kittens = [];
let defaultAffection = 5;
let maxKittens = 5;
/**
 * Called when submitting the new Kitten Form
 * This method will pull data from the form
 * use the provided function to give the data an id
 * you can use robohash for images
 * https://robohash.org/<INSERTCATNAMEHERE>?set=set4
 * then add that data to the kittens list.
 * Then reset the form
 */
function addKitten(event) {
  event.preventDefault()
  let form = event.target

  if(kittens.length >= maxKittens){
    alert("Overrun with Cats!! Need to shoo some away before adding more")
  }
  else if(form.name.value == ""){
    alert("Please enter valid name")
  }
  else if(findKittenByName(form.name.value)){
    alert("Kitten Name Already In Use, Please Select Another")
  }else{
    let kitten = {
      id: generateId(),
      name: form.name.value,
      mood: "Tolerant",
      affection: defaultAffection
    }
    kittens.push(kitten)
    saveKittens()
    form.reset()
    drawKittens()
  }
}


/**
 * Converts the kittens array to a JSON string then
 * Saves the string to localstorage at the key kittens
 */
function saveKittens() {
  window.localStorage.setItem("kittens", JSON.stringify(kittens))
  drawKittens()
}

/**
 * Attempts to retrieve the kittens string from localstorage
 * then parses the JSON string into an array. Finally sets
 * the kittens array to the retrieved array
 */
function loadKittens() {
  let kittensData = JSON.parse(window.localStorage.getItem("kittens"))
  if(kittensData){
    kittens = kittensData
  }
}

/**
 * Draw all of the kittens to the kittens element
 */
function drawKittens() {
  let kittenElement = document.getElementById("kittens")
  let generatedKitten = ""
  loadKittens()

  kittens.forEach(kitten => {generatedKitten +=`
  <div class = "kitten-border bg-dark kitten ${kitten.mood} text-light">
    <img class="kitten" src="https://robohash.org/${kitten.name}?set=set4&size=150x150"></img>
    <div class="d-flex justify-content-center">Name: ${kitten.name}</div>
    <div class="d-flex justify-content-center">Mood: ${kitten.mood}</div>
    <div class="d-flex justify-content-center">Affection: ${kitten.affection}</div>
    <div class="d-flex space-between"></div>
    <button class = "btn-cancel m-1" onclick="pet('${kitten.id}')">Pet Kitty</button>
    <button class = " m-1" onclick="catnip('${kitten.id}')">Catnip</button>
    <div class="d-flex justify-content-center"><i class="action fa fa-trash text-danger" onclick="removeKitten('${kitten.id}')"></i></div>
  </div>
  `})
  kittenElement.innerHTML = generatedKitten
}

/**
 * Find the kitten in the array by its id
 * @param {string} id
 * @return {Kitten}
 */
function findKittenById(id) {
  return kittens.find(k => k.id == id);
}

/**
 * Find the kitten in the array by its name
 * @param {string} id
 * @return {Kitten}
 */
function findKittenByName(name){
  return(kittens.find(k => k.name == name))
}

/**
 * Find the kitten in the array of kittens
 * Generate a random Number
 * if the number is greater than .7
 * increase the kittens affection
 * otherwise decrease the affection
 * save the kittens
 * @param {string} id
 */
function pet(id) {
  let curKitten = findKittenById(id)
  let rand = Math.random()
  if(rand > .7){
    curKitten.affection ++;
  }else{
    curKitten.affection --;
  }
  setKittenMood(curKitten)
  saveKittens()
}

/**
 * Find the kitten in the array of kittens
 * Set the kitten's mood to tolerant
 * Set the kitten's affection to 5
 * save the kittens
 * @param {string} id
 */
function catnip(id) {
  let curKitten = findKittenById(id)
  curKitten.mood = "tolerant"
  curKitten.affection = defaultAffection
  saveKittens()
}

/**
 * Sets the kittens mood based on its affection
 * Happy >= 6, Tolerant <= 5, Angry <= 3, Gone <= 0
 * @param {Kitten} kitten
 */
function setKittenMood(kitten) {
  let curKitten = document.getElementById("kittens")
  curKitten.classList.remove(kitten.mood)

  if(kitten.affection <= 0){
    kitten.mood = "gone"
  }
  else if(kitten.affection <= 3){
    kitten.mood = "angry"
  }
  else if(kitten.affection <= 5){
    kitten.mood = "tolerant"
  }else{
    kitten.mood = "happy"
  }

  curKitten.classList.add(kitten.mood)
  saveKittens()
}

function getStarted() {
  document.getElementById("welcome").remove()
  document.getElementById("add-kitten").classList.remove("hidden")
  if(kittens.length >0){
    document.getElementById("clear-button").classList.remove("hidden")
  }else{
    document.getElementById("clear-button").classList.add("hidden")
  }
  
  drawKittens();
}

function removeKitten(name){
  let index = kittens.findIndex(k => k.name == name)
  kittens.splice(index, 1)
  saveKittens()
}

function clearKittens(){
  kittens = []
  saveKittens()
  location.reload()
}

/**
 * Defines the Properties of a Kitten
 * @typedef {{id: string, name: string, mood: string, affection: number}} Kitten
 */

/**
 * Used to generate a random string id for mocked
 * database generated Id
 * @returns {string}
 */
function generateId() {
  return (
    Math.floor(Math.random() * 10000000) +
    "-" +
    Math.floor(Math.random() * 10000000)
  );
}

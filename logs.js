/* eslint-disable no-use-before-define */
/* eslint-disable max-len */
/* eslint-disable no-undef */

// Init the firebase database
const database = firebase.database();
// Get reference to database to listen for changes
const dbRef = database.ref().child('calculations');

/**
 * Get all the equations from the database
 *
 * @return {firebase object} firebase db reference of all the equations
 */
function getEquations() {
  let equations = [];
  return database.ref().child('calculations').get()
    .then((snapshot) => {
      equations = snapshot.val();
    })
    .then(() => equations);
}
/**
 * Returns HTML formated element of all the equations from the database
 *
 * @param {string} equation string equation to be written to database
 * @param {number} id the id of the equation in the database
 * @return {string} HTML element to be placed in the calculations blog
 */
function renderCalculations() {
  let equationHTML = '';
  getEquations()
    .then((val) => {
      Object.keys(val).reverse().forEach((key) => {
        equationHTML += renderEquation(val[key].equation, key);
      });
    })
    .then(() => {
      // Set HTML
      document.getElementById('calculationPost').innerHTML = equationHTML;
    });
}
/**
 * Clears calculation database
 *
 */
function clearCalcs() {
  firebase.database().ref('calculations').remove().then(() => {
    firebase.database().ref('index').set(0).then(() => {
      document.getElementById('calculationPost').innerHTML = '';
    });
  });
}
/**
 * Delete the oldest calculation
 *
 */
function deleteEq() {
  getEquations()
    .then((val) => {
      // Oldest calculation is the one with the minimum idx so delete that
      const keys = Object.keys(val);
      const minKey = Math.min(...keys);
      firebase.database().ref(`calculations/${minKey}`).remove();
    })
    // Re render calculations
    .then(() => {
      renderCalculations();
    });
}
/**
 * Get the next equation id for placement in the website
 *
 */
function equationId() {
  let eqId = -1;
  return database.ref().child('index').get()
    .then((snapshot) => {
      // If the index is less than 10, next index is current idx + 1
      if (snapshot.val() < 10) {
        eqId = snapshot.val();
        firebase.database().ref('index').set(snapshot.val() + 1);
      // Else, means there are too many calculations -> delete oldest
      } else {
        deleteEq();
        eqId = snapshot.val();
        firebase.database().ref('index').set(snapshot.val() + 1);
      }
    })
    .then(() => eqId);
}
/**
 * Writes calculated equation to database for access
 *
 * @param {string} equation string equation to be written to database
 */
function writeEquation(equation) {
  // Get the next equationId, and place the equation at this index in the db
  equationId().then((val) => {
    firebase.database().ref(`calculations/${val}`).set({
      equation,
    });
  })
    .then(() => {
      renderCalculations();
    });
  // Callback renderCalculations to rerender the previous calculations
}

/**
 * Returns HTML formated element of the equation
 *
 * @param {string} equation string equation to be written to database
 * @param {number} id the id of the equation in the database
 * @return {string} HTML element to be placed in the calculations blog
 */
function renderEquation(equation, id) {
  return `
    <div class="calculation" id="${id}">
      <h1 class="eq">${equation}</h1>
    </div>
  `;
}

dbRef.on('child_added', (snapshot) => {
  renderCalculations();
});

dbRef.on('child_removed', (snapshot) => {
  renderCalculations();
});

// Render calculations in the beginning
renderCalculations();

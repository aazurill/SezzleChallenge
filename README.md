# SezzleChallenge
Sezzle Calculator Webapp

Access at https://sezzle-challenge-89287.web.app/

Calculator webapp. In order to run this webapp, simply visit the website and input valid calculations into the calculator. 
When the values are calculated after you press the "equals" sign, you will see a log of the calculation below under the 
"Previous calculations" header which is ordered descending from most recent to oldest. With each new calculation, the view is
updated immediately through use of Firebase Database listeners which immediately re-render the view after a change is detected
inside the database (if you clear or input another equation). In accordance to the writeup specifications, when there are 10 
equations already logged on previous calculations and a new equation incoming, the oldest input equation is then discarded. 
If you wish to clear the database and all the previous calculations, press the "Clear Button" at the bottom of the website. 

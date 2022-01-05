/*
---To Do List---
1. Add event handler
2. Get input data
3. Add the new item to our data structure
4. Add the new item to the UI
5. Calculate the Budget
6. Update the UI
7. Add event handler for delete button
8. Delete the item from our data structure
9. Delete the item from the UI
10. Re-calculate budget
11. Update the UI 

-----Structuring our code with modules-----
i. UI Module (2, 4, 6)      ii. Data Module (3, 5)      iii. Controller Module (1)
// ***Things to learn in this project***
1. What the module pattern is in JavaScript and how to implement it
2. Private and public data
3. Exposing methods
4. Encapsulation and separation of concerns (and how all data is related to module patttern)
        Data encapsulation allows us to hide the implementation details of a specific module from the oputside scope so that we only expose a public interface which is sometimes called an API.
        Separation of concerns simply means that each part of the application should only be interested in doing only one thing independently.

-----Setting up the first event listeners-----
1. How to set up event listeners for keypress events
2. How to use event object

-----Readinng Input Data-----
1. How to read data fromm different HTML input types

-----Creating an Initialisation-----
1. How and why to create an initialisation function

-----Creating Income and Expense Functions-----
1. How to choose function constructors that meet our application's needs
2. How to set up a proper data structure for our budget controller.

-----Adding a New Item to Our Budget Controller-----
1. How to avoid conflicts in our data structures
2. How and why to pass data from one module to another

-----Adding a New Item to the UI-----
1. A technique for adding big chuncks of HTML into the DOM
2. How to replace parts of strings
3. How to do DOM manipulations using the insertAdjacentHTML method.

-----Clearing Our Input Fields-----
1. How to clear HTML fields
2. How to use querySelectorAll
3. How to convert a list to an array
4. A better way to loop over an array than for loops: foreach

-----Updating the Budget Controller-----
1. How to convert field input to numbers
2. How to prevent false inputs

-----Updating the Budget: Budget Controller-----
1. How and why to create simple reusable functions with only one purpose
2. How to sum all elements of an array usinng the forEach method.

-----Updating the UI Controller-----

-----Event Delegation-----
1. Event bubbling: This means that when an event if triggered on a DOM element, then the same event is triggered on all the parent elements until it reaches the end of the DOM tree -the HTML root. Thus, the event bubbles up inside the DOM tree. The source of this bubbling is called the 'Target Element'.
    i. Event delegation is to NOT set up the event handler on the original element that we're interested in, but to attach it to a parent element to catch the event there because it bubbles up.
        a. Why? *When we have an element with lots of child elements that we're interested in. In such case, the event handler required at all the child elements, is appended to the parent element and then determines which child element the event is fired from.
                *When we want an event handler attached to an element that is not yet in the DOM when our page is loaded.

-----Setting up the Delete Event Listener Using Event Delegation-----
1. How to use event delegation in practice
2. How to use IDs in HTML to connect the UI with data model
3. How to use the parentNode property for DOM traversing

-----Deleting an Item from our Budget Controller-----
1. Yet another method to loop over an array: map
2. How to remove elements from an array using the splice method

-----Deleting an Item from the UI-----
1. More DOM manipulation: how to remove an element from the DOM.

-----Update the Percentages Budget Controller-----
1. How to make our budget controller interact with the Expense prototype.

-----Updating the percentages UI Controller-----
1. How to create our own forEach function but for nodeLists instead of arrays.


-----Formatting Our Budget Numbers String Manipulation-----
1. How to use different String methods to manipulate strings

-----Displaying the Current Month and Year----
1. How to get the current date by using the Date object constructor

-----Finishing Touches: Improving the UX-----
1. How and when to use 'change' events

*/

    //BUDGET CONTROLLER
var budgetController = (function(){
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description,
        this.value = value,
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = ((this.value / totalIncome) * 100).toFixed(2);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    var Income = function(id, description, value){
        this.id = id;
        this.description = description,
        this.value = value;
    };

    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        });

        data.totals[type] = sum;
    };

    
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function(type, des, val){
            var newItem, ID;
            
            //ID = last ID + 1
            // Create new ID
            if (data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length -1].id + 1
            } else {
                ID = 0;
            }
            
            
            // Create new item based on inc or exp type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            //Push it into our data structure 
            data.allItems[type].push(newItem);

            // Return the new element
            return newItem;
            
        },

        deleteItem: function(type, id){
            var ids, index;
            //id = 6
            //data.allItems[type]
            // ids = [1 2 4 6 8]
            //index = 3

            ids = data.allItems[type].map(function(current){
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1){
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function(){
            // 1. Calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // 2. Calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // 3. Calculate the percentage of the income spent
            if (data.totals.inc > 0) {
                data.percentage = ((data.totals.exp / data.totals.inc) * 100).toFixed(2);
            } else {
                data.percentage = -1;
            }
        },

        calculatePercentages: function() {
            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();
            });
            return allPerc;
        },

        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },

        testing: function(){
            console.log(data);
        }
    };
})();

    //UI CONTROLLER
var UIController = (function(){
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    var formatNumber = function(num, type) {
        var numSplit, int, dec, sign, intSplit, intSec;

        /* Rules:
        1. + or - before number
        2. Exactly 2 decimal points 
        3. Comma separating the thousands
        */ 

        num = Math.abs(num); 
        // This would return the number alone without regards to its +/-
        num = num.toFixed(2);
        // This would return the number with the specified number of decimal places

        numSplit = num.split('.');

        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
            intSplit = int.split(',');
            intSec = intSplit[0]
            if (intSec.length > 3) {
                int = intSec.substr(0, intSec.length -3) + ',' + intSec.substr(intSec.length -3, 3) + ',' + intSplit[1];
            }
        }    
    
        dec = numSplit[1];

        type === 'exp' ? sign = '-' : sign = '+';

        return sign  + int + '.' + dec;
    };

    var nodeListforEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    return {

        getInput: function(){
            return {
                type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
                description:  document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },

        addListItem: function(obj, type) {
            var html, newHtml, element;
            // Create HTML string with placeholder texts

            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn">X</i></button></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value"> %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn">X</button></div></div></div>'
            }
            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', (obj.description).toUpperCase());
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function(selectorID){
            var el = document.getElementById(selectorID)
            el.parentNode.removeChild(el);
        },

        clearFields: function(){
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', '+ DOMstrings.inputValue);

            var fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array){
                current.value = "";
            });

            fieldsArr[0].focus();
        },

        displayBudget:function(obj){
            var type;
            obj.budget > 0 ? type = 'inc': type = 'exp';

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            
            
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '--';
            }
        },

        displayPercentages: function(percentages) {
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
            // This returns a 'nodeList'.

            nodeListforEach(fields, function(current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
        },

        displayMonth: function() {
            var now, year, month, months, day, monthName;
            
            now = new Date();

            day = now.getDate();

            months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            
            month = now.getMonth();
            
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = day + ' ' + months[month] + ' ' + year;
        },

        changedType: function() {
            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue
            );

            nodeListforEach(fields, function(cur) {
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        },
        
        getDOMstrings: function(){
            return DOMstrings;
        }
    }
})();


    //GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){
    var setupEventListeners = function(){
        var DOM =  UICtrl.getDOMstrings();    
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event){
            if (event.keyCode === 13 || event.which === 13) {
                console.log('ENTER was pressed sire');
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change',UICtrl.changedType);

    };

    var updateBudget = function(){
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function() {
        // 1. Calculate percentages
        budgetCtrl.calculatePercentages();

        // 2. Read percentages from the budget controller
        var percentages = budgetCtrl.getPercentages();

        // 3. Update UI with the new percentages
        UICtrl.displayPercentages(percentages);
    };

    var ctrlAddItem = function(){
        var input, newItem;
        // 1. Get the field input data
        input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear the fields
            UICtrl.clearFields();

            // 5. Calculate and update budget
            updateBudget();

            // 6. Calculate and update percentages
            updatePercentages();
        };
    };

    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;
        
        itemID = event.target.parentNode.parentNode.parentNode.id;

        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);

            // 2. delete the item from the UI
            UICtrl.deleteListItem(itemID);

            // 3. Update and show the new budget
            updateBudget();

            // 4. Calculate and update percentages
            updatePercentages();
        }
    }
    
    return {
        init: function(){
            console.log('Aniks-sama! Application has started!');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };
})(budgetController, UIController);

controller.init();
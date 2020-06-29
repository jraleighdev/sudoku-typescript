import { InputElement } from './inputElement';
import { ElementGroup } from './elementGroup';
import { stringIsNullEmpty } from "./helpers";

// set properties for sudoku boxes
const rulesBtn: HTMLButtonElement = document.getElementById('rules-btn') as HTMLButtonElement;
const closeBtn: HTMLButtonElement = document.getElementById('close-btn') as HTMLButtonElement;
const rules: HTMLElement = document.getElementById('rules') as HTMLElement;
const sudokuInputs: HTMLCollectionOf<HTMLInputElement> = document.getElementsByClassName('sudoku-input') as HTMLCollectionOf<HTMLInputElement>;
const sudokuArray: InputElement[] = [];
const solveButton: HTMLButtonElement = document.getElementById('solve-button') as HTMLButtonElement;
const clearButton: HTMLButtonElement = document.getElementById('clear-button') as HTMLButtonElement;

let columns: Array<ElementGroup> = []; 
let rows: Array<ElementGroup> = []; 
let boxes: Array<ElementGroup> = []; 

// let backTracking: boolean = false;
let counter: number = 0;
let element: number = 1;
let group: number = 1;

// assign ids and text values to text boxes
let assignBoxes = () => {

    // loop through each sudoku input
    for (let i = 0; i < sudokuInputs.length; i++) {

        // get the input to work on
        const s = sudokuInputs[i];

        // get the group number by taking the current value of i + 1 and divide by 9
        const gNumber = Math.ceil((i + 1) / 9);

        // if group number is larger than the current value of group then 
        // set the group to the new group number
        // reset the element number
        if (gNumber > group) {
            group = gNumber;
            element = 1;
        }
        
        // get the row number
        const row = getRowNumber(element, group);

        // get the column number
        const col = getColumnNumber(element, group);
    
        // assign the id of input control specifying elemenetn number
        // row number, column number, and group number
        s.id = `${element}@${row}@${col}@${group}`;

        // set the input type to text
        s.type = 'text';

        // set the max lenght of the box to 1;
        s.maxLength = 1;

        // only allow values 1 to 9 in the box
        s.oninput = () => {
            s.value = s.value.replace(/[^1-9]/g,'');
        };

        // increment the element counter
        element++;

        // add the input elemnt to array of element groups
        sudokuArray.push(new InputElement(s));
    }   

    // assign each column to a column group
    for (let i = 1; i < 10; i++) {
        columns.push(new ElementGroup(i,sudokuArray.filter(x => x.c === i)));
    }

    // assign each row to to row group
    for (let i = 1; i < 10; i++) {
        rows.push(new ElementGroup(i, sudokuArray.filter(x => x.r === i)));
    }

    // assign each group to a group box
    for (let i = 1; i < 10; i++) {
        boxes.push(new ElementGroup(i, sudokuArray.filter(x => x.g === i)));
    }


    sudokuArray.forEach(x => 
        { 
            x.e.addEventListener('click', () => {
                sudokuArray.forEach(y => {
                    // if (y.c != x.c && y.r != x.r && y.g != x.g && y.i != x.i) {
                        if (y.c == x.c || y.r == x.r || y.g == x.g ) {
                            y.e.classList.add('sudoku-input-group-hight-light');
                        } else {
                            y.e.classList.remove('sudoku-input-group-hight-light');
                        }
                    // }
                });
            });

            x.e.addEventListener('keyup', () => {
                sudokuArray.forEach(x => {
                    x.e.classList.remove('sudoku-input-invalid');
                });
                checkColumns();
                checkRows();
                checkBoxes();
            })
        }
    )
}

// gets the row number for the item
let getRowNumber = (e: number, g: number): number => {

    // seta variable to store the value
    let row = 0;

    // takes the location of the group number and element to assign a 
    // row number 
    if (g > 0 && g < 4) {
        if (e > 0 && e < 4) {
            row = 1;
        } else if (e > 3 && e < 7) {
            row = 2;
        } else if (e > 6) {
            row = 3;
        }
    } else if (g > 3 && g < 7) {
        if (e > 0 && e < 4) {
            row = 4;
        } else if (e > 3 && e < 7) {
            row = 5;
        } else if (e > 6) {
            row = 6;
        }
    }   else if (g > 6) {
        if (e > 0 && e < 4) {
            row = 7;
        } else if (e > 3 && e < 7) {
            row = 8;
        } else if (e > 6) {
            row = 9;
        }
    }
    
    // return the row number
    return row;
} 

// get the column number
let getColumnNumber = (e: number, g: number): number => {

    // assign a variable to hold the group number
    let column = 0;

    // takes the location of the group number and element to assign a 
    // column number 

    if (g === 1 || g === 4 || g === 7) {
        if (e === 1 || e === 4 || e === 7) {
            column = 1;
        } else if (e === 2 || e === 5 || e === 8) {
            column = 2;
        } else if (e === 3 || e === 6 || e === 9) {
            column = 3;
        }
    } else if (g === 2 || g === 5 || g === 8) {
        if (e === 1 || e === 4 || e === 7) {
            column = 4;
        } else if (e === 2 || e === 5 || e === 8) {
            column = 5;
        } else if (e === 3 || e === 6 || e === 9) {
            column = 6;
        }
    }   else if (g === 3 || g === 6 || g === 9) {
        if (e === 1 || e === 4 || e === 7) {
            column = 7;
        } else if (e === 2 || e === 5 || e === 8) {
            column = 8;
        } else if (e === 3 || e === 6 || e === 9) {
            column = 9;
        }
    } 
    
    // return the column number
    return column;
}

// checks the columns and sees if we have any clashes
let checkColumns = (): boolean => {

    // set a variable to store the value
    let noClash = true;
    
    // loop through each column and check
    columns.forEach(column => {
        
        // create an array to store the values we are checking against
        let values: string[] = [];

        // loop through the input in each column
        for (var i = 0; i < column.collection.length; i++) {

            // assign the current input
            const input = column.collection[i];

            // if i is 0 then check if the box is empty it no push in to values
            if (i === 0) {
                if (!stringIsNullEmpty(input.getValue())) {
                    values.push(input.getValue());
                }
            // if i is greater than 0 check if the input is empty
            } else {
                if (!stringIsNullEmpty(input.getValue())) {

                    // if the value matches any of the items stored in the array
                    // then we have a clash
                    if (values.some(x => x === input.getValue())) {

                        // set noclash to false
                        noClash = false;

                        // add a class to the input to inform the user that the input is invalid
                        input.e.classList.add('sudoku-input-invalid');
                    }

                    // push the values
                    values.push(input.getValue());
                }
            }
        }
        
    }); 

    // return the value
    return noClash;
}

// checks the rows and sees if we have any clashes
let checkRows = (): boolean => {

    // set a variable to store the value
    let noClash = true;

    // loop through each row and check
    rows.forEach(row => {
        
        // create an array to store the values we are checking against
        let values: string[] = [];

        // loop through the input in each column
        for (var i = 0; i < row.collection.length; i++) {

            // assign the current input
            const input = row.collection[i];

            // if i is 0 then check if the box is empty it no push in to values
            if (i === 0) {
                if (!stringIsNullEmpty(input.getValue())) {
                    values.push(input.getValue());
                }
            // if i is greater than 0 check if the input is empty
            } else {
                if (!stringIsNullEmpty(input.getValue())) {

                    // if the value matches any of the items stored in the array
                    // then we have a clash
                    if (values.some(x => x === input.getValue())) {

                        // set noclash to false
                        noClash = false;

                        // add a class to the input to inform the user that the input is invalid
                        input.e.classList.add('sudoku-input-invalid');
                    }

                    // push the values
                    values.push(input.getValue());
                }
            }
        }
        
    }); 

    // return the value
    return noClash;
}

// checks the boxes and sees if we have any clashes
let checkBoxes = (): boolean => {

    // set a variable to store the value
    let noClash = true;

    // loop through each box and check
    boxes.forEach(box => {
        
        // create an array to store the values we are checking against
        let values: string[] = [];

        // loop through the input in each column
        for (var i = 0; i < box.collection.length; i++) {

            // assign the current input
            const input = box.collection[i];

            // if i is 0 then check if the box is empty it no push in to values
            if (i === 0) {
                if (!stringIsNullEmpty(input.getValue())) {
                    values.push(input.getValue());
                }
            // if i is greater than 0 check if the input is empty
            } else { //
                if (!stringIsNullEmpty(input.getValue())) {

                    // if the value matches any of the items stored in the array
                    // then we have a clash
                    if (values.some(x => x === input.getValue())) {

                        // set noclash to false
                        noClash = false;

                        // add a class to the input to inform the user that the input is invalid
                        input.e.classList.add('sudoku-input-invalid');
                    }

                    // push the values
                    values.push(input.getValue());
                }
            }
        }
        
    }); 

    // return the value
    return noClash;
}


// look through an invidual column based on the given index
let checkColumn = (index: number): boolean => {

    // set a variable to store the value
    let noClash = true;

    // get the column that matches the index
    let column = columns.find(x => x.index == index) as ElementGroup;

    // create an array to store the values we are checking against
    let numbers: string[] = [];

    // loop through the input for the column
    for (let i = 0; i < column.collection.length; i++) {

        // get the value of the current input
        const value = column.collection[i].getValue();

        // if i is 0 then check if the box is empty it no push in to values
        if (i === 0) {
            if (!stringIsNullEmpty(value)) {
                numbers.push(value);
            } 
        // if i is greater than 0 check if the input is empty
        } else {
            if (!stringIsNullEmpty(value)) {

                // if the value matches any of the items stored in the array
                // then we have a clash
                if (numbers.some(x => x === value)) {

                    // set noclash to false
                    noClash = false
                }

                // push the values
                numbers.push(value);
            }
        }
    }

    // return the value
    return noClash;
}

// look through an invidual row based on the given index
let checkRow = (index: number): boolean => {

    // set a variable to store the value
    let noClash = true;

    // get the column that matches the index
    let row = rows.find(x => x.index == index) as ElementGroup;

    // create an array to store the values we are checking against
    let numbers: string[] = [];

    // loop through the input for the column
    for (let i = 0; i < row.collection.length; i++) {

        // get the value of the current input
        const value = row.collection[i].getValue();

        // if i is 0 then check if the box is empty it no push in to values
        if (i === 0) {
            if (!stringIsNullEmpty(value)) {
                numbers.push(value);
            } 
        // if i is greater than 0 check if the input is empty
        } else {
            if (!stringIsNullEmpty(value)) {

                // if the value matches any of the items stored in the array
                // then we have a clash
                if (numbers.some(x => x === value)) {

                    // set noclash to false
                    noClash = false
                }
//
                // push the values
                numbers.push(value);
            }
        }
    }

    // return the value
    return noClash;
}

// look through an invidual box based on the given column and row
let checkBox = (col: number, row: number): boolean => {

    // set a variable to store the value
    let noClash = true;

    // get the element that matches the column and row intersection
    let element = grid(col, row);

    // assign the box by taking the inputs group number 
    let box = boxes.find(x => x.index == element.g) as ElementGroup;

    // create an array to store the values we are checking against
    let numbers: string[] = [];

    // loop through the input for the column
    for (let i = 0; i < box.collection.length; i++) {

        // get the value of the current input
        const value = box.collection[i].getValue();

        // if i is 0 then check if the box is empty it no push in to values
        if (i === 0) {
            if (!stringIsNullEmpty(value)) {
                numbers.push(value);
            }
        // if i is greater than 0 check if the input is empty
        }  else {
            if (!stringIsNullEmpty(value)) {

                // if the value matches any of the items stored in the array
                // then we have a clash
                if (numbers.some(x => x === value)) {

                    // set noclash to false
                    noClash = false
                }

                // push the values
                numbers.push(value);
            }
        }
    }

    // return the value
    return noClash;
}

// recursively look through the grid and solve the puzzle
let backTrack = (col: number, row: number): boolean => {

    // assign a variable to store the number we are trying to use on the current input
    let number = 1;

    // if the current empyt is emtpy then
    if (stringIsNullEmpty(grid(col, row).getValue())) {

        // while the number is less than 10
        while (number < 10) {

            // set the value of the input to current value of number
            grid(col, row).setValue(number.toString());

            // row, column, and box contain no clashes
            if (checkRow(row)) {
                if (checkColumn(col)) {
                    if (checkBox(col, row)) {

                        // increment the row
                        row++;

                        // if the row is greate than 9 then reset 
                        // row and increment column
                        if (row > 9) {

                            // set row to 1
                            row = 1;

                            // increment column
                            col++;

                            // if the column is greate than nine 
                            // then all columns have been assigned
                            if (col > 9) return true; 
                        }

                        // if backtrack returns then the column set is complete
                        if (backTrack(col, row)) return true;

                        // if the column could not be set then 
                        // decrement the row and set the next column
                        row--;

                        // if the row is number 1
                        if (row < 1) {
                            // set row value back to 9
                            row = 9;

                            // and decrement the column value
                            col--;
                        }
                    }
                }
            }

            // increment the counter
            counter++;

            // if the counter exceeds 40000 
            // then stop the program
            if (counter > 1000000) {
                alert('I can\'t solve this one');
                throw new Error('Tries exceeded 400000');
            }

            // increment the number
            number++;
        }

        // the value of the input is invalid 
        // set to an empyt string
        grid(col, row).setValue('');

        // return false
        return false;
    // the input contains a value
    } else {
        
        // increment the row
        row++;

        // if the row exceeds 9
        if (row > 9) {

            // set row back 1
            row = 1;

            // increment the column
            col++;

            // if column is greater than 9
            // thend column and row are set
            if (col > 9) return true;
        }

        // increment the counter
        counter++;

        // check the current element
        return backTrack(col, row);
    }
}

// looks through the grid and finds the element with the
// intersectiong column and row number
let grid = (col: number, row: number): InputElement => {

    // find the intersecting element
    const element = sudokuArray.find(x => x.c === col && x.r === row) as InputElement;

    // if the element is null then log it
    if (!element) {
        console.log(`element is null from column ${col} row ${row}`);
    }

    // return the element
    return element;
}
//
// assign the boxes
assignBoxes();

// solve the puzzle
let solve = (): void => {

    // remove all the validation classes
    sudokuArray.forEach(x => {
        x.e.classList.remove('sudoku-input-column-invalid');
        x.e.classList.remove('sudoku-input-row-invalid')
        x.e.classList.remove('sudoku-input-group-invalid');
    });
    
    // if any of columns have confliting arguments then highligh them
    if (!checkColumns()) {
        alert('Cannot continue with confliting columns');
        return;
    }

    // if any of the rows have confliting arguments the highlight them
    if (!checkRows()) {
        alert('Cannot continue with confliting rows');
        return;
    }
    
    // if the any of the columns have conflicting arguments the hight light them
    if (!checkBoxes()) {
        alert('Cannot continue with confliting boxes');
        return;
    }

    // start backing tracking at the first column and row
    backTrack(1, 1);
}

// event listeners
solveButton.addEventListener('click', () => {
    solve();
});

// event listeners
clearButton.addEventListener('click', () => {
    sudokuArray.forEach(x => x.setValue(''));
});

// event listeners
rulesBtn.addEventListener('click', () => rules.classList.add('show'));
closeBtn.addEventListener('click', () => rules.classList.remove('show'));

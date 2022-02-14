// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

let categories = [];
const $thead = $('#thead');
const $tbody = $('#tbody');


/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
    const catID = [];
    //gets random 20 questions from jeopardy api 
    const res = await axios.get('http://jservice.io/api/random?count=20')
    //iterate through to get category ids
    for (let i = 0; i < 6; i++) {
        //push category ids to catID empty array
        catID.push(res.data[i].category_id);
    }
    return catID;
}




/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */



async function getCategory(id) {
    const cluesArr = [];
    //get a category from jeopardy api with a id
    const res = await axios.get(`http://jservice.io/api/category?id=${id}`);
    //iterate through the response 
    for (let i = 0; i < 5; i++) {
        //get the question, answer, show:null then push the object to cluesArr 
        cluesArr.push({ question: res.data.clues[i].question, answer: res.data.clues[i].answer, showing: null })
    }
    return {
        title: res.data.title, clues: cluesArr
    }
}



/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
    // returns array of random cateogry ids
    const randomIds = await getCategoryIds();

    const $top = $('<tr>');

    // create rows for table body
    for (let i = 0; i < 5; i++) {
        //give each row an id
        let row = $('<tr>').attr("id", `r${i}`);
        //add row to table body
        $tbody.append(row)
    }


    //iterate through randomId array
    for (let i = 0; i < randomIds.length; i++) {
        //get category object from getCategory()
        const currCategory = await getCategory(randomIds[i]);
        //push the category object to categories
        categories.push(currCategory);
        //add each title to the top row
        $top.append($('<td>').text(categories[i].title));

        //iterate through clues
        for (let j = 0; j < currCategory.clues.length; j++) {
            //get current row
            let currRow = $(`#r${j}`);
            //get questions, clues, showing:null
            let currClue = currCategory.clues[j].question;
            let currAnswer = currCategory.clues[j].answer;
            let show = currCategory.clues[j].showing;
            //add id to each td, set data, then append to current row
            currRow.append($('<td>').attr('id', `${j}-${i}`).text('?').data('question', currClue).data('answer', currAnswer).data('showing', show))
        }

    }
    //append top table row to table head, set id to columnTop
    $thead.append($top.attr('id', 'columnTop'));

    //add event listener on table data
    const $table = $('tbody td');
    $table.on('click', handleClick);

}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
    //get id of evt.target
    const $id = $(this).attr('id');
    //get showing value
    const $showing = $(`#${$id}`).data('showing');
    //if showing value is null, show answer & set showing to 'question'
    if ($showing === null) {
        const $question = $(`#${$id}`).data('question');
        $(`#${$id}`).text($question);
        $(`#${$id}`).data('showing', 'question');

        //else show answer & set showing to 'answer'
    } else {
        const $answer = $(`#${$id}`).data('answer');
        $(`#${$id}`).text($answer);
        $(`#${$id}`).data('showing', 'answer');
    }
}

//add event listener on start game button

$('#startGame').on('click', setupAndStart);


/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {
    //clear jeopardy board
    $thead.html('');
    $tbody.html('');

    //add loading spinner & change text

    $('#spin').addClass('spin');
    $('button').text("Loading");

    //call hideLoadingView after 1 second
    setTimeout(hideLoadingView, 1000)
}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {

    //remove loading spinner & change text
    $('#spin').removeClass('spin');
    $('button').text("Restart");

    fillTable();
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

function setupAndStart() {
    //clear categories
    categories = []
    showLoadingView();
}


/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO
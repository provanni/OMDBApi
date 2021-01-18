$(document).ready(() => {
    $('#searchBar').on('submit', (e) => {
        let searchText = $('#searchText').val();
        getMovies(searchText);
        e.preventDefault();
    });
});

var nominees = [];
var outputText = {};


function getMovies(searchText) {
    axios.get('http://www.omdbapi.com/?type=movie&s=' + searchText + '&apikey=6cfa6be').then((response) => {
        let movies = response.data.Search;
        let output = '';
        $.each(movies, (index, movie) => {
            output += `
                <p>
                    <strong>Title: </strong> ${movie.Title} <br>
                    <strong>Year Released: </strong> ${movie.Year} <br>
                    <button id='${movie.imdbID}' class="nominee" onclick="addNominee('${movie.imdbID}')">Nominate!</button> <hr>
                </p>
        `;
        })
        $('#result').html(output);

    }).catch((err) => {
        console.log(err);
    });
}

function getId() {
    $(".container").click(function (event) {
        let id = $(this).attr("id");
        removeNominee(id);
    });
}


//var output = "";

function removeNominee(id) {

    $("button#" + id).attr('disabled', false);
    $('#dialog').hide();

    for (let i = 0; i < nominees.length; i++) {

        if (nominees[i] == id) {
            inArray = true;
            break;
        } else {
            inArray = false;
        }

    }


    if (inArray) {
        //remove from html
        $("div#" + id).remove();

        //remove from nominees array
        let index = nominees.indexOf(id);
        nominees.splice(index, 1);
    }


}



var inArray = false;

function loadNominees(imdbId) {

    axios.get('http://www.omdbapi.com/?i=' + imdbId + '&apikey=6cfa6be').then((response) => {

        let movie = response.data;
        let nomineeElem = '';
        nomineeElem = `
            <div id='${movie.imdbID}' class="container">
                <p>
                    <strong>Title: </strong> ${movie.Title} <br>
                    <strong>Year Released: </strong> ${movie.Year} <br>
                    <button id="remove" onclick="getId()">Remove</button> <hr>
                </p>
            </div>
        `;
        //removeNominee(${movie.imdbID})
        outputText[imdbId] = nomineeElem;
        $('#nominees').append(nomineeElem);



        if (nominees.length > 4) {
            //$('.nominee').attr('disabled', true);
            $('#dialog').show();
        }


    }).catch((err) => {
        console.log(err);
    });
}


function addNominee(imdbId) {

    if (nominees.length > 4) {
        alert("You must remove a nominee before adding another.");
    } else {

        $.each(nominees, (index, nominee) => {
            if (nominee == imdbId) {
                inArray = true;
            } else {
                inArray = false;
            }
        });

        if (inArray = true) {
            $("button#" + imdbId).attr('disabled', true);
        }

        loadNominees(imdbId);
        nominees.push(imdbId);

        $.each(nominees, (index, nominee) => {
            //console.log(index + ": " + nominee);
        });
    }

}

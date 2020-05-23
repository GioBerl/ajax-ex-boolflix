$(document).ready(function () {
    $("#search-button").click(function () {
        sendRequest();
        clearInput();
    });

    $("input#search-text").keyup(function (event) {
        if (event.key == "Enter") {
            sendRequest();
            clearInput();
        }
    });

    function clearInput() {
        $("input#search-text").val("");
    }

    function clearMain() {
        $(".card-list").html("");
    }

    function sendRequest() {
        //mi assicuro che ci sia scritto qualcosa nell'input
        if (!$("input#search-text").val()) {
            alert("inserisci almeno un carattere per la ricerca");
        } else {
            //pulisco il main nel caso avessi gia' effettuato una richiesta
            clearMain();
            //leggo il valore dell'input e lo uso nella query della request
            var film = $("input#search-text").val();
            $.ajax({
                method: "GET",
                url: "https://api.themoviedb.org/3/search/movie",
                data: {
                    api_key: "da57a6e390d49d195b53f218c7690a55",
                    query: film,
                    language: "it",
                },
                success: function (response) {
                    // salvo l'array di dati di ritorno
                    var results = response.results; //[{...},{...},{...}...]
                    //passo i risultati alla funzione cicleAndPrint che si occupa di ciclare l'array e stampare le singole liste
                    cicleAndPrint(results);
                },
                error: function () {
                    alert("errore");
                },
            });
        }
    }

    function cicleAndPrint(risultati) {
        risultati.forEach(function (infos) {
            var title = infos.title;
            var orTitle = infos.original_title;
            var orLanguage = infos.original_language;
            var averageVote = infos.vote_average;
            if (title == orTitle) {
                //metto un segno a orTitle per indicare che e' uguale a title
                orTitle = `"`;
            }
            $(".card-list").append(`
            <ul class="single-list">
                <li>${title}</li>
                <li>${orTitle}</li>
                <li>${orLanguage}</li>
                <li>${averageVote}</li>
            </ul>`);
        });
    }
});

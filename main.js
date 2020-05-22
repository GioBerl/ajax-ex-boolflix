$(document).ready(function () {
    $("#search-button").click(function () {
        //mi assicuro che ci sia scritto qualcosa nell'input
        if (!$("input#search-text").val()) {
            alert("inserisci almeno un carattere per la ricerca");
        } else {
            //pulisco il main nel caso avessi gia' effettuato una richiesta
            $(".card-list").html("");
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
                    //passo i risultati alla funzione cicleAndPrint che si occupa di ciclare l'array e stampare le liste singole liste
                    cicleAndPrint(results);
                },
                error: function () {
                    alert("errore");
                },
            });
        }
    });

    function cicleAndPrint(risultati) {
        risultati.forEach(function (info) {
            var title = info.title;
            var orTitle = info.original_title;
            var orLanguage = info.original_language;
            var averageVote = info.vote_average;
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

    function isEqual() {}
});

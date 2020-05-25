$(document).ready(function () {
    var source = $("#card-template").html();
    var templateFunc = Handlebars.compile(source);
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
        if ($("input#search-text").val().trim()) {
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
                    // inserisco il testo cercato dall'utente nel titolo della pagina
                    $("#ricerca-utente").text(film);
                    // visualizzo il titolo della pagina
                    $(".title-search").addClass("visible");
                    // salvo l'array di dati di ritorno
                    var results = response.results; //[{...},{...},{...}...]
                    //passo i risultati alla funzione cicleAndPrint che si occupa di ciclare l'array e stampare le singole liste
                    cicleAndPrint(results);
                },
                error: function () {
                    alert("errore");
                },
            });
        } else {
            alert("inserisci almeno un carattere");
        }
    }

    function cicleAndPrint(risultati) {
        //preparo i dati per il template
        risultati.forEach(function (infos) {
            //recupero i dati di ogni elemento dell'array
            var context = {
                title: infos.title,
                orTitle: infos.original_title,
                orLanguage: infos.original_language,
                averageVote: infos.vote_average,
            };
            if (context.title == context.orTitle) {
                //metto un segno a orTitle per indicare che e' uguale a title
                context.orTitle = `"`;
            }
            //li compilo
            var htmlCard = templateFunc(context);
            //e li aggiungo al main
            $(".card-list").append(htmlCard);
        });
    }
});

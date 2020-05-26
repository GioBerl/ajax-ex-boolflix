$(document).ready(function () {
    var source = $("#card-template").html();
    var templateFunc = Handlebars.compile(source);
    $("#search-button").click(function () {
        sendRequest();
        sendRequestTv();
        clearInput();
    });

    $("input#search-text").keyup(function (event) {
        if (event.key == "Enter") {
            sendRequest();
            sendRequestTv();
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
            // nascondo il titolo della pagina
            $(".title-search").removeClass("visible");
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

    function sendRequestTv() {
        //mi assicuro che ci sia scritto qualcosa nell'input
        if ($("input#search-text").val().trim()) {
            // //pulisco il main nel caso avessi gia' effettuato una richiesta
            // clearMain();
            // // nascondo il titolo della pagina
            // $(".title-search").removeClass("visible");
            //leggo il valore dell'input e lo uso nella query della request
            var tv = $("input#search-text").val();
            $.ajax({
                method: "GET",
                url: "https://api.themoviedb.org/3/search/tv",
                data: {
                    api_key: "da57a6e390d49d195b53f218c7690a55",
                    query: tv,
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
        } else {
            alert("inserisci almeno un carattere");
        }
    }

    function cicleAndPrint(risultati) {
        //preparo i dati per il template
        risultati.forEach(function (infos) {
            //recupero i dati di ogni elemento dell'array
            var context = {
                title: infos.title ? infos.title : infos.name,
                orTitle: infos.original_title
                    ? infos.original_title
                    : infos.original_name,

                // orLanguage: infos.original_language,
                orLanguage: createFlag(infos.original_language),
                averageVote: infos.vote_average,
                stars: createStars(infos.vote_average),
            };

            //se i due titoli sono uguali metto un segno a orTitle per indicare che e' uguale a title
            if (context.title == context.orTitle) {
                context.orTitle = `"`;
            }
            //compilo il tutto
            var htmlCard = templateFunc(context);
            //e li aggiungo al main
            $(".card-list").append(htmlCard);
        });
    }

    function createFlag(lang) {
        //costruisco una lista di linguaggi preimpostati corrispondenti alle immagini
        var langList = ["it", "en", "fr", "de"];
        // controllo se la lingua del film e' presente in questa lista
        //prova uso ternary operator
        var imgFlag = langList.includes(lang)
            ? `<img src="img/flag_${lang}.png" />`
            : lang;
        // sarebbe come scrivere:
        // if (langList.includes(lang)) {
        //     return `<img src="img/flag_${lang}.png" />`
        // } else {
        //     return lang
        // }
        return imgFlag;
    }

    function createStars(num) {
        //trasformo il voto da 1 a 10 in un numero da uno a 5 arrotondando per eccesso
        var ceilNumber = Math.ceil(num / 2);
        var starsIcon = "";
        if (num == 0) {
            starsIcon += '<i class="far fa-star"></i>';
        } else {
            for (var i = 0; i < ceilNumber; i++) {
                starsIcon += '<i class="fas fa-star"></i>';
            }
        }

        return starsIcon;
    }
});

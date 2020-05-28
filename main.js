$(document).ready(function () {
    var apiKey = "da57a6e390d49d195b53f218c7690a55";
    var baseUrl = "https://api.themoviedb.org/3/";

    var imgUrl = "https://image.tmdb.org/t/p/";
    var dimImg = "w185";

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
            // nascondo il titolo della pagina
            $(".title-search").removeClass("visible");
            //leggo il valore dell'input e lo uso nella query della request
            var textSearch = $("input#search-text").val();
            //PER I FILM
            $.ajax({
                method: "GET",
                url: baseUrl + "search/movie",
                data: {
                    api_key: apiKey,
                    query: textSearch,
                    language: "it",
                },
                success: function (response) {
                    // inserisco il testo cercato dall'utente nel titolo della pagina
                    $("#ricerca-utente").text(textSearch);
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
            //PER LE SERIE TV
            $.ajax({
                method: "GET",
                url: baseUrl + "search/tv",
                data: {
                    api_key: apiKey,
                    query: textSearch,
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

    // !FUNZIONI

    function cicleAndPrint(risultati) {
        //preparo i dati per il template
        risultati.forEach(function (infos) {
            //recupero i dati di ogni elemento dell'array e li passo a handlebars
            var context = {
                // potevi utilizzare hasOwnProperty('title')
                title: infos.title ? infos.title : infos.name,
                orTitle: infos.original_title
                    ? infos.original_title
                    : infos.original_name,

                // orLanguage: infos.original_language,
                orLanguage: createFlag(infos.original_language),
                averageVote: infos.vote_average,
                stars: createStars(infos.vote_average),
                type: infos.title ? "film" : "serie",
                poster: infos.poster_path
                    ? imgUrl + dimImg + infos.poster_path
                    : `img/img-not-available.png`,
                overview: infos.overview ? infos.overview : "no overview",

                // actors: getActors(infos.id),
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

    // function getActors(id) {
    //     //PER GLI ATTORI
    //     $.ajax({
    //         method: "GET",
    //         url: baseUrl + `movie/${id}`,
    //         data: {
    //             api_key: apiKey,
    //             append_to_response: "credits",
    //         },
    //         success: function (response) {
    //             // salvo l'array di dati di ritorno
    //             var results = response.credits.cast; //[{...},{...},{...}...]
    //             for (var i = 0; i < 5; i++) {
    //                 console.log(results[i].name);
    //             }
    //             console.log("------------");
    //         },
    //         error: function () {
    //             console.log("errore");
    //         },
    //     });
    // }

    function createFlag(lang) {
        //costruisco una lista di linguaggi preimpostati corrispondenti alle immagini
        var langList = ["it", "en", "fr", "de"];
        // controllo se la lingua del film e' presente in questa lista
        var imgFlag = langList.includes(lang)
            ? `<img class="flag" src="img/flag_${lang}.png" />`
            : lang;
        return imgFlag;
    }

    function createStars(num) {
        //trasformo il voto da 1 a 10 in un numero da uno a 5 arrotondando
        var ceilNumber = Math.round(num / 2);
        var starsIcon = "";
        for (var i = 1; i <= 5; i++) {
            // devo aggiungere una stella piena o una stella vuota?
            if (i <= ceilNumber) {
                // stella piena
                starsIcon += '<i class="fas fa-star"></i>';
            } else {
                // stella vuota
                starsIcon += '<i class="far fa-star"></i>';
            }
        }
        return starsIcon;
    }

    $(document)
        .on("mouseenter", ".single-list", function () {
            $(this).find(".overview").show();
            $(this).toggleClass("over-hide scrolling");
            $(this).find(".poster-container").fadeOut();
        })
        .on("mouseleave", ".single-list", function () {
            $(this).scrollTop(0);
            $(this).find(".overview").hide();
            $(this).toggleClass("scrolling over-hide");
            $(this).find(".poster-container").fadeIn();
        });
});

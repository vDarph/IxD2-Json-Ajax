// Shorthand for $( document ).ready()
$(function() {

    var language = "it";
    $("#eng").click(function () {
        language = "en";
        alert('il sito è in inglese');
    })

    $('#ita').click(function () {
        language = "it";
        alert('il sito è in italiano');
    });

    // debounce the function http://underscorejs.org/#debounce
    var onKeyUp = _.debounce(function () {
        var q = $("#searchterm").val();

        search(q)

    }, 250);

    var search = function (q) {

        //
        //';
        //$.getJSON("http://" +lang + ".wikipedia.org/w/api.php?callback=?",
        //
        console.log(language)
        var URL = "http://" + language + ".wikipedia.org/w/api.php?callback=?";
        var DATA = {
            srsearch: q
            , action: "query"
            , list: "search"
            , format: "json"
        }
        var SUCCESS = function (data) {
            $("#results").empty();
            $("#results").append("<h1>Risultati per <span>" + q + "</span></h1>");
            if (data.query) {
                $.each(data.query.search, function (i, item) {
                    $("#results").append("<div class='tab'><h2><a href='http://" + language + ".wikipedia.org/wiki/" + encodeURIComponent(item.title) + "'>" + item.title + "</a></h2><p>" + item.snippet + " [...]</p></div>");
                });
            }
            //
            //
            //------------------------------------------
            //.empty() #results IF q IS EMPTY
            //
        }
        $.getJSON(URL, DATA, SUCCESS
            /*, $(q).error.(function (err) {
             $('#results').append('<h1>Sembra che <span>Wiki</span> sia rotto :/</h1>');
             }),*/
        ).fail(function () {
            console.log('failed!')
        })

    }

    $("#searchterm").keyup(onKeyUp);

//
//----------------------------------------
//INPUT AUTOCOMPLETE
//

    //Sono partito da qui http://w3lessons.info/2015/03/01/autocomplete-search-using-wikipedia-api-and-jquery-ui/

    $("#searchbox").autocomplete({
        source: function(request, response) {
            $.ajax({
                url: "http://en.wikipedia.org/w/api.php",
                dataType: "jsonp",
                data: {
                    'action': "opensearch",
                    'format': "json",
                    'search': request.term
                },
                success: function(data) {
                    response(data[1]);
                }
            });
        },
        //ascoltiamo l'evento select e facciamo partire la ricerca
        select: function( event, ui ) {
            var selection = ui.item.value;
            console.log("Hai selezionato: " + selection);
            search(selection)
        }
    });
});

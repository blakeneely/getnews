$(document).ready(function(){
    // Set New Articles div to variable
    const articleContainer = $(".new-articles");

    // Function to delete note
    function deleteNote(){
        let noteToDelete = $(this).data("_id");
        $.ajax({
            method: "DELETE",
            url: "/api/notes/" + noteToDelete
        }).then(function(){
            bootbox.hideAll();
        })
    }

    // Function to save note
    function saveNote(){
        let noteData;
        let newNote = $(".bootbox-body textarea").val().trim();
        if (newNote) {
            noteData = {
                _id: $(this).data("article")._id,
                noteText: newNote
            };
            $.post("/api/notes", noteData)
            .then(function(){
                bootbox.hideAll();
            });
        };
    };

    // Function to render notes list
    function renderNotesList(data){
        let notesToRender = [];
        let currentNote;
        if(!data.notes.length) {
            currentNote = [
                "<li class='list-group-item'>",
                "Not notes yet",
                "</li>"
            ].join("");
            notesToRender.push(currentNote);
        }
        else {
            for (let i = 0; i < data.notes.length; i++){
                currentNote = $([
                    "<li class='list-group-item note'>",
                    data.notes[i].noteText,
                        "<button class='btn btn-danger note-delete'>x</button>",
                    "</li>"
                ].join(""));
                currentNote.children("button").data("_id", data.notes[i]._id);
                notesToRender.push(currentNote);
            }
        }
        $(".note-container").append(notesToRender);
    }; 

    // Function to make notes
    function makeNotes(){
        const currentArticle = $(this).parents(".card").data();
        // Get notes on current article and render in modal
        $.get("/api/notes/" + currentArticle._id)
        .then(function(data){
            let modalText = [
                "<div class='container-fluid text-center'>",
                    "<h4>Notes for article: " + currentArticle._id + "</h4>",
                    "<hr />",
                    "<ul class='list-group note-container'>",
                    "</ul>",
                    "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
                    "<button class='btn btn-success save'>Save Note</button>",
                "</div>"
            ].join("");
            bootbox.dialog({
                message: modalText,
                closeButton: true
            });
            let noteData = {
                _id: currentArticle._id,
                notes: data || []
            };
            $(".btn.save").data("article", noteData);
            renderNotesList(noteData);
        })
    };

    // Function to delete article from collection
    function deleteArticle(){
        let articleToDelete = $(this).parents(".card").data();
        $.ajax({
            method: "DELETE",
            url: "/api/headlines/" + articleToDelete._id
        }).then(function(data){
            if(data.ok){
                pageLoad();
            }
        })
    };

    // Function to create card 
    function createCard(article){
        let card =
        // Use Bootstrap card layout to display article card
        $([
            '<div class="card" style="width: 18rem;">',
            '<div class="card-header">',
                '<a class="btn btn-outline-danger delete">X</a>',
            '</div>',
            '<div class="card-body">',
                '<h5 class="card-title">' + article.headline + '</h5>',
                // '<h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>',
                '<p class="card-text">' + article.summary + '</p>',
                '<a href=' + article.link + 'class="card-link">Read More</a>',
                '<a class="btn btn-info notes">Make Note</a>',
            '</div>',
            '</div>'
        ].join(""))
        card.data("_id", article._id);
        return card;
    };

    function renderArticleCards(articles){
        // Set empty array
        let articleCards = [];
        // Loop over articles
        for(let i = 0; i < articles.length; i++){
            // Pass each article through createCard function to build it then push each one to empty array
            articleCards.push(createCard(articles[i]));
        }
        // Append articleCards array to html
        articleContainer.append(articleCards);
    };

    function noArticles(){
        let noArticlesAlert = 
        // Use Bootstrap card layout to display alert
            $([
                "<div class='alert alert-warning text-center'>",
                    "<h4>Sorry, looks like we don't have any articles</h4>",
                "</div>",
                "<div class='card'>",
                    "<div class='card-header text-center'>",
                        "<h3>What would you like to do?</h3>",
                    "</div>",
                    "<div class='card-body text-center'>",
                        "<h4><a class='scrape-new'>Try scraping for new articles</a></h4>",
                        "<h4><a href='/saved'>Go to saved articles</a></h4>",
                    "</div>",
                "</div>"
            ].join(""));
        articleContainer.append(noArticlesAlert)
    };

    // Function to render initial articles on page load
    function pageLoad(){
        // Empty html container
        articleContainer.empty();
        // Get request to grab headlines from api that are saved
        $.get("/api/headlines?saved=true")
        .then(function(data){
            // chck if data actually exists, if it does pass data into renderArticleCards function to build them
            if(data && data.length) {
                renderArticleCards(data);
            }
            // If data doesn't exist display sorry message and offer to scrape for data or go to saved articles
            else {
                noArticles();
            };
        });
    };
    
    // Event listeners
    $(document).on("click", ".btn.delete", deleteArticle);
    $(document).on("click", ".btn.notes", makeNotes);
    $(document).on("click", ".btn.save", saveNote);
    $(document).on("click", ".btn.note-delete", deleteNote);

    // Load Page
    pageLoad();
});
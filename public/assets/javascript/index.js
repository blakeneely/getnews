$(document).ready(function(){
    // Set New Articles div to variable
    const articleContainer = $(".new-articles");

    // Function to save article into database
    function saveArticle(){
        const articleToSave = $(this).parents(".card").data();
        articleToSave.saved = true;
        // Make Ajax call to collection in database
        $.ajax({
            method: "PATCH",
            url: "/api/headlines",
            data: articleToSave
        })    
        .then(function(data){
            if(data.ok){
                pageLoad();
            }
        })
    };

    // Function to scrape for new articles
    function scrapeArticle(){
        $.get("/api/fetch")
        .then(function(data) {
            pageLoad();
            bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "</h3>")
        })
    }

    // Function to render initial articles on page load
    function pageLoad(){
        // Empty html container
        articleContainer.empty();
        // Get request to grab headlines from api
        $.get("/api/headlines?saved=false")
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

    function renderArticleCards(articles){
        // Set empty array
        const articleCards = [];
        // Loop over articles
        for(let i = 0; i < articles.length; i++){
            // Pass each article through createCard function to build it then push each one to empty array
            articleCards.push(createCard(articles[i]));
        }
        // Append articleCards array to html
        articleContainer.append(articleCards);
    };

    function createCard(article){
        const card =
        // Use Bootstrap card layout to display article card
        $([
            '<div class="card" style="width: 18rem;">',
            '<div class="card-body">',
                '<h5 class="card-title">' + article.headline + '</h5>',
                // '<h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>',
                '<p class="card-text">' + article.summary + '</p>',
                '<a href=' + article.link + 'class="card-link">Read More</a>',
                // '<a href="#" class="card-link">Another link</a>',
            '</div>',
            '</div>'
        ].join(""))
        card.data("_id", article._id);
        return card;
    };

    function noArticles(){
        const noArticlesAlert = 
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

// Event Listeners
$(document).on("click", ".btn.save", saveArticle);
$(document).on("click", ".scrape-new", scrapeArticle);


// Load page
pageLoad();

});
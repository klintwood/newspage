/*jslint browser: true*/
/*global $, jQuery, alert*/
/*jslint node: true */      // probably not the correct way

'use strict';

var engines = {};

engines.g = {  "title" : "Google", "keyword" : "g",
                "string" : "https://www.google.com/#q=#{query}&safe=off" };
engines.y = {  "title" : "YouTube", "keyword" : "y",
                "string" : "https://www.youtube.com/results?search_query=#{query}" };
engines.n = {  "title" : "Nihongomaster", "keyword" : "n",
                "string" : "http://www.nihongomaster.com/dictionary/search/?q=#{query}&type=j" };
engines.w = {  "title" : "Wikipedia", "keyword" : "w",
                "string" : "http://en.wikipedia.org/w/index.php?title=Special:Search&search=#{query}" };
engines.a = {  "title" : "Amazon", "keyword" : "a",
                "string" : "http://www.amazon.de/s/url=search-alias%3Daps&field-keywords=#{query}" };
engines.p = {  "title" : "Pons", "keyword" : "p",
                "string" : " http://de.pons.com/%C3%BCbersetzung?q=#{query}&l=deen" };

// select Google by default
var selectedEngine = engines.g;

// fire search

function search(caller) {
    var query = caller.value;
    window.location = selectedEngine.string.replace("#{query}", query);
}

var sucher = document.getElementById("sucher");
sucher.addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {  // ENTER
        var input = this.value;
        if (input.match(/^\S*\.\S*$/)) { // if input looks like URL, redirect
            if (input.match(/^https?:\/\//)) {          // only add "http://" if not already in input
                window.location = input;
            } else {
                window.location = "http://" + input;
            }
        } else {                                   // otherwise, search
            search(this);
        }
    }
    if (e.keyCode === 9) {  // TAB        
        selectedEngine = engines[this.value];
        this.value = engines[this.value].title;
    }
});

var suchers = document.getElementById("suchers");
suchers.addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {  // ENTER
        search(this);
    }
    if (e.keyCode === 9) {  // TAB
        document.getElementById("linkasd").focus(); // hack because focus jumps to next field on TAB
    }
});


// Hacker News
// use this instead of unreliable api: http://whateverorigin.org/

function yourFunction(json) {
    function createHnEntry(item, index, array) {
        function create_link(id, title, comments) {
            return '<a href="https://news.ycombinator.com/item?id=' + id + '">' + title + ' <b>(' + comments + ')</b></a>';
        }
        
        var id = item.id,
            title = item.title,
            comment_count = item.commentCount;
        $('ul#hacker_news').append('<li>' + create_link(id, title, comment_count) + '</li>');
    
    }
    json.items.forEach(createHnEntry);
    
}


// Simple time display
// taken from: http://stackoverflow.com/questions/6787374/how-to-display-system-time
function updateTime() {
    var currentTime = new Date(),
        hours = currentTime.getHours(),
        minutes = currentTime.getMinutes(),
        displayed_time;
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    
    displayed_time = hours + ":" + minutes + " ";
    setTimeout("updateTime()", 1000);
    document.getElementById('time').innerHTML = displayed_time;
}
updateTime();




// locally store Pinned / Hidden items
/*
http://www.webdirections.org/blog/webstorage-persistent-client-side-data-storage/
http://html5doctor.com/storing-data-the-simple-html5-way-and-a-few-tricks-you-might-not-have-known/
http://diveintohtml5.info/storage.html */
if (window.localStorage) {
    //window.localStorage.clear();
    var hiddenAndroids = JSON.parse(window.localStorage.getItem("android"));
    var hiddenOculus = JSON.parse(window.localStorage.getItem("oculus"));
}

if (!hiddenAndroids) {
    var hiddenAndroids = [];
}

if (!hiddenOculus) {
    var hiddenOculus = [];
}



// Reddit page

// generalized reddit function
function addSubreddit(subName, limit) {
    var hiddenItems = [];
    if (window.localStorage) {
        //window.localStorage.clear();
        hiddenItems = JSON.parse(window.localStorage.getItem(subName));
    }
  
    if(!hiddenItems) {
      hiddenItems = [];
    }
    
    reddit.hot(subName).limit(limit).fetch(function (res) {
        // res contains JSON parsed response from Reddit    
        var posts = res.data.children;

        // loop through posts and create and entry for each
        for (var ind in posts) {
            var post = posts[ind].data;

            if (hiddenItems.indexOf(post.id) == -1) { // Only show if id not found in hidden list
                var link = '<p id="' + post.id + '"><span class="remove_news"> X </span><a href="http://reddit.com' + post.permalink + '" title="' + post.title + '">' + crop_title(post.title) + ' <b>(' + post.num_comments + ')</b></a></p>';
                $(('ul#reddit ul#' + subName)).append('<li>' + link + '</li>');
            }

        }
        // Hide item on click event
        $("span.remove_news").click(function() {
            hiddenItems.push($(this).parent().attr("id"));
            window.localStorage.setItem(subName, JSON.stringify(hiddenItems));
            $(this).parent().slideUp();
        });
    });
    
}



addSubreddit("de", 20);
addSubreddit("worldnews", 20);

addSubreddit("steamdeck", 20);

addSubreddit("virtualreality", 10);
addSubreddit("valveindex", 10);
addSubreddit("oculus", 10);

addSubreddit("classicwow", 20);

addSubreddit("pcgaming", 10);
addSubreddit("hardware", 10);


function crop_title(title) {
    //console.log(title.length);
    if (title.length > 70) {
        title = title.substr(0, 67);
        title += "...";
    }
    return title;
}

var simplemde = new SimpleMDE({
    autosave: {
		enabled: true,
		uniqueId: "MyUniqueID",
		delay: 1000,
    },
    spellChecker: false,
});


  
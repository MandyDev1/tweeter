/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function () {
  // Error messages are hidden by default
  $("#error-empty").hide();
  $("#error-tooLong").hide();

  // Prevent XSS with an escape function
  const escape = function (str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  // Taking in an array of tweet objects and then appending each one to the #tweets-container
  const renderTweets = function (tweets) {
    $('#tweets-container').empty();
    for (const tweet of tweets) {
      const $tweet = createTweetElement(tweet);
      $('#tweets-container').append($tweet);
    }
  }

  // Returning a tweet <article> element containing the entire HTML structure of the tweet
  const createTweetElement = function (tweet) {
    let $tweet = $(`
    <article class="tweet-history">
        <header class="tweet-header">
          <div class="profile-picture">
            <img class="avatar" src=${tweet.user.avatars} alt="avatar">
            <div class="username">${tweet.user.name}</div>
          </div>
          <div class="mention">${tweet.user.handle}</div>
        </header>
        <div class="tweet-content">
          ${escape(tweet.content.text)}
        </div>
        <footer class="tweet-footer">
          <div class="tweet-timestamp">${timeago.format(tweet.created_at)}</div>
          <div class="icons">
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-retweet"></i>
            <i class="fa-solid fa-heart"></i>
          </div>
        </footer>
      </article>
    `);
    return $tweet;
  }

  // Responsable for fetching tweets from http://localhost:8080/tweets page
  const loadTweets = function () {
    $.get("/tweets")
      .done(function (newTweet) {
        renderTweets(newTweet.reverse()); // newest tweet on top
      })
      .fail(function (error) {
        console.error("GET request failed:", error); // Get request error handling
      });
  };

  loadTweets();

  // Adds new tweet when click submit
  $("#new-tweet-form").submit(function (event) {
    event.preventDefault();
    const maxCharacter = 140;
    const tweetText = $(this).find("#tweet-text").val().trim();
    const tweetLength = tweetText.length;

    if (!tweetLength) {
      $("#error-empty").slideDown("slow");
      $("#error-tooLong").hide();
    } else if (tweetLength - maxCharacter > 0) {
      $("#error-tooLong").slideDown("slow");
      $("#error-empty").hide();
    } else {
      $("#error-empty").hide();
      $("#error-tooLong").hide();
      const newTweet = $(this).serialize();
      const $textarea = $(this).find("textarea");
      const $counter = $(this).find(".counter");

      $.post("/tweets/", newTweet)
        .done(function () {
          // Successful Post
          $textarea.val("");
          $counter.val(maxCharacter);
          loadTweets();
        })
        .fail(function (error) {
          console.error("POST request failed:", error);
        });
    }
  });
})
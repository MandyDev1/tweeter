/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {
  // Taking in an array of tweet objects and then appending each one to the #tweets-container
  const renderTweets = function(tweets) {
    for (const tweet of tweets) {
      const $tweet = createTweetElement(tweet);
      $('#tweets-container').prepend($tweet);
    }
  }

  // Returning a tweet <article> element containing the entire HTML structure of the tweet
  const createTweetElement = function(tweet) {
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
          ${tweet.content.text}
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
    $.get("/tweets", function (newTweet) {
      renderTweets(newTweet);
    });
  };

  loadTweets();

  // 'Submit' event handler
  $("#new-tweet-form").submit(function(event) {
    event.preventDefault();

    const tweetContent = $(this).find('textarea[name="text"]').val();

    if (!tweetContent || tweetContent.length > 140) {
      if (!tweetContent) {
        alert("Please enter something before you tweet.");
      } else {
        alert("The maximum message length is 140 characters!");
      }
      return;
    }

    const newTweet = $(this).serialize();
    console.log('Serialized Form Data:', newTweet);

    $.post('/tweets', newTweet).then(function(response) {
      console.log(response);
      loadTweets();
    });
  })

})
/**
 *
 *  Steps:
 *      ~ Get old post data
 *      ~ Create JSON object for old data
 *      ~ Append new post data
 *      ~ Get SHA1 of old post
 *      ~ Create file upload
 *
 *
 *  Example of successful fetch
 *  fetch("https://api.github.com/repos/EddieFed/Dynamic-Github-Blog/contents/posts.json", {
 *      method: "PUT",
 *      headers: {
 *          "Content-Type": "Application/JSON",
 *          "Authorization": "token <auth-token>"
 *      },
 *      body: JSON.stringify({
 *         "message": "Added new post test",
 *          "content": "<base64 message>",
 *          "sha": "<sha of the last commit>"
 *      })
 *  })
 *      .then(r => r.json())
 *      .then(function (data) {
 *          console.log(data);
 *      });
 *
*/


function init() {
    const title = document.getElementById("title").value;
    const article = document.getElementById("article").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const token = username + ":" + password;

    post(token, title, article)
}

function post(tempToken, title, newPost) {

    const token = ("basic " + btoa(tempToken));
    getOldPostData(token, title, newPost);

}

function getOldPostData(token, title, newPost) {
    fetch("https://api.github.com/repos/MetrixYT/metrixyt.github.io/contents/memes/posts.json")
        .then(r => r.json())
        .then(function(d) {
            const oldPostSHA = d.sha;
            const oldPostContentDecoded = atob(d.content);
            // console.log(typeof oldPostContentDecoded);
            console.log("Old Post Decoded: " + JSON.stringify(oldPostContentDecoded));

            const newPostJSON = makeNewPostJSON(newPost, title, oldPostContentDecoded);
            const newPost64 = btoa(newPostJSON);

            // console.log("New Post in Base64: " + newPost64);

            // console.log("Old Post SHA: " + oldPostSHA);
            makeNewPost(token, newPost64, oldPostSHA);
        });
}

function makeNewPost(token, newPost64, oldPostSHA) {


    fetch("https://api.github.com/repos/MetrixYT/metrixyt.github.io/contents/memes/posts.json", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: makeBody(token, newPost64, oldPostSHA)
    })
        .then(r => r.json())
        .then(function (data) {
            console.log(data);

            loadPage();
        });
}

function makeBody(token, newPost64, oldPostSHA) {
    const tempJSON = {
        "message": "New Article!",
        "content": newPost64,
        "sha": oldPostSHA
    };

    // console.log(tempJSON);

    return JSON.stringify(tempJSON);
}

function makeNewPostJSON(newPost, title, oldPost) {
    const oldPostJSON = JSON.parse(oldPost);
    // console.log(JSON.stringify(oldPostJSON));
    const newPostJSON = {
        "title": title,
        "body": newPost,
        "date": (Date() + "")
    };
    // console.log(newPostJSON);

    let newJSON = oldPostJSON;
    newJSON.articles.push(newPostJSON);
    // console.log(newJSON);

    return JSON.stringify(newJSON);

}
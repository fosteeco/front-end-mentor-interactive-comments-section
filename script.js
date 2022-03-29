/* Source for the following function: https://qawithexperts.com/article/javascript/read-json-file-with-javascript/380 */
function readTextFile(file, callback) {
  var rawFile = new XMLHttpRequest();
  rawFile.overrideMimeType("application/json");
  rawFile.open("GET", file, true);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4 && rawFile.status == "200") {
      callback(rawFile.responseText);
    }
  };
  rawFile.send(null);
}

/* Comment Format: 
id (Int),
content (String),
createdAt (String),
replies (Arr),
score (Int),
user (Obj){
    image(Obj){
        png(Key):pngsource(String)
        webP(Key):webPsource(String)
    },
    username (Key): name(String),
},
 */

const commentDownVote = (commentId) => {
  const commentCard = document.getElementById(commentId);
  const voteCount = commentCard.querySelector(".vote-count");
  if (+voteCount.innerHTML > 0) {
    voteCount.innerHTML = +voteCount.innerHTML - 1;
  }
};

const commentUpVote = (commentId) => {
  const commentCard = document.getElementById(commentId);
  const voteCount = commentCard.querySelector(".vote-count");
  voteCount.innerHTML = +voteCount.innerHTML + 1;
};

const buildCommment = (commentData) => {
  const commentCard = ` 
  <div class="comment-container">
    <div class="comment-card" id="${commentData.id}">
      <div class="vote-container">
        <button onClick="commentUpVote(${
          commentData.id
        })" class="btn plus-button">
          <img src="./images/icon-plus.svg" alt="" />
        </button>
        <div class="vote-count moderate-blue-text weight-500">${
          commentData.score
        }</div>
        <button onClick="commentDownVote(${
          commentData.id
        })" class="btn minus-button">
          <img src="./images/icon-minus.svg" alt="" />
        </button>
      </div>
      <div class="comment-main">
        <div class="comment-header">
          <div class="comment-info">
            <img
              src="${commentData.user.image.png}"
              class="profile"
              alt=""
            />
            <span class="profile-name weight-500">${
              commentData.user.username
            }</span>
            <span class="created-at">${commentData.createdAt}</span>
          </div>
          <div class="comment-reply-container moderate-blue-text weight-500">
            <img src="./images/icon-reply.svg" alt="Reply arrow" />
            <span>Reply</span>
          </div>
        </div>
        <div class="comment-body gray-text">
        ${commentData.content}
        </div>
      </div>
    </div>
    <div class="replies-container">
    <div class="reply-bar-container">
    <div class="reply-bar"></div>
    </div>
    <div class="reply-comments-container">
        ${commentData.replies
          .map(
            (comment) =>
              `<div class="comment-card" id="${comment.id}">
      <div class="vote-container">
        <button onClick="commentUpVote(${comment.id})" class="btn plus-button">
          <img src="./images/icon-plus.svg" alt="" />
        </button>
        <div class="vote-count moderate-blue-text weight-500">${comment.score}</div>
        <button onClick="commentDownVote(${comment.id})" class="btn minus-button">
          <img src="./images/icon-minus.svg" alt="" />
        </button>
      </div>
      <div class="comment-main">
        <div class="comment-header">
          <div class="comment-info">
            <img
              src="${comment.user.image.png}"
              class="profile"
              alt=""
            />
            <span class="profile-name weight-500">${comment.user.username}</span>
            <span class="created-at">${comment.createdAt}</span>
          </div>
          <div class="comment-reply-container moderate-blue-text weight-500">
            <img src="./images/icon-reply.svg" alt="Reply arrow" />
            <span>Reply</span>
          </div>
        </div>
        <div class="comment-body gray-text">
        ${comment.content}
        </div>
      </div>
    </div>`
          )
          .join("")}
    </div>
    </div>
    </div>
    `;
  return commentCard;
};

const commentsContainer = document.querySelector("#comments-container");

readTextFile("./data.json", function (text) {
  var data = JSON.parse(text); //parse JSON
  const commentArr = data.comments;
  commentArr.forEach((comment) => {
    const newCommentCard = buildCommment(comment);
    commentsContainer.innerHTML += newCommentCard;
  });
  console.log(data);
});

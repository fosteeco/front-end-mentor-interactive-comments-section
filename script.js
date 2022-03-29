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

const buildCommment = (commentData, data) => {
  const { currentUser } = data;
  console.log("currentUser :", currentUser);
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
          <div class="comment-reply-container moderate-blue-text weight-500" onClick="replyClick(${
            commentData.id
          })">
            <img src="./images/icon-reply.svg" alt="Reply arrow" />
            <span>Reply</span>
          </div>
        </div>
        <div class="comment-body gray-text">
        ${commentData.content}
        </div>
      </div>
    </div>
    ${
      commentData.replies.length > 0
        ? `<div class="replies-container">
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
        <div class="vote-count moderate-blue-text weight-500">${
          comment.score
        }</div>
        <button onClick="commentDownVote(${
          comment.id
        })" class="btn minus-button">
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
            <span class="profile-name weight-500">${
              comment.user.username
            }</span>
            <span class="created-at">${comment.createdAt}</span>
          </div>
          ${
            currentUser.username === comment.user.username
              ? `
              <div class="user-modify-controls">
              <button class="btn transparent-bg red-text weight-500 modify-btn"><img src="./images/icon-delete.svg"/>Delete</button>
              <button class="btn transparent-bg moderate-blue-text weight-500 modify-btn"><img src="./images/icon-edit.svg"/>Edit</button>
              </div>`
              : `<div class="comment-reply-container moderate-blue-text weight-500" onClick="replyClick(${comment.id})">
            <img src="./images/icon-reply.svg" alt="Reply arrow" />
            <span>Reply</span>
          </div>`
          }
        </div>
        <div class="comment-body gray-text">
        ${comment.content}
        </div>
      </div>
    </div>`
          )
          .join("")}
    </div>`
        : ""
    }
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
    const newCommentCard = buildCommment(comment, data);
    commentsContainer.innerHTML += newCommentCard;
  });
  console.log(data);
});

const buildCommentInput = (userAt) => {
  console.log("userAt :", userAt);
  const div = document.createElement("div");
  div.classList.add("reply-input-box", "sub-comment-reply");
  div.innerHTML = `
    <div class="profile-wrapper">
      <img src="./images/avatars/image-juliusomo.png" alt="" class="profile" />
    </div>
      <div class="text-area-wrapper">
        <textarea
          name=""
          id="reply-text-area"
          class="reply-text-area"
          placeholder="Add a comment..."
        >@${userAt} </textarea>
      </div>
    <div class="button-wrapper">
      <button type="submit" class="btn text-btn moderate-blue-bg white-text">
        SEND
      </button>
    </div>
  </div>`;
  return div;
};

/* Reply Code */
const replyClick = (commentId) => {
  const commentCard = document.getElementById(commentId);
  const profileName = commentCard.querySelector("span.profile-name").innerHTML;
  const subReplyDiv = document.querySelector(".sub-comment-reply");
  if (subReplyDiv) {
    subReplyDiv.remove();
  }
  const replyInputDiv = buildCommentInput(profileName);
  commentCard.insertAdjacentElement("afterend", replyInputDiv);
};

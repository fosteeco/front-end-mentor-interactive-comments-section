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

const buildCommment = (commentData) => {
  const commentCard = ` 
    <div class="comment-card">
      <div class="vote-container">
        <button class="btn plus-button">
          <img src="./images/icon-plus.svg" alt="" />
        </button>
        <div class="vote-count moderate-blue-text weight-500">${commentData.score}</div>
        <button class="btn minus-button">
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
            <span class="profile-name weight-500">${commentData.user.username}</span>
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

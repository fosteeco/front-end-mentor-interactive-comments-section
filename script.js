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
              `
             <div class="comment-container"> 
              <div class="comment-card" id="${comment.id}">
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
              <button class="btn transparent-bg red-text weight-500 modify-btn delete-btn" onClick="deleteComment(${comment.id})"><img src="./images/icon-delete.svg"/>Delete</button>
              <button class="btn transparent-bg moderate-blue-text weight-500 modify-btn" onClick="toggleEditComment(${comment.id})"><img src="./images/icon-edit.svg"/>Edit</button>
              </div>`
              : `<div class="comment-reply-container moderate-blue-text weight-500" onClick="replyClick(${comment.id})">
            <img src="./images/icon-reply.svg" alt="Reply arrow" />
            <span>Reply</span>
          </div>`
          }
        </div>
        <div class="comment-body gray-text">
        <textarea disabled>${comment.content}</textarea>
        </div>
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
  resizeAllTextAreas();
  console.log(data);
});

const addHiddenDiv = (i, hiddenDiv) => {
  console.log("adding hidden div!");
  // Append hiddendiv to parent of textarea, so the size is correct
  i.parentNode.appendChild(hiddenDiv);
  console.log("i.parentNode :", i.parentNode);

  // Remove this if you want the user to be able to resize it in modern browsers
  i.style.resize = "none";

  // This removes scrollbars
  i.style.overflow = "hidden";

  // Every input/change, grab the content
  content = i.value;

  // Add the same content to the hidden div
  hiddenDiv.style.display = "none";
  hiddenDiv.style.whiteSpace = "pre-wrap";
  hiddenDiv.style.wordWrap = "break-word";

  // This is for old IE
  content = content.replace(/\n/g, "<br>");

  // The <br ..> part is for old IE
  hiddenDiv.innerHTML = content + '<br style="line-height: 3px;">';

  // Briefly make the hidden div block but invisible
  // This is in order to read the height
  hiddenDiv.style.visibility = "hidden";
  hiddenDiv.style.display = "block";
  i.style.height = hiddenDiv.offsetHeight + 22 + "px";

  // Make the hidden div display:none again
  hiddenDiv.style.visibility = "visible";
  hiddenDiv.style.display = "none";
};

const resizeAllTextAreas = () => {
  let textareas = document.querySelectorAll("textarea");
  let hiddenDiv = document.createElement("div");
  hiddenDiv.classList.add("hiddendiv");

  console.log("textareas :", textareas);

  // Loop through all the textareas and add the event listener
  for (let i of textareas) {
    (function (i) {
      addHiddenDiv(i, hiddenDiv);
      i.addEventListener("input", function () {
        addHiddenDiv(i, hiddenDiv);
      });
    })(i);
  }
};

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

/* Delete Comment  */
let commentToDelete;
const deleteComment = (commentId) => {
  commentToDelete = document.getElementById(commentId);
  showDeleteModal();
};

const confirmDeleteBtn = document.querySelector("#confirm-delete-btn");
confirmDeleteBtn.addEventListener("click", () => {
  commentToDelete.remove();
  hideDeleteModal();
});

/* Modal Code */

const modalContainer = document.querySelector(".modal-container");
document.addEventListener(
  "click",
  function (event) {
    // If user either clicks X button OR clicks outside the modal window, then close modal by calling closeModal()
    if (
      !event.target.closest(".confirmation-modal") &&
      !event.target.matches(".delete-btn")
    ) {
      hideDeleteModal();
    }
  },
  false
);

const hideDeleteModal = () => {
  modalContainer.classList.add("hide");
};

const showDeleteModal = () => {
  modalContainer.classList.remove("hide");
};

const toggleEditComment = (commentId) => {
  const commentCard = document.getElementById(commentId);
  console.log("commentCard :", commentCard);
  const textArea = commentCard.querySelector("textarea");
  console.log("textArea :", textArea);
  if (textArea.hasAttribute("disabled")) {
    textArea.removeAttribute("disabled");
  } else {
    textArea.setAttribute("disabled", true);
  }
};

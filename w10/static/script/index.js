import { ElementBuilder } from "./domhelper.js";

const getPosts = async () => await (await fetch("http://localhost:3000/api/posts")).json();
const refreshPosts = () => getPosts().then(posts => {
  const frag = new DocumentFragment();

  for (const post of posts) {
    frag.appendChild(createPostElement(post).toElement());
  }

  document.getElementById("posts").replaceChildren(frag);
});
const createPostElement = (data) => 
  new ElementBuilder()
    .setId(`post-${data.id}`)
    .setClass("post")
    .addChildren(new ElementBuilder()
      .addClass("post-title-container")
      .addChildren(new ElementBuilder("a")
        .setClass("post-title")
        .setAttribute("href", `#post-${data.id}`)
        .setContent(data.title))
      .addChildren(new ElementBuilder("span")
        .setClass("post-author")
        .setContent(data.author)))
        
    .addChildren(new ElementBuilder()
      .addClass("post-content")
      .setContent(data.content))
    
    .addChildren(new ElementBuilder()
      .addClass("post-actions")
      .addChildren(new ElementBuilder("button")
        .setClass(["post-action", "danger"])
        .setContent("刪除")
        .on("click", () => {
          fetch(`http://localhost:3000/api/post/${data.id}`,{ method: "DELETE" })
            .then((res)=>{
              if (res.ok) {
                const el = document.getElementById(`post-${data.id}`);
                el.classList.add("deleted");
                setTimeout(() => el.remove(), 200);
              } else {
                alert(res.statusText);
              }
            });
        })))

refreshPosts();

/**
 * @type {HTMLFormElement}
 */
const form = document.getElementById("new-post-form");

form.addEventListener("submit", function(ev) {
  ev.preventDefault();
  ev.stopPropagation();
  const data = {
    title: document.getElementById("field-title").value,
    author: document.getElementById("field-author").value,
    content: document.getElementById("field-content").value
  }

  fetch("http://localhost:3000/api/create", {
    method:"POST",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json"
    }
  }).then((res) => {
    if (res.ok) {
      document.getElementById("new-post-form").reset();
      refreshPosts();
    } else {
      alert(res.statusText);
    }
  })
})
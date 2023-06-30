const submitBtn = document.querySelector(".submitbtn");
const searchBox = document.querySelector(".searchbox");
const message = document.querySelector("#message");
const exampleRecipeBox = document.querySelector(".recipe-container");
const mainButton = document.querySelector(".mainbtn");

mainButton.addEventListener("click", () => {
  window.location.href = "index.html";
});

submitBtn.addEventListener("click", () => {
  message.style.display = "block";
});

searchBox.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    message.style.display = "block";
  }
});

exampleRecipeBox.addEventListener("mouseover", () => {
  const contentElement = exampleRecipeBox.querySelector(".content");
  const dividerElement = exampleRecipeBox.querySelector(".divider");
  contentElement.style.color = "#ff0000";
  dividerElement.style.opacity = "0.2";
});

exampleRecipeBox.addEventListener("mouseout", () => {
  const contentElement = exampleRecipeBox.querySelector(".content");
  const dividerElement = exampleRecipeBox.querySelector(".divider");
  contentElement.style.color = "#ffffff";
  dividerElement.style.opacity = "0";
});

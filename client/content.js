console.log("This is from Content Script.");

const linkElement = document.createElement('link');
linkElement.rel = 'stylesheet';
linkElement.href = 'content.css';
document.head.appendChild(linkElement);

let writingStyle = '';

fetch('http://localhost:5000/writingStyles')
  .then(async (res) => {
    let wstyles = await res.json();

    const dropdownContainer = document.createElement("div");
    dropdownContainer.classList.add("dropdown-container");
    dropdownContainer.style.marginBottom = '1vh';

    const dropdownMenu = document.createElement("select");
    dropdownMenu.id = "dropdown-menu";
    dropdownMenu.style.width = "40%";
    dropdownMenu.style.backgroundColor = '#40414f';
    dropdownMenu.style.marginBottom = '1vh';
    dropdownMenu.classList.add('selct-css');

    let option = document.createElement("option");
    option.value = '';
    option.textContent = 'Tone';
    option.classList.add('option-input');
    dropdownMenu.appendChild(option);

    for (const wstyle of wstyles) {
      option = document.createElement("option");
      option.value = wstyle.content;
      option.textContent = wstyle.name;
      option.style.backgroundColor = '#3e3f4b';
      option.classList.add('option-input');
      dropdownMenu.appendChild(option);
    }

    const promptTextarea = document.getElementById("prompt-textarea");

    const parentElement = promptTextarea.parentNode;
    parentElement.insertBefore(dropdownContainer, promptTextarea);
    dropdownContainer.appendChild(dropdownMenu);

    dropdownMenu.addEventListener("change", (event) => {
      const writingStyle = event.target.value!=''?'Tone: ' + event.target.value:'';

      const inp = document.getElementById("prompt-textarea");
      const alreadyValue = inp.value;
      let arr=[]
      if(alreadyValue!=''){
        arr = alreadyValue.split("\n");
      }

      if (arr.length > 1) {
        inp.value = writingStyle + '\n' + arr[1];
      } 
      else if (arr.length === 1) {
        if (arr[0][0] == 'T') {
          inp.value = writingStyle;
        }
        else if (arr[0][0] == 'P') {
          inp.value = writingStyle +  '\n' + arr[0];
        }
      }
      else inp.value = writingStyle;
    });
  })
  .catch((error) => {
    console.error(error);
  });

let email = '';
let globalData = []

chrome.runtime.sendMessage({ action: 'getValue' }, function (response) {
  email = response.email;
});

let bookmarkRegular = chrome.runtime.getURL("images/bookmark-regular.svg");
let bookmarkSolid = chrome.runtime.getURL("images/bookmark-solid.svg");
let starRegular = chrome.runtime.getURL("images/star-regular.svg");
let starSolid = chrome.runtime.getURL("images/star-solid.svg");
let thumbsUpRegular = chrome.runtime.getURL("images/thumbs-up-regular.svg");
let thumbsUpSolid = chrome.runtime.getURL("images/thumbs-up-solid.svg");
let clipboardRegular = chrome.runtime.getURL("images/clipboard-regular.svg");
let eyeRegular = chrome.runtime.getURL("images/eye-regular.svg");

const createBookmarkButton = () => {
  const button = document.createElement('button');
  button.classList.add('bookmark-button');
  const icon = document.createElement('img');
  icon.src = bookmarkRegular;
  icon.classList.add('bookmark-icon');
  button.appendChild(icon);
  return button;
}

const button = createBookmarkButton();
document.body.appendChild(button);

button.addEventListener('click', () => {
  const name = prompt('Please name the conversation:');
  if (name === null || name === '') {
    alert('Name cannot be empty.');
    return;
  }
  if (window.location.href === 'https://chat.openai.com/?model=text-davinci-002-render-sha' || window.location.href === 'https://chat.openai.com/') {
    alert("Please refresh the browser");
    return;
  }
  if (email === null || email === undefined) {
    alert('Please login in GPT Cat');
    return;
  }
  sendBookmarkData(email, name);
  alert('Bookmarked!');

});

//Copy prompt
function copyToClipboard(box) {
  const ind = box.parentNode.querySelector("input[name='index']").value;
  const text = globalData[ind].content;
  const inp = document.getElementById("prompt-textarea");
  const alreadyValue = inp.value;
  let arr=[]
  if(alreadyValue!=''){
    arr = alreadyValue.split("\n");
  }
  console.log("arr: ",arr,arr.length);
  if (arr.length === 2) {
    inp.value = arr[0] +  '\n' + 'Prompt: ' + text;
  }
  else if (arr.length === 1) {
    if (arr[0][0] == 'T') {
      inp.value = arr[0] +  '\n' + 'Prompt: ' + text;
    }
    else if (arr[0][0] == 'P') {
      inp.value = 'Prompt: ' + text;
    }
  }
  else inp.value = 'Prompt: ' + text;
  const inputEvent = new Event('input', { bubbles: true });
  inp.dispatchEvent(inputEvent);
}

async function handleLike(button) {
  const id = button.parentNode.querySelector("input[name='id']").value;
  const isLiked = button.parentNode.querySelector("input[name='isLiked']").value;
  console.log(isLiked);
  const likeCountElement = button.parentNode.querySelector("p");
  const currentCount = parseInt(likeCountElement.textContent);
  if (email === null || email === undefined) alert('Please login in GPT Cat');

  if (isLiked === "false") {
    likeCountElement.textContent = currentCount + 1;
    button.parentNode.querySelector("input[name='isLiked']").value = "true";
    button.querySelector("img").src = thumbsUpSolid;
    await fetch('https://gpt-cat.onrender.com/like', {
      method: 'POST',
      body: JSON.stringify({ id: id, email: email }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } else {
    likeCountElement.textContent = currentCount - 1;
    button.parentNode.querySelector("input[name='isLiked']").value = "false";
    button.querySelector("img").src = thumbsUpRegular;
    await fetch('https://gpt-cat.onrender.com/unlike', {
      method: 'POST',
      body: JSON.stringify({ id: id, email: email }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}


async function handleStar(button) {
  const id = button.parentNode.querySelector("input[name='id']").value;
  const isStarred = button.parentNode.querySelector("input[name='isStarred']").value;
  console.log(isStarred);
  if (email === null || email === undefined) alert('Please login in GPT Cat');

  if (isStarred === "false") {
    button.parentNode.querySelector("input[name='isStarred']").value = "true";
    button.querySelector("img").src = starSolid;
    await fetch('https://gpt-cat.onrender.com/star', {
      method: 'POST',
      body: JSON.stringify({ id: id, email: email }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } else {
    button.parentNode.querySelector("input[name='isStarred']").value = "false";
    button.querySelector("img").src = starRegular;
    await fetch('https://gpt-cat.onrender.com/unstar', {
      method: 'POST',
      body: JSON.stringify({ id: id, email: email }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}


const attachLikeEventListeners = () => {
  const likeButtons = document.querySelectorAll('button[data-like-button]');
  likeButtons.forEach(button => {
    button.addEventListener('click', () => {
      handleLike(button);
    });
  });
}
const attachStarEventListeners = () => {
  const starButtons = document.querySelectorAll('button[data-star-button]');
  starButtons.forEach(button => {
    button.addEventListener('click', () => {
      handleStar(button);
    });
  });
}

const copyEventListeners = () => {
  const boxes = document.getElementsByClassName('copy-button');
  const boxesArray = Array.from(boxes);
  console.log(boxesArray.length)
  boxesArray.forEach((box) => {
    box.addEventListener('click', () => {
      copyToClipboard(box);
    });
  });
};

//Show trending prompts
const modifyGPT = () => {
  console.log("changing");
  fetch("https://gpt-cat.onrender.com/")
    .then(response => response.json())
    .then(data => {
      globalData = data;
      const element = document.querySelector("#__next > div.overflow-hidden.w-full.h-full.relative.flex.z-0 > div.relative.flex.h-full.max-w-full.flex-1.overflow-hidden > div > main > div.flex-1.overflow-hidden > div > div > div > div.text-gray-800.w-full.mx-auto.md\\:max-w-2xl.lg\\:max-w-3xl.md\\:h-full.md\\:flex.md\\:flex-col.px-6.dark\\:text-gray-100 > div");

      if (element) {
        const changeMargin = document.querySelector("#__next > div.overflow-hidden.w-full.h-full.relative.flex.z-0 > div.relative.flex.h-full.max-w-full.flex-1.overflow-hidden > div > main > div.flex-1.overflow-hidden > div > div > div > div.text-gray-800.w-full.mx-auto.md\\:max-w-2xl.lg\\:max-w-3xl.md\\:h-full.md\\:flex.md\\:flex-col.px-6.dark\\:text-gray-100 > h1");
        changeMargin.style.marginTop = "5vh";

        const heading = document.querySelector("#__next > div.overflow-hidden.w-full.h-full.relative.flex.z-0 > div.relative.flex.h-full.max-w-full.flex-1.overflow-hidden > div > main > div.flex-1.overflow-hidden > div > div > div > div.text-gray-800.w-full.mx-auto.md\\:max-w-2xl.lg\\:max-w-3xl.md\\:h-full.md\\:flex.md\\:flex-col.px-6.dark\\:text-gray-100 > h1");
        heading.innerText = "GPT Cat : Trending prompts";

        const button = document.createElement("button");
        button.innerText = "Switch to Private";
        button.style.marginBottom = "10px";
        button.style.backgroundColor = "#202123";
        button.style.color = "white";
        button.style.padding = "10px 20px";
        button.style.width = `calc(100% - 20px)`

        button.addEventListener("click", () => {
          if (button.innerText === "Switch to Private") {
            fetch(`https://gpt-cat.onrender.com/private/${email}`)
              .then(response => response.json())
              .then(updatedData => {
                console.log(updatedData);
                modifyHTML(element, updatedData);
                button.innerText = "Switch to Public";
              })
              .catch(error => {
                console.error(error);
              });
          } else {
            fetch("https://gpt-cat.onrender.com/")
              .then(response => response.json())
              .then(updatedData => {
                modifyHTML(element, updatedData);
                button.innerText = "Switch to Private";
              })
              .catch(error => {
                console.error(error);
              });
          }
        });

        heading.insertAdjacentElement("afterend", button);
        modifyHTML(element, data);
      } else {
        console.log("Element not found.");
      }
    })
    .catch(error => {
      console.error(error);
    });
}

function modifyHTML(element, data) {
  globalData = data;
  element.innerHTML = ""
  const boxSpacing = "10px";
  element.innerHTML = `
  <div style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center; margin: 0; width: 100%;">
    ${data
      .map(
        (file, index) => `
          <div key=${index} class="prompt-box" style="background-color: #3e3f4b; width: 31%; height: auto; color: white; margin-bottom: ${boxSpacing}; margin-right: ${boxSpacing}; padding: ${boxSpacing}; border-radius: 5px;">
            <input type="hidden" name="index" value="${index}">
            <div class="popover" style="position: relative;">
              <h3 style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">${file.name}</h3>
              <div class="popover-content" style="display: none; position: absolute; top: 115%; left: 0%; width: 100%; background-color:#202123; padding: 10px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);overflow: visible; !important; z-index:999">
              <p style=" color:#ffffff; white;font-weight: bold; !important;">${file.name}</p>
              </div>
            </div>
            <div style="display: flex; flex-direction: column; align-items: flex-start; justify-content: flex-start; color: white; width:100%;
            overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
              <p style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;margin-bottom: 2vh">${file.content}</p>
              <div style="height:10%;display:flex; width:100%;">
                <input type="hidden" name="id" value="${file._id}">
                <input type="hidden" name="index" value="${index}">
                <input type="hidden" name="isLiked" value="${file.likedBy.includes(email)}">
                <input type="hidden" name="isStarred" value="${file.starredBy.includes(email)}">
                <button style="color:white;cursor: pointer; width: 10%; margin-right:0.3vw" data-like-button>
                  <img class="gpt-like-button" src=${file.likedBy.includes(email) ? thumbsUpSolid : thumbsUpRegular} style="width:100%;height:100%" alt="Like button">
                </button>
                <p style="margin-right: auto">${file.likes ? file.likes : 0} </p>
                <button class="copy-button" style="color:white;cursor: pointer; width: 7% ;margin-right:0.3vw" copy-button>
                  <img class="gpt-star-button" src=${clipboardRegular} style="width:100%;height:100%" alt="Copy prompt">
                </button>
                <button style="color:white;cursor: pointer; width: 10%" data-star-button>
                  <img class="gpt-star-button" src=${file.starredBy.includes(email) ? starSolid : starRegular} style="width:100%;height:100%" alt="Add to Favourites">
                </button>
              </div>
            </div>
          </div>
        `
      )
      .join("")}
  </div>
`;
  const popoverElements = document.getElementsByClassName("popover");
  Array.from(popoverElements).forEach((popoverElement) => {
    const popoverContent = popoverElement.querySelector(".popover-content");

    popoverElement.addEventListener("mouseenter", () => {
      popoverContent.style.display = "block";
    });

    popoverElement.addEventListener("mouseleave", () => {
      popoverContent.style.display = "none";
    });
  });

  attachLikeEventListeners();
  attachStarEventListeners();
  copyEventListeners();
}


//bookmark chat gpt conversation upto that point
const sendBookmarkData = async (email, name) => {
  await fetch("https://gpt-cat.onrender.com/bookmark/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: name,
      email: email,
      link: window.location.href,
    })
  });
}


//Monitor URL changes
let url = window.location.href;

const observerCallback = function (mutationsList, observer) {
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      const element = document.querySelector("#__next > div.overflow-hidden.w-full.h-full.relative.flex.z-0 > div.relative.flex.h-full.max-w-full.flex-1.overflow-hidden > div > main > div.flex-1.overflow-hidden > div > div > div > div.text-gray-800.w-full.mx-auto.md\\:max-w-2xl.lg\\:max-w-3xl.md\\:h-full.md\\:flex.md\\:flex-col.px-6.dark\\:text-gray-100 > div");

      if (element) {
        observer.disconnect();
        modifyGPT();
        break;
      }
    }
  }
};

function addButtonListener() {
  const element = document.querySelector("#__next > div.overflow-hidden.w-full.h-full.relative.flex.z-0 > div.dark.flex-shrink-0.overflow-x-hidden.bg-gray-900 > div > div > div > nav > div.mb-1.flex.flex-row.gap-2 > a");

  element.addEventListener('click', () => {
    let observer = new MutationObserver(observerCallback);
    observer.observe(document.body, { childList: true, subtree: true });
  })
}

const switchButtonObserver = function (mutationsList, buttonObserver) {
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      const element = document.querySelector("#__next > div.overflow-hidden.w-full.h-full.relative.flex.z-0 > div.dark.flex-shrink-0.overflow-x-hidden.bg-gray-900 > div > div > div > nav > div.mb-1.flex.flex-row.gap-2 > a");
      if (element) {
        buttonObserver.disconnect();
        addButtonListener();
        break;
      }
    }
  }
};


let observer = new MutationObserver(switchButtonObserver);
observer.observe(document.body, { childList: true, subtree: true });

if (window.location.href === 'https://chat.openai.com/?model=text-davinci-002-render-sha' || window.location.href === 'https://chat.openai.com/') {

  let observer = new MutationObserver(observerCallback);
  observer.observe(document.body, { childList: true, subtree: true });
}

document.addEventListener('click', () => {
  if (url === window.location.href) return;
  url = window.location.href;
  let observer = new MutationObserver(switchButtonObserver);
  observer.observe(document.body, { childList: true, subtree: true });
})
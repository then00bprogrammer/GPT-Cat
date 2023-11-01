console.log("This is from Content Script.");
let url = window.location.href;

//Necessary imports

let bookmarkRegular = chrome.runtime.getURL("images/bookmark-regular.svg");
let bookmarkSolid = chrome.runtime.getURL("images/bookmark-solid.svg");
let starRegular = chrome.runtime.getURL("images/star-regular.svg");
let starSolid = chrome.runtime.getURL("images/star-solid.svg");
let thumbsUpRegular = chrome.runtime.getURL("images/thumbs-up-regular.svg");
let thumbsUpSolid = chrome.runtime.getURL("images/thumbs-up-solid.svg");
let clipboardRegular = chrome.runtime.getURL("images/clipboard-regular.svg");
let eyeRegular = chrome.runtime.getURL("images/eye-regular.svg");
let linkSolid = chrome.runtime.getURL("images/link.svg")

//Adding css

const linkElement = document.createElement('link');
linkElement.rel = 'stylesheet';
linkElement.href = 'content.css';
document.head.appendChild(linkElement);

let globalData = []
let email = '';
const updateEmail = () => {
  chrome.runtime.sendMessage({ action: 'getValue' }, function (response) {
    email = response.email;
  });
}

const checkIsLoggedIn = () => {
  if (email === null || email === undefined || email == '') {
    alert('Please login in GPT Cat');
    return;
  }
}

//Adding writing style

let writingStyle = '';

const addWritingStyle = async () => {
  const dropdownContainer = document.createElement("div");
  dropdownContainer.style.marginLeft = '1%';
  dropdownContainer.style.marginTop = '1%';
  dropdownContainer.classList.add('writingStyles');
  fetch('https://gpt-cat.onrender.com/writingStyles')
    .then(async (res) => {
      let wstyles = await res.json();

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
        let writingStyle = event.target.value != '' ? 'Tone: ' + event.target.value : '';
        writingStyle = writingStyle.toString();

        const inp = document.getElementById("prompt-textarea");
        const alreadyValue = inp.value;
        let arr = []
        if (alreadyValue != '') {
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
            inp.value = writingStyle + '\n' + arr[0];
          }
        }
        else inp.value = writingStyle + '\n';
        const inputEvent = new Event('input', { bubbles: true });
        inp.dispatchEvent(inputEvent);
      });
    })
    .catch((error) => {
      console.error(error);
    });
}

//Adding bookmark functionality

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
  updateEmail();
  checkIsLoggedIn();

  if (window.location.href === 'https://chat.openai.com/?model=text-davinci-002-render-sha' || window.location.href === 'https://chat.openai.com/') {
    alert("Please refresh the browser");
    return;
  }

  const name = prompt('Please name the conversation:');
  if (name === null || name === '') {
    alert('Name cannot be empty.');
    return;
  }

  handleBookmark(email, name);
  alert('Bookmarked!');
});

const handleBookmark = async (email, name) => {
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
};



//Getting trending prompts

const getPrompts = () => {
  updateEmail();

  fetch("https://gpt-cat.onrender.com/")
    .then(response => response.json())
    .then(data => {
      console.log(data);
      globalData = data;
      const element = document.querySelector("#__next > div.relative.z-0.flex.h-full.w-full.overflow-hidden > div.relative.flex.h-full.max-w-full.flex-1.flex-col.overflow-hidden > main > div.flex.h-full.flex-col > div.flex-1.overflow-hidden > div > div.flex.h-full.w-full.pb-2.md\\:pb-\\[8vh\\]");

      if (element) {
        const waste = document.querySelector("#__next > div.relative.z-0.flex.h-full.w-full.overflow-hidden > div.relative.flex.h-full.max-w-full.flex-1.flex-col.overflow-hidden > main > div.flex.h-full.flex-col > div.w-full.pt-2.md\\:pt-0.border-t.md\\:border-t-0.dark\\:border-white\\/20.md\\:border-transparent.md\\:dark\\:border-transparent.md\\:pl-2.gizmo\\:pl-0.gizmo\\:md\\:pl-0.md\\:w-\\[calc\\(100\\%-\\.5rem\\)\\].absolute.bottom-0.left-0.md\\:bg-vert-light-gradient.bg-white.dark\\:bg-gray-800.md\\:\\!bg-transparent.dark\\:md\\:bg-vert-dark-gradient > form > div > div:nth-child(1) > div");
        waste.innerHTML = ''
        const waste2 = document.querySelector("#__next > div.relative.z-0.flex.h-full.w-full.overflow-hidden > div.relative.flex.h-full.max-w-full.flex-1.flex-col.overflow-hidden > main > div.flex.h-full.flex-col > div.flex-1.overflow-hidden > div > div.px-2.w-full.flex.flex-col.py-2.md\\:py-6.sticky.top-0");
        waste2.innerHTML = ''

        const heading = document.createElement("h1");
        heading.innerText = "GPT Cat : Trending prompts";
        heading.style.margin = '5vh auto 2.5vh auto';
        heading.style.textAlign = 'center';
        element.innerHTML = ''
        // element.style.backgroundColor='purple'
        element.style.display = 'flex'
        element.style.flexDirection = 'column'
        element.appendChild(heading);
        element.style.paddingBottom = '0'
        element.style.marginBottom = '0'

        if (document.getElementsByClassName('switch-cat-gpt').length > 0) {
          return;
        }
        const button = document.createElement("button");
        button.innerText = "Switch to Private";
        button.style.margin = 'auto'
        button.style.display = 'block';
        button.style.marginBottom = "10px";
        button.style.backgroundColor = "#202123";
        button.style.color = "white";
        button.style.padding = "10px 20px";
        button.style.width = '30%';
        button.classList.add('switch-cat-gpt');

        const categorySelect = document.createElement("select");
        categorySelect.style.backgroundColor = '#202123';
        categorySelect.style.borderColor = '#202123';
        categorySelect.style.margin = 'auto'
        categorySelect.style.display = 'block';
        categorySelect.style.marginBottom = "10px";
        categorySelect.style.textAlign = 'center';
        categorySelect.style.fontSize = '15px';
        categorySelect.style.width = '30%';
        categorySelect.classList.add('switch-cat-gpt');

        const defaultOption = document.createElement("option");
        defaultOption.style.backgroundColor = '#40414f';
        defaultOption.value = "default";
        defaultOption.text = "Select a Category";
        categorySelect.appendChild(defaultOption);


        fetch("https://gpt-cat.onrender.com/getCategories")
          .then((res) => res.json())
          .then(categoryData => {
            categoryData.forEach(category => {
              const option = document.createElement("option");
              option.style.backgroundColor = '#40414f';
              option.value = category.name;
              option.text = category.name;
              categorySelect.appendChild(option);
            });
          });

        categorySelect.addEventListener("change", (event) => {
          const currentCategory = event.target.value;
          let url = `https://gpt-cat.onrender.com/getTopPromptsByCategory/${currentCategory}`;
          if (currentCategory == 'default') url = 'https://gpt-cat.onrender.com/';
          fetch(url)
            .then(response => response.json())
            .then(updatedData => {
              modifyHTML(element, updatedData);
            })
            .catch(error => {
              console.error(error);
            });
        });

        button.addEventListener("click", () => {
          if (button.innerText === "Switch to Private") {
            updateEmail();
            checkIsLoggedIn();
            categorySelect.style.display = 'none';
            fetch(`https://gpt-cat.onrender.com/getUserPrompts/${email}`)
              .then(response => response.json())
              .then(updatedData => {
                modifyHTML(element, updatedData);
                button.innerText = "Switch to Public";
                heading.innerText = 'GPT Cat : Private prompts'
              })
              .catch(error => {
                console.error(error);
              });
          } else {
            categorySelect.style.display = 'block';
            fetch("https://gpt-cat.onrender.com/")
              .then(response => response.json())
              .then(updatedData => {
                modifyHTML(element, updatedData);
                button.innerText = "Switch to Private";
                heading.innerText = 'GPT Cat : Trending prompts'
              })
              .catch(error => {
                console.error(error);
              });
          }
        });

        heading.insertAdjacentElement("afterend", categorySelect);
        heading.insertAdjacentElement("afterend", button);
        modifyHTML(element, data);
      } else {
        console.log("Element not found.");
      }
    })
    .catch(error => {
      console.error(error);
    });
};

//Modifying website to display trending prompts

const modifyHTML = (element, data) => {
  updateEmail();
  globalData = data;
  const boxSpacing = "10px";

  const gptbox = `
  <div style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center; margin: auto; width: 70%; overflow:scroll; margin-top:2.5vh; padding-top:0"; class='gpt-cat-prompt-box' >
    ${data
      .map(
        (file, index) => `
        <div key=${index} class="prompt-box" style="background-color: #3e3f4b; width: 31%; height: auto; color: white; margin-bottom: ${boxSpacing}; margin-right: ${boxSpacing}; padding: ${boxSpacing}; border-radius: 5px;">
          <input type="hidden" name="index" value="${index}">
          <div class="popover" style="position: relative;">
            <p style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-size:18px; font-weight:bold">${file.name}</p>
            <div class="popover-content" style="display: none; position: absolute; top: 115%; left: 0%; width: 100%; background-color:#202123; padding: 10px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);overflow: visible; !important; z-index:999">
                <p style=" color:#ffffff; white;font-weight: bold; !important;">Prompt Name: ${file.name}</p>
                <p style=" color:#ffffff; white;font-weight: bold; !important;">Author: ${file.publicAuthorName}</p> <!-- Added line to display author name -->
            </div>
          </div>
          <div style="display: flex; flex-direction: column; align-items: flex-start; justify-content: flex-start; color: white; width:100%;
          overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
            <p style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;margin-bottom: 2vh; font-size:15px">${file.content}</p>
            <div style="height:10%;display:flex; width:100%;">
              <input type="hidden" name="id" value="${file._id}">
              <input type="hidden" name="index" value="${index}">
              <input type="hidden" name="isLiked" value="${file.likedBy.includes(email)}">
              <input type="hidden" name="isStarred" value="${file.starredBy.includes(email)}">
              <button style="color:white;cursor: pointer; width: 8%; margin-right:0.3vw" data-like-button>
                <img class="gpt-like-button" src=${file.likedBy.includes(email) ? thumbsUpSolid : thumbsUpRegular} style="width:100%;height:100%" alt="Like button">
              </button>
              <p style="margin-right: auto; font-size:10px">${file.likes ? file.likes : 0} </p>
              <button title="Promotional link" style="color:white;cursor: pointer; width: 8% ;margin-right:0.3vw">
                <a href=${file.link}>
                  <img src=${linkSolid} style="width:100%;height:100%" alt="Copy prompt">
                </a>
              </button>
              <button class="copy-button" style="color:white;cursor: pointer; width: 5% ;margin-right:0.3vw" copy-button>
                <img class="gpt-star-button" src=${clipboardRegular} style="width:100%;height:100%" alt="Copy prompt">
              </button>
              <button style="color:white;cursor: pointer; width: 8%" data-star-button>
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
  const elementToRemove = document.querySelector('.gpt-cat-prompt-box');
  if (elementToRemove) {
    element.removeChild(elementToRemove);
  }
  element.insertAdjacentHTML('beforeend', gptbox);



  const popoverElements = document.getElementsByClassName("popover");
  Array.from(popoverElements).forEach((popoverElement) => {
    const popoverContent = popoverElement.querySelector(".popover-content");
    let timeoutId;

    popoverElement.addEventListener("mouseenter", () => {
      timeoutId = setTimeout(() => {
        popoverContent.style.display = "block";
      }, 1000);
    });

    popoverElement.addEventListener("mouseleave", () => {
      clearTimeout(timeoutId);
      popoverContent.style.display = "none";
    });
  });


  attachLikeEventListeners();
  attachStarEventListeners();
  attachCopyEventListeners();
}



// Attaching Event Listeners for copy, like and starring

const attachCopyEventListeners = () => {
  const boxes = document.getElementsByClassName('copy-button');
  const boxesArray = Array.from(boxes);
  boxesArray.forEach((box) => {
    box.addEventListener('click', () => {
      handleCopy(box);
    });
  });
};

const attachLikeEventListeners = () => {
  const likeButtons = document.querySelectorAll('button[data-like-button]');
  likeButtons.forEach(button => {
    button.addEventListener('click', () => {
      handleLike(button);
    });
  });
};

const attachStarEventListeners = () => {
  const starButtons = document.querySelectorAll('button[data-star-button]');
  starButtons.forEach(button => {
    button.addEventListener('click', () => {
      handleStar(button);
    });
  });
};



//Handling copy, like and starring events

const handleCopy = (box) => {
  const ind = box.parentNode.querySelector("input[name='index']").value;
  const text = globalData[ind].content;
  const inp = document.getElementById("prompt-textarea");
  const alreadyValue = inp.value;
  let arr = []
  if (alreadyValue != '') {
    arr = alreadyValue.split("\n");
  }
  if (arr.length === 2) {
    inp.value = arr[0] + '\n' + 'Prompt: ' + text;
  }
  else if (arr.length === 1) {
    if (arr[0][0] == 'T') {
      inp.value = arr[0] + '\n' + 'Prompt: ' + text;
    }
    else if (arr[0][0] == 'P') {
      inp.value = 'Prompt: ' + text;
    }
  }
  else inp.value = 'Prompt: ' + text;
  const inputEvent = new Event('input', { bubbles: true });
  inp.dispatchEvent(inputEvent);
}

const handleLike = async (button) => {
  updateEmail();
  checkIsLoggedIn();
  const id = button.parentNode.querySelector("input[name='id']").value;
  const isLiked = button.parentNode.querySelector("input[name='isLiked']").value;
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

const handleStar = async (button) => {
  updateEmail();
  checkIsLoggedIn();
  const id = button.parentNode.querySelector("input[name='id']").value;
  const isStarred = button.parentNode.querySelector("input[name='isStarred']").value;
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



//HANDLING MUTATIONS

const homePageObserverCallback = function (mutationsList, observer) {
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      const element = document.querySelector("#__next > div.relative.z-0.flex.h-full.w-full.overflow-hidden > div.relative.flex.h-full.max-w-full.flex-1.flex-col.overflow-hidden > main > div.flex.h-full.flex-col > div.flex-1.overflow-hidden > div > div.flex.h-full.w-full.pb-2.md\\:pb-\\[8vh\\]");

      if (element) {
        observer.disconnect();
        getPrompts();
        break;
      }
    }
  }
};

if (window.location.href === 'https://chat.openai.com/?model=text-davinci-002-render-sha' || window.location.href === 'https://chat.openai.com/' || window.location.href === 'https://chat.openai.com/?model=text-davinci-002-render-sha/#' || window.location.href === 'https://chat.openai.com/#') {

  let homePageObserver = new MutationObserver(homePageObserverCallback);
  homePageObserver.observe(document.body, { childList: true, subtree: true });
}

addWritingStyle();

function checkURL() {
  if (window.location.href !== checkURL.lastURL) {
    if (window.location.href === 'https://chat.openai.com/?model=text-davinci-002-render-sha' || window.location.href === 'https://chat.openai.com/' || window.location.href === 'https://chat.openai.com/?model=text-davinci-002-render-sha/#' || window.location.href === 'https://chat.openai.com/#') {

      let homePageObserver = new MutationObserver(homePageObserverCallback);
      homePageObserver.observe(document.body, { childList: true, subtree: true });
    }

    addWritingStyle();
    checkURL.lastURL = window.location.href;
  }
  setTimeout(checkURL, 1000); 
}

checkURL.lastURL = window.location.href;
checkURL();


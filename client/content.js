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

addWritingStyle();

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
      const element = document.querySelector("#__next > div.overflow-hidden.w-full.h-full.relative.flex.z-0 > div.relative.flex.h-full.max-w-full.flex-1.overflow-hidden > div > main > div.flex-1.overflow-hidden > div > div > div > div.text-gray-800.w-full.mx-auto.md\\:max-w-2xl.lg\\:max-w-3xl.md\\:h-full.md\\:flex.md\\:flex-col.px-6.dark\\:text-gray-100 > div");

      if (element) {
        const changeMargin = document.querySelector("#__next > div.overflow-hidden.w-full.h-full.relative.flex.z-0 > div.relative.flex.h-full.max-w-full.flex-1.overflow-hidden > div > main > div.flex-1.overflow-hidden > div > div > div > div.text-gray-800.w-full.mx-auto.md\\:max-w-2xl.lg\\:max-w-3xl.md\\:h-full.md\\:flex.md\\:flex-col.px-6.dark\\:text-gray-100 > h1");
        changeMargin.style.marginTop = "2vh";

        const heading = document.querySelector("#__next > div.overflow-hidden.w-full.h-full.relative.flex.z-0 > div.relative.flex.h-full.max-w-full.flex-1.overflow-hidden > div > main > div.flex-1.overflow-hidden > div > div > div > div.text-gray-800.w-full.mx-auto.md\\:max-w-2xl.lg\\:max-w-3xl.md\\:h-full.md\\:flex.md\\:flex-col.px-6.dark\\:text-gray-100 > h1");
        heading.innerText = "GPT Cat : Trending prompts";

        if (document.getElementsByClassName('switch-cat-gpt').length > 0) {
          return;
        }
        const button = document.createElement("button");
        button.innerText = "Switch to Private";
        button.style.marginBottom = "10px";
        button.style.backgroundColor = "#202123";
        button.style.color = "white";
        button.style.padding = "10px 20px";
        button.style.width = '100%';
        button.classList.add('switch-cat-gpt');

        const categorySelect = document.createElement("select");
        categorySelect.style.backgroundColor = '#202123';
        categorySelect.style.borderColor = '#202123';
        categorySelect.style.marginBottom = "10px";
        categorySelect.style.textAlign= 'center';
        categorySelect.style.fontSize='15px';
        categorySelect.style.width = '100%';
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
  element.innerHTML = "";
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
                <p style=" color:#ffffff; white;font-weight: bold; !important;">Prompt Name: ${file.name}</p>
                <p style=" color:#ffffff; white;font-weight: bold; !important;">Author: ${file.publicAuthorName}</p> <!-- Added line to display author name -->
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
              <button title="Promotional link" style="color:white;cursor: pointer; width: 10% ;margin-right:0.3vw">
                <a href=${file.link}>
                  <img src=${linkSolid} style="width:100%;height:100%" alt="Copy prompt">
                </a>
              </button>
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

  element.classList.add('gpt-cat-prompt-box');


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
      const element = document.querySelector("#__next > div.overflow-hidden.w-full.h-full.relative.flex.z-0 > div.relative.flex.h-full.max-w-full.flex-1.overflow-hidden > div > main > div.flex-1.overflow-hidden > div > div > div > div.text-gray-800.w-full.mx-auto.md\\:max-w-2xl.lg\\:max-w-3xl.md\\:h-full.md\\:flex.md\\:flex-col.px-6.dark\\:text-gray-100 > div");

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

document.addEventListener('click', () => {
  setTimeout(() => {
    const doesWritingStylesExist = document.getElementsByClassName('writingStyles');
    if (doesWritingStylesExist.length === 0) addWritingStyle();

    if (window.location.href === 'https://chat.openai.com/?model=text-davinci-002-render-sha' || window.location.href === 'https://chat.openai.com/' || window.location.href === 'https://chat.openai.com/?model=text-davinci-002-render-sha/#' || window.location.href === 'https://chat.openai.com/#') {
      const doesElementExist = document.getElementsByClassName('gpt-cat-prompt-box');
      if (doesElementExist.length == 0) return;
      let homePageObserver = new MutationObserver(homePageObserverCallback);
      homePageObserver.observe(document.body, { childList: true, subtree: true });
    }
  }, 1000)
})
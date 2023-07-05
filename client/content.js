console.log("This is from Content Script.");
let email = '';

chrome.runtime.sendMessage({ action: 'getValue' }, function (response) {
  email = response.email;
});

const createBookmarkButton = () => {
  const button = document.createElement('button');
  button.style.position = 'fixed';
  button.style.bottom = '80px';
  button.style.right = '16px';
  button.style.padding = '10px';
  button.style.border = 'none';
  button.style.borderRadius = '50%';
  button.style.cursor = 'pointer';

  const icon = document.createElement('img');
  icon.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXj3VLdkPLOXpyxCpKsKMNk0JTyYyMJVoSTDURHqA&s';
  icon.style.width = '20px';
  icon.style.height = '20px';
  icon.style.objectFit = 'contain';
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
  if (email === null || email === undefined) alert('Please login in GPT Cat');
  sendBookmarkData(email, name);
  alert('Bookmarked!');

});

//Copy prompt
function copyToClipboard(element) {
  const inp = document.querySelector("#prompt-textarea");
  const range = document.createRange();

  range.selectNode(element);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  inp.value = range
  document.execCommand("copy");
  window.getSelection().removeAllRanges();

  const button = document.querySelector("#__next > div.overflow-hidden.w-full.h-full.relative.flex.z-0 > div.relative.flex.h-full.max-w-full.flex-1.overflow-hidden > div > main > div.absolute.bottom-0.left-0.w-full.border-t.md\\:border-t-0.dark\\:border-white\\/20.md\\:border-transparent.md\\:dark\\:border-transparent.md\\:bg-vert-light-gradient.bg-white.dark\\:bg-gray-800.md\\:\\!bg-transparent.dark\\:md\\:bg-vert-dark-gradient.pt-2.md\\:pl-2.md\\:w-\\[calc\\(100\\%-\\.5rem\\)\\] > form > div > div.flex.flex-col.w-full.py-\\[10px\\].flex-grow.md\\:py-4.md\\:pl-4.relative.border.border-black\\/10.bg-white.dark\\:border-gray-900\\/50.dark\\:text-white.dark\\:bg-gray-700.rounded-xl.shadow-xs.dark\\:shadow-xs > button");

  button.removeAttribute("disabled");
}

//Show copied status
function showMessage(message) {
  const messageElement = document.createElement("div");
  messageElement.textContent = message;
  messageElement.style.position = "fixed";
  messageElement.style.bottom = "20px";
  messageElement.style.left = "50%";
  messageElement.style.transform = "translateX(-50%)";
  messageElement.style.backgroundColor = "#000000";
  messageElement.style.color = "#ffffff";
  messageElement.style.padding = "10px";
  messageElement.style.borderRadius = "5px";

  document.body.appendChild(messageElement);

  setTimeout(() => {
    document.body.removeChild(messageElement);
  }, 2000);
}

async function increaseLikeCount(button) {
  console.log('increased');
  const id = button.parentNode.querySelector("input[name='id']").value;
  const isLiked = button.parentNode.querySelector("input[name='isLiked']").value;
  console.log(isLiked);
  const likeCountElement = button.parentNode.querySelector("p");
  const currentCount = parseInt(likeCountElement.textContent);
  if (email === null || email === undefined) alert('Please login in GPT Cat');

  if (isLiked == "false") {
    likeCountElement.textContent = currentCount + 1;
    button.parentNode.querySelector("input[name='isLiked']").value = "true";
    await fetch('http://localhost:5000/like', {
      method: 'POST',
      body: JSON.stringify({ id: id, email: email }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
  else {
    likeCountElement.textContent = currentCount - 1;
    button.parentNode.querySelector("input[name='isLiked']").value = "false";
    await fetch('http://localhost:5000/unlike', {
      method: 'POST',
      body: JSON.stringify({ id: id, email: email }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}

const attachLikeEventListeners = () => {
  const likeButtons = document.querySelectorAll('button[data-like-button]');
  likeButtons.forEach(button => {
    button.addEventListener('click', () => {
      increaseLikeCount(button);
    });
  });
}

//Show trending prompts
const modifyGPT = () => {
  console.log("changing");
  fetch("http://localhost:5000/")
    .then(response => response.json())
    .then(data => {
      console.log(data);
      const element = document.querySelector("#__next > div.overflow-hidden.w-full.h-full.relative.flex.z-0 > div.relative.flex.h-full.max-w-full.flex-1.overflow-hidden > div > main > div.flex-1.overflow-hidden > div > div > div > div.text-gray-800.w-full.mx-auto.md\\:max-w-2xl.lg\\:max-w-3xl.md\\:h-full.md\\:flex.md\\:flex-col.px-6.dark\\:text-gray-100 > div");

      if (element) {
        const changeMargin = document.querySelector("#__next > div.overflow-hidden.w-full.h-full.relative.flex.z-0 > div.relative.flex.h-full.max-w-full.flex-1.overflow-hidden > div > main > div.flex-1.overflow-hidden > div > div > div > div.text-gray-800.w-full.mx-auto.md\\:max-w-2xl.lg\\:max-w-3xl.md\\:h-full.md\\:flex.md\\:flex-col.px-6.dark\\:text-gray-100 > h1");
        changeMargin.style.marginTop = "5vh";

        const heading = document.querySelector("#__next > div.overflow-hidden.w-full.h-full.relative.flex.z-0 > div.relative.flex.h-full.max-w-full.flex-1.overflow-hidden > div > main > div.flex-1.overflow-hidden > div > div > div > div.text-gray-800.w-full.mx-auto.md\\:max-w-2xl.lg\\:max-w-3xl.md\\:h-full.md\\:flex.md\\:flex-col.px-6.dark\\:text-gray-100 > h1");
        heading.innerText = "GPT Cat : Trending prompts";

        element.innerHTML = ""

        const boxSize = "30%";
        const boxSpacing = "10px";

        element.innerHTML = `
        <div style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center; padding: ${boxSpacing}; margin: 0; width: 100%;">
          ${data.map((file) => `
            <div style="background-color: #3e3f4b; width: ${boxSize}; height: auto; color: white; margin-bottom: ${boxSpacing}; margin-right: ${boxSpacing}; padding: ${boxSpacing}; border-radius: 5px; overflow: hidden;">
              <h3 style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">${file.name}</h3>
              <div style="display: flex; flex-direction: column; align-items: flex-start; justify-content: flex-start; color: white;">
                <p style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;margin-bottom: 2vh">${file.content}</p>
                <div style="display:flex; width:100%; justify-content: space-between;">
                  <p style="margin-right:0.3vw">${file.likes ? file.likes : 0} </p>
                  <input type="hidden" name="id" value="${file._id}">
                  <input type="hidden" name="isLiked" value="${file.likedBy.includes(email)}">
                  <button style="cursor: pointer; margin-right: auto;" data-like-button>Likes</button>
                  <button style="cursor: pointer; margin-left: auto;" onclick="copyToClipboard(this.parentNode.querySelector('p')); showMessage('Copied')">Copy</button>
                </div>
              </div>
            </div>      
          `).join("")}
        </div>
      `;
        attachLikeEventListeners();

      } else {
        console.log("Element not found.");
      }
    })
    .catch(error => {
      console.error(error);
    });
}

//bookmark chat gpt conversation upto that point
const sendBookmarkData = async (email, name) => {
  // let x = document.getElementsByClassName("empty:hidden");
  // x = Array.from(x);
  // x = x.map((query) => query.innerText);
  // if (x.length > 0) {
  //   x.shift();
  // }

  // let y = document.getElementsByClassName("markdown");
  // y = Array.from(y);
  // y = y.map((query) => query.innerText);

  await fetch("http://localhost:5000/bookmark/", {
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

window.addEventListener('click', () => {
  console.log('clicked');
  if (window.location.href != url) {
    console.log(window.location.href);
    url = window.location.href;
    let observer = new MutationObserver(observerCallback);
    observer.observe(document.body, { childList: true, subtree: true });

  }
})

if (window.location.href === 'https://chat.openai.com/?model=text-davinci-002-render-sha' || window.location.href === 'https://chat.openai.com/') {

  let observer = new MutationObserver(observerCallback);
  observer.observe(document.body, { childList: true, subtree: true });
}
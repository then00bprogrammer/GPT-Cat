console.log("This is from Content Script.");

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
document.body.appendChild(button);

button.addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'getValue' }, function (response) {
    let email = response.email;
    if(email===null || email===undefined) alert('Please login in GPT Cat');
    sendBookmarkData(email);
    alert('Bookmarked!');
  });
});


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

function modifyGPT() {
  console.log("changing");
  fetch("http://localhost:5000/")
    .then(response => response.json())
    .then(data => {
      const changeMargin = document.querySelector("#__next > div.overflow-hidden.w-full.h-full.relative.flex.z-0 > div.relative.flex.h-full.max-w-full.flex-1.overflow-hidden > div > main > div.flex-1.overflow-hidden > div > div > div > div.text-gray-800.w-full.mx-auto.md\\:max-w-2xl.lg\\:max-w-3xl.md\\:h-full.md\\:flex.md\\:flex-col.px-6.dark\\:text-gray-100 > h1");

      changeMargin.style.marginTop = "5vh";

      const heading = document.querySelector("#__next > div.overflow-hidden.w-full.h-full.relative.flex.z-0 > div.relative.flex.h-full.max-w-full.flex-1.overflow-hidden > div > main > div.flex-1.overflow-hidden > div > div > div > div.text-gray-800.w-full.mx-auto.md\\:max-w-2xl.lg\\:max-w-3xl.md\\:h-full.md\\:flex.md\\:flex-col.px-6.dark\\:text-gray-100 > h1");
      heading.innerText = "Trending prompts";

      const element = document.querySelector("#__next > div.overflow-hidden.w-full.h-full.relative.flex.z-0 > div.relative.flex.h-full.max-w-full.flex-1.overflow-hidden > div > main > div.flex-1.overflow-hidden > div > div > div > div.text-gray-800.w-full.mx-auto.md\\:max-w-2xl.lg\\:max-w-3xl.md\\:h-full.md\\:flex.md\\:flex-col.px-6.dark\\:text-gray-100 > div");
      element.innerHTML = ""

      if (element) {
        const boxSize = "30%";
        const boxSpacing = "10px";

        element.innerHTML = `
            <div style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center; padding: ${boxSpacing}; margin: 0; width: 100%;">
              ${data
            .map(
              (file) => `
                    <div style="background-color: #3e3f4b; width: ${boxSize}; height: auto; color: white; margin-bottom: ${boxSpacing}; margin-right: ${boxSpacing}; padding: ${boxSpacing}; border-radius: 5px; overflow: hidden;">
                      <h3 style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">${file.name}</h3>
                      <div style="display: flex; flex-direction: row; align-items: space-between; justify-content: space-between; color: white;">
                        <p style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">${file.content}</p>
                        <button style="cursor: pointer;" onclick="copyToClipboard(this.parentNode.querySelector("p")); showMessage("Copied")">Copy</button>
                      </div>
                    </div>
                  `
            )
            .join("")}
            </div>
          `;

      } else {
        console.log("Element not found.");
      }
    })
    .catch(error => {
      console.error(error);
    });
}

async function sendBookmarkData(email) {
  let x = document.getElementsByClassName("empty:hidden");
  x = Array.from(x);
  x = x.map((query) => query.innerText);
  if (x.length > 0) {
    x.shift();
  }

  let y = document.getElementsByClassName("markdown");
  y = Array.from(y);
  y = y.map((query) => query.innerText);

  await fetch("http://localhost:5000/bookmark/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: email,
      queries: x,
      response: y
    })
  });
}
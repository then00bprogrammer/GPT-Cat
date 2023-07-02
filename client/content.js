const createButton = (iconSrc, position) => {
    const buttonStyle = {
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        position: 'fixed',
        bottom: position,
        right: '2vh',
        background: 'none',
        color: 'black',
        zIndex: '9999',
        transition: 'filter 0.3s ease',
    };

    const button = document.createElement('button');
    Object.assign(button.style, buttonStyle);

    const icon = document.createElement('img');
    icon.src = iconSrc;
    icon.style.width = '100%';
    icon.style.height = 'auto';

    button.appendChild(icon);

    button.addEventListener('mouseover', () => {
        button.style.filter = 'brightness(80%)';
    });

    button.addEventListener('mouseout', () => {
        button.style.filter = 'brightness(100%)';
    });

    return button;
};

const bookmarkButton = createButton('https://i.pinimg.com/564x/80/43/0d/80430d18c337a36b45fb9d59b89be6b6.jpg', '2vh');
bookmarkButton.addEventListener('click', () => {
    console.log('Bookmark button clicked!');
});
document.body.appendChild(bookmarkButton);

const twitterButton = createButton('https://i.pinimg.com/564x/5d/a1/61/5da1613a64808518bd07037936c0fb25.jpg', '12vh');
twitterButton.addEventListener('click', () => {
    console.log('Twitter button clicked!');
});
document.body.appendChild(twitterButton);

console.log('yeah bitch! science');

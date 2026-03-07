let allElem = document.querySelectorAll('.elem');
let fullElem = document.querySelectorAll('.fullElem');
let fullElemBackButton = document.querySelectorAll('.fullElem .back');


allElem.forEach( function(elem){
    elem.addEventListener('click', () => {
        setTimeout( () => {
            fullElem[elem.id].style.display = 'block';
        },200);
    })
})

fullElemBackButton.forEach( function(back){
    back.addEventListener('click', () => {
        fullElem[back.id].style.display = 'none';
    })
})
'use strict'

var gImgs = [{ id: 1, url: 'img/1.jpg', keywords: ['Donald', 'Trump', 'man'] },
{ id: 2, url: 'img/2.jpg', keywords: ['puppies', 'puppy', 'dog', 'dogs', 'cute'] },
{ id: 3, url: 'img/3.jpg', keywords: ['baby', 'dog', 'cute', 'sleep'] },
{ id: 4, url: 'img/4.jpg', keywords: ['cat', 'sleep', 'laptop'] },
{ id: 5, url: 'img/5.jpg', keywords: ['baby', 'seccess', 'cute'] },
{ id: 6, url: 'img/6.jpg', keywords: ['hair', 'big', 'man', 'hands'] },
{ id: 7, url: 'img/7.jpg', keywords: ['baby', 'eyes', 'cute'] },
{ id: 8, url: 'img/8.jpg', keywords: ['hat', 'smile', 'man'] },
{ id: 9, url: 'img/9.jpg', keywords: ['baby', 'laugh', 'cute'] },
{ id: 10, url: 'img/10.jpg', keywords: ['obama', 'laugh', 'man'] },
{ id: 11, url: 'img/11.jpg', keywords: ['kiss', 'men', 'man', 'basketball'] },
{ id: 12, url: 'img/12.jpg', keywords: ['fingers', 'sunshine', 'man'] },
{ id: 13, url: 'img/13.jpg', keywords: ['dicaprio', 'cheers', 'wine', 'man'] },
{ id: 14, url: 'img/14.jpg', keywords: ['morpheus', 'glasses', 'bold', 'man'] },
{ id: 15, url: 'img/15.jpg', keywords: ['stark', 'zero', 'man', 'hair'] },
{ id: 16, url: 'img/16.jpg', keywords: ['laugh', 'hand', 'man'] },
{ id: 17, url: 'img/17.jpg', keywords: ['putin', 'fingers','two', 'suit', 'man'] },
{ id: 18, url: 'img/18.jpg', keywords: ['toy', 'story', 'buzz', 'woody'] },
]

var gMeme = {
    selectedImg: { id: 5, url: 'img/5.jpg', keywords: ['baby', 'seccess', 'cute'] },
    selectedLineIdx: 0,
    lines: [
        {
            text: '',
            textWidth: 0,
            textHeight: 0,
            size: 20,
            fontColor: 'red',
            fillColor: 'blue',
            fontFamily: 'Arial',
            pos: {x: 0 , y: 0},
            isDrag: false
        }
    ]
}

function getImages() {
    return gImgs
}


function getMeme() {
    return gMeme
}

function updateCurrMeme(img) {
    gMeme.selectedImg = getImgById(+img.id)
}

function getImgById(imgId) {
    return gImgs.find(image => image.id === imgId)
}

function updateTxt(txt) {
    const lineIdx = gMeme.selectedLineIdx
    gMeme.lines[lineIdx].text = txt
}

function addLine() {
    gMeme.lines.push({
        text: 'Add text',
        size: 20,
        color: 'black'
    })
    gMeme.selectedLineIdx++
}

function getCoordinates() {
    const currIdx = gMeme.selectedLineIdx
    if (gMeme.lines[currIdx].pos.x === 0 && gMeme.lines[currIdx].pos.y === 0) {   
        gMeme.lines[currIdx].pos.x = 200
        gMeme.lines[currIdx].pos.y = 70
    }
    return gMeme.lines[currIdx].pos
}

function changeFontSize(num) {
    const lineIdx = gMeme.selectedLineIdx
    gMeme.lines[lineIdx].size += num
}

function changeFontColor(color) {
    const currIdx = gMeme.selectedLineIdx
    gMeme.lines[currIdx].fontColor = color
}

function changeFillColor(color) {
    const currIdx = gMeme.selectedLineIdx
    gMeme.lines[currIdx].fillColor = color
}

function updateTxtLength(txtWidth, txtHeight) {
    const currIdx = gMeme.selectedLineIdx
    gMeme.lines[currIdx].textWidth = txtWidth
    gMeme.lines[currIdx].textHeight = txtHeight
}

function isTextClicked(position) {
    const currIdx = gMeme.selectedLineIdx
    const posX = gMeme.lines[currIdx].pos.x
    const posY = gMeme.lines[currIdx].pos.y
    const txtWidth = gMeme.lines[currIdx].textWidth
    const txtHeight = gMeme.lines[currIdx].textHeight
    const leftBound = posX - (txtWidth/2) - 2
    const rightBound = posX + (txtWidth/2) + 2
    const upperBound = posY - (txtHeight/2) -2
    const lowerBound = posY + (txtHeight/2) +2
   
    if(position.x>leftBound && position.x < rightBound && position.y < lowerBound && position.y > upperBound) 
        return true
    return false
    
}

function setTextDrag(isDrag) {
    const currIdx = gMeme.selectedLineIdx
    gMeme.lines[currIdx].isDrag = isDrag
  }

  function moveText(dx, dy) {
    gMeme.lines[gMeme.selectedLineIdx].pos.x += dx
    gMeme.lines[gMeme.selectedLineIdx].pos.y += dy
  }




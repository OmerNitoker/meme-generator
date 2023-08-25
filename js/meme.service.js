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
{ id: 17, url: 'img/17.jpg', keywords: ['putin', 'fingers', 'two', 'suit', 'man'] },
{ id: 18, url: 'img/18.jpg', keywords: ['toy', 'story', 'buzz', 'woody'] },
]

var gMeme = {
    selectedImg: { id: 5, url: 'img/5.jpg', keywords: ['baby', 'seccess', 'cute'] },
    selectedLineIdx: 0,
    lines: [
        {
            text: 'Add text',
            textWidth: 0,
            textHeight: 0,
            size: 20,
            fontColor: 'black',
            fillColor: 'blue',
            fontFamily: 'Arial',
            pos: { x: 0, y: 0 },
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
        text: 'Add text2',
        textWidth: 0,
        textHeight: 0,
        size: 20,
        fontColor: 'black',
        fillColor: 'blue',
        fontFamily: 'Arial',
        pos: { x: 0, y: 0 },
        isDrag: false
    })
    gMeme.selectedLineIdx = gMeme.lines.length-1
}

function getCoordinates(canvas, idx) {
    // const idx = gMeme.selectedLineIdx
    if (gMeme.lines[idx].pos.x === 0 && gMeme.lines[idx].pos.y === 0) {
        gMeme.lines[idx].pos.x = canvas.width / 2
        if (idx === 0) gMeme.lines[idx].pos.y = 20
        else if (idx === 1) gMeme.lines[idx].pos.y = canvas.height - 20
        else gMeme.lines[idx].pos.y = canvas.height / 2
    }
    // console.log('gMeme.lines[currIdx].pos:',gMeme.lines[idx].pos)

    return gMeme.lines[idx].pos
}

function locateText(canvas) {
    const currIdx = gMeme.selectedLineIdx
    if (gMeme.lines[currIdx].pos.x === 0 && gMeme.lines[currIdx].pos.y === 0) {
        canvas.textAlign = "center"
        if (currIdx === 0) canvas.textAlign = "start"
    }
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
    if (currIdx === -1) return
    gMeme.lines[currIdx].textWidth = txtWidth
    gMeme.lines[currIdx].textHeight = txtHeight
}

function isTextClicked(position) {
    for (let i =0 ; i<gMeme.lines.length ; i++) {
        const currLine = gMeme.lines[i]
        const posX = currLine.pos.x
        const posY = currLine.pos.y
        const txtWidth = currLine.textWidth
        const txtHeight = currLine.textHeight
        const leftBound = posX - (txtWidth / 2) - 2
        const rightBound = posX + (txtWidth / 2) + 2
        const upperBound = posY - (txtHeight / 2) - 2
        const lowerBound = posY + (txtHeight / 2) + 2
        
        if (position.x > leftBound && position.x < rightBound && position.y < lowerBound && position.y > upperBound) {
            gMeme.selectedLineIdx = i
            return true
        }
}
return false

}

function setTextDrag(isDrag) {
    const currIdx = gMeme.selectedLineIdx
    if (currIdx === -1) return
    gMeme.lines[currIdx].isDrag = isDrag
}

function moveText(dx, dy) {
    gMeme.lines[gMeme.selectedLineIdx].pos.x += dx
    gMeme.lines[gMeme.selectedLineIdx].pos.y += dy
}

function selectNone() {
    gMeme.selectedLineIdx = -1
}

function deleteLine() {
    if (gMeme.selectedLineIdx === -1) return
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    gMeme.selectedLineIdx = -1
}




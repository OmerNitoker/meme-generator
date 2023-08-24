'use strict'

var gElCanvas
var gCtx
var gStartPos
const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    addListeners()
    rendergallery()
}

function rendergallery() {
    const elGallery = document.querySelector('.grid-container')
    const images = getImages()
    const strHtmls = images.map(image => `<img src="${image.url}" id="${image.id}" onclick="onImageClicked(this)">`)
    elGallery.innerHTML = strHtmls.join('')
}

function onImageClicked(elImg) {
    toggleGallery()
    toggleEditor()
    updateCurrMeme(elImg)
    renderMeme()
}

function renderMeme() {
    console.log('rendered!')
    
    const currMeme = getMeme()
    const elImage = document.getElementById(currMeme.selectedImg.id)
    gElCanvas.height = (elImage.naturalHeight / elImage.naturalWidth) * gElCanvas.width
    gCtx.drawImage(elImage, 0, 0, gElCanvas.width, gElCanvas.height)
    drawText(currMeme)
}

function addListeners() {
    addMouseListeners()
    addTouchListeners()
}

function drawText(meme) {
    console.log('meme:',meme)
    
    const currIdx = meme.selectedLineIdx
    const fontStr = `${meme.lines[currIdx].size}px ${meme.lines[currIdx].fontFamily}`
    const text = meme.lines[currIdx].text
    gCtx.lineWidth = 2
    gCtx.strokeStyle = meme.lines[currIdx].fontColor
    gCtx.fillStyle = meme.lines[currIdx].fillColor
    gCtx.font = fontStr
    gCtx.textAlign = 'center'
    gCtx.textBaseline = 'middle'

    const { x, y } = getCoordinates()

    gCtx.fillText(text, x, y)
    gCtx.strokeText(text, x, y)
    const txtWidth = gCtx.measureText(text).width
    const txtHeight = gCtx.measureText(text).actualBoundingBoxAscent + gCtx.measureText(text).actualBoundingBoxDescent
    updateTxtLength(txtWidth, txtHeight)
}

function onChangeTxt(txt) {
    updateTxt(txt)
    renderMeme()
}

function onAddLine() {
    addLine()
}

function onDownloadCanvas(elBtn) {
    const dataUrl = gElCanvas.toDataURL()
    elBtn.href = dataUrl
    elBtn.download = 'my-img'
}

function onGalleryClicked() {
    toggleGallery()
    toggleEditor()
}

function toggleGallery() {
    const elGallery = document.querySelector('.gallery-container')
    elGallery.classList.toggle('hide')
}

function toggleEditor() {
    const elEditor = document.querySelector('.editor-container')
    elEditor.querySelector('.meme-canvas').classList.toggle('hide')
    elEditor.querySelector('.editor').classList.toggle('hide')
}

function onChangeFontSize(num) {
    changeFontSize(num)
    renderMeme()
}

function onSetFontColor(clr) {
    changeFontColor(clr)
    renderMeme()
}

function onSetFillColor(clr) {
    changeFillColor(clr)
    renderMeme()
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchend', onUp)
}

function onDown(ev) {
    const pos = getEvPos(ev)

    if (!isTextClicked(pos)) return
    setTextDrag(true)
    //Save the pos we start from
    gStartPos = pos
    document.body.style.cursor = 'grabbing'
}

function onMove(ev) {
    const isDrag = getMeme().lines[gMeme.selectedLineIdx].isDrag
    if (!isDrag) return
    const pos = getEvPos(ev)
    const dx = pos.x - gStartPos.x
    const dy = pos.y - gStartPos.y
    moveText(dx, dy)
    gStartPos = pos
    renderMeme()
}

function onUp() {
    // console.log('onUp')
    setTextDrag(false)
    document.body.style.cursor = 'grab'

}

function getEvPos(ev) {

    let pos = {
        x: ev.offsetX,
        y: ev.offsetY,
    }

    if (TOUCH_EVS.includes(ev.type)) {
        // Prevent triggering the mouse ev
        ev.preventDefault()
        // Gets the first touch point
        ev = ev.changedTouches[0]
        // Calc the right pos according to the touch screen
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
        }
    }
    return pos
}

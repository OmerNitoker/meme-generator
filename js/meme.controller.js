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

    window.addEventListener('resize', resizeCanvas)
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
    const currMeme = getMeme()
    const currIdx = currMeme.selectedLineIdx
    const elImage = document.getElementById(currMeme.selectedImg.id)
    gElCanvas.height = (elImage.naturalHeight / elImage.naturalWidth) * gElCanvas.width
    gCtx.drawImage(elImage, 0, 0, gElCanvas.width, gElCanvas.height)
    for (let i = 0; i < currMeme.lines.length; i++) {
        drawText(currMeme.lines[i], i)
    }
    drawRect()
}

function addListeners() {
    addMouseListeners()
    addTouchListeners()
}

function drawText(line, idx) {
    // const currIdx = meme.selectedLineIdx
    const fontStr = `${line.size}px ${line.fontFamily}`
    const text = line.text
    gCtx.lineWidth = 2
    gCtx.strokeStyle = line.fontColor
    gCtx.fillStyle = line.fillColor
    gCtx.font = fontStr
    gCtx.textAlign = 'center'
    gCtx.textBaseline = 'middle'

    const { x, y } = getCoordinates(gElCanvas, idx)

    gCtx.fillText(text, x, y)
    gCtx.strokeText(text, x, y)
    const txtWidth = gCtx.measureText(text).width
    const txtHeight = gCtx.measureText(text).actualBoundingBoxAscent + gCtx.measureText(text).actualBoundingBoxDescent
    updateTxtLength(txtWidth, txtHeight)
}

function onChangeTxt(txt) {
    updateTxt(txt)
    drawRect()
    renderMeme()
}

function onAddLine() {
    addLine()
    renderMeme()

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
    console.log('pos.x:', pos.x)
    console.log('pos.y:', pos.y)


    selectNone()
    renderMeme()
    if (!isTextClicked(pos)) {
        return
    }
    drawRect()
    setTextDrag(true)
    //Save the pos we start from
    gStartPos = pos
    document.body.style.cursor = 'grabbing'
}

function onMove(ev) {
    const currMeme = getMeme()
    if (currMeme.selectedLineIdx === -1) return
    const isDrag = currMeme.lines[gMeme.selectedLineIdx].isDrag
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
        ev.preventDefault()
        ev = ev.changedTouches[0]
        var rect = gElCanvas.getBoundingClientRect()
        pos = {
            x: ev.pageX - rect.left - window.scrollX,
            y: ev.pageY - rect.top - window.scrollY
        }
    }
    return pos
}

function drawRect() {
    const currMeme = getMeme()
    if (gMeme.selectedLineIdx === -1) return
    const currLine = currMeme.lines[gMeme.selectedLineIdx]
    const len = currLine.textWidth
    const hgt = currLine.textHeight
    const startX = currLine.pos.x - len / 2 - 5
    const startY = currLine.pos.y - hgt / 2 - 5

    gCtx.strokeStyle = 'black'
    gCtx.strokeRect(startX, startY, len + 10, hgt + 10)
}

function onDeleteLine() {
    deleteLine()
    renderMeme()
}

function onSwitchLines() {
    switchLine()
    renderMeme()
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.clientWidth - 2
    if (gElCanvas.width > 400) gElCanvas.width = 400
    renderMeme()
}

function onSetFont(fontName) {
    console.log('fontName:', fontName)
    changeFont(fontName)
    renderMeme()
}

function onAlignLine(position) {
    const currMeme = getMeme()
    if (currMeme.selectedLineIdx === -1) return
    getCoordinates(gElCanvas, currMeme.selectedLineIdx, position)
    renderMeme()
}


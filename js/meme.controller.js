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
    hideGallery()
    showEditor()
    updateCurrMeme(elImg)
    renderMeme()
}

function renderMeme() {
    const currMeme = getMeme()
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
    console.log('txtWidth:',txtWidth)
    console.log('txtHeight:',txtHeight)
    
    updateTxtLength(txtWidth, txtHeight, idx)
}

function onChangeTxt(txt) {
    updateTxt(txt)
    renderMeme()
}

function onAddLine() {
    addLine()
    updateInputTxt()
    renderMeme()
}

function onDownloadCanvas(elBtn) {
    const dataUrl = gElCanvas.toDataURL()
    elBtn.href = dataUrl
    elBtn.download = 'my-img'
}

function onGalleryClicked() {
    showGallery()
    hideEditor()
    hideSaved()
    initMeme()
}

function hideGallery() {
    document.querySelector('.gallery-container').classList.add('hide')
}

function showGallery() {
    document.querySelector('.gallery-container').classList.remove('hide')
}

function hideEditor() {
    const elEditor = document.querySelector('.editor-container')
    elEditor.querySelector('.meme-canvas').classList.add('hide')
    elEditor.querySelector('.editor').classList.add('hide')
}

function showEditor() {
    const elEditor = document.querySelector('.editor-container')
    elEditor.querySelector('.meme-canvas').classList.remove('hide')
    elEditor.querySelector('.editor').classList.remove('hide')
}

function hideSaved() {
    document.querySelector('.saved-container').classList.add('hide')
}

function showSaved() {
    document.querySelector('.saved-container').classList.remove('hide')
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
    selectNone()
    renderMeme()
    if (!isTextClicked(pos)) return
    updateInputTxt()
    renderMeme()
    setTextDrag(true)
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
    updateInputTxt()
    renderMeme()
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.clientWidth - 2
    if (gElCanvas.width > 350) gElCanvas.width = 350
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

function onUploadImg() {
    const imgDataUrl = gElCanvas.toDataURL('image/jpeg') 

    function onSuccess(uploadedImgUrl) {
        const url = encodeURIComponent(uploadedImgUrl)
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&t=${url}`)
    }
    doUploadImg(imgDataUrl, onSuccess)
}

function doUploadImg(imgDataUrl, onSuccess) {
    const formData = new FormData()
    formData.append('img', imgDataUrl)

    const XHR = new XMLHttpRequest()
    XHR.onreadystatechange = () => {
        if (XHR.readyState !== XMLHttpRequest.DONE) return
        if (XHR.status !== 200) return console.error('Error uploading image')
        const { responseText: url } = XHR
        onSuccess(url)
    }
    XHR.onerror = (req, ev) => {
        console.error('Error connecting to server with request:', req, '\nGot response data:', ev)
    }
    XHR.open('POST', '//ca-upload.com/here/upload.php')
    XHR.send(formData)
}

function onSaveMeme() {
    saveMeme(gElCanvas)
}

function onSetSaved() {
    hideGallery()
    hideEditor()
    showSaved()
    renderSaved()
}

function renderSaved() {
    const savedImgs = getSavedImgs()
    const strHtmls = savedImgs.map(image => `<img src=${image}>`)
    document.querySelector('.saved-container .grid-container').innerHTML = strHtmls.join('') 
}

function rendergallery() {
    const elGallery = document.querySelector('.grid-container')
    const images = getImages()
    const strHtmls = images.map(image => `<img src="${image.url}" id="${image.id}" onclick="onImageClicked(this)">`)
    elGallery.innerHTML = strHtmls.join('')
}

function updateInputTxt() {
    const currMeme = getMeme()
    const currIdx = currMeme.selectedLineIdx
    if (currIdx === -1) return
    const currTxt = currMeme.lines[currIdx].text
    const elInput = document.querySelector('.add-txt')
    elInput.value = currTxt

}




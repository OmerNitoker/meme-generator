'use strict'

var gElCanvas
var gCtx

function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    rendergallery()
}

function rendergallery() {
    const elGallery = document.querySelector('.grid-container')
    const images = getImages()
    const strHtmls = images.map(image => `<img src="${image.url}" id="${image.id}" onclick="onImageClicked(this)">`)
    elGallery.innerHTML = strHtmls.join('')
}

function onImageClicked(elImg) {
    console.log('elImg:',elImg)
    
    toggleGallery()
    toggleEditor()
    updateCurrMeme(elImg)
    renderMeme()
}

function renderMeme() {
    const currMeme = getMeme()
    const elImage = document.getElementById(currMeme.selectedImg.id)
    gElCanvas.height = (elImage.naturalHeight / elImage.naturalWidth) * gElCanvas.width
    gCtx.drawImage(elImage, 0, 0, gElCanvas.width, gElCanvas.height)
    drawText(currMeme.lines[0].text, 200,70)
}

function drawText(text) {
    gCtx.lineWidth = 2
    gCtx.strokeStyle = 'brown'
    gCtx.fillStyle = 'black'
    gCtx.font = '40px Arial'
    gCtx.textAlign = 'center'
    gCtx.textBaseline = 'middle'

    const {x, y} = getCoordinates()
  
    gCtx.fillText(text, x, y)
    gCtx.strokeText(text, x, y)
  }

  function onChangeTxt(txt) {
    console.log(txt)
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

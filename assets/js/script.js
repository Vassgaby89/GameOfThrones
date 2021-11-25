const url = '../../json/got.json'
const music = document.getElementById("music");
music.volume = 0.5;
let allCharacters = []

const compare = (a, b) => {
  let nameOne = a.name
  let nameTwo = b.name
  const space = / /
  if (a.name.match(space)) {
    let lastNameA = a.name.slice(a.name.match(space).index, a.name.length)
    nameOne = lastNameA
  }
  if (b.name.match(space)) {
    let lastNameB = b.name.slice(b.name.match(space).index, b.name.length)
    nameTwo = lastNameB
  }

  if (nameOne < nameTwo) {
    return -1
  }
  if (nameOne > nameTwo) {
    return 1
  }
  return 0
}

const sortedLivingCharacters = (characters = []) => {
  const sortedByName = characters.sort(compare)
  return sortedLivingByName = sortedByName.filter(characters => !(characters.hasOwnProperty('dead')))
}

const getCharacters = async (url) => {
  try {
    const response = await fetch(url)
    const result = await response.json()
    const sortedArray = sortedLivingCharacters(result)
    allCharacters = sortedArray
    createMainContent(sortedArray)
    addClick()
  } catch (error) {
    console.error(error)
    return []
  }
}

const createMainContent = (characters = []) => {
  characters.forEach(character => {
    const mainSection = document.querySelector('.main')
    const characterDiv = document.createElement('div')
    characterDiv.classList.add('character')
    mainSection.appendChild(characterDiv)
    const imgDiv = document.createElement('div')
    imgDiv.classList.add('character_img')
    imgDiv.innerHTML = `<img src="${character.portrait}" alt="${character.name}">`
    characterDiv.appendChild(imgDiv)
    const nameDiv = document.createElement('div')
    nameDiv.classList.add('character_name')
    nameDiv.innerHTML = character.name
    characterDiv.appendChild(nameDiv)

  })
}

const addClick = () => {
  const characterDivs = document.querySelectorAll('.character')
  characterDivs.forEach(character => {
    character.addEventListener('click', function () {
      const div = document.querySelector('.not_found')
      div.textContent = ''
      setAsSelected(this)
      fillSidebar(this.lastChild.textContent)
    })
  })
  const searchBtn = document.querySelector('.search_btn')
  searchBtn.addEventListener('click', function () {
    const searchInput = document.querySelector('.search_input')
    if (searchInput.value) {
      search(searchInput.value.trim())
    }
  })
}

const setAsSelected = (div) => {
  const characterDivs = document.querySelectorAll('.character')
  characterDivs.forEach(charDiv => {
    charDiv.classList.remove('selected')
  })
  div.classList.add('selected')
}

const fillSidebar = (selected) => {
  const selectedChar = allCharacters.find(char => char.name === selected)
  const sidebar_picture = document.querySelector('.sidebar_picture')
  if (selected === 'Jorah Mormont') {
    sidebar_picture.innerHTML = `<img src="./assets/pictures/placeholder.jpg" alt="GoT - Logo" style="width:320px">`
  } else {
    sidebar_picture.innerHTML = `<img src="${selectedChar.picture}" alt="${selectedChar.name}" style="width:320px">`
  }
  const sidebar_charName = document.querySelector('.sidebar_charName')
  sidebar_charName.innerHTML = selectedChar.name
  if (selectedChar.house) {
    const sidebar_houseLogo = document.querySelector('.sidebar_houseLogo')
    sidebar_houseLogo.innerHTML = `<img src="./assets/houses/${selectedChar.house}.png" alt="${selectedChar.house}">`
  }
  const sidebar_charBio = document.querySelector('.sidebar_charBio')
  sidebar_charBio.innerHTML = selectedChar.bio
}

const search = (searchFor) => {
  const pattern = new RegExp(searchFor, 'ig')
  const selectedChar = allCharacters.find(char => char.name.match(pattern))
  if (selectedChar) {
    const div = document.querySelector('.not_found')
    div.textContent = ''
    fillSidebar(selectedChar.name)
  } else {
    const div = document.querySelector('.not_found')
    div.textContent = 'Character not found'
  }
}

getCharacters(url)
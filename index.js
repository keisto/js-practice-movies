const fetchData = async (searchTerm) => {
  const response = await axios.get('https://omdbapi.com/', {
    params: {
      apikey: 'e4fc7c93',
      s: searchTerm,
    },
  })

  return response?.data?.Search ?? []
}

const root = document.querySelector('.autocomplete')
root.innerHTML = `
  <label>Search for a movie</label>
  <input class="input" />
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content results">
      </div>
    </div>
  </div>
`

const input = document.querySelector('input')
const dropdown = document.querySelector('.dropdown')
const resultsWrapper = document.querySelector('.results')

const onInput = async (e) => {
  const movies = await fetchData(e.target.value).then()

  if (!movies.length) {
    dropdown.classList.remove('is-active')
    return
  }

  resultsWrapper.innerHTML = ''
  dropdown.classList.add('is-active')
  const fragment = document.createDocumentFragment()
  for (const movie of movies) {
    const movieOption = document.createElement('a')
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster
    movieOption.classList.add('dropdown-item')
    movieOption.innerHTML = `
      <img src="${imgSrc}" alt="Poster for ${movie.Title}" />
      ${movie.Title}
    `
    fragment.append(movieOption)
  }

  resultsWrapper.append(fragment)
}

input.addEventListener('input', debounce(onInput, 500))

document.addEventListener('click', (e) => {
  if (!root.contains(e.target)) {
    dropdown.classList.remove('is-active')
  }
})

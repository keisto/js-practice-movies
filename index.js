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

    // Hide dropdown on movie selection
    movieOption.addEventListener('click', () => {
      dropdown.classList.remove('is-active')
      input.value = movie.Title
      onMovieSelect(movie)
    })

    fragment.append(movieOption)
  }

  resultsWrapper.append(fragment)
}

input.addEventListener('input', debounce(onInput, 500))

// Hide dropdown when clicked away from the autocomplete element
document.addEventListener('click', (e) => {
  if (!root.contains(e.target)) {
    dropdown.classList.remove('is-active')
  }
})

const onMovieSelect = async (movie) => {
  const response = await axios.get('https://omdbapi.com/', {
    params: {
      apikey: 'e4fc7c93',
      i: movie.imdbID,
    },
  })

  document.querySelector('#summary').innerHTML = movieTemplate(response.data)
}

const movieTemplate = (movieDetail) => {
  const imgSrc = movieDetail.Poster === 'N/A' ? '' : movieDetail.Poster
  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${imgSrc}" alt="Poster for ${movieDetail.Title}">
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `
}

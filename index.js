const autoCompleteConfig = {
  renderOption: (movie) => {
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster
    return `
      <img src="${imgSrc}" alt="Poster for ${movie.Title}" />
      ${movie.Title} (${movie.Year})
    `
  },
  inputValue: (movie) => movie.Title,
  fetchData: async (searchTerm) => {
    const response = await axios.get('https://omdbapi.com/', {
      params: {
        apikey: 'e4fc7c93',
        s: searchTerm,
      },
    })

    return response?.data?.Search ?? []
  },
}

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#left-autocomplete'),
  onOptionSelect: (movie) => {
    document.querySelector('.tutorial').classList.add('is-hidden')
    return onMovieSelect(movie, document.querySelector('#left-summary'), 'left')
  },
})

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#right-autocomplete'),
  onOptionSelect: (movie) => {
    document.querySelector('.tutorial').classList.add('is-hidden')
    return onMovieSelect(
      movie,
      document.querySelector('#right-summary'),
      'right'
    )
  },
})

let leftMovie, rightMovie
const onMovieSelect = async (movie, summaryElement, side) => {
  const response = await axios.get('https://omdbapi.com/', {
    params: {
      apikey: 'e4fc7c93',
      i: movie.imdbID,
    },
  })

  summaryElement.innerHTML = movieTemplate(response.data)

  if (side === 'left') {
    leftMovie = response.data
  } else {
    rightMovie = response.data
  }

  if (leftMovie && rightMovie) {
    runComparison()
  }
}

const runComparison = () => {
  const leftSideStats = document.querySelectorAll('#left-summary .notification')
  const rightSideStats = document.querySelectorAll(
    '#right-summary .notification'
  )

  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index]
    const leftSideValue = parseInt(leftStat.dataset.value)
    const rightSideValue = parseInt(rightStat.dataset.value)

    if (leftSideValue < rightSideValue) {
      leftStat.classList.remove('is-primary')
      leftStat.classList.add('is-warning')
    } else {
      rightStat.classList.remove('is-primary')
      rightStat.classList.add('is-warning')
    }
  })
}

const movieTemplate = (movieDetail) => {
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''))
  const imdbRating = parseFloat(movieDetail.imdbRating)
  const metaScore = parseInt(movieDetail.Metascore)
  const dollars = parseInt(
    movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, '')
  )
  const awards = movieDetail.Awards.split(' ').reduce((acc, word) => {
    const value = parseInt(word)
    return isNaN(value) ? acc : acc + value
  }, 0)

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
    <article data-value=${awards} class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article data-value=${dollars} class="notification is-primary">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article data-value=${metaScore} class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article data-value=${imdbRating} class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value=${imdbVotes} class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `
}

createAutoComplete({
  root: document.querySelector('.autocomplete'),
  renderOption: (movie) => {
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster
    return `
      <img src="${imgSrc}" alt="Poster for ${movie.Title}" />
      ${movie.Title} (${movie.Year})
    `
  },
  onOptionSelect: (movie) => onMovieSelect(movie),
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

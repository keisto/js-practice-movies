const createAutoComplete = ({
  root,
  renderOption,
  onOptionSelect,
  inputValue,
  fetchData,
}) => {
  root.innerHTML = `
  <label>Search</label>
  <input class="input" />
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content results">
      </div>
    </div>
  </div>
`

  const input = root.querySelector('input')
  const dropdown = root.querySelector('.dropdown')
  const resultsWrapper = root.querySelector('.results')

  const onInput = async (e) => {
    const items = await fetchData(e.target.value).then()

    if (!items.length) {
      dropdown.classList.remove('is-active')
      return
    }

    resultsWrapper.innerHTML = ''
    dropdown.classList.add('is-active')
    const fragment = document.createDocumentFragment()
    for (const item of items) {
      const option = document.createElement('a')
      option.classList.add('dropdown-item')
      option.innerHTML = renderOption(item)

      // Hide dropdown on option selection
      option.addEventListener('click', () => {
        dropdown.classList.remove('is-active')
        input.value = inputValue(item)
        onOptionSelect(item)
      })

      fragment.append(option)
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
}

import {useHttp} from "../hooks/http.hook";

const useMarvelService = () => {
  const {request, clearError, process, setProcess} = useHttp()

  const _apiBase = 'https://gateway.marvel.com:443/v1/public/'
  const _apiKey = ''
  const _baseOffset = 210

  const getAllCharacters = async (offset = _baseOffset) => {
    const result = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`)

    // С помощью метода map создаем новый массив с модифицированными данными с помощью коллбек функции
    return result.data.results.map(_transformCharacter)
  }

  const getCharacter = async (id) => {
    const result = await request(`${_apiBase}/characters/${id}?${_apiKey}`)

    // console.log(result.data.results[0])
    return _transformCharacter(result.data.results[0])
  }

  const getAllComics = async (offset = 0) => {
    const result = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`)

    return result.data.results.map(_transformComics)
  }

  const getComic = async (id) => {
    const result = await request(`${_apiBase}comics/${id}?${_apiKey}`)

    return _transformComics(result.data.results[0])
  }

  const characterSearchByName = async (name) => {
    const result = await request(`${_apiBase}/characters?name=${name}&${_apiKey}`)

    return result.data.results.map(_transformCharacter)
  }

  const _transformCharacter = (char) => {
    return {
      id: char.id,
      name: char.name,
      description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character',
      thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
      noImg: char.thumbnail.path.slice(-19) === 'image_not_available',
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items
    }
  }

  const _transformComics = (comic) => {
    return {
      id: comic.id,
      title: comic.title,
      description: comic.description || 'No information about the comic.',
      pageCount: comic.pageCount ? `${comic.pageCount} p.` : `No information about the number of pages`,
      thumbnail: comic.thumbnail.path + '.' + comic.thumbnail.extension,
      language: comic.textObjects.language || 'en-us',
      price: comic.prices[0].price ? `${comic.prices[0].price}$` : 'not available',
      noImg: comic.thumbnail.path.slice(-19) === 'image_not_available',
    }
  }

  return {
    clearError,
    process,
    setProcess,
    getAllCharacters,
    getCharacter,
    getAllComics,
    getComic,
    characterSearchByName}
}

export default useMarvelService
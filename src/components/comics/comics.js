import {useState, useEffect} from "react";
import {Link} from "react-router-dom";

import Spinner from '../spinner/spinner'
import ErrorMessage from "../errorMessage/errorMessage";

import './comics.scss'

import useMarvelService from "../../services/marvelService";

const setContent = (process, Component, newItemLoading) => {
  switch (process) {
    case 'waiting':
      return <Spinner/>
      break
    case 'loading':
      return newItemLoading ? <Component/> : <Spinner/>
      break
    case 'confirmed':
      return <Component/>
      break
    case 'error':
      return <ErrorMessage/>
      break
    default:
      throw new Error('Unexpected process state.')
  }
}

const ComicsList = () => {
  const [comicsList, setComicsList] = useState([])
  const [offset, setOffset] = useState(0)
  const [newItemLoading, setNewItemLoading] = useState(false)
  const [comicsEnded, setComicsEnded] = useState(false)

  const {getAllComics, process, setProcess} = useMarvelService()

  useEffect(() => {
    onRequest(offset, true)
  }, [])

  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true)
    getAllComics(offset)
      .then(onComicsLoaded)
      .then(() => setProcess('confirmed'))
  }

  const onComicsLoaded = (newComicsList) => {
    let ended = false

    if (newComicsList.length < 8) {
      ended = true
    }

    setComicsList(comicsList => [...comicsList, ...newComicsList])
    setOffset(offset => offset + 8)
    setNewItemLoading(newItemLoading => false)
    setComicsEnded(ended)
  }

  return (
    <div className="comics__list">
      {setContent(process, () => <ListComics comicsList={comicsList}/>, newItemLoading)}
      <button className="button button__main button__long"
              style={{'display' : comicsEnded ? 'none' : 'block'}}
              disabled={newItemLoading}
              onClick={() => onRequest(offset)}
      >
        <div className="inner">load more</div>
      </button>
    </div>
  )
}

const ComicListItem = ({comic}) => {
  const {id, title, thumbnail, price, noImg} = comic

  return (
    <li className="comics__item">
      <Link to={`/comics/${id}`}>
        <img src={thumbnail} alt={title} style={noImg ? {objectFit: "unset"} : null} className="comics__item-img" />
        <div className="comics__item-name">{title}</div>
        <div className="comics__item-price">{price}</div>
      </Link>
    </li>
  )
}

const ListComics = ({comicsList}) => {
  return (
    <ul className="comics__grid">
      {
        comicsList.map((comic, i) => <ComicListItem key={i} comic={comic} />)
      }
    </ul>
  )
}

export default ComicsList
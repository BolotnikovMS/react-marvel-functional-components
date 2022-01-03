import {useParams, Link} from "react-router-dom";
import {useState, useEffect} from "react";

import Spinner from '../spinner/spinner'
import ErrorMessage from "../errorMessage/errorMessage";

import './singlComicPage.scss'

import useMarvelService from "../../services/marvelService";

const SingleItemPage = () => {
  /*
  Получаем два параметра. В зависимости от второго определяем с чем работаем(персонаж или комикс).
   */
  const {itemId, itemType} = useParams()
  const [item, setItem] = useState(null)
  const {loading, error, getCharacter, getComic, clearError} = useMarvelService()

  useEffect(() => {
    updateItem()
  }, [itemId])

  const updateItem = () => {
    clearError()

    itemType === 'char' ? getCharacter(itemId).then(onItemLoaded) : getComic(itemId).then(onItemLoaded)
  }

  const onItemLoaded = (item) => {
    setItem(item)
  }

  const errorMessage = error ? <ErrorMessage/> : null
  const spinner = loading ? <Spinner/> : null
  const content = !(loading || error || !item) ? itemType === 'char' ? <View item={item} type='char'/> : <View item={item} type='comic'/> : null

  return (
    <>
      {errorMessage}
      {spinner}
      {content}
    </>
  )
}

const View = ({item, type}) => {
  if (type === 'char') {
    const {name, description, thumbnail, comics} = item

    return (
      <div className="single-comic">
        <img src={thumbnail} alt={name} className="single-comic__img" />
        <div className="single-comic__info">
          <h2 className="single-comic__name">{name}</h2>
          <p className="single-comic__descr">{description}</p>
          <ul className="char__comics-list">
            {comics.length > 0 ? null : 'There is no comics for character'}
            {
              comics.map((item, i) => {
                if (i > 9) return
                return (
                  <li key={i} className="char__comics-item">
                    <Link to={`/comics/${item.resourceURI.substr(43, 7)}`}>
                      {item.name}
                    </Link>
                  </li>
                )
              })
            }
          </ul>
        </div>
        <Link to="/" className="single-comic__back">Back to all</Link>
      </div>
    )
  } else {
    const {title, description, pageCount, thumbnail, language, price} = item

    return (
      <div className="single-comic">
        <img src={thumbnail} alt={title} className="single-comic__img" />
        <div className="single-comic__info">
          <h2 className="single-comic__name">{title}</h2>
          <p className="single-comic__descr">{description}</p>
          <p className="single-comic__descr">{pageCount}</p>
          <p className="single-comic__descr">Language: {language}</p>
          <div className="single-comic__price">{price}</div>
        </div>
        <Link to="/comics" className="single-comic__back">Back to all</Link>
      </div>
    )
  }
}

export default SingleItemPage
import {useState, useEffect} from "react";

import './randomChar.scss'
import mjolnir from '../../resources/img/mjolnir.png'

import useMarvelService from "../../services/marvelService";
import setContent from "../utils/setContent";

const RandomChar = () => {
  const [char, setChar] = useState({})
  // вытаскиваем сущности из хука
  const {getCharacter, clearError, process, setProcess} = useMarvelService()

  useEffect(() => {
    updateChar()

    const timerId = setInterval(updateChar, 600000)

    return () => {
      clearInterval(timerId)
    }
  }, [])

  const onCharLoaded = (char) => {
    setChar(char)
  }

  const updateChar = () => {
    // очищает ошибку в случае если вдруг персонаж с заданным  id не был найден и отобразилась ошибка.
    // Если этого не делать, то при получении ошибки при попытке загрузить след-о ошибка будет висеть, а данные будут грузиться
    clearError()
    const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000)

    getCharacter(id)
      .then(onCharLoaded)
      .then(() => setProcess('confirmed'))
  }

  return (
    <div className="randomchar">
      {setContent(process, View, char)}
      <div className="randomchar__static">
        <p className="randomchar__title">
          Random character for today!<br />
          Do you want to get to know him better?
        </p>
        <p className="randomchar__title">
          Or choose another one
        </p>
        <button className="button button__main" onClick={updateChar}>
          <div className="inner">try it</div>
        </button>
        <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
      </div>
    </div>
  )
}

const View = ({data}) => {
  const {name, description, thumbnail, noImg, homepage, wiki} = data
  // const styleNoImg = thumbnail.slice(-23) === 'image_not_available.jpg' ? {objectFit: "contain"} : null

  return (
    <div className="randomchar__block">
      <img src={thumbnail} alt={name} style={noImg ? {objectFit: "contain"} : null} className="randomchar__img" />
      <div className="randomchar__info">
        <p className="randomchar__name">{name}</p>
        <p className="randomchar__descr">
          {description}
        </p>
        <div className="randomchar__btns">
          <a href={homepage} className="button button__main">
            <div className="inner">homepage</div>
          </a>
          <a href={wiki} className="button button__secondary">
            <div className="inner">Wiki</div>
          </a>
        </div>
      </div>
    </div>
  )
}

export default RandomChar
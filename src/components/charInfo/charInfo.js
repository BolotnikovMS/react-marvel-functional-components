import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import PropTypes from 'prop-types';

import './charInfo.scss'

import useMarvelService from "../../services/marvelService";
import setContent from "../utils/setContent";

const CharInfo = (props) => {
  const [char, setChar] = useState(null)

  const {getCharacter, clearError, process, setProcess} = useMarvelService()

  useEffect(() => {
    updateChar()
  }, [props.charId])

  const updateChar = () => {
    const {charId} = props

    if (!charId) return

    clearError()
    getCharacter(charId)
      .then(onCharLoaded)
      .then(() => setProcess('confirmed'))

    // this.foo.bar = 0 /// error test
  }

  const onCharLoaded = (char) => {
    setChar(char)
  }


  return (
    <div className="char__info">
      {setContent(process, View, char)}
    </div>
  )
}

const View = ({data}) => {
  const {name, description, thumbnail, noImg, homepage, wiki, comics} = data

  return (
    <>
      <div className="char__basics">
        <img src={thumbnail} alt={name} style={noImg ? {objectFit: "contain"} : null} />
        <div>
          <div className="char__info-name">{name}</div>
          <div className="char__btns">
            <a href={homepage} className="button button__main">
              <div className="inner">homepage</div>
            </a>
            <a href={wiki} className="button button__secondary">
              <div className="inner">Wiki</div>
            </a>
          </div>
        </div>
      </div>
      <div className="char__descr">
        {description}
      </div>
      <div className="char__comics">Comics:</div>
      <ul className="char__comics-list">
        {comics.length > 0 ? null : 'There is no comics for character'}
        {
          comics.map((item, i) => {
            let url = item.resourceURI.substr(40, 10)
            if (i > 9) return
            return (
              <li key={i} className="char__comics-item">

                <Link to={`/comics/${parseInt(url.match(/\d+/))}`}>
                  {item.name}
                </Link>
              </li>
            )
          })
        }
      </ul>
    </>
  )
}

CharInfo.propTypes = {
  charId: PropTypes.number
}

export default CharInfo
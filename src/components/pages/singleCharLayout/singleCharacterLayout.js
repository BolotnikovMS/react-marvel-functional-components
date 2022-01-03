import {Link} from "react-router-dom";

import './singleCharacterLayout.scss';

const SingleCharacterLayout = ({data}) => {
  const {name, description, thumbnail, comics} = data

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
}

export default SingleCharacterLayout
import {useState, useEffect, useRef, useMemo} from "react";
import {TransitionGroup, CSSTransition} from "react-transition-group";
import PropTypes from 'prop-types';

import Spinner from '../spinner/spinner'
import ErrorMessage from "../errorMessage/errorMessage";

import './charList.scss'

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

const CharList = (props) => {
  const [charList, setCharList] = useState([])
  const [newItemLoading, setNewItemLoading] = useState(false)
  const [offset, setOffset] = useState(210)
  const [charEnded, setCharEnded] = useState(false)

  const {getAllCharacters, process, setProcess} = useMarvelService()

  useEffect(() => {
    onRequest(offset, true)
  }, [])

  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true)
    getAllCharacters(offset)
      .then(onCharactersLoaded)
      .then(() => setProcess('confirmed'))
  }

  const onCharactersLoaded = (newCharacters) => {
    let ended = false

    if (newCharacters.length < 9) {
      ended = true
    }

    setCharList(characters => [...characters, ...newCharacters])
    setNewItemLoading(newCharacters => false)
    setOffset(offset => offset + 9)
    setCharEnded(charEnded => ended)
  }

  const itemRef = useRef([])

  const focusCard = (indexChar) => {
    itemRef.current.filter((item, i) => {
      if (i === indexChar) {
        item.classList.add('char__item_selected')
      } else {
        item.classList.remove('char__item_selected')
      }
    })

    itemRef.current[indexChar].focus()
  }

  function renderItems(arr) {
    const items = arr.map((item, i) => {
      let imgStyle = {'objectFit' : 'cover'};
      if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'unset'};
      }

      return (
        <CSSTransition key={item.id} timeout={500} classNames="char__item">
          <li
            className="char__item"
            key={item.id}
            tabIndex={0}
            ref={el => itemRef.current[i] = el}
            onClick={() => {
              props.onCharSelected(item.id)
              focusCard(i)
            }}
            onKeyPress={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                props.onCharSelected(item.id)
                focusCard(i)
              }
            }}
          >
            <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
            <div className="char__name">{item.name}</div>
          </li>
        </CSSTransition>
      )
    });
    // А эта конструкция вынесена для центровки спиннера/ошибки
    return (
      <ul className="char__grid">
        <TransitionGroup component={null}>
          {items}
        </TransitionGroup>
      </ul>
    )
  }

  const elements = useMemo(() => {
    // useMemo запоминает результат работы фун-ий. Иначе при выделении персонажа происходит 2-ой рендер в main page и класс выделения не проставляется
    return setContent(process, () => renderItems(charList), newItemLoading)
  }, [process])

  return (
    <div className="char__list">
      {elements}
      <button className="button button__main button__long"
              disabled={newItemLoading}
              style={{'display': charEnded ? 'none' : 'block'}}
              onClick={() => onRequest(offset)}>
        <div className="inner">load more</div>
      </button>
    </div>
  )
}

CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired
}

export default CharList

// const CardChar = ({character, onCharSelected}) => {
//   const {name, thumbnail, noImg} = character
//
//   return (
//     <li className="char__item " onClick={onCharSelected}>
//       <img src={thumbnail} alt={name} style={noImg ? {objectFit: "unset"} : null}/>
//       <div className="char__name">{name}</div>
//     </li>
//   )
// }
//
// const ListCardsChars = ({characters, onCharSelected}) => {
//   const listChar = characters.map(character => {
//     const id = character.id
//     return (
//       <CardChar key={character.id} id={id} character={character} onCharSelected={() => onCharSelected(id)}/>
//     )
//   })
//
//   return (
//     <ul className="char__grid">
//       {listChar}
//     </ul>
//   )
// }
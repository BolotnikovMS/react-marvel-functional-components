import {useState} from "react";
import {Helmet} from "react-helmet";

import RandomChar from "../randomChar/randomChar";
import CharList from "../charList/charList";
import CharInfo from "../charInfo/charInfo";
import CharSearchForm from "../charSearchForm/charSearchForm";

import ErrorBoundray from "../errorBoundray/errorBoundray";

import decoration from '../../resources/img/vision.png'

const MainPage = () => {
  const [selectedChar, setChar] = useState(null)

  const onCharSelected = (id) => {
    setChar(id)
  }

  return (
    <>
      <Helmet>
        <meta
          name="description"
          content="Marvel information portal<"
        />
        <title>Marvel information portal</title>
      </Helmet>
      <ErrorBoundray>
        <RandomChar/>
      </ErrorBoundray>
      <div className="char__content">
        <ErrorBoundray>
          <CharList onCharSelected={onCharSelected}/>
        </ErrorBoundray>
        <div>
          <ErrorBoundray>
            <CharInfo charId={selectedChar}/>
          </ErrorBoundray>
          <ErrorBoundray>
            <CharSearchForm/>
          </ErrorBoundray>
        </div>
      </div>
    <img className="bg-decoration" src={decoration} alt="vision" />
    </>
  )
}

export default MainPage
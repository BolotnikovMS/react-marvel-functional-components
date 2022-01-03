import {useParams} from "react-router-dom";
import {useState, useEffect} from "react";

import AppBanner from "../appBanner/appBanner";

import useMarvelService from "../../services/marvelService";
import setContent from "../utils/setContent";

const SinglePage = ({Component, dataType}) => {
  const {id} = useParams()
  const [data, setData] = useState(null)
  const {getCharacter, getComic, clearError, process, setProcess} = useMarvelService()

  useEffect(() => {
    updateItem()
  }, [id])

  const updateItem = () => {
    clearError()

    dataType === 'character' ?
        getCharacter(id)
            .then(onItemLoaded)
            .then(() => setProcess('confirmed'))
        :
        getComic(id)
            .then(onItemLoaded)
            .then(() => setProcess('confirmed'))
  }

  const onItemLoaded = (data) => {
    setData(data)
  }

  return (
    <>
      <AppBanner/>
      {setContent(process, Component, data)}
    </>
  )
}

export default SinglePage
import {Helmet} from "react-helmet";

import AppBanner from "../appBanner/appBanner";
import ComicsList from "../comics/comics";

const ComicsPage = () => {
  return (
      <>
        <Helmet>
          <meta
            name="description"
            content="Page with list of our comics"
          />
          <title>Comics page</title>
        </Helmet>
        <AppBanner/>
        <ComicsList/>
      </>
  )
}

export default ComicsPage
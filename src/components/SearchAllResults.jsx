import { useParams } from "react-router-dom";
import SearchAlbumsResults from "./SearchAlbumsResults";
import SearchArtistsResults from "./SearchArtistsResults";
import SearchTracksResults from "./SearchTracksResults";

export default function SearchAllResults() {
  return (
    <>
      <h4>Tracks</h4>
      <SearchTracksResults hideLoadMore showRouterLink limit="4" />
      <h4>Artists</h4>
      <SearchArtistsResults hideLoadMore showRouterLink onlyOneRow />
      <h4>Albums</h4>
      <SearchAlbumsResults hideLoadMore showRouterLink onlyOneRow />
    </>
  );
}

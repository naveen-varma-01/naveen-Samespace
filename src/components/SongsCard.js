import "../styles/SongsCard.css";

const SongsCard = props => {
  const { songsData, onSongClick } = props;
  const { artist, name, cover, id } = songsData;

  return (
    <li className="song-item" onClick={() => onSongClick(id)}>
      <div className="song-details">
      <img src={`https://cms.samespace.com/assets/${cover}`} alt="cover art" className="thumbnail" />
      <div className="artist-details">
      <h1 className="song-name">{name}</h1>
      <p className="artist">{artist}</p>
      </div>
      </div>
    </li>
  );
};

export default SongsCard;
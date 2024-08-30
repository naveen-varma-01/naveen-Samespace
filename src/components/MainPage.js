import { Component, createRef } from "react";
import SongsCard from "./SongsCard";
import "../styles/MainPage.css";

const apiQrl =process.env.REACT_APP_API_URL;

class MainPage extends Component {
  state = {
    songsList: [],
    selectedSong: null,
    backgroundColor: "black",
    isPlaying: false, // Track whether the song is playing
  };

  audioRef = createRef(); // Create a ref for the audio element

  componentDidMount() {
    this.getSongs();
  }

  getSongs = async () => {
    const apiUrl = "https://cms.samespace.com/items/songs";
    const options = {
      method: "GET",
    };

    const response = await fetch(apiUrl, options);
    if (response.ok) {
      const fetchedData = await response.json();
      const res = fetchedData.data.map((song) => ({
        artist: song.artist,
        name: song.name,
        id: song.id,
        url: song.url,
        accent: song.accent,
        cover: song.cover,
      }));
      this.setState({ songsList: res });
    }
  };

  handleSongSelection = (songId) => {
    const { songsList } = this.state;
    const selectedSong = songsList.find((song) => song.id === songId);

    this.setState(
      {
        selectedSong,
        backgroundColor: selectedSong ? selectedSong.accent : "black",
        isPlaying: true, // Set to play when a song is selected
      },
      () => {
        if (this.audioRef.current) {
          this.audioRef.current.play(); // Automatically play the song
        }
      }
    );
  };

  handlePlayPause = () => {
    const { isPlaying } = this.state;

    if (this.audioRef.current) {
      if (isPlaying) {
        this.audioRef.current.pause(); // Pause the song
      } else {
        this.audioRef.current.play(); // Play the song
      }

      this.setState({ isPlaying: !isPlaying });
    }
  };

  handleNextSong = () => {
    const { songsList, selectedSong } = this.state;
    const currentIndex = songsList.findIndex((song) => song.id === selectedSong.id);
    const nextIndex = (currentIndex + 1) % songsList.length; // Loop back to the first song if at the end
    this.handleSongSelection(songsList[nextIndex].id);
  };

  handlePreviousSong = () => {
    const { songsList, selectedSong } = this.state;
    const currentIndex = songsList.findIndex((song) => song.id === selectedSong.id);
    const prevIndex = (currentIndex - 1 + songsList.length) % songsList.length; // Loop back to the last song if at the beginning
    this.handleSongSelection(songsList[prevIndex].id);
  };

  render() {
    const { songsList, selectedSong, backgroundColor, isPlaying } = this.state;

    const mainPageStyle = {
      backgroundColor: backgroundColor,
      height: "100vh",
      width: "100%",
      transition: "background-color 0.5s ease",
    };

    return (
      <div className="main-page" style={mainPageStyle}>
        <div className="main">
          <div className="logo">
            <div className="spotify-logo">
              {/* Spotify Logo */}
            </div>
            <div>
              <h1>Spotify</h1>
            </div>
          </div>

          <div className="sidebar">
            <div className="top-frame">
              <h1 className="head">For you</h1>
              <h1 className="head2">Top Tracks</h1>
            </div>
            <div className="searchbar">
              <input
                type="search"
                className="input-search"
                placeholder="Search songs..."
              />
              {/* Search Icon */}
            </div>
            {songsList.length > 0 ? (
              <ul className="songs-list">
                {songsList.map((song) => (
                  <SongsCard
                    songsData={song}
                    key={song.id}
                    onSongClick={this.handleSongSelection}
                  />
                ))}
              </ul>
            ) : (
              <p>Loading songs...</p>
            )}
          </div>

          <div className="player">
            {selectedSong ? (
              <>
                <div className="player-name-card">
                  <h1 className="player-header">{selectedSong.name}</h1>
                  <p className="player-artist">{selectedSong.artist}</p>
                </div>
                <img
                  src={`https://cms.samespace.com/assets/${selectedSong.cover}`}
                  alt={selectedSong.name}
                  className="song-img-large"
                />

                <div className="audio-player">
                  <div className="progress-container">
                    <progress id="progressBar" value="0" max="100"></progress>
                    <progress
                      id="progressBar"
                      value="0"
                      max="100"
                      className="progress2"
                    ></progress>
                  </div>
                  <div className="audio-player-btn">
                  <div>
                      <button className="property-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
                          <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
                        </svg>
                      </button>
                    </div>
                    <div>
                    <button
                      id="prevBtn"
                      className="backward-btn"
                      onClick={this.handlePreviousSong}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-rewind-fill" viewBox="0 0 16 16">
                        <path d="M8.404 7.304a.802.802 0 0 0 0 1.392l6.363 3.692c.52.302 1.233-.043 1.233-.696V4.308c0-.653-.713-.998-1.233-.696z"/>
                        <path d="M.404 7.304a.802.802 0 0 0 0 1.392l6.363 3.692c.52.302 1.233-.043 1.233-.696V4.308c0-.653-.713-.998-1.233-.696z"/>
                      </svg>
                    </button>
                    <button
                      id="playPauseBtn"
                      className="pause-btn"
                      onClick={this.handlePlayPause}
                    >
                      {isPlaying ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-pause-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M5.5 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-8a.5.5 0 0 1 .5-.5h2zm6 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-8a.5.5 0 0 1 .5-.5h2z" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-play-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393" />
                        </svg>
                      )}
                    </button>
                    <button
                      id="nextBtn"
                      className="forward-btn"
                      onClick={this.handleNextSong}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-fast-forward-fill" viewBox="0 0 16 16">
                          <path d="M7.596 7.304a.802.802 0 0 1 0 1.392l-6.363 3.692C.713 12.69 0 12.345 0 11.692V4.308c0-.653.713-.998 1.233-.696z"/>
                          <path d="M15.596 7.304a.802.802 0 0 1 0 1.392l-6.363 3.692C8.713 12.69 8 12.345 8 11.692V4.308c0-.653.713-.998 1.233-.696z"/>
                        </svg>
                    </button>
                    </div>
                    <div>
                      <button id="volumeBtn" className="volume-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-volume-up-fill" viewBox="0 0 16 16">
                          <path d="M11.536 14.01A8.47 8.47 0 0 0 14.026 8a8.47 8.47 0 0 0-2.49-6.01l-.708.707A7.48 7.48 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303z"/>
                          <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.48 5.48 0 0 1 11.025 8a5.48 5.48 0 0 1-1.61 3.89z"/>
                          <path d="M8.707 11.182A4.5 4.5 0 0 0 10.025 8a4.5 4.5 0 0 0-1.318-3.182L8 5.525A3.5 3.5 0 0 1 9.025 8 3.5 3.5 0 0 1 8 10.475zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <audio ref={this.audioRef} key={selectedSong.id} autoPlay>
                  <source src={selectedSong.url} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </>
            ) : (
              <p>Select a song to play</p>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default MainPage;

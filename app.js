let express = require("express");
let app = express();
const { Downloader } = require("ytdl-mp3");
const fs = require("node:fs/promises");
const MP3Cutter = require("mp3-cutter");
const SpotifyWebApi = require("spotify-web-api-node");
const { URLSearchParams } = require("url");
const axios = require("axios");
const { log } = require("node:console");

app.use(express.static("./public"));

app.get("/song", (req, res) => {
  // Initialize SpotifyWebApi instance
  const spotifyApi = new SpotifyWebApi({
    clientId: "5afabe38cf92469298c88e0da6eb7e58",
    clientSecret: "e8314875b2d34431ae4cdaa49dd8230c",
  });

  async function authenticateWithSpotify() {
    try {
      const data = await spotifyApi.clientCredentialsGrant();
      spotifyApi.setAccessToken(data.body["access_token"]);
      console.log("Successfully authenticated with the Spotify API");
    } catch (error) {
      console.error("Error authenticating with Spotify API:", error);
    }
  }

  async function getRandomSongByGenre(genre) {
    try {
      const response = await spotifyApi.searchTracks(`genre:"${genre}"`, {
        limit: 50,
      });

      if (!response.body.tracks || response.body.tracks.items.length === 0) {
        console.log("No tracks found in the response");
        return;
      }
      const randomIndex = Math.floor(
        Math.random() * response.body.tracks.items.length
      );
      const track = response.body.tracks.items[randomIndex];
      const songName = track.name;
      const artist = track.artists[0].name;
      console.log(songName, artist); // this log
      return [songName, artist];
    } catch (error) {
      console.error("Error occurred during Spotify API request:", error);
    }
  }
  authenticateWithSpotify()
    .then(async () => {
      const { genre } = req.query;
      let so = await getRandomSongByGenre(genre);
      const song = so[0] + " song" + " by " + so[1];
    })
    .catch((error) => {
      console.error("Error occurred during authentication:", error);
    });
});

app.get("/playlist", async (req, res) => {
  const data = require("./public/songs.json");

  const randomNumber = Math.floor(Math.random() * data.length);

  const name = data[randomNumber].name;
  console.log(name);
  async function getYouTubeUrl(songName) {
    try {
      const apiKey = "AIzaSyDz_aq1y_JPxkl9vlLRmYWCSo5wC10Z4cE";
      const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&q=${encodeURIComponent(
        songName + "audio"
      )}&type=video&part=snippet&maxResults=1`;
      console.log(apiUrl);
      const response = await fetch(apiUrl);
      const data = await response.json();

      const videoId = data.items[0].id.videoId;
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

      return videoUrl;
    } catch (error) {
      console.error(
        "Error occurred during YouTube API request:",
        error.message
      );
    }
  }

  const url = await getYouTubeUrl(name);

  const videoId = new URLSearchParams(new URL(url).search).get("v");
  console.log(videoId);
  try {
    const replayDATA = await fetch(
      `https://yt.lemnoslife.com/videos?part=mostReplayed&id=${videoId}`
    );
    const json = await replayDATA.json();
    console.log(json);

    const start =
      json.items[0].mostReplayed.heatMarkersDecorations[0]
        .timedMarkerDecorationRenderer.visibleTimeRangeStartMillis;

    const end =
      json.items[0].mostReplayed.heatMarkersDecorations[0]
        .timedMarkerDecorationRenderer.visibleTimeRangeEndMillis;
    console.log(start);

    res.redirect(
      `/download?val=${url}&start=${Math.floor(start / 1000) - 7}&end=${
        Math.floor(end / 1000) + 10
      }`
    );
  } catch (err) {
    console.log(err);
  }
  res.sendFile(__dirname + "/public/blog.html");
});

app.get("/download", async (req, res) => {
  setTimeout(async () => {
    try {
      const filePath = `${__dirname}/public/audio/video.mp3`;
      const filePath1 = `${__dirname}/public/audio/video1.mp3`;

      await fs.unlink(filePath);
      await fs.unlink(filePath1);
      console.log("Files deleted successfully.");

      console.log("xD");
    } catch (err) {
      console.log(err);
    }
  }, 30000);
  const { val } = req.query;
  const { start } = req.query;
  const { end } = req.query;
  console.log(`Start:${start} and End:${end}`);
  try {
    const downloader = new Downloader({ getTags: true });
    downloader.outputDir = "./public/audio";
    await downloader.downloadSong(`${val}`);
  } catch {}
  try {
    await Promise.allSettled(
      (
        await fs.readdir("./public/audio/")
      ).map((file) =>
        fs.rename(`./public/audio/${file}`, "./public/audio/video.mp3")
      )
    );
  } catch {
    console.log("man o man");
  }
  try {
    MP3Cutter.cut({
      src: "./public/audio/video.mp3",
      target: "./public/audio/video1.mp3",
      start: start,
      end: end,
    });
  } catch(err) {
    console.log(err);
  }

  res.sendFile(__dirname + "/public/download.html");
});

app.get('/duration', (req, res)=>{

})

app.listen(5000, () => {
  console.log("port callback");
});

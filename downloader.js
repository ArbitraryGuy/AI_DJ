const { Downloader } = require("ytdl-mp3");

async function download(val) {
    try {
      const downloader = new Downloader({
        getTags: true,
      });
      downloader.outputDir = "./audio";
      await downloader.downloadSong(`${val}`);
      const directoryPath = "./audio";

    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        console.error("Error reading directory:", err);
        return;
      }

      files.forEach((file) => {
        const filePath = `${directoryPath}/${file}`;
        const newFilePath = `${directoryPath}/video.mp3`;

        fs.rename(filePath, newFilePath, (error) => {
          if (error) {
            console.error(`Error renaming file ${file}:`, error);
          } else {
            console.log("sucess renaming");
          }
        });
      });
    })
    } catch {}
  }

module.exports = download
# tasscrape

**Library for scraping basic information from the TASVideos website.**

## Usage

This library is available as [`tasscrape-lib` on npm](https://www.npmjs.com/package/tasscrape):

```
npm install --save tasscrape-lib
```

A simple command-line application is available via `tasscrape-cli`.

No documentation yet.

### Example

Example of retrieving detailed information using the command-line tool:

```
tasscrape.js --get-details "1917M"
```

```json
{
  "res": {
    "id": "1917M",
    "title": "Windows Cave Story \"best ending\" by nitsuja in 50:10.30",
    "url": "https://tasvideos.org/1917M",
    "submission": "https://tasvideos.org/3343S",
    "description": "_Cave Story_ (2004) is a famous [freeware](http://www.cavestory.org/) indie game notable for being made entirely by one person, Daisuke \"Pixel\" Amaya.\n\nWatch as [nitsuja](https://tasvideos.org/Users/Profile/nitsuja) completely destroys this difficult game with amazingly precise movement. This playthrough saves Curly and finishes with the best ending after beating Ballos.\n\nThe program used to make this run, Hourglass, was also developed by nitsuja—with the creation of this run in mind. As such, it is our first published run of a Windows game.\n\n━━━━\n\nDownloadable encodes and the YouTube encode include commentary as soft subtitles.",
    "descriptionHTML": "<div class=\"p\"><em>Cave Story</em> (2004) is a famous <a href=\"http://www.cavestory.org/\" rel=\"nofollow\" class=\"extlink\">freeware</a> indie game notable for being made entirely by one person, Daisuke \"Pixel\" Amaya.\n</div><div class=\"p\">Watch as <a href=\"https://tasvideos.org/Users/Profile/nitsuja\" class=\"intlink\">nitsuja</a> completely destroys this difficult game with amazingly precise movement. This playthrough saves Curly and finishes with the best ending after beating Ballos.\n</div><div class=\"p\">The program used to make this run, Hourglass, was also developed by nitsuja—with the creation of this run in mind. As such, it is our first published run of a Windows game.\n</div><hr><div class=\"p\">Downloadable encodes and the YouTube encode include commentary as soft subtitles.</div>",
    "published": "2011-11-12",
    "player": "nitsuja",
    "time": "50:10.30",
    "image": "https://tasvideos.org/media/1917M.png",
    "awards": [
      "Award - TAS of 2011",
      "Award - First edition TAS of 2011",
      "Award - Computer TAS of 2011"
    ],
    "genres": [
      {
        "href": "https://tasvideos.org/Movies-Platform",
        "title": "Platform"
      },
      {
        "href": "https://tasvideos.org/Movies-Shooter",
        "title": "Shooter"
      }
    ],
    "tags": [
      {
        "href": "https://tasvideos.org/Movies-best%20ending",
        "title": "Best ending"
      },
      {
        "href": "https://tasvideos.org/Movies-damage",
        "title": "Takes damage to save time"
      }
    ],
    "game": {
      "href": "https://tasvideos.org/818G",
      "title": "Cave Story"
    },
    "emulator": null,
    "torrent": {
      "href": "https://tasvideos.org/torrent/cavestory-tas-bestending-nitsuja.mkv.torrent",
      "title": "A/V file via BitTorrent"
    },
    "links": {
      "youtube": "https://www.youtube.com/watch?v=KNfA59m1LUs",
      "forum": "https://tasvideos.org/Forum/Topics/12002"
    },
    "classes": {
      "isMoon": false,
      "isStar": true
    },
    "flags": {
      "isNotableImprovement": false,
      "isFastestCompletion": false,
      "isConsoleVerified": false,
      "isRecommendedForNewcomers": true,
      "hasCommentary": true
    }
  },
  "error": null
}
```

It's possible to get more complete information by also scraping the submission page, but this hasn't been implemented.

## License

© MIT license.

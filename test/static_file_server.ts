import { createServer } from "http";
import url from "url";
import path from "path";
import { existsSync, statSync, readFile } from "fs";

export function testCreateStaticFileServer(rootFolder = "/public", port = 9000) {
  const httpServer = createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    // parse URL
    const parsedUrl = url.parse(req.url || "");
    // extract URL path
    let pathname = `.${rootFolder}/${parsedUrl.pathname}`;
    // based on the URL path, extract the file extension. e.g. .js, .doc, ...
    const ext = path.parse(pathname).ext;
    // maps file extension to MIME typere
    const map: { [key: string]: string } = {
      ".ico": "image/x-icon",
      ".html": "text/html",
      ".js": "text/javascript",
      ".json": "application/json",
      ".css": "text/css",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".wav": "audio/wav",
      ".mp3": "audio/mpeg",
      ".svg": "image/svg+xml",
      ".pdf": "application/pdf",
      ".doc": "application/msword"
    };

    const exists = existsSync(pathname);
    if (!exists) {
      // if the file is not found, return 404
      res.statusCode = 404;
      res.end(`File ${pathname} not found!`);
      return;
    }

    // if is a directory search for index file matching the extension
    if (statSync(pathname).isDirectory()) {
      pathname += "/index" + ext;
    }

    // read file from file system
    readFile(pathname, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end(`Error getting the file: ${err}.`);
      } else {
        // if the file is found, set Content-type and send data
        res.setHeader("Content-type", map[ext] || "text/plain");
        res.end(data);
      }
    });
  });
  httpServer.listen(port);

  return httpServer;
}

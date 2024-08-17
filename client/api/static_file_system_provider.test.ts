import { describe, expect, test } from "@jest/globals";
import { testCreateStaticFileServer } from "../../test/static_file_server";
import { GetFileSystemProvider } from "./file_system_provider";
import "./static_file_system_provider";

describe("StaticFileSystemProvider", () => {
  test("Init and filesystem", async () => {
    const fileServer = testCreateStaticFileServer();
    console.log(fileServer);
    expect(2 + 2).toBe(4);
    // const data = await (await fetch("http://localhost:9000/index.html")).text();

    const system = GetFileSystemProvider("static");
    expect(system.some).toBeTruthy();
    if (system.some) {
      const initResult = await system.safeValue().init();
      expect(initResult.ok).toBeTruthy();
      if (initResult.ok) {
        const fileSystem = await system.safeValue().getFileSystem();
        console.log(JSON.stringify(fileSystem));

        const fetchedFile = await system.safeValue().readFile("/trips/2024/trip.md");
        console.log("fetchedFile", JSON.stringify(fetchedFile));
      }
    }
    // console.log(data);
    fileServer.close();
  });
});

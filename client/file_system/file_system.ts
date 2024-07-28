
interface File {
  type: "File";
  creationTime: number;
  modificationTime: number;
}

interface ChildDict<T> {
  [key: string]: T;
}

interface Folder {
  type: "Folder";
  children: ChildDict<Folder | File>;
}

interface FileSystem {
  rootFolder: Folder;
  plugins: string[];
}

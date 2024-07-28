
export interface File {
  type: "File";
  creationTime: number;
  modificationTime: number;
}

interface ChildDict<T> {
  [key: string]: T;
}

export interface Folder {
  type: "Folder";
  children: ChildDict<Folder | File>;
}

export interface FileSystem {
  rootFolder: Folder;
  plugins: string[];
}

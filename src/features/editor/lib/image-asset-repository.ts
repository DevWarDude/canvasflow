import {
  openDB,
  type DBSchema,
  type IDBPDatabase,
} from "idb";

interface ImageAsset {
  id: string;
  blob: Blob;
  name: string;
  createdAt: number;
}

interface ImageDatabase extends DBSchema {
  images: {
    key: string;
    value: ImageAsset;
  };
}

const DB_NAME = "canvasflow-image-assets";
const STORE_NAME = "images";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const SUPPORTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

let dbPromise: Promise<IDBPDatabase<ImageDatabase>> | null = null;

function getDatabase() {
  if (!dbPromise) {
    dbPromise = openDB<ImageDatabase>(DB_NAME, 1, {
      upgrade(database) {
        database.createObjectStore(STORE_NAME, {
          keyPath: "id",
        });
      },
    });
  }

  return dbPromise;
}

export async function saveImageAsset(
  file: File,
): Promise<string> {
  if (!SUPPORTED_TYPES.includes(file.type)) {
    throw new Error(
      "Please upload a JPG, PNG, or WebP image.",
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      "The image must be smaller than 5 MB.",
    );
  }

  if (file.size === 0) {
    throw new Error("The selected image is empty.");
  }

  const id = crypto.randomUUID();

  const image: ImageAsset = {
    id,
    blob: file,
    name: file.name,
    createdAt: Date.now(),
  };

  const database = await getDatabase();

  await database.put(STORE_NAME, image);

  return `asset:${id}`;
}

export async function getImageAsset(
  source: string,
): Promise<ImageAsset | null> {
  if (!source.startsWith("asset:")) {
    return null;
  }

  const id = source.slice("asset:".length);

  if (!id) {
    return null;
  }

  const database = await getDatabase();

  return (await database.get(STORE_NAME, id)) ?? null;
}
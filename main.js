import { PineconeClient } from "@pinecone-database/pinecone";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import * as dotenv from "dotenv";
import { createPineconeIndex } from "./create.js";
import { updatePinecone } from "./update.js";
import { queryPineconeVectorStoreAndQueryLLM } from "./query.js";
dotenv.config();

const loader = new DirectoryLoader("./documents", {
  ".txt": (path) => new TextLoader(path),
  ".pdf": (path) => new PDFLoader(path),
});

const docs = await loader.load();
const client = new PineconeClient();

const question = "what is ultimate productivity hack";
const indexName = "article";
const vectorDimension = 1536;

await client.init({
  environment: process.env.PINECONE_ENVIRONMENT,
  apiKey: process.env.PINECONE_API_KEY,
  projectName: "Search Application"
});

// client.projectName = "Search Application";

(async () => {
  // await createPineconeIndex(client, indexName, vectorDimension);
  // await updatePinecone(client, indexName, docs);
  await queryPineconeVectorStoreAndQueryLLM(client, indexName, question);
})();

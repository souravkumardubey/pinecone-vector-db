import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { loadQAStuffChain } from "langchain/chains";
import { Document } from "langchain/document";

export const queryPineconeVectorStoreAndQueryLLM = async (
  client,
  indexName,
  question
) => {
console.log("------Querying Pinecone vector store...--------");
const index = client.Index(indexName);

const queryEmbedding = await new OpenAIEmbeddings().embedQuery(question);
// console.log(queryEmbedding)
const queryResponse = await index.query({
    queryRequest: {
      namespace: "article",
      topK: 1,
      vector: queryEmbedding,
      includeMetadata: true,
      includeValues: true,
    },
  });
  console.log("-------------------------------------------------------")
  console.log(`Found ${queryResponse.matches.length} matches...`);
  console.log("-------------------------------------------------------")
  console.log(`Asking question: ${question}...`);
  console.log("-------------------------------------------------------")
  if (queryResponse.matches.length) {
    const llm = new OpenAI({
      modelName: "davinci-002"
    });
    const chain = loadQAStuffChain(llm);
    const concatenatedPageContent = queryResponse.matches
      .map((match) => match.metadata.pageContent)
      .join(" ");
    console.log(concatenatedPageContent)
    // const result = await chain.call({
    //   input_documents: [new Document({ pageContent: concatenatedPageContent })],
    //   question: question,
    // });
    // console.log(`Answer: ${result.text}`);
    // console.log("----------------------------------------------------------")
  } else {
    console.log("Since there are no matches, GPT-3 will not be queried.");
  }
};

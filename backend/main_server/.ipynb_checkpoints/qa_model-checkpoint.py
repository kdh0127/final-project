from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.embeddings import OpenAIEmbeddings
from langchain_community.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain_community.vectorstores import FAISS
import faiss
import numpy as np
import os
from dotenv import load_dotenv


load_dotenv(dotenv_path="key.env")
openai_api_key = os.getenv('OPENAI_API_KEY')

def create_qa_chain(pdf_path):

    loader = PyPDFLoader(pdf_path)
    documents = loader.load()
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    split_documents = text_splitter.split_documents(documents)
    
    embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)
    embedding_vectors = embeddings.embed_documents([doc.page_content for doc in split_documents])
    
    embedding_dim = len(embedding_vectors[0])
    index = faiss.IndexFlatL2(embedding_dim)
    index.add(np.array(embedding_vectors))
    
    llm = ChatOpenAI(temperature=0.7, model="gpt-4o-mini", openai_api_key=openai_api_key)
    
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=FAISS.from_documents(split_documents, embeddings).as_retriever()
    )
    
    def get_formatted_answer(query):
        result = qa_chain.run(query)
        return result.replace('\n', '<br />')
    
    return get_formatted_answer
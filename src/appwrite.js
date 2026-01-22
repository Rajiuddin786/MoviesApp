import { Client,ID,Databases,Query } from "appwrite";

const PROJECT_ID=import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID=import.meta.env.VITE_APPWRITE_DATABASE_ID;
const TABLE=import.meta.env.VITE_APPWRITE_TABLE;

const client = new Client().setEndpoint('https://fra.cloud.appwrite.io/v1').setProject(PROJECT_ID);



const databases = new Databases(client);


export const updateSearchCount = async (searchTerm, movie) => {
    console.log(typeof movie.id)
  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      TABLE,
      [
        Query.equal('searchTerm', searchTerm),
      ]
    );

    if (result.documents.length > 0) {
      const doc = result.documents[0];

      await databases.updateDocument(
        DATABASE_ID,
        TABLE,
        doc.$id,
        {
          count: doc.count + 1,
        }
      );
    } else {

      await databases.createDocument(
        DATABASE_ID,
        TABLE,
        ID.unique(),
        {
          searchTerm,
          count: 1,
          movie_id: movie.id,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }
      );
    }
  } catch (error) {
    console.error(error);
  }
};

export const getTrendingMovies = async () =>{
  try{
    const result = await databases.listDocuments(DATABASE_ID,TABLE,[
      Query.limit(5),
      Query.orderDesc('count')
    ]);
    return result.documents;
  }catch(error){
    console.error(error);
  }
}
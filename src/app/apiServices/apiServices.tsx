import axios from "axios";

export const getAll = async () => {
  try {
    const getData = await axios.get("https://dummyjson.com/recipes");
    const data = await getData.data.recipes;
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return { data: null, err: error };
  }
};

export const searchApi = async (searchTerm:any) => { 
  try {
    const getSearch = await axios.get(`https://dummyjson.com/recipes/search?q=${searchTerm}`);
    const data = await getSearch.data.recipes;
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return { data: null, err: error };
  }
}

export const getSingle = async (id:string) => {
  try {
    const getSingle = await axios.get(`https://dummyjson.com/recipes/${id}`);
    const data = await getSingle.data;
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return { data: null, err: error };
  }
}

export const getPaginations = async (limit: number, skip:number) => {
  try {
    const getPaginations = await axios.get(`https://dummyjson.com/recipes?limit=${limit}&skip=${skip}&select=name,image`);
    const data = await getPaginations.data.recipes;
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return { data: null, err: error };
  }
}
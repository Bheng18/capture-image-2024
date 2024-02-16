
import axios, { AxiosResponse } from 'axios';

interface ImageType {
  image: string;
  isLoading?: boolean;
}

export async function getImage(responseData: string) {
  try {
    const response = await axios.post<string>(
      `http://localhost:3000/image/${responseData}`
    );
    console.log('RESPONSE API===', response);
     return response;
  } catch (error) {
    console.log('API RESPONSE ERROR DATA===', error);
    }
}
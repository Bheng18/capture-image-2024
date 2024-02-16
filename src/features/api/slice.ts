import type { PayloadAction } from '@reduxjs/toolkit';


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getImage } from './api';
import { AxiosResponse } from 'axios';

interface ImageType {
    image?: string;
    isLoading?: boolean;
}

const initialState: ImageType = {
    image: '',
    isLoading: false,
}            


export const fetchImage = createAsyncThunk(
    "image/fetchImage", 
    async (responseData: string) => {
      const response = await getImage(responseData);
      console.log('response createAsyncThunk', response)
      const res = await response?.data;
    return res;
    }
  );
  
  export const imageSlice = createSlice({
    name: 'image-slice',
    initialState,
    reducers: {
      // getFetchImage: (state, action: PayloadAction<string>) => {
      //   console.log('action.payload', action.payload)
      //   state.image = action.payload;
      // },
    
    },
    extraReducers: (builder) => {
      builder.addCase(fetchImage.pending, (state) => {
        state.isLoading = true
      });
      builder.addCase(fetchImage.fulfilled, (state, action) => {
        console.log('action.payload-EXTRA', action.payload)
        state.isLoading = false
        state.image = action.payload
      });
      builder.addCase(fetchImage.rejected, (state) => {
        state.isLoading = false
      });
    }
  });
  
  // export const { getFetchImage } = imageSlice.actions;
  
  export default imageSlice.reducer;
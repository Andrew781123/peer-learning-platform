import axios from "axios";

const imgurAxiosInstance = axios.create({
  baseURL: "https://api.imgur.com/3/",
  timeout: 5000,
  headers: {
    Authorization: "Client-ID a8219360c299cfe",
    Accept: "application/json",
  },
  transformResponse: [
    (response) => {
      const data = JSON.parse(response);
      if (data.success) {
        return data.data;
      }
      return data;
    },
  ],
});

export const getImage = async (imageHash: string) => {
  const response = await imgurAxiosInstance.get(`image/${imageHash}`);
  console.log(123123, response);
  return response;
};

export const uploadImage = async (base64Image: string) => {
  const response = await imgurAxiosInstance.post<{ id: string }>("image", {
    image: base64Image.split(",")[1],
    type: "base64",
    name: "test.jpg",
  });

  return response.data.id;
};

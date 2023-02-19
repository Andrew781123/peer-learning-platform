import axios from "axios";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const imgurRouter = router({
  uploadImage: protectedProcedure
    .input(z.object({ base64Image: z.string(), name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const response = await axios.post<{ link: string }>(
        "https://api.imgur.com/3/image",
        {
          image: input.base64Image.split(",")[1],
          type: "base64",
          name: "test.jpg",
        },
        {
          timeout: 10000,
          headers: {
            Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
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
        }
      );

      return response.data.link;
    }),
});

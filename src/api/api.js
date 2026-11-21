import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "../store/authSlice";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  timeout: 65000,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth?.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithAutoLogout = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  // Si le serveur répond 401 (jeton expiré ou invalide), on déconnecte automatiquement
  // (on exclut /auth/login pour ne pas vider l'état lors d'un simple échec de saisie)
  const url = typeof args === "string" ? args : args?.url;
  if (result.error?.status === 401 && url !== "/auth/login") {
    api.dispatch(logout());
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAutoLogout,
  tagTypes: ["Product", "User"],
  endpoints: (builder) => ({
    // --- PRODUITS ---
    getProducts: builder.query({
      query: (params) => ({
        url: "/products",
        params,
      }),
      transformResponse: (response) => response.data,
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map(({ id }) => ({ type: "Product", id })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      transformResponse: (response) => response.data.product,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    createProduct: builder.mutation({
      query: (newProduct) => ({
        url: "/products",
        method: "POST",
        body: newProduct,
      }),
      transformResponse: (response) => response.data.product,
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    updateProduct: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: patch,
      }),
      transformResponse: (response) => response.data.product,
      invalidatesTags: (result, error, { id }) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),

    // --- AUTHENTIFICATION ---
    register: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
      transformResponse: (response) => response.data.user,
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response) => response.data,
      invalidatesTags: ["User"],
    }),

    getMe: builder.query({
      query: () => "/auth/me",
      transformResponse: (response) => response.data.user,
      providesTags: ["User"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useRegisterMutation,
  useLoginMutation,
  useGetMeQuery,
} = api;

import axios from "axios";
import { Product, ProductsResponse, Category as CategoryType } from "./types";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
}

export interface UserResponse {
  user: User;
}

export interface UpdateUserRequest {
  name: string;
  birthday: string;
  email: string;
  phone: string;
}

export interface UpdateUserResponse {
  status: boolean;
  message: string;
  user: User;
}

export interface UserCompany {
  id: string;
  company_name: string;
  number_company: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface UserCompaniesResponse {
  data: UserCompany[];
}

export interface CategoriesResponse {
  data: CategoryType[];
}

export enum SortOption {
  popular = "popular",
  priceAsc = "price-asc",
  priceDesc = "price-desc",
  newest = "newest",
  oldest = "oldest",
}

const API_URL = "https://cry-com.ru/api";
const TOKEN = "15|m7HtQmv1qr20lmiYiCex1Z4kcHt6vKtBTx5Oy45m04344081";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${TOKEN}`,
  },
});

export const getUserProfile = async (): Promise<User> => {
  try {
    const response = await api.get<UserResponse>("/v1/user");
    return response.data.user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (
  data: UpdateUserRequest
): Promise<User> => {
  try {
    const response = await api.post<UpdateUserResponse>(
      "/v1/user/update",
      data
    );
    return response.data.user;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export const getUserCompanies = async (): Promise<UserCompany[]> => {
  try {
    const response = await api.get<UserCompaniesResponse>("/v1/user/company");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching user companies:", error);
    throw error;
  }
};

export async function dissolveCompany(
  companyId: string
): Promise<{ status: boolean; message: string }> {
  const response = await api.delete(`/v1/user/company/dissolve/${companyId}`);
  return response.data;
}

export async function createCompany(
  company_name: string
): Promise<UserCompany> {
  const response = await api.put<UserCompany>(`/v1/user/company/create`, {
    company_name,
  });
  return response.data;
}

export async function getCategories(): Promise<CategoryType[]> {
  try {
    const response = await api.get<CategoriesResponse>("/v1/categories");
    // Transform the API response to match the expected Category type
    return response.data.data.map((category) => ({
      id: category.id || "",
      name: category.name || "",
      position: category.position || "",
      iconUrl: category.iconUrl || null,
      children: category.children || [],
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

export const getProducts = async (categoryId?: number): Promise<Product[]> => {
  try {
    const params = new URLSearchParams();
    if (categoryId) {
      params.append("category_id", categoryId.toString());
    }

    const response = await api.get<ProductsResponse>(
      `/v1/products?${params.toString()}`
    );
    console.log("Get Products - Response:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const fetchProducts = async (
  page: number,
  limit: number = 20,
  sort: SortOption = "popular",
  categoryId?: number | string,
  searchQuery: string = ""
): Promise<Product[]> => {
  try {
    const params = new URLSearchParams();

    if (sort) params.append("sort", sort);
    if (searchQuery) params.append("search", searchQuery);
    if (categoryId) params.append("category_id", categoryId.toString());

    params.append("page", page.toString());
    params.append("limit", limit.toString());

    const response = await api.get<ProductsResponse>(
      `/v1/products${
        categoryId === "all" ? "/no-category" : `?${params.toString()}`
      }`
    );

    return response.data.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export interface CartOption {
  option_id: number;
  option_value_id: number;
}

export interface SaveCartItemRequest {
  product_id: number;
  quantity: number;
  size: number;
  options: Array<{
    option_id: number;
    option_value_id: number;
  }>;
}

export interface DeleteCartItemRequest {
  cart_id: number;
  product_id: number;
}

export interface OrderCartItem {
  id: string;
  name: string;
  description: string;
  image: string | null;
  discountPercentage: string;
  unit: string;
  brand: string;
  size: string;
  options: string[];
  quantity: number;
}

export interface OrderCartResponse {
  data: OrderCartItem[];
}

export const saveCartItem = async (
  data: SaveCartItemRequest
): Promise<OrderCartResponse> => {
  try {
    console.log(
      "Saving Cart Item - Request Data:",
      JSON.stringify(data, null, 2)
    );

    // Validate input
    if (!data.product_id) throw new Error("Product ID is required");
    if (!data.size) throw new Error("Size is required");
    if (data.quantity <= 0) throw new Error("Quantity must be greater than 0");

    try {
      const response = await api.post<OrderCartResponse>(
        "/v1/order/cart/save",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            // HARDCODED TOKEN - REPLACE WITH ACTUAL TOKEN RETRIEVAL
            Authorization:
              "Bearer 15|m7HtQmv1qr20lmiYiCex1Z4kcHt6vKtBTx5Oy45m04344081",
          },
        }
      );
      console.log("Save Cart Item - Response:", response.data);
      return response.data;
    } catch (axiosError: any) {
      // More detailed Axios error handling
      console.error("Axios Error Details:", {
        message: axiosError.message,
        code: axiosError.code,
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        headers: axiosError.response?.headers,
      });

      // If there's a specific error response, throw with more context
      if (axiosError.response) {
        const errorDetails = {
          status: axiosError.response.status,
          data: axiosError.response.data,
          headers: axiosError.response.headers,
        };
        throw new Error(`Cart Save Failed: ${JSON.stringify(errorDetails)}`);
      }

      // Rethrow original error if no additional context
      throw axiosError;
    }
  } catch (error: any) {
    console.error("Final Error in saveCartItem:", error);

    // More detailed error logging
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      console.error("Error response headers:", error.response.headers);
    }

    throw error;
  }
};

export async function deleteCartItem(data: DeleteCartItemRequest) {
  try {
    const response = await api.post("/v1/order/cart/delete", { data });
    return response.data;
  } catch (error) {
    console.error("Error deleting cart item:", error);
    throw error;
  }
}

export const fetchCart = async (): Promise<OrderCartItem[]> => {
  try {
    const response = await api.get<OrderCartResponse>("/v1/order/cart");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw error;
  }
};

export interface PromoCodeResponse {
  valid: boolean;
  discount: number;
  message: string;
}

export const validatePromoCode = async (
  code: string
): Promise<PromoCodeResponse> => {
  try {
    const response = await api.post<PromoCodeResponse>("/v1/promo/validate", {
      code,
    });
    return response.data;
  } catch (error) {
    console.error("Error validating promo code:", error);
    throw error;
  }
};

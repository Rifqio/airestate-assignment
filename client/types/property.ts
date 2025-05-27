export interface Property {
  id: string;
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  address: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface PropertiesResponse {
  status: boolean;
  message: string;
  data: Property[];
}

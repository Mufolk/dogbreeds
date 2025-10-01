//API interfaces
export interface DogBreed {
    name: string;
    subBreeds?: string[];
}

export interface DogImage {
    message: string;
    status: string;
}

export interface BreedImagesResponses {
    message: string[];
    status: string;
}

export interface AllBreedsResponse {
    message: Record<string, string[]>;
    status: string;
}

export interface FavoriteBreed {
    breed: string;
    addedAt: string;
}

export interface AddFavoriteRequest {
    breed: string;
}

export interface FavoritesResponse {
    favorites: string[];
}

//Frontend Interfaces

export interface Breed {
    id: string;
    name: string;
    displayName: string;
    subBreeds: string[];
    isFavorite: boolean;
    images: string[];
}

export interface LoadingState {
    breeds: boolean;
    images: boolean;
    favorites: boolean;
}

export interface ErrorState {
    message: string;
    type: 'error' | 'warning' | 'info';
}

import apiService from '@/services/api';
import type { Breed, ErrorState, LoadingState } from '@/types/breed';
import { ref, computed, onMounted } from 'vue';
import type { Ref } from 'vue';

export function useBreeds() {
    const breeds: Ref<Breed[]> = ref([]);
    const favorites: Ref<string[]> = ref([]);
    const loading: Ref<LoadingState> = ref({
        breeds: false,
        images: false,
        favorites: false,
    });
    const error: Ref<ErrorState | null> = ref(null);

    const favoriteBreeds = computed(() => {
        return breeds.value.filter(breed => favorites.value.includes(breed.name));
    });

    const totalBreeds = computed(() => breeds.value.length);
    const totalFavorites = computed(() => favorites.value.length);

    const clearError = () => {
        error.value = null;
    } 

    const setError = (message: string, type: ErrorState['type'] = 'error') => {
        error.value = {message, type};
    };

    const fetchAllBreeds = async () => {
        try {
            loading.value.breeds = true;
            clearError();

            const breedNames = await apiService.getAllBreeds();

            breeds.value = breedNames.map((name: string) => ({
                id: name,
                name,
                displayName: name.charAt(0).toUpperCase() + name.slice(1),
                subBreeds: [],
                isFavorite: favorites.value.includes(name),
                images: [],
            }));
        } catch (error) {
            setError('Failed to load dog breeds. Please try again.');
            console.error('Error fetching breeds: ', error);
        } finally {
            loading.value.breeds = false;
        }
    }

    const fetchBreedImages = async (breedName: string) => {
        try {
            loading.value.images = true;
            clearError();

            const images = await apiService.getBreedImages(breedName);

            const breedIndex = breeds.value.findIndex(breed => breed.name === breedName);
            if (breedIndex !== -1) {
                const breed = breeds.value[breedIndex];
                if (breed) {
                    breed.images = images;
                }
            }

            return images;
        } catch (error) {
            setError(`Failed to load images for ${breedName}. Please try again.`);
            console.error('Error fetching breed images:', error);
            return [];
        } finally {
            loading.value.images = false;
        }
    }

    const fetchFavorites = async () => {
        try {
            loading.value.favorites = true;
            clearError();

            favorites.value = await apiService.getFavorites();

            breeds.value.forEach(breed => {
                breed.isFavorite = favorites.value.includes(breed.name);
            });
        } catch (error) {
            setError(`Failed to load favorites. Please try again.`);
            console.error('Error fetching favorites:', error);
        } finally {
            loading.value.favorites = false;
        }
    }

    const toggleFavorite = async (breedName: string) => {
        try {
            const isFavorite = favorites.value.includes(breedName);

            if (isFavorite) {
                await apiService.removeFavorite(breedName);
                favorites.value = favorites.value.filter(name => name !== breedName);
            } else {
                await apiService.addFavorite(breedName);
                favorites.value.push(breedName);
            }

            const breedIndex = breeds.value.findIndex(breed => breed.name === breedName);
            if (breedIndex !== -1) {
                const breed = breeds.value[breedIndex];
                if (breed) {
                    breed.isFavorite = !isFavorite;
                }
            }

            //TODO: create messaging mechanisms to avoid semantic usage of set error 

            //the existing error handling mechanism (setError and error state) 
            //is being repurposed as a general user message
            const action = isFavorite ? 'removed from' : 'added to';
            setError(`${breedName} ${action} favorites!`, 'info');
            setTimeout(clearError, 3000); //clear messages after 3 secs

        } catch (error) {
            setError(`Failed to update favorite status for ${breedName}.`);
            console.error('Error toggling favorite:', error);
        }
    }

    onMounted(async () => {
        await Promise.all([
            fetchAllBreeds(),
            fetchFavorites(),
        ]);
    });

    return {
        breeds,
        favorites,
        loading,
        error,
        favoriteBreeds,
        totalBreeds,
        totalFavorites,
        clearError,
        setError,
        fetchAllBreeds,
        fetchBreedImages,
        fetchFavorites,
        toggleFavorite
    };
}
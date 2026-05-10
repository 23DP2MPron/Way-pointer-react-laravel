import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import pexelsService from '../services/pexelsService';
import institutionImageService from '../services/institutionImageService';
import placeImageService from '../services/placeImageService';

export default function PlaceCard({ place, type = 'place' }) {
  // For external places create special URL with xid
  const href = place.isExternal || place.id?.toString().startsWith('external-')
    ? `/places/external/${place.xid}?type=${type}`
    : type === 'place' 
    ? `/places/${place.id}` 
    : `/places/${place.id}?type=institution`;
    
  const [imageError, setImageError] = useState(false);
  const [pexelsImage, setPexelsImage] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Check if place is external (from OpenTripMap)
  const isExternal = place.isExternal || place.id?.toString().startsWith('external-');
  
  // Load photo from Pexels on component mount
  useEffect(() => {
    const loadPexelsImage = async () => {
      // If image_url or image already exists, don't load from Pexels
      if (place.image_url || place.image) {
        return;
      }
      
      // Check cache in localStorage
      const cacheKey = `pexels_${type}_${place.id}`;
      const cached = localStorage.getItem(cacheKey);
      
      if (cached) {
        setPexelsImage(cached);
        return;
      }
      
      // Load from Pexels
      setLoading(true);
      try {
        let photoUrl = null;
        
        if (type === 'institution') {
          photoUrl = await pexelsService.getInstitutionPhoto(
            place.name,
            place.category || 'other',
            place.city
          );
        } else if (type === 'place') {
          photoUrl = await pexelsService.getPlacePhoto(
            place.name,
            place.city
          );
        }
        
        if (photoUrl) {
          setPexelsImage(photoUrl);
          // Cache for 7 days
          localStorage.setItem(cacheKey, photoUrl);
        }
      } catch (error) {
        console.error('Error loading Pexels image:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPexelsImage();
  }, [place.id, place.name, place.city, place.category, place.image_url, place.image, type]);
  
  // Get image URL with priorities
  const getImageUrl = () => {
    // Priority 1: image_url from database (direct links)
    if (place.image_url) {
      return place.image_url;
    }
    
    // Priority 2: uploaded image
    if (place.image) {
      return `${import.meta.env.VITE_API_URL?.replace('/api', '')}/storage/${place.image}`;
    }
    
    // Priority 3: photo from Pexels API
    if (pexelsImage) {
      return pexelsImage;
    }
    
    // Priority 4: fallback to Lorem Picsum
    if (type === 'institution') {
      return institutionImageService.getInstitutionImageWithFallback(
        place.name, 
        place.category || 'other', 
        place.city
      );
    }
    
    if (type === 'place') {
      return placeImageService.getPlaceImageWithFallback(
        place.name, 
        place.category || 'landmark', 
        place.city
      );
    }
    
    return null;
  };

  const imageUrl = getImageUrl();

  return (
    <Link to={href} className="card group overflow-hidden flex flex-col">
      <div className="h-48 bg-gradient-to-br from-green-100 to-teal-100 dark:from-gray-800 dark:to-gray-700 overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        )}
        {imageUrl && !imageError && !loading ? (
          <img
            src={imageUrl}
            alt={place.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        ) : !loading ? (
          <div className="w-full h-full flex items-center justify-center text-5xl opacity-40">🗺️</div>
        ) : null}
      </div>
      <div className="p-4 flex flex-col gap-1 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-semibold text-base leading-tight group-hover:text-green-600 dark:group-hover:text-teal-400 transition-colors">{place.name}</h3>
          {(place.rating > 0 && (place.review_count > 0 || place.reviews?.length > 0)) && (
            <span className="flex items-center gap-0.5 text-xs font-medium text-amber-500 shrink-0">
              ⭐ {place.rating?.toFixed(1)}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{place.city}, {place.country}</p>
        {place.description && (
          <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">{place.description}</p>
        )}
        <span className="mt-auto pt-2 text-xs uppercase tracking-wider font-medium text-green-600 dark:text-teal-400">
          {type === 'institution' ? place.category : place.category || place.type}
        </span>
      </div>
    </Link>
  );
}

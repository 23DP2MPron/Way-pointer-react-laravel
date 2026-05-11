import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import nominatimService from '../services/nominatimService';
import openTripMapService from '../services/openTripMapService';

export default function CreateRoute() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: '',
    description: '',
    country: '',
    city: '',
    duration_days: '',
    is_published: false,
  });
  const [points, setPoints] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [attractions, setAttractions] = useState([]);
  const [loadingAttractions, setLoadingAttractions] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestedPlaces, setSuggestedPlaces] = useState([]);
  const [suggestedInstitutions, setSuggestedInstitutions] = useState([]);

  useEffect(() => {
    if (isEdit) {
      api.get(`/routes/${id}`).then(r => {
        const route = r.data;
        setForm({
          title: route.title,
          description: route.description || '',
          country: route.country || '',
          city: route.city || '',
          duration_days: route.duration_days || '',
          is_published: route.is_published,
        });
        setPoints(route.points?.map(p => ({
          target_type: p.target_type,
          target_id: p.target_id,
          notes: p.notes || '',
          name: p.target_detail?.name || 'Unknown',
        })) || []);
      });
    }
  }, [id]);

  // Загрузка достопримечательностей при изменении города или страны
  useEffect(() => {
    const loadAttractions = async () => {
      if (!form.country) {
        setAttractions([]);
        return;
      }

      setLoadingAttractions(true);
      try {
        // Получаем координаты города или страны
        const location = await nominatimService.getLocationCoordinates(form.city, form.country);
        
        if (location) {
          // Загружаем достопримечательности из OpenTripMap
          const places = await openTripMapService.getPlacesByRadius(
            location.lat, 
            location.lon, 
            form.city ? 10000 : 50000, // 10км для города, 50км для страны
            30
          );
          
          // Фильтруем и обогащаем данные
          const enrichedAttractions = places
            .filter(place => place.name && place.kinds) // Только места с названием и категорией
            .map(place => ({
              xid: place.xid,
              name: place.name,
              kinds: place.kinds,
              lat: place.point.lat,
              lon: place.point.lon,
              dist: place.dist
            }));
          
          setAttractions(enrichedAttractions);
        } else {
          setAttractions([]);
        }
      } catch (error) {
        console.error('Error loading attractions:', error);
        setAttractions([]);
      } finally {
        setLoadingAttractions(false);
      }
    };

    // Задержка для избежания частых запросов при вводе
    const timeoutId = setTimeout(loadAttractions, 800);
    return () => clearTimeout(timeoutId);
  }, [form.city, form.country]);

  // Загрузка популярных places и institutions при изменении города или страны
  useEffect(() => {
    const loadSuggestedPlacesAndInstitutions = async () => {
      if (!form.country) {
        setSuggestedPlaces([]);
        setSuggestedInstitutions([]);
        return;
      }

      try {
        const searchQuery = form.city || form.country;
        const [places, insts] = await Promise.all([
          api.get('/places', { params: { search: searchQuery, per_page: 10 } }),
          api.get('/institutions', { params: { search: searchQuery, per_page: 10 } }),
        ]);
        
        // Фильтруем по городу (приоритет) или стране
        const filterByLocation = (items) => {
          if (form.city) {
            return items.filter(item => 
              item.city?.toLowerCase().includes(form.city.toLowerCase())
            );
          }
          return items.filter(item => 
            item.country?.toLowerCase().includes(form.country.toLowerCase())
          );
        };

        setSuggestedPlaces(filterByLocation(places.data.data));
        setSuggestedInstitutions(filterByLocation(insts.data.data));
      } catch (error) {
        console.error('Error loading suggested places and institutions:', error);
      }
    };

    // Задержка для избежания частых запросов при вводе
    const timer = setTimeout(loadSuggestedPlacesAndInstitutions, 800);
    return () => clearTimeout(timer);
  }, [form.city, form.country]);

  const handleSearch = async (e) => {
    const q = e.target.value;
    setSearch(q);
    setShowDropdown(true);
    
    if (q.length < 2) { 
      setSearchResults([]); 
      return; 
    }
    
    const [places, insts] = await Promise.all([
      api.get('/places', { params: { search: q, per_page: 4 } }),
      api.get('/institutions', { params: { search: q, per_page: 4 } }),
    ]);
    setSearchResults([
      ...places.data.data.map(p => ({ ...p, target_type: 'place' })),
      ...insts.data.data.map(p => ({ ...p, target_type: 'institution' })),
    ]);
  };

  const handleSearchFocus = () => {
    setShowDropdown(true);
  };

  const handleSearchBlur = () => {
    // Задержка чтобы клик по элементу успел сработать
    setTimeout(() => setShowDropdown(false), 200);
  };

  const addPoint = (item) => {
    if (points.find(p => p.target_type === item.target_type && p.target_id === item.id)) return;
    setPoints([...points, { target_type: item.target_type, target_id: item.id, notes: '', name: item.name }]);
    setSearch('');
    setSearchResults([]);
    setShowDropdown(false);
  };

  const addAttractionAsPoint = (attraction) => {
    // Проверяем, не добавлена ли уже эта достопримечательность
    if (points.find(p => p.target_type === 'attraction' && p.attractionData?.xid === attraction.xid)) return;
    
    setPoints([...points, { 
      target_type: 'attraction', 
      target_id: null, // Внешние достопримечательности не имеют ID в нашей БД
      notes: '', 
      name: attraction.name,
      attractionData: attraction // Сохраняем данные достопримечательности
    }]);
    setSearch('');
    setShowDropdown(false);
  };

  const removePoint = (index) => setPoints(points.filter((_, i) => i !== index));

  const updateNote = (index, notes) => setPoints(points.map((p, i) => i === index ? { ...p, notes } : p));

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSaving(true);

  try {
    // Фильтруем точки: убираем привлечения (attraction) — они только для UI
    const validPoints = points
      .filter(p => p.target_id !== null && p.target_id !== undefined)
      .map((p, index) => ({
        target_type: p.target_type,
        target_id: Number(p.target_id),
        notes: p.notes || '',
      }));

    console.log('Valid points to send:', validPoints);

    const payload = {
      title: form.title,
      description: form.description || '',
      country: form.country || '',
      city: form.city || '',
      duration_days: form.duration_days ? Number(form.duration_days) : null,
      is_published: Boolean(form.is_published),
    };

    // Не отправляем points если пусто — иначе required_with сработает некорректно
    if (validPoints.length > 0) {
      payload.points = validPoints;
    }

    console.log('Payload to send:', payload);

    if (isEdit) {
      await api.put(`/routes/${id}`, payload);
    } else {
      await api.post('/routes', payload);
    }

    navigate('/my-routes');
  } catch (err) {
    console.error('Server Error:', err.response?.data);
    const serverErrors = err.response?.data?.errors;
    if (serverErrors) {
      const msg = Object.values(serverErrors).flat().join(', ');
      setError(msg);
    } else {
      setError(err.response?.data?.message || 'Ошибка при сохранении');
    }
  } finally {
    setSaving(false);
  }
};

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-display font-bold mb-8">{isEdit ? t('routes.editRoute') : t('routes.createNewRoute')}</h1>

      {error && <div className="bg-red-50 dark:bg-red-900/30 text-red-600 rounded-lg p-3 text-sm mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="card p-6 flex flex-col gap-4">
          <h2 className="font-display font-semibold">{t('routes.routeInfo')}</h2>
          <div>
            <label className="text-sm font-medium mb-1 block">{t('routes.titleRequired')}</label>
            <input required className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder={t('routes.titlePlaceholder')} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">{t('routes.description')}</label>
            <textarea className="input resize-none" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder={t('routes.descriptionPlaceholder')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">{t('routes.country')}</label>
              <input className="input" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} placeholder={t('routes.countryPlaceholder')} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">{t('routes.city')}</label>
              <input className="input" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder={t('routes.cityPlaceholder')} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">{t('routes.duration')}</label>
            <input type="number" min="1" className="input" value={form.duration_days} onChange={e => setForm({ ...form, duration_days: e.target.value })} placeholder={t('routes.durationPlaceholder')} />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_published} onChange={e => setForm({ ...form, is_published: e.target.checked })} className="w-4 h-4 rounded" />
            <span className="text-sm font-medium">{t('routes.publishRoute')}</span>
          </label>
        </div>

        <div className="card p-6 flex flex-col gap-4">
          <h2 className="font-display font-semibold">{t('routes.routePoints')}</h2>

          <div className="relative">
            <input 
              className="input" 
              value={search} 
              onChange={handleSearch}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              placeholder={t('routes.searchPlaceholder')} 
            />
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 z-10 mt-1 card shadow-xl py-1 max-h-96 overflow-y-auto">
                {loadingAttractions && search.length < 2 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto mb-2"></div>
                    <p className="text-xs">{t('routes.loadingAttractions')}</p>
                  </div>
                ) : search.length >= 2 && searchResults.length > 0 ? (
                  <>
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">{t('routes.searchResults')}</div>
                    {searchResults.map(item => (
                      <button key={`${item.target_type}-${item.id}`} type="button" onClick={() => addPoint(item)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 flex justify-between items-center">
                        <div>
                          <div>{item.name}</div>
                          <div className="text-xs text-gray-400">{item.target_type} · {item.city}</div>
                        </div>
                        <span className="text-xs text-green-600">{t('routes.add')}</span>
                      </button>
                    ))}
                  </>
                ) : (attractions.length > 0 || suggestedPlaces.length > 0 || suggestedInstitutions.length > 0) && search.length < 2 ? (
                  <>
                    {attractions.length > 0 && (
                      <>
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                          {t('routes.popularAttractions')} {form.city ? `${t('routes.in')} ${form.city}` : form.country ? `${t('routes.in')} ${form.country}` : ''}
                        </div>
                        {attractions.slice(0, 10).map((attraction) => (
                          <button 
                            key={attraction.xid}
                            type="button" 
                            onClick={() => addAttractionAsPoint(attraction)}
                            disabled={points.find(p => p.target_type === 'attraction' && p.attractionData?.xid === attraction.xid)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 flex justify-between items-center disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="truncate">{attraction.name}</div>
                              <div className="text-xs text-gray-400 truncate">
                                {attraction.kinds.split(',').slice(0, 2).join(', ')}
                                {attraction.dist && ` · ${Math.round(attraction.dist)}${t('routes.away')}`}
                              </div>
                            </div>
                            <span className="text-xs text-green-600 ml-2">
                              {points.find(p => p.target_type === 'attraction' && p.attractionData?.xid === attraction.xid) ? t('routes.added') : t('routes.add')}
                            </span>
                          </button>
                        ))}
                      </>
                    )}
                    
                    {suggestedPlaces.length > 0 && (
                      <>
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase mt-2">
                          {t('routes.popularPlaces')} {form.city ? `${t('routes.in')} ${form.city}` : form.country ? `${t('routes.in')} ${form.country}` : ''}
                        </div>
                        {suggestedPlaces.slice(0, 5).map((place) => (
                          <button 
                            key={`place-${place.id}`}
                            type="button" 
                            onClick={() => addPoint({ ...place, target_type: 'place' })}
                            disabled={points.find(p => p.target_type === 'place' && p.target_id === place.id)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 flex justify-between items-center disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="truncate">{place.name}</div>
                              <div className="text-xs text-gray-400 truncate">{t('routes.place')} · {place.city}</div>
                            </div>
                            <span className="text-xs text-green-600 ml-2">
                              {points.find(p => p.target_type === 'place' && p.target_id === place.id) ? t('routes.added') : t('routes.add')}
                            </span>
                          </button>
                        ))}
                      </>
                    )}
                    
                    {suggestedInstitutions.length > 0 && (
                      <>
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase mt-2">
                          {t('routes.popularInstitutions')} {form.city ? `${t('routes.in')} ${form.city}` : form.country ? `${t('routes.in')} ${form.country}` : ''}
                        </div>
                        {suggestedInstitutions.slice(0, 5).map((inst) => (
                          <button 
                            key={`inst-${inst.id}`}
                            type="button" 
                            onClick={() => addPoint({ ...inst, target_type: 'institution' })}
                            disabled={points.find(p => p.target_type === 'institution' && p.target_id === inst.id)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 flex justify-between items-center disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="truncate">{inst.name}</div>
                              <div className="text-xs text-gray-400 truncate">{t('routes.institution')} · {inst.city}</div>
                            </div>
                            <span className="text-xs text-green-600 ml-2">
                              {points.find(p => p.target_type === 'institution' && p.target_id === inst.id) ? t('routes.added') : t('routes.add')}
                            </span>
                          </button>
                        ))}
                      </>
                    )}
                  </>
                ) : search.length >= 2 && searchResults.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-gray-500">{t('routes.noResultsFound')}</div>
                ) : (
                  <div className="px-4 py-8 text-center text-sm text-gray-500">
                    {form.city || form.country ? t('routes.startTyping') : t('routes.enterLocation')}
                  </div>
                )}
              </div>
            )}
          </div>

          {points.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">{t('routes.noPointsYet')}</p>
          ) : (
            <div className="flex flex-col gap-3">
              {points.map((point, index) => (
                <div key={index} className="flex gap-3 items-start p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="w-7 h-7 rounded-full bg-green-600 text-white text-xs flex items-center justify-center font-bold shrink-0 mt-1">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{point.name}</p>
                    <p className="text-xs text-gray-500 mb-1">{point.target_type}</p>
                    <input className="input text-xs py-1.5" placeholder={t('routes.notesPlaceholder')} value={point.notes} onChange={e => updateNote(index, e.target.value)} />
                  </div>
                  <button type="button" onClick={() => removePoint(index)} className="text-gray-400 hover:text-red-500 transition-colors text-lg mt-1">×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" disabled={saving} className="btn-primary w-full py-3 text-base">
          {saving ? t('routes.saving') : isEdit ? t('routes.saveChanges') : t('routes.create')}
        </button>
      </form>
    </div>
  );
}

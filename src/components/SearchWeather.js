import { useState, useEffect } from "react";
import './SearchWeather.css'

 const URLFetch = "https://api.weatherapi.com/v1/current.json?key=e4042a92106e42cfaf9185812242908&q="
 
function SearchWeather(){

    const[query, setQuery] = useState('')
    const[data, setData] = useState(null)

    
    const[name, setName] = useState(null)
    const[country, setCountry] = useState('')
    
    const[img, setImg] = useState('')
    const[temp, setTemp] = useState('')

    const[last_updated, setLast_updated] = useState('')
    const[text, setText] = useState('')

    const[error, setError] = useState(null);

    const [showBox, setShowBox] = useState(true);

    const [searchHistory, setSearchHistory] = useState([]); // Estado para almacenar la historia de búsquedas

    const fetchSearch = () =>{
        if (query.trim() === '') {
            setError('La consulta no puede estar vacía.');
            return;
        }

        if (!isNaN(query)) {
            setError('La consulta no puede ser un número.');
            return;
        }

        fetch(URLFetch + query)

            .then(response => {
                if (!response.ok) {
                    throw new Error('Problema de conexión o ciudad no encontrada.');
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    setError(data.error.message);
                } else {
                    setError(null)

                    const searchData = {
                        name: data.location.name,
                        country: data.location.country,
                        img: data.current.condition.icon,
                        temp: data.current.temp_c,
                        last_updated: data.current.last_updated,
                        text: data.current.condition.text,
                    };
                    setSearchHistory([...searchHistory, searchData]);

                    setData(data);
                    setName(data.location.name);
                    setCountry(data.location.country);
                    
                    setImg(data.current.condition.icon);
                    setTemp(data.current.temp_c);
                    setLast_updated(data.current.last_updated);
                    setText(data.current.condition.text);

                    setShowBox(true); 
                }

            })
            .catch(error => {
                if (error.message === 'Failed to fetch') {
                    setError('Error de conexión. Por favor, verifica tu conexión a internet.');
                } else {
                    setError('Ciudad no encontrada en la API.');
                }
                console.error('Error al cargar el archivo JSON:', error);
            });
                
        }

   const handleChange = (e) => {
        setQuery(e.target.value);
      };

    const handleSubmit = (e) =>{
        e.preventDefault()
        fetchSearch()
    }

    const handleRemove = (index) => {
        // Eliminar el panel en la posición especificada
        setSearchHistory(searchHistory.filter((_, i) => i !== index));
    }

    return(
        <div className="main">
            <form className="form-main" onSubmit={handleSubmit}>
                <input 
                type="text"
                value={query}
                onChange={handleChange}
                placeholder="Spain, Londres, Cuba, California.."
                />
                <button type="submit">Search</button>
            </form>
            
                {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <div className="search-history">
                {searchHistory.map((search, index) => (
                    <div key={index} className="box_main">
                        <button className="close-btn" onClick={() => handleRemove(index)}>X</button>
                        <div className="city">
                            <h2>{search.name}</h2>
                            <h4>{search.country}</h4>
                        </div>
                        <div className="temp">
                        {search.text === 'Partly cloudy' ? (
                                <img src={require('../imgs/parcialmentenublado.png')} alt="weather" className="img-prop" />
                            ) : search.text === 'Sunny' ? (
                                <img src={require('../imgs/soleado.png')} alt="weather" className="img-prop" />
                            ) : search.text === 'Light rain shower' ? (
                                <img src={require('../imgs/lluvia.png')} alt="weather" className="img-prop" />
                            )
                              : search.text === 'Mist' ? (
                                <img src={require('../imgs/nublado.png')} alt="weather" className="img-prop" />
                            )
                            : search.text === 'Moderate or heavy rain with thunder' ? (
                                <img src={require('../imgs/parcialmentenubladocontruenos.png')} alt="weather" className="img-prop" />
                            )
                            
                              : (
                                <img src={require('../imgs/soleado.png')} alt="weather" className="img-prop" />
                            )}
                            
                            <span>{search.text}</span>
                            <h3>{search.temp} ºC</h3>
                        </div>
                        <div className="medio">
                            <h3>Última actualización </h3>
                            <h4>{search.last_updated}</h4>
                        </div>
                    </div>
                ))}
            </div>

            
        </div>
    )
}

export default SearchWeather;
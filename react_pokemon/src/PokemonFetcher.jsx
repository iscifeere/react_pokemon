import { useState, useEffect } from "react";
import './PokemonFetcher.css';

function PokemonFetcher() {
    const [pokemon, setPokemon] = useState([]);
    const [inputValue, setInput] = useState("");
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    const registraCambioValor = (e) => {
        setInput(e.target.value);
        e.target.setCustomValidity('') //Reinicia mensaje de validez cuando usuario escribe, ya que no se sabe si es valido aún o no mientras escribe.
    }

    /* useEffect(() => {
        
    }, []); */

    if(cargando) {
        return <p>Cargando Pokémon...</p>;
    }
    if(error) {
        return <p>Error: {error}</p>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setCargando(true);
            setError(null);

            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${inputValue}`);
            if(!response.ok) {
                throw new Error(`Error fetching Pokemon with name: ${inputValue}`);
            }
            const data = await response.json()
            const fetchedPokemon = {
                id: data.id,
                name: data.name,
                image: data.sprites.front_default,
                types: data.types.map(infoTipo => infoTipo.type.name.charAt(0).toUpperCase() + infoTipo.type.name.slice(1)).join(', ')
            }

            setPokemon([fetchedPokemon]);

        } catch(err) {setError(err.message);
        } finally {setCargando(false);}
    }

    return (
        <div className="pokemon-container">
            <h2>Busca Pokémon: </h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Pokémon" name="query" value={inputValue} onChange={(e) => registraCambioValor(e)} minLength={3} maxLength={30} onInvalid={(e) => e.target.setCustomValidity("Ingrese de 3-30 carácteres.")}/>
                <button>Buscar</button>
            </form>
            <div className="pokemon-list">
                {pokemon.map(pokemon => (
                    <div key={pokemon.id} className="pokemon-card">
                        <h3>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
                        <img src={pokemon.image} alt={pokemon.name}/>
                        <p>Tipos: {pokemon.types}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PokemonFetcher;
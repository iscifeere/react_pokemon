import { useState, useEffect } from "react";
import './PokemonFetcher.css';

function PokemonFetcher() {
    const [dex, setDex] = useState([]);
    const [estadoDex, setEstadoDex] = useState("cargando");
    const [errorDex, setErrorDex] = useState(null);

    const [mensaje, setMensaje] = useState("");
    const [pokemon, setPokemon] = useState([]);
    const [inputValue, setInput] = useState("");
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    const registraCambioValor = (e) => {
        setInput(e.target.value);
        e.target.setCustomValidity('') //Reinicia mensaje de validez cuando usuario escribe, ya que no se sabe si es valido aún o no mientras escribe.
    }

    useEffect(() => {
        if(estadoDex === "cargando") {
            const conseguirDex = async () => {
                try {
                    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1400`);
                    if(!response.ok) {
                        throw new Error(`Error: Hubo un problema consiguiendo la lista completa de Pokémon.`);
                    }
                    const listaPkmn = await response.json()
                    setDex(listaPkmn.results);
                    setEstadoDex("recibido")
                    setErrorDex(null)
                } catch(err) {
                    setEstadoDex("error")
                    setErrorDex(err)
                }
            }
            conseguirDex()
        }

    }, [dex, estadoDex, errorDex]);

    if(estadoDex === "error") return (<p>{errorDex}</p>)

    useEffect(() => {
        if(cargando === true) {
            setMensaje(`Cargando Pokémon...`);
        } else if(error) {
            setMensaje(`Error: ${error}`);
        } else setMensaje(`Resultados: `);
    }, [cargando, error, mensaje]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setCargando(true);
            setError(null);

            const listaPkmn = dex.filter(pkmn => pkmn.name.slice(0, inputValue.length) == inputValue)
            const fetchedPokemon = [];

            for (let i = 0; i < listaPkmn.length; i++) {
                const pkmn = listaPkmn[i];
                const response = await fetch(pkmn.url);
                if(!response.ok) {
                    throw new Error(`Error fetching Pokemon with name: ${pkmn.name}`);
                }
                const data = await response.json()
                fetchedPokemon.push({
                    id: data.id,
                    name: data.name,
                    image: data.sprites.front_default,
                    types: data.types.map(infoTipo => infoTipo.type.name.charAt(0).toUpperCase() + infoTipo.type.name.slice(1)).join(', ')
                })
            }
            setPokemon(fetchedPokemon);
        } catch(err) {
            setError(err.message);
            setPokemon([]);
        } finally {
            setCargando(false);
        }
    }

    return (
        <div className="pokemon-container">
            <h2>Busca Pokémon: </h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Pokémon" name="query" value={inputValue} onChange={(e) => registraCambioValor(e)} required minLength={2} maxLength={50} onInvalid={(e) => e.target.setCustomValidity("Ingrese de 2-50 carácteres.")}/>
                <button>Buscar</button>
                <p>{mensaje}</p>
            </form>
            <div className="pokemon-list">
                {pokemon.map(pokemon => (
                    <div key={pokemon.id} className="pokemon-card">
                        <h3>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
                        <img src={pokemon.image} alt={pokemon.name}/>
                        <p>Types: {pokemon.types}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PokemonFetcher;
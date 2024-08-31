movies.map(movies => (
                <li key={movies.imdbID}>
                  <h3>{movies.Title}</h3>
                  <p>{movies.Year}</p>
                  <img src={movies.Poster} />
                </li>
              ))
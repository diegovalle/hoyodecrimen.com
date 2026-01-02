# Hoyodecrimen.com

A web application for visualizing and analyzing crime data in Mexico City.

## Requirements

- Node.js v20.14.0

## Setup

1. Clone the repository:

   ```
   git clone https://github.com/diegovalle/hoyodecrimen.com.git
   cd hoyodecrimen.com
   ```

2. Use the correct Node.js version:

   ```
   nvm use v20.14.0
   ```

3. Install dependencies (assuming you're using npm):
   ```
   npm install
   ```
4. Build website
   ```
   npm run develop
   ```

## Todo

- Implement save functionality for map type (satellite or street) and dates in the `/mapa/` route

## License

This project is licensed under the [GNU AFFERO GENERAL PUBLIC LICENSE](LICENSE).

## Contact

Diego Valle-Jones - [@diegovalle](https://twitter.com/diegovalle)

Project Link: [https://github.com/diegovalle/hoyodecrimen.com](https://github.com/diegovalle/hoyodecrimen.com)

## Note to self

When a new ENVIPE comes out:

- Updated ENIVPE variables go in the /subregistro/ page (delitosDenunciadosLast and other variables))
- Update the FAQ JSON+LD in the /subregistro/ page

When new INEGI data comes out:

- Download from the [INEGI](https://www.inegi.org.mx/sistemas/olap/proyectos/bd/continuas/mortalidad/defuncioneshom.asp?s=est)
- Select 'Entidad y municipio de registro' and 'Mes de registro'
- Update 'crimen' page

When the homicide rate for the entire year is available:

- Update the JSON+LD in the index file

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
- Add month-over-month difference calculation (current month − same month previous year) to trends page

## License

This project is licensed under the [GNU AFFERO GENERAL PUBLIC LICENSE](LICENSE).

## Contact

Diego Valle-Jones - [@diegovalle](https://twitter.com/diegovalle)

Project Link: [https://github.com/diegovalle/hoyodecrimen.com](https://github.com/diegovalle/hoyodecrimen.com)

## Note to self

When a new ENVIPE comes out

- Updated ENIVPE variables in the /subregistro/ page (delitosDenunciadosLast))
- Update the FAQ JSON+LD in the /subregistro/ page

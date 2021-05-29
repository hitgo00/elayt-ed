const AppSearchClient = require('@elastic/app-search-node');

require('dotenv').config();

const apiKey = process.env.ELASTIC_API_KEY || '';
const baseUrlFn = process.env.ELASTIC_BASE_URL || '';

const client = new AppSearchClient(undefined, apiKey, baseUrlFn);

const engineName = 'articuno-engine';
// const engineName = 'elayted-engine';

// ********* Index new documents to ES *************
// const documents = [
//   {
//     wspace_id: 'somerandomwspace1',
//     notion_url:
//       'https://www.notion.so/Implementation-5c964bd4df5448a8995786bca4054d19',
//     yt_id: 'LnJwH_PZXnM',
//     text: 'Transcriber: María Constanza Cuevas\nReviewer: Tanya Cushman',
//     start: 0.0,
//     duration: 7.0,
//   },
//   {
//     wspace_id: 'somerandomwspace1',
//     notion_url:
//       'https://www.notion.so/Implementation-5c964bd4df5448a8995786bca4054d19',
//     yt_id: 'LnJwH_PZXnM',
//     text: '(Referee whistle sound)',
//     start: 10.072,
//     duration: 1.941,
//   },
// ];

// client
//   .indexDocuments(engineName, documents)
//   .then((response) => console.log(response))
//   .catch((error) => console.log(error));

// ******* Query in Articuno engine schema ***********
// const query = 'stack';
// const searchFields = { text: {} };
// const resultFields = { text: { raw: {} } };
// const options = {
//   search_fields: searchFields,
//   result_fields: resultFields,
//   filters: { start: ['4252.4', '1780.159'] },
// };

// ********* Query in Elayted Engine schema *************
// const query = 'w';
// const searchFields = { text: {} };
// const resultFields = { text: { raw: {} } };
// const options = {
//   search_fields: searchFields,
//   // result_fields: resultFields,
//   filters: { wspace_id: ['somerandomwspace1'] },
// };

// client
//   .search(engineName, query, options)
//   // .then((response) => console.table(response.results))
//   .then((response) => console.log(response.results))
//   .catch((error) => console.log(error.errorMessages));

const router = require('express').Router();
const axios = require('axios');
const AppSearchClient = require('@elastic/app-search-node');
require('dotenv').config();

const flask_url = process.env.FLASK_SERVER || '';
const apiKey = process.env.ELASTIC_API_KEY || '';
const baseUrlFn = () => process.env.ELASTIC_BASE_URL || '';
const client = new AppSearchClient(undefined, apiKey, baseUrlFn);

const engineName = 'articuno-engine';
// const engineName = 'elayted-engine';

// @get /
router.get('/', (req, res) => {
  console.log(req.query.myq);
  res.status(200).json({
    message: 'Elayted Server | 200 OK | @meet59patel @hitgo00',
  });
});

// @get /q/?q=whistle&notion=https://www.notion.so/Implementation-5c964bd4df5448a8995786bca4054d19
router.get('/q/', (req, res) => {
  const query = req.query.q;
  const notion_url = req.query.notion;
  if (!query || !notion_url) {
    return res
      .status(403)
      .json({ message: `Query parameters 'q' and/or 'notion' missing ` });
  }

  const searchFields = { text: {} };
  const options = {
    search_fields: searchFields,
    filters: { notion_url: notion_url },
  };

  client
    .search(engineName, query, options)
    .then((response) => {
      // console.log(response.results);
      res.status(200).json({ message: response.results });
    })
    .catch((error) => console.log(error.errorMessages));
});

// Index data to ES
router.post('/index/', async (req, res) => {
  const yt_ids = req.body.yt_ids;
  const notion_url = req.body.notion;

  // const captions =
  await axios
    .post(`${flask_url}getcaptions`, {
      yt_ids: yt_ids,
      notion: notion_url,
    })
    .then((resp) => {
      // console.log('From then block1: ', resp.data['response']);
      // if (
      //   resp.data['response'] == 'TranscriptsDisabled' ||
      //   resp.data['response'] == 'TooManyRequests' ||
      //   resp.data['response'] == 'CouldNotRetrieveTranscript'
      // ) {
      //   return res.status(400).json({ err: resp.data['response'] });
      // }

      client
        .indexDocuments(engineName, resp.data['response'])
        .then((response) => {
          console.log(response);
          return res
            .status(201)
            .json({ message: 'Index Created Successfully' });
        })
        .catch((error) => {
          console.log(error);
          return res.status(400).json({ err: e });
        });
    })
    .catch((e) => {
      console.log('Error while requesting captions');
      return res.status(400).json({ err: e });
    });

  // try {
  //   res.status(201).json({
  //     message: 'Index created successfully',
  //   });
  // } catch (err) {
  //   res.status(400).json({
  //     message: 'Error! Index not created',
  //     err: err.message,
  //   });
  // }
});

module.exports = router;

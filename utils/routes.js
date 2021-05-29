const router = require('express').Router();
const axios = require('axios');
const _ = require('lodash');
const AppSearchClient = require('@elastic/app-search-node');
require('dotenv').config();

const DOCS_IN_SINGLE_ELASTIC_REQ = 50;

const flask_url = process.env.FLASK_SERVER || '';
const apiKey = process.env.ELASTIC_API_KEY || '';
const baseUrlFn = () => process.env.ELASTIC_BASE_URL || '';
const client = new AppSearchClient(undefined, apiKey, baseUrlFn);

const engineName = 'articuno-engine';
// const engineName = 'elayted-engine';
const sentimentEngineName = 'elayted-sentiment';

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
router.post('/index', async (req, res) => {
  const yt_ids = req.body.yt_ids;
  const notion_url = req.body.notion;

  await axios
    .post(`${flask_url}getcaptions`, {
      yt_ids: yt_ids,
      notion: notion_url,
    })
    .then((resp) => {
      const responseDocs = resp.data['response'];
      const sentimentDocs = resp.data['sentiment_list'];
      _.chunk(responseDocs, DOCS_IN_SINGLE_ELASTIC_REQ).forEach((chunk) => {
        client
          .indexDocuments(engineName, chunk)
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });
      });

      client
        .indexDocuments(sentimentEngineName, sentimentDocs)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
      res.status(200).json({ response: 'Success' });
    })
    .catch((e) => {
      console.log('Error while requesting captions ', e);
      return res.status(400).json({ err: e });
    });
});

// get Sentiment Stats
// /sentiment?notion=https://www.notion.so/Test-page-83ef24ed2dde459c83197688579d53b6
router.get('/sentiment', (req, res) => {
  const notion_url = req.query.notion;
  if (!notion_url) {
    return res
      .status(403)
      .json({ message: `Query parameter 'notion' missing ` });
  }

  // const searchFields = { text: {} };
  const resultFields = {
    yt_id: { raw: {} },
    notion_url: { raw: {} },
    positive: { raw: {} },
    negative: { raw: {} },
    neutral: { raw: {} },
  };
  const options = {
    result_fields: resultFields,
    filters: { notion_url: notion_url },
  };

  client
    .search(sentimentEngineName, '', options)
    .then((response) => {
      // console.log(response.results);
      let avgPositive = 0,
        avgNegative = 0,
        avgNeutral = 0;
      response.results.forEach((doc) => {
        avgPositive += parseFloat(doc['positive']['raw']);
        avgNegative += parseFloat(doc['negative']['raw']);
        avgNeutral += parseFloat(doc['neutral']['raw']);
      });
      console.log(avgPositive, avgNegative, avgNeutral);
      avgPositive /= response.results.length;
      avgNegative /= response.results.length;
      avgNeutral /= response.results.length;
      const stats = {
        avgPositive: avgPositive,
        avgNegative: avgNegative,
        avgNeutral: avgNeutral,
      };

      res.status(200).json({ response: response.results, stats: stats });
    })
    .catch((error) => {
      console.log(error.errorMessages);
      res.status(500).json({ err: error });
    });
});

module.exports = router;

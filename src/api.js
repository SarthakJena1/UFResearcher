const crypto = require('crypto');
const fetch = require('node-fetch');

const apiKey = '078fc03a4fca4bbfb9b852bdf080234d'
const apiSecret = 'e247f3052a21459bb31a329ebb2ceeff'

const filters = 'q|pandemic|scope|all|timeframe|3m|type|article|dataset';

// HMAC-SHA256
function generateDigest(secret, data) {
    return crypto.createHmac('sha1', secret).update(data).digest('hex');
}

// request URL
function createRequestURL() {
    const digest = generateDigest(apiSecret, filters);
    const baseURL = 'https://www.altmetric.com/explorer/api/research_outputs?'
    const queryParams = new URLSearchParams({
        digest: digest,
        key: apiKey,
        'filter[q]': 'pandemic',
        'filter[timeframe]': 'all',
        'filter[type][]': 'article',
        'filter[type][]': 'dataset',
        'filter[scope]': 'institution',
        'filter[order]': 'publication_date',
        'page[number]': 1,
        'page[size]': 10
    });
    return baseURL + queryParams.toString();
}

// fetch data
async function fetchData() {
    try {
        const url = createRequestURL();
        console.log('Request URL:', url);

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        console.log('API Resposnse:', JSON.stringify(data, null, 2));

        // parse data
        data.data.forEach((item, index) => {
            console.log(`${index + 1}. ${item.attributes.title}`);
        });
    } 
    catch (error) {
        console.error('Error:', error);
    }
}

fetchData();
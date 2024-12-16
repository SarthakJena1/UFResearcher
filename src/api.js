import crypto from 'crypto';
import fetch from 'node-fetch';
import fs from 'fs';
import readline from 'readline';

const apiKey = '078fc03a4fca4bbfb9b852bdf080234d'
const apiSecret = 'e247f3052a21459bb31a329ebb2ceeff'


// HMAC-SHA256
function generateDigest(secret, data) {
    return crypto.createHmac('sha1', secret).update(data).digest('hex');
}

// read user input
async function readUserInput() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    const question = (query) => new Promise(resolve => rl.question(query, resolve));

    const q = await question('Enter search term (e.g., education): ');
    const timeframe = await question('Enter timeframe (e.g., 3m): ');
    const type = await question('Enter type (e.g., article): ');
    const pages = await question('Enter results per page (e.g., 10): ');

    rl.close();
    return { q, timeframe, type, pages };
}

// request URL
function createRequestURL({ q, timeframe, type, pages }) {
    const scope = 'institution';
    const filters = `q|${q}|scope|${scope}|timeframe|${timeframe}|type|${type}`;
    const digest = generateDigest(apiSecret, filters);
    const baseURL = 'https://www.altmetric.com/explorer/api/research_outputs?'

    const queryParams = new URLSearchParams({
        digest: digest,
        key: apiKey,
        'filter[q]': q,
        'filter[timeframe]': timeframe,
        'filter[type][]': type,
        'filter[scope]': 'institution',
        'filter[order]': 'publication_date',
        'page[number]': 1,
        'page[size]': pages
    });
    return baseURL + queryParams.toString();
}

// get authors
function getAuthors(data) {
    const authors = {};
    data.forEach((item) => {
        if (item.type === 'author') {
            authors[item.id] = item.attributes.name;
        }
    })
    return authors;
}
// get departments
function getDepartments(data) {
    const departments = {};
    data.forEach((item) => {
        if (item.type === 'department') {
            departments[item.id] = item.attributes.name;
        }
    })
    return departments;
}


// fetch data
async function fetchData() {
    try {
        const userInput = await readUserInput();
        const url = createRequestURL(userInput);
        console.log('Request URL:', url);

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();

        const authorMap = getAuthors(data.included);
        const departmentMap = getDepartments(data.included);

        console.log('API Response: ', JSON.stringify(data, null, 2));
        fs.writeFileSync('apicall.txt', JSON.stringify(data, null, 2), 'utf8');

        // get tiles, authors, and departments
        const results = data.data.map((item, index) => { 
            const title = item.attributes.title || 'N/A';
            const authors = item.relationships?.['institutional-authors'] || [];
            const department = item.relationships?.['institutional-departments'] || [];
            const authorNames = authors.map((author => authorMap[author.id] || 'Unknown')).join(', ');
            const departmentNames = department.map((dept => departmentMap[dept.id] || 'Unknown')).join(', ');
            return `${index + 1}. ${title} \n Authors: ${authorNames} \n Departments: ${departmentNames}`;
        });
        const output = results.join('\n\n');
        console.log('Results:\n', output);
        fs.writeFileSync('output.txt', output, 'utf8');

    } 
    catch (error) {
        console.error('Error:', error);
    }
}

fetchData();
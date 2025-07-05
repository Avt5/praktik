// Файлы для работы программы должны называться
// IP.txt
// Hash.txt
// URL.txt
// Email.txt
// Bitcoin.txt
// Domain.txt


// Зависимости
const express = require('express');
const { faker } = require('@faker-js/faker');
const fs = require('fs');
const path = require('path');
const syslog = require("syslog-client");
let counter = 0; // Счётчик логов

// Переменные - Лучше НЕ ТРОГАТЬ
const app = express();
const port = 3000;
const serverIp = '172.16.115.9';
let iterationCount = 1;
let ip_temp = '0.0.0.0';
const options = {
  transport: syslog.Transport.Udp,
  port: 514,
};
const client = syslog.createClient(serverIp, options);
const logFilePath = path.join(__dirname, 'logs.json');

// Переменные - МОЖНО ТРОГАТЬ
const file = "/home/fkr/"; // Путь к файлам с IOC

// Генерация случайного времени
function randomTime() {
  const dateObj = faker.date.between({
    from: '2025-01-28T12:30:00.000Z',
    to: '2025-03-28T12:59:59.999Z'
  });
  return dateObj.toISOString().slice(11, 23);
}

function logLine(message) {
  const id = faker.string.alphanumeric({ length: 8 });
  return `[${id}] ${message}`;
}

function getRandomOneOrTwelve() {
  return Math.floor(Math.random() * 12) + 1;
}

// Функции чтения файлов
function getIpFromFile() {
  try {
    const data = fs.readFileSync(file + 'IP.txt', 'utf8');
    return data.split(',')
      .map(ip => ip.trim().replace(/^'|'$/g, ''))
      .filter(ip => ip.length > 0);
  } catch (err) {
    console.error('Ошибка при чтении файла IP.txt:', err);
    return [];
  }
}

function getUrlFromFile() {
  try {
    const data = fs.readFileSync(file + 'URL.txt', 'utf8');
    return data.split(',')
      .map(url => url.trim().replace(/^'|'$/g, ''))
      .filter(url => url.length > 0);
  } catch (err) {
    console.error('Ошибка при чтении файла URL.txt:', err);
    return [];
  }
}

function getHashFromFile() {
  try {
    const data = fs.readFileSync(file + 'Hash.txt', 'utf8');
    return data.split(',')
      .map(item => item.trim().replace(/^'|'$/g, ''))
      .filter(item => item.length > 0);
  } catch (err) {
    console.error('Ошибка при чтении файла Hash.txt:', err);
    return [];
  }
}

function getEmailFromFile() {
  try {
    const data = fs.readFileSync(file + 'Email.txt', 'utf8');
    return data.split(',')
      .map(email => email.trim().replace(/^'|'$/g, ''))
      .filter(email => email.length > 0);
  } catch (err) {
    console.error('Ошибка при чтении файла Email.txt:', err);
    return [];
  }
}

function getBitcoinFromFile() {
  try {
    const data = fs.readFileSync(file + 'Bitcoin.txt', 'utf8');
    return data.split(',')
      .map(wallet => wallet.trim().replace(/^'|'$/g, ''))
      .filter(wallet => wallet.length > 0);
  } catch (err) {
    console.error('Ошибка при чтении файла Bitcoin.txt:', err);
    return [];
  }
}

function getDomainFromFile() {
  try {
    const data = fs.readFileSync(file + 'Domain.txt', 'utf8');
    return data.split(',')
      .map(domain => domain.trim().replace(/^'|'$/g, ''))
      .filter(domain => domain.length > 0);
  } catch (err) {
    console.error('Ошибка при чтении файла Domain.txt:', err);
    return [];
  }
}

// Генераторы логов
function generateLogLinesFORIP() {
  const date = 'Mar 28';
  const iface1 = `GigabitEthernet0/${faker.number.int({ min: 1, max: 3 })}`;
  const iface2 = `GigabitEthernet0/${faker.number.int({ min: 4, max: 6 })}`;
  let ip = '0.0.0.0';

  if (getRandomOneOrTwelve() % 11 === 0) {
    const ipArray = getIpFromFile();
    ip = ipArray.length > 0 ? ipArray[Math.floor(Math.random() * ipArray.length)] : faker.internet.ipv4();
  } else {
    ip = faker.internet.ipv4();
  }

  let user = faker.internet.username();
  const switchName = faker.word.words({ count: 1, strategy: 'closest' });

  return [
    logLine(`${date} ${randomTime()}: %LINK-3-UPDOWN: Interface ${iface1}, changed state to up`),
    logLine(`${date} ${randomTime()}: %LINEPROTO-5-UPDOWN: Line protocol on Interface ${iface1}, changed state to up`),
    logLine(`${date} ${randomTime()}: %SYS-5-CONFIG_I: Configured from console by ${user} on vty0 (${ip})`),
    logLine(`${date} ${randomTime()}: %SEC_LOGIN-5-LOGIN_SUCCESS: Login Success [user: ${user}] [Source: ${ip}] [localport: 22] at ${faker.date.soon().toUTCString()}`),
    logLine(`${date} ${randomTime()}: %LINK-3-UPDOWN: Interface ${iface2}, changed state to down`),
    logLine(`${date} ${randomTime()}: %LINEPROTO-5-UPDOWN: Line protocol on Interface ${iface2}, changed state to down`),
    logLine(`${date} ${randomTime()}: %CDP-4-DUPLEX_MISMATCH: duplex mismatch discovered on ${iface1} (not full duplex), with ${switchName} GigabitEthernet1/1 (full duplex)`)
  ].join('\n');
}

function generateLogLinesForURL() {
  const date = 'Mar 28';
  const time = randomTime();
  const method = faker.helpers.arrayElement(['GET', 'POST']);

  let url = 'http://104.168.7.38/688/pleasemakebestthingsentiretimetogivebestof.txt';
  if (getRandomOneOrTwelve() % 11 === 0) {
    const urlArray = getUrlFromFile();
    url = urlArray.length > 0 ? urlArray[Math.floor(Math.random() * urlArray.length)] : faker.internet.url();
  } else {
    url = faker.internet.url();
  }

  const categories = ["Business", "News", "Social Networking", "Phishing", "Streaming Media"];
  const category = faker.helpers.arrayElement(categories);
  const action = (category === "Phishing") ? "BLOCKED" : "ALLOWED";
  
  return logLine(`${date} ${time}: %URLFILTER-6-ACCESS: Method: ${method}, URL: ${url}, Category: ${category}, Action: ${action}`);
}

function generateLogLineForHash() {
  const date = 'Mar 28';
  const time = randomTime();
  let hash;

  if (getRandomOneOrTwelve() % 11 === 0) {
    const fileHashes = getHashFromFile();
    hash = fileHashes.length > 0 ? fileHashes[Math.floor(Math.random() * fileHashes.length)] : faker.string.alphanumeric(64);
  } else {
    hash = faker.string.alphanumeric(64);
  }

  return logLine(`${date} ${time}: %FILESCAN-6-HASH_DETECTED: Hash: ${hash}`);
}

function generateLogLinesForEmail() {
  const date = 'Mar 28';
  const time = randomTime();
  let email;

  if (getRandomOneOrTwelve() % 11 === 0) {
    const emails = getEmailFromFile();
    email = emails.length > 0 ? emails[Math.floor(Math.random() * emails.length)] : faker.internet.email();
  } else {
    email = faker.internet.email();
  }

  return logLine(`${date} ${time}: %EMAIL-5-SPAM: Suspicious email detected from ${email}`);
}

function generateLogLinesForBitcoin() {
  const date = 'Mar 28';
  const time = randomTime();
  let bitcoinWallet;

  // Генерация случайного Bitcoin-кошелька
  function generateBitcoinAddress() {
    const prefix = ['1', '3', 'bc1'];
    const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let address = faker.helpers.arrayElement(prefix);
    
    // Генерация остальной части адреса
    const length = faker.number.int({ min: 25, max: 39 - address.length });
    for (let i = 0; i < length; i++) {
      address += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return address;
  }

  if (getRandomOneOrTwelve() % 11 === 0) {
    const wallets = getBitcoinFromFile();
    bitcoinWallet = wallets.length > 0 ? wallets[Math.floor(Math.random() * wallets.length)] : generateBitcoinAddress();
  } else {
    bitcoinWallet = generateBitcoinAddress();
  }

  return logLine(`${date} ${time}: %CRYPTO-4-ALERT: Suspicious transaction to Bitcoin wallet ${bitcoinWallet}`);
}

function generateLogLinesForDomain() {
  const date = 'Mar 28';
  const time = randomTime();
  let domain;

  if (getRandomOneOrTwelve() % 11 === 0) {
    const domains = getDomainFromFile();
    domain = domains.length > 0 ? domains[Math.floor(Math.random() * domains.length)] : faker.internet.domainName();
  } else {
    domain = faker.internet.domainName();
  }

  return logLine(`${date} ${time}: %DNS-6-BLOCK: Malicious domain ${domain} blocked`);
}

function generateEntry() {
  const templog = getRandomOneOrTwelve();
  switch(templog) {
    case 1:
      console.log("Лог c IP сгенерирован");
      return generateLogLinesFORIP() + "\n";
    case 2:
      console.log("Лог c URL сгенерирован");
      return generateLogLinesForURL() + "\n";
    case 3:
      console.log("Лог c Hash сгенерирован");
      return generateLogLineForHash() + "\n";
    case 4:
      console.log("Лог c Email сгенерирован");
      return generateLogLinesForEmail() + "\n";
    case 5:
      console.log("Лог c Bitcoin сгенерирован");
      return generateLogLinesForBitcoin() + "\n";
    case 6:
      console.log("Лог c Domain сгенерирован");
      return generateLogLinesForDomain() + "\n";
    default:
      console.log("Лог c IP (дефолт) сгенерирован");
      return generateLogLinesFORIP() + "\n";
  }
}

// Остальная часть кода остается без изменений
setInterval(() => {
  let data = '';
  for (let i = 0; i < 1; i++) {
    data += generateEntry();
    counter++;
  }

  fs.appendFileSync(logFilePath, data);
  client.log(data, {
    facility: syslog.Facility.Local0,
    severity: syslog.Severity.Informational,
    timestamp: new Date()
  }, (error) => {
    if (error) console.error("Ошибка отправки:", error);
    else console.log("Сообщение отправлено");
  });
}, 1000);

app.get('/download-logs', (req, res) => {
  res.download(logFilePath, 'logs.json', (err) => {
    if (err) res.status(500).send('Ошибка скачивания');
    else fs.writeFileSync(logFilePath, '');
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Сервер запущен на порту ${port}`);
});
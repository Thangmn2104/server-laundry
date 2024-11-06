const { Parser } = require('json2csv');

const downloadResource = (res, fileName, fields, data) => {
  try {
    const json2csv = new Parser({ fields });
    const csv = json2csv.parse(data);
    res.attachment(fileName);
    res.send(csv);
  } catch (error) {
    console.error('Error generating CSV:', error);
    if (!res.headersSent) {
      res.status(500).send('Error generating CSV file');
    }
  }
};

module.exports = {
  downloadResource
};

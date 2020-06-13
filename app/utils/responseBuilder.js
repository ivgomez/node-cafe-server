const createErrorResponse = (err) => {
  return {
    ok: false,
    err,
  };
};

const createOkResponse = (obj) => {
  return {
    ok: true,
    ...obj,
  };
};

const buildResponse = (data, res) => {
  if (data.ok) {
    return res.status(200).json(data);
  } else {
    return res.status(500).json(data);
  }
};

module.exports = { createErrorResponse, createOkResponse, buildResponse };

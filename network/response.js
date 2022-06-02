export function success(req, res, message, status) {
  res.status(status || 200).send({
    error: '',
    body: message,
  });
}

export function error(req, res, message, status, details) {
  console.error('[response error] ', details);

  res.status(status || 500).send({
    error: message,
    body: '',
  });
}

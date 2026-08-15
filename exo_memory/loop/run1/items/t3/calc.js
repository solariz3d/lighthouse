const LIMIT = 5;

function allow(count) {
  return count <= LIMIT;
}

module.exports = { allow, LIMIT };

var Util = require('./util');

/**
 * These are the checkpoints for the main blockchain.
 */
var checkpoints = module.exports = {};

var l = checkpoints.livenet = [];
var t = checkpoints.testnet = [];

function cp(list, height, hash) {
  list.push({ height: height, hash: Util.decodeHex(hash) });
}

// Livenet checkpoints
cp(l,      0, '7497ea1b465eb39f1c8f507bc877078fe016d6fcb6dfad3a64c98dcc6e1e8496');
cp(l,   5000, '0x95753d284404118788a799ac754a3fdb5d817f5bd73a78697dfe40985c085596');
cp(l,  10000, '12f90b8744f3b965e107ad9fd8b33ba6d95a91882fbc4b5f8588d70d494bed88');
cp(l,  12000, 'a1266acba91dc3d5737d9e8c6e21b7a91901f7f4c48082ce3d84dd394a13e415');
cp(l,  14300, '24f665d71b0c6c88f6f72a863e9f1ba8e835cc52d13ad895dc5426021c7d2c48');
cp(l,  30000, '17c69ef6b403571b1bd333c91fbe116e451ba8281be12aa6bafb0486764bb315');
cp(l,  60000, '57b2c612b60462a3d6c388c8b30a68cb6f7e2034eea962b12b7ef506454fa2c1');
cp(l, 110000, 'ab2da24656493015f2fd288994661e1cc657d90aa34c755514af044aaaf1569d');
cp(l, 141100, '145c2cb5239a4e019c730ce8468d927a3955529c2bae077850783da97ddbca05');
cp(l, 141656, '683d27720429f28bcfa22d8385b7a06f307c8fd918d49215148fbd41a0dda595');
cp(l, 245000, '852c475c605e1f20bbe60219c811abaeef08bf0d4ff87eef59200fd7a7567fa7');
cp(l, 302000, 'fb6d14ac5e0208f00d941db1fcbfe050f093cfd0c05ed151c809e4428bc14286');
cp(l, 331000, 'bd1a1d002750e1648746eb29c78d30fa1043c8b6f89d82924c4488be06fa3d19');
cp(l, 360000, '8fee7e3f6c38dccd3047a3e4667c63406f835c2890024030a2ab2dc6dba7c912');
cp(l, 400100, '82325a97cd97ac14b0a57408f881b1a9fc40174f8430a4580429499ac5d153c8');
cp(l, 521000, 'd23fd1e1f994c0586d761b71bb3530e9ab45bd0fabda3a5a2e394f3dc4d9bb04');

// Testnet checkpoints
cp(t,    546, '000000002a936ca763904c3c35fce2f3556c559c0214345d31b1bcebf76acb70');

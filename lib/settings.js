  

    var IrcBootstrapper = require('./bootstrap/irc.js').IrcBootstrapper;
    var DnsBootstrapper = require('./bootstrap/dns.js').DnsBootstrapper;
    var Util = require('./util');
    var hex = Util.decodeHex;
    var Binary = require('binary');
    var checkpoints = require('./checkpoints');
    var path = require('path');
     
    /**
     * Holds the node's configuration options.
     *
     * Please see `bitcoinjs help run` for help on command line options and
     * `daemon/settings.example.js` for help on configuration inside JavaScript.
     */
    var Settings = exports.Settings = function () {
      this.init();
      this.setGeneralDefaults();
      this.setStorageDefaults();
      this.setJsonRpcDefaults();
      this.setNetworkDefaults();
      this.setLivenetDefaults();
      this.setFeatureDefaults();
    };
     
    Settings.prototype.init = function () {
      this.storage = {};
      this.network = {};
      this.feature = {};
      this.jsonrpc = {};
    };
     
    Settings.prototype.setGeneralDefaults = function () {
      // Home directory
      this.homedir = Settings.getDefaultHome();
     
      // Data directory (relative to home directory)
      this.datadir = '.';
     
      // Master switch for disabling all verification & related indices
      this.verify = true;
     
      // Switch for disabling script/signature verification
      this.verifyScripts = true;
    };
     
    Settings.prototype.setStorageDefaults = function () {
      // Setting this to null means that BitcoinJS should pick a backend and save
      // the files under datadir. The actual default uri that is used is stored in
      // lib/storage.js.
      this.storage.uri = null;
    };
     
    Settings.prototype.setJsonRpcDefaults = function () {
      this.jsonrpc.enable = false;
      this.jsonrpc.username = "admin";
      this.jsonrpc.password = null;
     
      // Host/IP to bind to, use "0.0.0.0" to listen on all interfaces
      this.jsonrpc.host = "127.0.0.1";
      // Port to listen on
      this.jsonrpc.port = 12042;
    };
     
    Settings.prototype.setNetworkDefaults = function () {
      // Force the node to connect to a specific node or nodes
      this.network.connect = null;
     
      // List of peers to add to the list of known peers
      this.network.initialPeers = [];
     
      // List of peers to maintain a permanent connection (also overrides "connect")
      this.network.forcePeers = [];
     
      // Don't accept incoming peer-to-peer connections
      this.network.noListen = false;
     
      // Size of receive buffer
      this.network.maxReceiveBuffer = 10*1000;
    };
     
    /**
     * Set the settings for the official block chain.
     *
     * Note that these also constitute the defaults for testnet and unitnet
     * unless overridden in the respective functions. So if you change something
     * in the livenet defaults, make sure you update the other functions if
     * necessary.
     *
     * For more detailed documentation on some of these settings, please see
     * daemon/settings.example.js.
     */
    Settings.prototype.setLivenetDefaults = function () {
      this.network.type = 'livenet';
      this.network.port = 12024;
      this.network.magicBytes = hex('fac3b6da');
     
      // List of bootstrapping mechanisms
      this.network.bootstrap = [
        new DnsBootstrapper([
          "seed1.digibyte.co",
          "seed2.hashdragon.com",
          "dgb.cryptoservices.net",
        ]),
        new IrcBootstrapper('irc.lfnet.org', '#digibyte')
      ];
      this.network.genesisBlock = {
        'height': 0,
        'nonce': 2447652,
        'version': 1,
        'hash': hex('96841e6ecc8dc9643aaddfb6fcd616e0' +
                                    '8f0777c87b508f1c9fb35e461bea9774'),
        'prev_hash': new Buffer(32).clear(),
        'timestamp': 1231006505,
        'merkle_root': hex('ad0f7d7518fc1e90ed28bd0e444ccd8e' +
                                               '24d94688355705ed2142006b49d9dd72'),
        'bits': 486604799
      };
     
      this.network.genesisBlockTx = {
        'outs': [{
          'v': hex('401F000000000000'), // 50 BTC
          's': Binary.put()
            .word8(65) // 65 bytes of data follow
            .put(hex('00'))
            .word8(0xAC) // OP_CHECKSIG
            .buffer()
        }],
        'lock_time': 0,
        'version': 1,
        'hash': hex('ad0f7d7518fc1e90ed28bd0e444ccd8e' +
                                '24d94688355705ed2142006b49d9dd72'),
        'ins': [{
          'q': 0xFFFFFFFF,
          'o': hex("000000000000000000000000000000000000" +
                   "0000000000000000000000000000FFFFFFFF"),
          's': Binary.put()
            .put(hex('04FFFF001D010445'))
            .put(new Buffer('USA Today: 10/Jan/2014, Target: Data stolen from up to 110M customers', 'ascii'))
            .buffer()
        }]
      };
     
      this.network.proofOfWorkLimit = hex("00000000FFFFFFFFFFFFFFFFFFFFFFFF" +
                                          "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF");
     
      this.network.checkpoints = checkpoints.livenet;
    };
     
    Settings.prototype.setTestnetDefaults = function () {
      this.setLivenetDefaults();
     
      this.network.type = 'testnet';
      this.network.port = 12025;
      this.network.magicBytes = hex('fcc1b7dc');
      this.network.bootstrap = [
        new IrcBootstrapper('irc.lfnet.org', '#digibyteTEST3')
      ];
     
      var genesisBlock = this.network.genesisBlock;
     
      genesisBlock.nonce = 961533;
      genesisBlock.hash = hex("43497FD7F826957108F4A30FD9CEC3AE" +
                              "BA79972084E90EAD01EA330900000000");
      genesisBlock.timestamp = 1392796564;
     
      this.network.checkpoints = checkpoints.testnet;
    };
     
    /**
     * Set block chain and network settings for unittest.
     *
     * We're using a special configuration for our unit tests, called "unitnet".
     *
     * It's chosen to be incompatible with both Livenet and Testnet, in case our
     * unit tests accidentally connect to a real node.
     */
    Settings.prototype.setUnitnetDefaults = function () {
      this.setLivenetDefaults();
     
      this.network.type = 'unitnet';
      this.network.magicBytes = hex('f3bbb2df');
      this.network.bootstrap = [];
     
      this.network.genesisBlock.hash = hex("14DAE1DB98CA7EFA42CC9EBE7EBB19BD" +
                                           "88D80D6CBD3C4A993C20B47401D238C6");
      this.network.genesisBlock.bits = 0x207fffff;
     
      this.network.proofOfWorkLimit = hex("00FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF" +
                                          "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF");
    };
     
    Settings.prototype.setFeatureDefaults = function () {
      // Live accounting means the memory pool will create events containing
      // the individual pubKeyHash of a Bitcoin address. This allows wallets
      // to update themselves live by registering their pubKeys as event
      // listeners.
      this.feature.liveAccounting = true;
    };
     
    /**
     * Returns the OS-specific default home folder location.
     */
    Settings.getDefaultHome = function () {
      // TODO: Support non POSIX OSes
      return process.env.HOME + "/.bitcoinjs";
    };
     
    /**
     * Plain accessor for home directory.
     *
     * Please use this function instead of accessing the homedir variable directly.
     */
    Settings.prototype.getHomeDir = function () {
      return this.homedir;
    };
     
    /**
     * Calculate data directory.
     *
     * The data directory is relative to the home directory, so we need a
     * function to calculate the correct absolute path on the fly.
     */
    Settings.prototype.getDataDir = function () {
      return path.resolve(this.homedir, this.datadir);
    };
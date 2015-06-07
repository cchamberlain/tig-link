# tig-link

The node.js API for [tig](http://tig.sh) synchronization.  This is the source code for the [tig.link](http://tig.link) public API server.

tig is being developed to support all platforms and be 100% portable.  In keeping with that mantra, tig-link server may be installed on any private server and registered with tig to track you or your organizations cloud dev settings.

## setup

* Make up a JWT secret (string) that will be used to sign JWT tokens issued by your personal installation of tig-link API.

* Visit [github developer applications](https://github.com/settings/developers) and register a new application.  Any name will work but I would use "<username|organization>'s private tig".  Make note of the client ID and secret as you will be prompted for them.

* Create a mongodb server accessible from where you are installing tig-link server and create a blank tig database.  Get the connection string ready in format "mongodb://<dbuser>:<dbpassword>@<dburl>:<dbport>/tig".

* The command below will install the latest tig command line interface, and then will configure (-C) and install (-I) tig-link API components on your machine.  The (-s) starts up the server.

```sh
npm install -g tig && tig link -CIs
```


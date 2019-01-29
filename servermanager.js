const Discovery = require("node-gtacoop-discovery")
const request   = require("request")

let servers = []

function reloadServers(){
	servers.length = 0
	
	request({ url: "https://master.gtacoop.com/", json: true }, handleMasterResponse)
}

function handleMasterResponse(error, response, body){
	if(error) return;
	
	for(var address in body.list){
		const [ ip, port ] = body.list[address].split(":");
			
		new Discovery(ip, port).send()
		.then(response => {
			response.address = `${ip}:${port}`;
			
			// push to serverlist
			servers.push(response)
		})
		// we want to catch errors but dont really do anything with them
		.catch(x => {})
	}
}

module.exports.start = function(){
	reloadServers()
	
	setInterval(reloadServers, 60 * 1000)
}

module.exports.servers = servers
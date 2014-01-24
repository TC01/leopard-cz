// Leopard v1.2 - Chatzilla Plugin by TC01
// Refer to http://www.xkcd.com/1031 xkcd: s/keyboard/leopard/

// This plugin started out as a complete joke, but while testing it, I realized
// it may in fact have legitimate use. Annoyed by common typos and want them
// automatically autocorrected? You can do that with this!

// To use, run "/leopard add [word] [replacement]"

// If you wish to remove the s/keyboard/leopard rule or another rule you add,
// run "/leopard remove [word] [replacement]".

// "/leopard list" will list all rules.

// This sort of stuff will eventually be documented in a project page on the
// main website but until it's polished enough I'll leave it here.

// Plugin configuration stuff
plugin.id = "leopard";
plugin.major = 1;
plugin.minor = 2;
plugin.version = plugin.major + "." + plugin.minor;

// Keyboard/Leopard databases- only last as long as Chatzilla/Firefox is running
var keyboards = new Array();
var leopards = new Array();

// Initialize plugin
plugin.init = function initPlugin(glob) {	
	keyboards.push("keyboard");
	leopards.push("leopard"); 
	
	return true; 
}

// Enable the plugin (add an event hook and some commands)
plugin.enable = function enablePlugin(status) { 
	client.eventPump.addHook([{set:"channel", type:"privmsg"}], onMessage, plugin.id + "-onMessage");

	plugin.addwords = [["leopard", plugin.onCmd, CMD_CONSOLE, "[<lcommand>] [<keyboard>] [<leopard>]"]];
	client.commandManager.defineCommands(plugin.addwords);
	client.commandManager.commands.leopard.help = "Add and remove s/keyboard/leopard/ rules.";

//	plugin.sayToCurrentTarget_orig = client.sayToCurrentTarget;
//	client.sayToCurrentTarget = plugin.sayToCurrentTarget;
	display("s/keyboard/leopard plugin " + plugin.version + " enabled.");

	return true;
}

// Disable the plugin (remove said event hook and commands)
plugin.disable = function disablePlugin(status) { 
	client.eventPump.removeHookByName(plugin.id + "-onMessage");
	client.commandManager.removeCommands(plugin.addwords);

//	plugin.sayToCurrentTarget_orig = client.sayToCurrentTarget;
//	client.sayToCurrentTarget = plugin.sayToCurrentTarget;
	display("s/keyboard/leopard plugin " + plugin.version + " disabled.");

	return true;
}

// Command to add/remove s/keyboard/leopard rules
plugin.onCmd = function leopard_onCmd(e) {

	// Add command, add a rule assuming valid arguments were passed
	if (e.lcommand == "add") {
		if (e.keyboard && e.leopard) {
			keyboards.push("" + e.keyboard);
			leopards.push("" + e.leopard);
			display("Added new rule, s/" + e.keyboard + "/" + e.leopard + "/");
		}
	// Remove command, try to remove a given rule
	} else if (e.lcommand == "remove") {
		if (keyboards.indexOf(e.keyboard) != -1 && leopards.indexOf(e.leopard) != -1) {
			keyboards.splice(keyboards.indexOf(e.keyboard), 1);
			leopards.splice(leopards.indexOf(e.leopard), 1);
			display("Removed rule s/" + e.keyboard + "/" + e.leopard + "/");
		}
	// List command- list all rules
	} else if (e.lcommand == "list") {
		for (var i = 0; i < keyboards.length; i++) {
			display("Rule: s/" + keyboards[i] + "/" + leopards[i] + "/")
		}
	// If any other sequence of inputs is put in, display help text
	} else {
		display("Valid s/keyboard/leopard/ commands are:");
		display(" add <word1> <word2>: add a new rule, s/word1/word2/");
		display(" remove <word1> <word2>: try to remove a rule, s/word1/word2/");
		display(" list: list all current rules");
	}

}

//Event hook that runs when a private message is received
function onMessage(e) {
	var message = e.decodeParam(2);
	message = leopardify(message);
	e.params[2] = message;
}

//Simple function to replace all occurances of "keyboard" in a string with "leopard"
function leopardify(message) {

	var length;
	var index;
	var start;
	var end;

	for (var i = 0; i < keyboards.length; i++)
	{
		var keyboard = keyboards[i];
		var leopard = leopards[i];
		var regex = new RegExp(keyboard, "i");
		
		// Yeah, could use regexp here, for "simplicity"- but I don't want to multiply my problems
		while (regex.test(message)) {
			length = message.length;
			index = (message.toLowerCase()).indexOf(keyboard);
			start = message.substring(0, index);
			end = message.substring(index + keyboard.length, length);
			message = start + leopard + end;
		}
	}
	
	return message;
}

var fs = require('fs');
var program = JSON.parse(fs.readFileSync('minified-test.json', 'utf8'));

var newfile = '';

// console.log(JSON.stringify(program));
program.variables.forEach((variable) => {
	if (variable.global == true && variable.isUsed == false) { // change to variable.isUsed == true
		if(variable.value != null){
			newfile += "var " + variable.name + " = " + variable.value + ";\n";
		}
		else{
			newfile += "var " + variable.name + ";\n";
		}
	}
});

program.functions.forEach((func) => {
	if (func.isUsed == false) {			// change to func.isUsed == true
		func.body.forEach((line) => {
			newfile += line + "\n";
		});
	}
});

program.statements.forEach((statement) => {
	newfile += statement + "\n";
});


fs.writeFile("newFile.js", newfile, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}); 
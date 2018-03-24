var fs = require('fs');

var filepath = "test.js";
var input = fs.createReadStream(filepath);
var readline = require('readline').createInterface({
	input: input,
	terminal: false
});

var inFunction = {
	inScope: false,
	name: '',
	funcBody: []
}

var variable = {
	name: "",
	value: undefined,
	global: true,
	parentFunc: undefined,
	isUsed: false
}

var func = {
	name: "",
	body: "",
	parameters: "",
	global: false,
	isUsed: false
}

// Object representation of entire file
var program = {
	variables: [],		// Array of variable objects
	functions: [],		// Array of func objects
	statments: []		// Array of lines (Strings)
}

//iterate line by line through file
readline
.on('line', (line) => {
	//parse line

	if (line.search("}") != -1 && inFunction.inScope == true){
		// program.functions[program.functions.indexOf(inFunction.name)].body = inFunction.funcBody;

		const newFunc = Object.create(func);
		newFunc.name = inFunction.name;
		newFunc.global = true;
		newFunc.body = inFunction.funcBody;
		newFunc.isUsed = false;
		program.functions.push(newFunc);

		inFunction.inScope = false;
		inFunction.name = "";
		inFunction.funcBody = [];
	}

	var varPos = line.search("var");
	if (varPos != -1){
		var varName;
		var varValue = undefined;
		// Check if variable is initialized by searching for "="
		if (line.search("=") != -1){
			//line format: "var " + varName + " = " + someValue + ";"
			varName = line.slice(varPos+3, line.search("="));
			var valueStartIndex = line.search("=") + 1;
			var valueEndIndex = line.search(";") - 1;

			while (line[valueStartIndex] == " "){
				valueStartIndex++;
			}

			while (line[valueEndIndex] == " "){
				valueEndIndex--;
			}

			varValue = line.slice(valueStartIndex, valueEndIndex + 1);
		}
		// no equal sign found on line means Variable declared without a inital value
		else{
			//line format: "var " + varName + ";"
			varName = line.slice(varPos + 3, line.search(";"));
		}
		// remove any extra spaces
		varName = varName.replace(/\s/g,'');

		var newVar = Object.create(variable);

		newVar.name = varName;
		newVar.value = varValue;
		newVar.isUsed = false;

		if (inFunction.inScope == true){
			newVar.global = false;
			newVar.parentFunc = inFunction.name;
		}
		else {
			newVar.global = true;
			newVar.parentFunc = undefined;
		}

		program.variables.push(newVar);

	}

	var funcPos = line.search("function");
	if (funcPos != -1) {
		var funcName;

		funcName = line.slice(funcPos + 8, line.indexOf("("));
		funcName = funcName.replace(/\s/g,'');

		// console.log(funcName);

		if (line.search("{") == -1){
			inFunction.inScope = true;
			inFunction.name = funcName;
		}
		else {
			for (var i = 0; i < line.length; i++){
				if (line[i] == "{"){
					inFunction.inScope = true;
					inFunction.name = funcName;
				}

				if(line[i] == "}" && inFunction.inScope == true){
					inFunction.inScope = false;
					inFunction.name = "";
				}
			}
		}
	}


	if (inFunction.inScope == true && varPos == -1 && funcPos == -1){
		inFunction.funcBody.push(line);
	}

	if (inFunction.inScope == false && funcPos == -1 && varPos == -1){
		//if neither a function or variable, and is outside of a function then this line is a global statment/expression
		program.statments.push(line);
	}
	// var funcPos = line.search("function");
})
.on('close', () => {
	console.log(JSON.stringify(program));
});





	
export class Definitions {
    id: string;
    name: string;
    namespace: string;
    drgElements: Array<ModdleElement>;
}

export class ModdleElement {
    id: string;
    name: string;
    decisionTable: DecisionTable;
}

export class DecisionTable {
    //To do: getters and setters. Constructor. Everything checking consistence with specification
    input: Array<InputClause> = [];     //InputClause[*]
    output: Array<OutputClause> = [];   //OutputClause[*]
    rule: Array<DecisionRule> = [];     //DecisionRule[*]

    hitPolicy: HitPolicy = HitPolicy.U; //HitPolicy
    aggregation: BuiltinAggregator;     //BuiltinAggregator
    preferredOrientation: PreferredOrientation = PreferredOrientation.ruleAsRow;    //DecisionTableOrientation[0..1]
    outputLabel: string;                //[0..1] description of the table output

    //Extra
    id: string;

    newInput(inputClause: InputClause) {
        this.input.push(inputClause);
    }

    newInputEntry(inputEntry: UnaryTests) {
        this.rule.forEach(rule => { rule.inputEntry.push(inputEntry) });
    }

    newOutput(outputClause: OutputClause) {
        this.output.push(outputClause)
    }

    newOutputEntry(outputEntry: LiteralExpression) {
        this.rule.forEach(rule => { rule.outputEntry.push(outputEntry) });
    }

    /**
     * It checks every element has its own id
     */
    checkId() {

        if (!this.id) {
            this.id = `DecisionTable${Math.round(Math.random() * 100000) / 100}`;
        }
       /* this.input.forEach(input => {
            input.checkId();
        });
        this.output.forEach(output => {
            output.checkId();
        });
        this.rule.forEach(rule => {
            rule.checkId();
        });*/

    }
}

export class InputClause {
    inputExpression: Expression;//Expression[0..1]
    inputEntry: Expression;//Expression[*]

    //Extra
    id: string;
    checkId() {
        if (!this.id) {
            this.id = `DecisionTable${Math.round(Math.random() * 100000) / 100}`;
        }
        this.inputExpression.checkId();
        this.inputEntry.checkId();
    }

}

export class OutputClause {
    typeRef: QName; //QName[0..1] is the name of the datatype
    name: string; //string[0..1]
    outputEntry: Expression; //Expression[*]
    defaultOutputEntry: Expression; //Expression[0..1]

    //Extra
    id: string;
    checkId() {
        if (!this.id) {
            this.id = `DecisionTable${Math.round(Math.random() * 100000) / 100}`;
        }
        this.outputEntry.checkId();
        this.defaultOutputEntry.checkId();

    }
}

export class DecisionRule {
    inputEntry: Array<UnaryTests> = [];//UnaryTest[0..*]
    outputEntry: Array<LiteralExpression> = [];//LiteralExpression[1..*]

    clone(rule: DecisionRule) {

        rule.inputEntry.forEach(inputEntry => {
            let newInputEntry = new UnaryTests();
            newInputEntry.clone(inputEntry);
            this.inputEntry.push(newInputEntry)
        });

        rule.outputEntry.forEach(outputEntry => {
            let newOutputEntry = new LiteralExpression();
            newOutputEntry.clone(outputEntry);
            this.outputEntry.push(newOutputEntry)
        });
    }

    //Extra
    id: string;
    checkId() {
        if (!this.id) {
            this.id = `DecisionTable${Math.round(Math.random() * 100000) / 100}`;
        }

        this.inputEntry.forEach(inputEntry => {
            inputEntry.checkId();
        });
        this.outputEntry.forEach(outputEntry => {
            outputEntry.checkId();
        });

    }
}

export class InputEntry {
    text: string = "-";
}

export class OutputEntry {
    text: string = "";
}

export class LiteralExpression {
    text: string;                   //[0..1]
    expressionLanguage: string;     //Expressed in URI format [0..1]
    importedValues: ImportedValues;         //[0..1]

    constructor() {
        this.text = '';
        this.expressionLanguage = '';
        this.importedValues = new ImportedValues();
    }

    clone(literalExpression: LiteralExpression) {
        this.text = literalExpression.text;
        this.expressionLanguage = literalExpression.expressionLanguage;
        this.importedValues.clone(literalExpression.importedValues);
    }

    //Extra
    id: string;
    checkId() {
        if (!this.id) {
            this.id = `DecisionTable${Math.round(Math.random() * 100000) / 100}`;
        }
    }
}

export class Expression {
    text: string;
    typeRef: QName; //[0..1]
    expressionLanguage: string;     //Expressed in URI format [0..1]

    //extra
    id: string;
    checkId() {
        if (!this.id) {
            this.id = `DecisionTable${Math.round(Math.random() * 100000) / 100}`;
        }
    }
}

export class ImportedValues {
    expressionLanguage: string; //URI [0..1]
    importedElement: string; //[0..1]

    constructor() {
        this.expressionLanguage = '';
        this.importedElement = '';
    }

    clone(importedValues: ImportedValues) {
        if (importedValues) {
            this.expressionLanguage = importedValues.expressionLanguage;
            this.importedElement = importedValues.importedElement;
        }
    }
}

/**
 * Allowed values
 *  */
export class UnaryTests {
    expressionLanguage: string; //URI [0..1]
    text: string;

    clone(unaryTests: UnaryTests) {
        this.expressionLanguage = unaryTests.expressionLanguage;
        this.text = unaryTests.text;
    }

    //Extra
    id: string;
    checkId() {
        if (!this.id) {
            this.id = `DecisionTable${Math.round(Math.random() * 100000) / 100}`;
        }
    }
}

//Enumerations

export enum PreferredOrientation {
    ruleAsRow = "Rule-as-Row",
    ruleAsColumn = "Rule-as-Column",
    crossTable = "CrossTable"
}

export enum HitPolicy {
    U = "UNIQUE",
    F = "FIRST",
    P = "PRIORITY",
    A = "ANY",
    C = "COLLECT",
    R = "RULE ORDER",
    O = "OUTPUT ORDER"
}

export enum ReverseHitPolicy {
    UNIQUE = "U",
    FIRST = "F",
    PRIORITY = "P",
    ANY = "A",
    COLLECT = "C",
    RULEORDER = "R",
    OUTPUTORDER = "O"
}

export enum BuiltinAggregator {
    SUM = "SUM",
    COUNT = "COUNT",
    MIN = "MIN",
    MAX = "MAX"
}

export enum QName {
    string = "string",
    boolean = "boolean",
    int = "integer",
    double = "double"
}

  /**This is a set of classes which are going to assist the process when managing dmn objects and tables */
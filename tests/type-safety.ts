import * as fs from 'fs';
import * as ts from 'typescript';
import { expect } from 'chai';

const tsConfig = require('../tsconfig.json');

const compilerOptions = ts.convertCompilerOptionsFromJson(tsConfig.compilerOptions, '.').options;

interface CompilationError {
  line: number;
  column: number;
  message: string;
  code: number;
}

enum CompilerErrorCode {
  INCOMPATIBLE_ARG = 2345,
  NO_COMMON_PROPERTIES = 2559,
  TOO_MANY_ARGS = 2554,
  TOO_FEW_ARGS = 2555,
}

/**
 * Expect that every line in the given file that has an expect call will
 * result in a type incompatibility compiler error. It also expects that no
 * other type of errors will be thrown.
 *
 * This assumes there won't be more than one call per line. Lines without calls
 * are allowed.
 *
 * @param fileName Relative to the project root, or more precisely to Mocha's cwd.
 */
export default function expectTypeErrors(fileName: string) {
  const errors = compile(fileName, compilerOptions);
  const lines = fs.readFileSync(fileName, { encoding: 'utf-8' }).split('\n');

  const errorsByLine = errors.reduce((
    acc: Map<number, boolean>,
    { line, column, message, code }
  ) => {
    expect([
      CompilerErrorCode.INCOMPATIBLE_ARG,
      CompilerErrorCode.NO_COMMON_PROPERTIES,
      CompilerErrorCode.TOO_MANY_ARGS,
      CompilerErrorCode.TOO_FEW_ARGS
    ], `Non type error detected on ${fileName}:${line}:${column} ${message}`).to.include(code);

    expect(acc.get(line), `More than 1 error detected on ${fileName}:${line} (${lines[line]})`)
      .to.be.undefined;

    acc.set(line, true);
    return acc;
  }, new Map());

  lines.forEach((line, i) => {
    if (/xpect\(.*\)\./.test(line)) {
      expect(errorsByLine.get(i + 1), `No error detected on ${fileName}:${i + 1} (${line})`)
        .to.not.be.undefined;
    }
  });
}

function compile(fileName: string, options: ts.CompilerOptions): CompilationError[] {
  const program = ts.createProgram([fileName], Object.assign({}, options, { noEmit: true }));

  const emitResult = program.emit();
  const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

  return allDiagnostics.map(diagnostic => {
    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');

    if (diagnostic.file) {
      const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!);

      return {
        line: line + 1,
        column: character + 1,
        code: diagnostic.code,
        message
      };
    }

    throw new Error(message);
  });
}

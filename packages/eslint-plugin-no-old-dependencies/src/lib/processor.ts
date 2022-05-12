const prefix = 'module.exports = ';
import { Linter } from 'eslint';
export function preProcessorJson(text: string) {
  return [`${prefix}${text}`];
}

export function postProcessJson(messages: Linter.LintMessage[][]) {
  return ([] as Linter.LintMessage[]).concat(...messages);
}

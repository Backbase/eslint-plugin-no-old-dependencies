import { Linter } from 'eslint';
import { postProcessJson, preProcessorJson } from './processor';

describe('processor', () => {
  it('should convert Stringified JSON to Javascript code', () => {
    const stringifiedJSON = '{ "foo": "bar" }';
    expect(preProcessorJson(stringifiedJSON)).toEqual(['module.exports = { "foo": "bar" }']);
  });

  it('should flatten LintMessage[][] to LintMessage[]', () => {
    const message: Linter.LintMessage = {
      message: 'message',
      ruleId: 'ruleId',
      line: 1,
      column: 1,
      severity: 2,
    };
    const messages = [[message]];
    expect(postProcessJson(messages)).toEqual([message]);
  });
});

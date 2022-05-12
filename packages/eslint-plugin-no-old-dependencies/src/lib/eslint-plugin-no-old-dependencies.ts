/**
 * @fileoverview test
 * @author validate-deps
 */
import requireIndex = require('requireindex');
import { postProcessJson, preProcessorJson } from './processor';

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------
// import all rules in lib/rules

export const rules = requireIndex(__dirname + '/rules');
export const configs = requireIndex(__dirname + '/configs');

// import processors
export const processors = {
  '.json': {
    preprocess: preProcessorJson,
    postprocess: postProcessJson,
    supportsAutofix: false,
  },
};

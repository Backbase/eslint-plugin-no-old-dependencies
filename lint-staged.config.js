const filesAlwaysFormattedByNx = ['workspace.json', 'nx.json', 'tsconfig.base.json'];

module.exports = {
  '*.{js,ts,html,json}': (files) => [
    `npx nx format:write --files=${files}`,
    `git add ${filesAlwaysFormattedByNx.join(' ')}`,
  ],
};

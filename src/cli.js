#!/usr/bin/env node

const meow = require('meow');
const fgh = require('./index');

const cli = meow(
    `
    Usage
      $ fake-git-history --gitlabToken <token> [options]
 
    Options
      --gitlabToken, -t GitLab personal access token (required)
      --workdaysOnly, -w Use this option if you don't want to commit on weekends.
      --startDate, -s Start date in yyyy/MM/dd format.
      --endDate, -e End date yyyy/MM/dd format.
      
    Examples
      $ fake-git-history --gitlabToken YOUR_TOKEN --workdaysOnly
      $ fake-git-history --gitlabToken YOUR_TOKEN --startDate 2023/01/01 --endDate 2023/12/31
`,
    {
        flags: {
            gitlabToken: {
                type: 'string',
                alias: 't',
                isRequired: true,
            },
            startDate: {
                type: 'string',
                alias: 's',
            },
            endDate: {
                type: 'string',
                alias: 'e',
            },
            workdaysOnly: {
                type: 'boolean',
                alias: 'w',
                default: false,
            },
        },
    },
);

if (!cli.flags.gitlabToken) {
    console.error(
        'Error: GitLab token is required. Use --gitlabToken or -t to provide it.',
    );
    process.exit(1);
}

(async () => {
    try {
        await fgh(cli.flags);
    } catch (error) {
        console.error('An error occurred:', error);
        process.exit(1);
    }
})();

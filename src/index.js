const process = require('process');
const { exec } = require('child_process');
const util = require('util');
const { existsSync } = require('fs');
const execAsync = util.promisify(exec);
const {
    parse,
    addDays,
    addYears,
    isWeekend,
    setHours,
    setMinutes,
    setSeconds,
} = require('date-fns');
const chalk = require('chalk');
const ora = require('ora');
const boxen = require('boxen');
const fetch = require('node-fetch');

module.exports = async function ({
    gitlabToken,
    startDate,
    endDate,
    workdaysOnly,
}) {
    const commitDateList = await fetchGitLabActivity(
        gitlabToken,
        startDate,
        endDate,
        workdaysOnly,
    );

    (async function () {
        const spinner = ora(
            'Generating your GitHub activity based on GitLab data\n',
        ).start();

        const historyFolder = 'my-history';

        // Remove git history folder in case if it already exists.
        if (existsSync(`./${historyFolder}`)) {
            await execAsync(
                `${
                    process.platform === 'win32' ? 'rmdir /s /q' : 'rm -rf'
                } ${historyFolder}`,
            );
        }

        // Create git history folder.
        await execAsync(`mkdir ${historyFolder}`);
        process.chdir(historyFolder);
        await execAsync(`git init`);

        // Create commits.
        for (const date of commitDateList) {
            // Change spinner so user can get the progress right now.
            const dateFormatted = new Intl.DateTimeFormat('en', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            }).format(date);
            spinner.text = `Generating your Github activity... (${dateFormatted})\n`;

            await execAsync(`echo "${date}" > foo.txt`);
            await execAsync(`git add .`);
            await execAsync(
                `git commit --quiet --date "${date}" -m "import commit from gitlab"`,
            );
        }

        spinner.succeed();

        console.log(
            boxen(
                `${chalk.green('Success')} ${
                    commitDateList.length
                } commits have been created based on your GitLab activity.`,
                { borderColor: 'yellow', padding: 1, align: 'center' },
            ),
        );
    })();
};

async function fetchGitLabActivity(token, startDate, endDate, workdaysOnly) {
    const apiUrl = 'https://gitlab.com/api/v4/events';
    const start = startDate ? parse(startDate) : addYears(new Date(), -1);
    const end = endDate ? parse(endDate) : new Date();

    let page = 1;
    let allEvents = [];
    let hasMorePages = true;

    while (hasMorePages) {
        const response = await fetch(`${apiUrl}?page=${page}&per_page=100`, {
            headers: { 'PRIVATE-TOKEN': token },
        });
        const events = await response.json();

        if (events.length === 0) {
            hasMorePages = false;
        } else {
            allEvents = allEvents.concat(events);
            page++;
        }
    }

    const commitDates = allEvents
        .filter(
            (event) =>
                event.action_name === 'pushed to' ||
                event.action_name === 'pushed new',
        )
        .map((event) => new Date(event.created_at))
        .filter((date) => date >= start && date <= end);

    if (workdaysOnly) {
        return commitDates.filter((date) => !isWeekend(date));
    }

    return commitDates;
}

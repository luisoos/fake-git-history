const fs = require('fs');

async function createGitLabCalendar(accessToken, startDate) {
    const gitlab = new GitLab();
    const events = await gitlab.fetchAllEvents(accessToken, startDate);

    // Create a map of date => numberOfCommits
    const commitCalendar = {};

    events.forEach((event) => {
        if (
            event.action_name === 'pushed to' ||
            event.action_name === 'pushed new'
        ) {
            const date = event.created_at.split('T')[0]; // Get just the date part
            commitCalendar[date] = (commitCalendar[date] || 0) + 1;
        }
    });

    return commitCalendar;
}

class GitLab {
    async fetchUser(accessToken) {
        const user = await fetch('https://gitlab.com/api/v4/user', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        return user.json();
    }

    async fetchEvents(accessToken, options) {
        let url = `https://gitlab.com/api/v4/events?page=${options.page}&per_page=100&sort=desc`;

        if (options.before) {
            url += `&before=${options.before}`;
        }
        if (options.after) {
            url += `&after=${options.after}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    async fetchAllEvents(
        accessToken,
        startDate = new Date('1970/01/01'),
        endDate = new Date(),
    ) {
        const events = [];
        let page = 1;
        const seenIds = new Set();
        let hasMoreEvents = true;

        // Convert dates to ISO string format
        const startDateISO = new Date(startDate).toISOString();
        const endDateISO = new Date(endDate).toISOString();

        while (hasMoreEvents) {
            try {
                const fetchedEvents = await this.fetchEvents(accessToken, {
                    after: startDateISO,
                    before: endDateISO,
                    page: page,
                });

                if (fetchedEvents.length === 0) {
                    hasMoreEvents = false;
                    break;
                }

                const newEvents = fetchedEvents.filter(
                    (event) =>
                        !seenIds.has(event.id) &&
                        new Date(event.created_at) >= new Date(startDate) &&
                        new Date(event.created_at) <= new Date(endDate),
                );
                newEvents.forEach((event) => seenIds.add(event.id));
                events.push(...newEvents);

                const oldestEventDate = new Date(
                    fetchedEvents[fetchedEvents.length - 1].created_at,
                );
                if (oldestEventDate <= new Date(startDate)) {
                    hasMoreEvents = false;
                }

                page++;

                // await new Promise((resolve) => setTimeout(resolve, 100));
            } catch (error) {
                console.error(error);
                hasMoreEvents = false;
            }
        }
        console.log(events);

        return events;
    }
}

module.exports = { createGitLabCalendar, GitLab };

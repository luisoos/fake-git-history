import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]/options";
import * as fs from 'fs';
import {DebloatedGitLabEvent, GitLabEvent} from "/types/GitLabEvent";

export default async function createGitLabCalendar() {
    const authSession = await getServerSession(authOptions);
    const accessToken = (authSession as { accessToken?: string })?.accessToken;
    const gitlab = new GitLab();
    const user = (await gitlab.fetchUser(accessToken!))
    let before: string = user.created_at;
    const events: GitLabEvent[] = await gitlab.fetchAllEvents(accessToken!, before);
    const debloatedEvents: DebloatedGitLabEvent[] = events.map(({
            id,
            project_id,
            action_name,
            target_id,
            target_iid,
            target_type,
            author_id,
            target_title,
            created_at
        }) => ({
            id,
            project_id,
            action_name,
            target_id,
            target_iid,
            target_type,
            author_id,
            target_title,
            created_at
        })
    );
    // Convert the events array to a JSON string
    const jsonContent = JSON.stringify(events, null, 2);

    // Write the JSON string to a file
    const filename = 'gitlab_events.json';

    try {
        fs.writeFileSync(filename, jsonContent, 'utf8');
        console.log(`Events successfully written to ${filename}`);
    } catch (error) {
        console.error('Error writing events to file:', error);
    }
}

class GitLab {
    public async fetchUser(accessToken: string) {
        const user = await fetch('https://gitlab.com/api/v4/user', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
        });
        return user.json();
    }

    public async fetchEvents(accessToken: string, options: { before: string; page: number }) {
        const url = `https://gitlab.com/api/v4/events?before=${options.before}&page=${options.page}&per_page=100&sort=desc`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
    
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        return response.json();
    }
    
    public async fetchAllEvents(accessToken: string, startDate: string) {
        const events: GitLabEvent[] = [];
        const now = new Date().toISOString();
        let page = 1;
        const seenIds = new Set();
        let hasMoreEvents = true;
    
        while (hasMoreEvents) {
            try {
                const fetchedEvents: GitLabEvent[] = await this.fetchEvents(accessToken, { before: now, page: page });
                
                if (fetchedEvents.length === 0) {
                    hasMoreEvents = false;
                    break;
                }
    
                const newEvents = fetchedEvents.filter(event => !seenIds.has(event.id));
                newEvents.forEach(event => seenIds.add(event.id));
                events.push(...newEvents);
                
                const oldestEventDate = new Date(fetchedEvents[fetchedEvents.length - 1].created_at);
                if (oldestEventDate <= new Date(startDate)) {
                    hasMoreEvents = false;
                }
    
                page++;
    
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                console.error(error);
                hasMoreEvents = false;
            }
        }
    
        return events;
    }
      
}
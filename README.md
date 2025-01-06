# Generate Git Commits

A command-line tool that generates a GitHub (or GitLab) activity graph based off GitLab commits.

> [!NOTE] 
> If you use GitLab at work, this allows you to import the number off commits you make there to your GitHub profile.

<img src="https://dl.dropboxusercontent.com/s/q2iinti6v0zbhzs/contributions.gif?dl=0" style="max-width: 500px" alt="How it works" />

## How To Use

1. Make sure you have [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and
   [Node.js](https://nodejs.org/en/download/) installed on your machine.
2. Create a [Personal Access Token in GitLab](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html) and make sure you give the permission `read_user`.
3. Generate your commits and provide the GitLab PAT:
    ```sh
    npx fake-git-history --gitlabToken="<Your GitLab Personal Access Token>"
    ```
    This command creates a my-history folder, initializes git, and generates commits for every day within the last year (0-3 commits per day).
4. Create [a private repository](https://github.com/new) called `my-history` in your GitHub or GitLab, and push the changes:
    ```sh
    cd my-history
    git remote add origin git@github.com:<USERNAME>/my-history.git
    git push -u origin master
    ```

Done! Now take a look at your GitHub profile 😉

> [!TIP]
> If you encounter the error `fatal: refusing to merge unrelated histories`, checkout your local changes to a new branch and push that.

## Customizations

### `--startDate` and `--endDate`

By default, the script generates GitHub commits for all GitLab commits.
However, if you want to generate activity for specific dates, use these options:

> [!IMPORTANT]
> At the moment, it is crucial to **pass both options**, if you want to define a time range.

```shell script
npx fake-git-history --startDate "2020/09/01" --endDate "2020/09/30"
```

## Annotations

### Backstory

The idea is already a bit older. At first, I wanted to make a web app allowing to import GitLab commits to GitHub - the challenge was to make it without needing a database. 

I actually got far with it (using Next.js), but that dream, to do it without a database was suddenly impossible, because I needed a secure place to store SSH keys (user cant interact with the shell like in this case). 

So, I left the project behind for a few weeks, but I still **wanted to show that I was coding on GitHub - just not committing specifically on GitHub -**, thus I integrated the idea (you can still find the **TypeScript class** that I used for the Next.js approach in `/src/.utils/gitlab.ts`) into this fork of a Git commit history faker. Only thing is: you don't fake it anymore! :)
# Generate Git Commits

A command-line tool that generates a GitHub (or GitLab) activity graph based off GitLab commits.

> [!NOTE] 
> If you use GitLab at work, this allows you to import the number off commits you make there to your GitHub profile.

<img src="https://dl.dropboxusercontent.com/s/q2iinti6v0zbhzs/contributions.gif?dl=0" style="max-width: 500px" alt="How it works" />

## How To Use

1. Make sure you have [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and
   [Node.js](https://nodejs.org/en/download/) installed on your machine.#
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

## Customizations

### `--startDate` and `--endDate`

By default, the script generates GitHub commits for all GitLab commits.
However, if you want to generate activity for specific dates, use these options:

```shell script
npx fake-git-history --startDate "2020/09/01" --endDate "2020/09/30"
```
